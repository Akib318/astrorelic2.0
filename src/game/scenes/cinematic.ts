import * as THREE from 'three';
import { store } from '../../state/store';
import { audio } from '../audio';
import { makeStarfield, makeCanvasTexture, type Scene } from '../utils';
import { loadMoonGlobalTexture } from '../moonGlobal';
import { getMission, type Mission } from '../../data/missions';

export class MarsCinematicScene implements Scene {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera: THREE.PerspectiveCamera;
  private planet: THREE.Mesh;
  private stars: THREE.Points;
  private craft: THREE.Group;
  private time = 0;
  private beatIdx = 0;
  private done = false;
  private mission: Mission;
  private disposer: () => void;
  private timers: ReturnType<typeof setTimeout>[] = [];
  private beats: { en: string; bn: string; at: number }[];

  constructor(renderer: THREE.WebGLRenderer) {
    this.renderer = renderer;
    this.mission = getMission(store.get().activeMission);
    this.stars = makeStarfield(store.get().graphics === 'low' ? 900 : 2800, 600);
    this.camera = new THREE.PerspectiveCamera(55, innerWidth / innerHeight, 0.1, 1500);
    this.scene.background = new THREE.Color(0x050308); this.scene.add(this.stars);
    const moon = this.mission.destination === 'moon';
    // The Moon sphere shows the real NASA global map (gray maria + craters);
    // Mars keeps its procedural ochre surface. The map is attached once the
    // JPEG decodes so the sphere never flashes black mid-intro.
    const planetMaterial = new THREE.MeshStandardMaterial({
      map: moon
        ? null
        : makeCanvasTexture(512, (ctx, s) => {
            ctx.fillStyle = '#b4532f'; ctx.fillRect(0, 0, s, s);
            for (let i = 0; i < 180; i++) {
              const x = Math.random() * s, y = Math.random() * s, r = 5 + Math.random() * 45;
              const g = ctx.createRadialGradient(x, y, 0, x, y, r);
              g.addColorStop(0, 'rgba(90,35,20,0.35)'); g.addColorStop(1, 'rgba(0,0,0,0)');
              ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
            }
          }),
      color: moon ? 0x9a9da4 : 0xffffff,
      roughness: 0.95,
    });
    if (moon) {
      const moonTexture = loadMoonGlobalTexture(renderer, () => {
        planetMaterial.map = moonTexture;
        planetMaterial.color.set(0xffffff);
        planetMaterial.needsUpdate = true;
      });
    }
    this.planet = new THREE.Mesh(new THREE.SphereGeometry(20, 48, 32), planetMaterial);
    this.planet.position.set(0, 0, -220);
    // u = 0.5 (selenographic longitude 0) sits on +X; turn the near side
    // towards the camera so the familiar maria face the viewer.
    this.planet.rotation.y = moon ? -Math.PI / 2 : 0;
    this.scene.add(this.planet);
    const sun = new THREE.DirectionalLight(moon ? 0xf6f7ff : 0xffe0b8, moon ? 2.7 : 3);
    sun.position.set(-40, 18, 30); this.scene.add(sun);
    this.scene.add(new THREE.AmbientLight(moon ? 0x333a46 : 0x393343, 0.8));
    this.craft = new THREE.Group();
    const bus = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.6, 0.8, 8), new THREE.MeshStandardMaterial({ color: 0xb8b2a4, roughness: 0.5, metalness: 0.5 }));
    this.craft.add(bus);
    [-1, 1].forEach((s) => {
      const p = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.03, 0.7), new THREE.MeshStandardMaterial({ color: 0x22406e, roughness: 0.4, metalness: 0.6 }));
      p.position.x = s * 1.5; this.craft.add(p);
    });
    this.craft.position.set(3, -1, -6); this.scene.add(this.craft);
    this.beats = [
      { en: `${this.mission.shortName.toUpperCase()} · ${this.mission.year}`, bn: `${this.mission.name.bn} · ${this.mission.year}`, at: 0.4 },
      { en: this.mission.location.en.toUpperCase(), bn: this.mission.location.bn, at: 2.7 },
      { en: this.mission.surface ? (moon ? 'LUNAR SURFACE APPROACH' : 'MARS SURFACE APPROACH') : 'SPACECRAFT · ORBITAL RECONSTRUCTION', bn: this.mission.surface ? (moon ? 'চন্দ্রপৃষ্ঠের দিকে অভিযাত্রা' : 'মঙ্গলপৃষ্ঠের দিকে অভিযাত্রা') : 'মহাকাশযান · কক্ষীয় পুনর্গঠন', at: 5 },
    ];
    this.disposer = store.on('skipCinematic', () => this.finish());
    audio.play('space');
  }

  private finish() {
    if (this.done) return;
    this.done = true; store.set({ caption: null }); store.emit('engine:goto', 'story');
  }
  resize(w: number, h: number) { this.camera.aspect = w / h; this.camera.updateProjectionMatrix(); }
  update(dt: number, t: number) {
    this.time += dt;
    if (this.beatIdx < this.beats.length && this.time >= this.beats[this.beatIdx].at) {
      store.set({ caption: this.beats[this.beatIdx] }); this.beatIdx++;
      this.timers.push(setTimeout(() => store.set({ caption: null }), 2100));
    }
    const k = Math.min(this.time / 8, 1), ease = k * k * (3 - 2 * k);
    this.camera.position.set(Math.sin(this.time * 0.1) * 3, Math.cos(this.time * 0.08) * 2, this.planet.position.z + 110 - ease * 78);
    this.camera.lookAt(this.planet.position);
    this.craft.position.z = -6 - ease * 32; this.craft.position.x = 3 + ease * 5;
    this.craft.rotation.z = Math.sin(t * 0.5) * 0.05; this.craft.rotation.y += dt * 0.1;
    this.planet.rotation.y += dt * 0.02; this.stars.rotation.y += dt * 0.002;
    this.renderer.render(this.scene, this.camera);
    if (this.time > 8) this.finish();
  }
  dispose() {
    this.disposer(); this.timers.forEach(clearTimeout); store.set({ caption: null });
    const textures = new Set<THREE.Texture>();
    this.scene.traverse((o) => {
      const m = o as THREE.Mesh; m.geometry?.dispose();
      const mats = Array.isArray(m.material) ? m.material : m.material ? [m.material] : [];
      mats.forEach((mat) => { Object.values(mat).forEach((v) => { if (v instanceof THREE.Texture) textures.add(v); }); mat.dispose(); });
    });
    textures.forEach((tex) => tex.dispose());
  }
}
