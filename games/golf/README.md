# Omega Golf

A casual golf minigame made with the engine, inspired by the swing-and-wind
golf of motion-control consoles but with its own course, look and characters.
Plan and decisions: the "Omega Golf: plano" doc. The ball has its own physics
(no Rapier), so the game stays small and its tests run in Node.
`npm run build:games` bundles it into `docs/games/golf/` (GitHub Pages, from `develop`).

Phases done: 1 (ball, clubs, swing), 2 (the course: nine holes with bunkers,
water and trees, and wind), 3 (the green: slope dashes, the lip, the map view,
the fly-in over each hole), 4 (the golfer, animated, and the optional motion swing).

- `src/terrain.ts`: the ground: a height grid sampled bilinearly (height, normal, `downhill`) and a surface grid (tee, fairway, rough, sand, green, water, out), with how each surface plays (bounce, rolling resistance).
- `src/ball.ts`: the ball: flight with gravity, drag and the Magnus effect (backspin lifts, sidespin curves), wind, bounces (backspin bites), rolling down slopes (5/7 g), the cup (catches rolls under 1.5 m/s; a faster ball catches the lip once and turns away), water and out of bounds, trees (trunks bounce the ball back, leaves slow it); `simulate` plays a shot to the end without drawing.
- `src/clubs.ts`: driver, wood, iron, wedge, putter (full shots on the fairway: about 224, 190, 150 and 90 m; a putt's power is the distance on a flat green, up to 20 m); `shotFor` turns power and curve into a shot; `suggestClub` picks one for the distance; `lieFactor` takes speed off from the rough and sand (less for the wedge in sand).
- `src/course.ts`: holes described in code (tee, pin, fairway line and width, green radius and tilt, hills and a rise, bunkers, lakes and creeks, seeded trees, the strongest wind) and the ground built from them: bunker dishes, water beds under a level set just below their banks (the green and tee stay dry: an island green works), trees kept in the rough; `dropPoint` for a ball in water.
- `src/holes.ts`: the course, Vale Omega: nine holes, par 36 (Abertura, Lago Azul, Pinhal, Duna, Ribeiro, Ilha, Colina, Cotovelo, Regresso). A test checks every green can be reached in regulation without wind.
- `src/swing.ts`: the gesture: drag down to take the club back (power, on the bar), flick up to hit, a slanted flick curves; a sideways drag aims.
- `src/golfer.ts`: the golfer: the bowler's skeleton holding a club (shaft length per club), with Idle, Swing (top at 0.9 s, impact at 1.12 s) and Putt clips keyed in code; the backswing follows the power bar and the ball leaves when the club reaches it.
- `src/gyro.ts`: optional motion swing: hold a finger, swing the phone, let go; the peak rate is the power, a wrist twist curves. Hidden unless the page has `?gyro`.
- `src/score.ts`: names of a score on a hole (birdie, par, bogey…).
- `src/look.ts`: the golfer's meshes (cap, glove, club heads: wood, blade, putter); per hole, built the first time it is played: the terrain mesh and its painted surfaces, water surfaces, trees merged into two meshes (the engine has no instancing); shared: ball, flag and cup, the landing marker, sun and sky.
- `src/main.ts`: start-up, states (intro fly-in, aim, flight, result), HUD, camera, the trail, the green's slope (dashes flowing downhill: white, gold, pink as it steepens), the map view from above, the pole taken out for short putts. Keys: M map, arrows aim and change club, hold space (or Enter) for power and let go to hit, Q/E while holding curve left/right.

```sh
npm test
npm run check:games
npm run build:games golf
cd docs/games/golf && python3 -m http.server 8778
```
