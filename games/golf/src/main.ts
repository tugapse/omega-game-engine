// Omega Golf: a round on Vale Omega for one to four players (and the computer),
// a swing gesture, the ball's own physics, a golfer, and the camera following it all.
import { mat4, vec3, vec4 } from 'gl-matrix';
import {
  Camera, CanvasViewport, Color, DefaultResourceLoader, DependencyManager, Engine, Pointer, RenderPipelineSettings,
  Resources, Scene, ToneMapping,
} from '../../../src';
import { BALL, BallState, Course, hit, restingBall, Shot, simulate, stepBall } from './ball';
import { club, ClubId, CLUBS, lieFactor, MAX_PUTT, shotFor, suggestClub } from './clubs';
import { buildHole, dropPoint, Hole } from './course';
import { COURSE_NAME, HOLES } from './holes';
import { BALL_LOOK, CourseLook, dressCourse, dressGolfer, GolferLook, SHIRTS } from './look';
import { formatToPar, GolfMatch, MAX_PLAYERS, MAX_STROKES } from './match';
import { CPU_NAMES, CpuPlan, CpuSkill, planShot } from './cpu';
import { seeded } from './course';
import { MISS_METRES, NEAREST, rangePoints, rangeTargets, RANGE_SHOTS } from './modes';
import { GolfSound } from './sound';
import { GolfMusic } from './music';
import { buildGolfer, GolferRig, IMPACT_TIME, PUTT_BACK_TIME, PUTT_IMPACT_TIME, setShaft, SHAFT, TOP_TIME } from './golfer';
import { GyroSwing } from './gyro';
import { scoreName } from './score';
import { bindSwing, Swing } from './swing';
import { downhill, HeightField, Surface } from './terrain';

const $ = (id: string) => document.getElementById(id)!;
const canvas = $('view') as HTMLCanvasElement;
const trailCanvas = $('trail') as HTMLCanvasElement;
const trail2d = trailCanvas.getContext('2d')!;
const result = $('result');
const hint = $('hint');
const powerBox = $('power');
const powerFill = $('power-fill');
const powerLabel = $('power-label');
const mapButton = $('map') as HTMLButtonElement;
const intro = $('intro');
const setupPanel = $('setup');
const namesBox = $('names');
const cardScreen = $('card');
const finalScreen = $('final');
const pauseMenu = $('pause-menu');
const pauseButton = $('pause') as HTMLButtonElement;
const turnBanner = $('turn');
const debug = new URLSearchParams(location.search).has('debug');

type State = 'loading' | 'setup' | 'intro' | 'aim' | 'swinging' | 'flight' | 'result' | 'card' | 'over';
/** What a game is: a full round, or the front three holes. */
type Mode = 'round9' | 'round3' | 'nearest' | 'range';
const MODES: Mode[] = ['round9', 'round3', 'nearest', 'range'];
const MODE_INFO: Record<Mode, string> = {
  round9: 'Os nove buracos de Vale Omega, par 36. Ganha quem fizer menos pancadas.',
  round3: 'Os três primeiros buracos, par 12: uma volta rápida.',
  nearest: 'Uma pancada a cada um de três greens. Contam os metros até à bandeira: ganha quem somar menos.',
  range: `${RANGE_SHOTS} bolas no campo de treino, três alvos: 50, 25 ou 10 pontos por anel. Ganha quem somar mais.`,
};
const isRound = () => mode === 'round9' || mode === 'round3';
/** The range's targets on hole 1 (with their ground height). */
let targets: { x: number; y: number; z: number }[] = [];
/** The score of the turn just played in the one-shot games (metres or points). */
let turnValue = 0;
const sound = new GolfSound();
const music = new GolfMusic(() => sound.context());
let musicOn = true;
/** Unlocks audio (it needs a gesture) and starts the music if it is on. */
function unlockAudio(): void {
  sound.unlock();
  if (musicOn && !music.playing) music.start();
}
/** What the flight has already made a sound for. */
let heard = { landed: false, trunk: 0, leaves: false };
let mode: Mode = 'round9';
let match = new GolfMatch<CpuSkill>(['Jogador 1'], [4]);
/** The holes of this game (indices into HOLES). */
let holeOrder: number[] = [];
let paused = false;
let selectedCount = 1;
let names: string[] = [];
let cpuSkill: CpuSkill | null = null;
/** The computer's turn: its plan once made, and the time line of its swing. */
let cpuTurn: { plan: CpuPlan | null; ready: boolean } | null = null;
const cpuRandom = seeded(Date.now() % 100000);
/** The current player is the computer: people's input is ignored. */
const computerPlays = () => !!match.player.cpu && state !== 'setup' && state !== 'over' && state !== 'card';
const humanAims = () => state === 'aim' && !paused && !computerPlays();
/** The view from above the hole, while aiming. */
let mapView = false;
/** Where the marker stands (for the map view). */
const markerAt = { x: 0, z: 0 };
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
let afterResult: 'next-shot' | 'end-turn' = 'next-shot';
/** The hole being played (0-based), holes built so far, strokes on finished holes and their par. */
let holeIndex = 0;
const built = new Map<number, Hole>();
/** This hole's wind, m/s, and where it blows to (radians, like the aim). */
let wind = { speed: 0, dir: 0 };
let shotsMade = 0;
const HINT_SHOTS = 3;
/** Keyboard swing: held space, its power and curve. */
let keySwing: { start: number; curve: number } | null = null;
let golfer: GolferRig;
let golferLook: GolferLook;
/** The shot chosen by the swing, struck when the club reaches the ball. */
let pendingShot: Shot | null = null;
let lastPower = 0;
/** The downswing in progress: the clip time it started from, and seconds since. */
let downswing = { from: 0, t: 0 };
const DOWNSWING = 0.15;
/** When the last swing was asked for and when its ball left (ms), to check the delay. */
const timing = { swing: 0, strike: 0 };
const gyro = new GyroSwing();
const scratch = vec3.create();

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
  const t = mode === 'range' ? { x: targets[1].x - ball.pos[0], z: targets[1].z - ball.pos[2] } : toPin();
  aim = Math.atan2(t.x, -t.z);
  const s = lie();
  clubId = suggestClub(mode === 'range' ? Math.hypot(t.x, t.z) : pinDistance(), reach, s === 'green', s === 'tee' && mode !== 'range');
  // Long holes: from the tee, aim down the fairway rather than straight at a far pin.
  if (s === 'tee' && pinDistance() > reach.driver && mode !== 'range') {
    const p = hole.spec.fairway.find((q) => Math.hypot(q.x - ball.pos[0], q.z - ball.pos[2]) > reach.driver * 0.75) ?? hole.spec.pin;
    aim = Math.atan2(p.x - ball.pos[0], -(p.z - ball.pos[2]));
  }
  showHud();
  placeMarker();
  placeGolfer();
}

/** A total as this game counts it: against par, metres or points. */
function formatScore(total: number, toPar: number): string {
  if (mode === 'nearest') return `${total.toFixed(1)} m`;
  if (mode === 'range') return `${total} pts`;
  return formatToPar(toPar);
}

const shirtCss = (i: number) => `rgb(${SHIRTS[i % SHIRTS.length].map((c) => Math.round(c * 255)).join(',')})`;

function showHud(): void {
  $('hole-num').textContent = String(holeIndex + 1);
  $('hole-name').textContent = hole.spec.name;
  const done = match.player.strokes.length > 0;
  $('total').innerHTML = `<b>Total</b>${done ? formatScore(match.total(match.player), match.toPar(match.player)) : '–'}`;
  const who = $('player-chip');
  who.hidden = match.players.length < 2;
  who.textContent = match.player.name;
  who.style.setProperty('--shirt', shirtCss(match.current));
  $('wind-speed').textContent = `${wind.speed.toFixed(1)} m/s`;
  // The arrow points where the wind blows, seen from behind the ball.
  ($('wind-arrow') as HTMLElement).style.transform = `rotate(${((wind.dir - aim) * 180) / Math.PI}deg)`;
  $('par').innerHTML = `<b>Par</b>${hole.spec.par}`;
  $('strokes').innerHTML = `<b>Pancadas</b>${strokes}`;
  $('par').hidden = $('strokes').hidden = !isRound();
  $('dist').hidden = mode === 'range';
  if (mode === 'nearest') $('hole-name').textContent = `${hole.spec.name} · desafio ${match.hole + 1}/${NEAREST.length}`;
  if (mode === 'range') $('hole-name').textContent = `Treino · bola ${match.hole + 1}/${RANGE_SHOTS}`;
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
    const r = simulate({ ground: course.ground, cup: { x: 1e6, z: 1e6 } }, { x: ball.pos[0], z: ball.pos[2] }, shotFor(c, p, aim), 15, 1000);
    const at = r.carry ?? r.end;
    x = at[0]; z = at[2];
  }
  markerAt.x = x; markerAt.z = z;
  look.marker.transform.setLocalPosition(x, hole.ground.height(x, z), z);
  const s = c.id === 'putter' ? 0.15 : Math.max(0.6, Math.hypot(x - ball.pos[0], z - ball.pos[2]) / 60);
  look.marker.transform.setLocalScale(s, 1, s);
}

function setState(next: State): void {
  state = next;
  stateTime = 0;
  hint.classList.toggle('hidden', next !== 'aim' || shotsMade >= HINT_SHOTS || computerPlays());
  setupPanel.classList.toggle('show', next === 'setup');
  cardScreen.classList.toggle('show', next === 'card');
  finalScreen.classList.toggle('show', next === 'over');
  pauseButton.hidden = next === 'setup' || next === 'over' || next === 'loading' || next === 'card';
  $('top').classList.toggle('gone', next === 'setup' || next === 'loading');
  $('clubs').classList.toggle('gone', next === 'setup' || next === 'loading' || next === 'card' || next === 'over');
  result.classList.toggle('show', next === 'result');
  look.marker.show = next === 'aim';
  if (next === 'card' || next === 'over' || next === 'setup') golferLook?.setVisible(false);
  if (next !== 'aim' && mapView) { mapView = false; scene.sceneFog.density = FOG; }
  mapButton.hidden = next !== 'aim' || computerPlays();
  mapButton.classList.toggle('on', mapView);
  intro.classList.toggle('show', next === 'intro');
  if (next === 'aim') {
    readyShot();
    cpuTurn = computerPlays() ? { plan: null, ready: false } : null;
  }
}

function swing(s: Swing, byComputer = false): void {
  if (state !== 'aim' || paused || (computerPlays() && !byComputer)) return;
  const c = club(clubId);
  // Off the fairway the ball comes out slower.
  const shot = shotFor(c, s.power, aim, s.curve);
  shot.speed *= lieFactor(lie(), c.id);
  pendingShot = shot;
  // The club comes down from wherever the backswing got to (from the start for keys and the gyro).
  const name = swingClip();
  const a = golfer.animator;
  if (a.currentClip?.name !== name) { a.play(name, { loop: false }); a.time = backTime() * Math.max(0.3, s.power); }
  // A quick downswing on the game's own clock: the club reaches the ball 0.15 s
  // after the flick, wherever the backswing stopped, whatever the frame rate.
  a.speed = 0;
  downswing = { from: a.time, t: 0 };
  showPower(null);
  timing.swing = performance.now();
  sound.swing(clubId === 'putter' ? 0 : s.power);
  lastPower = s.power;
  setState('swinging');
}

/** The ball leaves the club face. */
function strike(): void {
  if (!pendingShot) return;
  shotFrom = { x: ball.pos[0], z: ball.pos[2] };
  hit(ball, pendingShot);
  pendingShot = null;
  golfer.animator.speed = 1; // the follow-through at its own pace
  timing.strike = performance.now();
  sound.strike(clubId, lastPower);
  heard = { landed: false, trunk: 0, leaves: false };
  strokes++;
  shotsMade++;
  trail = [[...ball.pos]];
  trailFade = 1;
  accumulator = 0;
  showHud();
  setState('flight');
}

const swingClip = () => (clubId === 'putter' ? 'Putt' : 'Swing');
const backTime = () => (clubId === 'putter' ? PUTT_BACK_TIME : TOP_TIME);
const impactTime = () => (clubId === 'putter' ? PUTT_IMPACT_TIME : IMPACT_TIME);

/** The golfer's yaw (degrees) for an aim: it faces across the line, the target to its left. */
const golferYaw = () => -90 - (aim * 180) / Math.PI;

/**
 * Stands the golfer at the ball: where the club head is at impact (with the
 * root at the origin, turned for the aim) gives where the root must go.
 */
function placeGolfer(): void {
  const a = golfer.animator;
  setShaft(golfer, clubId);
  golferLook.setClub(clubId, SHAFT[clubId]);
  golfer.root.transform.setLocalPosition(0, 0, 0);
  golfer.root.transform.setLocalRotation(0, golferYaw(), 0);
  a.play(swingClip(), { loop: false });
  a.time = impactTime();
  golfer.root.transform.updateMatrices();
  vec3.copy(scratch, golfer.head.transform.worldPosition);
  const x = ball.pos[0] - scratch[0], z = ball.pos[2] - scratch[2];
  golfer.root.transform.setLocalPosition(x, hole.ground.height(x, z), z);
  a.play('Idle', { loop: true });
  a.speed = 1;
  golferLook.setVisible(true);
}

/** The backswing follows the power bar. */
function scrubBackswing(p: number | null): void {
  if (state !== 'aim' || !golfer) return;
  const a = golfer.animator;
  if (p === null) { if (a.currentClip?.name !== 'Idle') { a.play('Idle', { loop: true }); a.speed = 1; } return; }
  if (a.currentClip?.name !== swingClip()) a.play(swingClip(), { loop: false });
  a.speed = 0;
  a.time = p * backTime();
}

function showResult(text: string, sub: string, big = false): void {
  result.innerHTML = `${text}${sub ? `<small>${sub}</small>` : ''}`;
  result.classList.toggle('big', big);
  setState('result');
}

/** The ball stopped: say where, and what comes next. */
function shotOver(): void {
  const travelled = Math.round(Math.hypot(ball.pos[0] - shotFrom.x, ball.pos[2] - shotFrom.z));
  if (ball.phase === 'holed') sound.cup();
  if (ball.phase === 'water' || ball.phase === 'out') sound.miss();
  if (!isRound()) { oneShotOver(); return; }
  if (ball.phase === 'holed') {
    afterResult = 'end-turn';
    const name = scoreName(strokes, hole.spec.par);
    const who = match.players.length > 1 ? `${match.player.name} · ` : '';
    showResult(name, `${who}${strokes} pancada${strokes === 1 ? '' : 's'}`, strokes < hole.spec.par || strokes === 1);
    if (strokes < hole.spec.par || strokes === 1) sound.chime(strokes === 1 ? 4 : 1 + hole.spec.par - strokes);
    return;
  }
  afterResult = 'next-shot';
  // The pick-up rule: at the limit the hole ends where the ball is.
  if (strokes >= MAX_STROKES - (ball.phase === 'water' || ball.phase === 'out' ? 1 : 0)) {
    afterResult = 'end-turn';
    strokes = MAX_STROKES;
    showResult('Apanha a bola', `${MAX_STROKES} pancadas neste buraco`);
    return;
  }
  if (ball.phase === 'water') {
    // A penalty stroke, and a drop on dry ground back along the line it came in on.
    strokes++;
    const d = dropPoint(hole.ground, shotFrom, { x: ball.pos[0], z: ball.pos[2] });
    showResult('Água!', '+1 pancada · a bola é largada na margem');
    ball = restingBall(hole.ground, d.x, d.z);
    return;
  }
  if (ball.phase === 'out') {
    // Stroke and distance: one more stroke, played again from where it was.
    strokes++;
    showResult('Fora!', '+1 pancada · joga de novo do mesmo sítio');
    ball = restingBall(hole.ground, shotFrom.x, shotFrom.z);
    return;
  }
  showResult(SURFACE_NAME[lie()].replace(/^./, (c) => c.toUpperCase()), `${travelled} m · faltam ${pinDistance() < 10 ? pinDistance().toFixed(1) : Math.round(pinDistance())} m`);
}

function advance(): void {
  if (state === 'intro' && stateTime > 0.3) { setState('aim'); return; }
  if (state !== 'result' || stateTime < 0.4) return;
  if (afterResult === 'end-turn') finishTurn();
  else setState('aim');
}

/** The one shot of a nearest-the-pin or range turn has stopped: score it. */
function oneShotOver(): void {
  afterResult = 'end-turn';
  const who = match.players.length > 1 ? `${match.player.name} · ` : '';
  const wet = ball.phase === 'water' || ball.phase === 'out';
  if (mode === 'nearest') {
    turnValue = ball.phase === 'holed' ? 0 : wet ? MISS_METRES : Math.round(pinDistance() * 10) / 10;
    if (ball.phase === 'holed') { sound.chime(4); showResult('Na bandeira!', `${who}0 m`, true); }
    else if (wet) showResult(ball.phase === 'water' ? 'Água!' : 'Fora!', `${who}contam ${MISS_METRES} m`);
    else { if (turnValue < 3) sound.chime(2); showResult(`${turnValue.toFixed(1)} m`, `${who}da bandeira`, turnValue < 3); }
    return;
  }
  const travelled = Math.round(Math.hypot(ball.pos[0] - shotFrom.x, ball.pos[2] - shotFrom.z));
  turnValue = wet ? 0 : rangePoints(targets, ball.pos[0], ball.pos[2]);
  if (turnValue === 50) sound.chime(3); else if (turnValue === 25) sound.chime(2);
  showResult(turnValue ? `${turnValue} pontos` : 'Falhou', `${who}${travelled} m`, turnValue === 50);
}

/** The player holed out (or picked up): the next player, the scorecard after a hole, or the end. */
function finishTurn(): void {
  const next = match.finish(isRound() ? strokes : turnValue);
  if (next === 'player') { startTurn(false); return; }
  // The range goes on ball after ball; its card comes at the end.
  if (mode === 'range' && next === 'hole') { void startHole(holeOrder[match.hole]); return; }
  showCard(next === 'over');
}

/** The next player on the tee of this hole (the first one gets the fly-in). */
function startTurn(first: boolean): void {
  strokes = 0;
  const from = (mode === 'nearest' ? NEAREST[match.hole].from : undefined) ?? hole.spec.tee;
  ball = restingBall(hole.ground, from.x, from.z);
  trail = [];
  golferLook.setShirt(match.current);
  showHud();
  if (first) { golferLook.setVisible(false); setState('intro'); snapCamera(); return; }
  setState('aim');
  snapCamera();
  if (match.players.length > 1) announce(`Vez de ${match.player.name}`, match.current);
}

function announce(text: string, player: number): void {
  turnBanner.textContent = text;
  turnBanner.style.setProperty('--shirt', shirtCss(player));
  turnBanner.classList.remove('show');
  void turnBanner.offsetWidth; // restart the animation
  turnBanner.classList.add('show');
}

/** Builds (the first time) and shows hole `i`, draws its wind, and sets the ball on the tee. */
async function startHole(i: number): Promise<void> {
  holeIndex = i;
  if (!built.has(i)) built.set(i, buildHole(HOLES[i]));
  hole = built.get(i)!;
  wind = { speed: Math.round(Math.random() * hole.spec.windMax * 10) / 10, dir: Math.random() * Math.PI * 2 };
  course = { ground: hole.ground, cup: hole.spec.pin, trees: hole.trees, wind: { x: Math.sin(wind.dir) * wind.speed, z: -Math.cos(wind.dir) * wind.speed } };
  await look.showHole(hole);
  const p = hole.spec.pin;
  look.placeFlag(p.x, hole.ground.height(p.x, p.z), p.z);
  look.setFlag(mode !== 'range');
  targets = mode === 'range' ? rangeTargets(hole.spec).map((t) => ({ ...t, y: hole.ground.height(t.x, t.z) })) : [];
  await look.setTargets(mode === 'range' ? targets : null);
  const length = Math.round(Math.hypot(p.x - hole.spec.tee.x, p.z - hole.spec.tee.z));
  intro.innerHTML = mode === 'range' ? '<small>Campo de treino</small>Treino<small>três alvos: 70, 130 e 190 m</small>'
    : mode === 'nearest' ? `<small>Desafio ${match.hole + 1} de ${NEAREST.length}</small>${hole.spec.name}<small>o mais perto da bandeira</small>`
      : `<small>Buraco ${holeIndex + 1}</small>${hole.spec.name}<small>Par ${hole.spec.par} · ${length} m</small>`;
  // The range flies in once; after that each round goes straight to the tee.
  startTurn(mode !== 'range' || match.hole === 0);
}

/** The scorecard after a hole (and at the end, before the final screen). */
function showCard(over: boolean): void {
  const holes = holeOrder.slice(0, Math.max(1, match.hole));
  const head = `<tr><th></th>${holes.map((h, k) => `<th>${isRound() ? h + 1 : k + 1}</th>`).join('')}<th>Total</th></tr>`;
  const par = isRound() ? `<tr class="par"><td>Par</td>${holes.map((h) => `<td>${HOLES[h].par}</td>`).join('')}<td>${holes.reduce((s, h) => s + HOLES[h].par, 0)}</td></tr>` : '';
  const cell = (v: number | undefined) => (v === undefined ? '' : mode === 'nearest' ? v.toFixed(1) : String(v));
  const rows = match.players.map((pl, i) => `<tr><td><i style="background:${shirtCss(i)}"></i>${pl.name}</td>${holes.map((h, k) => {
    const v = pl.strokes[k];
    const good = isRound() ? v < HOLES[h].par : mode === 'nearest' ? v < 3 : v >= 50;
    const bad = isRound() ? v > HOLES[h].par : mode === 'nearest' ? v >= MISS_METRES : v === 0;
    return `<td class="${good ? 'under' : bad ? 'over' : ''}">${cell(v)}</td>`;
  }).join('')}<td><b>${mode === 'nearest' ? match.total(pl).toFixed(1) : match.total(pl)}</b>${isRound() ? ` <small>${formatToPar(match.toPar(pl))}</small>` : ''}</td></tr>`).join('');
  $('card-table').innerHTML = head + par + rows;
  const step = isRound() ? 'buraco' : mode === 'nearest' ? 'desafio' : 'bola';
  $('card-title').textContent = over ? 'Cartão final' : `Depois do ${step} ${match.hole}`;
  $('card-next').textContent = over ? 'Ver resultado' : isRound() ? `Buraco ${holeOrder[match.hole] + 1}` : 'Continuar';
  setState('card');
}

function leaveCard(): void {
  if (state !== 'card' || stateTime < 0.3) return;
  if (match.isOver) showFinal();
  else void startHole(holeOrder[match.hole]);
}

/** The best score on this device for a mode, and whether this one beats it. */
function bestOf(key: string, total: number, highWins = false): string {
  let stored: number | null = null;
  try { const v = localStorage.getItem(`golf.best.${key}`); stored = v === null ? null : Number(v); } catch { /* no storage */ }
  if (stored === null || (highWins ? total > stored : total < stored)) {
    try { localStorage.setItem(`golf.best.${key}`, String(total)); } catch { /* no storage */ }
    return stored === null ? '' : 'Novo recorde neste aparelho!';
  }
  return `Recorde neste aparelho: ${mode === 'nearest' ? `${stored.toFixed(1)} m` : stored}`;
}

function showFinal(): void {
  const ranking = match.ranking();
  $('final-list').innerHTML = ranking.map((pl, k) => {
    const i = match.players.indexOf(pl);
    const total = mode === 'nearest' ? `${match.total(pl).toFixed(1)} m` : mode === 'range' ? `${match.total(pl)} pts` : String(match.total(pl));
    return `<li class="rank${k === 0 ? ' first' : ''}"><div class="head"><i style="background:${shirtCss(i)}"></i>${pl.name}<em>${isRound() ? formatToPar(match.toPar(pl)) : ''}</em><b>${total}</b></div></li>`;
  }).join('');
  const humans = ranking.filter((pl) => !pl.cpu);
  $('final-note').textContent = humans.length === 1 ? bestOf(mode, match.total(humans[0]), mode === 'range') : '';
  $('final-title').textContent = match.players.length > 1 ? `Ganhou ${ranking[0].name}!` : 'Fim da volta';
  setState('over');
}

/** Starts a game with the start screen's choices. */
function startMatch(): void {
  const chosen = Array.from({ length: selectedCount }, (_, i) => names[i]?.trim() || `Jogador ${i + 1}`);
  holeOrder = mode === 'round3' ? [0, 1, 2] : mode === 'nearest' ? NEAREST.map((c) => c.hole)
    : mode === 'range' ? Array.from({ length: RANGE_SHOTS }, () => 0) : HOLES.map((_, i) => i);
  const scoring = mode === 'nearest' ? 'metres' : mode === 'range' ? 'points' : 'strokes';
  match = new GolfMatch<CpuSkill>(chosen, holeOrder.map((h) => (isRound() ? HOLES[h].par : 0)), cpuSkill ?? undefined, scoring);
  try {
    localStorage.setItem('golf.names', JSON.stringify(names));
    localStorage.setItem('golf.players', String(selectedCount));
    localStorage.setItem('golf.mode', mode);
    localStorage.setItem('golf.cpu', cpuSkill ?? '');
  } catch { /* no storage */ }
  closePause();
  void startHole(holeOrder[0]);
}

function selectCount(count: number): void {
  const max = cpuSkill ? MAX_PLAYERS - 1 : MAX_PLAYERS;
  selectedCount = Math.max(1, Math.min(max, count));
  setupPanel.querySelectorAll<HTMLButtonElement>('button[data-players]').forEach((b) => {
    b.classList.toggle('on', Number(b.dataset.players) === selectedCount);
    b.disabled = Number(b.dataset.players) > max;
  });
  namesBox.innerHTML = '';
  for (let i = 0; i < selectedCount; i++) {
    const input = document.createElement('input');
    input.maxLength = 12;
    input.placeholder = `Jogador ${i + 1}`;
    input.value = names[i] ?? '';
    input.style.setProperty('--dot', shirtCss(i));
    input.addEventListener('input', () => { names[i] = input.value; });
    namesBox.appendChild(input);
  }
}

function chooseMode(next: Mode): void {
  mode = next;
  setupPanel.querySelectorAll<HTMLButtonElement>('button[data-mode]').forEach((b) => b.classList.toggle('on', b.dataset.mode === mode));
  $('mode-info').textContent = MODE_INFO[mode];
}

function chooseCpu(skill: CpuSkill | null): void {
  cpuSkill = skill;
  setupPanel.querySelectorAll<HTMLButtonElement>('button[data-cpu]').forEach((b) => b.classList.toggle('on', (b.dataset.cpu || null) === skill));
  selectCount(selectedCount);
}

function openPause(): void {
  if (state === 'setup' || state === 'over' || state === 'loading' || paused) return;
  paused = true;
  pauseMenu.classList.add('show');
  music.duck(true);
}

function closePause(): void {
  paused = false;
  pauseMenu.classList.remove('show');
  music.duck(false);
}

function goToMenu(): void {
  closePause();
  setState('setup');
}

/** The computer's turn: think, line up, take the club back, swing. */
function updateCpu(): void {
  if (!cpuTurn || state !== 'aim' || paused) return;
  if (!cpuTurn.plan && stateTime > 0.8) {
    // On the range it picks a target and plays at it as if it were the pin.
    const t = mode === 'range' ? targets[Math.floor(cpuRandom() * targets.length)] : null;
    const h = t ? { ...hole, spec: { ...hole.spec, pin: t, fairway: [] } } : hole;
    cpuTurn.plan = planShot(match.player.cpu!, h, t ? { ...course, cup: t } : course, { x: ball.pos[0], z: ball.pos[2] }, reach, cpuRandom);
    clubId = cpuTurn.plan.club;
    aim = cpuTurn.plan.aim;
    showHud();
    placeMarker();
    placeGolfer();
    stateTime = 0.8;
    return;
  }
  if (!cpuTurn.plan) return;
  const back = (stateTime - 1.6) / 0.7;
  if (back > 0 && back < 1) showPower(back * cpuTurn.plan.swing.power);
  else if (back >= 1) { const plan = cpuTurn.plan; cpuTurn = null; swing(plan.swing, true); }
}

function changeClub(step: number): void {
  if (!humanAims()) return;
  const i = CLUBS.findIndex((c) => c.id === clubId);
  clubId = CLUBS[(i + step + CLUBS.length) % CLUBS.length].id;
  showHud();
  placeMarker();
  placeGolfer();
}

function turnAim(da: number): void {
  if (!humanAims()) return;
  aim += da;
  placeMarker(power ?? 1);
  if (power === null) placeGolfer();
}

/** Camera: behind the ball looking down the aim; chasing it in flight. */
function cameraGoal(outEye: vec3, outLook: vec3): void {
  const b = ball.pos;
  const putting = clubId === 'putter';
  if (state === 'intro') {
    // From high over the green down to behind the tee.
    const t = Math.min(1, stateTime / INTRO_TIME), e = t * t * (3 - 2 * t);
    const p = hole.spec.pin, tee = hole.spec.tee;
    const dx = p.x - tee.x, dz = p.z - tee.z, len = Math.hypot(dx, dz) || 1;
    const fromEye = [p.x + (dx / len) * 40, hole.ground.height(p.x, p.z) + 45, p.z + (dz / len) * 40];
    const toEye = [tee.x - (dx / len) * 6, hole.ground.height(tee.x, tee.z) + 3, tee.z - (dz / len) * 6];
    vec3.set(outEye, fromEye[0] + (toEye[0] - fromEye[0]) * e, fromEye[1] + (toEye[1] - fromEye[1]) * e, fromEye[2] + (toEye[2] - fromEye[2]) * e);
    const lookFrom = [tee.x + dx * 0.5, hole.ground.height(tee.x + dx * 0.5, tee.z + dz * 0.5), tee.z + dz * 0.5];
    vec3.set(outLook, lookFrom[0] + (p.x - lookFrom[0]) * (1 - e) * 0.6, lookFrom[1], lookFrom[2] + (p.z - lookFrom[2]) * (1 - e) * 0.6);
    return;
  }
  if (state === 'aim' && mapView) {
    // Straight-ish down over the middle of the ball, the marker and the pin.
    const mx = (b[0] + markerAt.x + hole.spec.pin.x) / 3, mz = (b[2] + markerAt.z + hole.spec.pin.z) / 3;
    const span = Math.max(Math.hypot(b[0] - hole.spec.pin.x, b[2] - hole.spec.pin.z), Math.hypot(b[0] - markerAt.x, b[2] - markerAt.z), 20);
    const fx = Math.sin(aim), fz = -Math.cos(aim);
    vec3.set(outEye, mx - fx * span * 0.15, hole.ground.height(mx, mz) + span * 1.1 + 10, mz - fz * span * 0.15);
    vec3.set(outLook, mx, hole.ground.height(mx, mz), mz);
    return;
  }
  if (state === 'aim' || state === 'swinging') {
    const fx = Math.sin(aim), fz = -Math.cos(aim);
    const back = putting ? 3 : 4.8, up = putting ? 1.8 : 2.4;
    // A little to the right of the line: the golfer stands on its left.
    const side = putting ? 0.5 : 0.8;
    vec3.set(outEye, b[0] - fx * back - fz * side, b[1] + up, b[2] - fz * back + fx * side);
    const ahead = putting ? Math.min(pinDistance(), 4) : 9;
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
const INTRO_TIME = 3.2;
const FOG = 0.0011;
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
  if (state === 'intro' && stateTime > INTRO_TIME + 0.4) setState('aim');
  // The pole would block a short putt: it comes out when the ball is close.
  look.setPole(!(state !== 'intro' && pinDistance() < 6 && lie() === 'green'));
  updateCpu();
  if (state === 'swinging') {
    downswing.t += dt;
    const k = Math.min(1, downswing.t / DOWNSWING);
    golfer.animator.time = downswing.from + (impactTime() - downswing.from) * k * k; // speeding up into the ball
    if (k >= 1) strike();
  }
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
    if (ball.landed && !heard.landed) { heard.landed = true; sound.land(lie(), Math.hypot(...ball.vel)); }
    if (ball.trunkHits > heard.trunk) { heard.trunk = ball.trunkHits; sound.trunk(); }
    if (ball.inLeaves && !heard.leaves) { heard.leaves = true; sound.leaves(); }
    if (ball.phase === 'water') sound.splash();
    if (ball.phase !== 'flying' && ball.phase !== 'rolling') shotOver();
    else showHud();
  } else if (state === 'result') {
    trailFade = Math.max(0, trailFade - dt * 0.5);
  }
  if (keySwing && humanAims()) {
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
  if (state === 'aim') scrubBackswing(p);
  if (p !== null && state !== 'aim') return;
  powerBox.classList.toggle('show', p !== null && state === 'aim');
  powerLabel.classList.toggle('show', p !== null && state === 'aim');
  if (p === null) return;
  powerFill.style.height = `${Math.round(p * 100)}%`;
  powerLabel.textContent = clubId === 'putter' ? `${(Math.max(0.05, p) * MAX_PUTT).toFixed(1)} m` : `${Math.round(p * 100)}%`;
  placeMarker(Math.max(0.05, p));
}

function toggleMap(): void {
  if (!humanAims()) return;
  mapView = !mapView;
  scene.sceneFog.density = mapView ? 0.0003 : FOG;
  mapButton.classList.toggle('on', mapView);
}

/** Moving dots on the green around the ball, flowing downhill: faster and warmer where it is steeper. */
function drawGreen(now: number): void {
  if (state !== 'aim' || lie() !== 'green') return;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const range = Math.min(14, pinDistance() + 5);
  const step = range > 8 ? 1 : 0.7;
  const t = now / 1000;
  trail2d.lineCap = 'round';
  trail2d.shadowColor = 'rgba(0, 0, 0, .5)';
  trail2d.shadowBlur = 3 * dpr;
  for (let gz = -range; gz <= range; gz += step) {
    for (let gx = -range; gx <= range; gx += step) {
      const x = Math.round((ball.pos[0] + gx) / step) * step, z = Math.round((ball.pos[2] + gz) / step) * step;
      if (Math.hypot(x - ball.pos[0], z - ball.pos[2]) > range || hole.ground.surface(x, z) !== 'green') continue;
      const d = downhill(hole.ground, x, z);
      const k = Math.min(1, d.slope / 0.03);
      const phase = (((t * (0.4 + k) + (x * 0.37 + z * 0.61)) % 1) + 1) % 1;
      const off = (phase - 0.5) * step * 0.8;
      const px = x + d.x * off, pz = z + d.z * off;
      const len = 0.18 + 0.25 * k;
      const a = project([px, hole.ground.height(px, pz) + 0.02, pz]);
      const b = project([px + d.x * len, hole.ground.height(px + d.x * len, pz + d.z * len) + 0.02, pz + d.z * len]);
      if (!a || !b) continue;
      const alpha = Math.sin(phase * Math.PI);
      // White on a gentle slope, gold on a medium one, pink on a steep one.
      const r = 255, g = Math.round(k < 0.5 ? 255 - 90 * k : 210 - 296 * (k - 0.5)), bl = Math.round(k < 0.5 ? 255 - 384 * k : 63 + 204 * (k - 0.5));
      trail2d.strokeStyle = `rgba(${r}, ${g}, ${bl}, ${alpha})`;
      trail2d.lineWidth = 3 * dpr;
      trail2d.beginPath();
      trail2d.moveTo(a[0], a[1]);
      trail2d.lineTo(b[0], b[1]);
      trail2d.stroke();
    }
  }
  trail2d.shadowBlur = 0;
}

/** Projects a world point to canvas pixels, or null behind the camera. */
const viewProj = mat4.create(), viewMat = mat4.create(), clip = vec4.create();
function project(p: number[]): [number, number] | null {
  vec4.set(clip, p[0], p[1], p[2], 1);
  vec4.transformMat4(clip, clip, viewProj);
  if (clip[3] <= 0.05) return null;
  return [(clip[0] / clip[3] * 0.5 + 0.5) * trailCanvas.width, (-clip[1] / clip[3] * 0.5 + 0.5) * trailCanvas.height];
}

function drawTrail(now: number): void {
  trail2d.clearRect(0, 0, trailCanvas.width, trailCanvas.height);
  // The view from where the camera was put this frame (eye looking at target).
  mat4.lookAt(viewMat, eye, target, [0, 1, 0]);
  mat4.multiply(viewProj, camera.projectionMatrix, viewMat);
  drawGreen(now);
  if (trail.length < 2 || trailFade <= 0) return;
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
  if (!paused) {
    update(dt);
    engine.update(dt);
  }
  engine.render();
  drawTrail(now);
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
  scene = new Scene();
  scene.name = 'Golf';
  look = await dressCourse(gl, scene);
  await loaded(0.6, 'A chamar o jogador…');
  golfer = buildGolfer();
  golferLook = await dressGolfer(gl, scene, golfer);
  await loaded(0.8, 'A acender o sol…');
  scene.sceneFog.enabled = true;
  scene.sceneFog.fogType = 1;
  scene.sceneFog.density = FOG;
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
    onPower: (p) => { if (humanAims() && !gyro.enabled) showPower(p); },
    onSwing: (sw) => { if (!gyro.enabled) swing(sw); },
    onTap: () => { if (state === 'card') leaveCard(); else advance(); },
  });
  Pointer.onDown(() => {
    unlockAudio();
    if (paused) return;
    if (state === 'result' || state === 'intro') advance();
    else if (humanAims() && gyro.enabled) gyro.hold();
  });
  Pointer.onUp(() => {
    if (!gyro.enabled || !humanAims()) return;
    const sw = gyro.release();
    if (sw) swing(sw);
  });
  const gyroButton = $('gyro') as HTMLButtonElement;
  if (GyroSwing.available && new URLSearchParams(location.search).has('gyro')) gyroButton.hidden = false;
  gyroButton.addEventListener('click', async () => {
    if (gyro.enabled) gyro.disable(); else await gyro.enable();
    gyroButton.classList.toggle('on', gyro.enabled);
  });
  mapButton.addEventListener('click', toggleMap);
  $('club-prev').addEventListener('click', () => changeClub(-1));
  $('club-next').addEventListener('click', () => changeClub(1));
  setupPanel.querySelectorAll<HTMLButtonElement>('button[data-mode]').forEach((b) => b.addEventListener('click', () => chooseMode(b.dataset.mode as Mode)));
  setupPanel.querySelectorAll<HTMLButtonElement>('button[data-cpu]').forEach((b) => b.addEventListener('click', () => chooseCpu((b.dataset.cpu || null) as CpuSkill | null)));
  setupPanel.querySelectorAll<HTMLButtonElement>('button[data-players]').forEach((b) => b.addEventListener('click', () => selectCount(Number(b.dataset.players))));
  try {
    names = JSON.parse(localStorage.getItem('golf.names') ?? '[]');
    const m = localStorage.getItem('golf.mode') as Mode;
    if (MODES.includes(m)) mode = m;
    const c = localStorage.getItem('golf.cpu');
    cpuSkill = c && c in CPU_NAMES ? c as CpuSkill : null;
    selectedCount = Number(localStorage.getItem('golf.players')) || 1;
  } catch { names = []; }
  if (!Array.isArray(names)) names = [];
  chooseMode(mode);
  chooseCpu(cpuSkill);
  $('play').addEventListener('click', startMatch);
  pauseButton.addEventListener('click', openPause);
  $('resume').addEventListener('click', closePause);
  $('restart').addEventListener('click', startMatch);
  $('to-menu').addEventListener('click', goToMenu);
  $('again').addEventListener('click', startMatch);
  $('final-menu').addEventListener('click', goToMenu);
  $('card-next').addEventListener('click', leaveCard);
  document.addEventListener('visibilitychange', () => { if (document.hidden) openPause(); });
  let muted = false;
  try { muted = localStorage.getItem('golf.muted') === '1'; } catch { /* no storage */ }
  const soundButton = $('sound') as HTMLButtonElement;
  const showSound = () => { soundButton.textContent = muted ? '🔇 Sem som' : '🔊 Som'; soundButton.classList.toggle('on', !muted); };
  sound.setMuted(muted);
  showSound();
  try { musicOn = localStorage.getItem('golf.music') !== '0'; } catch { /* no storage */ }
  const musicButton = $('music') as HTMLButtonElement;
  const showMusic = () => { musicButton.textContent = musicOn ? '♪ Música' : '♪ Sem música'; musicButton.classList.toggle('on', musicOn); };
  showMusic();
  musicButton.addEventListener('click', () => {
    musicOn = !musicOn;
    if (musicOn) { sound.unlock(); music.start(); music.duck(paused); } else music.stop();
    try { localStorage.setItem('golf.music', musicOn ? '1' : '0'); } catch { /* no storage */ }
    showMusic();
  });
  soundButton.addEventListener('click', () => {
    muted = !muted;
    sound.setMuted(muted);
    sound.unlock();
    try { localStorage.setItem('golf.muted', muted ? '1' : '0'); } catch { /* no storage */ }
    showSound();
  });
  window.addEventListener('keydown', (e) => {
    unlockAudio();
    if (e.repeat || (e.target as HTMLElement)?.tagName === 'INPUT') return;
    if (state === 'setup') {
      const n = Number(e.key);
      if (n >= 1 && n <= MAX_PLAYERS) selectCount(n);
      else if (e.key === 'Enter') startMatch();
      return;
    }
    if (state === 'over') { if (e.key === 'Enter' || e.key === ' ') startMatch(); else if (e.key === 'Escape') goToMenu(); return; }
    if (e.key === 'Escape' || e.key === 'p' || e.key === 'P') { if (paused) closePause(); else openPause(); return; }
    if (paused) return;
    if (state === 'card' && (e.key === ' ' || e.key === 'Enter')) { leaveCard(); return; }
    if ((state === 'result' || state === 'intro') && (e.key === ' ' || e.key === 'Enter')) { advance(); return; }
    if (!humanAims()) return;
    if (e.key === 'm' || e.key === 'M') { toggleMap(); return; }
    if (e.key === 'ArrowLeft') turnAim(-0.01);
    else if (e.key === 'ArrowRight') turnAim(0.01);
    else if (e.key === 'ArrowUp') changeClub(-1);
    else if (e.key === 'ArrowDown') changeClub(1);
    else if (e.key === ' ' || e.key === 'Enter') keySwing = { start: performance.now(), curve: 0 };
    else if (keySwing && (e.key === 'q' || e.key === 'Q')) keySwing.curve = -0.7;
    else if (keySwing && (e.key === 'e' || e.key === 'E')) keySwing.curve = 0.7;
  });
  window.addEventListener('keyup', (e) => {
    if ((e.key === ' ' || e.key === 'Enter') && keySwing && humanAims()) {
      const p = power ?? 0;
      const curve = keySwing.curve;
      keySwing = null;
      showPower(null);
      swing({ power: p, curve });
    }
  });
  (window as any).golf = {
    get state() { return state; }, get ball() { return ball; }, get strokes() { return strokes; }, get aim() { return aim; },
    get club() { return clubId; }, get golfer() { return golfer; }, reach, get hole() { return hole; }, get holeIndex() { return holeIndex; }, startHole, get match() { return match; }, startMatch, chooseMode, chooseCpu, selectCount, leaveCard, goToMenu, openPause, closePause, get paused() { return paused; }, music, timing, get wind() { return wind; }, swing, advance, turnAim, changeClub,
    placeBall(x: number, z: number) { ball = restingBall(hole.ground, x, z); setState('aim'); snapCamera(); },
    toggleMap, showPower,
    setClub(id: ClubId) { clubId = id; showHud(); placeMarker(); },
  };
  $('stats').hidden = !debug;
  // A first hole behind the start screen.
  holeOrder = HOLES.map((_, i) => i);
  await startHole(0);
  await loaded(1, 'Pronto');
  $('loading').classList.add('done');
  setState('setup');
  requestAnimationFrame(frame);
}

start().catch((err) => {
  $('load-text').textContent = `Erro: ${err?.message ?? err}`;
  console.error(err);
});
