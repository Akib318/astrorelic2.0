import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { store } from '../../state/store';
import { audio } from '../audio';
import { makeStarfield, makeGlowTexture, makeCanvasTexture, makeTextSprite, type Scene } from '../utils';
import { buildNova } from '../models/builders';
import {
  NOVA_INTRO,
  NOVA_AFTER_MOVE,
  NOVA_AFTER_ROTATE,
  NOVA_POINT_MARS,
  NOVA_TWO_WORLDS,
} from '../../data/content';

interface Planet {
  name: string;
  mesh: THREE.Mesh;
  orbitRadius: number;
  speed: number;
  angle: number;
  label: THREE.Sprite;
  group: THREE.Group;
}

type TutStep = 'move' | 'rotate' | 'zoom' | 'mars' | 'done';

interface MoonGlobalStatus {
  file: string;
  loaded: boolean;
  width: number;
  height: number;
  colorSpace: string;
  flipY: boolean;
  mapAssigned: boolean;
  anisotropy: number;
  error: string | null;
}

type MoonGlobalDebugWindow = Window & { __moonGlobalDebug?: () => MoonGlobalStatus };

const MOON_GLOBAL_TEXTURE_URL = '/textures/moon-global/moon_global_2k.jpg';

export class SolarScene implements Scene {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera: THREE.PerspectiveCamera;
  private controls: OrbitControls;
  private raycaster = new THREE.Raycaster();
  private planets: Planet[] = [];
  private marsHighlight: THREE.Mesh | null = null;
  private stars = makeStarfield(4500, 800);
  private nova = buildNova();
  private step: TutStep = store.get().tutorialDone ? 'done' : 'move';
  private isMap = false;
  private moved = false;
  private rotated = false;
  private zoomed = false;
  private timers: ReturnType<typeof setTimeout>[] = [];
  private skipDisposer: () => void = () => {};
  private moonTexture: THREE.Texture | null = null;
  private moonTextureLoaded = false;
  private moonTextureError: string | null = null;

  constructor(renderer: THREE.WebGLRenderer, isMap = false) {
    this.renderer = renderer;
    if (isMap) {
      this.step = 'done';
      this.isMap = true;
    }
    this.camera = new THREE.PerspectiveCamera(50, innerWidth / innerHeight, 0.1, 3000);
    this.camera.position.set(0, 26, 52);

    this.scene.background = new THREE.Color(0x030308);
    this.scene.add(this.stars);

    // Sun
    const sun = new THREE.Mesh(
      new THREE.SphereGeometry(5, 48, 32),
      new THREE.MeshBasicMaterial({ color: 0xffd9a0 })
    );
    this.scene.add(sun);
    const sunGlow = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: makeGlowTexture('rgba(255,214,150,0.9)', 'rgba(255,140,60,0)'),
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      })
    );
    sunGlow.scale.set(14, 14, 1);
    this.scene.add(sunGlow);
    const sunLight = new THREE.PointLight(0xffe8c8, 2.2, 0, 0);
    sunLight.position.set(0, 0, 0);
    this.scene.add(sunLight);
    this.scene.add(new THREE.AmbientLight(0x5a6478, 1.1));

    // planets: name, radius, orbit, color, speed
    const defs: [string, number, number, number, number][] = [
      ['Mercury', 0.5, 9.5, 0x9a8f85, 0.55],
      ['Venus', 0.9, 13.5, 0xd8b88a, 0.42],
      ['Earth', 1.0, 17.5, 0x3f7ab8, 0.34],
      ['Mars', 0.72, 22.5, 0xc1543a, 0.28],
      ['Jupiter', 2.5, 30.5, 0xd8a878, 0.18],
      ['Saturn', 2.1, 38.5, 0xd8c298, 0.14],
      ['Uranus', 1.5, 46, 0x9ad0d8, 0.1],
      ['Neptune', 1.45, 52.5, 0x5a7ad8, 0.08],
    ];

    defs.forEach(([name, radius, orbit, color, speed], i) => {
      const group = new THREE.Group();
      // orbit ring
      const ringGeo = new THREE.RingGeometry(orbit - 0.03, orbit + 0.03, 128);
      const ring = new THREE.Mesh(
        ringGeo,
        new THREE.MeshBasicMaterial({ color: 0x4a4a58, side: THREE.DoubleSide, transparent: true, opacity: 0.35 })
      );
      ring.rotation.x = Math.PI / 2;
      group.add(ring);

      const tex = makeCanvasTexture(256, (ctx, s) => {
        ctx.fillStyle = `#${color.toString(16).padStart(6, '0')}`;
        ctx.fillRect(0, 0, s, s);
        // banding / surface variation
        for (let b = 0; b < 24; b++) {
          ctx.fillStyle = `rgba(0,0,0,${0.05 + Math.random() * 0.08})`;
          const y = Math.random() * s;
          ctx.fillRect(0, y, s, 2 + Math.random() * 10);
        }
        if (name === 'Mars') {
          ctx.fillStyle = 'rgba(255,240,225,0.9)';
          ctx.fillRect(0, 0, s, 14);
          ctx.fillRect(0, s - 14, s, 14);
        }
      });
      const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(radius, 32, 24),
        new THREE.MeshStandardMaterial({ map: tex, roughness: 0.9 })
      );
      mesh.name = name;
      const angle = (i / defs.length) * Math.PI * 2 + 0.6;
      mesh.position.set(Math.cos(angle) * orbit, 0, Math.sin(angle) * orbit);
      group.add(mesh);

      const label = makeTextSprite(name.toUpperCase(), { size: 0.7, color: '#cfc9ba' });
      label.position.copy(mesh.position).add(new THREE.Vector3(0, radius + 1.1, 0));
      group.add(label);

      this.scene.add(group);
      this.planets.push({ name, mesh, orbitRadius: orbit, speed, angle, label, group });
    });

    // Earth's moon — NASA LROC global colour map (converted locally from the
    // 16-bit sRGB TIFF to an 8-bit sRGB JPEG; keep the walkable terrain's
    // regolith maps out of this sphere). The moon-global folder stays separate
    // from /textures/moon, which the terrain uses.
    const earth = this.planets.find((p) => p.name === 'Earth')!;
    const moonTexture = new THREE.TextureLoader().load(
      MOON_GLOBAL_TEXTURE_URL,
      () => { this.moonTextureLoaded = true; },
      undefined,
      (err: unknown) => { this.moonTextureError = err instanceof Error ? err.message : String(err); }
    );
    moonTexture.colorSpace = THREE.SRGBColorSpace; // source is sRGB IEC61966-2.1
    moonTexture.anisotropy = Math.min(8, this.renderer.capabilities.getMaxAnisotropy());
    this.moonTexture = moonTexture;

    const moon = new THREE.Mesh(
      new THREE.SphereGeometry(0.28, 20, 16),
      new THREE.MeshStandardMaterial({ map: moonTexture, roughness: 1 })
    );
    moon.name = 'Moon';
    earth.mesh.add(moon);
    moon.position.set(2.2, 0, 0);
    const moonLabel = makeTextSprite('MOON', { size: 0.5, color: '#cfc9ba' });
    moonLabel.position.set(2.2, 0.9, 0);
    earth.mesh.add(moonLabel);

    (window as MoonGlobalDebugWindow).__moonGlobalDebug = () => {
      const image = this.moonTexture?.image as { width?: number; height?: number } | undefined;
      const moonMesh = earth.mesh.children.find((c) => c.name === 'Moon') as THREE.Mesh | undefined;
      const mat = moonMesh?.material as THREE.MeshStandardMaterial | undefined;
      return {
        file: MOON_GLOBAL_TEXTURE_URL,
        loaded: this.moonTextureLoaded,
        width: image?.width ?? 0,
        height: image?.height ?? 0,
        colorSpace: this.moonTexture ? String(this.moonTexture.colorSpace) : '',
        flipY: this.moonTexture ? this.moonTexture.flipY : false,
        mapAssigned: !!mat?.map,
        anisotropy: this.moonTexture?.anisotropy ?? 0,
        error: this.moonTextureError,
      };
    };

    // Saturn ring (proper)
    const saturn = this.planets.find((p) => p.name === 'Saturn')!;
    const saturnRing = new THREE.Mesh(
      new THREE.RingGeometry(3.1, 4.6, 64),
      new THREE.MeshBasicMaterial({ color: 0xcbb58e, side: THREE.DoubleSide, transparent: true, opacity: 0.6 })
    );
    saturnRing.rotation.x = Math.PI / 2.3;
    saturn.mesh.add(saturnRing);

    // Mars highlight ring (tutorial)
    const mars = this.planets.find((p) => p.name === 'Mars')!;
    this.marsHighlight = new THREE.Mesh(
      new THREE.RingGeometry(1.2, 1.45, 48),
      new THREE.MeshBasicMaterial({ color: 0xffd97d, side: THREE.DoubleSide, transparent: true, opacity: 0 })
    );
    this.marsHighlight.rotation.x = Math.PI / 2;
    mars.mesh.add(this.marsHighlight);

    // Nova floating near camera start
    this.nova.group.position.set(6, 4, 10);
    this.scene.add(this.nova.group);

    this.controls = new OrbitControls(this.camera, renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.06;
    this.controls.minDistance = 12;
    this.controls.maxDistance = 140;
    this.controls.enablePan = false;
    this.controls.maxPolarAngle = Math.PI / 1.9;

    audio.play('space');
    if (this.step === 'move') {
      this.later(() => {
        if (!this.moved) store.say(NOVA_INTRO);
      }, 700);
    }
    this.skipDisposer = store.on('skipTutorial', () => {
      if (this.step === 'done') return;
      this.step = 'done';
      store.set({ tutorialDone: true, showChoice: true });
      store.say(NOVA_TWO_WORLDS);
    });
  }

  private later(fn: () => void, ms: number) {
    this.timers.push(setTimeout(fn, ms));
  }

  // Any interaction advances the current tutorial step — no dead ends on touch.
  private progress() {
    if (this.step === 'move' && !this.moved) {
      this.moved = true;
      this.later(() => {
        store.say(NOVA_AFTER_MOVE);
        this.step = 'rotate';
      }, 400);
    } else if (this.step === 'rotate' && !this.rotated) {
      this.rotated = true;
      this.later(() => {
        store.say(NOVA_AFTER_ROTATE);
        this.step = 'zoom';
      }, 500);
    } else if (this.step === 'zoom' && !this.zoomed) {
      this.zoomed = true;
      this.later(() => {
        store.say(NOVA_POINT_MARS);
        this.step = 'mars';
      }, 500);
    }
  }

  onPointerMove(_x: number, _y: number, isDown: boolean) {
    if (isDown) this.progress(); // drag = rotate
    else this.progress(); // mouse move
  }

  onPointerDown() {
    // drag handled via pointermove
  }

  onWheel() {
    this.progress();
  }

  onClick(x: number, y: number) {
    if (this.isMap) return;
    if (this.step !== 'mars' && this.step !== 'done') {
      this.progress();
      return;
    }
    this.raycaster.setFromCamera(new THREE.Vector2(x, y), this.camera);
    const hits = this.raycaster.intersectObjects(
      [...this.planets.map((p) => p.mesh), ...this.planets.find((p) => p.name === 'Earth')!.mesh.children.filter((c) => (c as THREE.Mesh).type === 'Mesh')],
      true
    );
    if (hits.length === 0) return;
    let obj: THREE.Object3D | null = hits[0].object;
    let name = '';
    while (obj) {
      if (obj.name) {
        name = obj.name;
        break;
      }
      obj = obj.parent;
    }
    if (!name) return;

    if (this.step === 'mars') {
      if (name === 'Mars' || name === 'Moon') {
        this.step = 'done';
        store.set({ tutorialDone: true });
        store.say(NOVA_TWO_WORLDS);
        this.later(() => store.set({ showChoice: true }), 800);
      }
      return;
    }
    if (this.step === 'done' && (name === 'Mars' || name === 'Moon')) {
      store.say(NOVA_TWO_WORLDS);
      this.later(() => store.set({ showChoice: true }), 500);
    }
  }

  resize(w: number, h: number) {
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  }

  update(dt: number, t: number) {
    this.planets.forEach((p) => {
      p.angle += dt * p.speed * 0.12;
      p.mesh.position.set(Math.cos(p.angle) * p.orbitRadius, 0, Math.sin(p.angle) * p.orbitRadius);
      p.mesh.rotation.y += dt * 0.2;
      p.label.position.copy(p.mesh.position).add(new THREE.Vector3(0, 1.8, 0));
    });

    // moon orbits earth
    const earth = this.planets.find((p) => p.name === 'Earth')!;
    const moon = earth.mesh.children.find((c) => c.name === 'Moon');
    if (moon) {
      moon.position.set(Math.cos(t * 0.9) * 2.2, 0, Math.sin(t * 0.9) * 2.2);
    }

    if (this.marsHighlight) {
      const mat = this.marsHighlight.material as THREE.MeshBasicMaterial;
      mat.opacity = this.step === 'mars' ? 0.35 + Math.sin(t * 3) * 0.25 : Math.max(0, mat.opacity - dt);
    }

    this.nova.group.position.y = 4 + Math.sin(t * 1.3) * 0.3;
    this.stars.rotation.y += dt * 0.003;

    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  dispose() {
    this.timers.forEach(clearTimeout);
    this.skipDisposer();
    this.controls.dispose();
    delete (window as MoonGlobalDebugWindow).__moonGlobalDebug;
    this.scene.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.geometry) m.geometry.dispose();
      const mat = (m as any).material;
      if (Array.isArray(mat)) mat.forEach((x) => x.dispose());
      else mat?.dispose?.();
    });
    this.moonTexture?.dispose();
    this.moonTexture = null;
  }
}
