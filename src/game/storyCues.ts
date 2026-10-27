import * as THREE from 'three';

export type CueCamera = 'orbit' | 'low' | 'close' | 'top' | 'drift';
export type CueFocus = 'equipment' | 'ground' | 'sky' | 'actor';
export type CueActor =
  | 'probe' | 'rocket' | 'lander' | 'rover' | 'astronaut' | 'craft' | 'film'
  | 'sample' | 'flag' | 'golfball' | 'mole' | 'earth' | 'moon' | 'map' | 'sun'
  | 'airbag' | 'petals' | 'dropkit' | 'scoop' | 'seismic' | 'blueberries'
  | 'signal' | 'counter' | 'footprint';
export type CueMotion =
  | 'fly-past' | 'launch' | 'descend' | 'land' | 'bounce' | 'unfold' | 'scan'
  | 'orbit' | 'earthrise' | 'impact' | 'splash' | 'vent' | 'dock' | 'drive'
  | 'walk' | 'dig' | 'drop' | 'glow' | 'pins' | 'free-return' | 'quake'
  | 'fade' | 'sink' | 'rise' | 'frost' | 'open' | 'hop' | 'stuck' | 'signal'
  | 'assemble' | 'collect' | 'climb' | 'fly' | 'reboot' | 'counter' | 'cruise'
  | 'hide' | 'ramp' | 'pulse' | 'sweep' | 'erupt';
export type CueParticle = 'dust' | 'sparks' | 'vent' | 'ice' | 'snow' | 'storm';

export interface CueSpec {
  camera: CueCamera;
  focus?: CueFocus;
  zoom?: number;
  shake?: number;
  flash?: number;
  tint?: number;
  tintStrength?: number;
  actor?: CueActor;
  motion?: CueMotion;
  particles?: CueParticle;
  duration?: number;
}

const spec = (value: CueSpec): CueSpec => value;

/**
 * Every animation cue in mission_stories.js resolves to a real, reusable scene action.
 * The director reuses one lightweight actor library and a shared camera / particle rig
 * rather than creating a bespoke cinematic for each of the 67 chapters.
 */
export const STORY_CUES: Record<string, CueSpec> = {
  'probe-miss': spec({ camera: 'drift', focus: 'actor', actor: 'probe', motion: 'fly-past', duration: 6 }),
  'launch-and-cruise': spec({ camera: 'drift', focus: 'actor', actor: 'rocket', motion: 'launch', particles: 'sparks', shake: 0.35, duration: 5.5 }),
  'zoom-descent': spec({ camera: 'low', focus: 'ground', zoom: 0.72, actor: 'probe', motion: 'descend', duration: 5 }),
  'impact-flash': spec({ camera: 'close', focus: 'actor', actor: 'probe', motion: 'impact', particles: 'sparks', flash: 1, shake: 0.7, tint: 0xffd2a0, tintStrength: 0.35, duration: 4 }),
  'retro-rocket-landing': spec({ camera: 'low', focus: 'actor', actor: 'lander', motion: 'descend', particles: 'dust', duration: 5.5 }),
  'footpad-closeup': spec({ camera: 'close', focus: 'ground', zoom: 0.62, actor: 'lander', motion: 'land', particles: 'dust', duration: 4.5 }),
  'scoop-arm': spec({ camera: 'close', focus: 'actor', actor: 'scoop', motion: 'dig', particles: 'dust', duration: 5 }),
  'map-pins': spec({ camera: 'top', focus: 'equipment', actor: 'map', motion: 'pins', duration: 5.5 }),
  orbit: spec({ camera: 'orbit', focus: 'actor', actor: 'craft', motion: 'orbit', duration: 6 }),
  'film-scan': spec({ camera: 'close', focus: 'actor', actor: 'film', motion: 'scan', particles: 'sparks', duration: 5 }),
  earthrise: spec({ camera: 'low', focus: 'sky', actor: 'earth', motion: 'earthrise', tint: 0x3f79b8, tintStrength: 0.25, duration: 6 }),
  'site-highlight': spec({ camera: 'top', focus: 'equipment', actor: 'map', motion: 'pins', tint: 0x43d17a, tintStrength: 0.2, duration: 5 }),
  'saturn-liftoff': spec({ camera: 'drift', focus: 'actor', actor: 'rocket', motion: 'launch', particles: 'sparks', shake: 0.45, flash: 0.25, duration: 5.5 }),
  'radio-silence': spec({ camera: 'drift', focus: 'actor', actor: 'craft', motion: 'hide', tint: 0x0a1122, tintStrength: 0.55, duration: 6 }),
  'earthrise-color': spec({ camera: 'low', focus: 'sky', actor: 'earth', motion: 'earthrise', tint: 0x2f6ea8, tintStrength: 0.3, duration: 6 }),
  splashdown: spec({ camera: 'top', focus: 'actor', actor: 'craft', motion: 'splash', particles: 'sparks', duration: 5 }),
  'lander-descent': spec({ camera: 'low', focus: 'actor', actor: 'lander', motion: 'descend', particles: 'dust', duration: 5.5 }),
  'touchdown-dust': spec({ camera: 'close', focus: 'actor', actor: 'lander', motion: 'land', particles: 'dust', flash: 0.18, duration: 4.5 }),
  'first-step': spec({ camera: 'low', focus: 'actor', actor: 'astronaut', motion: 'walk', particles: 'dust', duration: 6 }),
  'docking-return': spec({ camera: 'orbit', focus: 'actor', actor: 'craft', motion: 'dock', duration: 5.5 }),
  'lightning-strike': spec({ camera: 'drift', focus: 'actor', actor: 'rocket', motion: 'pulse', particles: 'sparks', flash: 1, shake: 0.8, tint: 0xaed8ff, tintStrength: 0.35, duration: 4.5 }),
  'precision-landing': spec({ camera: 'low', focus: 'actor', actor: 'lander', motion: 'descend', particles: 'dust', duration: 5.5 }),
  'walk-to-surveyor': spec({ camera: 'low', focus: 'actor', actor: 'astronaut', motion: 'walk', particles: 'dust', duration: 6 }),
  'sample-box': spec({ camera: 'close', focus: 'actor', actor: 'sample', motion: 'glow', duration: 5 }),
  cruise: spec({ camera: 'drift', focus: 'actor', actor: 'craft', motion: 'cruise', duration: 6 }),
  'explosion-venting': spec({ camera: 'close', focus: 'actor', actor: 'craft', motion: 'vent', particles: 'vent', flash: 0.9, shake: 0.8, tint: 0xff7a2f, tintStrength: 0.4, duration: 5 }),
  'filter-fix': spec({ camera: 'close', focus: 'actor', actor: 'scoop', motion: 'assemble', duration: 5 }),
  'free-return': spec({ camera: 'top', focus: 'actor', actor: 'craft', motion: 'free-return', duration: 6 }),
  liftoff: spec({ camera: 'drift', focus: 'actor', actor: 'rocket', motion: 'launch', particles: 'sparks', shake: 0.35, duration: 5.5 }),
  'docking-retry': spec({ camera: 'close', focus: 'actor', actor: 'craft', motion: 'dock', shake: 0.22, duration: 5 }),
  'hill-climb': spec({ camera: 'low', focus: 'actor', actor: 'astronaut', motion: 'climb', particles: 'dust', duration: 6 }),
  'golf-shot': spec({ camera: 'low', focus: 'actor', actor: 'golfball', motion: 'fly', particles: 'dust', duration: 5 }),
  'landing-valley': spec({ camera: 'low', focus: 'actor', actor: 'lander', motion: 'descend', particles: 'dust', duration: 5.5 }),
  'rover-unfold': spec({ camera: 'close', focus: 'actor', actor: 'rover', motion: 'unfold', particles: 'dust', duration: 5 }),
  'drop-test': spec({ camera: 'low', focus: 'actor', actor: 'dropkit', motion: 'drop', duration: 5 }),
  'rock-glow': spec({ camera: 'close', focus: 'actor', actor: 'sample', motion: 'glow', tint: 0xffd18a, tintStrength: 0.18, duration: 5 }),
  'highland-landing': spec({ camera: 'low', focus: 'actor', actor: 'lander', motion: 'descend', particles: 'dust', duration: 5.5 }),
  'engine-check': spec({ camera: 'close', focus: 'actor', actor: 'signal', motion: 'signal', tint: 0x43d17a, tintStrength: 0.15, duration: 4.5 }),
  'rover-drive': spec({ camera: 'low', focus: 'actor', actor: 'rover', motion: 'drive', particles: 'dust', duration: 6 }),
  'sample-collect': spec({ camera: 'close', focus: 'actor', actor: 'sample', motion: 'collect', particles: 'sparks', duration: 5 }),
  'night-launch': spec({ camera: 'drift', focus: 'actor', actor: 'rocket', motion: 'launch', particles: 'sparks', flash: 0.35, tint: 0x1a2c55, tintStrength: 0.3, duration: 5.5 }),
  'blue-marble': spec({ camera: 'close', focus: 'sky', actor: 'earth', motion: 'glow', tint: 0x2d6fa8, tintStrength: 0.32, duration: 6 }),
  'orange-soil': spec({ camera: 'close', focus: 'actor', actor: 'sample', motion: 'glow', tint: 0xff7b20, tintStrength: 0.3, duration: 5 }),
  'last-step': spec({ camera: 'low', focus: 'actor', actor: 'footprint', motion: 'glow', particles: 'dust', duration: 6 }),
  'airbag-bounce': spec({ camera: 'low', focus: 'actor', actor: 'airbag', motion: 'bounce', particles: 'dust', duration: 6 }),
  'petals-open': spec({ camera: 'close', focus: 'actor', actor: 'petals', motion: 'open', particles: 'dust', duration: 5.5 }),
  'rover-ramp': spec({ camera: 'low', focus: 'actor', actor: 'rover', motion: 'ramp', particles: 'dust', duration: 5.5 }),
  'sol-counter': spec({ camera: 'close', focus: 'actor', actor: 'counter', motion: 'counter', duration: 6 }),
  'airbag-landing': spec({ camera: 'low', focus: 'actor', actor: 'airbag', motion: 'bounce', particles: 'dust', duration: 6 }),
  'glitch-fix': spec({ camera: 'close', focus: 'actor', actor: 'signal', motion: 'reboot', particles: 'sparks', tint: 0x7ad8a0, tintStrength: 0.18, duration: 5 }),
  'hill-drive': spec({ camera: 'low', focus: 'actor', actor: 'rover', motion: 'climb', particles: 'dust', duration: 6 }),
  'stuck-wheel': spec({ camera: 'close', focus: 'actor', actor: 'rover', motion: 'stuck', particles: 'dust', duration: 5.5 }),
  'crater-landing': spec({ camera: 'low', focus: 'actor', actor: 'lander', motion: 'land', particles: 'dust', duration: 5 }),
  blueberries: spec({ camera: 'close', focus: 'actor', actor: 'blueberries', motion: 'glow', duration: 5.5 }),
  odometer: spec({ camera: 'low', focus: 'actor', actor: 'rover', motion: 'drive', particles: 'dust', duration: 6 }),
  'dust-storm': spec({ camera: 'drift', focus: 'actor', actor: 'signal', motion: 'fade', particles: 'storm', shake: 0.25, tint: 0x7a2d0e, tintStrength: 0.65, duration: 6.5 }),
  edl: spec({ camera: 'low', focus: 'actor', actor: 'lander', motion: 'descend', particles: 'sparks', flash: 0.28, shake: 0.3, duration: 5.5 }),
  'arm-dig': spec({ camera: 'close', focus: 'actor', actor: 'scoop', motion: 'dig', particles: 'dust', duration: 5 }),
  'ice-vanish': spec({ camera: 'close', focus: 'actor', actor: 'sample', motion: 'fade', particles: 'ice', duration: 5.5 }),
  'sun-fade': spec({ camera: 'low', focus: 'sky', actor: 'sun', motion: 'frost', particles: 'snow', tint: 0x07101c, tintStrength: 0.55, duration: 6.5 }),
  'landing-flat': spec({ camera: 'low', focus: 'actor', actor: 'lander', motion: 'land', particles: 'dust', duration: 5 }),
  'arm-place': spec({ camera: 'close', focus: 'actor', actor: 'scoop', motion: 'assemble', duration: 5.5 }),
  'seismic-waves': spec({ camera: 'close', focus: 'actor', actor: 'seismic', motion: 'quake', shake: 0.45, duration: 5.5 }),
  'mole-stuck': spec({ camera: 'close', focus: 'actor', actor: 'mole', motion: 'stuck', particles: 'dust', duration: 5.5 }),
  'dust-settle': spec({ camera: 'drift', focus: 'actor', actor: 'signal', motion: 'fade', particles: 'dust', tint: 0x3b2b22, tintStrength: 0.3, duration: 6 }),
};

export const cueSpecFor = (cue: string): CueSpec =>
  STORY_CUES[cue] || spec({ camera: 'drift', focus: 'equipment', actor: 'craft', motion: 'cruise', duration: 5 });

interface ActiveActor {
  group: THREE.Group;
  parts: Record<string, THREE.Object3D>;
  base: THREE.Vector3;
  motion: CueMotion;
  start: number;
  duration: number;
}

interface ParticleField {
  points: THREE.Points;
  velocities: Float32Array;
  kind: CueParticle;
  start: number;
  duration: number;
}

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));
const smooth = (value: number) => value * value * (3 - 2 * value);

export class StoryCueDirector {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private equipment: THREE.Group;
  private baseBg: THREE.Color;
  private baseFog: THREE.Color | null;
  private active: ActiveActor | null = null;
  private particles: ParticleField[] = [];
  private current: CueSpec = cueSpecFor('cruise');
  private cueStart = 0;
  private time = 0;
  private flash: THREE.Mesh;
  private flashMaterial: THREE.MeshBasicMaterial;
  private flashLight: THREE.PointLight;
  private tintColor = new THREE.Color();

  mode: CueCamera = 'drift';
  focusMode: CueFocus = 'equipment';
  zoom = 1;
  shake = 0;
  duration = 5;

  constructor(scene: THREE.Scene, camera: THREE.PerspectiveCamera, equipment: THREE.Group) {
    this.scene = scene;
    this.camera = camera;
    this.equipment = equipment;
    this.baseBg = (scene.background as THREE.Color).clone();
    this.baseFog = scene.fog ? scene.fog.color.clone() : null;

    this.flashMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff, transparent: true, opacity: 0, depthTest: false, depthWrite: false, side: THREE.DoubleSide,
    });
    this.flash = new THREE.Mesh(new THREE.PlaneGeometry(4, 4), this.flashMaterial);
    this.flash.position.z = -1;
    this.flash.frustumCulled = false;
    this.flash.renderOrder = 999;
    this.camera.add(this.flash);
    this.scene.add(this.camera);
    this.flashLight = new THREE.PointLight(0xfff2d8, 0, 60);
    this.flashLight.position.copy(equipment.position).add(new THREE.Vector3(0, 2, 0));
    this.scene.add(this.flashLight);
  }

  play(cue: string) {
    this.clearActor();
    this.clearParticles();
    this.current = cueSpecFor(cue);
    this.mode = this.current.camera;
    this.focusMode = this.current.focus || (this.current.actor ? 'actor' : 'equipment');
    this.zoom = this.current.zoom ?? 1;
    this.shake = this.current.shake ?? 0;
    this.duration = this.current.duration ?? 5.5;
    this.cueStart = this.time;
    if (this.current.actor && this.current.motion) {
      this.active = this.createActor(this.current.actor, this.current.motion, this.cueStart, this.duration);
    }
    if (this.current.particles) this.particles.push(this.createParticles(this.current.particles, this.cueStart, this.duration));
  }

  update(dt: number) {
    this.time += dt;
    const elapsed = this.time - this.cueStart;
    const p = clamp01(elapsed / Math.max(this.duration, 0.01));
    const envelope = Math.sin(Math.min(p, 1) * Math.PI);

    if (this.active) this.animateActor(this.active, p, elapsed);
    const liveParticles: ParticleField[] = [];
    for (const field of this.particles) {
      this.animateParticles(field, dt, p);
      if (p >= 1 || this.time - field.start >= field.duration + 0.4) {
        this.scene.remove(field.points);
        this.disposeObject(field.points);
      } else {
        liveParticles.push(field);
      }
    }
    this.particles = liveParticles;

    const flash = this.current.flash ?? 0;
    this.flashMaterial.opacity = flash * Math.max(0, 1 - elapsed / 0.55);
    this.flashLight.intensity = flash * 9 * Math.max(0, 1 - elapsed / 0.65);

    const tint = this.current.tint;
    if (tint !== undefined) {
      this.tintColor.setHex(tint);
      const strength = (this.current.tintStrength ?? 0.25) * envelope;
      if (this.scene.background instanceof THREE.Color) this.scene.background.copy(this.baseBg).lerp(this.tintColor, strength);
      if (this.scene.fog && this.baseFog) this.scene.fog.color.copy(this.baseFog).lerp(this.tintColor, strength * 0.6);
    } else {
      if (this.scene.background instanceof THREE.Color) this.scene.background.copy(this.baseBg);
      if (this.scene.fog && this.baseFog) this.scene.fog.color.copy(this.baseFog);
    }
  }

  get actorFocus(): THREE.Vector3 | null {
    return this.active ? this.active.group.position.clone() : null;
  }

  get shakeAmount() {
    const elapsed = this.time - this.cueStart;
    const p = clamp01(elapsed / Math.max(this.duration, 0.01));
    return this.shake * Math.sin(Math.min(p, 1) * Math.PI);
  }

  private createActor(kind: CueActor, motion: CueMotion, start: number, duration: number): ActiveActor {
    const group = new THREE.Group();
    const parts: Record<string, THREE.Object3D> = {};
    const metal = (color: number, roughness = 0.55, metalness = 0.45) =>
      new THREE.MeshStandardMaterial({ color, roughness, metalness });
    const warm = metal(0xc8c0b0, 0.5, 0.5);
    const dark = metal(0x3b3d44, 0.8, 0.2);
    const panel = metal(0x244d7e, 0.35, 0.65);
    const accent = metal(0xe07952, 0.45, 0.35);

    const add = (mesh: THREE.Mesh, name?: string) => {
      group.add(mesh);
      if (name) parts[name] = mesh;
      return mesh;
    };

    switch (kind) {
      case 'probe': {
        add(new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.42, 0.9, 10), warm), 'body');
        const dish = add(new THREE.Mesh(new THREE.ConeGeometry(0.42, 0.3, 12), warm), 'dish');
        dish.position.y = 0.55;
        const panelA = add(new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.04, 0.55), panel), 'panelA');
        panelA.position.x = 1.1;
        const panelB = add(new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.04, 0.55), panel), 'panelB');
        panelB.position.x = -1.1;
        add(new THREE.Mesh(new THREE.SphereGeometry(0.09, 8, 8), new THREE.MeshBasicMaterial({ color: 0xffd97d })), 'light');
        break;
      }
      case 'rocket': {
        add(new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.62, 2.8, 14), warm), 'body');
        const nose = add(new THREE.Mesh(new THREE.ConeGeometry(0.5, 0.9, 14), accent), 'nose');
        nose.position.y = 1.82;
        const flame = add(new THREE.Mesh(new THREE.ConeGeometry(0.38, 1.4, 10), new THREE.MeshBasicMaterial({ color: 0xffa33d, transparent: true, opacity: 0.9 })), 'flame');
        flame.position.y = -2.05;
        flame.rotation.x = Math.PI;
        for (let i = 0; i < 3; i++) {
          const fin = add(new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.75, 0.7), dark), `fin${i}`);
          fin.position.set(Math.cos(i * Math.PI * 2 / 3) * 0.55, -1.15, Math.sin(i * Math.PI * 2 / 3) * 0.55);
          fin.rotation.y = -i * Math.PI * 2 / 3;
        }
        break;
      }
      case 'lander': {
        add(new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.72, 1.2), warm), 'body');
        const top = add(new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.52, 0.35, 8), dark), 'top');
        top.position.y = 0.52;
        for (let i = 0; i < 4; i++) {
          const leg = add(new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 1.1, 8), dark), `leg${i}`);
          leg.position.set(Math.cos(i * Math.PI / 2 + 0.78) * 0.72, -0.55, Math.sin(i * Math.PI / 2 + 0.78) * 0.72);
          leg.rotation.z = Math.cos(i * Math.PI / 2 + 0.78) * 0.42;
          leg.rotation.x = Math.sin(i * Math.PI / 2 + 0.78) * 0.42;
        }
        const bell = add(new THREE.Mesh(new THREE.ConeGeometry(0.3, 0.5, 10, 1, true), dark), 'engine');
        bell.position.y = -0.58;
        const glow = add(new THREE.Mesh(new THREE.SphereGeometry(0.18, 8, 8), new THREE.MeshBasicMaterial({ color: 0xffb35c })), 'engineGlow');
        glow.position.y = -0.85;
        break;
      }
      case 'rover': {
        add(new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.4, 0.85), warm), 'body');
        const deck = add(new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.06, 0.7), panel), 'deck');
        deck.position.y = 0.24;
        for (let i = 0; i < 6; i++) {
          const wheel = add(new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.15, 12), dark), `wheel${i}`);
          wheel.rotation.z = Math.PI / 2;
          wheel.position.set((i % 2 === 0 ? -0.52 : 0.52), -0.2, (Math.floor(i / 2) - 1) * 0.45);
        }
        const mast = add(new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.65, 8), dark), 'mast');
        mast.position.set(0.4, 0.6, 0);
        const head = add(new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.14, 0.14), warm), 'head');
        head.position.set(0.4, 0.95, 0);
        break;
      }
      case 'astronaut': {
        add(new THREE.Mesh(new THREE.CapsuleGeometry(0.28, 0.5, 4, 8), warm), 'body');
        const helmet = add(new THREE.Mesh(new THREE.SphereGeometry(0.28, 12, 10), new THREE.MeshStandardMaterial({ color: 0x9fd8ff, roughness: 0.25, metalness: 0.25 })), 'helmet');
        helmet.position.y = 0.58;
        const pack = add(new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.55, 0.24), dark), 'pack');
        pack.position.set(0, 0.02, 0.3);
        [-1, 1].forEach((side) => {
          const leg = add(new THREE.Mesh(new THREE.CapsuleGeometry(0.1, 0.32, 3, 6), warm), side < 0 ? 'legL' : 'legR');
          leg.position.set(side * 0.15, -0.58, 0);
        });
        break;
      }
      case 'craft': {
        add(new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.55, 0.85, 10), warm), 'body');
        const cone = add(new THREE.Mesh(new THREE.ConeGeometry(0.48, 0.7, 12), warm), 'nose');
        cone.position.y = 0.72;
        [-1, 1].forEach((side) => {
          const wing = add(new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.04, 0.7), panel), side < 0 ? 'wingL' : 'wingR');
          wing.position.x = side * 1.35;
        });
        const engine = add(new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.34, 0.5, 10), dark), 'engine');
        engine.position.y = -0.65;
        break;
      }
      case 'film': {
        const strip = add(new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.9, 0.035), new THREE.MeshStandardMaterial({ color: 0x272a33, roughness: 0.6, metalness: 0.25 })), 'strip');
        strip.rotation.z = -0.12;
        for (let i = 0; i < 7; i++) {
          const frame = add(new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.62, 0.045), new THREE.MeshBasicMaterial({ color: 0x9fd8ff })), `frame${i}`);
          frame.position.set(-1.02 + i * 0.34, 0, 0.03);
          frame.rotation.z = -0.12;
        }
        break;
      }
      case 'sample': {
        const rock = add(new THREE.Mesh(new THREE.DodecahedronGeometry(0.42, 0), new THREE.MeshStandardMaterial({ color: 0xd8d4c6, roughness: 0.85, emissive: 0xffd18a, emissiveIntensity: 0.15 })), 'rock');
        rock.scale.set(1, 0.8, 1.1);
        break;
      }
      case 'flag': {
        add(new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 2.4, 8), dark), 'pole');
        const cloth = add(new THREE.Mesh(new THREE.PlaneGeometry(1.3, 0.75, 8, 4), new THREE.MeshStandardMaterial({ color: 0xc1543a, side: THREE.DoubleSide, roughness: 0.9 })), 'cloth');
        cloth.position.set(0.68, 0.72, 0);
        break;
      }
      case 'golfball': {
        add(new THREE.Mesh(new THREE.SphereGeometry(0.11, 12, 10), new THREE.MeshStandardMaterial({ color: 0xf3f0e6, roughness: 0.8 })), 'ball');
        break;
      }
      case 'mole': {
        const body = add(new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.16, 1.5, 10), warm), 'body');
        body.rotation.z = -0.42;
        const tip = add(new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.32, 10), dark), 'tip');
        tip.position.set(0.32, -0.82, 0);
        tip.rotation.z = -0.42;
        break;
      }
      case 'earth': {
        const earth = add(new THREE.Mesh(new THREE.SphereGeometry(1.7, 32, 24), new THREE.MeshStandardMaterial({ color: 0x2f6ea8, roughness: 0.7, emissive: 0x102b4d, emissiveIntensity: 0.35 })), 'planet');
        const cloud = add(new THREE.Mesh(new THREE.SphereGeometry(1.72, 24, 16), new THREE.MeshBasicMaterial({ color: 0xe8f4ff, transparent: true, opacity: 0.22, depthWrite: false })), 'clouds');
        cloud.scale.set(1.01, 1, 1.01);
        earth.rotation.z = 0.18;
        break;
      }
      case 'moon': {
        add(new THREE.Mesh(new THREE.SphereGeometry(1.9, 32, 24), new THREE.MeshStandardMaterial({ color: 0x8a8d94, roughness: 1 })), 'planet');
        break;
      }
      case 'map': {
        const disc = add(new THREE.Mesh(new THREE.CylinderGeometry(2.3, 2.3, 0.06, 40), new THREE.MeshStandardMaterial({ color: 0x343842, roughness: 0.9 })), 'disc');
        disc.rotation.x = Math.PI / 2;
        for (let i = 0; i < 5; i++) {
          const pin = add(new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.38, 8), new THREE.MeshBasicMaterial({ color: 0x43d17a })), `pin${i}`);
          pin.position.set(Math.cos(i * 1.3) * (0.7 + i * 0.2), 0.15, Math.sin(i * 1.3) * (0.7 + i * 0.2));
        }
        break;
      }
      case 'sun': {
        add(new THREE.Mesh(new THREE.SphereGeometry(1.5, 24, 18), new THREE.MeshBasicMaterial({ color: 0xffcf6a })), 'star');
        const glow = add(new THREE.Mesh(new THREE.SphereGeometry(2.4, 20, 16), new THREE.MeshBasicMaterial({ color: 0xff9a3d, transparent: true, opacity: 0.18, depthWrite: false })), 'glow');
        glow.scale.setScalar(1.05);
        break;
      }
      case 'airbag': {
        for (let i = 0; i < 4; i++) {
          const lobe = add(new THREE.Mesh(new THREE.SphereGeometry(0.75, 16, 12), new THREE.MeshStandardMaterial({ color: 0xe8e2d4, roughness: 0.75 })), `lobe${i}`);
          lobe.position.set(Math.cos(i * Math.PI / 2) * 0.58, Math.sin(i * Math.PI / 2) * 0.4, Math.sin(i * Math.PI / 2) * 0.58);
        }
        break;
      }
      case 'petals': {
        for (let i = 0; i < 3; i++) {
          const petal = add(new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.08, 1.15), new THREE.MeshStandardMaterial({ color: 0xd8cbb8, roughness: 0.65, metalness: 0.35 })), `petal${i}`);
          petal.position.set(Math.cos(i * Math.PI * 2 / 3) * 0.62, 0, Math.sin(i * Math.PI * 2 / 3) * 0.62);
          petal.rotation.y = -i * Math.PI * 2 / 3;
        }
        const rover = add(new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.24, 0.4), panel), 'rover');
        rover.position.y = 0.2;
        break;
      }
      case 'dropkit': {
        const hammer = add(new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.5, 0.12), dark), 'hammer');
        hammer.position.set(-0.3, 0, 0);
        const head = add(new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.14, 0.16), warm), 'hammerHead');
        head.position.set(-0.3, 0.3, 0);
        const feather = add(new THREE.Mesh(new THREE.PlaneGeometry(0.16, 0.55), new THREE.MeshStandardMaterial({ color: 0xe8e2d4, side: THREE.DoubleSide })), 'feather');
        feather.position.set(0.3, 0, 0);
        break;
      }
      case 'scoop': {
        const arm = add(new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.5, 8), dark), 'arm');
        arm.rotation.z = -0.55;
        const bucket = add(new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.24, 0.34), warm), 'bucket');
        bucket.position.set(0.65, -0.58, 0);
        const filter = add(new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.07, 8, 18), panel), 'filter');
        filter.position.set(-0.7, 0.55, 0);
        break;
      }
      case 'seismic': {
        add(new THREE.Mesh(new THREE.SphereGeometry(0.55, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2), warm), 'dome');
        for (let i = 0; i < 3; i++) {
          const ring = add(new THREE.Mesh(new THREE.TorusGeometry(0.9 + i * 0.5, 0.018, 6, 40), new THREE.MeshBasicMaterial({ color: 0x9fd8ff, transparent: true, opacity: 0.5 })), `ring${i}`);
          ring.rotation.x = -Math.PI / 2;
          ring.position.y = 0.05;
        }
        break;
      }
      case 'blueberries': {
        for (let i = 0; i < 14; i++) {
          const berry = add(new THREE.Mesh(new THREE.SphereGeometry(0.09 + (i % 3) * 0.02, 8, 6), new THREE.MeshStandardMaterial({ color: 0x6d7890, roughness: 0.75, metalness: 0.25 })), `berry${i}`);
          berry.position.set(Math.cos(i * 2.1) * (0.2 + (i % 4) * 0.18), 0.04, Math.sin(i * 2.1) * (0.2 + (i % 4) * 0.18));
        }
        break;
      }
      case 'signal': {
        for (let i = 0; i < 3; i++) {
          const ring = add(new THREE.Mesh(new THREE.TorusGeometry(0.35 + i * 0.28, 0.025, 6, 30), new THREE.MeshBasicMaterial({ color: 0x9fd8ff, transparent: true, opacity: 0.55 })), `ring${i}`);
          ring.rotation.x = -Math.PI / 2;
        }
        for (let i = 0; i < 4; i++) {
          const bar = add(new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.4, 0.12), new THREE.MeshBasicMaterial({ color: 0x9fd8ff })), `bar${i}`);
          bar.position.set(-0.45 + i * 0.3, 0.4, 0);
        }
        break;
      }
      case 'counter': {
        const plate = add(new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.85, 0.08), new THREE.MeshStandardMaterial({ color: 0x10151f, roughness: 0.5, metalness: 0.4 })), 'plate');
        plate.position.y = 0.2;
        for (let i = 0; i < 10; i++) {
          const bar = add(new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.5, 0.06), new THREE.MeshBasicMaterial({ color: i < 9 ? 0x9fd8ff : 0xffd97d })), `bar${i}`);
          bar.position.set(-0.78 + i * 0.173, 0.2, 0.06);
        }
        break;
      }
      case 'footprint': {
        const sole = add(new THREE.Mesh(new THREE.SphereGeometry(0.28, 12, 8), new THREE.MeshStandardMaterial({ color: 0x3b3b40, roughness: 1 })), 'sole');
        sole.scale.set(0.65, 0.08, 1.15);
        const heel = add(new THREE.Mesh(new THREE.SphereGeometry(0.18, 10, 8), new THREE.MeshStandardMaterial({ color: 0x3b3b40, roughness: 1 })), 'heel');
        heel.position.z = 0.34;
        heel.scale.set(0.7, 0.08, 0.75);
        break;
      }
    }

    const base = this.equipment.position.clone();
    switch (kind) {
      case 'probe': base.add(new THREE.Vector3(5.5, 3.2, -9)); break;
      case 'rocket': base.add(new THREE.Vector3(-5, 1.5, 1)); break;
      case 'lander': base.add(new THREE.Vector3(0, 1.15, 0)); break;
      case 'rover': base.add(new THREE.Vector3(-5, 0.35, 2)); break;
      case 'astronaut': base.add(new THREE.Vector3(-4, 0.05, 2.5)); break;
      case 'craft': base.add(new THREE.Vector3(0, 2.4, -2)); break;
      case 'film': base.add(new THREE.Vector3(0, 2.5, 1.5)); break;
      case 'sample': base.add(new THREE.Vector3(1.6, 0.5, 1.2)); break;
      case 'flag': base.add(new THREE.Vector3(1.8, 1.2, 1.5)); break;
      case 'golfball': base.add(new THREE.Vector3(-1, 0.4, 2.2)); break;
      case 'mole': base.add(new THREE.Vector3(1.2, 0.1, 1.2)); break;
      case 'earth': base.add(new THREE.Vector3(0, -3.4, -14)); break;
      case 'moon': base.add(new THREE.Vector3(0, 1, -14)); break;
      case 'map': base.add(new THREE.Vector3(0, 0.18, 0)); break;
      case 'sun': base.add(new THREE.Vector3(0, 5.5, -16)); break;
      case 'airbag': base.add(new THREE.Vector3(0, 4.5, 0)); break;
      case 'petals': base.add(new THREE.Vector3(0, 0.8, 0)); break;
      case 'dropkit': base.add(new THREE.Vector3(0, 3.6, 1)); break;
      case 'scoop': base.add(new THREE.Vector3(1.2, 1.1, 1)); break;
      case 'seismic': base.add(new THREE.Vector3(1.3, 0.05, 1.2)); break;
      case 'blueberries': base.add(new THREE.Vector3(0.8, 0.05, 1.2)); break;
      case 'signal': base.add(new THREE.Vector3(0, 1.5, 0)); break;
      case 'counter': base.add(new THREE.Vector3(0, 3.2, -3)); break;
      case 'footprint': base.add(new THREE.Vector3(0, 0.05, 1.8)); break;
    }
    group.position.copy(base);
    group.userData.base = base.clone();
    group.userData.parts = parts;
    this.scene.add(group);
    return { group, parts, base, motion, start, duration };
  }

  private animateActor(actor: ActiveActor, p: number, elapsed: number) {
    const { group, parts, base, motion } = actor;
    const e = smooth(p);
    group.rotation.set(0, group.rotation.y, 0);
    group.scale.setScalar(1);

    switch (motion) {
      case 'fly-past':
        group.position.set(base.x + 6 - p * 15, base.y + Math.sin(p * Math.PI) * 2.4, base.z - p * 12);
        group.rotation.y = p * 3;
        break;
      case 'launch':
        group.position.set(base.x, base.y + p * 14, base.z);
        group.rotation.z = Math.sin(elapsed * 8) * 0.02 * (1 - p);
        if (parts.flame) {
          parts.flame.visible = p < 0.92;
          parts.flame.scale.set(1 + Math.random() * 0.35, 1 + Math.random() * 0.55, 1 + Math.random() * 0.35);
        }
        break;
      case 'descend':
        group.position.set(base.x + Math.sin(p * 8) * 0.2, base.y + 7.2 * (1 - e), base.z);
        group.rotation.z = Math.sin(p * 10) * 0.05;
        if (parts.engineGlow) {
          const glow = parts.engineGlow as THREE.Mesh;
          glow.scale.setScalar(1 + Math.sin(elapsed * 20) * 0.18);
          glow.visible = p < 0.94;
        }
        break;
      case 'land':
        group.position.set(base.x, base.y + 3.4 * (1 - e), base.z);
        group.rotation.z = Math.sin(p * 12) * 0.04 * (1 - p);
        if (parts.engineGlow) parts.engineGlow.visible = p < 0.82;
        break;
      case 'bounce':
        group.position.set(base.x - 3 + p * 6, base.y + Math.abs(Math.sin(p * Math.PI * 4)) * 2.8 * (1 - p), base.z);
        group.rotation.z = -p * Math.PI * 2;
        group.scale.setScalar(1 - p * 0.18);
        break;
      case 'unfold':
        group.scale.setScalar(0.55 + e * 0.45);
        group.rotation.y = -0.6 + p * 0.6;
        if (parts.deck) parts.deck.scale.set(1, 0.2 + e * 0.8, 1);
        Object.entries(parts).forEach(([name, part]) => {
          if (name.startsWith('wheel')) part.rotation.x = p * Math.PI * 3;
        });
        break;
      case 'scan':
        group.rotation.y = Math.sin(elapsed * 0.9) * 0.25;
        Object.entries(parts).forEach(([name, part]) => {
          if (name.startsWith('frame')) {
            const index = Number(name.replace('frame', ''));
            part.scale.y = clamp01(p * 1.6 - index * 0.08);
          }
        });
        if (parts.strip) parts.strip.rotation.z = -0.12 + Math.sin(elapsed * 2) * 0.02;
        break;
      case 'orbit': {
        const angle = p * Math.PI * 2;
        group.position.set(base.x + Math.cos(angle) * 6.5, base.y + Math.sin(angle * 2) * 1.2, base.z + Math.sin(angle) * 6.5);
        group.rotation.y = -angle;
        break;
      }
      case 'earthrise':
        group.position.set(base.x, base.y + p * 6.4, base.z);
        group.rotation.y = p * 0.5;
        break;
      case 'impact':
        group.position.set(base.x - 4 + p * 4, base.y - p * 2.2, base.z + p * 3);
        group.scale.setScalar(Math.max(0.12, 1 - p * 0.88));
        group.rotation.z = p * 4;
        break;
      case 'splash':
        group.position.set(base.x, base.y + 5.2 * (1 - e), base.z);
        group.rotation.z = Math.sin(p * 12) * 0.15;
        break;
      case 'vent':
        group.rotation.z = Math.sin(elapsed * 24) * 0.06;
        group.rotation.y = Math.sin(elapsed * 6) * 0.08;
        if (parts.engine) (parts.engine as THREE.Mesh).scale.setScalar(1 + Math.sin(elapsed * 18) * 0.15);
        break;
      case 'dock':
        group.position.set(base.x - 5 * (1 - e), base.y + Math.sin(p * Math.PI) * 0.5, base.z);
        group.rotation.y = (1 - e) * 0.9;
        break;
      case 'drive':
        group.position.set(base.x + p * 10, base.y + Math.sin(p * 14) * 0.04, base.z);
        Object.entries(parts).forEach(([name, part]) => {
          if (name.startsWith('wheel')) part.rotation.x = p * Math.PI * 18;
        });
        break;
      case 'climb':
        group.position.set(base.x + p * 5, base.y + p * 2.8, base.z + p * 3);
        group.rotation.z = -0.15;
        if (parts.body) parts.body.rotation.z = Math.sin(p * 12) * 0.04;
        Object.entries(parts).forEach(([name, part]) => {
          if (name.startsWith('wheel')) part.rotation.x = p * Math.PI * 14;
        });
        break;
      case 'walk':
        group.position.set(base.x + p * 8, base.y + Math.abs(Math.sin(p * Math.PI * 8)) * 0.16, base.z);
        group.rotation.y = Math.PI / 2;
        if (parts.legL) parts.legL.rotation.x = Math.sin(p * Math.PI * 8) * 0.5;
        if (parts.legR) parts.legR.rotation.x = -Math.sin(p * Math.PI * 8) * 0.5;
        break;
      case 'dig':
        if (parts.arm) parts.arm.rotation.z = -0.55 - Math.sin(p * Math.PI) * 0.85;
        if (parts.bucket) {
          parts.bucket.position.y = -0.58 - Math.sin(p * Math.PI) * 0.45;
          parts.bucket.rotation.z = Math.sin(p * Math.PI) * 0.6;
        }
        break;
      case 'drop':
        if (parts.hammer) parts.hammer.position.y = -p * 2.6;
        if (parts.hammerHead) parts.hammerHead.position.y = 0.3 - p * 2.6;
        if (parts.feather) parts.feather.position.y = -p * 2.6;
        group.rotation.y = Math.sin(elapsed * 0.7) * 0.08;
        break;
      case 'glow':
        group.scale.setScalar(1 + Math.sin(p * Math.PI * 4) * 0.08);
        group.rotation.y = p * 1.4;
        if (parts.rock) {
          const mat = (parts.rock as THREE.Mesh).material as THREE.MeshStandardMaterial;
          mat.emissiveIntensity = 0.15 + Math.sin(p * Math.PI) * 1.4;
        }
        if (parts.planet) {
          const mat = (parts.planet as THREE.Mesh).material as THREE.MeshStandardMaterial;
          mat.emissiveIntensity = 0.35 + Math.sin(p * Math.PI) * 0.65;
        }
        break;
      case 'pins':
        Object.entries(parts).forEach(([name, part]) => {
          if (!name.startsWith('pin')) return;
          const index = Number(name.replace('pin', ''));
          part.scale.setScalar(clamp01(p * 6 - index));
        });
        if (parts.disc) parts.disc.rotation.z = p * 0.4;
        break;
      case 'free-return': {
        const angle = p * Math.PI * 2;
        group.position.set(base.x + Math.sin(angle) * 6.5, base.y + Math.cos(angle * 2) * 2.4, base.z + Math.cos(angle) * 3.5);
        group.rotation.y = -angle;
        break;
      }
      case 'quake':
        group.position.set(base.x + Math.sin(elapsed * 32) * 0.08, base.y + Math.cos(elapsed * 27) * 0.05, base.z);
        Object.entries(parts).forEach(([name, part]) => {
          if (!name.startsWith('ring')) return;
          const index = Number(name.replace('ring', ''));
          part.scale.setScalar(0.6 + clamp01(p * 1.8 - index * 0.35) * 1.8);
        });
        break;
      case 'fade':
        group.scale.setScalar(1 - p * 0.25);
        group.rotation.y = p * 0.6;
        this.setOpacity(group, 1 - p * 0.92);
        break;
      case 'sink':
        group.position.set(base.x, base.y - p * 1.2, base.z);
        group.rotation.z = p * 0.3;
        break;
      case 'stuck':
        group.position.set(base.x + Math.sin(elapsed * 8) * 0.08, base.y - p * 0.35, base.z);
        group.rotation.z = p * 0.25;
        if (parts.wheel0) parts.wheel0.rotation.x = p * Math.PI * 12;
        break;
      case 'frost':
        group.scale.setScalar(1 - p * 0.35);
        this.setOpacity(group, 1 - p * 0.8);
        break;
      case 'open':
        Object.entries(parts).forEach(([name, part]) => {
          if (!name.startsWith('petal')) return;
          const index = Number(name.replace('petal', ''));
          part.rotation.z = -p * 0.9;
          part.rotation.y = -index * Math.PI * 2 / 3 + p * 0.4;
        });
        if (parts.rover) parts.rover.position.y = 0.2 + p * 0.4;
        break;
      case 'hop':
        group.position.set(base.x, base.y + Math.sin(p * Math.PI) * 3, base.z);
        group.rotation.z = Math.sin(p * Math.PI) * 0.4;
        break;
      case 'signal':
        Object.entries(parts).forEach(([name, part]) => {
          if (!name.startsWith('ring')) return;
          const index = Number(name.replace('ring', ''));
          part.scale.setScalar(0.7 + clamp01(p * 1.7 - index * 0.3) * 1.4);
          this.setOpacity(part, 1 - p * 0.9);
        });
        break;
      case 'assemble':
        if (parts.filter) {
          parts.filter.position.x = -0.7 + p * 0.7;
          parts.filter.rotation.z = p * Math.PI;
        }
        if (parts.bucket) parts.bucket.position.y = -0.58 + p * 0.58;
        break;
      case 'collect':
        group.position.set(base.x - p * 1.2, base.y + p * 0.5, base.z - p * 1);
        group.scale.setScalar(1 + p * 0.4);
        group.rotation.y = p * 2;
        break;
      case 'fly':
        group.position.set(base.x + p * 6, base.y + Math.sin(p * Math.PI) * 3.4, base.z - p * 2);
        group.rotation.z = p * 5;
        break;
      case 'reboot':
        Object.entries(parts).forEach(([name, part]) => {
          if (!name.startsWith('bar')) return;
          const index = Number(name.replace('bar', ''));
          part.scale.y = clamp01(p * 5 - index);
        });
        break;
      case 'counter':
        Object.entries(parts).forEach(([name, part]) => {
          if (!name.startsWith('bar')) return;
          const index = Number(name.replace('bar', ''));
          part.scale.y = clamp01(p * 2.2 - index * 0.11);
        });
        break;
      case 'hide':
        group.position.set(base.x + 6 - p * 6, base.y + p * 1.2, base.z - p * 8);
        group.rotation.y = p * 0.8;
        break;
      case 'ramp':
        group.position.set(base.x + p * 3.2, base.y + 1.5 * (1 - e), base.z);
        group.rotation.z = -0.2 * (1 - p);
        Object.entries(parts).forEach(([name, part]) => {
          if (name.startsWith('wheel')) part.rotation.x = p * Math.PI * 10;
        });
        break;
      case 'pulse':
        group.scale.setScalar(1 + Math.sin(p * Math.PI * 5) * 0.12);
        group.rotation.z = Math.sin(elapsed * 20) * 0.08;
        break;
      case 'sweep':
        group.rotation.y = p * Math.PI * 2;
        break;
      case 'erupt':
        group.scale.setScalar(1 + p * 0.8);
        this.setOpacity(group, 1 - p * 0.8);
        break;
      case 'cruise':
      default:
        group.position.set(base.x + Math.sin(p * Math.PI * 2) * 1.8, base.y + Math.sin(p * Math.PI) * 0.5, base.z - p * 4);
        group.rotation.y = p * 0.6;
        break;
    }
  }

  private setOpacity(object: THREE.Object3D, opacity: number) {
    object.traverse((child) => {
      const mesh = child as THREE.Mesh;
      const mats = Array.isArray(mesh.material) ? mesh.material : mesh.material ? [mesh.material] : [];
      mats.forEach((material) => {
        material.transparent = true;
        material.opacity = opacity;
        material.depthWrite = opacity > 0.9;
      });
    });
  }

  private createParticles(kind: CueParticle, start: number, duration: number): ParticleField {
    const count = kind === 'storm' ? 260 : kind === 'dust' ? 140 : 110;
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    const color = kind === 'sparks' || kind === 'vent' ? 0xffb35c
      : kind === 'ice' || kind === 'snow' ? 0xdff2ff
      : kind === 'storm' ? 0xc07a4a
      : 0xc9bca8;
    const origin = this.equipment.position;

    for (let i = 0; i < count; i++) {
      let x = 0, y = 0, z = 0, vx = 0, vy = 0, vz = 0;
      if (kind === 'dust') {
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * 1.8;
        x = origin.x + Math.cos(angle) * radius;
        z = origin.z + Math.sin(angle) * radius;
        y = origin.y + 0.08 + Math.random() * 0.18;
        vx = Math.cos(angle) * (0.4 + Math.random() * 1.6);
        vz = Math.sin(angle) * (0.4 + Math.random() * 1.6);
        vy = 0.35 + Math.random() * 0.8;
      } else if (kind === 'sparks') {
        x = origin.x + (Math.random() - 0.5) * 1.8;
        y = origin.y + 0.4 + Math.random() * 1.8;
        z = origin.z + (Math.random() - 0.5) * 1.8;
        vx = (Math.random() - 0.5) * 3;
        vy = Math.random() * 2.5;
        vz = (Math.random() - 0.5) * 3;
      } else if (kind === 'vent') {
        x = origin.x + (Math.random() - 0.5) * 0.8;
        y = origin.y + 0.8 + Math.random() * 0.8;
        z = origin.z + (Math.random() - 0.5) * 0.8;
        vx = (Math.random() - 0.5) * 2.4;
        vy = 0.4 + Math.random() * 2.4;
        vz = (Math.random() - 0.5) * 2.4;
      } else if (kind === 'ice' || kind === 'snow') {
        x = origin.x + (Math.random() - 0.5) * 4.5;
        y = origin.y + 1 + Math.random() * 3;
        z = origin.z + (Math.random() - 0.5) * 4.5;
        vy = -(0.5 + Math.random() * 0.8);
        vx = (Math.random() - 0.5) * 0.2;
      } else {
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * 26;
        x = origin.x + Math.cos(angle) * radius;
        y = origin.y + 0.5 + Math.random() * 12;
        z = origin.z + Math.sin(angle) * radius;
        vx = 1.2 + Math.random() * 2.2;
        vy = (Math.random() - 0.5) * 0.4;
        vz = (Math.random() - 0.5) * 0.6;
      }
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      velocities[i * 3] = vx;
      velocities[i * 3 + 1] = vy;
      velocities[i * 3 + 2] = vz;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const material = new THREE.PointsMaterial({
      color,
      size: kind === 'storm' ? 0.22 : kind === 'sparks' ? 0.1 : 0.16,
      transparent: true,
      opacity: 0.8,
      depthWrite: false,
      blending: kind === 'sparks' ? THREE.AdditiveBlending : THREE.NormalBlending,
    });
    const points = new THREE.Points(geometry, material);
    this.scene.add(points);
    return { points, velocities, kind, start, duration };
  }

  private animateParticles(field: ParticleField, dt: number, cueProgress: number) {
    const position = field.points.geometry.attributes.position as THREE.BufferAttribute;
    const array = position.array as Float32Array;
    const elapsed = this.time - field.start;
    const fade = Math.max(0, 1 - cueProgress * 0.9);
    const material = field.points.material as THREE.PointsMaterial;
    material.opacity = fade * 0.85;

    for (let i = 0; i < position.count; i++) {
      const i3 = i * 3;
      array[i3] += field.velocities[i3] * dt;
      array[i3 + 1] += field.velocities[i3 + 1] * dt;
      array[i3 + 2] += field.velocities[i3 + 2] * dt;
      if (field.kind === 'dust' || field.kind === 'sparks') field.velocities[i3 + 1] -= dt * 1.5;
      if (field.kind === 'storm') {
        array[i3] += dt * (0.8 + (i % 5) * 0.2);
        array[i3 + 1] += Math.sin(elapsed + i) * dt * 0.15;
      }
      if (array[i3 + 1] < -1) array[i3 + 1] = 6 + (i % 5);
    }
    position.needsUpdate = true;
  }

  private clearActor() {
    if (!this.active) return;
    this.scene.remove(this.active.group);
    this.disposeObject(this.active.group);
    this.active = null;
  }

  private clearParticles() {
    this.particles.forEach((field) => {
      this.scene.remove(field.points);
      this.disposeObject(field.points);
    });
    this.particles = [];
  }

  private disposeObject(object: THREE.Object3D) {
    const textures = new Set<THREE.Texture>();
    object.traverse((child) => {
      const mesh = child as THREE.Mesh;
      mesh.geometry?.dispose();
      const mats = Array.isArray(mesh.material) ? mesh.material : mesh.material ? [mesh.material] : [];
      mats.forEach((material) => {
        Object.values(material).forEach((value) => { if (value instanceof THREE.Texture) textures.add(value); });
        material.dispose();
      });
    });
    textures.forEach((texture) => texture.dispose());
  }

  dispose() {
    this.clearActor();
    this.clearParticles();
    this.scene.remove(this.flashLight);
    this.flashLight.dispose();
    this.camera.remove(this.flash);
    this.scene.remove(this.camera);
    this.flash.geometry.dispose();
    this.flashMaterial.dispose();
    if (this.scene.background instanceof THREE.Color) this.scene.background.copy(this.baseBg);
    if (this.scene.fog && this.baseFog) this.scene.fog.color.copy(this.baseFog);
  }
}
