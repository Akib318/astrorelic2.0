import * as THREE from 'three';
import { store, type Phase, type Graphics } from '../state/store';
import { audio } from './audio';
import type { Scene } from './utils';
import { HomeScene } from './scenes/home';
import { SolarScene } from './scenes/solar';
import { MarsCinematicScene } from './scenes/cinematic';
import { MarsWorldScene } from './scenes/marsWorld';
import { StoryScene } from './scenes/story';
import { InspectScene } from './scenes/inspect';
import { CompleteScene } from './scenes/complete';
import { getMission, nextMission, type Destination } from '../data/missions';

function makeScene(phase: Phase, renderer: THREE.WebGLRenderer): Scene | null {
  switch (phase) {
    case 'home': return new HomeScene(renderer);
    case 'solar': return new SolarScene(renderer);
    case 'map': return new SolarScene(renderer, true);
    case 'cinematic': return new MarsCinematicScene(renderer);
    case 'explore': return new MarsWorldScene(renderer);
    case 'story': return new StoryScene(renderer);
    case 'inspect': return new InspectScene(renderer);
    case 'complete': return new CompleteScene(renderer);
    default: return null;
  }
}

export class Engine {
  private renderer: THREE.WebGLRenderer;
  private scene: Scene | null = null;
  private clock = new THREE.Clock();
  private disposers: (() => void)[] = [];
  private pointerDown = false;
  private downAt = { x: 0, y: 0 };
  private rafId = 0;
  private container: HTMLElement;
  private transitionTimer = 0;
  private graphics: Graphics;

  constructor(container: HTMLElement) {
    this.container = container;
    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    this.graphics = store.get().graphics;
    this.applyGraphics(this.graphics);
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.08;
    container.appendChild(this.renderer.domElement);
    // TEMP runtime inspection hook — removed after the lunar terrain audit.
    audio.setMuted(store.get().muted);

    window.addEventListener('resize', this.onResize);
    const el = this.renderer.domElement;
    el.addEventListener('pointerdown', this.onPointerDown);
    window.addEventListener('pointermove', this.onPointerMove);
    window.addEventListener('pointerup', this.onPointerUp);
    el.addEventListener('wheel', this.onWheel, { passive: false });
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
    window.addEventListener('blur', this.onBlur);
    this.disposers.push(store.subscribe(() => {
      if (store.get().graphics !== this.graphics) {
        this.graphics = store.get().graphics; this.applyGraphics(this.graphics);
      }
    }));
    this.disposers.push(store.on('engine:goto', (d) => this.transitionTo(d as Phase)));
    this.onBus('start', () => { audio.play('space'); this.transitionTo('solar'); });
    this.onBus('choose:moon', () => this.chooseDestination('moon'));
    this.onBus('choose:mars', () => this.chooseDestination('mars'));
    this.onBus('startMission', (data) => {
      const d = data as { id: string; destination: Destination };
      store.beginMission(d.id, d.destination); this.transitionTo('cinematic');
    });
    this.onBus('hearStory', () => this.transitionTo('story'));
    this.onBus('storyFinished', () => {
      store.set({ storyDone: true, showStory: false });
      this.transitionTo(getMission(store.get().activeMission).surface ? 'explore' : 'inspect');
    });
    this.onBus('openInspect', () => this.transitionTo('inspect'));
    this.onBus('finishInspect', () => {
      const mission = getMission(store.get().activeMission);
      store.completeMission(mission.id, mission.destination); this.transitionTo('complete');
    });
    this.onBus('nextChapter', () => {
      const next = nextMission(store.get().activeMission);
      if (next) { store.beginMission(next.id, next.destination); this.transitionTo('cinematic'); }
      else this.transitionTo('map');
    });
    this.onBus('toSolar', () => { store.set({ showChoice: false, paused: false }); this.transitionTo('solar'); });
    this.onBus('toDestinations', () => { store.set({ showChoice: true, paused: false }); this.transitionTo('solar'); });
    this.onBus('toMap', () => { store.set({ paused: false }); this.transitionTo('map'); });
    this.onBus('replay', () => {
      const mission = getMission(store.get().activeMission);
      store.beginMission(mission.id, mission.destination); this.transitionTo('cinematic');
    });
    this.onBus('togglePause', () => store.set({ paused: !store.get().paused }));

    const params = new URLSearchParams(location.search);
    const missionParam = params.get('mission');
    if (missionParam) {
      const mission = getMission(missionParam); store.beginMission(mission.id, mission.destination);
    }
    const destination = params.get('destination');
    if (destination === 'moon' || destination === 'mars') store.set({ destination });
    const forced = params.get('phase') as Phase | null;
    const valid: Phase[] = ['home', 'solar', 'cinematic', 'explore', 'story', 'inspect', 'complete', 'map'];
    const initial: Phase = forced && valid.includes(forced) ? forced : 'home';
    this.setPhase(initial); store.set({ phase: initial }); this.loop();
  }

  private applyGraphics(level: Graphics) {
    const ratio = level === 'low' ? 1 : level === 'high' ? 2 : 1.5;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, ratio));
    this.renderer.shadowMap.enabled = level !== 'low';
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
  }
  private chooseDestination(destination: Destination) {
    store.set({ destination, showChoice: false, current: null, queue: [], choices: null, paused: false });
    this.transitionTo('map');
  }
  private onBus(event: string, fn: (data?: unknown) => void) { this.disposers.push(store.on(event, fn)); }
  transitionTo(phase: Phase) {
    store.set({ fading: true });
    window.clearTimeout(this.transitionTimer);
    this.transitionTimer = window.setTimeout(() => {
      this.setPhase(phase); store.set({ phase, fading: false });
    }, 420);
  }
  private setPhase(phase: Phase) {
    this.scene?.dispose(); this.scene = makeScene(phase, this.renderer); this.clock.getDelta();
  }
  private onResize = () => {
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    (this.scene as any)?.resize?.(this.container.clientWidth, this.container.clientHeight);
  };
  private norm(e: PointerEvent | WheelEvent): [number, number] {
    const rect = this.renderer.domElement.getBoundingClientRect();
    return [((e.clientX - rect.left) / rect.width) * 2 - 1, -((e.clientY - rect.top) / rect.height) * 2 + 1];
  }
  private onPointerDown = (e: PointerEvent) => {
    this.pointerDown = true; this.downAt = { x: e.clientX, y: e.clientY };
    const [x, y] = this.norm(e); this.scene?.onPointerDown?.(x, y);
  };
  private onPointerMove = (e: PointerEvent) => {
    const [x, y] = this.norm(e); this.scene?.onPointerMove?.(x, y, this.pointerDown);
  };
  private onPointerUp = (e?: PointerEvent) => {
    if (this.pointerDown && e) {
      const dx = e.clientX - this.downAt.x, dy = e.clientY - this.downAt.y;
      if (Math.hypot(dx, dy) < 6) { const [x, y] = this.norm(e); (this.scene as any)?.onClick?.(x, y); }
    }
    this.pointerDown = false; this.scene?.onPointerUp?.();
  };
  private onWheel = (e: WheelEvent) => { e.preventDefault(); this.scene?.onWheel?.(e.deltaY); };
  private onKeyDown = (e: KeyboardEvent) => {
    if (e.code === 'Escape' && !['home', 'solar', 'map'].includes(store.get().phase)) {
      store.set({ paused: !store.get().paused }); return;
    }
    this.scene?.onKey?.(e.code, true);
  };
  private onKeyUp = (e: KeyboardEvent) => this.scene?.onKey?.(e.code, false);
  private onBlur = () => { if (store.get().phase === 'explore') store.set({ paused: true }); };
  private loop = () => {
    this.rafId = requestAnimationFrame(this.loop);
    const dt = Math.min(this.clock.getDelta(), 0.05);
    if (!store.get().paused) this.scene?.update(dt, this.clock.elapsedTime);
  };
  dispose() {
    cancelAnimationFrame(this.rafId); window.clearTimeout(this.transitionTimer);
    this.scene?.dispose(); this.disposers.forEach((d) => d());
    window.removeEventListener('resize', this.onResize);
    window.removeEventListener('pointermove', this.onPointerMove);
    window.removeEventListener('pointerup', this.onPointerUp);
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
    window.removeEventListener('blur', this.onBlur);
    const el = this.renderer.domElement;
    el.removeEventListener('pointerdown', this.onPointerDown); el.removeEventListener('wheel', this.onWheel);
    this.renderer.dispose(); this.renderer.forceContextLoss();
    if (el.parentElement === this.container) this.container.removeChild(el);
  }
}
