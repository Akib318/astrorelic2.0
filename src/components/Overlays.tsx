import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { ArrowLeft, ArrowRight, Check, Gauge, Globe2, Lock, Map, Moon, Orbit, Pause, Play, RotateCcw, Rocket, Settings, Volume2, VolumeX, X } from 'lucide-react';
import { store, useGame, t, type Graphics } from '../state/store';
import { audio } from '../game/audio';
import { UI } from '../data/content';
import { getMission, missionsFor, nextMission, type Destination } from '../data/missions';
import { StoryChapters } from './StoryChapters';

const POP = 'cubic-bezier(.785, .135, .15, .01)';
const controlClass = 'cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffd97d] focus-visible:ring-offset-2 focus-visible:ring-offset-black transition-colors';

/** Accent color tokens keep hover/glow effects driven by CSS while the palette stays in the mission data. */
const accentVars = (color: string, extra: Record<string, string | number> = {}): CSSProperties => ({
  '--accent': color,
  '--accent-line': `${color}99`,
  '--accent-glow': `${color}40`,
  ...extra,
} as CSSProperties);

function speakerName(s: string) { return s === 'nova' ? 'NOVA' : s === 'sojourner' ? 'SOJOURNER' : ''; }

function Dialogue() {
  const current = useGame((s) => s.current), choices = useGame((s) => s.choices);
  const lang = useGame((s) => s.lang), phase = useGame((s) => s.phase), paused = useGame((s) => s.paused);
  // The story phase owns the bottom-centre panel (StoryChapters), so Nova's
  // explore-phase dialogue must not stack on top of the interaction controls.
  if (phase === 'home' || phase === 'cinematic' || phase === 'map' || phase === 'story' || paused) return null;
  if (!current && choices) return (
    <div className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 z-30 flex flex-wrap justify-center gap-3 w-[min(94vw,700px)]">
      {choices.map((c) => <button key={c.action} onClick={() => { store.set({ choices: null }); store.emit(c.action, c.data); }} className={`${controlClass} px-6 py-3 min-h-11 border border-[#ffd97d]/70 text-[#ffd97d] tracking-[0.18em] text-xs hover:bg-[#ffd97d] hover:text-black`} style={{ transitionTimingFunction: POP }}>{t(c, lang)}</button>)}
    </div>
  );
  if (!current) return null;
  const name = speakerName(current.speaker);
  return (
    <button onClick={() => store.advanceDialogue()} className={`${controlClass} absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 z-30 w-[min(620px,92vw)] text-left group`}>
      <div className="relative bg-black/70 backdrop-blur-md border border-white/10 px-5 md:px-6 py-4">
        <div className="absolute -top-px -left-px w-4 h-4 border-t border-l border-[#ffd97d]" />
        <div className="absolute -bottom-px -right-px w-4 h-4 border-b border-r border-[#ffd97d]" />
        {name && <div className={`text-[11px] tracking-[0.35em] mb-1.5 ${current.speaker === 'nova' ? 'text-[#9fd8ff]' : 'text-[#ffd97d]'}`}>{name}</div>}
        <div className="text-sm md:text-[15px] leading-relaxed text-[#ece7db]">{t(current, lang)}</div>
        <div className="text-[10px] tracking-[0.25em] text-white/40 mt-2 group-hover:text-white/70">{t(UI.clickContinue, lang)} ▸</div>
      </div>
    </button>
  );
}

function HomeUI() {
  const phase = useGame((s) => s.phase), lang = useGame((s) => s.lang);
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (phase === 'home') { const id = setTimeout(() => setShow(true), 300); return () => clearTimeout(id); }
    setShow(false);
  }, [phase]);
  if (phase !== 'home') return null;
  return (
    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-5 text-center pointer-events-none transition-opacity duration-700" style={{ opacity: show ? 1 : 0 }}>
      <div className="text-[10px] md:text-[11px] tracking-[0.45em] md:tracking-[0.6em] text-[#9fd8ff]/80 mb-6">{t(UI.tagline1, lang).toUpperCase()}</div>
      <h1 className="font-display text-[clamp(2.8rem,10vw,7.5rem)] leading-none tracking-[0.08em] text-[#f3ede0]">ASTRO&nbsp;RELIC</h1>
      <div className="mt-6 text-xs md:text-[13px] text-white/60 tracking-[0.14em] leading-7"><div>{t(UI.tagline2, lang)}</div><div>{t(UI.tagline3, lang)}</div></div>
      <button onClick={() => store.emit('start')} className={`${controlClass} pointer-events-auto mt-12 group relative px-8 md:px-10 py-4 min-h-11 overflow-hidden border border-[#ffd97d]/60`}>
        <span className="absolute inset-0 bg-[#ffd97d] origin-bottom scale-y-0 group-hover:scale-y-100 transition-transform duration-300" />
        <span className="relative z-10 tracking-[0.22em] text-xs md:text-sm text-[#ffd97d] group-hover:text-black">{t(UI.cta, lang)} →</span>
      </button>
      <div className="mt-5 text-[10px] tracking-[0.3em] text-white/40">{t(UI.ctaSub, lang)}</div>
    </div>
  );
}

function JourneyChoice() {
  const show = useGame((s) => s.showChoice), lang = useGame((s) => s.lang);
  const moonDone = useGame((s) => s.completedMoon.length), marsDone = useGame((s) => s.completedMars.length);
  if (!show) return null;
  const destinations = [
    { id: 'moon', icon: Moon, title: lang === 'bn' ? 'চাঁদ — চন্দ্র অন্বেষণের সূচনা' : 'MOON — THE BEGINNING OF LUNAR EXPLORATION', desc: lang === 'bn' ? 'রোবোটিক পথপ্রদর্শক ও ঐতিহাসিক মিশন আবিষ্কার করুন, যেগুলো মানুষের চন্দ্রাভিযানের পথ তৈরি করেছিল।' : 'Discover the robotic pioneers and historic missions that explored the Moon and paved the way for human exploration.', button: lang === 'bn' ? 'চাঁদ অন্বেষণ করুন' : 'EXPLORE THE MOON', color: '#c7d3df', done: moonDone, total: 11 },
    { id: 'mars', icon: Orbit, title: lang === 'bn' ? 'মঙ্গল — লাল গ্রহ' : 'MARS — THE RED PLANET', desc: lang === 'bn' ? 'মঙ্গলের প্রান্তরে যাওয়া রোবোটিক অভিযাত্রী ও ভুলে যাওয়া যন্ত্রের গল্প অন্বেষণ করুন।' : 'Explore the stories of robotic explorers and forgotten machines that ventured across the Martian landscape.', button: lang === 'bn' ? 'মঙ্গল অন্বেষণ করুন' : 'EXPLORE MARS', color: '#e07952', done: marsDone, total: 5 },
  ];
  return (
    <div className="mission-hub mission-hub--journey absolute inset-0 z-40 overflow-y-auto">
      <div className="mission-hub__bg" aria-hidden="true">
        <div className="mission-hub__ambient" />
        <div className="mission-hub__surface" />
      </div>
      <div className="mission-hub__decor" aria-hidden="true" />
      <div className="relative z-10 min-h-full flex flex-col items-center justify-center py-16 md:py-20 px-5">
        <button onClick={() => store.set({ showChoice: false })} aria-label="Close destination selection" className={`${controlClass} absolute top-5 left-5 z-20 p-3 text-white/75 hover:text-white bg-black/30 backdrop-blur-sm`}><X size={20} /></button>

        <div className="hub-hero text-center">
          <div className="inline-flex items-center gap-3 text-[10px] tracking-[0.42em] text-white/45 mb-4">
            <span className="h-px w-8 bg-white/20" />
            {t(UI.chooseJourney, lang)}
            <span className="h-px w-8 bg-white/20" />
          </div>
          <h2 className="font-display text-[clamp(1.7rem,4.5vw,3rem)] tracking-[0.1em] text-[#f3ede0]">{t(UI.twoWorlds, lang)}</h2>
          <p className="mt-3 max-w-xl text-xs md:text-sm leading-6 text-white/45">
            {lang === 'bn' ? 'একটি জগৎ বেছে নিন। প্রতিটি অধ্যায় স্বয়ংক্রিয়ভাবে সংরক্ষিত হয়।' : 'Choose a world. Every chapter is saved automatically.'}
          </p>
        </div>

        <div className="mt-10 grid md:grid-cols-2 gap-5 w-[min(980px,94vw)]">
          {destinations.map((d, i) => {
            const pct = Math.round((d.done / d.total) * 100);
            const allDone = d.done >= d.total;
            return (
              <button key={d.id} onClick={() => store.emit(`choose:${d.id}`)} className="hub-card group relative p-6 md:p-8 min-h-[330px] text-left" style={{ ...accentVars(d.color), animationDelay: `${i * 110}ms` }}>
                <div className="hub-orbit absolute -right-20 -top-24 h-64 w-64 rounded-full border" style={{ borderColor: `${d.color}26` }} aria-hidden="true" />
                <div className="hub-orbit--reverse absolute -right-6 -top-10 h-36 w-36 rounded-full border" style={{ borderColor: `${d.color}1a` }} aria-hidden="true" />

                <div className="relative z-10 flex h-full flex-col">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full border bg-black/25" style={{ borderColor: `${d.color}55`, color: d.color, boxShadow: `inset 0 0 28px ${d.color}14` }}>
                      <d.icon size={27} strokeWidth={1.15} />
                    </div>
                    <div className="text-right">
                      <div className="font-display text-2xl tracking-[0.05em]" style={{ color: d.color }}>{String(d.done).padStart(2, '0')}<span className="text-sm text-white/30"> / {d.total}</span></div>
                      <div className="mt-1 text-[8px] tracking-[0.26em] text-white/35">{t(UI.missionsExplored, lang)}</div>
                    </div>
                  </div>

                  <div className="mt-8 font-display text-xl md:text-2xl tracking-[0.08em] leading-snug" style={{ color: d.color }}>{d.title}</div>
                  <div className="mt-3 text-sm text-white/60 leading-7 max-w-md">{d.desc}</div>

                  <div className="mt-auto pt-8">
                    <div className="mb-2 flex items-center justify-between text-[9px] tracking-[0.22em] text-white/35">
                      <span>{lang === 'bn' ? 'অগ্রগতি' : 'PROGRESS'}</span>
                      <span style={{ color: d.color }}>{pct}%</span>
                    </div>
                    <div className="h-1 w-full overflow-hidden bg-white/10">
                      <div className="h-full transition-[width] duration-700" style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${d.color}66, ${d.color})` }} />
                    </div>
                    <div className="mt-6 flex items-center justify-between gap-4">
                      <span className="inline-flex items-center gap-2 text-[10px] tracking-[0.2em]" style={{ color: d.color }}>{d.button} <ArrowRight size={14} /></span>
                      <span className="inline-flex items-center gap-2 text-[8px] tracking-[0.2em] text-white/30">
                        {allDone ? (lang === 'bn' ? 'সব অধ্যায় সম্পন্ন' : 'ALL CHAPTERS COMPLETE') : (lang === 'bn' ? 'অধ্যায় দেখুন' : 'VIEW CHAPTERS')}
                        <ArrowRight size={11} />
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-8 text-center text-[8px] tracking-[0.28em] text-white/25">
          {lang === 'bn' ? 'অগ্রগতি এই ব্রাউজারে স্বয়ংক্রিয়ভাবে সংরক্ষিত' : 'PROGRESS IS SAVED AUTOMATICALLY IN THIS BROWSER'}
        </div>
      </div>
    </div>
  );
}

function Caption() {
  const caption = useGame((s) => s.caption), lang = useGame((s) => s.lang);
  if (!caption) return null;
  return <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none px-6"><div className="text-center text-[clamp(1.2rem,4vw,2.5rem)] tracking-[0.25em] md:tracking-[0.4em] text-[#f3ede0] font-display animate-[fadein_0.8s_ease]">{t(caption, lang)}</div></div>;
}

function InspectPanel() {
  const phase = useGame((s) => s.phase), active = useGame((s) => s.activeHotspot), visited = useGame((s) => s.visitedHotspots);
  const lang = useGame((s) => s.lang), activeMission = useGame((s) => s.activeMission);
  if (phase !== 'inspect') return null;
  const mission = getMission(activeMission), h = mission.hotspots.find((x) => x.id === active);
  const total = mission.hotspots.length;
  const visitedCount = mission.hotspots.filter((x) => visited.includes(x.id)).length;
  const allVisited = visitedCount === total;
  const remaining = mission.hotspots.filter((x) => !visited.includes(x.id));

  // Opening a hardware entry counts as inspecting it, matching a 3D marker click.
  const inspectHotspot = (id: string) => {
    const current = store.get().visitedHotspots;
    const next = current.includes(id) ? current : [...current, id];
    store.set({ activeHotspot: id, visitedHotspots: next });
    store.discover(mission.id, id);
  };

  const controls = (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2.5">
      <div className="min-w-[128px]">
        <div className="text-[8px] tracking-[0.25em] text-white/40">{t(UI.inspectionProgress, lang)}</div>
        <div className="mt-1 text-[11px] tracking-[0.16em]" style={{ color: allVisited ? '#7ad8a0' : '#ffd97d' }}>
          {visitedCount} / {total} {t(UI.inspected, lang)}
        </div>
        <div className="mt-1.5 h-1 w-32 overflow-hidden bg-white/10" role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={visitedCount}>
          <div className="h-full transition-[width] duration-500" style={{ width: `${total ? (visitedCount / total) * 100 : 100}%`, background: allVisited ? '#7ad8a0' : '#ffd97d' }} />
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {mission.hotspots.map((x) => {
          const done = visited.includes(x.id);
          const current = active === x.id;
          return (
            <button
              key={x.id}
              onClick={() => inspectHotspot(x.id)}
              aria-pressed={current}
              className={`${controlClass} inline-flex items-center gap-1.5 border px-2.5 py-1.5 min-h-9 text-[9px] tracking-[0.1em] ${done ? 'border-[#7ad8a0]/40 text-[#b8f5cf]' : 'border-white/20 text-white/60 hover:border-[#ffd97d]/60 hover:text-white'} ${current ? 'bg-white/10' : ''}`}
            >
              {done ? <Check size={11} /> : <span className="h-2.5 w-2.5 rounded-full border border-current" />}
              {t(x.label, lang)}
            </button>
          );
        })}
      </div>

      <div className="min-w-[140px] flex-1 text-[9px] leading-4 text-white/40">
        {remaining.length > 0 ? (
          <><span className="text-white/55">{t(UI.remainingHardware, lang)}:</span> {remaining.map((x) => t(x.label, lang)).join(' · ')}</>
        ) : (
          <span className="text-[#9fd8ff]">{t(UI.allVisited, lang)}</span>
        )}
      </div>

      <div className="flex w-full flex-col items-stretch gap-1 sm:w-auto sm:items-end">
        <button
          onClick={() => { if (allVisited) store.emit('finishInspect'); }}
          disabled={!allVisited}
          className={`${controlClass} inline-flex items-center justify-center gap-2 px-6 py-3 min-h-11 text-[10px] tracking-[0.22em] ${allVisited ? 'bg-[#ffd97d] text-black hover:bg-white' : 'cursor-not-allowed border border-white/15 text-white/30'}`}
        >
          {t(UI.finishInspect, lang)} <ArrowRight size={14} />
        </button>
        {!allVisited && <div className="text-[8px] leading-3 text-white/30">{t(UI.inspectAllHint, lang)}</div>}
      </div>
    </div>
  );

  return <>
    <div className="absolute top-16 md:top-6 left-5 md:left-6 z-20 max-w-[60vw]">
      <div className="text-[10px] tracking-[0.35em] text-[#ffd97d]/80">{mission.shortName.toUpperCase()}</div>
      <div className="text-[9px] tracking-[0.25em] text-white/40 mt-1">{t(UI.myHardware, lang)}</div>
      <button onClick={() => store.emit(mission.surface ? 'engine:goto' : 'toMap', mission.surface ? 'explore' : undefined)} className={`${controlClass} mt-2 inline-flex items-center gap-2 text-[10px] tracking-[0.2em] text-white/55 hover:text-white`}><ArrowLeft size={14} /> {lang === 'bn' ? 'ফিরে যান' : 'BACK'}</button>
    </div>

    <div className="absolute top-20 md:top-16 right-6 z-30 flex gap-2" aria-hidden="true">{mission.hotspots.map((x) => <div key={x.id} className={`w-2 h-2 rotate-45 ${visited.includes(x.id) ? 'bg-[#9fd8ff]' : 'bg-white/20'}`} />)}</div>

    {h ? (
      <div className="absolute right-0 top-0 bottom-0 z-30 w-[min(420px,94vw)] bg-black/85 backdrop-blur-md border-l border-white/10 flex flex-col">
        <div className="relative flex-1 overflow-y-auto p-7 pt-14">
          <button onClick={() => store.set({ activeHotspot: null })} aria-label="Close inspection detail" className={`${controlClass} absolute top-4 left-4 text-white/50 hover:text-white p-2`}><X size={18} /></button>
          <div className="text-[10px] tracking-[0.4em] text-white/40 mb-1">HARDWARE</div><div className="text-2xl font-display tracking-[0.08em] text-[#ffd97d] mb-6">{t(h.label, lang)}</div>
          {[{ k: UI.whatItDid, v: h.did, c: '#9fd8ff' }, { k: UI.whyItMattered, v: h.mattered, c: '#ffd97d' }, { k: UI.missionEvent, v: h.event, c: '#e07952' }].map(({ k, v, c }) => <div key={k.en} className="mb-6"><div className="text-[10px] tracking-[0.3em] mb-2" style={{ color: c }}>{t(k, lang)}</div><div className="text-sm leading-7 text-[#e6e1d4]">{t(v, lang)}</div></div>)}
        </div>
        <div className="shrink-0 border-t border-white/10 bg-black/90 px-4 py-3 md:px-5">{controls}</div>
      </div>
    ) : (
      <div className="absolute bottom-0 inset-x-0 z-40 border-t border-white/10 bg-black/85 backdrop-blur-md px-4 py-3 md:px-6">
        <div className="mx-auto w-[min(1100px,94vw)]">{controls}</div>
      </div>
    )}
  </>;
}

// Phase-driven on purpose: the completion scene used to emit a one-shot
// `ui:showComplete` event, which could fire before this overlay subscribed and
// leave the player stranded on the completion screen with no Next Chapter button.
function CompleteOverlay() {
  const phase = useGame((s) => s.phase), lang = useGame((s) => s.lang), activeMission = useGame((s) => s.activeMission);
  if (phase !== 'complete') return null;
  const mission = getMission(activeMission), next = nextMission(activeMission);
  return <div className="absolute inset-0 z-40 flex flex-col items-center justify-center px-6 text-center bg-black/20">
    <div className="text-[clamp(1.8rem,6vw,4rem)] font-display tracking-[0.18em] text-[#f3ede0] animate-[fadein_0.8s_ease]">{t(UI.chapterComplete, lang)}</div>
    <div className="mt-3 text-[11px] tracking-[0.35em] text-[#ffd97d]">{mission.shortName.toUpperCase()} · {mission.year}</div>
    <div className="pointer-events-auto mt-10 flex flex-wrap justify-center gap-3">
      <button onClick={() => store.emit('nextChapter')} className={`${controlClass} px-7 py-3 min-h-11 border border-[#ffd97d]/70 text-[#ffd97d] tracking-[0.22em] text-xs hover:bg-[#ffd97d] hover:text-black`}>{next ? t(UI.nextChapter, lang) : lang === 'bn' ? 'যাত্রার তালিকা' : 'JOURNEY MAP'} →</button>
      <button onClick={() => store.emit('replay')} className={`${controlClass} px-5 py-3 min-h-11 border border-white/20 text-white/65 text-xs hover:border-white`}><RotateCcw size={14} className="inline mr-2" />{t(UI.replay, lang)}</button>
      <button onClick={() => store.emit('toDestinations')} className={`${controlClass} px-5 py-3 min-h-11 border border-white/20 text-white/65 text-xs hover:border-white`}><Globe2 size={14} className="inline mr-2" />{lang === 'bn' ? 'গন্তব্য বদলান' : 'SWITCH WORLD'}</button>
    </div>
  </div>;
}

function JourneyMap() {
  const phase = useGame((s) => s.phase), lang = useGame((s) => s.lang), destination = useGame((s) => s.destination);
  const moonCompleted = useGame((s) => s.completedMoon), marsCompleted = useGame((s) => s.completedMars);
  if (phase !== 'map') return null;
  const list = missionsFor(destination), completed = destination === 'moon' ? moonCompleted : marsCompleted;
  const accent = destination === 'moon' ? '#c7d3df' : '#e07952';
  const doneCount = list.filter((m) => completed.includes(m.id)).length;
  const pct = Math.round((doneCount / list.length) * 100);
  const next = list.find((m, i) => !completed.includes(m.id) && (i === 0 || completed.includes(list[i - 1].id)));
  const statusLabel = (done: boolean, available: boolean) => done ? t(UI.completed, lang) : available ? t(UI.available, lang) : t(UI.locked, lang);
  const switchDestination = (id: Destination) => { if (id !== destination) store.emit(`choose:${id}`); };

  return (
    <div className={`mission-hub mission-hub--${destination} absolute inset-0 z-40 overflow-y-auto`}>
      <div className="mission-hub__bg" aria-hidden="true">
        <div className="mission-hub__ambient" />
        <div className="mission-hub__surface" />
      </div>
      {destination === 'mars' && <div className="mission-hub__haze" aria-hidden="true" />}
      <div className="mission-hub__decor" aria-hidden="true">
        <div className="mission-hub__dust" />
      </div>
      <div className="relative z-10 w-[min(1000px,94vw)] mx-auto py-8 md:py-12">
        <div className="flex items-center justify-between gap-3">
          <button onClick={() => store.emit('toDestinations')} className={`${controlClass} inline-flex items-center gap-2 text-[10px] tracking-[0.22em] text-white/50 hover:text-white`}>
            <ArrowLeft size={15} /> {lang === 'bn' ? 'গন্তব্য' : 'DESTINATIONS'}
          </button>
          <div className="inline-flex border border-white/10 bg-black/30 p-1" role="group" aria-label={lang === 'bn' ? 'গন্তব্য বদলান' : 'Switch destination'}>
            {(['moon', 'mars'] as Destination[]).map((id) => {
              const current = id === destination;
              return (
                <button key={id} onClick={() => switchDestination(id)} aria-pressed={current} className={`${controlClass} px-4 py-2 min-h-9 text-[9px] tracking-[0.22em] ${current ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/75'}`}>
                  {t(id === 'moon' ? UI.moon : UI.mars, lang)}
                </button>
              );
            })}
          </div>
        </div>

        <div className="hub-hero mt-8 flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/10 pb-8">
          <div>
            <div className="flex items-center gap-3 text-[10px] tracking-[0.4em]" style={{ color: accent }}>
              <span className="h-px w-8" style={{ background: accent }} />
              {destination === 'moon' ? (lang === 'bn' ? 'চন্দ্র অভিযাত্রা' : 'LUNAR JOURNEY') : (lang === 'bn' ? 'মঙ্গল অভিযাত্রা' : 'MARS JOURNEY')}
            </div>
            <h2 className="mt-4 font-display text-[clamp(2rem,5vw,3.4rem)] leading-none tracking-[0.1em] text-[#f3ede0]">{t(UI.missionHub, lang)}</h2>
            <p className="mt-4 max-w-xl text-xs md:text-sm leading-7 text-white/45">
              {lang === 'bn' ? 'প্রতিটি অধ্যায় শেষ করলে পরের মিশন আনলক হবে। অগ্রগতি এই ব্রাউজারে স্বয়ংক্রিয়ভাবে সংরক্ষিত।' : 'Complete each chapter to unlock the next mission. Progress is saved automatically in this browser.'}
            </p>
          </div>

          <div className="flex items-center gap-5 shrink-0">
            <div className="hub-progress-ring h-24 w-24 rounded-full p-[6px]" style={accentVars(accent, { '--pct': pct })} role="progressbar" aria-valuemin={0} aria-valuemax={list.length} aria-valuenow={doneCount} aria-label={`${doneCount} / ${list.length} ${t(UI.completed, lang)}`}>
              <div className="flex h-full w-full flex-col items-center justify-center rounded-full bg-[#070910]">
                <span className="font-display text-xl tracking-[0.04em]" style={{ color: accent }}>{pct}%</span>
                <span className="text-[8px] tracking-[0.2em] text-white/35">{doneCount}/{list.length}</span>
              </div>
            </div>
            <div>
              <div className="text-[9px] tracking-[0.28em] text-white/35">{t(UI.completed, lang)}</div>
              <div className="mt-1 font-display text-2xl text-white/85">{String(doneCount).padStart(2, '0')} <span className="text-white/25">/ {list.length}</span></div>
              <div className="mt-2 max-w-[220px] text-[9px] leading-4 tracking-[0.08em] text-white/35">
                {t(UI.nextUp, lang)}: <span className="text-white/70">{next ? t(next.name, lang) : (lang === 'bn' ? 'সব অধ্যায় সম্পন্ন' : 'ALL CHAPTERS COMPLETE')}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-2">
          {list.map((m, i) => {
            const done = completed.includes(m.id), available = i === 0 || completed.includes(list[i - 1].id);
            const isNext = next?.id === m.id;
            const StatusIcon = done ? Check : available ? Play : Lock;
            return (
              <button
                key={m.id}
                disabled={!available}
                onClick={() => store.emit('startMission', { id: m.id, destination })}
                aria-label={`${t(m.name, lang)} — ${statusLabel(done, available)}`}
                aria-current={isNext ? 'step' : undefined}
                className={`hub-card hub-mission w-full text-left p-4 md:p-5 min-h-[116px] flex items-start gap-4 ${isNext ? 'hub-card--next' : ''}`}
                style={{ ...accentVars(accent), animationDelay: `${Math.min(i * 55, 440)}ms` }}
              >
                <div className="relative z-10 flex shrink-0 flex-col items-center gap-2">
                  <div className="relative flex h-10 w-10 items-center justify-center rounded-full border bg-black/30" style={{ borderColor: done ? `${accent}88` : 'rgba(255,255,255,.14)', color: done ? accent : 'rgba(255,255,255,.55)' }}>
                    <StatusIcon size={16} />
                    {isNext && !done && <span className="hub-pulse absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full" style={{ background: accent }} />}
                  </div>
                  <span className="text-[8px] tracking-[0.18em] text-white/25">{String(i + 1).padStart(2, '0')}</span>
                </div>

                <div className="relative z-10 min-w-0 flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className={`text-xs tracking-[0.1em] leading-5 ${done ? 'text-[#ffd97d]' : available ? 'text-white/90' : 'text-white/50'}`}>{t(m.name, lang)}</div>
                    <span className={`shrink-0 border px-2 py-0.5 text-[8px] tracking-[0.16em] ${done ? 'border-[#ffd97d]/40 text-[#ffd97d]' : 'text-white/45'}`} style={!done && available ? { borderColor: `${accent}55`, color: accent } : { borderColor: 'rgba(255,255,255,.1)' }}>
                      {statusLabel(done, available)}
                    </span>
                  </div>
                  <div className="mt-1.5 text-[10px] text-white/40">{m.year} · {t(m.location, lang)}</div>
                  {!available && <div className="mt-2 text-[9px] tracking-[0.12em] text-white/40">{t(UI.completeFirst, lang)}</div>}
                  {available && !done && (
                    <div className="mt-3 flex items-center gap-1.5 text-[9px] tracking-[0.16em]" style={{ color: accent }}>
                      {isNext ? (lang === 'bn' ? 'এখান থেকে শুরু করুন' : 'START HERE') : (lang === 'bn' ? 'অধ্যায় খুলুন' : 'OPEN CHAPTER')} <ArrowRight size={12} />
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button onClick={() => store.emit('toDestinations')} className={`${controlClass} px-5 py-3 min-h-11 border border-white/20 text-white/65 text-[10px] tracking-[0.2em] hover:border-[#ffd97d]`}><Globe2 size={15} className="inline mr-2" />{lang === 'bn' ? 'গন্তব্য নির্বাচন' : 'DESTINATIONS'}</button>
          <button onClick={() => store.emit('toSolar')} className={`${controlClass} px-5 py-3 min-h-11 border border-white/20 text-white/65 text-[10px] tracking-[0.2em] hover:border-[#ffd97d]`}><Orbit size={15} className="inline mr-2" />{t(UI.backToSolar, lang)}</button>
        </div>
      </div>
    </div>
  );
}

function HUD() {
  const phase = useGame((s) => s.phase), objective = useGame((s) => s.objective), hint = useGame((s) => s.hint), tutorialDone = useGame((s) => s.tutorialDone), showChoice = useGame((s) => s.showChoice), lang = useGame((s) => s.lang), activeMission = useGame((s) => s.activeMission);
  return <>
    {phase === 'solar' && !tutorialDone && !showChoice && <button onClick={() => store.emit('skipTutorial')} className={`${controlClass} absolute bottom-6 right-6 z-30 text-[10px] tracking-[0.25em] text-white/45 hover:text-[#ffd97d]`}>SKIP GUIDE ▸▸</button>}
    {phase === 'solar' && tutorialDone && !showChoice && <button onClick={() => store.set({ showChoice: true })} className={`${controlClass} absolute bottom-6 left-1/2 -translate-x-1/2 z-30 px-6 py-3 min-h-11 border border-[#ffd97d]/50 bg-black/45 text-[#ffd97d] text-[10px] tracking-[0.25em] hover:bg-[#ffd97d] hover:text-black`}><Rocket size={14} className="inline mr-2" />{t(UI.chooseJourney, lang)}</button>}
    {phase === 'cinematic' && <button onClick={() => store.emit('skipCinematic')} className={`${controlClass} absolute bottom-6 right-6 z-30 px-4 py-2 text-[10px] tracking-[0.25em] text-white/50 hover:text-white border border-white/20`}>SKIP →</button>}
    {phase === 'explore' && <>
      <div className="absolute top-16 md:top-6 left-5 md:left-6 z-20 border-l-2 border-[#ffd97d] pl-3 max-w-[65vw]"><div className="text-[9px] tracking-[0.35em] text-white/45 mb-1">{getMission(activeMission).shortName.toUpperCase()}</div>{objective && <div className="text-xs leading-5 tracking-[0.08em] text-[#ece7db]">{t(objective, lang)}</div>}</div>
      {hint && <div className="hidden md:block absolute top-6 right-[230px] z-20 text-[10px] tracking-[0.12em] text-white/45 text-right max-w-sm">{t(hint, lang)}</div>}
      <button onClick={() => store.emit('togglePause')} aria-label="Pause" className={`${controlClass} absolute bottom-6 right-6 z-30 p-3 border border-white/20 text-white/60 hover:text-white`}><Pause size={18} /></button>
    </>}
  </>;
}

function TopControls() {
  const lang = useGame((s) => s.lang), muted = useGame((s) => s.muted), phase = useGame((s) => s.phase), graphics = useGame((s) => s.graphics);
  const [settings, setSettings] = useState(false);
  if (phase === 'home') return null;
  const levels: Graphics[] = ['low', 'medium', 'high'];
  return <>
    <div className="absolute top-4 right-4 z-50 flex gap-2">
      <button onClick={() => store.set({ lang: lang === 'en' ? 'bn' : 'en' })} className={`${controlClass} px-3 min-h-11 border border-white/20 text-[11px] tracking-[0.15em] text-white/70 hover:border-[#ffd97d] hover:text-[#ffd97d] bg-black/25`}>{t(UI.langBtn, lang)}</button>
      <button onClick={() => { const next = !muted; store.set({ muted: next }); audio.setMuted(next); }} aria-label={muted ? 'Unmute' : 'Mute'} className={`${controlClass} px-3 min-h-11 border border-white/20 text-white/70 hover:border-[#ffd97d] bg-black/25`}>{muted ? <VolumeX size={17} /> : <Volume2 size={17} />}</button>
      <button onClick={() => setSettings(!settings)} aria-label="Graphics settings" className={`${controlClass} px-3 min-h-11 border border-white/20 text-white/70 hover:border-[#ffd97d] bg-black/25`}><Settings size={17} /></button>
    </div>
    {settings && <div className="absolute top-[68px] right-4 z-50 w-[min(300px,92vw)] bg-[#090b12]/95 border border-white/15 p-5 backdrop-blur-md">
      <div className="flex items-center justify-between mb-4"><div className="text-[10px] tracking-[0.3em] text-white/60"><Gauge size={15} className="inline mr-2" />GRAPHICS</div><button onClick={() => setSettings(false)} aria-label="Close settings" className={`${controlClass} text-white/50 p-2`}><X size={16} /></button></div>
      <div className="grid grid-cols-3 gap-2">{levels.map((level) => <button key={level} onClick={() => store.set({ graphics: level })} className={`${controlClass} py-3 min-h-11 border text-[10px] uppercase tracking-[0.12em] ${graphics === level ? 'border-[#ffd97d] text-[#ffd97d]' : 'border-white/15 text-white/55 hover:border-white/40'}`}>{level}</button>)}</div>
      <div className="text-[10px] leading-5 text-white/40 mt-4">Low reduces shadows, terrain detail, particles and render resolution. Apply a preset before entering a mission to change scene detail.</div>
    </div>}
  </>;
}

function PauseMenu() {
  const paused = useGame((s) => s.paused), lang = useGame((s) => s.lang);
  if (!paused) return null;
  return <div className="absolute inset-0 z-[55] bg-black/80 backdrop-blur-md flex items-center justify-center px-5"><div className="w-[min(420px,92vw)] border border-white/15 bg-[#090b12] p-7"><div className="font-display text-2xl tracking-[0.2em] text-[#f3ede0] mb-2">PAUSED</div><div className="text-xs text-white/45 mb-7">{lang === 'bn' ? 'আপনার অগ্রগতি সংরক্ষিত আছে।' : 'Your journey progress is saved.'}</div><div className="grid gap-2">
    <button onClick={() => store.set({ paused: false })} className={`${controlClass} py-3 min-h-11 bg-[#ffd97d] text-black text-xs tracking-[0.2em]`}><Play size={15} className="inline mr-2" />{lang === 'bn' ? 'চালিয়ে যান' : 'RESUME'}</button>
    <button onClick={() => store.emit('toMap')} className={`${controlClass} py-3 min-h-11 border border-white/20 text-white/70 text-xs`}><Map size={15} className="inline mr-2" />{lang === 'bn' ? 'অধ্যায় তালিকা' : 'CHAPTER SELECT'}</button>
    <button onClick={() => store.emit('toDestinations')} className={`${controlClass} py-3 min-h-11 border border-white/20 text-white/70 text-xs`}><Globe2 size={15} className="inline mr-2" />{lang === 'bn' ? 'গন্তব্য নির্বাচন' : 'DESTINATIONS'}</button>
    <button onClick={() => store.emit('toSolar')} className={`${controlClass} py-3 min-h-11 border border-white/20 text-white/70 text-xs`}><Orbit size={15} className="inline mr-2" />{t(UI.backToSolar, lang)}</button>
  </div></div></div>;
}

function Joystick() {
  const phase = useGame((s) => s.phase);
  const ref = useRef<HTMLDivElement>(null); const [pos, setPos] = useState({ x: 0, y: 0 }); const active = useRef(false);
  if (phase !== 'explore') return null;
  const release = () => { active.current = false; setPos({ x: 0, y: 0 }); store.emit('joystick', { x: 0, y: 0 }); };
  return <div ref={ref} className="absolute bottom-8 left-8 z-30 w-28 h-28 rounded-full border border-white/20 bg-black/30 touch-none [@media(pointer:fine)]:hidden"
    onPointerDown={(e) => { active.current = true; (e.target as HTMLElement).setPointerCapture(e.pointerId); }}
    onPointerMove={(e) => { if (!active.current || !ref.current) return; const r = ref.current.getBoundingClientRect(); const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2), dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2); const len = Math.hypot(dx, dy) || 1, k = Math.min(len, 1) / len; setPos({ x: dx * k, y: dy * k }); store.emit('joystick', { x: dx * k, y: -dy * k }); }}
    onPointerUp={release} onPointerCancel={release}>
    <div className="absolute w-10 h-10 rounded-full bg-[#ffd97d]/50 left-1/2 top-1/2" style={{ transform: `translate(calc(-50% + ${pos.x * 30}px), calc(-50% + ${pos.y * 30}px))` }} />
  </div>;
}

function StoryChaptersSlot() {
  const showStory = useGame((s) => s.showStory);
  const activeMission = useGame((s) => s.activeMission);
  // Remount per story session so chapter state initializes from the saved run.
  return <StoryChapters key={`${activeMission}-${showStory ? 'open' : 'closed'}`} />;
}

export function Overlays() {
  const fading = useGame((s) => s.fading), modelStatus = useGame((s) => s.modelStatus), phase = useGame((s) => s.phase);
  return <>
    <HomeUI /><Caption /><Dialogue /><JourneyChoice /><StoryChaptersSlot /><InspectPanel /><CompleteOverlay /><JourneyMap /><HUD /><TopControls /><Joystick /><PauseMenu />
    {phase === 'explore' && modelStatus === 'loading' && <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 text-[9px] tracking-[0.25em] text-white/35">LOADING ASTRONAUT…</div>}
    <div className="absolute inset-0 z-[60] bg-black pointer-events-none transition-opacity duration-400" style={{ opacity: fading ? 1 : 0 }} />
  </>;
}
