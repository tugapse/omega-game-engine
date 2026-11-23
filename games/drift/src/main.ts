// Omega Drift: a small car on a track, sliding through the bends. The car's
// own physics, tracks with walls, the chase camera, keyboard, gamepad and
// touch, the speedometer; a time trial of three laps after the start lights,
// against the ghost of the best lap.
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
import {
  bestLap, currentLap, formatDelta, formatTime, Ghost, ghostAt, held, lights, makeRace, Race, raceTime, readGhost, Recorder,
  updateRace,
} from './race';
import { keepOnTrack, makeTrack, Place, Track } from './track';
import { TRACKS } from './tracks';

const $ = (id: string) => document.getElementById(id)!;
const canvas = $('view') as HTMLCanvasElement;
const params = new URLSearchParams(location.search);
const debug = params.has('debug');

type State = 'loading' | 'play' | 'pause' | 'results';
/** Laps in a time trial. */
const LAPS = 3;
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
let ghostLook: CarLook;
let race: Race;
/** The best lap on this track (kept in the browser), and the lap being recorded. */
let ghost: Ghost | null = null;
const recorder = new Recorder();
/** A message in the middle of the screen for a moment (a lap time, the record). */
let flashTime = 0;
let autoplay: Driver | null = params.has('auto') ? makeDriver() : null;
let scene: Scene, engine: Engine;
let quality = 1;
/** Steps not yet run (s), the time on track (s), and the last wall hit (m/s), for the HUD. */
let pending = 0;
/** Settings kept in the browser: the drift assist (on by default). */
const settings = { assist: true };
try { Object.assign(settings, JSON.parse(localStorage.getItem('omega-drift-settings') ?? '{}')); } catch { /* none kept */ }
function saveSettings(): void {
  try { localStorage.setItem('omega-drift-settings', JSON.stringify(settings)); } catch { /* private mode */ }
  const b = document.querySelector('[data-act="assist"]');
  if (b) b.textContent = `Ajuda ao drift: ${settings.assist ? 'ligada' : 'desligada'}`;
  if (car) car.assist = settings.assist;
}
let clock = 0;
let bump = 0;

const ghostKey = () => `omega-drift-ghost-${track.id}`;
function loadGhost(): void {
  try { ghost = readGhost(localStorage.getItem(ghostKey())); } catch { ghost = null; }
}
function saveGhost(g: Ghost): void {
  ghost = g;
  try { localStorage.setItem(ghostKey(), JSON.stringify(g)); } catch { /* private mode */ }
}

function flash(html: string, seconds = 2.2): void {
  const el = $('flash');
  el.innerHTML = html;
  el.hidden = false;
  flashTime = seconds;
}

/** A new time trial: the car on the grid a little behind the line, the lights about to come on. */
function newRace(): void {
  reset(true);
  race = makeRace(track.length, LAPS, place.along);
  loadGhost();
  clock = 0;
  autoplay = params.has('auto') ? makeDriver() : null;
  $('results').hidden = true;
  $('pause').hidden = true;
  $('flash').hidden = true;
  state = 'play';
  last = 0;
}

/** Puts the car back on the track: on the centre line at its place, facing the way round, stopped. */
function reset(atStart = false): void {
  const n = track.samples.length;
  const p = track.samples[atStart || !place ? n - 6 : place.index];
  car = makeCar(p.x, p.y, Math.atan2(p.ty, p.tx), car?.spec);
  car.assist = settings.assist;
  place = keepOnTrack(track, car);
  chase = makeChase(car);
  controls.clear();
}


function step(input: CarInput): void {
  stepCar(car, held(race) ? NO_INPUT : input);
  place = keepOnTrack(track, car, place.index);
  if (place.hit > 4) bump = Math.max(bump, place.hit);
  const before = race.phase;
  const event = updateRace(race, place.along, STEP, ghost?.time ?? Infinity);
  const t = raceTime(race);
  if (event === 'go') { recorder.begin(0); flash('<b>Vai!</b>', 1); }
  if (before === 'racing') recorder.add(t, car.x, car.y, car.heading);
  if (event === 'lap' || event === 'best' || event === 'finish') lapDone();
}

/** A lap finished: its time, against the record, and a new ghost if it is the best. */
function lapDone(): void {
  const lap = race.times[race.times.length - 1];
  const record = ghost?.time ?? Infinity;
  const delta = isFinite(record) ? ` <small>${formatDelta(lap - record)}</small>` : '';
  if (lap < record) {
    saveGhost(recorder.finish(lap));
    flash(`${isFinite(record) ? 'Recorde!' : 'Volta'} <b>${formatTime(lap)}</b>${delta}`);
  } else flash(`Volta <b>${formatTime(lap)}</b>${delta}`);
  recorder.begin(raceTime(race));
  if (race.phase === 'done') finish();
}

function finish(): void {
  state = 'results';
  $('flash').hidden = true;
  autoplay = makeDriver(0.6);
  $('results').hidden = false;
  $('res-total').textContent = formatTime(race.total);
  $('res-laps').innerHTML = race.times.map((t, i) => `<li${t === bestLap(race) ? ' class="best"' : ''}>Volta ${i + 1}<span>${formatTime(t)}</span></li>`).join('');
  $('res-record').textContent = ghost ? `Recorde da pista: ${formatTime(ghost.time)}` : '';
}

function update(dt: number): void {
  if (state !== 'play' && state !== 'results') return;
  pending += dt;
  while (pending >= STEP) {
    pending -= STEP;
    step(autoplay ? drive(autoplay, car, track, place) : controls.read());
    clock += STEP;
  }
  followCar(chase, car, dt);
  bump = Math.max(0, bump - dt * 30);
  if (flashTime > 0) { flashTime -= dt; if (flashTime <= 0) $('flash').hidden = true; }
}

function hud(): void {
  const kmh = Math.round(speedOf(car) * 3.6);
  $('speed').textContent = String(kmh);
  $('gear').textContent = car.reversing ? 'R' : forwardSpeed(car) < 0.5 && kmh < 2 ? 'N' : 'D';
  const angle = Math.abs(driftAngle(car)) * 180 / Math.PI;
  const drifting = !!car.drift || (angle > 12 && speedOf(car) > 10);
  const meter = $('drift');
  meter.hidden = !drifting;
  if (drifting) $('drift-angle').textContent = `${Math.round(angle)}°`;
  $('needle').style.transform = `rotate(${-120 + 240 * Math.min(1, speedOf(car) / car.spec.top)}deg)`;
  $('lap').textContent = `${currentLap(race)}/${race.laps}`;
  $('time').textContent = formatTime(raceTime(race) - race.lapStart);
  const best = Math.min(bestLap(race), ghost?.time ?? Infinity);
  $('best').textContent = formatTime(best);
  const l = lights(race);
  const box = $('lights');
  box.hidden = !(race.phase === 'lights' || l.green);
  box.querySelectorAll('i').forEach((el, i) => { el.className = l.green ? 'green' : i < l.red ? 'red' : ''; });
}

/** The ghost of the best lap, where it was this far into its lap. */
function drawGhost(): void {
  const at = ghost && race.phase === 'racing' && state === 'play' ? ghostAt(ghost, raceTime(race) - race.lapStart) : null;
  ghostLook.show(!!at);
  if (!at) return;
  ghostLook.update({ ...car, x: at.x, y: at.y, heading: at.heading, vx: 0, vy: 0, spin: 0, wheel: 0 }, 0);
}

function draw(dt: number): void {
  carLook.update(car, dt);
  drawGhost();
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
  ghostLook = await dressCar(gl, scene, [0.6, 0.9, 1], { alpha: 0.35, name: 'Ghost' });
  ghostLook.show(false);
  scene.setGlRenderingContext(gl);
  engine.loadScene(scene);
  const settings = scene.renderPipeline.settings;
  settings.toneMapping = ToneMapping.ACES;
  settings.applyQuality(quality);
  scene.isRunning = true;
  $('track-name').textContent = spec.name;
  loadGhost();
  await loaded(1, 'Pronto');
  $('loading').classList.add('done');
  newRace();
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
  if (touchOn) {
    controls.autoGas = true;
    $('keys').textContent = 'O carro acelera sozinho · arrasta à esquerda para virar · para derrapar, segura DRIFT e vira (ou vira a fundo numa curva); larga DRIFT e vira para o outro lado para sair · TRAVÃO trava e faz marcha-atrás';
    // A hint for the first seconds.
    $('hint').hidden = false;
    setTimeout(() => $('hint').classList.add('gone'), 7000);
  }
  controls.bindTouch($('wheel-area'), $('knob'), $('btn-brake'), $('btn-hand'));
  $('stats').hidden = !debug;
  saveSettings();
  $('pause-button').addEventListener('click', () => pause());
  $('reset-button').addEventListener('click', () => reset());
  $('results').addEventListener('click', (e) => {
    if ((e.target as HTMLElement).closest('button')?.dataset.act === 'again') newRace();
  });
  $('pause').addEventListener('click', (e) => {
    const b = (e.target as HTMLElement).closest('button');
    if (b?.dataset.act === 'resume') resume();
    else if (b?.dataset.act === 'restart') newRace();
    else if (b?.dataset.act === 'assist') { settings.assist = !settings.assist; saveSettings(); }
  });
  window.addEventListener('keydown', (e) => {
    if (state === 'play' && (e.code === 'Escape' || e.code === 'KeyP')) pause();
    else if (state === 'pause' && (e.code === 'Escape' || e.code === 'KeyP' || e.code === 'Enter')) resume();
    else if (state === 'play' && e.code === 'KeyR') reset();
    else if (state === 'results' && e.code === 'Enter') newRace();
  });
  document.addEventListener('visibilitychange', () => { if (document.hidden) pause(); });

  (window as any).drift = {
    get state() { return state; }, get car() { return car; }, get track() { return track; }, get place() { return place; },
    get clock() { return clock; }, get race() { return race; }, get looks() { return { carLook, ghostLook }; }, get ghost() { return ghost; }, controls, reset, newRace, pause, resume, get renderScale() { return renderScale; },
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
