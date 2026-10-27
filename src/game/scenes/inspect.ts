import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { store } from '../../state/store';
import { makeStarfield, type Scene } from '../utils';
import { loadMoonGlobalTexture } from '../moonGlobal';
import { buildMissionEquipment } from '../models/builders';
import { getMission, type Mission } from '../../data/missions';
import { UI } from '../../data/content';

export class InspectScene implements Scene {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera: THREE.PerspectiveCamera;
  private controls: OrbitControls;
  private raycaster = new THREE.Raycaster();
  private markers: { id: string; mesh: THREE.Mesh }[] = [];
  private stars: THREE.Points;
  private mission: Mission;

  constructor(renderer: THREE.WebGLRenderer) {
    this.renderer = renderer;
    this.mission = getMission(store.get().activeMission);
    const quality = store.get().graphics;
    this.stars = makeStarfield(quality === 'low' ? 600 : 1800, 320);
    this.camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, 0.1, 800);
    this.camera.position.set(3.8, 2.4, 4.8);
    this.scene.background = new THREE.Color(this.mission.destination === 'moon' ? 0x030509 : 0x090405);
    this.scene.add(this.stars);
    const key = new THREE.DirectionalLight(this.mission.destination === 'moon' ? 0xf3f5ff : 0xffe5c8, 2.8); key.position.set(4, 6, 3); this.scene.add(key);
    const fill = new THREE.DirectionalLight(0x7899ca, 0.9); fill.position.set(-4, 2, -3); this.scene.add(fill);
    this.scene.add(new THREE.AmbientLight(0x4b4655, 0.8));

    if (this.mission.surface) {
      const ground = new THREE.Mesh(new THREE.CircleGeometry(6, 48), new THREE.MeshStandardMaterial({ color: this.mission.destination === 'moon' ? 0x34353a : 0x3c1c11, roughness: 1 }));
      ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; this.scene.add(ground);
    } else {
      // Orbital missions orbit a large Moon behind the spacecraft; give Moon
      // missions the NASA global map instead of a flat gray placeholder.
      const moonMission = this.mission.destination === 'moon';
      const mat = new THREE.MeshStandardMaterial({ color: moonMission ? 0x9a9da4 : 0x777a80, roughness: 1 });
      const moon = new THREE.Mesh(new THREE.SphereGeometry(7, 48, 32), mat);
      moon.position.set(0, -9.5, -2);
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

    const model = buildMissionEquipment(this.mission.model, this.mission.id);
    const scale = this.mission.id === 'pathfinder' ? 2.5 : this.mission.surface ? 1.25 : 1.55;
    model.scale.setScalar(scale); this.scene.add(model);
    const saved = store.get().discovered[this.mission.id] || [];
    store.set({ visitedHotspots: saved, activeHotspot: null, hint: UI.hotspotHint });

    this.mission.hotspots.forEach((h) => {
      const marker = new THREE.Mesh(new THREE.SphereGeometry(0.065, 12, 10), new THREE.MeshBasicMaterial({ color: 0xffd97d, transparent: true, opacity: 0.95 }));
      marker.position.set(h.pos[0] * scale, h.pos[1] * scale, h.pos[2] * scale);
      marker.name = `hotspot:${h.id}`;
      const halo = new THREE.Mesh(new THREE.RingGeometry(0.1, 0.13, 24), new THREE.MeshBasicMaterial({ color: 0xffd97d, transparent: true, opacity: 0.55, side: THREE.DoubleSide }));
      marker.add(halo);
      const hit = new THREE.Mesh(new THREE.SphereGeometry(0.24, 8, 6), new THREE.MeshBasicMaterial({ visible: false }));
      marker.add(hit); this.scene.add(marker); this.markers.push({ id: h.id, mesh: marker });
    });

    this.controls = new OrbitControls(this.camera, renderer.domElement);
    this.controls.enableDamping = true; this.controls.dampingFactor = 0.08;
    this.controls.enablePan = false; this.controls.minDistance = 2; this.controls.maxDistance = 9;
    this.controls.target.set(0, this.mission.surface ? 0.9 : 0.4, 0);
  }

  onClick(x: number, y: number) {
    this.raycaster.setFromCamera(new THREE.Vector2(x, y), this.camera);
    const hits = this.raycaster.intersectObjects(this.markers.map((m) => m.mesh), true);
    if (!hits.length) return;
    let obj: THREE.Object3D | null = hits[0].object;
    while (obj && !obj.name.startsWith('hotspot:')) obj = obj.parent;
    if (!obj) return;
    const id = obj.name.split(':')[1];
    const visited = store.get().visitedHotspots;
    store.set({ activeHotspot: id, visitedHotspots: visited.includes(id) ? visited : [...visited, id] });
    store.discover(this.mission.id, id);
  }

  resize(w: number, h: number) { this.camera.aspect = w / h; this.camera.updateProjectionMatrix(); }
  update(dt: number, t: number) {
    this.markers.forEach(({ id, mesh }) => {
      mesh.scale.setScalar(1 + Math.sin(t * 3 + id.length) * 0.2);
      mesh.children[0]?.lookAt(this.camera.position);
      const visited = store.get().visitedHotspots.includes(id);
      (mesh.material as THREE.MeshBasicMaterial).color.set(visited ? 0x9fd8ff : 0xffd97d);
    });
    this.stars.rotation.y += dt * 0.002; this.controls.update();
    (window as any).__hotspots = this.markers.map(({ id, mesh }) => {
      const v = mesh.position.clone().project(this.camera);
      return { id, x: ((v.x + 1) / 2) * innerWidth, y: ((1 - v.y) / 2) * innerHeight, behind: v.z > 1 };
    });
    this.renderer.render(this.scene, this.camera);
  }

  dispose() {
    store.set({ hint: null, activeHotspot: null });
    this.controls.dispose(); delete (window as any).__hotspots;
    const textures = new Set<THREE.Texture>();
    this.scene.traverse((o) => {
      const m = o as THREE.Mesh; m.geometry?.dispose();
      const mats = Array.isArray(m.material) ? m.material : m.material ? [m.material] : [];
      mats.forEach((mat) => { Object.values(mat).forEach((v) => { if (v instanceof THREE.Texture) textures.add(v); }); mat.dispose(); });
    });
    textures.forEach((tex) => tex.dispose());
  }
}
