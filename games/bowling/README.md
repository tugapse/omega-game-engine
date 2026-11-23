# Omega Bowling

A bowling minigame made with the engine and its physics module (Rapier).
The source lives here; `npm run build:games` bundles it into
`docs/games/bowling/`, which GitHub Pages serves (from `develop`).

- `src/lane.ts`: lane, ball and pins as physics entities, the ball's friction on the oil and the dry back end (the hook), racking, throwing, pins down (no rendering, tested in Node).
- `src/look.ts`: meshes, canvas-drawn textures, room and lights.
- `src/controls.ts`: the swipe gesture (drag sideways to move, swipe up to bowl, a curved swipe gives spin).
- `src/gyro.ts`: optional motion control (hold, swing the phone, let go; a wrist twist gives spin). Hidden for now: `?gyro` shows its button.
- `src/sound.ts`: sounds synthesised with Web Audio (rolling, pin clacks, thuds, pinsetter, chimes); no sound files.
- `src/music.ts`: background music, a 16-bar lounge bossa sequenced with the engine's SequencerClock and synthesised (keys, vibraphone, bass, brushes).
- `src/replay.ts`: records the ball and pins every frame and plays them back (strike replays).
- `src/scoring.ts`: ten-frame scoring.
- `src/match.ts`: one to four players taking turns, a frame each, and the ranking (any game type: classic or obstacles).
- `src/arcade.ts`: the obstacle mode's scoring: ten rounds of up to two balls; a player's level goes by the pins they have knocked down (15, 30, 50, 75… for levels 2, 3, 4, 5…, never down) and multiplies their points (×1, ×1.5, ×2…).
- `src/spares.ts`: the spare challenge: ten leaves (from the 5 pin to the 7-10), one ball each; a clear scores its stars × 10, a miss the pins knocked down.
- `src/cpu.ts`: the computer opponent (easy, medium, hard): a hook into the pocket on a full rack, a straight ball at a leave's front pin, the corridor past obstacles; errors by skill (first ball, on average: 7.1, 8.7 and 9.1 pins).
- `src/obstacles.ts`: what stands on the lane at each level (seeded: a level is always the same lane, with a straight corridor at least 8 cm wide), and the pool of kinematic bodies that plays it, moved on the physics' fixed step (posts, bumpers, sliders, a spinner, a wind zone).
- `src/bowler.ts`: the bowler, a hierarchy of joints with an idle loop and a throw (four steps, slide, release, follow-through) keyed in code and played by the engine's Animator; the hips rise wherever the easing would push a foot through the floor. look.ts gives it its meshes and shirt colours.
- `src/main.ts`: start-up, the players screen, game states, aiming, the approach and release, pinsetter, camera, HUD. Keys: M switches the mode and 1–4 pick the players on the start screen; arrows move, A/D aim, space throws straight, Q/E throw with a left/right hook.
- `index.html`: the page and HUD.

From the engine root:

```sh
npm test                 # includes games/**/*.test.ts
npm run check:games      # type check
npm run build:games      # → docs/games/bowling/
cd docs/games/bowling && python3 -m http.server 8777   # http://localhost:8777/?quality=low|medium|high
```

The plan and the decisions are in the "Omega Bowling: plano" doc.
