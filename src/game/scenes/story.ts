import * as THREE from 'three';
import { store } from '../../state/store';
import { makeStarfield, fbm, type Scene } from '../utils';
import { loadMoonGlobalTexture } from '../moonGlobal';
import { buildMissionEquipment, buildNova } from '../models/builders';
import { getMission, type Mission } from '../../data/missions';
import { chaptersFor } from '../../data/missionChapters';
import { StoryCueDirector } from '../storyCues';
import { audio } from '../audio';

export class StoryScene implements Scene {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera: THREE.PerspectiveCamera;
  private equipment: THREE.Group;
  private stars: THREE.Points;
  private disposers: (() => void)[] = [];
  private mission: Mission;
  private director: StoryCueDirector;

  constructor(renderer: THREE.WebGLRenderer) {
    this.renderer = renderer;
    this.mission = getMission(store.get().activeMission);
    this.stars = makeStarfield(store.get().graphics === 'low' ? 700 : 2000, 400);
    this.camera = new THREE.PerspectiveCamera(50, innerWidth / innerHeight, 0.1, 1000);
    const moonMission = this.mission.destination === 'moon';
    this.scene.background = new THREE.Color(moonMission ? 0x030509 : 0x0c0505);
    this.scene.fog = new THREE.Fog(moonMission ? 0x101217 : 0x140806, 30, 160);
    this.scene.add(this.stars);
    const sun = new THREE.DirectionalLight(moonMission ? 0xf4f6ff : 0xffd6ae, 2.5); sun.position.set(30, 24, -15); this.scene.add(sun);
    this.scene.add(new THREE.AmbientLight(moonMission ? 0x3a404c : 0x494355, 0.9));

    if (this.mission.surface) {
      const geo = new THREE.CircleGeometry(55, 72); geo.rotateX(-Math.PI / 2);
      const pos = geo.attributes.position;
      for (let i = 0; i < pos.count; i++) pos.setY(i, fbm(pos.getX(i) * 0.03, pos.getZ(i) * 0.03, 3) * 1.3);
      geo.computeVertexNormals();
      this.scene.add(new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: this.mission.destination === 'moon' ? 0x67696e : 0x8a4426, roughness: 1 })));
    } else {
      // Orbital missions sit in front of a large Moon. Use the NASA global map
      // on Moon missions so the maria read as real lunar terrain.
      const mat = new THREE.MeshStandardMaterial({ color: moonMission ? 0x9a9da4 : 0x74777d, roughness: 1 });
      const moon = new THREE.Mesh(new THREE.SphereGeometry(10, 48, 32), mat);
      moon.position.set(0, -13, -4);
      if (moonMission) {
        const moonTexture = loadMoonGlobalTexture(renderer, () => {
          mat.map = moonTexture;
          mat.color.set(0xffffff);
          mat.needsUpdate = true;
        });
        moon.rotation.y = -Math.PI / 2;
      }
      this.scene.add(moon);
    }
    this.equipment = buildMissionEquipment(this.mission.model, this.mission.id);
    this.equipment.scale.setScalar(this.mission.id === 'pathfinder' ? 2.2 : this.mission.surface ? 1.35 : 1.8);
    this.scene.add(this.equipment);
    const nova = buildNova(); nova.group.position.set(2.5, 2, 2); this.scene.add(nova.group);
    audio.play(this.mission.destination === 'moon' ? 'space' : 'mars');

    this.director = new StoryCueDirector(this.scene, this.camera, this.equipment);
    const firstCue = chaptersFor(this.mission.id)[0]?.animation.cue ?? 'cruise';
    this.director.play(firstCue);
    this.disposers.push(store.on('story:cue', (data) => {
      const payload = data as { cue?: string } | undefined;
      if (payload?.cue) this.director.play(payload.cue);
    }));
    store.set({ showStory: true, storyIndex: 0 });
  }

  resize(w: number, h: number) { this.camera.aspect = w / h; this.camera.updateProjectionMatrix(); }

  private focusPoint(): THREE.Vector3 {
    const equipmentFocus = this.equipment.position.clone().add(new THREE.Vector3(0, 1, 0));
    switch (this.director.focusMode) {
      case 'ground': return this.equipment.position.clone().add(new THREE.Vector3(0, 0.2, 0));
      case 'sky': return this.equipment.position.clone().add(new THREE.Vector3(0, 6.5, -6));
      case 'actor': return this.director.actorFocus ?? equipmentFocus;
      default: return equipmentFocus;
    }
  }

  update(dt: number, t: number) {
    this.director.update(dt);
    const focus = this.focusPoint();
    const zoom = this.director.zoom;
    let offset: THREE.Vector3;
    switch (this.director.mode) {
      case 'drift': offset = new THREE.Vector3(Math.sin(t * 0.06) * 14, 6, Math.cos(t * 0.06) * 14); break;
      case 'low': offset = new THREE.Vector3(Math.sin(t * 0.05) * 3, 1.1, 6 * zoom); break;
      case 'orbit': offset = new THREE.Vector3(Math.sin(t * 0.12) * 7, 3.2, Math.cos(t * 0.12) * 7).multiplyScalar(zoom); break;
      case 'close': offset = new THREE.Vector3(2.2, 1.8, 3 * zoom); break;
      case 'top': offset = new THREE.Vector3(0, 7 * zoom, 4 * zoom); break;
    }
    const targetPos = focus.clone().add(offset);
    this.camera.position.lerp(targetPos, Math.min(dt * 1.8, 1));
    const shake = this.director.shakeAmount;
    if (shake > 0.001) {
      this.camera.position.x += (Math.random() - 0.5) * shake;
      this.camera.position.y += (Math.random() - 0.5) * shake;
      this.camera.position.z += (Math.random() - 0.5) * shake;
    }
    this.camera.lookAt(focus);
    this.stars.rotation.y += dt * 0.002;
    this.renderer.render(this.scene, this.camera);
  }

  dispose() {
    this.disposers.forEach((dispose) => dispose());
    this.director.dispose();
    store.set({ showStory: false });
    const textures = new Set<THREE.Texture>();
    this.scene.traverse((o) => {
      const m = o as THREE.Mesh; m.geometry?.dispose();
      const mats = Array.isArray(m.material) ? m.material : m.material ? [m.material] : [];
      mats.forEach((mat) => { Object.values(mat).forEach((v) => { if (v instanceof THREE.Texture) textures.add(v); }); mat.dispose(); });
    });
    textures.forEach((tex) => tex.dispose());
  }
}
