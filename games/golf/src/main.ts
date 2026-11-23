// Omega Golf, phase 1: one test hole, the five clubs, the swing gesture and the
// ball's own physics; the camera follows the ball.
import { mat4, vec3, vec4 } from 'gl-matrix';
import {
  Camera, CanvasViewport, Color, DefaultResourceLoader, DependencyManager, Engine, Pointer, RenderPipelineSettings,
  Resources, Scene, ToneMapping,
} from '../../../src';
import { BALL, BallState, Course, hit, restingBall, simulate, stepBall } from './ball';
import { club, ClubId, CLUBS, MAX_PUTT, shotFor, suggestClub } from './clubs';
import { buildHole, Hole, TEST_HOLE } from './course';
import { BALL_LOOK, CourseLook, dressCourse } from './look';
import { scoreName } from './score';
import { bindSwing, Swing } from './swing';
import { HeightField, Surface } from './terrain';

const $ = (id: string) => document.getElementById(id)!;
const canvas = $('view') as HTMLCanvasElement;
const trailCanvas = $('trail') as HTMLCanvasElement;
const trail2d = trailCanvas.getContext('2d')!;
const result = $('result');
const hint = $('hint');
const powerBox = $('power');
const powerFill = $('power-fill');
const powerLabel = $('power-label');
const debug = new URLSearchParams(location.search).has('debug');

type State = 'loading' | 'aim' | 'flight' | 'result';
let state: State = 'loading';
let stateTime = 0;
let hole: Hole;
let course: Course;
let look: CourseLook;
let ball: BallState;
/** Where the current shot was played from (for stroke and distance). */
let shotFrom = { x: 0, z: 0 };
let strokes = 0;
let clubId: ClubId = 'driver';
/** Aim, radians from straight down -z; positive = right. */
let aim = 0;
/** The backswing in progress (0–1), or null. */
let power: number | null = null;
/** Full-power distance of each club on the fairway (carry plus roll), measured at load. */
const reach = {} as Record<ClubId, number>;
/** The flight drawn as a line: world points. */
let trail: number[][] = [];
let trailFade = 1;
let accumulator = 0;
/** What the result banner leads to. */
let afterResult: 'next-shot' | 'restart' = 'next-shot';
let shotsMade = 0;
const HINT_SHOTS = 3;
/** Keyboard swing: held space, its power and curve. */
let keySwing: { start: number; curve: number } | null = null;

const gl = canvas.getContext('webgl2', { antialias: true })!;
if (!gl) { $('load-text').textContent = 'Este browser não tem WebGL 2.'; throw new Error('No WebGL 2'); }
new DependencyManager().registerDependencies();
Resources.setLoader(new DefaultResourceLoader(async (uri) => uri));
Resources.for(gl);
gl.clearColor(0.3, 0.58, 0.95, 1);

const camera = new Camera();
camera.name = 'Golf camera';
camera.fieldOfView = 50;
camera.nearPlane = 0.05;
camera.farPlane = 1500;
camera.initialize();
Camera.setMainCamera(camera);
const eye = vec3.fromValues(0, 2, 5);
const target = vec3.fromValues(0, 0, -30);

function resize(): void {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const w = Math.max(1, Math.round(canvas.clientWidth * dpr)), h = Math.max(1, Math.round(canvas.clientHeight * dpr));
  if (canvas.width === w && canvas.height === h) return;
  canvas.width = w; canvas.height = h;
  trailCanvas.width = w; trailCanvas.height = h;
  gl.viewport(0, 0, w, h);
  CanvasViewport.rendererWidth = w;
  CanvasViewport.rendererHeight = h;
  camera.aspectRatio = w / h;
  camera.updateProjectionMatrix();
}
window.addEventListener('resize', resize);
resize();

const SURFACE_NAME: Record<Surface, string> = {
  tee: 'tee', fairway: 'fairway', rough: 'rough', sand: 'areia', green: 'green', water: 'água', out: 'fora',
};

const lie = (): Surface => hole.ground.surface(ball.pos[0], ball.pos[2]);
const toPin = () => ({ x: hole.spec.pin.x - ball.pos[0], z: hole.spec.pin.z - ball.pos[2] });
const pinDistance = () => Math.hypot(toPin().x, toPin().z);

/** Aims at the pin and picks the club for the distance. */
function readyShot(): void {
  const t = toPin();
  aim = Math.atan2(t.x, -t.z);
  const s = lie();
  clubId = suggestClub(pinDistance(), reach, s === 'green', s === 'tee');
  // Long holes: from the tee, aim down the fairway rather than straight at a far pin.
  if (s === 'tee' && pinDistance() > reach.driver) {
    const p = hole.spec.fairway.find((q) => Math.hypot(q.x - ball.pos[0], q.z - ball.pos[2]) > reach.driver * 0.75) ?? hole.spec.pin;
    aim = Math.atan2(p.x - ball.pos[0], -(p.z - ball.pos[2]));
  }
  showHud();
  placeMarker();
}

function showHud(): void {
  $('hole-name').textContent = hole.spec.name;
  $('par').innerHTML = `<b>Par</b>${hole.spec.par}`;
  $('strokes').innerHTML = `<b>Pancadas</b>${strokes}`;
  $('dist').innerHTML = `<b>Bandeira</b>${pinDistance() < 10 ? pinDistance().toFixed(1) : Math.round(pinDistance())} m`;
  $('lie').innerHTML = `<b>Na</b>${SURFACE_NAME[lie()]}`;
  const c = club(clubId);
  $('club-name').textContent = c.name;
  $('club-reach').textContent = c.id === 'putter' ? `até ${MAX_PUTT} m` : `${Math.round(reach[c.id])} m`;
}

/** Puts the marker where the ball would land with this club at this power (full power while aiming). */
function placeMarker(p = 1): void {
  const c = club(clubId);
  let x: number, z: number;
  if (c.id === 'putter') {
    const d = p * MAX_PUTT;
    x = ball.pos[0] + Math.sin(aim) * d; z = ball.pos[2] - Math.cos(aim) * d;
  } else {
    const r = simulate({ ...course, cup: { x: 1e6, z: 1e6 } }, { x: ball.pos[0], z: ball.pos[2] }, shotFor(c, p, aim), 15, 1000);
    const at = r.carry ?? r.end;
    x = at[0]; z = at[2];
  }
  look.marker.transform.setLocalPosition(x, hole.ground.height(x, z), z);
  const s = c.id === 'putter' ? 0.15 : Math.max(0.6, Math.hypot(x - ball.pos[0], z - ball.pos[2]) / 60);
  look.marker.transform.setLocalScale(s, 1, s);
}

function setState(next: State): void {
  state = next;
  stateTime = 0;
  hint.classList.toggle('hidden', next !== 'aim' || shotsMade >= HINT_SHOTS);
  result.classList.toggle('show', next === 'result');
  look.marker.show = next === 'aim';
  if (next === 'aim') readyShot();
}

function swing(s: Swing): void {
  if (state !== 'aim') return;
  const c = club(clubId);
  // Off the fairway the ball comes out slower.
  const s0 = lie();
  const penalty = c.id === 'putter' ? 1 : s0 === 'rough' ? 0.75 : s0 === 'sand' ? 0.5 : 1;
  const shot = shotFor(c, s.power, aim, s.curve);
  shot.speed *= penalty;
  shotFrom = { x: ball.pos[0], z: ball.pos[2] };
  hit(ball, shot);
  strokes++;
  shotsMade++;
  trail = [[...ball.pos]];
  trailFade = 1;
  accumulator = 0;
  showHud();
  setState('flight');
}

function showResult(text: string, sub: string, big = false): void {
  result.innerHTML = `${text}${sub ? `<small>${sub}</small>` : ''}`;
  result.classList.toggle('big', big);
  setState('result');
}

/** The ball stopped: say where, and what comes next. */
function shotOver(): void {
  const travelled = Math.round(Math.hypot(ball.pos[0] - shotFrom.x, ball.pos[2] - shotFrom.z));
  if (ball.phase === 'holed') {
    afterResult = 'restart';
    const name = scoreName(strokes, hole.spec.par);
    showResult(name, `${strokes} pancada${strokes === 1 ? '' : 's'} · toca para jogar de novo`, strokes < hole.spec.par || strokes === 1);
    return;
  }
  afterResult = 'next-shot';
  if (ball.phase === 'water' || ball.phase === 'out') {
    // Stroke and distance: one more stroke, played again from where it was.
    strokes++;
    showResult(ball.phase === 'water' ? 'Água!' : 'Fora!', '+1 pancada · joga de novo do mesmo sítio');
    ball = restingBall(hole.ground, shotFrom.x, shotFrom.z);
    return;
  }
  showResult(SURFACE_NAME[lie()].replace(/^./, (c) => c.toUpperCase()), `${travelled} m · faltam ${pinDistance() < 10 ? pinDistance().toFixed(1) : Math.round(pinDistance())} m`);
}

function advance(): void {
  if (state !== 'result' || stateTime < 0.4) return;
  if (afterResult === 'restart') startHole();
  else setState('aim');
}

function startHole(): void {
  strokes = 0;
  ball = restingBall(hole.ground, hole.spec.tee.x, hole.spec.tee.z);
  trail = [];
  const p = hole.spec.pin;
  look.placeFlag(p.x, hole.ground.height(p.x, p.z), p.z);
  setState('aim');
  snapCamera();
}

function changeClub(step: number): void {
  if (state !== 'aim') return;
  const i = CLUBS.findIndex((c) => c.id === clubId);
  clubId = CLUBS[(i + step + CLUBS.length) % CLUBS.length].id;
  showHud();
  placeMarker();
}

function turnAim(da: number): void {
  if (state !== 'aim') return;
  aim += da;
  placeMarker(power ?? 1);
}

/** Camera: behind the ball looking down the aim; chasing it in flight. */
function cameraGoal(outEye: vec3, outLook: vec3): void {
  const b = ball.pos;
  const putting = clubId === 'putter';
  if (state === 'aim') {
    const fx = Math.sin(aim), fz = -Math.cos(aim);
    const back = putting ? 2.4 : 4.6, up = putting ? 1.2 : 2.3;
    vec3.set(outEye, b[0] - fx * back, b[1] + up, b[2] - fz * back);
    const ahead = putting ? Math.min(pinDistance(), 5) : 9;
    vec3.set(outLook, b[0] + fx * ahead, hole.ground.height(b[0] + fx * ahead, b[2] + fz * ahead), b[2] + fz * ahead);
    return;
  }
  // Chase: behind the ball along its ground track, above it.
  const v = ball.vel, h = Math.hypot(v[0], v[2]);
  const dx = h > 0.5 ? v[0] / h : Math.sin(aim), dz = h > 0.5 ? v[2] / h : -Math.cos(aim);
  const flying = ball.phase === 'flying';
  const back = flying ? 9 : putting ? 3 : 6, up = flying ? 3 : putting ? 1.2 : 2;
  const gx = b[0] - dx * back, gz = b[2] - dz * back;
  vec3.set(outEye, gx, Math.max(b[1] + up, hole.ground.height(gx, gz) + 1), gz);
  vec3.set(outLook, b[0] + dx * 2, b[1], b[2] + dz * 2);
}

const goalEye = vec3.create(), goalLook = vec3.create();
function snapCamera(): void {
  cameraGoal(goalEye, goalLook);
  vec3.copy(eye, goalEye);
  vec3.copy(target, goalLook);
}

function updateCamera(dt: number): void {
  cameraGoal(goalEye, goalLook);
  const k = 1 - Math.exp(-dt * (state === 'flight' ? 3 : 4));
  vec3.lerp(eye, eye, goalEye, k);
  vec3.lerp(target, target, goalLook, 1 - Math.exp(-dt * (state === 'flight' ? 10 : 5)));
  camera.transform.setLocalPosition(eye[0], eye[1], eye[2]);
  camera.transform.lookAt(target);
}

function update(dt: number): void {
  stateTime += dt;
  if (state === 'flight') {
    // A little faster than real time in the air: long shots take a while.
    accumulator += dt * (ball.phase === 'flying' ? 1.4 : 1.2);
    let steps = 0;
    while (accumulator >= BALL.step && steps < 60) {
      stepBall(ball, course);
      accumulator -= BALL.step;
      steps++;
      if (steps % 4 === 0 && ball.phase === 'flying') trail.push([...ball.pos]);
    }
    if (ball.phase !== 'flying' && ball.phase !== 'rolling') shotOver();
    else showHud();
  } else if (state === 'result') {
    trailFade = Math.max(0, trailFade - dt * 0.5);
  }
  if (keySwing && state === 'aim') {
    power = Math.min(1, (performance.now() - keySwing.start) / 1100);
    showPower(power);
  }
  // The ball, drawn a little bigger, rests on the ground.
  look.ball.transform.setLocalPosition(ball.pos[0], ball.pos[1] + BALL.radius * (BALL_LOOK - 1), ball.pos[2]);
  look.ball.show = ball.phase !== 'holed';
  updateCamera(dt);
}

function showPower(p: number | null): void {
  power = p;
  powerBox.classList.toggle('show', p !== null && state === 'aim');
  powerLabel.classList.toggle('show', p !== null && state === 'aim');
  if (p === null) return;
  powerFill.style.height = `${Math.round(p * 100)}%`;
  powerLabel.textContent = `${Math.round(p * 100)}%`;
  placeMarker(Math.max(0.05, p));
}

/** Projects a world point to canvas pixels, or null behind the camera. */
const viewProj = mat4.create(), clip = vec4.create();
function project(p: number[]): [number, number] | null {
  vec4.set(clip, p[0], p[1], p[2], 1);
  vec4.transformMat4(clip, clip, viewProj);
  if (clip[3] <= 0.05) return null;
  return [(clip[0] / clip[3] * 0.5 + 0.5) * trailCanvas.width, (-clip[1] / clip[3] * 0.5 + 0.5) * trailCanvas.height];
}

function drawTrail(): void {
  trail2d.clearRect(0, 0, trailCanvas.width, trailCanvas.height);
  if (trail.length < 2 || trailFade <= 0) return;
  mat4.multiply(viewProj, camera.projectionMatrix, camera.viewMatrix);
  const pts = [...trail, ball.phase === 'flying' ? ball.pos : trail[trail.length - 1]];
  trail2d.lineCap = 'round';
  trail2d.lineJoin = 'round';
  trail2d.strokeStyle = `rgba(255, 255, 255, ${0.75 * trailFade})`;
  trail2d.shadowColor = `rgba(45, 226, 255, ${trailFade})`;
  trail2d.shadowBlur = 8;
  trail2d.lineWidth = 3 * Math.min(window.devicePixelRatio || 1, 2);
  trail2d.beginPath();
  let open = false;
  for (const p of pts) {
    const s = project(p);
    if (!s) { open = false; continue; }
    if (open) trail2d.lineTo(s[0], s[1]); else trail2d.moveTo(s[0], s[1]);
    open = true;
  }
  trail2d.stroke();
}

let scene: Scene, engine: Engine;
let last = 0, fpsTime = 0, fpsFrames = 0;
function frame(now: number): void {
  const dt = last ? Math.min((now - last) / 1000, 0.1) : 0;
  last = now;
  resize();
  update(dt);
  engine.update(dt);
  engine.render();
  drawTrail();
  fpsFrames++; fpsTime += dt;
  if (fpsTime >= 0.5) {
    if (debug) $('stats').textContent = `${Math.round(fpsFrames / fpsTime)} fps`;
    fpsFrames = 0; fpsTime = 0;
  }
  requestAnimationFrame(frame);
}

function loaded(fraction: number, text: string): Promise<void> {
  $('load-bar').style.width = `${Math.round(fraction * 100)}%`;
  $('load-text').textContent = text;
  return new Promise((r) => requestAnimationFrame(() => r()));
}

/** Each club's full shot on a flat fairway. */
function measureClubs(): void {
  const flat = new HeightField(-150, -400, 4, 76, 106, 4).paint(() => 'fairway');
  for (const c of CLUBS) {
    reach[c.id] = c.id === 'putter' ? MAX_PUTT : -simulate({ ground: flat, cup: { x: 1e6, z: 1e6 } }, { x: 0, z: 0 }, shotFor(c, 1, 0)).end[2];
  }
}

async function start(): Promise<void> {
  await loaded(0.1, 'A medir os tacos…');
  measureClubs();
  await loaded(0.3, 'A desenhar o campo…');
  hole = buildHole(TEST_HOLE);
  course = { ground: hole.ground, cup: hole.spec.pin };
  scene = new Scene();
  scene.name = 'Golf';
  look = await dressCourse(gl, scene, hole);
  await loaded(0.8, 'A acender o sol…');
  scene.sceneFog.enabled = true;
  scene.sceneFog.fogType = 1;
  scene.sceneFog.density = 0.0011;
  scene.sceneFog.color = new Color(0.55, 0.72, 0.92, 1);
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

  bindSwing(canvas, {
    onAim: (f) => turnAim(f * 0.6),
    onPower: (p) => { if (state === 'aim') showPower(p); },
    onSwing: swing,
    onTap: () => advance(),
  });
  Pointer.onDown(() => { if (state === 'result') advance(); });
  $('club-prev').addEventListener('click', () => changeClub(-1));
  $('club-next').addEventListener('click', () => changeClub(1));
  window.addEventListener('keydown', (e) => {
    if (e.repeat) return;
    if (state === 'result' && (e.key === ' ' || e.key === 'Enter')) { advance(); return; }
    if (state !== 'aim') return;
    if (e.key === 'ArrowLeft') turnAim(-0.01);
    else if (e.key === 'ArrowRight') turnAim(0.01);
    else if (e.key === 'ArrowUp') changeClub(-1);
    else if (e.key === 'ArrowDown') changeClub(1);
    else if (e.key === ' ' || e.key === 'Enter') keySwing = { start: performance.now(), curve: 0 };
    else if (keySwing && (e.key === 'q' || e.key === 'Q')) keySwing.curve = -0.7;
    else if (keySwing && (e.key === 'e' || e.key === 'E')) keySwing.curve = 0.7;
  });
  window.addEventListener('keyup', (e) => {
    if ((e.key === ' ' || e.key === 'Enter') && keySwing && state === 'aim') {
      const p = power ?? 0;
      const curve = keySwing.curve;
      keySwing = null;
      showPower(null);
      swing({ power: p, curve });
    }
  });
  (window as any).golf = {
    get state() { return state; }, get ball() { return ball; }, get strokes() { return strokes; }, get aim() { return aim; },
    get club() { return clubId; }, reach, hole, swing, advance, turnAim, changeClub,
    setClub(id: ClubId) { clubId = id; showHud(); placeMarker(); },
  };
  $('stats').hidden = !debug;
  startHole();
  await loaded(1, 'Pronto');
  $('loading').classList.add('done');
  requestAnimationFrame(frame);
}

start().catch((err) => {
  $('load-text').textContent = `Erro: ${err?.message ?? err}`;
  console.error(err);
});
