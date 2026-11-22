// Omega Bowling: a ten-frame game on a physics lane, thrown with a swipe.
import RAPIER from '@dimforge/rapier3d-compat';
import { vec3 } from 'gl-matrix';
import {
  Camera, CanvasViewport, DefaultResourceLoader, DependencyManager, Engine, PhysicsWorld, RapierBackend,
  RenderPipelineSettings, Resources, Scene, ToneMapping,
} from '../../../src';
import { bindSwipe } from './controls';
import { BowlingGame } from './scoring';
import {
  allStill, BALL, buildLane, isPinDown, LANE, LaneEntities, rackPins, removePin, resetBall, standingPins,
  ThrowParams, throwBall,
} from './lane';
import { dressLane, makeSweepBar } from './look';

const canvas = document.getElementById('view') as HTMLCanvasElement;
const hint = document.getElementById('hint')!;
const result = document.getElementById('result')!;
const pinDiagram = document.getElementById('pins')!;
const stats = document.getElementById('stats')!;
const frameInfo = document.getElementById('frame-info')!;
const scoreboard = document.getElementById('score')!;

type State = 'loading' | 'aim' | 'rolling' | 'settling' | 'result' | 'sweep' | 'over';
let state: State = 'loading';
let game = new BowlingGame();
/** Pins standing when the current roll started. */
let standingBefore: number[] = [];
let wentInGutter = false;
/** The sweep in progress: whether it ends with a fresh rack, and the standing pins it lifts. */
let sweep = { fresh: true, lifted: [] as { index: number; x: number; z: number }[], cleared: false, racked: false };
let sweepBar: import('../../../src').SceneEntity;
const BAR_REST = vec3.fromValues(0, 1.3, -17.75); // above the pin camera's view
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
  if (next === 'aim') {
    const n = game.next!;
    frameInfo.textContent = `Frame ${n.frame + 1} · ${n.roll + 1}.º lançamento`;
  }
}

function bowl(t: ThrowParams): void {
  if (state !== 'aim') return;
  standingBefore = standingPins(lane);
  wentInGutter = false;
  throwBall(lane, t);
  setState('rolling');
}

function moveBall(dx: number): void {
  if (state !== 'aim') return;
  const limit = LANE.halfWidth - BALL.radius;
  ballX = Math.max(-limit, Math.min(limit, ballX + dx));
  resetBall(lane, ballX);
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

function update(dt: number): void {
  stateTime += dt;
  const ball = lane.ball.transform.worldPosition;
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
      result.textContent = before.freshRack && pins === 10 ? 'Strike!'
        : !before.freshRack && pins === before.pinsLeft ? 'Spare!'
          : pins === 0 ? (wentInGutter ? 'Calha' : 'Nenhum pino')
            : `${pins} ${pins === 1 ? 'pino' : 'pinos'}`;
      setState('result');
    }
  } else if (state === 'result') {
    if (stateTime > 1.8) advance();
  } else if (state === 'sweep') {
    updateSweep();
  }
  if (state === 'rolling' || state === 'settling') showPins();

  // Camera: behind the ball when aiming, following it down the lane, then on the pins.
  const target = vec3.create(), aimAt = vec3.create();
  if (state === 'aim' || state === 'loading') {
    vec3.set(target, ballX * 0.6, 1.3, 2.4);
    vec3.set(aimAt, ballX * 0.3, 0, -12);
  } else if (state === 'rolling') {
    vec3.set(target, ball[0] * 0.5, 0.9, Math.max(ball[2] + 2.8, -14.8));
    vec3.set(aimAt, ball[0] * 0.3, 0.1, Math.max(ball[2] - 5, -18.8));
  } else {
    vec3.set(target, 0, 1.0, -15.6);
    vec3.set(aimAt, 0, 0.1, -18.7);
  }
  const k = 1 - Math.exp(-dt * (state === 'rolling' ? 8 : state === 'aim' ? 6 : 3));
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

  bindSwipe(canvas, { onMove: (f) => moveBall(f * 1.5), onThrow: bowl, onTap: advance });
  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') moveBall(-0.03);
    else if (e.key === 'ArrowRight') moveBall(0.03);
    else if (e.key === ' ' || e.key === 'Enter') {
      if (state === 'aim') bowl({ speed: 8, angle: 0, spin: 0 });
      else advance();
    }
  });
  (window as any).bowling = { lane, world, scene, bowl, advance, get game() { return game; }, get state() { return state; } };
  document.getElementById('loading')!.classList.add('done');
  setState('aim');
  requestAnimationFrame(frame);
}

start().catch((err) => {
  hint.textContent = `Erro: ${err?.message ?? err}`;
  console.error(err);
});
