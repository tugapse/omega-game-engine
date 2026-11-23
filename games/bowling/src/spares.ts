// The spare challenge, with no engine: ten hard leaves to clear with one ball
// each, from a lone centre pin to the 7-10 split. Clearing a leave scores its
// stars × 10; missing it scores the pins knocked down.

export interface Leave {
  /** Pins standing, numbered 1–10 as on the scoreboard. */
  pins: number[];
  /** What bowlers call it. */
  name: string;
  /** Difficulty, 1–5. */
  stars: number;
}

export const LEAVES: Leave[] = [
  { pins: [5], name: 'o pino 5', stars: 1 },
  { pins: [1, 2, 4, 7], name: 'a fila da esquerda', stars: 1 },
  { pins: [1, 3, 6, 10], name: 'a fila da direita', stars: 1 },
  { pins: [2, 4, 5, 8], name: 'o balde da esquerda', stars: 2 },
  { pins: [3, 5, 6, 9], name: 'o balde da direita', stars: 2 },
  { pins: [2, 7], name: 'o 2-7', stars: 3 },
  { pins: [3, 10], name: 'o 3-10', stars: 3 },
  { pins: [10], name: 'o pino 10', stars: 3 },
  { pins: [7], name: 'o pino 7', stars: 3 },
  { pins: [7, 10], name: 'o 7-10', stars: 5 },
];

/** Points for a try: the stars × 10 when cleared, else the pins knocked down. */
export function leavePoints(leave: Leave, pins: number): number {
  return pins >= leave.pins.length ? leave.stars * 10 : pins;
}

export class SparesGame {
  private readonly tries: number[] = [];

  get rolls(): readonly number[] {
    return this.tries;
  }

  /** The leave being played, or null when the challenge is over. */
  get leave(): Leave | null {
    return LEAVES[this.tries.length] ?? null;
  }

  get next() {
    const leave = this.leave;
    if (!leave) return null;
    return { frame: this.tries.length, roll: 0, freshRack: false, pinsLeft: leave.pins.length, rack: leave.pins.map((p) => p - 1) };
  }

  get isOver(): boolean {
    return this.tries.length >= LEAVES.length;
  }

  /** How many leaves were cleared. */
  get cleared(): number {
    return this.tries.filter((pins, i) => pins >= LEAVES[i].pins.length).length;
  }

  roll(pins: number): void {
    const leave = this.leave;
    if (!leave) return;
    this.tries.push(Math.max(0, Math.min(leave.pins.length, Math.round(pins))));
  }

  get score(): number {
    return this.tries.reduce((s, pins, i) => s + leavePoints(LEAVES[i], pins), 0);
  }

  /** One box per leave: "/" when cleared, else the pins knocked down; the running total under it. */
  frames() {
    let total = 0;
    return LEAVES.map((leave, i) => {
      const pins = this.tries[i];
      if (pins === undefined) return { marks: i === 9 ? ['', '', ''] : ['', ''], total: null };
      total += leavePoints(leave, pins);
      const mark = pins >= leave.pins.length ? '/' : pins === 0 ? '-' : String(pins);
      return { marks: i === 9 ? ['', mark, ''] : ['', mark], total };
    });
  }
}
