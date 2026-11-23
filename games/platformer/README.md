# Omega Run

A side-on platformer made with the engine: Bit, a small round robot, runs and
jumps to the flag at the end of each level. Inspired by the mechanics of the
genre (variable jump height, blocks overhead, stomping enemies, power-ups) with
its own hero, worlds and look. Plan and decisions: the "Omega Plataformas: plano" doc.
3D drawn from the side; the hero has its own physics on a tile grid (no Rapier),
so the game stays small and its tests run in Node.
`npm run build:games -- platformer` bundles it into `docs/games/platformer/`.

Phases done: 1 (the core: tile physics, the jump, the camera, a test level, keyboard and touch), 2 (a living world: coins, bonus blocks and bricks, three enemies, spikes, lives, a checkpoint and the clock).

- `src/level.ts`: levels as text, one character per tile (`#` ground, `X` block, `B` brick, `?` bonus, `^` spikes) and things placed on it (`o` coin, `g` walker, `k` shell, `v` flyer, `C` checkpoint, `S` start, `F` flag), top row first; the grid has y going up and a wall left of column 0.
- `src/levels.ts`: the levels (for now one test level, Prado 1).
- `src/world.ts`: a level being played: coins (200 points; 100 give a life), bonus blocks (a coin, then used up), blocks bumped from below knock off the enemy on top, spikes, enemies that wake as the camera reaches them (Bolota walks and is squashed by a stomp; Casco hides in its shell when stomped and slides when kicked, knocking out other enemies; Zumbido hovers up and down), stomps in a row score 100, 200, 400, 800, then 1000, a bounce higher with the button held, three lives, a checkpoint to come back to, a 300 s clock, and the time left as points at the flag; events for sounds and effects.
- `src/physics.ts`: boxes moving through the grid one axis at a time at a fixed 1/120 s step: walls, landing, the tile bumped with the head, and slipping past a corner the head only clips (up to 0.22 m).
- `src/hero.ts`: the hero's moves: walk 6 m/s, run 9.5 m/s, quick turns, a jump from about 1.4 tiles (a tap) to 4.3 tiles (held), heavier gravity falling, coyote time (0.1 s) and a jump buffer (0.12 s).
- `src/camera.ts`: follows across with a dead zone, looks ahead the way the hero runs, never scrolls back (so the hero cannot go back either), and only follows up and down where the hero lands, or far off; it climbs only when the hero stands well above the start, so the ground stays in view on low platforms.
- `src/bot.ts`: a simple player that runs and jumps at walls, gaps, spikes and enemies, and looks before leaping (it plays the jump with the same physics first, and only jumps if it lands safely); a test has it finish every level without dying, and `?auto` lets it play in the browser.
- `src/input.ts`: keyboard (arrows or A/D, space/W/↑ to jump, Shift or J to run) and touch (a pad whose halves are left and right, and A and B buttons) as one input state; a jump press is kept until a step uses it.
- `src/look.ts`: the tiles that never change (ground, blocks, spikes) merged into one mesh per kind per 16 columns, hidden off screen; canvas-drawn textures; the sky, hills at two depths, the light; the flag; Bit in plain shapes for now.
- `src/things.ts`: what changes, one entity each (the engine uploads a mesh once): bricks and bonus blocks with a hop when bumped, spinning coins and the one popping out of a block, the three enemies (squashed, flipped, hidden in the shell, wings beating), and the checkpoint flags.
- `src/main.ts`: the loop (fixed steps), the camera, the HUD (lives, coins, score, clock), dying (a hop and a fall, then the next try from the checkpoint), game over, the flag (level complete, with the score); `window.platformer` exposes hooks for tests.

Page options: `?touch` shows the touch buttons on any screen, `?auto` lets the bot play, `?debug` shows the frame rate, `?quality=low|medium|high`.
