// Omega Drift: a small car on a track, sliding through the bends. Phase 1: the
// car's own physics, a test track with walls, the chase camera, keyboard,
// gamepad and touch, the speedometer.
import {
  Camera, CanvasViewport, DefaultResourceLoader, DependencyManager, Engine, RenderPipelineSettings, Resources, Scene,
  ToneMapping,
} from '../../../src';
import { vec3 } from 'gl-matrix';
import { Car, CarInput, driftAngle, forwardSpeed, makeCar, NO_INPUT, speedOf, STEP, stepCar } from './car';
import { CHASE, ChaseState, followCar, makeChase } from './camera';
import { drive, Driver, makeDriver } from './driver';
import { Controls } from './input';
import { CarLook, dressCar, dressTrack, dressWorld, TrackLook } from './look';
import { keepOnTrack, makeTrack, Place, Track } from './track';
import { TRACKS } from './tracks';

const $ = (id: string) => document.getElementById(id)!;
const canvas = $('view') as HTMLCanvasElement;
const params = new URLSearchParams(location.search);
const debug = params.has('debug');

type State = 'loading' | 'play' | 'pause';
let state: State = 'loading';

const gl = canvas.getContext('webgl2', { antialias: true })!;
if (!gl) { $('load-text').textContent = 'Este browser não tem WebGL 2.'; throw new Error('No WebGL 2'); }
new DependencyManager().registerDependencies();
Resources.setLoader(new DefaultResourceLoader(async (uri) => uri));
Resources.for(gl);
gl.clearColor(0.55, 0.75, 0.95, 1);

const camera = new Camera();
camera.name = 'Chase camera';
camera.fieldOfView = CHASE.fov;
camera.nearPlane = 0.2;
camera.farPlane = 450;
camera.initialize();
Camera.setMainCamera(camera);

/** The share of the screen's pixel density drawn at; it steps down when the frame rate stays low. */
let renderScale = 1;
function resize(): void {
  const dpr = Math.max(1, Math.min(window.devicePixelRatio || 1, 2) * renderScale);
  const w = Math.max(1, Math.round(canvas.clientWidth * dpr)), h = Math.max(1, Math.round(canvas.clientHeight * dpr));
  if (canvas.width === w && canvas.height === h) return;
  canvas.width = w; canvas.height = h;
  gl.viewport(0, 0, w, h);
  CanvasViewport.rendererWidth = w;
  CanvasViewport.rendererHeight = h;
  camera.aspectRatio = w / h;
  camera.updateProjectionMatrix();
}
window.addEventListener('resize', resize);
resize();

const controls = new Controls();
let track: Track;
let car: Car;
let place: Place & { hit: number };
let chase: ChaseState;
let trackLook: TrackLook;
let carLook: CarLook;
let autoplay: Driver | null = params.has('auto') ? makeDriver() : null;
let scene: Scene, engine: Engine;
let quality = 1;
/** Steps not yet run (s), the time on track (s), and the last wall hit (m/s), for the HUD. */
let pending = 0;
let clock = 0;
let bump = 0;

/** Puts the car back on the track: on the centre line at its place, facing the way round, stopped. */
function reset(atStart = false): void {
  const p = track.samples[atStart || !place ? 0 : place.index];
  car = makeCar(p.x, p.y, Math.atan2(p.ty, p.tx), car?.spec);
  place = keepOnTrack(track, car);
  chase = makeChase(car);
  controls.clear();
}

function step(input: CarInput): void {
  stepCar(car, input);
  place = keepOnTrack(track, car, place.index);
  if (place.hit > 4) bump = Math.max(bump, place.hit);
}

function update(dt: number): void {
  if (state !== 'play') return;
  pending += dt;
  while (pending >= STEP) {
    pending -= STEP;
    step(autoplay ? drive(autoplay, car, track, place) : controls.read());
    clock += STEP;
  }
  followCar(chase, car, dt);
  bump = Math.max(0, bump - dt * 30);
}

function hud(): void {
  const kmh = Math.round(speedOf(car) * 3.6);
  $('speed').textContent = String(kmh);
  $('gear').textContent = car.reversing ? 'R' : forwardSpeed(car) < 0.5 && kmh < 2 ? 'N' : 'D';
  const angle = Math.abs(driftAngle(car)) * 180 / Math.PI;
  const drifting = angle > 12 && speedOf(car) > 10;
  const meter = $('drift');
  meter.hidden = !drifting;
  if (drifting) $('drift-angle').textContent = `${Math.round(angle)}°`;
  $('needle').style.transform = `rotate(${-120 + 240 * Math.min(1, speedOf(car) / car.spec.top)}deg)`;
}

function draw(dt: number): void {
  carLook.update(car, dt);
  trackLook.update(car.x, car.y);
  const eyeH = CHASE.up;
  camera.fieldOfView = chase.fov;
  camera.updateProjectionMatrix();
  const lookX = car.x + Math.cos(chase.dir) * CHASE.ahead, lookY = car.y + Math.sin(chase.dir) * CHASE.ahead;
  const shake = bump > 0 ? (Math.random() - 0.5) * bump * 0.01 : 0;
  camera.transform.setLocalPosition(chase.x, eyeH + shake, -chase.y);
  camera.transform.lookAt(vec3.fromValues(lookX, 0.8, -lookY));
  hud();
}

let last = 0, fpsTime = 0, fpsFrames = 0, slow = 0;
function frame(now: number): void {
  const dt = last ? Math.min((now - last) / 1000, 0.1) : 0;
  last = now;
  resize();
  if (controls.pollStart()) state === 'play' ? pause() : state === 'pause' ? resume() : null;
  update(dt);
  if (car) draw(dt);
  engine.update(state === 'pause' ? 0 : dt);
  engine.render();
  fpsFrames++; fpsTime += dt;
  if (fpsTime >= 0.5) {
    const fps = fpsFrames / fpsTime;
    if (debug) $('stats').textContent = `${Math.round(fps)} fps · ${renderScale.toFixed(2)}× · ${(Math.abs(driftAngle(car)) * 57.3).toFixed(0)}° · ${car.rearLoad.toFixed(2)}`;
    slow = state === 'play' && fps < 45 ? slow + 1 : 0;
    if (slow >= 4 && renderScale > 0.55) { renderScale = Math.max(0.5, renderScale - 0.15); slow = 0; resize(); }
    fpsFrames = 0; fpsTime = 0;
  }
  requestAnimationFrame(frame);
}

function loaded(fraction: number, text: string): Promise<void> {
  $('load-bar').style.width = `${Math.round(fraction * 100)}%`;
  $('load-text').textContent = text;
  return new Promise((r) => requestAnimationFrame(() => r()));
}

function pause(): void {
  if (state !== 'play') return;
  state = 'pause';
  $('pause').hidden = false;
  controls.clear();
}

function resume(): void {
  if (state !== 'pause') return;
  state = 'play';
  $('pause').hidden = true;
  last = 0;
}

async function loadTrack(index: number): Promise<void> {
  state = 'loading';
  const spec = TRACKS[index];
  $('load-title').textContent = spec.name;
  await loaded(0.2, 'A traçar a pista…');
  track = makeTrack(spec);
  scene?.destroy();
  scene = new Scene();
  scene.name = spec.name;
  trackLook = await dressTrack(gl, scene, track);
  await loaded(0.5, 'A plantar as árvores…');
  await dressWorld(gl, scene, track);
  await loaded(0.75, 'A trazer o carro…');
  carLook = await dressCar(gl, scene, [0.95, 0.25, 0.45]);
  scene.setGlRenderingContext(gl);
  engine.loadScene(scene);
  const settings = scene.renderPipeline.settings;
  settings.toneMapping = ToneMapping.ACES;
  settings.applyQuality(quality);
  scene.isRunning = true;
  reset(true);
  clock = 0;
  $('track-name').textContent = spec.name;
  await loaded(1, 'Pronto');
  $('loading').classList.add('done');
  state = 'play';
}

async function start(): Promise<void> {
  await loaded(0.1, 'A preparar…');
  scene = new Scene();
  scene.setGlRenderingContext(gl);
  engine = new Engine();
  engine.initialize(canvas);
  engine.loadScene(scene);
  const q = params.get('quality');
  const named: Record<string, number> = { low: 0, medium: 1, high: 2 };
  quality = q && q in named ? named[q] : RenderPipelineSettings.suggestedQuality(gl);

  const touchOn = params.has('touch') || matchMedia('(pointer: coarse)').matches;
  $('touch').hidden = !touchOn;
  if (touchOn) $('keys').textContent = 'Arrasta à esquerda para virar (para baixo trava) · acelerador e travão de mão à direita';
  controls.bindTouch($('wheel-area'), $('knob'), $('btn-gas'), $('btn-hand'));
  $('stats').hidden = !debug;
  $('pause-button').addEventListener('click', () => pause());
  $('reset-button').addEventListener('click', () => reset());
  $('pause').addEventListener('click', (e) => {
    const b = (e.target as HTMLElement).closest('button');
    if (b?.dataset.act === 'resume') resume();
    else if (b?.dataset.act === 'restart') { reset(true); clock = 0; resume(); }
  });
  window.addEventListener('keydown', (e) => {
    if (state === 'play' && (e.code === 'Escape' || e.code === 'KeyP')) pause();
    else if (state === 'pause' && (e.code === 'Escape' || e.code === 'KeyP' || e.code === 'Enter')) resume();
    else if (state === 'play' && e.code === 'KeyR') reset();
  });
  document.addEventListener('visibilitychange', () => { if (document.hidden) pause(); });

  (window as any).drift = {
    get state() { return state; }, get car() { return car; }, get track() { return track; }, get place() { return place; },
    get clock() { return clock; }, controls, reset, pause, resume, get renderScale() { return renderScale; },
    get autoplay() { return !!autoplay; }, set autoplay(on: boolean) { autoplay = on ? makeDriver() : null; if (!on) controls.override = null; },
    hold(input: Partial<CarInput> | null) { controls.override = input ? { ...NO_INPUT, ...input } : null; },
  };
  requestAnimationFrame(frame);
  await loadTrack(0);
}

start().catch((err) => {
  $('load-text').textContent = `Erro: ${err?.message ?? err}`;
  console.error(err);
});
