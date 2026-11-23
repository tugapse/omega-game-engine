# Omega Golf

A casual golf minigame made with the engine, inspired by the swing-and-wind
golf of motion-control consoles but with its own course, look and characters.
Plan and decisions: the "Omega Golf: plano" doc. The ball has its own physics
(no Rapier), so the game stays small and its tests run in Node.
`npm run build:games` bundles it into `docs/games/golf/` (GitHub Pages, from `develop`).

Phase 1 (this): one test hole, five clubs, the swing gesture, the ball's flight
and roll, the camera following it.

- `src/terrain.ts`: the ground: a height grid sampled bilinearly (height, normal) and a surface grid (tee, fairway, rough, sand, green, water, out), with how each surface plays (bounce, rolling resistance).
- `src/ball.ts`: the ball: flight with gravity, drag and the Magnus effect (backspin lifts, sidespin curves), wind, bounces (backspin bites), rolling down slopes (5/7 g), the cup (catches rolls under 1.5 m/s), water and out of bounds; `simulate` plays a shot to the end without drawing.
- `src/clubs.ts`: driver, wood, iron, wedge, putter (full shots on the fairway: about 224, 190, 150 and 90 m; a putt's power is the distance on a flat green, up to 20 m); `shotFor` turns power and curve into a shot; `suggestClub` picks one for the distance.
- `src/course.ts`: holes described in code (tee, pin, fairway line and width, green radius and tilt, hills) and the ground built from them; the test hole.
- `src/swing.ts`: the gesture: drag down to take the club back (power, on the bar), flick up to hit, a slanted flick curves; a sideways drag aims.
- `src/score.ts`: names of a score on a hole (birdie, par, bogey…).
- `src/look.ts`: the terrain mesh and its painted surfaces, ball, flag and cup, the landing marker, sun and sky.
- `src/main.ts`: start-up, states (aim, flight, result), HUD, camera, the trail. Keys: arrows aim and change club, hold space (or Enter) for power and let go to hit, Q/E while holding curve left/right.

```sh
npm test
npm run check:games
npm run build:games golf
cd docs/games/golf && python3 -m http.server 8778
```
