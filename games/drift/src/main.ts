// Omega Drift: small cars on short tracks, sliding through the bends. Three
// ways to play from the menu: the championship (three cups of three races
// against five rivals), a single race against them, and a time trial against
// the ghost of the best lap. The title screen runs a race of bots behind it.
import {
  Camera, CanvasViewport, DefaultResourceLoader, DependencyManager, Engine, RenderPipelineSettings, Resources, Scene,
  ToneMapping,
} from '../../../src';
import { vec3 } from 'gl-matrix';
import { Car, CarInput, driftAngle, forwardSpeed, makeCar, NO_INPUT, speedOf, STEP, stepCar } from './car';
import { CHASE, ChaseState, followCar, makeChase } from './camera';
import { CarModel, carById, CARS } from './cars';
import { addResult, Championship, CUP_ORDER, cupOver, CUPS, makeChampionship, playerPlace, POINTS, RIVALS, rivalPaces, table } from './cup';
import { DriftScore, isDrifting, makeScore, pending as chainPoints, updateScore } from './drift';
import { guideCurve, makeRival, Rival, rivalDrive } from './driver';
import { dressEffects, Effects } from './effects';
import { Controls } from './input';
import { CarLook, dressCar, dressTrack, dressWorld, TrackLook } from './look';
import { Music } from './music';
import {
  carOpen, CAR_NEEDS, cupOpen, loadProgress, medalsOn, medalTotal, Progress, recordCup, recordRun, saveProgress,
} from './progress';
import {
  bestLap, currentLap, formatDelta, formatTime, Ghost, ghostAt, held, lights, makeRace, Race, raceTime, readGhost, Recorder,
  standings, updateRace,
} from './race';
import { Sound } from './sound';
import { THEMES } from './themes';
import { keepOnTrack, makeTrack, Place, Track, TrackSpec } from './track';
import { anyTrack, TRACKS } from './tracks';
import { collide } from './traffic';

const $ = (id: string) => document.getElementById(id)!;
const canvas = $('view') as HTMLCanvasElement;
const params = new URLSearchParams(location.search);
const debug = params.has('debug');
const store = (() => { try { return window.localStorage; } catch { return null; } })();

type State = 'loading' | 'title' | 'menu' | 'play' | 'pause' | 'results';
type Mode = 'cup' | 'race' | 'trial';
/** Laps in every race. */
const LAPS = 3;
let state: State = 'loading';

const gl = canvas.getContext('webgl2', { antialias: true, alpha: false })!;
if (!gl) { $('load-text').textContent = 'Este browser não tem WebGL 2.'; throw new Error('No WebGL 2'); }
new DependencyManager().registerDependencies();
Resources.setLoader(new DefaultResourceLoader(async (uri) => uri));
Resources.for(gl);

const camera = new Camera();
camera.name = 'Chase camera';
camera.fieldOfView = CHASE.fov;
camera.nearPlane = 0.2;
camera.farPlane = 600;
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

const sound = new Sound();
const music = new Music(() => sound.context());
const controls = new Controls(() => sound.unlock());

/** A car in the race: the player (index 0) or a rival with its driver. */
interface Racer {
  name: string;
  model: CarModel;
  car: Car;
  look: CarLook;
  place: Place & { hit: number };
  race: Race;
  rival: Rival | null;
}

let track: Track;
let racers: Racer[] = [];
/** The player's car, place and race (racers[0]'s). */
let player: Racer;
let chase: ChaseState;
let trackLook: TrackLook;
let ghostLook: CarLook | null = null;
let effects: Effects;
let score: DriftScore = makeScore();
/** How long (s) the last banked chain stays on screen, and what it was. */
let pop = 0, popText = '', lastTotal = 0;
/** The best lap on this track (kept in the browser), and the lap being recorded. */
let ghost: Ghost | null = null;
const recorder = new Recorder();
/** A message in the middle of the screen for a moment (a lap time, the record). */
let flashTime = 0;
let scene: Scene, engine: Engine;
let quality = 1;
let pending = 0;
let bump = 0;
/** Whether the loaded race is the title screen's (all bots). */
let attractLoaded = false;
let progress: Progress = loadProgress(store);
/** The track lengths, for the medals. */
const lengths: Record<string, number> = Object.fromEntries(TRACKS.map((t) => [t.id, makeTrack(t).length]));

/** What is being played: the mode, the track, the car, and the championship if in one. */
const session = { mode: 'cup' as Mode, track: TRACKS[0].id, car: progress.car, cup: 0, champ: null as Championship | null, attract: true };

/** Settings kept in the browser: the drift assist, sound and music (all on by default). */
const settings = { assist: true, sound: true, music: true };
try { Object.assign(settings, JSON.parse(store?.getItem('omega-drift-settings') ?? '{}')); } catch { /* none kept */ }
function saveSettings(): void {
  try { store?.setItem('omega-drift-settings', JSON.stringify(settings)); } catch { /* private mode */ }
  document.querySelectorAll<HTMLElement>('[data-act="assist"]').forEach((b) => { b.textContent = `Ajuda ao drift: ${settings.assist ? 'ligada' : 'desligada'}`; });
  document.querySelectorAll<HTMLElement>('[data-act="sound"]').forEach((b) => { b.textContent = `Som: ${settings.sound ? 'ligado' : 'desligado'}`; });
  document.querySelectorAll<HTMLElement>('[data-act="music"]').forEach((b) => { b.textContent = `Música: ${settings.music ? 'ligada' : 'desligada'}`; });
  if (player) player.car.assist = settings.assist;
  sound.setMuted(!settings.sound);
  music.setMuted(!settings.music);
}

const ghostKey = () => `omega-drift-ghost-${track.id}`;
function loadGhost(): void {
  try { ghost = readGhost(store?.getItem(ghostKey()) ?? null); } catch { ghost = null; }
}
function saveGhost(g: Ghost): void {
  ghost = g;
  try { store?.setItem(ghostKey(), JSON.stringify(g)); } catch { /* private mode */ }
}

function flash(html: string, seconds = 2.2): void {
  const el = $('flash');
  el.innerHTML = html;
  el.hidden = false;
  flashTime = seconds;
}

/** Which screen shows; the HUD only while racing. */
function show(next: State): void {
  state = next;
  for (const id of ['title', 'menu', 'pause', 'results']) $(id).hidden = id !== next;
  document.body.classList.toggle('hide-hud', next === 'title' || next === 'menu' || next === 'loading');
  if (next === 'pause') music.duck(true);
  else music.duck(false);
  const first = document.querySelector<HTMLElement>(`#${next} .actions button:not([hidden])`);
  if (first && next !== 'play') first.focus({ preventScroll: true });
}

/** The rivals' paints, one each, so they are told apart whatever car they drive. */
const RIVAL_PAINTS = [[0.95, 0.25, 0.45], [0.2, 0.6, 1], [1, 0.75, 0.15], [0.3, 0.85, 0.4], [0.65, 0.35, 0.95], [1, 0.45, 0.15]];

/** The grid: two columns, 8 m apart a row, behind the line; the player starts last in a race. */
function gridSpot(i: number, count: number): { x: number; y: number; heading: number } {
  const n = track.samples.length;
  const slot = count - 1 - i;
  const row = Math.floor(slot / 2);
  const p = track.samples[(n - 6 - row * 8 + n) % n];
  const side = count === 1 ? 0 : slot % 2 ? -3 : 3;
  return { x: p.x + p.nx * side, y: p.y + p.ny * side, heading: Math.atan2(p.ty, p.tx) };
}

/** The rivals for this session: names, paces, cars. */
function rivalLineup(): { name: string; pace: number; model: CarModel }[] {
  if (session.mode === 'trial') return [];
  if (session.mode === 'cup') {
    const cup = CUPS[session.cup];
    const paces = rivalPaces(cup);
    return RIVALS.map((name, i) => ({ name, pace: paces[i], model: carById(cup.cars[i]) }));
  }
  // A single race: the rivals drive the player's car, from easy to quick.
  return RIVALS.map((name, i) => ({ name, pace: 0.1 + i * 0.12, model: carById(session.car) }));
}

/** Builds the track, its scenery and the cars, and puts them on the grid. */
async function loadTrack(spec: TrackSpec): Promise<void> {
  state = 'loading';
  $('loading').classList.remove('done');
  $('load-title').textContent = spec.name;
  await loaded(0.2, 'A traçar a pista…');
  track = makeTrack(spec);
  scene?.destroy();
  scene = new Scene();
  scene.name = spec.name;
  trackLook = await dressTrack(gl, scene, track);
  await loaded(0.45, 'A montar o cenário…');
  await dressWorld(gl, scene, track);
  await loaded(0.7, 'A trazer os carros…');
  effects = await dressEffects(gl, scene, track, THEMES[track.theme].smoke);
  const lineup = session.attract
    ? RIVALS.concat('Omega').map((name, i) => ({ name, pace: 0.4 + i * 0.1, model: CARS[i % CARS.length] }))
    : [{ name: 'Tu', pace: 1, model: carById(session.car) }, ...rivalLineup()];
  racers = [];
  for (const [i, who] of lineup.entries()) {
    // Each rival in its own colour (the player keeps the car's own).
    const own = i === 0 && !session.attract;
    const style = own ? who.model.style : { ...who.model.style, paint: RIVAL_PAINTS[i % RIVAL_PAINTS.length] };
    const look = await dressCar(gl, scene, style, { name: who.name });
    const spot = gridSpot(i, lineup.length);
    const car = makeCar(spot.x, spot.y, spot.heading, who.model.spec);
    racers.push({ name: who.name, model: who.model, car, look, place: keepOnTrack(track, car), race: makeRace(track.length, LAPS, 0), rival: i === 0 && !session.attract ? null : makeRival(who.pace, [0, -3, 3, -1.5, 1.5, 0][i % 6]) });
  }
  attractLoaded = session.attract;
  ghostLook = null;
  if (session.mode === 'trial' && !session.attract) {
    ghostLook = await dressCar(gl, scene, { ...carById(session.car).style, paint: [0.6, 0.9, 1], stripe: [0.9, 1, 1] }, { alpha: 0.35, name: 'Ghost' });
    ghostLook.show(false);
  }
  scene.setGlRenderingContext(gl);
  engine.loadScene(scene);
  const s = scene.renderPipeline.settings;
  s.toneMapping = ToneMapping.ACES;
  s.applyQuality(quality);
  scene.isRunning = true;
  $('track-name').textContent = spec.name;
  await loaded(1, 'Pronto');
  $('loading').classList.add('done');
  newRace();
}

/** The cars back on the grid, the lights about to come on. */
function newRace(): void {
  racers.forEach((r, i) => {
    const spot = gridSpot(i, racers.length);
    r.car = makeCar(spot.x, spot.y, spot.heading, r.model.spec);
    r.place = keepOnTrack(track, r.car);
    r.race = makeRace(track.length, LAPS, r.place.along);
    if (r.rival) r.rival.lane = r.rival.offset;
  });
  player = racers[0];
  if (!attractLoaded) player.rival = null;
  player.car.assist = settings.assist;
  chase = makeChase(player.car);
  loadGhost();
  score = makeScore();
  lastTotal = 0;
  effects.clear();
  pop = 0;
  controls.clear();
  $('flash').hidden = true;
  $('pos-chip').hidden = racers.length < 2;
  music.play(track.theme);
  last = 0;
  show(session.attract ? 'title' : 'play');
}

/** Puts the player's car back on the road at its place, stopped (the race goes on). */
function putBack(): void {
  if (state !== 'play' || held(player.race)) return;
  const p = track.samples[player.place.index];
  const c = makeCar(p.x, p.y, Math.atan2(p.ty, p.tx), player.model.spec);
  c.assist = settings.assist;
  player.car = c;
  player.place = keepOnTrack(track, c, player.place.index);
  chase = makeChase(c);
  controls.clear();
}

function step(input: CarInput): void {
  const cars = racers.map((r) => r.car);
  racers.forEach((r, i) => {
    let inp: CarInput;
    if (held(r.race)) inp = NO_INPUT;
    else if (r.rival) {
      const others = racers.filter((o) => o !== r).map((o) => ({ car: o.car, place: o.place }));
      inp = rivalDrive(r.rival, r.car, track, r.place, others);
    } else {
      // The assist's guide, so a held drift with the wheel let go follows the road.
      inp = r.car.assist ? { ...input, guide: guideCurve(r.car, track, r.place) } : input;
    }
    stepCar(r.car, inp);
    void i;
  });
  const knocks = collide(cars);
  racers.forEach((r, i) => {
    r.place = keepOnTrack(track, r.car, r.place.index);
    const hit = Math.max(r.place.hit, knocks[i]);
    if (r === player && !session.attract) {
      if (hit > 4) { bump = Math.max(bump, hit); sound.play(hit > 9 ? 'crash' : 'bump'); }
      if (r.race.phase === 'racing') scored(updateScore(score, r.car, r.place.hit, STEP));
    }
    const before = r.race.phase;
    const reds = lights(r.race).red;
    const event = updateRace(r.race, r.place.along, STEP, r === player ? ghost?.time ?? Infinity : Infinity);
    if (r !== player || session.attract) return;
    const t = raceTime(r.race);
    if (lights(r.race).red > reds) sound.play('beep');
    if (event === 'go') { recorder.begin(0); flash('<b>Vai!</b>', 1); sound.play('go'); }
    if (before === 'racing') recorder.add(t, r.car.x, r.car.y, r.car.heading);
    if (event === 'lap' || event === 'best' || event === 'finish') lapDone();
  });
  // The title screen's race starts over once everyone is round.
  if (session.attract && racers.every((r) => r.race.phase === 'done')) newRace();
}

function scored(event: ReturnType<typeof updateScore>): void {
  if (event === 'banked') { pop = 1.4; popText = `+${score.total - lastTotal}`; lastTotal = score.total; sound.play('bank'); }
  else if (event === 'lost') { pop = 1.4; popText = 'Perdido!'; sound.play('lost'); }
  else if (event === 'turbo') { flash('<b>Turbo!</b>', 1.2); sound.play('turbo'); }
  else if (event === 'link') sound.play('link');
}

/** A lap finished: its time, against the record, and a new ghost if it is the best. */
function lapDone(): void {
  const race = player.race;
  const lap = race.times[race.times.length - 1];
  const record = ghost?.time ?? Infinity;
  const delta = isFinite(record) ? ` <small>${formatDelta(lap - record)}</small>` : '';
  if (lap < record) {
    saveGhost(recorder.finish(lap));
    flash(`${isFinite(record) ? 'Recorde!' : 'Volta'} <b>${formatTime(lap)}</b>${delta}`);
    sound.play(isFinite(record) ? 'record' : 'lap');
  } else { flash(`Volta <b>${formatTime(lap)}</b>${delta}`); sound.play('lap'); }
  recorder.begin(raceTime(race));
  if (race.phase === 'done') finish();
  else if (race.times.length === race.laps - 1) setTimeout(() => { if (state === 'play') flash('<b>Última volta</b>', 1.6); }, 2300);
}

const medalDots = (m: number) => `<i class="medal m${m}"></i>`;
const MEDAL_NAMES = ['', 'bronze', 'prata', 'ouro'];

function finish(): void {
  // A bot takes the wheel for the slow-down lap.
  player.rival = makeRival(0.2, 0, false);
  const order = standings(racers.map((r) => r.race));
  const points = score.total + chainPoints(score);
  const lap = bestLap(player.race);
  const [lapMedal, ptsMedal] = recordRun(progress, track.id, track.length, lap, points);
  const main: string[] = [];
  let title = 'Chegada';
  if (racers.length > 1) {
    const place = order.indexOf(0) + 1;
    title = place === 1 ? 'Vitória!' : `${place}.º lugar`;
    main.push(`<ol class="rank">${order.map((i, k) => {
      const r = racers[i];
      const time = r.race.phase === 'done' ? formatTime(r.race.total) : '—';
      return `<li class="${i === 0 ? 'me' : ''}"><span>${k + 1}. ${r.name}</span><span>${time}</span></li>`;
    }).join('')}</ol>`);
  } else {
    main.push(`<p>Tempo total</p><div class="total">${formatTime(player.race.total)}</div>`);
  }
  main.push(`<p>Melhor volta <b>${formatTime(lap)}</b>${ghost ? ` · recorde ${formatTime(ghost.time)}` : ''}</p>`);
  // The championship.
  const next = $('results').querySelector<HTMLElement>('[data-act="next"]')!;
  const again = $('results').querySelector<HTMLElement>('[data-act="again"]')!;
  next.hidden = true;
  again.hidden = false;
  if (session.mode === 'cup' && session.champ) {
    const c = session.champ;
    addResult(c, order);
    const cup = CUPS[c.cup];
    const names = ['Tu', ...RIVALS];
    main.push(`<h3>${cup.name} · corrida ${c.race} de ${cup.races.length}</h3><ol class="rank">${table(c).map((i, k) =>
      `<li class="${i === 0 ? 'me' : ''}"><span>${k + 1}. ${names[i]}</span><span>${c.points[i]}</span></li>`).join('')}</ol>`);
    if (cupOver(c)) {
      const place = playerPlace(c);
      recordCup(progress, cup.theme, place);
      title = place === 1 ? `${cup.name} ganha!` : place <= 3 ? `${place}.º na ${cup.name}` : `${place}.º lugar na taça`;
      main.push(`<p>${place <= 3 ? (CUP_ORDER[c.cup + 1] ? `Abriste a ${CUPS[c.cup + 1].name}!` : 'Ganhaste o campeonato!') : 'Acaba no pódio para abrir a taça seguinte.'}</p>`);
      session.champ = null;
      again.hidden = true;
    } else {
      next.hidden = false;
      again.hidden = true;
    }
    sound.play(playerPlace(c) === 1 ? 'win' : 'finish');
  } else sound.play(order.indexOf(0) === 0 ? 'win' : 'finish');
  next.classList.toggle('main', !next.hidden);
  again.classList.toggle('main', next.hidden && !again.hidden);
  saveProgress(store, progress);
  $('res-title').textContent = title;
  $('res-main').innerHTML = main.join('');
  $('res-points').textContent = `${points} pontos de drift · melhor sequência ${Math.max(score.best, chainPoints(score))}`;
  const won = [lapMedal ? `Medalha de ${MEDAL_NAMES[lapMedal]} pela volta` : '', ptsMedal ? `Medalha de ${MEDAL_NAMES[ptsMedal]} pelo drift` : ''].filter(Boolean);
  $('res-medals').innerHTML = won.join(' · ');
  $('flash').hidden = true;
  show('results');
}

function update(dt: number): void {
  if (state !== 'play' && state !== 'results' && state !== 'title' && state !== 'menu') return;
  pending += dt;
  let steps = 0;
  while (pending >= STEP && steps < 24) {
    pending -= STEP;
    steps++;
    step(state === 'play' ? controls.read() : NO_INPUT);
  }
  if (steps >= 24) pending = 0;
  followCar(chase, player.car, dt);
  // Marks and smoke by how hard the rear tyres slide (smoke only near the camera).
  racers.forEach((r, i) => {
    const c = r.car;
    const slide = isDrifting(c) ? Math.min(1, 0.4 + Math.abs(driftAngle(c)) * 1.5) : c.rearLoad > 1.02 && speedOf(c) > 4 ? 0.45 : 0;
    const near = Math.hypot(c.x - player.car.x, c.y - player.car.y) < 60;
    effects.update(c, slide, dt, i, near);
  });
  effects.age(dt);
  sound.engine(player.car, isDrifting(player.car) && state !== 'menu' ? Math.min(1, Math.abs(driftAngle(player.car)) * 2) : 0, state === 'play' || state === 'results');
  pop = Math.max(0, pop - dt);
  bump = Math.max(0, bump - dt * 30);
  if (flashTime > 0) { flashTime -= dt; if (flashTime <= 0) $('flash').hidden = true; }
}

function hud(): void {
  const car = player.car, race = player.race;
  const kmh = Math.round(speedOf(car) * 3.6);
  $('speed').textContent = String(kmh);
  $('gear').textContent = car.reversing ? 'R' : forwardSpeed(car) < 0.5 && kmh < 2 ? 'N' : 'D';
  const angle = Math.abs(driftAngle(car)) * 180 / Math.PI;
  const meter = $('drift');
  const chain = score.chain > 0;
  meter.hidden = !chain && pop <= 0;
  if (chain) {
    $('drift-mult').textContent = score.mult > 1 ? `×${score.mult}` : '';
    $('drift-points').textContent = String(chainPoints(score));
    $('drift-angle').textContent = score.sliding ? `${Math.round(angle)}°` : '';
  } else if (pop > 0) {
    $('drift-mult').textContent = '';
    $('drift-points').textContent = popText;
    $('drift-angle').textContent = '';
  }
  $('points').textContent = String(score.total);
  ($('turbo-fill') as HTMLElement).style.width = `${Math.round((car.boost > 0 ? 1 : score.charge) * 100)}%`;
  $('turbo').classList.toggle('on', car.boost > 0);
  $('turbo').classList.toggle('full', score.charge >= 1);
  $('needle').style.transform = `rotate(${-120 + 240 * Math.min(1, speedOf(car) / car.spec.top)}deg)`;
  $('lap').textContent = `${currentLap(race)}/${race.laps}`;
  $('time').textContent = formatTime(raceTime(race) - race.lapStart);
  $('best').textContent = formatTime(Math.min(bestLap(race), ghost?.time ?? Infinity));
  if (racers.length > 1) $('pos').textContent = `${standings(racers.map((r) => r.race)).indexOf(0) + 1}/${racers.length}`;
  const l = lights(race);
  const box = $('lights');
  box.hidden = !(race.phase === 'lights' || l.green);
  box.querySelectorAll('i').forEach((el, i) => { el.className = l.green ? 'green' : i < l.red ? 'red' : ''; });
}

/** The ghost of the best lap, where it was this far into its lap. */
function drawGhost(): void {
  if (!ghostLook) return;
  const race = player.race;
  const at = ghost && race.phase === 'racing' && state === 'play' ? ghostAt(ghost, raceTime(race) - race.lapStart) : null;
  ghostLook.show(!!at);
  if (at) ghostLook.update({ ...player.car, x: at.x, y: at.y, heading: at.heading, vx: 0, vy: 0, spin: 0, wheel: 0 }, 0);
}

function draw(dt: number): void {
  for (const r of racers) r.look.update(r.car, dt);
  drawGhost();
  const car = player.car;
  trackLook.update(car.x, car.y);
  camera.fieldOfView = chase.fov;
  camera.updateProjectionMatrix();
  const lookX = car.x + Math.cos(chase.dir) * CHASE.ahead, lookY = car.y + Math.sin(chase.dir) * CHASE.ahead;
  const shake = bump > 0 ? (Math.random() - 0.5) * bump * 0.01 : 0;
  camera.transform.setLocalPosition(chase.x, CHASE.up + shake, -chase.y);
  camera.transform.lookAt(vec3.fromValues(lookX, 0.8, -lookY));
  if (state === 'play' || state === 'pause' || state === 'results') hud();
}

let last = 0, fpsTime = 0, fpsFrames = 0, slow = 0;
function frame(now: number): void {
  const dt = last ? Math.min((now - last) / 1000, 0.1) : 0;
  last = now;
  resize();
  if (controls.pollStart()) state === 'play' ? pause() : state === 'pause' ? resume() : null;
  padMenus();
  if (state !== 'loading' && racers.length) {
    update(dt);
    draw(dt);
  }
  engine.update(state === 'pause' ? 0 : dt);
  engine.render();
  fpsFrames++; fpsTime += dt;
  if (fpsTime >= 0.5) {
    const fps = fpsFrames / fpsTime;
    if (debug && player) $('stats').textContent = `${Math.round(fps)} fps · ${renderScale.toFixed(2)}× · ${(Math.abs(driftAngle(player.car)) * 57.3).toFixed(0)}° · ${player.car.rearLoad.toFixed(2)}`;
    slow = (state === 'play' || state === 'title') && fps < 45 ? slow + 1 : 0;
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
  show('pause');
  controls.clear();
  sound.play('click');
}

function resume(): void {
  if (state !== 'pause') return;
  show('play');
  last = 0;
}

// The menu.

const MODE_ABOUT: Record<Mode, string> = {
  cup: 'Três taças, uma em cada sítio, de três corridas contra cinco rivais. Acaba no pódio para abrir a seguinte.',
  race: 'Uma corrida de três voltas contra cinco rivais com o teu carro.',
  trial: 'Três voltas sozinho contra o fantasma da tua melhor volta.',
};

function renderMenu(): void {
  document.querySelectorAll<HTMLElement>('#menu .tabs button').forEach((b) => b.classList.toggle('on', b.dataset.mode === session.mode));
  $('mode-about').textContent = MODE_ABOUT[session.mode];
  const picks = $('picks');
  if (session.mode === 'cup') {
    $('pick-title').textContent = 'Taça';
    picks.innerHTML = CUPS.map((c, i) => {
      const open = cupOpen(progress, CUP_ORDER, i);
      const best = progress.cups[c.theme];
      const note = !open ? 'Fecha: pódio na anterior' : best ? `Melhor: ${best}.º` : THEMES[c.theme].label;
      return `<button data-cup="${i}" class="${session.cup === i ? 'on' : ''}" ${open ? '' : 'disabled'}><b>${c.name}</b><small>${note}</small></button>`;
    }).join('');
  } else {
    $('pick-title').textContent = 'Pista';
    picks.innerHTML = TRACKS.map((t) => {
      const [a, b] = medalsOn(progress, t.id, lengths[t.id]);
      const rec = progress.tracks[t.id]?.lap;
      return `<button data-track="${t.id}" class="${session.track === t.id ? 'on' : ''}"><b>${t.name}</b><small>${THEMES[t.theme].label}${rec ? ` · ${formatTime(rec)}` : ''}</small><br><small>volta ${medalDots(a)} drift ${medalDots(b)}</small></button>`;
    }).join('');
  }
  const total = medalTotal(progress, lengths);
  $('medal-total').textContent = `· medalhas: ${total} de 36`;
  $('cars').innerHTML = CARS.map((c, i) => {
    const open = carOpen(total, i);
    const rgb = c.style.paint.map((v) => Math.round(v * 255)).join(',');
    return `<button data-car="${c.id}" class="${session.car === c.id ? 'on' : ''}" ${open ? '' : 'disabled'}><b><i class="swatch" style="background:rgb(${rgb})"></i>${c.name}</b><small>${open ? c.about : `Abre com ${CAR_NEEDS[i]} medalhas`}</small></button>`;
  }).join('');
}

function openMenu(): void {
  session.attract = true;
  // A race left behind the menu drives on by itself.
  if (player && !player.rival) player.rival = makeRival(0.5, 0);
  renderMenu();
  show('menu');
}

async function startSession(): Promise<void> {
  session.attract = false;
  progress.car = session.car;
  saveProgress(store, progress);
  if (session.mode === 'cup') {
    session.champ = makeChampionship(session.cup);
    await loadTrack(anyTrack(CUPS[session.cup].races[0]));
  } else await loadTrack(anyTrack(session.track));
  if (sound.context() && settings.sound) sound.play('click');
  hint();
}

async function nextCupRace(): Promise<void> {
  const c = session.champ;
  if (!c) return;
  await loadTrack(anyTrack(CUPS[c.cup].races[c.race]));
}

/** Back to the title screen, with its race of bots. */
async function toTitle(): Promise<void> {
  session.attract = true;
  session.champ = null;
  if (attractLoaded) { show('title'); return; }
  await loadTrack(anyTrack(session.mode === 'cup' ? CUPS[session.cup].races[0] : session.track));
}

let hinted = false;
const touchOn = params.has('touch') || matchMedia('(pointer: coarse)').matches;
/** The touch hint, for the first race. */
function hint(): void {
  if (!touchOn || hinted) return;
  hinted = true;
  const h = $('hint');
  h.hidden = false;
  h.classList.remove('gone');
  setTimeout(() => h.classList.add('gone'), 7000);
}

/** The gamepad in the menus: the cross or the stick moves between buttons, A presses, B goes back. */
let padBefore = { move: 0, a: false, b: false };
function padMenus(): void {
  if (state === 'play' || state === 'loading') return;
  const pads = navigator.getGamepads ? navigator.getGamepads() : [];
  const p = [...pads].find((g) => g && g.connected);
  if (!p) return;
  const axisX = p.axes[0] ?? 0, axisY = p.axes[1] ?? 0;
  const move = p.buttons[13]?.pressed || p.buttons[15]?.pressed || axisY > 0.6 || axisX > 0.6 ? 1 : p.buttons[12]?.pressed || p.buttons[14]?.pressed || axisY < -0.6 || axisX < -0.6 ? -1 : 0;
  const a = !!p.buttons[0]?.pressed, b = !!p.buttons[1]?.pressed;
  if (move && move !== padBefore.move) {
    const list = Array.from(document.querySelectorAll<HTMLButtonElement>(`#${state} button:not([hidden]):not(:disabled)`));
    const at = list.indexOf(document.activeElement as HTMLButtonElement);
    list[(at + move + list.length) % list.length]?.focus();
    sound.unlock();
  }
  if (a && !padBefore.a) (document.activeElement as HTMLElement)?.click?.();
  if (b && !padBefore.b) {
    if (state === 'menu') void toTitle();
    else if (state === 'pause') resume();
  }
  padBefore = { move, a, b };
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

  $('touch').hidden = !touchOn;
  if (touchOn) {
    controls.autoGas = true;
    $('keys').textContent = 'O carro acelera sozinho · arrasta à esquerda para virar · numa curva, segura DRIFT: o carro derrapa e segue a estrada sozinho (vira para dentro para apertar); larga para endireitar · TRAVÃO trava e faz marcha-atrás · cada drift dá pontos e enche o turbo';
  }
  controls.bindTouch($('wheel-area'), $('knob'), $('btn-brake'), $('btn-hand'));
  $('stats').hidden = !debug;
  saveSettings();
  $('pause-button').addEventListener('click', () => pause());
  $('reset-button').addEventListener('click', () => putBack());
  document.addEventListener('click', (e) => {
    const b = (e.target as HTMLElement).closest('button');
    if (!b) return;
    sound.unlock();
    const act = b.dataset.act;
    if (act === 'play') { sound.play('click'); openMenu(); }
    else if (act === 'title') { sound.play('click'); void toTitle(); }
    else if (act === 'start') void startSession();
    else if (act === 'resume') resume();
    else if (act === 'restart') newRace();
    else if (act === 'again') newRace();
    else if (act === 'next') void nextCupRace();
    else if (act === 'menu') { session.champ = null; sound.play('click'); openMenu(); }
    else if (act === 'assist') { settings.assist = !settings.assist; saveSettings(); }
    else if (act === 'sound') { settings.sound = !settings.sound; saveSettings(); sound.play('click'); }
    else if (act === 'music') { settings.music = !settings.music; saveSettings(); if (settings.music && track) music.play(track.theme); }
    else if (b.dataset.mode) { session.mode = b.dataset.mode as Mode; sound.play('click'); renderMenu(); }
    else if (b.dataset.cup) { session.cup = Number(b.dataset.cup); sound.play('click'); renderMenu(); }
    else if (b.dataset.track) { session.track = b.dataset.track; sound.play('click'); renderMenu(); }
    else if (b.dataset.car) { session.car = b.dataset.car; sound.play('click'); renderMenu(); }
  });
  window.addEventListener('keydown', (e) => {
    sound.unlock();
    if (state === 'play' && (e.code === 'Escape' || e.code === 'KeyP')) pause();
    else if (state === 'pause' && (e.code === 'Escape' || e.code === 'KeyP')) resume();
    else if (state === 'play' && e.code === 'KeyR') putBack();
    else if (state === 'menu' && e.code === 'Escape') void toTitle();
  });
  document.addEventListener('visibilitychange', () => { if (document.hidden) pause(); });
  // The first touch or click anywhere starts the sound.
  window.addEventListener('pointerdown', () => sound.unlock(), { once: true });

  (window as any).drift = {
    get state() { return state; }, get car() { return player?.car; }, get track() { return track; }, get place() { return player?.place; },
    get race() { return player?.race; }, get racers() { return racers; }, get ghost() { return ghost; }, get score() { return score; },
    get progress() { return progress; }, session, controls, newRace, pause, resume, putBack, openMenu, startSession,
    get renderScale() { return renderScale; },
    set autoplay(on: boolean) { if (player) player.rival = on ? makeRival(0.9, 0) : null; if (!on) controls.override = null; },
    hold(input: Partial<CarInput> | null) { controls.override = input ? { ...NO_INPUT, ...input } : null; },
    /** Starts a session straight away (tests): mode, track or cup, car. */
    async play(mode: Mode, what: string | number, car = 'bolinha') {
      session.mode = mode; session.car = car;
      if (mode === 'cup') session.cup = Number(what); else session.track = String(what);
      await startSession();
    },
  };
  requestAnimationFrame(frame);
  const quick = params.get('track');
  if (quick) { session.mode = params.get('mode') === 'trial' ? 'trial' : 'race'; session.track = anyTrack(quick).id; await startSession(); }
  else await loadTrack(TRACKS[0]);
  if (params.has('auto') && player && !session.attract) player.rival = makeRival(0.9, 0);
}

start().catch((err) => {
  $('load-text').textContent = `Erro: ${err?.message ?? err}`;
  console.error(err);
});
