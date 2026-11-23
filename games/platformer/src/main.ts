// Omega Run: Bit, a small robot, runs and jumps to the flag at the end of each
// level. Side-on 3D, the hero's own physics on a tile grid, keyboard and touch.
import {
  Camera, CanvasViewport, DefaultResourceLoader, DependencyManager, Engine, RenderPipelineSettings, Resources, Scene,
  ToneMapping,
} from '../../../src';
import { vec3 } from 'gl-matrix';
import { Bot, botInput, makeBot } from './bot';
import { CameraState, followHero, makeCamera, VIEW } from './camera';
import { Controls } from './input';
import { LEVELS } from './levels';
import { dressGoal, dressHero, dressLevel, dressWorld, HeroLook, LevelLook } from './look';
import { STEP } from './physics';
import { dressThings, ThingsLook } from './things';
import { makeWorld, nextTry, stepWorld, World } from './world';

const $ = (id: string) => document.getElementById(id)!;
const canvas = $('view') as HTMLCanvasElement;
const banner = $('banner');
const params = new URLSearchParams(location.search);
const debug = params.has('debug');

/** play; dead: the hero pops up and falls, then the next try; over: no lives left; clear: the flag. */
type State = 'loading' | 'play' | 'dead' | 'over' | 'clear';
let state: State = 'loading';
let stateTime = 0;

const gl = canvas.getContext('webgl2', { antialias: true })!;
if (!gl) { $('load-text').textContent = 'Este browser não tem WebGL 2.'; throw new Error('No WebGL 2'); }
new DependencyManager().registerDependencies();
Resources.setLoader(new DefaultResourceLoader(async (uri) => uri));
Resources.for(gl);
gl.clearColor(0.6, 0.82, 1, 1);

/** The camera: this far in front of the play plane, looking slightly down. */
const VIEW_DISTANCE = 15;
const VIEW_RISE = 1.6;
const camera = new Camera();
camera.name = 'Side camera';
camera.fieldOfView = 40;
camera.nearPlane = 0.1;
camera.farPlane = 200;
camera.initialize();
Camera.setMainCamera(camera);

/** With touch buttons on screen, the view sits lower so they never cover the hero (m). */
let touchShift = 0;
/** Half the width and height (m) the camera sees on the play plane. */
let halfWidth = 8;
const halfHeight = Math.tan((camera.fieldOfView * Math.PI) / 360) * VIEW_DISTANCE;
/** How high (m) above the look point the hero's head may go, below the HUD. */
let topRoom = Infinity;
function measureTop(): void {
  const hud = document.getElementById('top')!.getBoundingClientRect().bottom;
  const hudM = (hud / Math.max(1, canvas.clientHeight)) * 2 * halfHeight;
  topRoom = halfHeight - touchShift - hudM - 0.3;
}
function resize(): void {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const w = Math.max(1, Math.round(canvas.clientWidth * dpr)), h = Math.max(1, Math.round(canvas.clientHeight * dpr));
  if (canvas.width === w && canvas.height === h) return;
  canvas.width = w; canvas.height = h;
  gl.viewport(0, 0, w, h);
  CanvasViewport.rendererWidth = w;
  CanvasViewport.rendererHeight = h;
  camera.aspectRatio = w / h;
  camera.updateProjectionMatrix();
  halfWidth = halfHeight * camera.aspectRatio;
  measureTop();
}
window.addEventListener('resize', resize);
resize();

const controls = new Controls();
let world: World;
let cam: CameraState;
let levelLook: LevelLook;
let thingsLook: ThingsLook;
let heroLook: HeroLook;
/** The hero's fall after dying: height and speed above where it died. */
let deathFall = { y: 0, vy: 0 };
/** The hero's look: turn (degrees) and squash (1 = none). */
let yaw = 60, squash = 1;
let accumulator = 0;
/** The bot plays instead of the controls (tests, and the title screen later). */
let autoplay: Bot | null = params.has('auto') ? makeBot() : null;
/** For measuring: when the last jump was pressed and when the hero left the ground (ms). */
const timing = { pressed: 0, jumped: 0 };

function setState(s: State): void {
  state = s;
  stateTime = 0;
  banner.hidden = s === 'play' || s === 'dead';
  if (s === 'clear') banner.innerHTML = `<b>Nível completo!</b><span>${world.score} pontos</span><small>Toca ou carrega Enter para repetir</small>`;
  if (s === 'over') banner.innerHTML = `<b>Fim do jogo</b><span>${world.score} pontos</span><small>Toca ou carrega Enter para recomeçar</small>`;
}

function formatTime(t: number): string {
  const s = Math.ceil(t);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

function showHud(): void {
  $('lives').textContent = String(world.lives);
  $('coins').textContent = String(world.coinCount);
  $('score').textContent = String(world.score).padStart(6, '0');
  $('time').textContent = formatTime(world.time);
  $('time-chip').classList.toggle('hurry', world.time < 60);
}

/** Starts a try: a fresh world (or the next try after a death), the camera on the hero. */
function begin(w: World): void {
  world = w;
  cam = makeCamera(w.hero.body.x, w.hero.body.y, halfWidth);
  accumulator = 0;
  controls.clear();
  if (autoplay) autoplay = makeBot();
  setState('play');
  showHud();
}

/** From the very start: three lives, no checkpoint. */
function restart(): void {
  begin(makeWorld(LEVELS[0]));
}

function step(): void {
  const input = autoplay ? botInput(autoplay, world, STEP) : controls.read();
  if (input.jumpPressed) timing.pressed = performance.now();
  stepWorld(world, input, cam.x + halfWidth);
  const hero = world.hero, b = hero.body;
  for (const e of world.events) {
    if (e.type === 'jump') { timing.jumped = performance.now(); squash = 1.25; }
    else if (e.type === 'land') squash = 0.75;
    else if (e.type === 'stomp' || e.type === 'kick') squash = 1.2;
    else if (e.type === 'bump') thingsLook.bump(e.x, e.y, e.tile === 'bonus');
  }
  if (world.dead) {
    deathFall = { y: 0, vy: b.y < -1 ? 0 : 13 };
    setState('dead');
    return;
  }
  // The camera never goes back, so neither can the hero.
  const left = cam.x - halfWidth + b.w / 2;
  if (b.x < left) { b.x = left; if (b.vx < 0) b.vx = 0; }
  followHero(cam, b, halfWidth, world.level.width, STEP, world.level.start.y + VIEW.above, topRoom, b.h);
  if (world.cleared) setState('clear');
}

function update(dt: number): void {
  stateTime += dt;
  if (state === 'play') {
    accumulator += dt;
    let n = 0;
    while (accumulator >= STEP && n++ < 24 && state === 'play') { step(); accumulator -= STEP; }
  } else if (state === 'dead') {
    // A hop up, then down out of the picture; then the next try, or the end.
    if (stateTime > 0.35) { deathFall.vy -= 40 * dt; deathFall.y += deathFall.vy * dt; }
    if (stateTime > 2) {
      const next = nextTry(world);
      if (next) begin(next); else setState('over');
    }
  }
  showHud();
  const hero = world.hero;
  // The hero's look eases towards where it faces, and springs back from a squash.
  yaw += ((state === 'dead' ? 0 : hero.facing * 60) - yaw) * (1 - Math.exp(-dt * 14));
  squash += (1 - squash) * (1 - Math.exp(-dt * 10));
  heroLook.place(hero.body.x, hero.body.y + (state === 'dead' ? deathFall.y : 0), yaw, squash);
  heroLook.setVisible(state !== 'over' && hero.body.y + deathFall.y > -4);
  levelLook.showAround(cam.x, halfWidth);
  thingsLook.sync(world, state === 'play' ? dt : 0, { left: cam.x - halfWidth, right: cam.x + halfWidth });
  const lookY = cam.y - touchShift;
  camera.transform.setLocalPosition(cam.x, lookY + VIEW_RISE, VIEW_DISTANCE);
  camera.transform.lookAt(vec3.fromValues(cam.x, lookY, 0));
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

async function start(): Promise<void> {
  await loaded(0.1, 'A montar o nível…');
  world = makeWorld(LEVELS[0]);
  const level = world.level;
  scene = new Scene();
  scene.name = 'Omega Run';
  levelLook = await dressLevel(gl, scene, level);
  thingsLook = await dressThings(gl, scene, world);
  await loaded(0.5, 'A pintar o céu…');
  await dressWorld(gl, scene, level.width);
  await dressGoal(gl, scene, level.goal.x, level.goal.y);
  await loaded(0.75, 'A acordar o Bit…');
  heroLook = await dressHero(gl, scene);
  scene.setGlRenderingContext(gl);
  engine = new Engine();
  engine.initialize(canvas);
  engine.loadScene(scene);
  const settings = scene.renderPipeline.settings;
  settings.toneMapping = ToneMapping.ACES;
  const q = params.get('quality');
  const named: Record<string, number> = { low: 0, medium: 1, high: 2 };
  settings.applyQuality(q && q in named ? named[q] : RenderPipelineSettings.suggestedQuality(gl));
  scene.isRunning = true;

  const touch = $('touch');
  if (params.has('touch') || matchMedia('(pointer: coarse)').matches) { touch.hidden = false; touchShift = 1.4; measureTop(); }
  controls.bindTouch($('pad'), $('btn-a'), $('btn-b'));
  const again = () => { if (state === 'clear' || state === 'over') restart(); };
  banner.addEventListener('pointerdown', again);
  window.addEventListener('keydown', (e) => { if (e.code === 'Enter' || (e.code === 'Space' && (state === 'clear' || state === 'over'))) again(); });
  $('level-name').textContent = level.name;
  $('stats').hidden = !debug;

  (window as any).platformer = {
    get state() { return state; }, get world() { return world; }, get hero() { return world.hero; }, get level() { return world.level; }, get cam() { return cam; },
    get halfWidth() { return halfWidth; }, controls, restart, timing,
    get autoplay() { return !!autoplay; }, set autoplay(on: boolean) { autoplay = on ? makeBot() : null; },
  };
  restart();
  await loaded(1, 'Pronto');
  $('loading').classList.add('done');
  requestAnimationFrame(frame);
}

start().catch((err) => {
  $('load-text').textContent = `Erro: ${err?.message ?? err}`;
  console.error(err);
});
