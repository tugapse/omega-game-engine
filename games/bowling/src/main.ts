// Omega Bowling: a ten-frame game on a physics lane, thrown with a swipe.
import RAPIER from '@dimforge/rapier3d-compat';
import { vec2, vec3 } from 'gl-matrix';
import {
  Camera, CanvasViewport, Color, Pointer, DefaultResourceLoader, DependencyManager, Engine, PhysicsWorld, RapierBackend,
  RenderPipelineSettings, Resources, Scene, ToneMapping,
} from '../../../src';
import { bindSwipe } from './controls';
import { GyroThrow } from './gyro';
import { BowlingGame } from './scoring';
import {
  allStill, BALL, buildLane, isPinDown, LANE, LaneEntities, rackPins, removePin, resetBall, standingPins,
  ThrowParams, throwBall,
} from './lane';
import { dressLane, makeAimGuide, makeSweepBar } from './look';
import { ReplayRecorder } from './replay';
import { BowlingSound, forceToGain } from './sound';

const canvas = document.getElementById('view') as HTMLCanvasElement;
const hint = document.getElementById('hint')!;
const result = document.getElementById('result')!;
const pinDiagram = document.getElementById('pins')!;
const stats = document.getElementById('stats')!;
const frameInfo = document.getElementById('frame-info')!;
const scoreboard = document.getElementById('score')!;
const throwInfo = document.getElementById('throw-info')!;
const gyroButton = document.getElementById('gyro') as HTMLButtonElement;
const soundButton = document.getElementById('sound') as HTMLButtonElement;
const replayTag = document.getElementById('replay-tag')!;
const trailCanvas = document.getElementById('trail') as HTMLCanvasElement;
const trail2d = trailCanvas.getContext('2d')!;

type State = 'loading' | 'aim' | 'rolling' | 'settling' | 'result' | 'replay' | 'sweep' | 'over';
let state: State = 'loading';
let game = new BowlingGame();
/** Pins standing when the current roll started. */
let standingBefore: number[] = [];
let wentInGutter = false;
/** The sweep in progress: whether it ends with a fresh rack, and the standing pins it lifts. */
let sweep = { fresh: true, lifted: [] as { index: number; x: number; z: number }[], cleared: false, racked: false };
let sweepBar: import('../../../src').SceneEntity;
let aimGuide: import('../../../src').SceneEntity;
/** Aim, radians from straight down the lane (positive = right); a swipe's own angle adds to it. */
let aimAngle = 0;
const MAX_AIM = 0.07;
const gyro = new GyroThrow();
const BAR_REST = vec3.fromValues(0, 1.3, -17.75); // above the pin camera's view
const sound = new BowlingSound();
let recorder: ReplayRecorder;
/** Seconds since the ball was thrown (recording clock). */
let rollTime = 0;
/** A strike replay follows the current result. */
let replayNext = false;
/** Replay clock (seconds of the recording), its end, and the next sound event to play. */
let replay = { time: 0, end: 0, nextEvent: 0 };
const REPLAY_SPEED = 0.35;
/** The replay camera: low at the side of the pin deck, the ball rolling into view. */
const REPLAY_EYE = vec3.fromValues(0.42, 0.4, -15.7);
const REPLAY_LOOK = vec3.fromValues(0, 0.15, -18.65);
/** The swipe being drawn, in CSS pixels; `up` is when the finger lifted. */
let trail: { x: number; y: number }[] = [];
let trailUp = -1;
let stateTime = 0;
let ballX = 0;
let lane: LaneEntities;
let world: PhysicsWorld;
let scene: Scene;
let engine: Engine;

const gl = canvas.getContext('webgl2', { antialias: false })!;
if (!gl) {
  hint.textContent = 'Este browser não tem WebGL 2.';
  throw new Error('No WebGL 2');
}
new DependencyManager().registerDependencies();
Resources.setLoader(new DefaultResourceLoader(async (uri) => uri));
Resources.for(gl);
gl.clearColor(0.02, 0.02, 0.03, 1);

const camera = new Camera();
camera.name = 'Bowling camera';
camera.fieldOfView = 55;
camera.initialize();
Camera.setMainCamera(camera);
const eye = vec3.fromValues(0, 1.3, 2.4);
const look = vec3.fromValues(0, 0, -12);

function resize(): void {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const w = Math.max(1, Math.round(canvas.clientWidth * dpr));
  const h = Math.max(1, Math.round(canvas.clientHeight * dpr));
  if (canvas.width === w && canvas.height === h) return;
  canvas.width = w;
  canvas.height = h;
  gl.viewport(0, 0, w, h);
  CanvasViewport.rendererWidth = w;
  CanvasViewport.rendererHeight = h;
  camera.aspectRatio = w / h;
  camera.updateProjectionMatrix();
}
window.addEventListener('resize', resize);
resize();

function setState(next: State): void {
  state = next;
  stateTime = 0;
  hint.classList.toggle('hidden', next !== 'aim');
  result.classList.toggle('show', next === 'result' || next === 'over');
  result.classList.toggle('over', next === 'over');
  replayTag.classList.toggle('show', next === 'replay');
  if (next === 'aim') {
    const n = game.next!;
    frameInfo.textContent = `Frame ${n.frame + 1} · ${n.roll + 1}.º lançamento`;
  }
  placeAimGuide();
}

/** The guide sits in front of the ball while aiming, and under the floor otherwise. */
function placeAimGuide(): void {
  if (!aimGuide) return;
  aimGuide.transform.setLocalPosition(ballX, state === 'aim' ? 0.012 : -5, BALL.start[2]);
  aimGuide.transform.setLocalRotation(0, (-aimAngle * 180) / Math.PI, 0);
}

/** A tap on the lane while aiming points the throw at that spot. */
function aimAt(x: number, y: number): void {
  camera.transform.lookAt(look); // keep the view matrix current for the ray
  const ray = camera.screenToWorldRay(vec2.fromValues(x, y), canvas.clientWidth, canvas.clientHeight);
  if (ray.direction[1] >= -1e-4) return;
  const d = -ray.origin[1] / ray.direction[1];
  const px = ray.origin[0] + ray.direction[0] * d, pz = ray.origin[2] + ray.direction[2] * d;
  if (pz > BALL.start[2] - 2) return; // too close to the ball to give a direction
  aimAngle = Math.max(-MAX_AIM, Math.min(MAX_AIM, Math.atan2(px - ballX, BALL.start[2] - pz)));
  placeAimGuide();
}

function describeThrow(t: ThrowParams, angle: number): string {
  const hook = Math.abs(t.spin) < 1 ? 'sem efeito' : `efeito ${t.spin > 0 ? '←' : '→'} ${Math.round((Math.abs(t.spin) / 25) * 100)}%`;
  const dir = Math.abs(angle) < 0.002 ? 'em frente' : `${angle > 0 ? '→' : '←'} ${((Math.abs(angle) * 180) / Math.PI).toFixed(1)}°`;
  return `${(t.speed * 3.6).toFixed(0)} km/h · ${dir} · ${hook}`;
}

function bowl(t: ThrowParams): void {
  if (state !== 'aim') return;
  standingBefore = standingPins(lane);
  wentInGutter = false;
  const angle = Math.max(-0.1, Math.min(0.1, aimAngle + t.angle));
  throwInfo.textContent = describeThrow(t, angle);
  throwBall(lane, { ...t, angle });
  recorder.clear();
  rollTime = 0;
  setState('rolling');
}

function moveBall(dx: number): void {
  if (state !== 'aim') return;
  const limit = LANE.halfWidth - BALL.radius;
  ballX = Math.max(-limit, Math.min(limit, ballX + dx));
  resetBall(lane, ballX);
  placeAimGuide();
}

function turnAim(da: number): void {
  if (state !== 'aim') return;
  aimAngle = Math.max(-MAX_AIM, Math.min(MAX_AIM, aimAngle + da));
  placeAimGuide();
}

/** Taps: aim (or a motion throw) while aiming, otherwise continue. */
function tap(x: number, y: number): void {
  if (state === 'replay') { endReplay(); return; }
  if (state !== 'aim') { advance(); return; }
  const motion = gyro.enabled ? gyro.release() : null;
  if (motion) bowl(motion);
  else aimAt(x, y);
}

async function toggleGyro(): Promise<void> {
  if (gyro.enabled) gyro.disable();
  else if (!(await gyro.enable().catch(() => false))) {
    hint.textContent = 'Sem acesso ao giroscópio.';
    return;
  }
  gyroButton.classList.toggle('on', gyro.enabled);
  hint.textContent = gyro.enabled ? GYRO_HINT : SWIPE_HINT;
}

const SWIPE_HINT = hint.textContent ?? '';
const GYRO_HINT = 'Mantém o dedo no ecrã, balança o telemóvel como o braço e larga para lançar · roda o pulso para dar efeito';

/** Slow-motion replay of the roll, from just before the ball reached the pins. */
function startReplay(): void {
  const impact = recorder.impactTime ?? recorder.duration - 2;
  replay = { time: Math.max(0, impact - 0.9), end: Math.min(recorder.duration, impact + 2.2), nextEvent: 0 };
  while (replay.nextEvent < recorder.events.length && recorder.events[replay.nextEvent].time < replay.time) replay.nextEvent++;
  world.paused = true;
  recorder.apply(replay.time);
  vec3.copy(eye, REPLAY_EYE);
  vec3.copy(look, REPLAY_LOOK);
  setState('replay');
}

function updateReplay(dt: number): void {
  replay.time += dt * REPLAY_SPEED;
  while (replay.nextEvent < recorder.events.length && recorder.events[replay.nextEvent].time <= replay.time) {
    const e = recorder.events[replay.nextEvent++];
    if (e.kind === 'thud') sound.thud(e.gain); else sound.clack(e.gain, 0.75);
  }
  recorder.apply(Math.min(replay.time, replay.end));
  if (replay.time >= replay.end + 0.3) endReplay();
}

/** Back to the live state (bodies never moved during the replay), then on to the sweep. */
function endReplay(): void {
  if (state !== 'replay') return;
  world.paused = false;
  world.step(0); // writes the bodies' poses back to their entities
  state = 'result';
  advance();
}

/** After a result (tap or timeout): sweep and set up the next roll, or start a new game. */
function advance(): void {
  if (state === 'result') {
    if (game.isOver) {
      result.innerHTML = `Fim do jogo<br><b>${game.score}</b>`;
      setState('over');
      return;
    }
    const fresh = game.next!.freshRack;
    const lifted = fresh ? [] : standingPins(lane).map((index) => {
      const p = lane.pins[index].transform.worldPosition;
      return { index, x: p[0], z: p[2] };
    });
    sweep = { fresh, lifted, cleared: false, racked: false };
    resetBall(lane, ballX);
    sound.pinsetter(1.4);
    setState('sweep');
  } else if (state === 'over') {
    game = new BowlingGame();
    renderScore();
    rackPins(lane);
    resetBall(lane, ballX);
    showPins();
    setState('aim');
  }
}

const smooth = (t: number) => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t));

/**
 * The pinsetter, 1.4 s: lift the standing pins, lower the bar, sweep the
 * fallen pins into the pit, raise the bar, then set the pins down again (or
 * a fresh rack).
 */
function updateSweep(): void {
  const t = stateTime;
  const down = smooth(t / 0.3) - smooth((t - 0.8) / 0.3);
  const back = smooth((t - 0.3) / 0.5) - smooth((t - 1.0) / 0.2);
  sweepBar.transform.setLocalPosition(0, BAR_REST[1] - down * (BAR_REST[1] - 0.08), BAR_REST[2] - back * 1.85);
  const lift = 0.32 * (smooth((t - 0.05) / 0.25) - smooth((t - 1.1) / 0.25));
  for (const p of sweep.lifted) {
    lane.pinBodies[p.index].teleport(vec3.fromValues(p.x, lift, p.z), [0, 0, 0, 1]);
    lane.pinBodies[p.index].setLinearVelocity(vec3.create());
    lane.pinBodies[p.index].setAngularVelocity(vec3.create());
  }
  if (!sweep.cleared && t > 0.55) {
    sweep.cleared = true;
    const keep = new Set(sweep.lifted.map((p) => p.index));
    lane.pins.forEach((_, i) => { if (!keep.has(i)) removePin(lane, i); });
  }
  if (sweep.fresh && !sweep.racked && t > 1.2) {
    sweep.racked = true;
    rackPins(lane);
  }
  if (t > 1.4) {
    sweepBar.transform.setLocalPosition(BAR_REST[0], BAR_REST[1], BAR_REST[2]);
    showPins();
    setState('aim');
  }
}

function showPins(): number {
  let down = 0;
  pinDiagram.querySelectorAll('i').forEach((dot, i) => {
    const isDown = isPinDown(lane, i);
    dot.classList.toggle('down', isDown);
    if (isDown) down++;
  });
  return down;
}

/** Builds the ten frames of the scoreboard once, then fills them in. */
function renderScore(): void {
  if (!scoreboard.children.length) {
    for (let f = 0; f < 10; f++) {
      const frame = document.createElement('div');
      frame.className = f === 9 ? 'frame tenth' : 'frame';
      frame.innerHTML = `<div class="boxes">${'<span></span>'.repeat(f === 9 ? 3 : 2)}</div><div class="total"></div>`;
      scoreboard.appendChild(frame);
    }
  }
  const next = game.next;
  game.frames().forEach((view, f) => {
    const el = scoreboard.children[f] as HTMLElement;
    el.querySelectorAll('span').forEach((box, k) => { box.textContent = view.marks[k] ?? ''; });
    (el.querySelector('.total') as HTMLElement).textContent = view.total === null ? '' : String(view.total);
    el.classList.toggle('current', next?.frame === f);
  });
}

/** The ball's rumble: on the lane or in a gutter, silent in the air, the pit or at rest. */
function updateRollSound(): void {
  const b = lane.ball.transform.worldPosition;
  const live = state === 'rolling' || state === 'settling';
  const onLane = b[1] > BALL.radius - 0.1 && b[1] < BALL.radius + 0.01 && b[2] > LANE.deckEnd && b[2] < 0.5;
  const speed = live && onLane ? vec3.length(lane.ballBody.getLinearVelocity()) : 0;
  sound.roll(speed, Math.abs(b[0]) > LANE.halfWidth);
}

/** Contact sounds: each pair of objects sounds once when it starts touching hard (forces repeat every step). */
const lastContact = new Map<string, number>();
function onContactForce(a: import('../../../src').SceneEntity, b: import('../../../src').SceneEntity, force: number): void {
  const now = performance.now() / 1000;
  const key = a.name < b.name ? `${a.name}|${b.name}` : `${b.name}|${a.name}`;
  const lastTime = lastContact.get(key) ?? -1;
  lastContact.set(key, now);
  if (now - lastTime < 0.12) return;
  const isBall = (e: typeof a) => e === lane.ball;
  const isPin = (e: typeof a) => lane.pins.includes(e);
  const ballPin = (isBall(a) && isPin(b)) || (isBall(b) && isPin(a));
  if (ballPin && recorder.impactTime === null && state === 'rolling') recorder.impactTime = rollTime;
  const kind = isBall(a) || isBall(b) ? (ballPin ? 'hit' : 'thud') : isPin(a) && isPin(b) ? 'clack' : 'deck';
  if (kind === 'thud' && force < 400) return; // the ball's own weight on the lane
  const gain = forceToGain(force, kind === 'hit' ? 30 : 20);
  const live = state === 'rolling' || state === 'settling';
  if (kind === 'thud') sound.thud(gain);
  else sound.clack(kind === 'hit' ? Math.min(1, gain * 1.3) : gain, kind === 'deck' ? 0.8 : 1);
  if (kind === 'hit') sound.thud(gain * 0.6);
  if (live) recorder.event(rollTime, kind === 'thud' ? 'thud' : 'clack', gain);
}

/** The swipe trail: a fading line where the finger went. */
function drawTrail(now: number): void {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const w = Math.round(trailCanvas.clientWidth * dpr), h = Math.round(trailCanvas.clientHeight * dpr);
  if (trailCanvas.width !== w || trailCanvas.height !== h) { trailCanvas.width = w; trailCanvas.height = h; }
  trail2d.clearRect(0, 0, w, h);
  const fade = trailUp < 0 ? 1 : 1 - (now - trailUp) / 500;
  if (trail.length < 2 || fade <= 0) return;
  trail2d.lineCap = 'round';
  trail2d.lineJoin = 'round';
  trail2d.lineWidth = 6 * dpr;
  trail2d.strokeStyle = `rgba(255, 207, 90, ${0.55 * fade})`;
  trail2d.beginPath();
  trail.forEach((p, i) => (i ? trail2d.lineTo(p.x * dpr, p.y * dpr) : trail2d.moveTo(p.x * dpr, p.y * dpr)));
  trail2d.stroke();
}

function update(dt: number): void {
  stateTime += dt;
  const ball = lane.ball.transform.worldPosition;
  if (state === 'rolling' || state === 'settling') {
    rollTime += dt;
    recorder.record(rollTime);
  }
  updateRollSound();
  if (state === 'rolling') {
    const speed = vec3.length(lane.ballBody.getLinearVelocity());
    if (Math.abs(ball[0]) > LANE.halfWidth + 0.03 && ball[2] > LANE.headPin) wentInGutter = true;
    if (ball[2] < LANE.deckEnd - 0.2 || ball[1] < -0.2 || stateTime > 10 || (stateTime > 1 && speed < 0.05)) setState('settling');
  } else if (state === 'settling') {
    if ((stateTime > 1.5 && allStill(lane)) || stateTime > 5) {
      showPins();
      const before = game.next!;
      const pins = standingBefore.filter((i) => isPinDown(lane, i)).length;
      game.roll(pins);
      renderScore();
      const strike = before.freshRack && pins === 10;
      const spare = !strike && !before.freshRack && pins === before.pinsLeft;
      result.textContent = strike ? 'Strike!' : spare ? 'Spare!'
        : pins === 0 ? (wentInGutter ? 'Calha' : 'Nenhum pino')
          : `${pins} ${pins === 1 ? 'pino' : 'pinos'}`;
      result.classList.toggle('big', strike || spare);
      if (strike || spare) sound.chime(strike);
      replayNext = strike && recorder.impactTime !== null;
      setState('result');
    }
  } else if (state === 'result') {
    if (stateTime > (replayNext ? 1.3 : 1.8)) {
      if (replayNext) { replayNext = false; startReplay(); } else advance();
    }
  } else if (state === 'replay') {
    updateReplay(dt);
  } else if (state === 'sweep') {
    updateSweep();
  }
  if (state === 'rolling' || state === 'settling') showPins();

  // Camera: behind the ball when aiming, following it down the lane, then on the pins.
  const target = vec3.create(), aimAt = vec3.create();
  if (state === 'aim' || state === 'loading') {
    vec3.set(target, ballX * 0.6, 1.3, 2.4);
    vec3.set(aimAt, ballX * 0.3, 0, -12);
  } else if (state === 'rolling' && recorder.impactTime !== null) {
    // At impact: a cut to a low, close view of the pins.
    vec3.set(target, 0.25, 0.55, -16.5);
    vec3.set(aimAt, 0, 0.15, -18.6);
  } else if (state === 'rolling') {
    vec3.set(target, ball[0] * 0.5, 0.9, Math.max(ball[2] + 2.8, -14.8));
    vec3.set(aimAt, ball[0] * 0.3, 0.1, Math.max(ball[2] - 5, -18.8));
  } else if (state === 'replay') {
    // Fixed beside the deck on the pins, turning a little with the ball.
    vec3.copy(target, REPLAY_EYE);
    vec3.set(aimAt, REPLAY_LOOK[0] + ball[0] * 0.2, REPLAY_LOOK[1], REPLAY_LOOK[2]);
  } else {
    vec3.set(target, 0, 1.0, -15.6);
    vec3.set(aimAt, 0, 0.1, -18.7);
  }
  const cut = state === 'rolling' && recorder.impactTime !== null && rollTime - recorder.impactTime < 0.05;
  const k = cut ? 1 : 1 - Math.exp(-dt * (state === 'rolling' ? 8 : state === 'replay' ? 4 : state === 'aim' ? 6 : 3));
  vec3.lerp(eye, eye, target, k);
  vec3.lerp(look, look, aimAt, k);
  camera.transform.setLocalPosition(eye[0], eye[1], eye[2]);
  camera.transform.lookAt(look);
}

let last = 0, fpsTime = 0, fpsFrames = 0;
function frame(now: number): void {
  const dt = last ? Math.min((now - last) / 1000, 0.1) : 0;
  last = now;
  resize();
  update(dt);
  engine.update(dt);
  engine.render();
  drawTrail(now);
  fpsFrames++;
  fpsTime += dt;
  if (fpsTime >= 0.5) {
    stats.textContent = `${Math.round(fpsFrames / fpsTime)} fps`;
    fpsFrames = 0;
    fpsTime = 0;
  }
  requestAnimationFrame(frame);
}

async function start(): Promise<void> {
  world = new PhysicsWorld(await RapierBackend.load(RAPIER), { fixedTimeStep: 1 / 120, maxSubSteps: 8 });
  scene = new Scene();
  scene.name = 'Bowling';
  scene.addBehaviour(world);
  lane = buildLane(world);
  for (const e of [...lane.blocks.map((b) => b.entity), lane.ball, ...lane.pins]) scene.addEntity(e);
  await dressLane(gl, scene, lane);
  sweepBar = await makeSweepBar(gl, scene);
  sweepBar.transform.setLocalPosition(BAR_REST[0], BAR_REST[1], BAR_REST[2]);
  aimGuide = await makeAimGuide(gl, scene);
  recorder = new ReplayRecorder([lane.ball, ...lane.pins]);
  world.onContactForce((e) => onContactForce(e.a.parent, e.b.parent, e.force));
  // A dark hall: the far end fades into it.
  scene.sceneFog.enabled = true;
  scene.sceneFog.fogType = 1; // exponential
  scene.sceneFog.density = 0.035;
  scene.sceneFog.color = new Color(0.03, 0.03, 0.045, 1);
  renderScore();
  scene.setGlRenderingContext(gl);
  engine = new Engine();
  engine.initialize(canvas);
  engine.loadScene(scene);
  const settings = scene.renderPipeline.settings;
  settings.toneMapping = ToneMapping.ACES;
  const q = new URLSearchParams(location.search).get('quality');
  const named: Record<string, number> = { low: 0, medium: 1, high: 2 };
  settings.applyQuality(q && q in named ? named[q] : RenderPipelineSettings.suggestedQuality(gl));
  scene.isRunning = true;

  bindSwipe(canvas, { onMove: (f) => moveBall(f * 1.5), onThrow: bowl, onTap: tap });
  Pointer.onDown((p) => {
    if (!sound.running && !sound.muted) sound.unlock(); // browsers allow audio only after a gesture
    if (gyro.enabled && state === 'aim') gyro.hold();
    const r = canvas.getBoundingClientRect();
    trail = state === 'aim' ? [{ x: p.x - r.left, y: p.y - r.top }] : [];
    trailUp = -1;
  });
  Pointer.onMove((p) => {
    if (!trail.length || trailUp >= 0) return;
    const r = canvas.getBoundingClientRect();
    trail.push({ x: p.x - r.left, y: p.y - r.top });
  });
  Pointer.onUp(() => { trailUp = performance.now(); });
  let muted = false;
  try { muted = localStorage.getItem('bowling.muted') === '1'; } catch { /* no storage */ }
  const showSound = () => { soundButton.textContent = muted ? 'Som: não' : 'Som: sim'; soundButton.classList.toggle('on', !muted); };
  sound.setMuted(muted);
  showSound();
  soundButton.addEventListener('click', () => {
    muted = !muted;
    sound.setMuted(muted);
    if (!muted) sound.unlock();
    try { localStorage.setItem('bowling.muted', muted ? '1' : '0'); } catch { /* no storage */ }
    showSound();
  });
  // The gyroscope is a nice-to-have, tuned at the end: hidden unless the page has ?gyro.
  if (GyroThrow.available && new URLSearchParams(location.search).has('gyro')) gyroButton.hidden = false;
  gyroButton.addEventListener('click', () => { void toggleGyro(); });
  window.addEventListener('keydown', (e) => {
    if (!sound.running && !sound.muted) sound.unlock();
    if (e.key === 'ArrowLeft') moveBall(-0.03);
    else if (e.key === 'ArrowRight') moveBall(0.03);
    else if (e.key === 'a' || e.key === 'A') turnAim(-0.005);
    else if (e.key === 'd' || e.key === 'D') turnAim(0.005);
    else if (e.key === ' ' || e.key === 'Enter' || e.key === 'q' || e.key === 'e') {
      // Space or Enter: straight; Q: hook left; E: hook right.
      const spin = e.key === 'q' ? 15 : e.key === 'e' ? -15 : 0;
      if (state === 'aim') bowl({ speed: 8, angle: 0, spin });
      else if (state === 'replay') endReplay();
      else advance();
    }
  });
  (window as any).bowling = {
    lane, world, scene, bowl, advance, aimAt, sound, recorder, startReplay, get aimAngle() { return aimAngle; },
    get game() { return game; }, get state() { return state; },
  };
  document.getElementById('loading')!.classList.add('done');
  setState('aim');
  requestAnimationFrame(frame);
}

start().catch((err) => {
  hint.textContent = `Erro: ${err?.message ?? err}`;
  console.error(err);
});
