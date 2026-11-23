// Keyboard and touch buttons, turned into one input state the fixed steps read.
// A jump press is kept until a step uses it, so a tap shorter than a frame
// still counts.
import { HeroInput } from './hero';

const KEYS: Record<string, 'left' | 'right' | 'jump' | 'run'> = {
  ArrowLeft: 'left', KeyA: 'left',
  ArrowRight: 'right', KeyD: 'right',
  Space: 'jump', ArrowUp: 'jump', KeyW: 'jump', KeyK: 'jump',
  ShiftLeft: 'run', ShiftRight: 'run', KeyJ: 'run',
};

export class Controls {
  private keys = new Set<string>();
  /** Held by touch, per pointer. */
  private touch = new Map<number, 'left' | 'right' | 'jump' | 'run' | null>();
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
   */
  bindTouch(pad: HTMLElement, jump: HTMLElement, run: HTMLElement): void {
    const padSide = (e: PointerEvent) => {
      const r = pad.getBoundingClientRect();
      return e.clientX < r.left + r.width / 2 ? 'left' : 'right';
    };
    const press = (el: HTMLElement, what: (e: PointerEvent) => 'left' | 'right' | 'jump' | 'run') => {
      el.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        el.setPointerCapture(e.pointerId);
        this.onAnyInput();
        const w = what(e);
        if (w === 'jump' && !this.held('jump')) this.pressed = true;
        this.touch.set(e.pointerId, w);
        el.classList.add('down');
      });
      el.addEventListener('pointermove', (e) => {
        if (!this.touch.has(e.pointerId)) return;
        this.touch.set(e.pointerId, what(e));
        if (el === pad) pad.dataset.side = what(e);
      });
      const up = (e: PointerEvent) => {
        this.touch.delete(e.pointerId);
        el.classList.remove('down');
        if (el === pad) delete pad.dataset.side;
      };
      el.addEventListener('pointerup', up);
      el.addEventListener('pointercancel', up);
    };
    press(pad, (e) => { const s = padSide(e); pad.dataset.side = s; return s; });
    press(jump, () => 'jump');
    press(run, () => 'run');
  }

  private held(what: 'left' | 'right' | 'jump' | 'run'): boolean {
    for (const k of this.keys) if (KEYS[k] === what) return true;
    for (const t of this.touch.values()) if (t === what) return true;
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
