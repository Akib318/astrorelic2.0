import { useSyncExternalStore } from 'react';
import type { Destination } from '../data/missions';

export type Lang = 'en' | 'bn';
export type Graphics = 'low' | 'medium' | 'high';
export type Phase = 'home' | 'solar' | 'cinematic' | 'explore' | 'story' | 'inspect' | 'complete' | 'map';
export type Speaker = 'nova' | 'sojourner' | 'narrator';
export interface DialogueLine { speaker: Speaker; en: string; bn: string }
export interface Choice { en: string; bn: string; action: string; data?: unknown }

interface GameState {
  phase: Phase;
  lang: Lang;
  muted: boolean;
  graphics: Graphics;
  destination: Destination;
  activeMission: string;
  completedMoon: string[];
  completedMars: string[];
  discovered: Record<string, string[]>;
  chaptersDone: Record<string, string[]>;
  queue: DialogueLine[];
  current: DialogueLine | null;
  choices: Choice[] | null;
  objective: { en: string; bn: string } | null;
  caption: { en: string; bn: string } | null;
  hint: { en: string; bn: string } | null;
  showChoice: boolean;
  showStory: boolean;
  storyIndex: number;
  visitedHotspots: string[];
  activeHotspot: string | null;
  tutorialDone: boolean;
  fading: boolean;
  storyDone: boolean;
  paused: boolean;
  modelStatus: 'loading' | 'ready' | 'fallback';
}

const persisted = (() => {
  try { return JSON.parse(localStorage.getItem('astro-relic') || '{}'); }
  catch { return {}; }
})();

const stringArray = (value: unknown): string[] => Array.isArray(value) ? value.filter((x) => typeof x === 'string') : [];
const chapterMap = (value: unknown): Record<string, string[]> => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  const result: Record<string, string[]> = {};
  for (const [mission, ids] of Object.entries(value)) {
    const clean = stringArray(ids);
    if (clean.length) result[mission] = clean;
  }
  return result;
};
const legacyMars = stringArray(persisted.flags).filter((x) => ['pathfinder', 'spirit', 'opportunity', 'phoenix', 'insight'].includes(x));

class Store {
  state: GameState = {
    phase: 'home',
    lang: persisted.lang === 'bn' ? 'bn' : 'en',
    muted: !!persisted.muted,
    graphics: ['low', 'medium', 'high'].includes(persisted.graphics) ? persisted.graphics : 'medium',
    destination: persisted.destination === 'moon' ? 'moon' : 'mars',
    activeMission: typeof persisted.activeMission === 'string' ? persisted.activeMission : 'pathfinder',
    completedMoon: stringArray(persisted.completedMoon),
    completedMars: [...new Set([...stringArray(persisted.completedMars), ...legacyMars])],
    discovered: persisted.discovered && typeof persisted.discovered === 'object' ? persisted.discovered : {},
    chaptersDone: chapterMap(persisted.chaptersDone),
    queue: [], current: null, choices: null, objective: null, caption: null, hint: null,
    showChoice: false, showStory: false, storyIndex: 0, visitedHotspots: [], activeHotspot: null,
    tutorialDone: !!persisted.tutorialDone, fading: false, storyDone: false, paused: false, modelStatus: 'loading',
  };

  private listeners = new Set<() => void>();
  private bus = new Map<string, Set<(d?: unknown) => void>>();
  subscribe = (fn: () => void) => { this.listeners.add(fn); return () => this.listeners.delete(fn); };
  get = () => this.state;

  set(partial: Partial<GameState>) {
    this.state = { ...this.state, ...partial };
    const saveKeys: (keyof GameState)[] = ['lang', 'muted', 'graphics', 'destination', 'activeMission', 'completedMoon', 'completedMars', 'discovered', 'chaptersDone', 'tutorialDone'];
    if (saveKeys.some((key) => key in partial)) this.save();
    this.listeners.forEach((fn) => fn());
  }

  private save() {
    try {
      const s = this.state;
      localStorage.setItem('astro-relic', JSON.stringify({
        version: 2, lang: s.lang, muted: s.muted, graphics: s.graphics, destination: s.destination,
        activeMission: s.activeMission, completedMoon: s.completedMoon, completedMars: s.completedMars,
        discovered: s.discovered, chaptersDone: s.chaptersDone, tutorialDone: s.tutorialDone,
      }));
    } catch { /* Browser storage may be unavailable; gameplay remains functional. */ }
  }

  completed(destination: Destination) { return destination === 'moon' ? this.state.completedMoon : this.state.completedMars; }

  isUnlocked(id: string, ordered: string[]) {
    const index = ordered.indexOf(id);
    if (index <= 0) return index === 0;
    return this.completed(this.state.destination).includes(ordered[index - 1]);
  }

  completeMission(id: string, destination: Destination) {
    const key = destination === 'moon' ? 'completedMoon' : 'completedMars';
    const current = this.state[key];
    if (!current.includes(id)) this.set({ [key]: [...current, id] });
  }

  discover(mission: string, id: string) {
    const current = this.state.discovered[mission] || [];
    if (current.includes(id)) return;
    this.set({ discovered: { ...this.state.discovered, [mission]: [...current, id] } });
  }

  chaptersDoneFor(mission: string) {
    return this.state.chaptersDone[mission] || [];
  }

  isChapterDone(mission: string, chapter: string) {
    return this.chaptersDoneFor(mission).includes(chapter);
  }

  markChapterDone(mission: string, chapter: string) {
    const current = this.chaptersDoneFor(mission);
    if (current.includes(chapter)) return;
    this.set({ chaptersDone: { ...this.state.chaptersDone, [mission]: [...current, chapter] } });
  }

  resetMissionChapters(mission: string) {
    if (!this.state.chaptersDone[mission]) return;
    const next = { ...this.state.chaptersDone };
    delete next[mission];
    this.set({ chaptersDone: next });
  }

  beginMission(id: string, destination: Destination) {
    this.set({
      activeMission: id, destination, visitedHotspots: [], activeHotspot: null,
      storyDone: false, showStory: false, objective: null, hint: null, caption: null,
      current: null, queue: [], choices: null, paused: false, modelStatus: 'loading',
    });
  }

  say(lines: DialogueLine[], choices?: Choice[] | null) {
    const [current, ...rest] = lines;
    this.set({ current: current ?? null, queue: rest, choices: choices ?? null });
  }
  advanceDialogue() {
    const [current, ...rest] = this.state.queue;
    this.set({ current: current ?? null, queue: rest });
    return current ?? null;
  }
  clearDialogue() { this.set({ current: null, queue: [], choices: null }); }
  on(event: string, fn: (d?: unknown) => void) {
    if (!this.bus.has(event)) this.bus.set(event, new Set());
    this.bus.get(event)!.add(fn);
    return () => { this.bus.get(event)?.delete(fn); };
  }
  emit(event: string, data?: unknown) { this.bus.get(event)?.forEach((fn) => fn(data)); }
}

export const store = new Store();
export function useGame<T>(selector: (s: GameState) => T): T {
  return useSyncExternalStore(store.subscribe, () => selector(store.get()));
}
export function t(pair: { en: string; bn: string } | null, lang: Lang): string {
  if (!pair) return '';
  return lang === 'bn' ? pair.bn : pair.en;
}
