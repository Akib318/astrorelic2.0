# ASTRO RELIC — Abandoned but Not Forgotten

A cinematic, browser-based 3D exploration game built with React, TypeScript, Vite, and Three.js. The original project architecture, solar-system navigation, Nova guide, Pathfinder/Sojourner story, audiovisual presentation, and bilingual interface are preserved and expanded.

## Included journeys

- **Moon — 11 sequential chapters:** Lunar Ranger, Surveyor, Lunar Orbiter, Apollo 8, Apollo 11, Apollo 12, Apollo 13, Apollo 14, Apollo 15, Apollo 16, and Apollo 17.
- **Mars — 5 sequential chapters:** Mars Pathfinder/Sojourner, Spirit, Opportunity, Phoenix, and InSight.
- Orbital, flyby, impact, stationary-lander, and rover missions use historically appropriate presentation rather than sharing one mission type.
- Each chapter includes a cinematic approach, mission record, equipment inspection, discoveries, completion, replay, and next-chapter navigation.

## Gameplay

- **WASD / arrow keys:** walk
- **Shift:** run
- **Mouse drag:** orbit the third-person camera
- **Mouse wheel:** camera distance
- **Click / tap:** advance dialogue and inspect highlighted hardware
- **Escape:** pause or resume
- Touch devices also provide an on-screen movement joystick.

Surface chapters use Cannon-es physics, a fixed 60 Hz timestep, heightfield terrain, fixed equipment colliders, movable rocks, and destination gravity of 1.62 m/s² on the Moon or 3.71 m/s² on Mars. A shared detailed astronaut includes a reflective visor, runtime skeletal motion, and a procedural loading fallback.

## Saving and settings

Progress is saved automatically in this browser's `localStorage`: destination, per-world chapter completion, discoveries, tutorial state, language, audio, and graphics quality. Moon and Mars progression unlock independently. Saves do not synchronize between browsers or devices; clearing site data removes them.

Low, medium, and high graphics modes adjust rendering resolution, terrain density, environmental detail, stars, and shadows. English and Bangla can be switched from the top controls.

## Development

```bash
npm install
npm run dev
```

Production verification:

```bash
npm run build
npm run preview
```

The production output is generated in `dist/`. The project is frontend-only and requires no backend or account.

## Main source areas

- `src/data/missions.ts` — bilingual mission catalog and progression order
- `src/state/store.ts` — game state, persistence, dialogue, and event bus
- `src/game/engine.ts` — scene routing and global controls
- `src/game/scenes/` — cinematic, exploration, story, inspection, and completion scenes
- `src/game/physics.ts` — fixed-step Cannon-es surface physics
- `src/game/models/` — astronaut and historical equipment builders
- `src/components/Overlays.tsx` — menus, HUD, chapter maps, and interaction UI

See `CREDITS.md` for third-party asset attribution.
