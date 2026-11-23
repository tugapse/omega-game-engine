# Omega Drift

A drift racer made with the engine: small, rounded cars on short tracks,
where sliding well is what counts. Inspired by the mechanics of the genre
(controlled slides, a boost charged by drifting, ghosts) with its own cars,
tracks and look. Plan and decisions: the "Omega Drift: plano" doc. The car has
its own physics on a plane (no Rapier), so the game stays small and its tests
run in Node. `npm run build:games -- drift` bundles it into `docs/games/drift/`.

Phases done: 1 (the core: the car's physics with drifting and the drift assist, a test track with walls, the chase camera, keyboard, gamepad and touch, the speedometer).

- `src/car.ts`: the car at a fixed 1/120 s step, a bicycle model (a front and a rear axle). Each axle's tyres push sideways against their slip angle (stiffness × load × slip) up to their grip (front 1.0, rear 1.1, rear with the handbrake 0.45, times the ground's grip); the rear tyres share their grip between the drive and the side force, so full throttle in a bend swings the tail out. Drive up to 11 kN and 120 kW, a soft limiter at 34 m/s (about 6 s to 100 km/h), brakes split 60/40 front and rear, reverse with the brake held at a standstill, less steering lock at speed, and a slide assist that turns the nose back towards the motion past 29° of drift angle.
- Drift assist (in `src/car.ts`, on by default, a toggle in the pause screen): above 36 km/h a tap of the handbrake with the wheel turned (or a free slide past 12° the way the wheel turns) starts an assisted drift. The game then holds the car sideways and carries it round: with the wheel let go it holds about 23°, steering into the bend deepens it to about 38° and tightens the line (up to 1.2 g), steering out of it brings the angle down and ends the drift lined up with the motion; braking, a hard wall hit or dropping under 25 km/h end it too. The throttle keeps the speed up in a slide; off it, the slide scrubs speed.
- `src/track.ts`: a track is a closed Catmull-Rom curve through control points, sampled every metre, with a width: road, kerb, grass and then a wall. It tells where a point is along and across the line, the surface under the car (grass: 0.6 grip and drag), and bounces the car off the walls.
- `src/tracks.ts`: the tracks (for now the test loop, 718 m).
- `src/driver.ts`: a driver that steers at a point ahead on the centre line and picks its speed from the bends ahead, with traction control; the tests have it lap every track without leaving the road, and `?auto` lets it drive in the browser.
- `src/camera.ts`: the chase camera, behind and above, swinging round with a lag and looking along a blend of the nose and the motion, so a slide is seen from the side; the field of view widens with speed.
- `src/input.ts`: keyboard (↑/W, ↓/S, ←→/A D, space for the handbrake), a gamepad (stick or cross, RT or A to accelerate, LT or X to brake, B or RB for the handbrake, Start to pause) and touch (drag sideways on the left half to steer, down to brake; the accelerator and the handbrake on the right).
- `src/look.ts`: the track's road, kerbs and walls as strips along the curve, in pieces hidden when far; grass, trees kept off the track, the light; the car in blocks for now, with wheels that steer and roll and a body that leans.
- `src/main.ts`: loading, the fixed-step loop, the HUD (speedometer, gear, drift meter), pause (❚❚, Esc or P), putting the car back on the track (R or ↺), a small shake on hard wall hits, the drawing resolution stepping down on slow devices; `window.drift` exposes hooks for tests.

Page options: `?auto` lets the driver drive, `?touch` shows the touch controls on any screen, `?debug` shows the frame rate, the drawing resolution, the drift angle and the rear tyres' load, `?quality=low|medium|high`.
