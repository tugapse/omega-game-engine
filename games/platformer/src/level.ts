// Levels described as text, one character per tile (1 tile = 1 m), and the
// grid they turn into. No engine, so it is tested in Node.
//
// Text rows run top to bottom; the grid's row 0 is the bottom one, so y goes up.

/** What a tile is. */
/** power: a bonus block with a battery inside (a thruster once Bit is big); star: one with a star. */
export type Tile = 'empty' | 'ground' | 'block' | 'brick' | 'bonus' | 'power' | 'star' | 'used' | 'spikes';

/** The characters of a level's text. */
export const LEGEND: Record<string, Tile> = {
  '.': 'empty',
  ' ': 'empty',
  '#': 'ground',
  'X': 'block',
  'B': 'brick',
  '?': 'bonus',
  '!': 'power',
  '*': 'star',
  '^': 'spikes',
};

/** Markers: where things start; they leave an empty tile behind. */
export const MARKERS = { start: 'S', goal: 'F' } as const;

/** Things placed in the level: coins, big coins, enemies and the checkpoint (each leaves an empty tile). */
export type ThingKind = 'coin' | 'big' | 'walker' | 'shell' | 'flyer' | 'checkpoint';
export const THINGS: Record<string, ThingKind> = { o: 'coin', $: 'big', g: 'walker', k: 'shell', v: 'flyer', C: 'checkpoint' };
export interface Thing { kind: ThingKind; x: number; y: number }

/**
 * Platforms Bit can stand on and jump up through. A run of '=' is a platform;
 * '-' next to it on its row is the track it slides along, '|' above or below
 * it the track it rides up and down (no track: it stays put). A run of '~' is
 * a platform that falls a moment after Bit lands on it. Tracks and platforms
 * leave empty tiles.
 */
export const PLATFORM = { move: '=', fall: '~', trackX: '-', trackY: '|' } as const;

export interface PlatformSpec {
  kind: 'move' | 'fall';
  /** Left end and row (its top is at y + 1), and its width in tiles. */
  x: number;
  y: number;
  w: number;
  /** Where its left end slides between (x), or its row rides between (y). */
  track: { axis: 'x' | 'y'; from: number; to: number } | null;
}

/** The look of a world. */
export type Theme = 'meadow' | 'caves' | 'clouds';

export interface LevelSpec {
  name: string;
  /** Rows of text, top first, all the same length (shorter rows are padded with empty tiles). */
  rows: string[];
  theme?: Theme;
}

export interface Level {
  name: string;
  width: number;
  height: number;
  /** Tiles by column then row: tiles[x][y], y = 0 at the bottom. */
  tiles: Tile[][];
  /** Where the hero starts: the middle of the start tile's bottom. */
  start: { x: number; y: number };
  /** The goal's column (the flag pole) and the row of its base. */
  goal: { x: number; y: number };
  /** Coins, enemies and checkpoints, at the middle of their tile's bottom. */
  things: Thing[];
  platforms: PlatformSpec[];
  theme: Theme;
}

const SOLID: Record<Tile, boolean> = { empty: false, ground: true, block: true, brick: true, bonus: true, power: true, star: true, used: true, spikes: false };

export function isSolid(t: Tile): boolean {
  return SOLID[t];
}

/** Builds a level from its text. Throws on an unknown character or a missing start or goal. */
export function parseLevel(spec: LevelSpec): Level {
  const height = spec.rows.length;
  const width = Math.max(...spec.rows.map((r) => r.length));
  const tiles: Tile[][] = Array.from({ length: width }, () => Array<Tile>(height).fill('empty'));
  let start: { x: number; y: number } | null = null;
  let goal: { x: number; y: number } | null = null;
  const things: Thing[] = [];
  const platforms: PlatformSpec[] = [];
  const at = (x: number, r: number) => spec.rows[r]?.[x] ?? '.';
  spec.rows.forEach((row, r) => {
    const y = height - 1 - r;
    for (let x = 0; x < row.length; x++) {
      const ch = row[x];
      if (ch === PLATFORM.trackX || ch === PLATFORM.trackY) continue;
      if (ch === PLATFORM.move || ch === PLATFORM.fall) {
        // The whole run, once, from its left end.
        if (at(x - 1, r) === ch) continue;
        let w = 1;
        while (at(x + w, r) === ch) w++;
        let track: PlatformSpec['track'] = null;
        if (ch === PLATFORM.move) {
          let left = x, right = x + w;
          while (at(left - 1, r) === PLATFORM.trackX) left--;
          while (at(right, r) === PLATFORM.trackX) right++;
          if (left < x || right > x + w) track = { axis: 'x', from: left, to: right - w };
          else {
            let top = r, bottom = r;
            for (let c = x; c < x + w; c++) {
              let t = r, b = r;
              while (at(c, t - 1) === PLATFORM.trackY) t--;
              while (at(c, b + 1) === PLATFORM.trackY) b++;
              top = Math.min(top, t); bottom = Math.max(bottom, b);
            }
            if (top < r || bottom > r) track = { axis: 'y', from: height - 1 - bottom, to: height - 1 - top };
          }
        }
        platforms.push({ kind: ch === PLATFORM.move ? 'move' : 'fall', x, y, w, track });
        continue;
      }
      if (ch === MARKERS.start) { start = { x: x + 0.5, y }; continue; }
      if (ch === MARKERS.goal) { goal = { x: x + 0.5, y }; continue; }
      if (THINGS[ch]) { things.push({ kind: THINGS[ch], x: x + 0.5, y }); continue; }
      const t = LEGEND[ch];
      if (!t) throw new Error(`${spec.name}: unknown tile '${ch}' at row ${r}, column ${x}`);
      tiles[x][y] = t;
    }
  });
  if (!start) throw new Error(`${spec.name}: no start (${MARKERS.start})`);
  if (!goal) throw new Error(`${spec.name}: no goal (${MARKERS.goal})`);
  return { name: spec.name, width, height, tiles, start, goal, things, platforms, theme: spec.theme ?? 'meadow' };
}

/** The tile at a column and row; outside the level it is empty, except the wall left of column 0. */
export function tileAt(level: Level, x: number, y: number): Tile {
  if (x < 0) return 'block';
  if (x >= level.width || y < 0 || y >= level.height) return 'empty';
  return level.tiles[x][y];
}

/** Whether the tile at a column and row is solid. */
export function solidAt(level: Level, x: number, y: number): boolean {
  return isSolid(tileAt(level, x, y));
}
