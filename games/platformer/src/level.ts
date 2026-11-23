// Levels described as text, one character per tile (1 tile = 1 m), and the
// grid they turn into. No engine, so it is tested in Node.
//
// Text rows run top to bottom; the grid's row 0 is the bottom one, so y goes up.

/** What a tile is. */
export type Tile = 'empty' | 'ground' | 'block' | 'brick' | 'bonus' | 'used' | 'spikes';

/** The characters of a level's text. */
export const LEGEND: Record<string, Tile> = {
  '.': 'empty',
  ' ': 'empty',
  '#': 'ground',
  'X': 'block',
  'B': 'brick',
  '?': 'bonus',
  '^': 'spikes',
};

/** Markers: where things start; they leave an empty tile behind. */
export const MARKERS = { start: 'S', goal: 'F' } as const;

/** Things placed in the level: coins, enemies and the checkpoint (each leaves an empty tile). */
export type ThingKind = 'coin' | 'walker' | 'shell' | 'flyer' | 'checkpoint';
export const THINGS: Record<string, ThingKind> = { o: 'coin', g: 'walker', k: 'shell', v: 'flyer', C: 'checkpoint' };
export interface Thing { kind: ThingKind; x: number; y: number }

export interface LevelSpec {
  name: string;
  /** Rows of text, top first, all the same length (shorter rows are padded with empty tiles). */
  rows: string[];
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
}

const SOLID: Record<Tile, boolean> = { empty: false, ground: true, block: true, brick: true, bonus: true, used: true, spikes: false };

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
  spec.rows.forEach((row, r) => {
    const y = height - 1 - r;
    for (let x = 0; x < row.length; x++) {
      const ch = row[x];
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
  return { name: spec.name, width, height, tiles, start, goal, things };
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
