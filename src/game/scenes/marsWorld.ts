import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { store } from '../../state/store';
import { audio } from '../audio';
import { makeStarfield, fbm, type Scene } from '../utils';
import { buildMissionEquipment, buildNova, buildPathfinderLander } from '../models/builders';
import { loadAstronaut, type AstronautRig } from '../models/astronaut';
import { getMission, type Mission } from '../../data/missions';
import { SurfacePhysics } from '../physics';
import { UI } from '../../data/content';
import { applyMoonSurfaceTextures, type MoonSurfaceStatus } from '../moonSurface';
import { createRockGeometry, createRockGrainTexture } from '../lunarRocks';

const SITE = new THREE.Vector3(12, 0, -10);
const WORLD = 176;

interface Crater { x: number; z: number; r: number; depth: number; rim: number }

/**
 * Shared crater field. The visible mesh, the physics heightfield and the rock
 * scatter all read the same list, so rims, boulders and collisions agree.
 */
const CRATERS: Crater[] = [
  { x: -32, z: 25, r: 12, depth: 3.4, rim: 1.1 },
  { x: 28, z: 32, r: 9, depth: 2.8, rim: 0.9 },
  { x: -25, z: -42, r: 14, depth: 4.2, rim: 1.35 },
  { x: 48, z: -22, r: 11, depth: 3.2, rim: 1.05 },
  { x: 6, z: -58, r: 6, depth: 1.5, rim: 0.55 },
  { x: -58, z: -6, r: 7, depth: 1.7, rim: 0.6 },
  { x: 58, z: 14, r: 5.5, depth: 1.3, rim: 0.48 },
  { x: -8, z: 52, r: 8, depth: 2.1, rim: 0.72 },
  { x: 20, z: 6, r: 4.5, depth: 1.0, rim: 0.4 },
  { x: -13, z: 1, r: 5.5, depth: 1.2, rim: 0.44 },
];

/** Slightly irregular crater outline so rims are not perfect circles. */
const craterRadius = (crater: Crater, angle: number) =>
  crater.r * (1 + 0.07 * Math.sin(angle * 3 + crater.x * 0.1) + 0.04 * Math.sin(angle * 5 + crater.z * 0.2));

/** Distance from a point to the start-to-mission walking corridor. */
function corridorDistance(x: number, z: number): number {
  const ax = 0, az = 12, bx = SITE.x, bz = SITE.z;
  const dx = bx - ax, dz = bz - az;
  const t = THREE.MathUtils.clamp(((x - ax) * dx + (z - az) * dz) / (dx * dx + dz * dz), 0, 1);
  return Math.hypot(x - (ax + dx * t), z - (az + dz * t));
}

type MoonSurfaceDebugWindow = Window & { __moonSurfaceDebug?: () => MoonSurfaceStatus };

/** Shared surface exploration scene. Pathfinder retains its original lander + Sojourner encounter. */
export class MarsWorldScene implements Scene {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera: THREE.PerspectiveCamera;
  private mission: Mission;
  private player: AstronautRig;
  private physics: SurfacePhysics;
  private nova = buildNova();
  private equipment: THREE.Group;
  private target = new THREE.Vector3();
  private sun: THREE.DirectionalLight;
  private stars: THREE.Points;
  private keys = new Set<string>();
  private joy = { x: 0, y: 0 };
  private camYaw = 0.45;
  private camPitch = 0.28;
  private camDist = 6.5;
  private dragging = false;
  private lastPointer = { x: 0, y: 0 };
  private meeting = false;
  private nearSiteSaid = false;
  private disposers: (() => void)[] = [];
  private timers: ReturnType<typeof setTimeout>[] = [];
  private idleTime = 0;
  private hintSaid = false;
  private discoverTime = 0;
  private currentSpeed = 0;
  private moonSurface?: { dispose: () => void; status: () => MoonSurfaceStatus };
  private rockColliders: { x: number; z: number; radius: number }[] = [];

  constructor(renderer: THREE.WebGLRenderer) {
    this.renderer = renderer;
    this.mission = getMission(store.get().activeMission);
    const quality = store.get().graphics;
    this.camera = new THREE.PerspectiveCamera(55, innerWidth / innerHeight, 0.1, 900);
    const moon = this.mission.destination === 'moon';
    this.scene.background = new THREE.Color(moon ? 0x030508 : 0x160906);
    this.scene.fog = new THREE.Fog(moon ? 0x101217 : this.mission.id === 'phoenix' ? 0x6b4b3d : 0x32170e, 45, 180);
    const pmrem = new THREE.PMREMGenerator(renderer);
    const reflectionRoom = new RoomEnvironment();
    const environment = pmrem.fromScene(reflectionRoom, 0.04).texture;
    this.scene.environment = environment;
    this.scene.environmentIntensity = 0.55;
    reflectionRoom.dispose();
    pmrem.dispose();
    this.disposers.push(() => environment.dispose());
    this.stars = makeStarfield(quality === 'low' ? 700 : quality === 'high' ? 2400 : 1400, 420);
    this.scene.add(this.stars);

    this.sun = new THREE.DirectionalLight(moon ? 0xf4f7ff : 0xffcfaa, quality === 'low' ? (moon ? 2.3 : 2.2) : 3.0);
    this.sun.position.set(35, 45, -25);
    this.sun.castShadow = quality !== 'low';
    const shadowSize = quality === 'high' ? 2048 : 1024;
    this.sun.shadow.mapSize.set(shadowSize, shadowSize);
    Object.assign(this.sun.shadow.camera, { near: 1, far: 150, left: -32, right: 32, top: 32, bottom: -32 });
    this.sun.shadow.bias = -0.00035;
    if (moon) this.sun.shadow.normalBias = 0.025;
    this.scene.add(this.sun, this.sun.target);
    this.scene.add(new THREE.HemisphereLight(moon ? 0x7e96bc : 0xb68265, moon ? 0x16191d : 0x2b120c, moon ? 0.54 : 0.8));

    this.buildTerrain(quality);
    this.buildRocks(quality);

    const siteY = this.groundHeight(SITE.x, SITE.z);
    if (this.mission.id === 'pathfinder') {
      const lander = buildPathfinderLander();
      lander.position.set(SITE.x, siteY, SITE.z);
      lander.rotation.y = 0.7;
      this.scene.add(lander);
      this.equipment = buildMissionEquipment('pathfinder');
      this.target.set(SITE.x + 2.5, siteY, SITE.z + 1.8);
    } else {
      this.equipment = buildMissionEquipment(this.mission.model, this.mission.id);
      this.target.set(SITE.x, siteY, SITE.z);
    }
    this.equipment.position.copy(this.target);
    this.equipment.rotation.y = this.mission.id === 'spirit' ? -0.5 : 0.35;
    this.scene.add(this.equipment);
    this.buildBeacon(this.target);

    this.player = loadAstronaut((modelStatus) => store.set({ modelStatus }));
    const start = new THREE.Vector3(0, 0, 12);
    this.physics = new SurfacePhysics(this.mission.destination, (x, z) => this.groundHeight(x, z), this.scene, this.target, start);
    this.physics.addStaticRocks(this.rockColliders);
    this.physics.syncPlayer(this.player.group);
    this.scene.add(this.player.group);
    this.nova.group.position.copy(this.player.group.position).add(new THREE.Vector3(1.4, 2.4, 1));
    this.scene.add(this.nova.group);

    if (moon) {
      const earth = new THREE.Mesh(new THREE.SphereGeometry(3, 24, 16), new THREE.MeshStandardMaterial({ color: 0x5b83b8, emissive: 0x132c4d, emissiveIntensity: 0.4 }));
      earth.position.set(-75, 65, -170);
      this.scene.add(earth);
    }

    audio.play(moon ? 'space' : 'mars');
    store.set({ hint: UI.moveHint, objective: this.mission.objective });
    this.disposers.push(store.on('joystick', (d) => { this.joy = d as { x: number; y: number }; }));
    this.timers.push(setTimeout(() => {
      if (store.get().storyDone) {
        store.say([
          { speaker: 'nova', en: 'The mission record is complete. Follow the beacon to the hardware when you are ready.', bn: 'মিশনের নথি সম্পন্ন। প্রস্তুত হলে বিকন অনুসরণ করে যন্ত্রপাতির কাছে যান।' },
          { speaker: 'nova', en: 'I will explain what you discover, then you can inspect each component.', bn: 'আবিষ্কারের তথ্য আমি বলব, তারপর প্রতিটি অংশ পরিদর্শন করতে পারবেন।' },
        ]);
      } else {
        store.say([
          { speaker: 'nova', en: `${this.mission.shortName}. ${this.mission.location.en}.`, bn: `${this.mission.name.bn}। ${this.mission.location.bn}।` },
          { speaker: 'nova', en: 'Follow the beacon. I will explain what you discover, then you can inspect the hardware.', bn: 'বিকন অনুসরণ করুন। আবিষ্কারের তথ্য আমি বলব, তারপর যন্ত্রপাতি পরিদর্শন করতে পারবেন।' },
        ]);
      }
    }, 650));

    (window as any).__missionDebug = () => ({
      id: this.mission.id, gravity: this.mission.destination === 'moon' ? 1.62 : 3.71,
      player: [this.physics.player.position.x, this.physics.player.position.y, this.physics.player.position.z],
      target: this.target.toArray(), meeting: this.meeting, bodies: this.physics.world.bodies.length,
      model: store.get().modelStatus,
    });
    (window as any).__missionTeleport = (x: number, z: number) => this.physics.teleport(x, z);
  }

  private groundHeight(x: number, z: number): number {
    const seed = [...this.mission.id].reduce((a, c) => a + c.charCodeAt(0), 0) * 0.01;
    const moon = this.mission.destination === 'moon';
    let h = fbm(x * 0.018 + seed, z * 0.018 + seed, 4) * 4.4 - 2.2;
    if (moon) {
    // A second, shorter-wavelength undulation keeps the mare from looking
    // perfectly smooth between the larger craters.
    h += fbm(x * 0.11 - seed * 0.7, z * 0.11 + seed * 0.4, 3) * 0.9 - 0.45;
    for (const crater of CRATERS) {
      const dx = x - crater.x, dz = z - crater.z;
      const d = Math.hypot(dx, dz);
      if (d > crater.r * 1.7) continue;
      const radius = craterRadius(crater, Math.atan2(dz, dx));
      if (d < radius) {
        const k = d / radius;
        h -= crater.depth * Math.pow(1 - k * k, 2);
      }
      const rim = (d - radius) / (radius * 0.24);
      h += crater.rim * Math.exp(-rim * rim);
      if (d > radius) {
        const ejecta = (d - radius) / (radius * 0.7);
        h += crater.rim * 0.12 * Math.exp(-ejecta * ejecta);
      }
    }
    }
    else {
      const craters: [number, number, number][] = [[-32, 25, 12], [28, 32, 9], [-25, -42, 14], [48, -22, 11]];
      for (const [cx, cz, r] of craters) {
        const d = Math.hypot(x - cx, z - cz);
        if (d < r) h -= Math.cos(d / r * Math.PI * 0.5) * r * 0.11;
        else if (d < r * 1.25) h += (1 - (d - r) / (r * 0.25)) * r * 0.045;
      }
    }
    for (const [fx, fz, fr] of [[SITE.x, SITE.z, 10], [0, 12, 8]] as const) {
      const d = Math.hypot(x - fx, z - fz);
      if (d < fr) h *= THREE.MathUtils.smoothstep(d, 0, fr);
    }
    return h;
  }

  private buildTerrain(quality: string) {
    const moon = this.mission.destination === 'moon';
    const segments = moon ? (quality === 'low' ? 44 : quality === 'high' ? 112 : 80) : (quality === 'low' ? 40 : quality === 'high' ? 96 : 64);
    const geo = new THREE.PlaneGeometry(WORLD, WORLD, segments, segments);
    geo.rotateX(-Math.PI / 2);
    const pos = geo.attributes.position;
    const colors = new Float32Array(pos.count * 3);
    // The Poly Haven regolith map supplies the surface colour. A cool, neutral
    // vertex tint cancels the map's warm bias so the mare reads lunar gray
    // rather than beige; the tint also carries low-frequency mottling.
    const base = new THREE.Color(moon ? 0xccd6e8 : this.mission.id === 'phoenix' ? 0x9c7864 : 0x824127);
    const light = new THREE.Color(moon ? 0xe9eff9 : this.mission.id === 'opportunity' ? 0xb07a54 : 0xb56d46);
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i), z = pos.getZ(i), y = this.groundHeight(x, z);
      pos.setY(i, y);
      let c: THREE.Color;
      if (moon) {
        const macro = fbm(x * 0.065, z * 0.065);
        const fine = fbm(x * 0.21 + 4.7, z * 0.21 - 3.1);
        c = base.clone().lerp(light, THREE.MathUtils.clamp(macro * 0.78 + fine * 0.22, 0, 1));
        c.multiplyScalar(0.86 + THREE.MathUtils.clamp((y + 4) / 20, 0, 0.18));
      } else {
        c = base.clone().lerp(light, fbm(x * 0.065, z * 0.065));
        c.multiplyScalar(0.82 + THREE.MathUtils.clamp((y + 3) / 15, 0, 0.25));
      }
      colors[i * 3] = c.r; colors[i * 3 + 1] = c.g; colors[i * 3 + 2] = c.b;
    }
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geo.computeVertexNormals();
    const material = new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: 1,
      metalness: 0,
      dithering: true,
    });
    if (moon) {
      material.envMapIntensity = 0.35;
      this.moonSurface = applyMoonSurfaceTextures(material, this.renderer, quality);
      (window as MoonSurfaceDebugWindow).__moonSurfaceDebug = this.moonSurface.status;
    }
    const terrain = new THREE.Mesh(geo, material);
    terrain.receiveShadow = true;
    this.scene.add(terrain);
  }

  private buildRocks(quality: string) {
    if (this.mission.destination !== 'moon') {
      const count = quality === 'low' ? 65 : quality === 'high' ? 180 : 115;
      const geo = new THREE.DodecahedronGeometry(1, 0);
      const mat = new THREE.MeshStandardMaterial({ color: 0x75432e, roughness: 0.95 });
      const rocks = new THREE.InstancedMesh(geo, mat, count);
      const dummy = new THREE.Object3D();
      let seed = 13;
      const random = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
      for (let i = 0; i < count; i++) {
        const x = (random() - 0.5) * (WORLD - 12), z = (random() - 0.5) * (WORLD - 12);
        const s = 0.12 + Math.pow(random(), 2.5) * 1.5;
        dummy.position.set(x, this.groundHeight(x, z) + s * 0.22, z);
        dummy.rotation.set(random() * 3, random() * 3, random() * 3);
        dummy.scale.set(s, s * 0.65, s * 1.1); dummy.updateMatrix(); rocks.setMatrixAt(i, dummy.matrix);
      }
      rocks.castShadow = quality === 'high'; rocks.receiveShadow = true;
      this.scene.add(rocks);
      return;
    }
    this.buildMoonRocks(quality);
  }

  /**
   * Moon scatter: three instanced size classes, faceted irregular geometry and
   * per-instance gray variation. A share of each class clusters on crater rims;
   * the rest is scattered, with exclusion zones around the spawn, the mission
   * hardware and the walking corridor so gameplay is not blocked.
   */
  private buildMoonRocks(quality: string) {
    const grain = createRockGrainTexture();
    const bump = grain.clone();
    bump.colorSpace = THREE.NoColorSpace;
    bump.needsUpdate = true;
    const material = new THREE.MeshStandardMaterial({
      map: grain,
      bumpMap: bump,
      bumpScale: 0.02,
      color: 0xffffff,
      roughness: 0.97,
      metalness: 0.02,
      flatShading: true,
      envMapIntensity: 0.35,
      dithering: true,
    });

    let seed = 271;
    const random = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
    const blocked = (x: number, z: number, s: number) => {
      if (Math.hypot(x, z - 12) < 5.5 + s) return true;
      if (Math.hypot(x - SITE.x, z - SITE.z) < 8.5 + s) return true;
      if (s > 0.5 && corridorDistance(x, z) < 3.2 + s) return true;
      return false;
    };

    const buildSet = (
      count: number,
      geometry: THREE.BufferGeometry,
      minScale: number,
      maxScale: number,
      yMin: number,
      yMax: number,
      rimFraction: number,
      castShadow: boolean,
      colliderMin: number,
    ) => {
      const mesh = new THREE.InstancedMesh(geometry, material, count);
      const dummy = new THREE.Object3D();
      const tone = new THREE.Color();
      let placed = 0, tries = 0;
      while (placed < count && tries < count * 40) {
        tries++;
        let x: number, z: number;
        if (random() < rimFraction) {
          const crater = CRATERS[Math.floor(random() * CRATERS.length)];
          const angle = random() * Math.PI * 2;
          // Some boulders sit just inside the rim, some on the crest, some on
          // the ejecta blanket outside it, so the rim does not read as a ring.
          const radius = craterRadius(crater, angle) * (0.9 + Math.pow(random(), 1.4) * 0.42);
          x = crater.x + Math.cos(angle) * radius;
          z = crater.z + Math.sin(angle) * radius;
        } else {
          x = (random() - 0.5) * (WORLD - 14);
          z = (random() - 0.5) * (WORLD - 14);
        }
        const s = minScale + Math.pow(random(), 1.8) * (maxScale - minScale);
        if (blocked(x, z, s)) continue;
        const y = this.groundHeight(x, z) + s * 0.14;
        dummy.position.set(x, y, z);
        dummy.rotation.set(random() * Math.PI, random() * Math.PI * 2, random() * Math.PI);
        dummy.scale.set(
          s * (0.85 + random() * 0.3),
          s * (yMin + random() * (yMax - yMin)),
          s * (0.85 + random() * 0.3),
        );
        dummy.updateMatrix();
        mesh.setMatrixAt(placed, dummy.matrix);
        tone.setScalar(0.16 + random() * 0.12);
        mesh.setColorAt(placed, tone);
        if (s >= colliderMin) this.rockColliders.push({ x, z, radius: s * 0.78 });
        placed++;
      }
      mesh.count = placed;
      mesh.instanceMatrix.needsUpdate = true;
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
      mesh.castShadow = castShadow;
      mesh.receiveShadow = true;
      mesh.computeBoundingSphere();
      this.scene.add(mesh);
      return mesh;
    };

    const boulders = quality === 'low' ? 10 : quality === 'high' ? 34 : 22;
    const rocks = quality === 'low' ? 45 : quality === 'high' ? 130 : 85;
    const pebbles = quality === 'low' ? 70 : quality === 'high' ? 190 : 120;

    buildSet(boulders, createRockGeometry(1, 1, 3.7, 0.2), 1.2, 2.6, 0.55, 0.8, 0.55, quality !== 'low', 0);
    buildSet(rocks, createRockGeometry(1, 0, 9.1, 0.26), 0.35, 1.05, 0.5, 0.75, 0.3, quality !== 'low', 0.85);
    buildSet(pebbles, createRockGeometry(1, 0, 17.3, 0.3), 0.08, 0.26, 0.45, 0.7, 0.15, false, Number.POSITIVE_INFINITY);
  }

  private buildBeacon(position: THREE.Vector3) {
    const g = new THREE.Group(); g.name = 'missionBeacon';
    const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.45, 22, 10, 1, true), new THREE.MeshBasicMaterial({ color: this.mission.accent, transparent: true, opacity: 0.16, side: THREE.DoubleSide, depthWrite: false }));
    beam.position.y = 11; g.add(beam);
    const ring = new THREE.Mesh(new THREE.RingGeometry(1.5, 1.72, 40), new THREE.MeshBasicMaterial({ color: this.mission.accent, transparent: true, opacity: 0.65, side: THREE.DoubleSide }));
    ring.rotation.x = -Math.PI / 2; ring.position.y = 0.12; g.add(ring);
    g.position.copy(position); this.scene.add(g);
  }

  private startMeeting(skipCamera = false) {
    if (this.meeting) return;
    this.meeting = true; this.discoverTime = 2;
    store.set({ objective: null, hint: null });
    store.say([
      { speaker: 'nova', en: `You found ${this.mission.shortName}. Its story is part of the history of exploration.`, bn: `আপনি ${this.mission.name.bn} খুঁজে পেয়েছেন। এর গল্প মহাকাশ অন্বেষণের ইতিহাসের অংশ।` },
      { speaker: 'nova', en: 'Discover the mission record, then inspect each highlighted component.', bn: 'মিশনের ইতিহাস জানুন, তারপর চিহ্নিত প্রতিটি অংশ পরিদর্শন করুন।' },
    ], [store.get().storyDone
      ? { en: UI.inspectBtn.en, bn: UI.inspectBtn.bn, action: 'openInspect' }
      : { en: UI.hearStory.en, bn: UI.hearStory.bn, action: 'hearStory' }]);
    if (!skipCamera) this.camDist = 5;
  }

  onPointerDown(x: number, y: number) { this.dragging = true; this.lastPointer = { x, y }; }
  onPointerMove(x: number, y: number) {
    if (!this.dragging) return;
    this.camYaw -= (x - this.lastPointer.x) * 2.4;
    this.camPitch = THREE.MathUtils.clamp(this.camPitch + (y - this.lastPointer.y) * 1.6, 0.05, 1.1);
    this.lastPointer = { x, y };
  }
  onPointerUp() { this.dragging = false; }
  onWheel(d: number) { this.camDist = THREE.MathUtils.clamp(this.camDist + d * 0.01, 3.5, 12); }
  onKey(code: string, down: boolean) { if (down) this.keys.add(code); else this.keys.delete(code); }
  resize(w: number, h: number) { this.camera.aspect = w / h; this.camera.updateProjectionMatrix(); }

  update(dt: number, t: number) {
    const input = new THREE.Vector2(
      (this.keys.has('KeyD') || this.keys.has('ArrowRight') ? 1 : 0) - (this.keys.has('KeyA') || this.keys.has('ArrowLeft') ? 1 : 0) + this.joy.x,
      (this.keys.has('KeyW') || this.keys.has('ArrowUp') ? 1 : 0) - (this.keys.has('KeyS') || this.keys.has('ArrowDown') ? 1 : 0) + this.joy.y,
    );
    const moving = !this.meeting && input.lengthSq() > 0.001;
    const direction = new THREE.Vector3();
    if (moving) {
      input.normalize();
      const sin = Math.sin(this.camYaw), cos = Math.cos(this.camYaw);
      direction.set(input.x * cos - input.y * sin, 0, -input.y * cos - input.x * sin).normalize();
      this.player.group.rotation.y = THREE.MathUtils.lerp(this.player.group.rotation.y, Math.atan2(direction.x, direction.z), Math.min(dt * 10, 1));
      this.idleTime = 0;
    } else this.idleTime += dt;
    const running = this.keys.has('ShiftLeft') || this.keys.has('ShiftRight');
    this.currentSpeed = THREE.MathUtils.lerp(this.currentSpeed, moving ? (running ? 5.4 : 3.1) : 0, Math.min(dt * 9, 1));
    this.physics.move(direction, this.currentSpeed);
    this.physics.step(dt);
    this.physics.syncPlayer(this.player.group);
    this.discoverTime = Math.max(0, this.discoverTime - dt);
    this.player.update(dt, t, this.currentSpeed, this.discoverTime > 0 ? 'discover' : this.meeting ? 'inspect' : undefined);

    if (this.idleTime > 24 && !this.hintSaid && !this.meeting) {
      this.hintSaid = true;
      store.say([{ speaker: 'nova', en: 'Hint: the vertical beacon marks the mission equipment. Hold Shift to run.', bn: 'ইঙ্গিত: উল্লম্ব বিকনটি মিশনের যন্ত্র চিহ্নিত করে। দৌড়াতে Shift ধরুন।' }]);
    }
    const novaTarget = this.player.group.position.clone().add(new THREE.Vector3(Math.sin(t * 0.4) * 1.5, 2.3 + Math.sin(t * 1.5) * 0.18, Math.cos(t * 0.4) * 1.5));
    this.nova.group.position.lerp(novaTarget, dt * 2.2);
    this.nova.group.lookAt(this.meeting ? this.target : this.player.group.position);
    const beacon = this.scene.getObjectByName('missionBeacon');
    if (beacon?.children[1]) {
      const k = 1 + Math.sin(t * 2.4) * 0.2; beacon.children[1].scale.set(k, k, k);
    }
    const playerPos = this.player.group.position;
    const distance = playerPos.distanceTo(this.target);
    if (!this.meeting && !this.nearSiteSaid && distance < 20) {
      this.nearSiteSaid = true;
      store.say([{ speaker: 'nova', en: `${this.mission.shortName} is close. Move carefully around the equipment.`, bn: `${this.mission.name.bn} কাছেই। যন্ত্রপাতির চারপাশে সাবধানে চলুন।` }]);
    }
    if (!this.meeting && distance < 4.3) this.startMeeting();

    const target = playerPos.clone().add(new THREE.Vector3(0, 1.25, 0));
    const offset = new THREE.Vector3(Math.sin(this.camYaw) * Math.cos(this.camPitch), Math.sin(this.camPitch), Math.cos(this.camYaw) * Math.cos(this.camPitch)).multiplyScalar(this.camDist);
    const camPos = target.clone().add(offset);
    camPos.y = Math.max(camPos.y, this.groundHeight(camPos.x, camPos.z) + 0.65);
    this.camera.position.lerp(camPos, Math.min(dt * 5, 1)); this.camera.lookAt(target);
    this.sun.position.set(playerPos.x + 35, 45, playerPos.z - 25); this.sun.target.position.copy(playerPos);
    this.stars.rotation.y += dt * 0.002;
    this.renderer.render(this.scene, this.camera);
  }

  dispose() {
    this.timers.forEach(clearTimeout);
    this.disposers.forEach((d) => d());
    this.player.dispose(); this.physics.dispose();
    this.moonSurface?.dispose();
    this.moonSurface = undefined;
    store.set({ objective: null, hint: null });
    delete (window as any).__missionDebug; delete (window as any).__missionTeleport;
    delete (window as MoonSurfaceDebugWindow).__moonSurfaceDebug;
    const textures = new Set<THREE.Texture>();
    this.scene.traverse((o) => {
      const m = o as THREE.Mesh;
      m.geometry?.dispose();
      const mats = Array.isArray(m.material) ? m.material : m.material ? [m.material] : [];
      mats.forEach((mat) => { Object.values(mat).forEach((v) => { if (v instanceof THREE.Texture) textures.add(v); }); mat.dispose(); });
    });
    textures.forEach((tex) => tex.dispose());
  }
}
