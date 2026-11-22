# Omega Bowling

A bowling minigame made with the engine and its physics module (Rapier).
The source lives here; `npm run build:games` bundles it into
`docs/games/bowling/`, which GitHub Pages serves (from `develop`).

- `src/lane.ts`: lane, ball and pins as physics entities, the ball's friction on the oil and the dry back end (the hook), racking, throwing, pins down (no rendering, tested in Node).
- `src/look.ts`: meshes, canvas-drawn textures, room and lights.
- `src/controls.ts`: the swipe gesture (drag sideways to move, swipe up to bowl, a curved swipe gives spin).
- `src/gyro.ts`: optional motion control (hold, swing the phone, let go; a wrist twist gives spin).
- `src/scoring.ts`: ten-frame scoring.
- `src/main.ts`: start-up, game states, aiming, pinsetter, camera, HUD. Keys: arrows move, A/D aim, space throws straight, Q/E throw with a left/right hook.
- `index.html`: the page and HUD.

From the engine root:

```sh
npm test                 # includes games/**/*.test.ts
npm run check:games      # type check
npm run build:games      # → docs/games/bowling/
cd docs/games/bowling && python3 -m http.server 8777   # http://localhost:8777/?quality=low|medium|high
```

The plan and the decisions are in the "Omega Bowling: plano" doc.
