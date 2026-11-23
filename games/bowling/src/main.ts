// Omega Bowling: a ten-frame game on a physics lane, thrown with a swipe.
import RAPIER from '@dimforge/rapier3d-compat';
import { vec2, vec3 } from 'gl-matrix';
import {
  Camera, CanvasViewport, Color, Pointer, DefaultResourceLoader, DependencyManager, Engine, PhysicsWorld, RapierBackend,
  RenderPipelineSettings, Resources, Scene, ToneMapping,
} from '../../../src';
import { bindSwipe } from './controls';
import { GyroThrow } from './gyro';
import { Match, MAX_PLAYERS } from './match';
import { ArcadeGame, multiplierFor } from './arcade';
import { LEAVES, SparesGame } from './spares';
import { CPU_NAMES, CpuPlan, CpuSkill, planThrow } from './cpu';
import { levelLayout, ObstacleField, ObstacleSpec, straightPath } from './obstacles';
import { BowlerRig, buildBowler, RELEASE_TIME } from './bowler';
import {
  allStill, BALL, buildLane, isPinDown, LANE, LaneEntities, rackPins, removePin, resetBall, standingPins,
  ThrowParams, throwBall,
} from './lane';
import { BowlerLook, dressBowler, dressLane, dressObstacles, makeAimGuide, makeSweepBar, SHIRTS } from './look';
import { ReplayRecorder } from './replay';
import { BackgroundMusic } from './music';
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
const musicButton = document.getElementById('music') as HTMLButtonElement;
const replayTag = document.getElementById('replay-tag')!;
const trailCanvas = document.getElementById('trail') as HTMLCanvasElement;
const setupPanel = document.getElementById('setup')!;
const othersList = document.getElementById('others')!;
const turnBanner = document.getElementById('turn')!;
const modeInfo = document.getElementById('mode-info')!;
const trail2d = trailCanvas.getContext('2d')!;

type State = 'loading' | 'setup' | 'aim' | 'approach' | 'rolling' | 'settling' | 'result' | 'replay' | 'sweep' | 'over';
let state: State = 'loading';
let match = Match.withPlayers(1);
/** Classic ten frames, or the obstacle mode (each player's lane gets harder as they knock pins down). */
type Mode = 'classic' | 'obstacles' | 'spares';
const MODES: Mode[] = ['classic', 'obstacles', 'spares'];
let mode: Mode = 'classic';
let field: ObstacleField;
/** Player `i`'s game in the obstacle mode. */
const arcade = (i = match.current) => match.players[i].game as ArcadeGame;
/** Player `i`'s game in the spare challenge. */
const spares = (i = match.current) => match.players[i].game as SparesGame;
/** The lane the current player plays on. */
const layoutNow = (): ObstacleSpec[] => (mode === 'obstacles' ? levelLayout(arcade().level) : []);
/** A player went up a level with the last roll: who and to what, for the banner. */
let levelUp: { player: number; level: number } | null = null;
/** The computer opponent's skill, or null for none (start screen). */
let cpuSkill: CpuSkill | null = null;
/** The computer's turn: its plan, and when it bowls (seconds into the aim state). */
let cpuTurn: { plan: CpuPlan; at: number; placed: boolean } | null = null;
/** The current player is the computer: people's input is ignored. */
const computerPlays = () => !!match.player.cpu && state !== 'setup' && state !== 'over';
/** The new lane's obstacles rise while the camera flies back to the bowler. */
let rising = false;
/** The current player's game. */
const game = () => match.player.game;
/** The roll just scored passed the turn to the next player. */
let turnPassed = false;
/** The player whose scoreboard is shown: the one who just bowled, until the turn changes hands. */
let shown = 0;
/** Each player's spot and aim, kept between their turns. */
let spots: { x: number; aim: number }[] = [];
let bowler: BowlerRig;
let bowlerLook: BowlerLook;
/** Where the held ball is at the release, relative to the bowler's root (the bowler stands so it lands at the ball's spot). */
const releaseOffset = vec3.create();
/** The throw chosen by the swipe, bowled when the arm reaches the release. */
let pendingThrow: ThrowParams | null = null;
/** Pins standing when the current roll started. */
let standingBefore: number[] = [];
let wentInGutter = false;
/** The sweep in progress: whether it ends with a fresh rack, and the standing pins it lifts. */
let sweep = {
  fresh: true, lifted: [] as { index: number; x: number; z: number }[], cleared: false, racked: false,
  /** The next lane, when it changes (the obstacles sink, swap and rise during the sweep). */
  relayout: null as ObstacleSpec[] | null, swapped: false,
  /** Set only these pins (the spare challenge), or all ten when null. */
  rack: null as number[] | null,
};
let sweepBar: import('../../../src').SceneEntity;
let aimGuide: import('../../../src').SceneEntity;
/** Aim, radians from straight down the lane (positive = right); a swipe's own angle adds to it. */
let aimAngle = 0;
const MAX_AIM = 0.07;
const gyro = new GyroThrow();
const BAR_REST = vec3.fromValues(0, 1.3, -17.75); // above the pin camera's view
const sound = new BowlingSound();
const music = new BackgroundMusic(sound.audio);
let musicOn = true;
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
  hint.classList.toggle('hidden', next !== 'aim' || !!match.player.cpu);
  result.classList.toggle('show', next === 'result' || next === 'over');
  result.classList.toggle('over', next === 'over');
  replayTag.classList.toggle('show', next === 'replay');
  setupPanel.classList.toggle('show', next === 'setup');
  if (next === 'aim') {
    const n = game().next!;
    const who = match.players.length > 1 ? `${match.player.name} · ` : '';
    const leave = LEAVES[n.frame];
    frameInfo.textContent = mode === 'obstacles'
      ? `${who}Nível ${arcade().level} (×${multiplierFor(arcade().level)}) · Ronda ${n.frame + 1} · ${n.roll + 1}.º lançamento`
      : mode === 'spares' ? `${who}Desafio ${n.frame + 1}/10 · ${leave.name} · ${'★'.repeat(leave.stars)}`
        : `${who}Frame ${n.frame + 1} · ${n.roll + 1}.º lançamento`;
    readyBowler();
    cpuTurn = match.player.cpu ? planCpuTurn(match.player.cpu) : null;
  }
  placeAimGuide();
}

/** The bowler at the start of the approach, ball in hand, behind the ball's spot. */
function readyBowler(): void {
  if (!bowler) return;
  bowler.root.transform.setLocalPosition(ballX - releaseOffset[0], 0, BALL.start[2] - releaseOffset[2]);
  bowler.animator.play('Idle', { loop: true });
  bowlerLook?.setVisible(true);
  bowler.ball.show = true;
  lane.ball.show = false;
}

/** The arm reached the release: the real ball takes over from the one in the hand. */
function release(): void {
  const t = pendingThrow!;
  pendingThrow = null;
  bowler.root.transform.updateMatrices();
  const p = bowler.ball.transform.worldPosition;
  lane.ballBody.teleport(vec3.fromValues(ballX, Math.max(p[1], BALL.radius + 0.002), BALL.start[2]), [0, 0, 0, 1]);
  bowler.ball.show = false;
  lane.ball.show = true;
  throwBall(lane, t);
  recorder.clear();
  rollTime = 0;
  setState('rolling');
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

/** The computer's throw for the pins standing (and the corridor past fixed obstacles); it waits a moment to time moving ones. */
function planCpuTurn(skill: CpuSkill): { plan: CpuPlan; at: number; placed: boolean } {
  const standing = standingPins(lane).map((i) => {
    const p = lane.pins[i].transform.worldPosition;
    return { x: p[0], z: p[2] };
  });
  const corridor = field.current.length ? straightPath([...field.current]) : null;
  const moving = field.current.some((o) => o.kind === 'slider' || o.kind === 'spinner');
  return { plan: planThrow(skill, standing, Math.random, corridor), at: 1.6 + (moving ? Math.random() * 2 : Math.random() * 0.4), placed: false };
}

/** The computer takes its spot and aim, then bowls. */
function updateCpu(): void {
  if (!cpuTurn) return;
  if (!cpuTurn.placed && stateTime > 0.6) {
    cpuTurn.placed = true;
    ballX = cpuTurn.plan.x;
    aimAngle = cpuTurn.plan.aim;
    resetBall(lane, ballX);
    bowler.root.transform.setLocalPosition(ballX - releaseOffset[0], 0, BALL.start[2] - releaseOffset[2]);
    placeAimGuide();
  }
  if (stateTime > cpuTurn.at) {
    const t = cpuTurn.plan.throw;
    cpuTurn = null;
    bowl(t, true);
  }
}

/** A throw from the swipe (or keys, or the gyroscope, or the computer): the bowler walks up and releases it. */
function bowl(t: ThrowParams, byComputer = false): void {
  if (state !== 'aim' || (computerPlays() && !byComputer)) return;
  standingBefore = standingPins(lane);
  wentInGutter = false;
  const angle = Math.max(-0.1, Math.min(0.1, aimAngle + t.angle));
  throwInfo.textContent = describeThrow(t, angle);
  pendingThrow = { ...t, angle };
  spots[match.current] = { x: ballX, aim: aimAngle };
  bowler.animator.play('Throw', { loop: false });
  setState('approach');
}

function moveBall(dx: number): void {
  if (state !== 'aim' || computerPlays()) return;
  const limit = LANE.halfWidth - BALL.radius;
  ballX = Math.max(-limit, Math.min(limit, ballX + dx));
  resetBall(lane, ballX);
  bowler.root.transform.setLocalPosition(ballX - releaseOffset[0], 0, BALL.start[2] - releaseOffset[2]);
  placeAimGuide();
}

function turnAim(da: number): void {
  if (state !== 'aim' || computerPlays()) return;
  aimAngle = Math.max(-MAX_AIM, Math.min(MAX_AIM, aimAngle + da));
  placeAimGuide();
}

/** Taps: aim (or a motion throw) while aiming, otherwise continue. */
function tap(x: number, y: number): void {
  if (state === 'setup' || state === 'approach') return;
  if (state === 'replay') { endReplay(); return; }
  if (state !== 'aim') { advance(); return; }
  if (computerPlays()) return;
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
    if (match.isOver) {
      showFinal();
      setState('over');
      return;
    }
    if (turnPassed) nextPlayer();
    else if (levelUp) announce(`Nível ${levelUp.level} · pontos ×${multiplierFor(levelUp.level)}`, match.current);
    levelUp = null;
    const next = game().next!;
    const fresh = next.freshRack || !!next.rack;
    const lifted = fresh ? [] : standingPins(lane).map((index) => {
      const p = lane.pins[index].transform.worldPosition;
      return { index, x: p[0], z: p[2] };
    });
    const layout = layoutNow();
    const relayout = JSON.stringify(layout) === JSON.stringify(field.current) ? null : layout;
    sweep = { fresh, lifted, cleared: false, racked: false, relayout, swapped: false, rack: next.rack ?? null };
    resetBall(lane, ballX);
    sound.pinsetter(1.4);
    setState('sweep');
  } else if (state === 'over') {
    setState('setup');
  }
}

/** The turn passes: the next player's colours, spot and aim, and a banner. */
function nextPlayer(): void {
  turnPassed = false;
  shown = match.current;
  const spot = spots[match.current] ?? { x: 0, aim: 0 };
  ballX = spot.x;
  aimAngle = spot.aim;
  bowlerLook.setShirt(match.current);
  renderScore();
  const who = match.player.cpu ? 'Vez do computador' : `Vez de ${match.player.name}`;
  announce(mode === 'obstacles' ? `${who} · Nível ${arcade().level}` : who, match.current);
}

/** The banner in the middle of the screen, underlined in a player's colour. */
function announce(text: string, player: number): void {
  turnBanner.textContent = text;
  turnBanner.style.setProperty('--shirt', cssColor(SHIRTS[player]));
  turnBanner.classList.remove('show');
  void turnBanner.offsetWidth; // restart the animation
  turnBanner.classList.add('show');
}

const cssColor = (c: number[]) => `rgb(${c.map((x) => Math.round(x * 255)).join(', ')})`;

/** A new match for `count` players, from the start screen. */
function choosePlayers(count: number): void {
  if (state !== 'setup') return;
  unlockAudio();
  try { localStorage.setItem('bowling.players', String(count)); } catch { /* no storage */ }
  match = Match.withPlayers(count, mode === 'obstacles' ? () => new ArcadeGame() : mode === 'spares' ? () => new SparesGame() : undefined, cpuSkill ?? undefined);
  cpuTurn = null;
  levelUp = null;
  rising = false;
  spots = match.players.map(() => ({ x: 0, aim: 0 }));
  turnPassed = false;
  shown = 0;
  ballX = 0;
  aimAngle = 0;
  bowlerLook.setShirt(0);
  scoreboard.replaceChildren();
  renderScore();
  rack(game().next!.rack ?? null);
  resetBall(lane, ballX);
  field.setLayout(layoutNow());
  field.setRaised(1);
  showPins();
  setState('aim');
}

/** Picks the computer opponent on the start screen (remembered): a skill, or null for none. */
function chooseCpu(skill: CpuSkill | null): void {
  cpuSkill = skill;
  try { localStorage.setItem('bowling.cpu', skill ?? ''); } catch { /* no storage */ }
  setupPanel.querySelectorAll<HTMLButtonElement>('button[data-cpu]').forEach((b) => b.classList.toggle('on', (b.dataset.cpu || null) === skill));
  // With the computer, four people do not fit.
  setupPanel.querySelector<HTMLButtonElement>('button[data-players="4"]')!.disabled = !!skill;
}

/** Sets the pins: all ten, or only `pins` (0-based) for a spare leave. */
function rack(pins: number[] | null): void {
  rackPins(lane);
  if (pins) lane.pins.forEach((_, i) => { if (!pins.includes(i)) removePin(lane, i); });
}

/** Picks the mode on the start screen (remembered). */
function chooseMode(next: Mode): void {
  mode = next;
  try { localStorage.setItem('bowling.mode', mode); } catch { /* no storage */ }
  setupPanel.querySelectorAll<HTMLButtonElement>('button[data-mode]').forEach((b) => b.classList.toggle('on', b.dataset.mode === mode));
  modeInfo.textContent = mode === 'obstacles'
    ? '10 rondas. Quanto mais pinos derrubas, mais obstáculos aparecem na tua pista, e mais vale cada pino.'
    : mode === 'spares' ? '10 formações difíceis, uma bola para cada. Limpar vale as estrelas × 10.'
      : '10 frames, com as regras do bowling.';
}

/** The best solo score of a mode on this device: updates it and says how this one compares. */
function bestOf(key: string, score: number): string {
  let best = 0;
  try { best = Number(localStorage.getItem(`bowling.best.${key}`)) || 0; } catch { /* no storage */ }
  if (score <= best) return `<small>Recorde: ${best}</small>`;
  try { localStorage.setItem(`bowling.best.${key}`, String(score)); } catch { /* no storage */ }
  return best > 0 ? '<small>Novo recorde!</small>' : '';
}

/** The end of the match: the score, or the ranking for several players. */
function showFinal(): void {
  if (match.players.length === 1) {
    const score = match.player.game.score;
    let record = '';
    if (mode === 'obstacles') {
      record = `${bestOf('obstacles', score)}<small>Nível ${arcade(0).level}</small>`;
    }
    if (mode === 'spares') record = `<small>Limpaste ${spares(0).cleared} de 10</small>${bestOf('spares', score)}`;
    result.innerHTML = `Fim do jogo<br><b>${score}</b>${record}`;
    return;
  }
  const rows = match.ranking().map((p, i) => {
    const colour = cssColor(SHIRTS[match.players.indexOf(p)]);
    const level = mode === 'obstacles' ? `<em>Nv ${(p.game as ArcadeGame).level}</em>`
      : mode === 'spares' ? `<em>${(p.game as SparesGame).cleared}/10</em>` : '';
    return `<li><i style="background:${colour}"></i>${i === 0 ? '🏆 ' : ''}${p.name}${level}<b>${p.game.score}</b></li>`;
  }).join('');
  result.innerHTML = `Fim do jogo<ol class="ranking">${rows}</ol>`;
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
  // A new lane: the obstacles sink and change while the camera is on the pins; they rise once it flies back.
  if (sweep.relayout) {
    if (!sweep.swapped && t > 0.55) {
      sweep.swapped = true;
      field.setLayout(sweep.relayout);
      rising = true;
    }
    field.setRaised(sweep.swapped ? 0 : 1 - smooth(t / 0.5));
  }
  if (sweep.fresh && !sweep.racked && t > 1.2) {
    sweep.racked = true;
    rack(sweep.rack);
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
  const player = match.players[shown];
  const next = player.game.next;
  scoreboard.style.setProperty('--shirt', cssColor(SHIRTS[shown]));
  othersList.innerHTML = match.players.length > 1 ? match.players.map((p, i) => (
    `<span class="${i === shown ? 'me' : ''}"><i style="background:${cssColor(SHIRTS[i])}"></i>${p.name}${mode === 'obstacles' ? ` · Nv ${(p.game as ArcadeGame).level}` : ''} <b>${p.game.score}</b></span>`
  )).join('') : '';
  player.game.frames().forEach((view, f) => {
    const el = scoreboard.children[f] as HTMLElement;
    el.querySelectorAll('span').forEach((box, k) => { box.textContent = view.marks[k] ?? ''; });
    (el.querySelector('.total') as HTMLElement).textContent = view.total === null ? '' : String(view.total);
    el.classList.toggle('current', next?.frame === f);
  });
}

/** Starts the audio on the first gesture, and the music with it if it is on. */
function unlockAudio(): void {
  if (sound.running) { if (musicOn && !music.playing) music.start(); return; }
  void sound.unlock().then(() => { if (musicOn) music.start(); });
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
  music.duck(state === 'rolling' || state === 'settling' || state === 'replay');
  if (state === 'rolling') {
    const speed = vec3.length(lane.ballBody.getLinearVelocity());
    if (Math.abs(ball[0]) > LANE.halfWidth + 0.03 && ball[2] > LANE.headPin) wentInGutter = true;
    if (ball[2] < LANE.deckEnd - 0.2 || ball[1] < -0.2 || stateTime > 10 || (stateTime > 1 && speed < 0.05)) setState('settling');
  } else if (state === 'settling') {
    if ((stateTime > 1.5 && allStill(lane)) || stateTime > 5) {
      showPins();
      const before = game().next!;
      const roller = match.current;
      const levelBefore = mode === 'obstacles' ? arcade().level : 0;
      const pins = standingBefore.filter((i) => isPinDown(lane, i)).length;
      turnPassed = match.roll(pins);
      renderScore();
      const strike = before.freshRack && pins === 10;
      const spare = !strike && !before.freshRack && pins === before.pinsLeft;
      result.textContent = strike ? 'Strike!' : spare ? 'Spare!'
        : pins === 0 ? (wentInGutter ? 'Calha' : 'Nenhum pino')
          : `${pins} ${pins === 1 ? 'pino' : 'pinos'}`;
      if (mode === 'obstacles') {
        // The round's points once it is over, and a level reached.
        const g = arcade(roller);
        const roundOver = g.isOver || g.next?.roll === 0;
        if (roundOver) result.insertAdjacentHTML('beforeend', `<small>+${g.roundScores().at(-1)} pontos</small>`);
        if (g.level > levelBefore) {
          levelUp = { player: roller, level: g.level };
          result.insertAdjacentHTML('beforeend', `<small>Subiste ao nível ${g.level}!</small>`);
        }
      }
      if (mode === 'spares') {
        const leave = LEAVES[before.frame];
        result.textContent = spare ? 'Limpo!' : pins === 0 ? (wentInGutter ? 'Calha' : 'Falhaste') : `${pins} de ${before.pinsLeft}`;
        result.insertAdjacentHTML('beforeend', `<small>+${spare ? leave.stars * 10 : pins} pontos</small>`);
      }
      result.classList.toggle('big', strike || spare);
      if (strike || spare) sound.chime(strike);
      // Replays: strikes, and the hard leaves cleared.
      const hardClear = mode === 'spares' && spare && LEAVES[before.frame].stars >= 3;
      replayNext = (strike || hardClear) && recorder.impactTime !== null;
      setState('result');
    }
  } else if (state === 'result') {
    if (stateTime > (replayNext ? 1.3 : 1.8)) {
      if (replayNext) { replayNext = false; startReplay(); } else advance();
    }
  } else if (state === 'aim') {
    updateCpu();
  } else if (state === 'approach') {
    if (bowler.animator.time >= RELEASE_TIME) release();
  } else if (state === 'replay') {
    updateReplay(dt);
  } else if (state === 'sweep') {
    updateSweep();
  }
  if (rising && state !== 'sweep') {
    // Up in 0.9 s once the camera starts back; done by the time a ball thrown at once gets there.
    const f = state === 'aim' ? smooth((stateTime - 0.25) / 0.9) : 1;
    field.setRaised(f);
    if (f >= 1) rising = false;
  }
  if (state === 'rolling' || state === 'settling') showPins();

  // Camera: behind the ball when aiming, following it down the lane, then on the pins.
  const target = vec3.create(), aimAt = vec3.create();
  if (state === 'aim' || state === 'loading' || state === 'setup') {
    // Behind and above the bowler's right shoulder, the ball's line in view.
    vec3.set(target, ballX * 0.7 + 0.45, 2.35, BALL.start[2] - releaseOffset[2] + 3.4);
    vec3.set(aimAt, ballX * 0.35 + 0.1, 0.1, -11);
  } else if (state === 'approach' || (state === 'rolling' && rollTime < 0.5)) {
    // Walking up with the bowler, and a moment on the follow-through.
    const hips = bowler.bones.get('Hips')!.transform.worldPosition;
    vec3.set(target, ballX * 0.6 + 0.3, 1.9, hips[2] + 3.0);
    vec3.set(aimAt, ballX * 0.3, 0.1, -12);
  } else if (state === 'rolling' && recorder.impactTime !== null) {
    // At impact: a cut to a low, close view of the pins.
    vec3.set(target, 0.25, 0.55, -16.5);
    vec3.set(aimAt, 0, 0.15, -18.6);
  } else if (state === 'rolling') {
    // High over the bowler's follow-through at first, down behind the ball as it goes.
    const near = Math.min(1, Math.max(0, (ball[2] + 5) / 4.75));
    vec3.set(target, ball[0] * 0.5 + 0.3 * near, 0.9 + 1.0 * near, Math.max(ball[2] + 2.8, -14.8));
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
  const k = cut ? 1 : 1 - Math.exp(-dt * (state === 'rolling' ? 8 : state === 'replay' ? 4 : state === 'aim' || state === 'approach' ? 6 : 3));
  vec3.lerp(eye, eye, target, k);
  vec3.lerp(look, look, aimAt, k);
  // The camera flies past the bowler after the release: hide the figure before it goes through it.
  if (state === 'rolling' && eye[2] < bowler.bones.get('Hips')!.transform.worldPosition[2] + 1.2) bowlerLook.setVisible(false);
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
  const ballLook = await dressLane(gl, scene, lane);
  bowler = buildBowler();
  bowlerLook = await dressBowler(gl, scene, bowler, ballLook);
  // Where the held ball is at the release, so the bowler can stand where that lands on the ball's spot.
  bowler.animator.play('Throw', { loop: false });
  bowler.animator.time = RELEASE_TIME;
  bowler.root.transform.updateMatrices();
  vec3.copy(releaseOffset, bowler.ball.transform.worldPosition);
  readyBowler();
  sweepBar = await makeSweepBar(gl, scene);
  sweepBar.transform.setLocalPosition(BAR_REST[0], BAR_REST[1], BAR_REST[2]);
  aimGuide = await makeAimGuide(gl, scene);
  field = new ObstacleField(world, lane);
  await dressObstacles(gl, scene, field);
  recorder = new ReplayRecorder([lane.ball, ...lane.pins, ...field.entities]);
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
    unlockAudio(); // browsers allow audio only after a gesture
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
  try { musicOn = localStorage.getItem('bowling.music') !== '0'; } catch { /* no storage */ }
  const showMusic = () => { musicButton.textContent = musicOn ? 'Música: sim' : 'Música: não'; musicButton.classList.toggle('on', musicOn); };
  showMusic();
  musicButton.addEventListener('click', () => {
    musicOn = !musicOn;
    if (musicOn) void sound.unlock().then(() => music.start()); else music.stop();
    try { localStorage.setItem('bowling.music', musicOn ? '1' : '0'); } catch { /* no storage */ }
    showMusic();
  });
  let muted = false;
  try { muted = localStorage.getItem('bowling.muted') === '1'; } catch { /* no storage */ }
  const showSound = () => { soundButton.textContent = muted ? 'Som: não' : 'Som: sim'; soundButton.classList.toggle('on', !muted); };
  sound.setMuted(muted);
  showSound();
  soundButton.addEventListener('click', () => {
    muted = !muted;
    sound.setMuted(muted);
    if (!muted) void sound.unlock();
    try { localStorage.setItem('bowling.muted', muted ? '1' : '0'); } catch { /* no storage */ }
    showSound();
  });
  // The gyroscope is a nice-to-have, tuned at the end: hidden unless the page has ?gyro.
  if (GyroThrow.available && new URLSearchParams(location.search).has('gyro')) gyroButton.hidden = false;
  gyroButton.addEventListener('click', () => { void toggleGyro(); });
  setupPanel.querySelectorAll<HTMLButtonElement>('button[data-mode]').forEach((b) => {
    b.addEventListener('click', () => chooseMode(b.dataset.mode as Mode));
  });
  let savedMode: Mode = 'classic';
  try { savedMode = (MODES as string[]).includes(localStorage.getItem('bowling.mode') ?? '') ? localStorage.getItem('bowling.mode') as Mode : 'classic'; } catch { /* no storage */ }
  chooseMode(savedMode);
  setupPanel.querySelectorAll<HTMLButtonElement>('button[data-cpu]').forEach((b) => {
    b.addEventListener('click', () => chooseCpu((b.dataset.cpu || null) as CpuSkill | null));
  });
  let savedCpu: CpuSkill | null = null;
  try { const c = localStorage.getItem('bowling.cpu'); savedCpu = c && c in CPU_NAMES ? c as CpuSkill : null; } catch { /* no storage */ }
  chooseCpu(savedCpu);
  setupPanel.querySelectorAll<HTMLButtonElement>('button[data-players]').forEach((b) => {
    b.addEventListener('click', () => choosePlayers(Number(b.dataset.players)));
  });
  let lastCount = 1;
  try { lastCount = Number(localStorage.getItem('bowling.players')) || 1; } catch { /* no storage */ }
  setupPanel.querySelector<HTMLButtonElement>(`button[data-players="${Math.min(MAX_PLAYERS, lastCount)}"]`)?.classList.add('last');
  window.addEventListener('keydown', (e) => {
    unlockAudio();
    if (state === 'setup') {
      const n = Number(e.key);
      if (n >= 1 && n <= MAX_PLAYERS) choosePlayers(n);
      else if (e.key === 'm' || e.key === 'M' || e.key === 'Tab') { e.preventDefault(); chooseMode(MODES[(MODES.indexOf(mode) + 1) % MODES.length]); }
      else if (e.key === 'Enter' || e.key === ' ') choosePlayers(Math.min(MAX_PLAYERS, lastCount));
      return;
    }
    if (e.key === 'ArrowLeft') moveBall(-0.03);
    else if (e.key === 'ArrowRight') moveBall(0.03);
    else if (e.key === 'a' || e.key === 'A') turnAim(-0.005);
    else if (e.key === 'd' || e.key === 'D') turnAim(0.005);
    else if (e.key === ' ' || e.key === 'Enter' || e.key === 'q' || e.key === 'e') {
      // Space or Enter: straight; Q: hook left; E: hook right.
      const spin = e.key === 'q' ? 15 : e.key === 'e' ? -15 : 0;
      if (state === 'aim') bowl({ speed: 8, angle: 0, spin });
      else if (state === 'replay') endReplay();
      else if (state !== 'approach') advance();
    }
  });
  (window as any).bowling = {
    lane, world, scene, bowl, advance, aimAt, sound, music, recorder, startReplay, bowler, choosePlayers, chooseMode, levelLayout, get field() { return field; }, get mode() { return mode; },
    get aimAngle() { return aimAngle; }, get match() { return match; }, get game() { return game(); }, get state() { return state; },
  };
  document.getElementById('loading')!.classList.add('done');
  setState('setup');
  requestAnimationFrame(frame);
}

start().catch((err) => {
  hint.textContent = `Erro: ${err?.message ?? err}`;
  console.error(err);
});
