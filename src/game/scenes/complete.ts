import * as THREE from 'three';
import { store } from '../../state/store';
import { audio } from '../audio';
import { makeStarfield, fbm, type Scene } from '../utils';
import { buildMissionEquipment, buildFlag, buildNova } from '../models/builders';
import { getMission, type Mission } from '../../data/missions';

export class CompleteScene implements Scene {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera: THREE.PerspectiveCamera;
  private cloth: THREE.Mesh;
  private stars: THREE.Points;
  private time = 0;
  private flagY = 0.3;
  private clothBase: Float32Array;
  private mission: Mission;
  private timer: ReturnType<typeof setTimeout>;

  constructor(renderer: THREE.WebGLRenderer) {
    this.renderer = renderer;
    this.mission = getMission(store.get().activeMission);
    this.stars = makeStarfield(store.get().graphics === 'low' ? 700 : 2000, 400);
    this.camera = new THREE.PerspectiveCamera(50, innerWidth / innerHeight, 0.1, 1000);
    this.camera.position.set(0, 2.5, 8);
    this.scene.background = new THREE.Color(this.mission.destination === 'moon' ? 0x030509 : 0x0c0505);
    this.scene.add(this.stars);
    const sun = new THREE.DirectionalLight(0xffd6ae, 2.5); sun.position.set(30, 20, -15); this.scene.add(sun);
    this.scene.add(new THREE.AmbientLight(0x494355, 0.9));
    const geo = new THREE.CircleGeometry(60, 64); geo.rotateX(-Math.PI / 2);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) pos.setY(i, fbm(pos.getX(i) * 0.03, pos.getZ(i) * 0.03, 3) * 1.2);
    geo.computeVertexNormals();
    this.scene.add(new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: this.mission.destination === 'moon' ? 0x65676b : 0x8a4426, roughness: 1 })));
    const model = buildMissionEquipment(this.mission.model, this.mission.id);
    model.scale.setScalar(this.mission.id === 'pathfinder' ? 2.2 : 1.4); model.position.set(-2.2, 0, 1.2); this.scene.add(model);
    const nova = buildNova(); nova.group.position.set(1.8, 1.8, 2.4); this.scene.add(nova.group);
    const flag = buildFlag(this.mission.shortName, this.mission.year, this.mission.accent);
    this.cloth = flag.cloth; this.cloth.position.set(0.78, this.flagY, 0);
    this.clothBase = (this.cloth.geometry as THREE.PlaneGeometry).attributes.position.array.slice() as Float32Array;
    flag.group.position.set(1.4, 0, -1); this.scene.add(flag.group);
    audio.play(this.mission.destination === 'moon' ? 'space' : 'mars');
    this.timer = setTimeout(() => store.say([
      { speaker: 'nova', en: `${this.mission.shortName} is now recorded in your journey.`, bn: `${this.mission.name.bn} এখন আপনার যাত্রার ইতিহাসে যুক্ত হলো।` },
      { speaker: 'nova', en: 'You can continue, replay this chapter, or switch worlds without losing progress.', bn: 'এগিয়ে যেতে পারেন, অধ্যায়টি আবার খেলতে পারেন, অথবা অগ্রগতি না হারিয়ে অন্য জগতে যেতে পারেন।' },
    ]), 700);
  }

  resize(w: number, h: number) { this.camera.aspect = w / h; this.camera.updateProjectionMatrix(); }
  update(dt: number, t: number) {
    this.time += dt;
    if (this.time > 3 && this.flagY < 2.6) { this.flagY += dt * 0.5; this.cloth.position.y = this.flagY; }
    const attr = (this.cloth.geometry as THREE.PlaneGeometry).attributes.position;
    for (let i = 0; i < attr.count; i++) {
      const x = this.clothBase[i * 3]; attr.setZ(i, Math.sin(x * 4 + t * 3.2) * 0.08 * (x + 0.75));
    }
    attr.needsUpdate = true;
    const pull = Math.min(this.time / 10, 1), eased = pull * pull * (3 - 2 * pull);
    this.camera.position.set(Math.sin(t * 0.05) * (7 + eased * 8), 2.5 + eased * 5, 8 + eased * 10);
    this.camera.lookAt(0.3, 1.6 + eased, 0);
    this.stars.rotation.y += dt * 0.002; this.renderer.render(this.scene, this.camera);
  }

  dispose() {
    clearTimeout(this.timer);
    const textures = new Set<THREE.Texture>();
    this.scene.traverse((o) => {
      const m = o as THREE.Mesh; m.geometry?.dispose();
      const mats = Array.isArray(m.material) ? m.material : m.material ? [m.material] : [];
      mats.forEach((mat) => { Object.values(mat).forEach((v) => { if (v instanceof THREE.Texture) textures.add(v); }); mat.dispose(); });
    });
    textures.forEach((tex) => tex.dispose());
  }
}
