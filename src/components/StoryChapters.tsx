import { useEffect, useRef, useState, type CSSProperties } from 'react';
import {
  ArrowLeft, ArrowRight, Check, ChevronRight, Hand, MousePointerClick,
  MoveHorizontal, Sparkles, Target,
} from 'lucide-react';
import { store, useGame, t } from '../state/store';
import { UI } from '../data/content';
import { getMission } from '../data/missions';
import { chaptersFor, type ChapterInteraction, type ChapterText } from '../data/missionChapters';

const EMPTY: string[] = [];
const clamp01 = (value: number) => Math.max(0, Math.min(1, value));
const POP = 'cubic-bezier(.785, .135, .15, .01)';
const controlClass = 'cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffd97d] focus-visible:ring-offset-2 focus-visible:ring-offset-black transition-colors';

type Feedback = { tone: 'success' | 'info' | 'error'; text: ChapterText };

function TapInteraction({ prompt, lang, onComplete }: { prompt: ChapterText; lang: 'en' | 'bn'; onComplete: () => void }) {
  return (
    <button
      onClick={onComplete}
      className={`${controlClass} story-tap group w-full min-h-[104px] border border-[#ffd97d]/35 bg-black/25 px-4 py-4 flex flex-col items-center justify-center gap-2`}
      style={{ transitionTimingFunction: POP }}
    >
      <span className="story-tap__rings" aria-hidden="true">
        <MousePointerClick size={28} />
      </span>
      <span className="text-xs md:text-sm leading-6 text-[#f3ede0] text-center">{t(prompt, lang)}</span>
      <span className="text-[9px] tracking-[0.28em] text-[#ffd97d]/80">{t(UI.tapControl, lang)}</span>
    </button>
  );
}

function HoldInteraction({ prompt, lang, onComplete }: { prompt: ChapterText; lang: 'en' | 'bn'; onComplete: () => void }) {
  const duration = 1500;
  const [holding, setHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const startRef = useRef(0);
  const completeRef = useRef(onComplete);
  const doneRef = useRef(false);
  useEffect(() => { completeRef.current = onComplete; }, [onComplete]);

  const begin = () => {
    if (doneRef.current || holding) return;
    setHolding(true);
    startRef.current = performance.now() - progress * duration;
  };
  const cancel = () => {
    if (!holding) return;
    setHolding(false);
    setProgress(0);
  };

  useEffect(() => {
    if (!holding) return;
    let raf = 0;
    const tick = (now: number) => {
      const next = clamp01((now - startRef.current) / duration);
      setProgress(next);
      if (next >= 1) {
        setHolding(false);
        if (!doneRef.current) {
          doneRef.current = true;
          completeRef.current();
        }
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [holding]);

  return (
    <button
      onPointerDown={(event) => { event.currentTarget.setPointerCapture(event.pointerId); begin(); }}
      onPointerUp={cancel}
      onPointerLeave={cancel}
      onPointerCancel={cancel}
      onKeyDown={(event) => {
        if ((event.code === 'Space' || event.code === 'Enter') && !event.repeat) { event.preventDefault(); begin(); }
      }}
      onKeyUp={(event) => { if (event.code === 'Space' || event.code === 'Enter') cancel(); }}
      className={`${controlClass} story-hold group relative w-full min-h-[104px] overflow-hidden border border-[#ffd97d]/35 bg-black/25 px-4 py-4 flex flex-col items-center justify-center gap-2 ${holding ? 'is-holding' : ''}`}
      style={{ '--hold-progress': `${progress * 100}%` } as CSSProperties}
      aria-label={t(prompt, lang)}
    >
      <span className="story-hold__fill" aria-hidden="true" />
      <span className="relative story-hold__icon"><Hand size={27} /></span>
      <span className="relative text-xs md:text-sm leading-6 text-[#f3ede0] text-center">{t(prompt, lang)}</span>
      <span className="relative text-[9px] tracking-[0.22em] text-[#ffd97d]/80">{holding ? `${Math.round(progress * 100)}% · ${t(UI.releaseToCancel, lang)}` : t(UI.holdControl, lang)}</span>
    </button>
  );
}

function DragInteraction({ prompt, lang, onComplete }: { prompt: ChapterText; lang: 'en' | 'bn'; onComplete: () => void }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const posRef = useRef(0);
  const doneRef = useRef(false);
  const [position, setPosition] = useState(0);
  const [dragging, setDragging] = useState(false);

  const moveTo = (clientX: number) => {
    if (!trackRef.current || doneRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const next = clamp01((clientX - rect.left) / Math.max(rect.width, 1));
    posRef.current = next;
    setPosition(next);
    if (next >= 0.88) {
      doneRef.current = true;
      setDragging(false);
      onComplete();
    }
  };
  const finish = () => {
    setDragging(false);
    if (!doneRef.current) {
      posRef.current = 0;
      setPosition(0);
    }
  };
  const nudge = (delta: number) => {
    const next = clamp01(posRef.current + delta);
    posRef.current = next;
    setPosition(next);
    if (next >= 0.88 && !doneRef.current) {
      doneRef.current = true;
      onComplete();
    }
  };

  return (
    <div className="story-drag w-full border border-[#ffd97d]/35 bg-black/25 px-4 py-4">
      <div className="flex items-center justify-between gap-3 text-[9px] tracking-[0.2em] text-white/40">
        <span>{t(UI.dragControl, lang)}</span>
        <span className="text-[#ffd97d]/80">{t(UI.dragTarget, lang)}</span>
      </div>
      <div
        ref={trackRef}
        className="story-drag__track relative mt-3 h-16 touch-none"
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId);
          setDragging(true);
          moveTo(event.clientX);
        }}
        onPointerMove={(event) => { if (dragging) moveTo(event.clientX); }}
        onPointerUp={finish}
        onPointerCancel={finish}
        role="slider"
        tabIndex={0}
        aria-label={t(prompt, lang)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(position * 100)}
        onKeyDown={(event) => {
          if (event.key === 'ArrowRight' || event.key === 'ArrowUp') { event.preventDefault(); nudge(0.12); }
          if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') { event.preventDefault(); nudge(-0.12); }
          if (event.key === 'Home') { event.preventDefault(); posRef.current = 0; setPosition(0); }
          if (event.key === 'End') { event.preventDefault(); nudge(1); }
        }}
      >
        <div className="story-drag__rail" />
        <div className="story-drag__target" aria-hidden="true"><Target size={18} /></div>
        <div className="story-drag__token" style={{ left: `calc(${position * 100}% - 18px)` }} aria-hidden="true">
          <MoveHorizontal size={18} />
        </div>
      </div>
      <div className="mt-3 text-xs leading-6 text-[#f3ede0]">{t(prompt, lang)}</div>
      <div className="mt-1 text-[9px] tracking-[0.12em] text-white/35">{t(UI.dragHint, lang)}</div>
    </div>
  );
}

function ChoiceInteraction({ interaction, lang, onComplete }: { interaction: Extract<ChapterInteraction, { type: 'choice' }>; lang: 'en' | 'bn'; onComplete: () => void }) {
  const [wrong, setWrong] = useState<number | null>(null);
  const [correct, setCorrect] = useState<number | null>(null);

  const choose = (index: number) => {
    if (correct !== null) return;
    if (interaction.answer === null || index === interaction.answer) {
      setCorrect(index);
      setWrong(null);
      onComplete();
    } else {
      setWrong(index);
    }
  };

  return (
    <div className="w-full">
      <div className="text-xs md:text-sm leading-6 text-[#f3ede0] mb-3">{t(interaction.prompt, lang)}</div>
      <div className="grid gap-2">
        {interaction.options.map((option, index) => {
          const isWrong = wrong === index;
          const isCorrect = correct === index;
          return (
            <button
              key={`${option.en}-${index}`}
              onClick={() => choose(index)}
              disabled={correct !== null}
              aria-pressed={isCorrect}
              className={`${controlClass} story-choice flex items-center gap-3 border px-4 py-3 min-h-12 text-left text-xs leading-5 ${isCorrect ? 'border-[#7ad8a0] text-[#b8f5cf]' : isWrong ? 'border-[#e07952] text-[#ffb89f]' : 'border-white/15 text-white/80 hover:border-[#ffd97d]/70'}`}
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-current text-[10px]">{String.fromCharCode(65 + index)}</span>
              <span className="flex-1">{t(option, lang)}</span>
              {isCorrect && <Check size={16} />}
            </button>
          );
        })}
      </div>
      {wrong !== null && correct === null && <div className="mt-3 text-[11px] leading-5 text-[#ffb89f]">{t(UI.choiceWrong, lang)}</div>}
    </div>
  );
}

export function StoryChapters() {
  const show = useGame((state) => state.showStory);
  const phase = useGame((state) => state.phase);
  const lang = useGame((state) => state.lang);
  const activeMission = useGame((state) => state.activeMission);
  const doneMap = useGame((state) => state.chaptersDone);
  const doneForMission = doneMap[activeMission] || EMPTY;
  const mission = getMission(activeMission);
  const chapters = chaptersFor(activeMission);
  const initialIndex = (() => {
    if (!chapters.length) return 0;
    const firstIncomplete = chapters.findIndex((item) => !store.isChapterDone(activeMission, item.id));
    return firstIncomplete === -1 ? 0 : firstIncomplete;
  })();
  const [index, setIndex] = useState(initialIndex);
  const [done, setDone] = useState(() => {
    const first = chapters[initialIndex];
    return !first || !first.interaction || store.isChapterDone(activeMission, first.id);
  });
  const [feedback, setFeedback] = useState<Feedback | null>(() => {
    const first = chapters[initialIndex];
    if (!first) return null;
    if (store.isChapterDone(activeMission, first.id)) return { tone: 'info', text: UI.chapterRestored };
    if (!first.interaction) return { tone: 'info', text: UI.noInteraction };
    return null;
  });
  const chapterBodyRef = useRef<HTMLDivElement>(null);
  const interactionBodyRef = useRef<HTMLDivElement>(null);
  const active = show && phase === 'story' && chapters.length > 0;
  const chapter = chapters[index];

  useEffect(() => {
    if (!active || !chapter) return;
    store.set({ storyIndex: index });
    store.emit('story:cue', { cue: chapter.animation.cue, missionId: activeMission });
  }, [active, activeMission, chapter, index]);

  useEffect(() => {
    if (!active) return;
    chapterBodyRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    interactionBodyRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, [index, active]);

  if (!active || !chapter) return null;

  const goToChapter = (next: number) => {
    const target = chapters[next];
    if (!target) return;
    const saved = store.isChapterDone(activeMission, target.id);
    const autoDone = !target.interaction;
    setIndex(next);
    setDone(saved || autoDone);
    setFeedback(saved
      ? { tone: 'info', text: UI.chapterRestored }
      : autoDone
        ? { tone: 'info', text: UI.noInteraction }
        : null);
    store.set({ storyIndex: next });
    store.emit('story:cue', { cue: target.animation.cue, missionId: activeMission });
  };

  const completeInteraction = () => {
    store.markChapterDone(activeMission, chapter.id);
    setDone(true);
    setFeedback({ tone: 'success', text: UI.interactionComplete });
  };

  const advance = () => {
    if (!done) return;
    store.markChapterDone(activeMission, chapter.id);
    if (index < chapters.length - 1) {
      goToChapter(index + 1);
      return;
    }
    store.set({ showStory: false, storyDone: true });
    store.emit('storyFinished');
  };

  const completedCount = chapters.filter((item) => doneForMission.includes(item.id)).length;
  const progress = Math.round((completedCount / chapters.length) * 100);
  const allDone = completedCount === chapters.length;
  const isLast = index === chapters.length - 1;
  const interaction = chapter.interaction;
  const panelStyle = { '--story-accent': mission.accent, '--story-accent-line': `${mission.accent}88` } as CSSProperties;

  return (
    <div className="story-chapters absolute inset-0 z-30" style={panelStyle}>
      <div className="story-stage">
        {/* A — top-left: chapter record, with the Visual Cue / Clue block at its foot. */}
        <section className="story-panel story-panel--chapter border border-white/10 bg-[#070910]/85 backdrop-blur-md">
          <div className="story-panel__accent" aria-hidden="true" />
          <div ref={chapterBodyRef} className="story-panel__body">
            <div className="flex items-center justify-between gap-3">
              <button onClick={() => store.emit('toMap')} className={`${controlClass} inline-flex items-center gap-1.5 text-[9px] tracking-[0.2em] text-white/55 hover:text-white`}>
                <ArrowLeft size={13} /> {lang === 'bn' ? 'অধ্যায় তালিকা' : 'CHAPTERS'}
              </button>
              <span className="inline-flex items-center gap-1.5 text-[9px] tracking-[0.24em]" style={{ color: mission.accent }}>
                {t(UI.chapter, lang)} {String(chapter.number).padStart(2, '0')}
                {done && <Check size={12} className="text-[#7ad8a0]" />}
              </span>
            </div>

            <div className="mt-3">
              <h2 className="font-display text-[clamp(1.1rem,1.5vw,1.45rem)] leading-tight tracking-[0.05em] text-[#f3ede0]">{t(chapter.title, lang)}</h2>
              <p className="mt-2.5 text-[13px] leading-6 text-[#e6e1d4]">{t(chapter.story, lang)}</p>
            </div>

            <div className="story-cue mt-auto border border-white/12 bg-black/30">
              <div className="flex items-center gap-1.5 border-b border-white/10 px-3 py-2 text-[9px] tracking-[0.22em] text-[#9fd8ff]">
                <Sparkles size={11} /> {t(UI.visualCue, lang)}
              </div>
              <div className="px-3 py-2 text-[12px] leading-5 text-white/65">{t(chapter.animation.draw, lang)}</div>
              <div className="flex items-center gap-2 border-t border-white/10 px-3 py-1.5">
                <span className="text-[9px] tracking-[0.22em] text-white/40">{t(UI.clue, lang)}</span>
                <span className="h-px flex-1 bg-white/10" />
                <code className="text-[9px] tracking-[0.1em]" style={{ color: mission.accent }}>{chapter.animation.cue}</code>
              </div>
            </div>
          </div>
        </section>

        {/* B — right: mission record, progress and completion status. */}
        <aside className="story-panel story-panel--mission border border-white/10 bg-[#070910]/85 backdrop-blur-md">
          <div className="story-panel__accent" aria-hidden="true" />
          <div className="story-panel__body">
            <div className="text-[9px] tracking-[0.3em] text-white/40">{t(UI.missionRecord, lang)}</div>
            <div className="mt-1.5 font-display text-base leading-tight text-[#f3ede0]">{mission.shortName}</div>
            <div className="mt-1 text-[10px] text-white/40">{mission.year} · {t(mission.location, lang)}</div>

            <div className="mt-3.5">
              <div className="flex items-center justify-between text-[9px] tracking-[0.18em]">
                <span className="text-white/35">{t(UI.storyProgress, lang)}</span>
                <span style={{ color: mission.accent }}>{completedCount}/{chapters.length} · {progress}%</span>
              </div>
              <div className="mt-1.5 h-1 overflow-hidden bg-white/10">
                <div className="h-full transition-[width] duration-500" style={{ width: `${progress}%`, background: mission.accent }} />
              </div>
              <div
                className="mt-2 inline-flex items-center gap-1.5 border px-2 py-1 text-[9px] tracking-[0.18em]"
                style={{ color: allDone ? '#7ad8a0' : '#ffd97d', borderColor: allDone ? 'rgba(122,216,160,0.45)' : 'rgba(255,217,125,0.45)' }}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-current" />
                {allDone ? t(UI.completed, lang) : t(UI.inProgress, lang)}
              </div>
            </div>

            <div className="mt-3.5 space-y-1.5">
              {chapters.map((item, itemIndex) => {
                const itemDone = doneForMission.includes(item.id);
                const current = itemIndex === index;
                const available = itemDone || current;
                return (
                  <button
                    key={item.id}
                    onClick={() => available && goToChapter(itemIndex)}
                    disabled={!available}
                    aria-current={current ? 'step' : undefined}
                    className={`w-full text-left border px-3 py-2 transition-colors ${current ? 'border-[#ffd97d]/60 bg-[#ffd97d]/8' : itemDone ? 'border-[#7ad8a0]/25 hover:border-[#7ad8a0]/50' : 'border-white/8 opacity-40'}`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[8px] ${itemDone ? 'border-[#7ad8a0]/50 text-[#7ad8a0]' : current ? 'border-[#ffd97d] text-[#ffd97d]' : 'border-white/20 text-white/30'}`}>
                        {itemDone ? <Check size={11} /> : String(item.number).padStart(2, '0')}
                      </span>
                      <span className={`min-w-0 flex-1 truncate text-[10px] leading-4 ${current ? 'text-[#f3ede0]' : itemDone ? 'text-white/65' : 'text-white/35'}`}>{t(item.title, lang)}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-3.5 flex items-start gap-2 border-t border-white/10 pt-2.5 text-[9px] leading-4 text-white/30">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: mission.accent }} />
              {t(UI.chapterSaveNote, lang)}
            </div>
          </div>
        </aside>

        {/* C — bottom-centre: the active interaction and the story advance. */}
        <section className="story-panel story-panel--interaction border border-white/10 bg-[#070910]/88 backdrop-blur-md">
          <div className="story-panel__accent" aria-hidden="true" />
          <div ref={interactionBodyRef} className="story-panel__body">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 text-[9px] tracking-[0.28em] text-white/45">
                <MousePointerClick size={12} /> {t(UI.interaction, lang)}
              </span>
              <span className="inline-flex items-center gap-1.5 text-[9px] tracking-[0.2em]" style={{ color: done ? '#7ad8a0' : mission.accent }}>
                {done && <Check size={12} />}
                {done ? t(UI.interactionComplete, lang) : interaction ? t(UI.interactionRequired, lang) : t(UI.noInteraction, lang)}
              </span>
            </div>

            <div className="story-interaction mt-4">
              {!done && interaction?.type === 'tap' && <TapInteraction prompt={interaction.prompt} lang={lang} onComplete={completeInteraction} />}
              {!done && interaction?.type === 'hold' && <HoldInteraction prompt={interaction.prompt} lang={lang} onComplete={completeInteraction} />}
              {!done && interaction?.type === 'drag' && <DragInteraction prompt={interaction.prompt} lang={lang} onComplete={completeInteraction} />}
              {!done && interaction?.type === 'choice' && <ChoiceInteraction interaction={interaction} lang={lang} onComplete={completeInteraction} />}

              {feedback && (
                <div className={`mt-3 border px-4 py-3 text-[11px] leading-5 ${feedback.tone === 'success' ? 'border-[#7ad8a0]/40 bg-[#7ad8a0]/8 text-[#b8f5cf]' : feedback.tone === 'error' ? 'border-[#e07952]/40 text-[#ffb89f]' : 'border-white/10 text-white/45'}`}>
                  <div className="flex items-start gap-2"><ChevronRight size={14} className="mt-0.5 shrink-0" /><span>{t(feedback.text, lang)}</span></div>
                </div>
              )}
            </div>

            <div className="story-panel__footer flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-[9px] tracking-[0.18em] text-white/35">
                <span>{t(UI.storyProgress, lang)}</span>
                <span className="h-1 w-20 overflow-hidden bg-white/10"><span className="block h-full transition-[width] duration-500" style={{ width: `${progress}%`, background: mission.accent }} /></span>
                <span style={{ color: mission.accent }}>{progress}%</span>
              </div>
              <button
                onClick={advance}
                disabled={!done}
                className={`${controlClass} inline-flex items-center justify-center gap-2 px-5 py-2.5 min-h-10 text-[10px] tracking-[0.22em] ${done ? 'bg-[#ffd97d] text-black hover:bg-white' : 'cursor-not-allowed border border-white/10 text-white/25'}`}
              >
                {isLast ? t(UI.finishStory, lang) : t(UI.continueStory, lang)} <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
