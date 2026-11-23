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
import { LEVELS, WORLDS } from './levels';
import { LevelSpec } from './level';
import { THEMES } from './themes';
import { clipFor } from './bit';
import { dressGoal, dressHero, dressLevel, dressWorld, FLAG_BOTTOM, FLAG_TOP, GoalLook, HeroLook, LevelLook } from './look';
import { STEP } from './physics';
import { dressThings, ThingsLook } from './things';
import { makeWorld, nextTry, stepWorld, World } from './world';
import { BOSS_NAME } from './boss';
import { loadProgress, recordClear, saveProgress, totals, unlocked } from './progress';

const $ = (id: string) => document.getElementById(id)!;
const canvas = $('view') as HTMLCanvasElement;
const banner = $('banner');
const params = new URLSearchParams(location.search);
const debug = params.has('debug');

/** map: choosing a level; play; dead: the hero pops up and falls, then the next try; over: no lives left; clear: the flag. */
type State = 'loading' | 'map' | 'play' | 'dead' | 'over' | 'clear' | 'pause' | 'end';
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
let goalLook: GoalLook;
/** Bit's drawn size (1 small, BIG_SCALE big); while growing or shrinking it flickers between the two. */
const BIG_SCALE = 1.6;
let sizeFrom = 1, sizeTo = 1, sizeTime = 1;
/** At the flag: how far down the pole Bit has slid (m), and the flag's fall. */
const SLIDE_SPEED = 7;
let slide = { from: 0, done: false, hop: -1, x0: 0, y0: 0 };
/** The hop off the base after sliding down (s). */
const HOP_TIME = 0.45;
let clock = 0;
/** The hero's fall after dying: height and speed above where it died. */
let deathFall = { y: 0, vy: 0 };
/** The hero's look: turn (degrees) and squash (1 = none). */
let yaw = 60, squash = 1;
let accumulator = 0;
/** The bot plays instead of the controls (tests, and the title screen later). */
let autoplay: Bot | null = params.has('auto') ? makeBot() : null;
/** For measuring: when the last jump was pressed and when the hero left the ground (ms). */
const timing = { pressed: 0, jumped: 0 };

/** What has been done on each level, kept in the browser. `?unlock` opens every level. */
const store = (() => { try { return window.localStorage; } catch { return null; } })();
const progress = loadProgress(store, LEVELS.length);
const allOpen = params.has('unlock');
const isOpen = (i: number) => allOpen || unlocked(progress, i);
/** The title screen: the bot plays the first level behind it. */
let demo = false;
/** The boss arena (columns): from the gate that closes behind Bit to past the gate ahead. */
let arena: { left: number; right: number } | null = null;
/** The level being played (index into LEVELS), and the one picked on the map. */
let current = -1;
let picked = 0;

function setState(s: State): void {
  state = s;
  stateTime = 0;
  banner.hidden = s !== 'over' || demo;
  $('map').hidden = s !== 'map';
  $('pause').hidden = s !== 'pause';
  $('end').hidden = s !== 'end';
  $('title').hidden = !demo || s === 'loading' || s === 'map';
  const playing = s === 'play' || s === 'dead' || s === 'clear' || s === 'over';
  $('top').hidden = demo || !(playing || s === 'pause');
  $('touch').hidden = !touchOn || demo || !playing;
  if (s === 'over' && !demo) {
    banner.innerHTML = `<b>Fim do jogo</b><span>${world.score} pontos</span>
      <div class="actions"><button data-act="retry">Tentar outra vez</button><button data-act="map">Mapa</button></div>`;
  }
}

/** The big coins as diamonds: found ones filled. */
const diamonds = (taken: boolean[]) => taken.map((t) => (t ? '◆' : '◇')).join('');

function showClearBanner(): void {
  if (demo) { restart(); return; }
  banner.hidden = false;
  const last = current === LEVELS.length - 1;
  const flag = world.flag ? `<small>Bandeira: +${world.flag.points}</small>` : '';
  const big = world.bigCoins.map((c) => c.taken);
  banner.innerHTML = `<b>Nível completo!</b><span>${world.score} pontos</span>${flag}
    <small class="big">Moedas grandes: <i>${diamonds(big)}</i></small>
    <div class="actions"><button data-act="${last ? 'end' : 'next'}">Continuar</button><button data-act="retry">Repetir</button></div>`;
  recordClear(progress, current, world.score, big);
  saveProgress(store, progress);
}

/** After the last level: the totals, and the way back. */
function showEnd(): void {
  const t = totals(progress);
  $('end-stats').innerHTML = `<li><b>${t.done}/${LEVELS.length}</b> níveis</li><li><b>${t.big}/${t.bigOf}</b> moedas grandes</li><li><b>${t.score}</b> pontos (melhores de cada nível)</li>`;
  setState('end');
}

function pause(): void {
  if (state !== 'play' || demo) return;
  controls.clear();
  setState('pause');
}

function resume(): void {
  if (state !== 'pause') return;
  controls.clear();
  state = 'play';
  setState('play');
}

function formatTime(t: number): string {
  const s = Math.ceil(t);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

function showHud(): void {
  const boss = world.boss;
  const fight = !!boss && boss.state !== 'idle' && boss.hp > 0;
  $('boss-chip').hidden = !fight;
  if (fight) $('boss-chip').innerHTML = `${BOSS_NAME[boss!.kind]} <b>${'♥'.repeat(boss!.hp)}</b>`;
  $('big').textContent = diamonds(world.bigCoins.map((c) => c.taken));
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
  sizeFrom = sizeTo = 1; sizeTime = 1;
  deathFall = { y: 0, vy: 0 };
  goalLook.setFlag(1);
  thingsLook.hide();
  const gates: number[] = [];
  for (let x = 0; x < w.level.width; x++) for (let y = 0; y < w.level.height; y++) if (w.level.tiles[x][y] === 'gate') gates.push(x);
  arena = w.backGates.length && gates.length ? { left: w.backGates[0].x, right: Math.max(...gates) + 1 } : null;
  setState('play');
  showHud();
}

/** The level from its start: three lives, no checkpoint. */
function restart(): void {
  begin(makeWorld(LEVELS[current]));
}

/** Builds the scene for a level (the old one is destroyed) and starts it. */
async function loadLevel(index: number): Promise<void> {
  setState('loading');
  const spec: LevelSpec = LEVELS[index];
  $('loading').classList.remove('done');
  $('load-title').textContent = spec.name;
  await loaded(0.1, 'A montar o nível…');
  const w = makeWorld(spec);
  const theme = THEMES[w.level.theme];
  if (current === index && world && scene) { begin(w); $('loading').classList.add('done'); return; }
  scene?.destroy();
  scene = new Scene();
  scene.name = spec.name;
  levelLook = await dressLevel(gl, scene, w.level);
  thingsLook = await dressThings(gl, scene, w);
  await loaded(0.5, 'A pintar o céu…');
  await dressWorld(gl, scene, w.level.width, w.level.theme);
  goalLook = await dressGoal(gl, scene, w.level.goal.x, w.level.goal.y);
  await loaded(0.75, 'A acordar o Bit…');
  heroLook = await dressHero(gl, scene);
  scene.setGlRenderingContext(gl);
  engine.loadScene(scene);
  const settings = scene.renderPipeline.settings;
  settings.toneMapping = ToneMapping.ACES;
  settings.applyQuality(quality);
  scene.isRunning = true;
  gl.clearColor(theme.clear[0], theme.clear[1], theme.clear[2], 1);
  document.body.style.background = theme.page;
  current = index;
  $('level-name').textContent = spec.name;
  begin(w);
  await loaded(1, 'Pronto');
  $('loading').classList.add('done');
}

/** The world map: three worlds of three levels; the picked one glows. */
function showMap(): void {
  const box = $('worlds');
  box.innerHTML = WORLDS.map((wd, wi) => `
    <section class="world ${wd.theme}">
      <h2>${wi + 1} · ${wd.name}</h2>
      <ol>${wd.levels.map((spec, li) => {
        const i = wi * 3 + li, p = progress[i];
        const name = spec.name.split(' · ')[1] ?? spec.name;
        const locked = !isOpen(i);
        return `<li><button class="node${p.done ? ' done' : ''}${locked ? ' locked' : ''}${i === picked ? ' picked' : ''}" data-level="${i}"${locked ? ' aria-disabled="true"' : ''}>
          <span class="num">${wi + 1}-${li + 1}</span><span class="name">${locked ? '🔒 ' : ''}${name}</span>
          <span class="big">${diamonds(p.big)}</span>${p.best ? `<span class="best">${p.best}</span>` : ''}</button></li>`;
      }).join('')}</ol>
    </section>`).join('');
  box.querySelector('.picked')?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  setState('map');
}

function pick(i: number): void {
  picked = Math.max(0, Math.min(LEVELS.length - 1, i));
  showMap();
}

function play(i: number): void {
  if (!isOpen(i)) return;
  picked = i;
  if (demo) leaveDemo();
  loadLevel(i).catch((err) => { $('load-text').textContent = `Erro: ${err?.message ?? err}`; console.error(err); });
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
    else if (e.type === 'break') thingsLook.breakAt(e.x, e.y);
    else if (e.type === 'grow' || e.type === 'shrink') {
      sizeFrom = e.type === 'grow' ? 1 : BIG_SCALE; sizeTo = e.type === 'grow' ? BIG_SCALE : 1; sizeTime = 0;
    }
  }
  if (world.dead) {
    deathFall = { y: 0, vy: b.y < -1 ? 0 : 13 };
    setState('dead');
    return;
  }
  // The camera never goes back, so neither can the hero.
  const left = cam.x - halfWidth + b.w / 2;
  if (b.x < left) { b.x = left; if (b.vx < 0) b.vx = 0; }
  const ridden = hero.riding >= 0 ? world.platforms[hero.riding] : null;
  const boss = world.boss;
  const fight = !!arena && !!boss && boss.state !== 'idle' && boss.state !== 'down' && boss.state !== 'gone';
  followHero(cam, b, halfWidth, world.level.width, STEP, world.level.start.y + VIEW.above, topRoom, b.h, fight || (!!ridden && ridden.dx < 0));
  if (fight) {
    // In the boss's arena the camera may go back and forth, but keeps to the arena.
    const lo = arena!.left + halfWidth, hi = Math.max(lo, arena!.right + 0.5 - halfWidth);
    cam.x = Math.min(hi, Math.max(lo, cam.x));
    cam.minX = Math.min(cam.minX, cam.x);
  }
  if (world.cleared) {
    // Hold on to the pole (or, touching it below the top of its base, stand beside the base).
    const base = world.level.goal.y + 1;
    b.x = world.level.goal.x - (b.y >= base ? 0.06 : 0.52) - b.w / 2;
    slide = { from: b.y, done: false, hop: -1, x0: 0, y0: 0 };
    setState('clear');
  }
}

function update(dt: number): void {
  stateTime += dt;
  if (!world || state === 'map' || state === 'loading' || state === 'end') return;
  if (state === 'play') {
    accumulator += dt;
    let n = 0;
    while (accumulator >= STEP && n++ < 24 && state === 'play') { step(); accumulator -= STEP; }
  } else if (state === 'clear') {
    // Slide down the pole with the flag to the top of its base, hop off to the far side, celebrate, then the banner.
    const b = world.hero.body, foot = world.level.goal.y, base = foot + 1;
    if (slide.hop < 0) {
      b.y = Math.max(Math.min(base, slide.from), b.y - SLIDE_SPEED * dt);
      // The flag comes down with Bit (it is a little below Bit's feet at the top).
      goalLook.setFlag(Math.min(1, Math.max(0, (b.y - foot - FLAG_BOTTOM) / (FLAG_TOP - FLAG_BOTTOM))));
      if (b.y <= Math.min(base, slide.from) + 1e-9) { slide.hop = 0; slide.x0 = b.x; slide.y0 = b.y; goalLook.setFlag(0); }
    } else if (!slide.done) {
      slide.hop += dt;
      const k = Math.min(1, slide.hop / HOP_TIME);
      b.x = slide.x0 + (world.level.goal.x + 0.6 + b.w / 2 - slide.x0) * k;
      b.y = slide.y0 + (foot - slide.y0) * k + 1.6 * Math.sin(Math.PI * k);
      if (k >= 1) { slide.done = true; stateTime = 0; b.onGround = true; b.vx = 0; squash = 0.75; }
    } else if (stateTime > 1.2 && banner.hidden) showClearBanner();
    followHero(cam, b, halfWidth, world.level.width, dt, world.level.start.y + VIEW.above, topRoom, b.h);
  } else if (state === 'dead') {
    // A hop up, then down out of the picture; then the next try, or the end.
    if (stateTime > 0.35) { deathFall.vy -= 40 * dt; deathFall.y += deathFall.vy * dt; }
    if (stateTime > 2) {
      const next = nextTry(world);
      if (next) begin(next); else if (demo) restart(); else setState('over');
    }
  }
  showHud();
  const hero = world.hero;
  clock += dt;
  // The hero's look eases towards where it faces, and springs back from a squash.
  const sliding = state === 'clear' && !slide.done;
  const faceYaw = state === 'dead' ? 0 : sliding ? (slide.hop < 0 ? 90 : 60) : state === 'clear' ? 20 : hero.facing * 60;
  yaw += (faceYaw - yaw) * (1 - Math.exp(-dt * 14));
  squash += (1 - squash) * (1 - Math.exp(-dt * 10));
  // Growing or shrinking: flicker between the sizes for 0.6 s.
  sizeTime += state === 'play' ? dt : 0;
  const size = sizeTime >= 0.6 ? sizeTo : Math.floor(sizeTime / 0.1) % 2 ? sizeTo : sizeFrom;
  heroLook.place(hero.body.x, hero.body.y + (state === 'dead' ? deathFall.y : 0), yaw, squash, size);
  const b = hero.body;
  const pose = sliding
    ? { clip: 'Jump' as const, speed: 1 }
    : clipFor({ onGround: b.onGround, vx: b.vx, vy: b.vy, dead: state === 'dead', won: state === 'clear' });
  heroLook.animate(pose.clip, pose.speed);
  heroLook.tint(world.power, world.star, clock);
  // Blinking while hurt.
  const blink = state === 'play' && world.hurt > 0 && Math.floor(world.hurt / 0.07) % 2 === 0;
  heroLook.setVisible(state !== 'over' && hero.body.y + deathFall.y > -4 && !blink);
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
  engine.update(state === 'pause' ? 0 : dt);
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

/** The first level not yet finished (that can be played), for the map to open on. */
function firstOpen(): number {
  const i = progress.findIndex((p, k) => !p.done && isOpen(k));
  return i < 0 ? 0 : i;
}

/** The title screen: the bot plays the first level behind it. */
async function enterDemo(): Promise<void> {
  demo = true;
  autoplay = makeBot();
  if (current !== 0 || !world) await loadLevel(0);
  else restart();
  setState('play');
}

function leaveDemo(): void {
  demo = false;
  autoplay = params.has('auto') ? makeBot() : null;
  $('title').hidden = true;
}

let quality = 1;
/** Touch buttons are on (a touch screen, or ?touch). */
let touchOn = false;

async function start(): Promise<void> {
  await loaded(0.3, 'A preparar…');
  scene = new Scene();
  scene.setGlRenderingContext(gl);
  engine = new Engine();
  engine.initialize(canvas);
  engine.loadScene(scene);
  const q = params.get('quality');
  const named: Record<string, number> = { low: 0, medium: 1, high: 2 };
  quality = q && q in named ? named[q] : RenderPipelineSettings.suggestedQuality(gl);

  touchOn = params.has('touch') || matchMedia('(pointer: coarse)').matches;
  if (touchOn) { touchShift = 1.4; measureTop(); document.querySelector('#title .keys')!.textContent = '◀ ▶ para andar · A salta · B corre · ❚❚ para pausa'; }
  controls.bindTouch($('pad'), $('btn-a'), $('btn-b'));
  // The banners' buttons, and taps on the map.
  const act = (what: string) => {
    if (what === 'next') pick(Math.min(LEVELS.length - 1, current + 1));
    else if (what === 'retry') { banner.hidden = true; restart(); }
    else if (what === 'map') pick(Math.max(0, current));
    else if (what === 'end') showEnd();
    else if (what === 'resume') resume();
    else if (what === 'title') enterDemo();
    else if (what === 'start') { leaveDemo(); pick(firstOpen()); }
  };
  for (const id of ['banner', 'pause', 'end', 'title', 'map-head']) {
    $(id).addEventListener('click', (e) => {
      const b = (e.target as HTMLElement).closest('button');
      if (b?.dataset.act) act(b.dataset.act);
    });
  }
  document.addEventListener('visibilitychange', () => { if (document.hidden) pause(); });
  $('worlds').addEventListener('click', (e) => {
    const b = (e.target as HTMLElement).closest('button');
    if (b?.dataset.level) play(Number(b.dataset.level));
  });
  $('pause-button').addEventListener('click', () => pause());
  window.addEventListener('keydown', (e) => {
    if (state === 'map') {
      const moves: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -3, ArrowDown: 3, KeyA: -1, KeyD: 1 };
      if (e.code in moves) { e.preventDefault(); pick(picked + moves[e.code]); }
      else if (e.code === 'Enter' || e.code === 'Space') { e.preventDefault(); play(picked); }
    } else if (demo && (e.code === 'Enter' || e.code === 'Space') && state !== 'loading') { e.preventDefault(); act('start'); }
    else if (state === 'clear' && !banner.hidden && e.code === 'Enter') act(current === LEVELS.length - 1 ? 'end' : 'next');
    else if (state === 'over' && e.code === 'Enter') act('retry');
    else if (state === 'play' && (e.code === 'Escape' || e.code === 'KeyP')) pause();
    else if (state === 'pause' && (e.code === 'Escape' || e.code === 'KeyP' || e.code === 'Enter')) resume();
    else if (e.code === 'Escape' && (state === 'clear' || state === 'over' || state === 'end')) act('map');
  });
  $('stats').hidden = !debug;

  (window as any).platformer = {
    get state() { return state; }, get world() { return world; }, get hero() { return world.hero; }, get level() { return world.level; }, get cam() { return cam; },
    get halfWidth() { return halfWidth; }, controls, restart, timing, play, pick, progress, pause, resume, showEnd, get demo() { return demo; },
    get autoplay() { return !!autoplay; }, set autoplay(on: boolean) { autoplay = on ? makeBot() : null; },
  };
  requestAnimationFrame(frame);
  const start = params.get('level');
  if (start !== null) await loadLevel(Math.max(0, Math.min(LEVELS.length - 1, Number(start) || 0)));
  else await enterDemo();
}

start().catch((err) => {
  $('load-text').textContent = `Erro: ${err?.message ?? err}`;
  console.error(err);
});
