// Omega Bowling, phase 0: lane, ball, ten pins, throw with a swipe.
import RAPIER from '@dimforge/rapier3d-compat';
import { vec3 } from 'gl-matrix';
import {
  Camera, CanvasViewport, DefaultResourceLoader, DependencyManager, Engine, PhysicsWorld, RapierBackend,
  RenderPipelineSettings, Resources, Scene, ToneMapping,
} from '../../../src';
import { bindSwipe } from './controls';
import {
  allStill, BALL, buildLane, isPinDown, LANE, LaneEntities, rackPins, resetBall, ThrowParams, throwBall,
} from './lane';
import { dressLane } from './look';

const canvas = document.getElementById('view') as HTMLCanvasElement;
const hint = document.getElementById('hint')!;
const result = document.getElementById('result')!;
const pinDiagram = document.getElementById('pins')!;
const stats = document.getElementById('stats')!;

type State = 'loading' | 'aim' | 'rolling' | 'settling' | 'result';
let state: State = 'loading';
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
  result.classList.toggle('show', next === 'result');
}

function bowl(t: ThrowParams): void {
  if (state !== 'aim') return;
  throwBall(lane, t);
  setState('rolling');
}

function moveBall(dx: number): void {
  if (state !== 'aim') return;
  const limit = LANE.halfWidth - BALL.radius;
  ballX = Math.max(-limit, Math.min(limit, ballX + dx));
  resetBall(lane, ballX);
}

function nextThrow(): void {
  if (state !== 'result') return;
  rackPins(lane);
  resetBall(lane, ballX);
  setState('aim');
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

function update(dt: number): void {
  stateTime += dt;
  const ball = lane.ball.transform.worldPosition;
  if (state === 'rolling') {
    const speed = vec3.length(lane.ballBody.getLinearVelocity());
    if (ball[2] < LANE.deckEnd - 0.2 || ball[1] < -0.2 || stateTime > 10 || (stateTime > 1 && speed < 0.05)) setState('settling');
  } else if (state === 'settling') {
    if ((stateTime > 1.5 && allStill(lane)) || stateTime > 5) {
      const down = showPins();
      result.textContent = down === 10 ? 'Strike!' : `${down} ${down === 1 ? 'pino' : 'pinos'}`;
      setState('result');
    }
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
  const k = 1 - Math.exp(-dt * (state === 'rolling' ? 8 : 3));
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

  bindSwipe(canvas, { onMove: (f) => moveBall(f * 1.5), onThrow: bowl, onTap: nextThrow });
  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') moveBall(-0.03);
    else if (e.key === 'ArrowRight') moveBall(0.03);
    else if (e.key === ' ' || e.key === 'Enter') {
      if (state === 'aim') bowl({ speed: 8, angle: 0, spin: 0 });
      else nextThrow();
    }
  });
  (window as any).bowling = { lane, world, scene, bowl, nextThrow, get state() { return state; } };
  document.getElementById('loading')!.classList.add('done');
  setState('aim');
  requestAnimationFrame(frame);
}

start().catch((err) => {
  hint.textContent = `Erro: ${err?.message ?? err}`;
  console.error(err);
});
