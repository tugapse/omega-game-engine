# Omega Run

A side-on platformer made with the engine: Bit, a small round robot, runs and
jumps to the flag at the end of each level. Inspired by the mechanics of the
genre (variable jump height, blocks overhead, stomping enemies, power-ups) with
its own hero, worlds and look. Plan and decisions: the "Omega Plataformas: plano" doc.
3D drawn from the side; the hero has its own physics on a tile grid (no Rapier),
so the game stays small and its tests run in Node.
`npm run build:games -- platformer` bundles it into `docs/games/platformer/`.

Phases done: 1 (the core: tile physics, the jump, the camera, a test level, keyboard and touch).

- `src/level.ts`: levels as text, one character per tile (`#` ground, `X` block, `B` brick, `?` bonus, `S` start, `F` flag), top row first; the grid has y going up and a wall left of column 0.
- `src/levels.ts`: the levels (for now one test level, Prado 1).
- `src/physics.ts`: boxes moving through the grid one axis at a time at a fixed 1/120 s step: walls, landing, the tile bumped with the head, and slipping past a corner the head only clips (up to 0.22 m).
- `src/hero.ts`: the hero's moves: walk 6 m/s, run 9.5 m/s, quick turns, a jump from about 1.4 tiles (a tap) to 4.3 tiles (held), heavier gravity falling, coyote time (0.1 s) and a jump buffer (0.12 s).
- `src/camera.ts`: follows across with a dead zone, looks ahead the way the hero runs, never scrolls back (so the hero cannot go back either), and only follows up and down where the hero lands, or far off.
- `src/bot.ts`: a simple player that runs and jumps at walls and gaps; a test has it finish every level, and `?auto` lets it play in the browser.
- `src/input.ts`: keyboard (arrows or A/D, space/W/↑ to jump, Shift or J to run) and touch (a pad whose halves are left and right, and A and B buttons) as one input state; a jump press is kept until a step uses it.
- `src/look.ts`: the tiles merged into one mesh per kind per 16 columns, hidden off screen; canvas-drawn textures; the sky, hills at two depths, the light; the flag; Bit in plain shapes for now.
- `src/main.ts`: the loop (fixed steps), the camera, falling out (back to the start), the flag (level complete, with the time); `window.platformer` exposes hooks for tests.

Page options: `?touch` shows the touch buttons on any screen, `?auto` lets the bot play, `?debug` shows the frame rate, `?quality=low|medium|high`.
