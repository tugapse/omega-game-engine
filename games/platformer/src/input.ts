// Keyboard and touch buttons, turned into one input state the fixed steps read.
// A jump press is kept until a step uses it, so a tap shorter than a frame
// still counts.
import { HeroInput } from './hero';

type Action = 'left' | 'right' | 'jump' | 'run';

const KEYS: Record<string, Action> = {
  ArrowLeft: 'left', KeyA: 'left',
  ArrowRight: 'right', KeyD: 'right',
  Space: 'jump', ArrowUp: 'jump', KeyW: 'jump', KeyK: 'jump',
  ShiftLeft: 'run', ShiftRight: 'run', KeyJ: 'run',
};

/** What a gamepad gives this frame: the moves, and presses (edges) for menus. */
export interface PadState {
  left: boolean; right: boolean; up: boolean; down: boolean; jump: boolean; run: boolean; start: boolean;
}
const NO_PAD: PadState = { left: false, right: false, up: false, down: false, jump: false, run: false, start: false };

/**
 * The first connected gamepad, in the standard layout: the left stick or the
 * cross to move, A (bottom) to jump, B or X to run, Start to pause.
 */
export function readPad(pads: (Gamepad | null)[] | null | undefined): PadState {
  const p = pads ? [...pads].find((g) => g && g.connected) : null;
  if (!p) return NO_PAD;
  const b = (i: number) => !!p.buttons[i]?.pressed;
  const x = p.axes[0] ?? 0, y = p.axes[1] ?? 0;
  return {
    left: x < -0.45 || b(14), right: x > 0.45 || b(15), up: y < -0.6 || b(12), down: y > 0.6 || b(13),
    jump: b(0), run: b(1) || b(2), start: b(9),
  };
}

export class Controls {
  private keys = new Set<string>();
  /** The gamepad now and on the last poll (for presses). */
  pad: PadState = NO_PAD;
  private padBefore: PadState = NO_PAD;
  /** Held by touch, per pointer. */
  private touch = new Map<number, Action[]>();
  private pressed = false;
  /** Set from outside (tests, the title screen) to override everything. */
  override: HeroInput | null = null;

  constructor(private onAnyInput: () => void = () => {}) {
    window.addEventListener('keydown', (e) => {
      const what = KEYS[e.code];
      if (!what) return;
      e.preventDefault();
      this.onAnyInput();
      if (what === 'jump' && !e.repeat && !this.held('jump')) this.pressed = true;
      this.keys.add(e.code);
    });
    window.addEventListener('keyup', (e) => this.keys.delete(e.code));
    window.addEventListener('blur', () => { this.keys.clear(); this.touch.clear(); });
  }

  /**
   * Binds the touch pad (left and right halves) and the A (jump) and B (run)
   * buttons. The pad follows the finger, so sliding across changes direction.
   * A and B work as one area: a thumb that rolls from B onto A jumps at once
   * without being lifted, and keeps running until it is lifted.
   */
  bindTouch(pad: HTMLElement, jump: HTMLElement, run: HTMLElement): void {
    const padSide = (e: PointerEvent): Action => {
      const r = pad.getBoundingClientRect();
      return e.clientX < r.left + r.width / 2 ? 'left' : 'right';
    };
    pad.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      pad.setPointerCapture(e.pointerId);
      this.onAnyInput();
      const s = padSide(e);
      pad.dataset.side = s;
      this.touch.set(e.pointerId, [s]);
    });
    pad.addEventListener('pointermove', (e) => {
      if (!this.touch.has(e.pointerId)) return;
      const s = padSide(e);
      pad.dataset.side = s;
      this.touch.set(e.pointerId, [s]);
    });
    const padUp = (e: PointerEvent) => { this.touch.delete(e.pointerId); delete pad.dataset.side; };
    pad.addEventListener('pointerup', padUp);
    pad.addEventListener('pointercancel', padUp);

    // The buttons: which one is under the finger (a little slack around each, so a roll finds the next).
    const SLACK = 10;
    const over = (e: PointerEvent): Action | null => {
      for (const [el, what] of [[jump, 'jump'], [run, 'run']] as const) {
        const r = el.getBoundingClientRect();
        if (e.clientX >= r.left - SLACK && e.clientX <= r.right + SLACK && e.clientY >= r.top - SLACK && e.clientY <= r.bottom + SLACK) return what;
      }
      return null;
    };
    const fromB = new Map<number, boolean>();
    const update = (e: PointerEvent) => {
      const at = over(e);
      const before = this.touch.get(e.pointerId) ?? [];
      const now: Action[] = [];
      if (at === 'run' || fromB.get(e.pointerId)) now.push('run');
      if (at === 'jump') {
        if (!before.includes('jump') && !this.held('jump')) this.pressed = true;
        now.push('jump');
      }
      this.touch.set(e.pointerId, now);
      this.showButtons(jump, run);
    };
    for (const el of [jump, run]) {
      el.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        el.setPointerCapture(e.pointerId);
        this.onAnyInput();
        fromB.set(e.pointerId, el === run);
        update(e);
      });
      el.addEventListener('pointermove', (e) => { if (this.touch.has(e.pointerId)) update(e); });
      const up = (e: PointerEvent) => {
        this.touch.delete(e.pointerId);
        fromB.delete(e.pointerId);
        this.showButtons(jump, run);
      };
      el.addEventListener('pointerup', up);
      el.addEventListener('pointercancel', up);
    }
  }

  /** Lights the buttons some finger is on. */
  private showButtons(jump: HTMLElement, run: HTMLElement): void {
    jump.classList.toggle('down', this.held('jump'));
    run.classList.toggle('down', this.held('run'));
  }

  /** Reads the gamepad (once a frame); returns which of its buttons went down since the last poll. */
  pollPad(): Partial<Record<keyof PadState, boolean>> {
    this.padBefore = this.pad;
    this.pad = readPad(typeof navigator !== 'undefined' && navigator.getGamepads ? navigator.getGamepads() : null);
    const pressed: Partial<Record<keyof PadState, boolean>> = {};
    for (const k of Object.keys(this.pad) as (keyof PadState)[]) if (this.pad[k] && !this.padBefore[k]) pressed[k] = true;
    if (pressed.jump) this.pressed = true;
    if (Object.keys(pressed).length) this.onAnyInput();
    return pressed;
  }

  private held(what: Action): boolean {
    if (this.pad[what]) return true;
    for (const k of this.keys) if (KEYS[k] === what) return true;
    for (const t of this.touch.values()) if (t.includes(what)) return true;
    return false;
  }

  /** The input for the next step; a jump press is used up by it. */
  read(): HeroInput {
    if (this.override) {
      const o = { ...this.override };
      this.override.jumpPressed = false;
      return o;
    }
    const input: HeroInput = {
      left: this.held('left'), right: this.held('right'), jump: this.held('jump') || this.pressed,
      jumpPressed: this.pressed, run: this.held('run'),
    };
    this.pressed = false;
    return input;
  }

  /** Forgets everything held (after a pause or a restart). */
  clear(): void {
    this.keys.clear();
    this.touch.clear();
    this.pressed = false;
  }
}
