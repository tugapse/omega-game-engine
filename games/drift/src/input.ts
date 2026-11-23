// Keyboard, gamepad and touch, turned into one car input the fixed steps read.
//   Keyboard: ↑/W accelerate, ↓/S brake (and reverse), ←→/A D steer, space the handbrake.
//   Gamepad (standard layout): left stick or cross to steer, RT or A to
//     accelerate, LT or X to brake, B or RB the handbrake.
//   Touch: the car accelerates by itself; a steering area on the left (drag
//     sideways from where the finger lands; drag down to brake) and, on the
//     right, a big DRIFT button (the handbrake: hold it and turn) and the brake.
import { CarInput } from './car';

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

type Key = 'gas' | 'brake' | 'left' | 'right' | 'hand';
const KEYS: Record<string, Key> = {
  ArrowUp: 'gas', KeyW: 'gas',
  ArrowDown: 'brake', KeyS: 'brake',
  ArrowLeft: 'left', KeyA: 'left',
  ArrowRight: 'right', KeyD: 'right',
  Space: 'hand', ShiftLeft: 'hand', ShiftRight: 'hand',
};

/** How far (px) a finger drags sideways for full lock, and down for full brake. */
export const TOUCH = { lock: 70, brake: 60, brakeFrom: 25 };

/** The first connected gamepad as a car input (null with none, or none touched). */
export function readPad(pads: (Gamepad | null)[] | null | undefined): CarInput | null {
  const p = pads ? [...pads].find((g) => g && g.connected) : null;
  if (!p) return null;
  const b = (i: number) => p.buttons[i]?.value ?? 0;
  const stick = p.axes[0] ?? 0;
  const steer = Math.abs(stick) > 0.12 ? stick : b(15) - b(14);
  const throttle = Math.max(b(7), b(0));
  const brake = Math.max(b(6), b(2));
  const handbrake = b(1) > 0.5 || b(5) > 0.5;
  if (!steer && !throttle && !brake && !handbrake) return null;
  return { throttle, brake, steer: clamp(steer, -1, 1), handbrake };
}

/** Touch steering from a drag: sideways from where the finger landed, and down for the brake. */
export function touchSteer(dx: number, dy: number): { steer: number; brake: number } {
  return {
    steer: clamp(dx / TOUCH.lock, -1, 1),
    brake: clamp((dy - TOUCH.brakeFrom) / TOUCH.brake, 0, 1),
  };
}

export class Controls {
  private keys = new Set<Key>();
  private wheel: { id: number; x: number; y: number; steer: number; brake: number } | null = null;
  private brakes = new Set<number>();
  private hand = new Set<number>();
  /** Touch play: the car accelerates unless braking (set when the touch controls are on). */
  autoGas = false;
  /** Set from outside (the bot, tests) to override everything. */
  override: CarInput | null = null;
  private startBefore = false;

  constructor(private onAnyInput: () => void = () => {}) {
    window.addEventListener('keydown', (e) => {
      const k = KEYS[e.code];
      if (!k) return;
      e.preventDefault();
      this.onAnyInput();
      this.keys.add(k);
    });
    window.addEventListener('keyup', (e) => { const k = KEYS[e.code]; if (k) this.keys.delete(k); });
    window.addEventListener('blur', () => this.clear());
  }

  /** Binds the steering area, the brake and the drift button (handbrake); `knob` shows where the wheel is turned. */
  bindTouch(area: HTMLElement, knob: HTMLElement, brake: HTMLElement, hand: HTMLElement): void {
    area.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      if (this.wheel) return;
      area.setPointerCapture(e.pointerId);
      this.onAnyInput();
      this.wheel = { id: e.pointerId, x: e.clientX, y: e.clientY, steer: 0, brake: 0 };
      const r = area.getBoundingClientRect();
      knob.style.left = `${e.clientX - r.left}px`;
      knob.style.top = `${e.clientY - r.top}px`;
      area.classList.add('down');
      knob.style.setProperty('--dx', '0px');
    });
    area.addEventListener('pointermove', (e) => {
      const w = this.wheel;
      if (!w || w.id !== e.pointerId) return;
      const t = touchSteer(e.clientX - w.x, e.clientY - w.y);
      w.steer = t.steer;
      w.brake = t.brake;
      knob.style.setProperty('--dx', `${t.steer * TOUCH.lock}px`);
      knob.classList.toggle('brake', t.brake > 0);
    });
    const up = (e: PointerEvent) => {
      if (this.wheel?.id !== e.pointerId) return;
      this.wheel = null;
      area.classList.remove('down');
      knob.classList.remove('brake');
    };
    area.addEventListener('pointerup', up);
    area.addEventListener('pointercancel', up);

    for (const [el, set] of [[brake, this.brakes], [hand, this.hand]] as const) {
      el.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        el.setPointerCapture(e.pointerId);
        this.onAnyInput();
        set.add(e.pointerId);
        el.classList.add('down');
      });
      const off = (e: PointerEvent) => { set.delete(e.pointerId); el.classList.toggle('down', set.size > 0); };
      el.addEventListener('pointerup', off);
      el.addEventListener('pointercancel', off);
    }
  }

  /** The input for the next steps. */
  read(): CarInput {
    if (this.override) return { ...this.override };
    const pads = typeof navigator !== 'undefined' && navigator.getGamepads ? navigator.getGamepads() : null;
    const pad = readPad(pads);
    const k = (what: Key) => this.keys.has(what);
    let steer = (k('right') ? 1 : 0) - (k('left') ? 1 : 0);
    let throttle = k('gas') ? 1 : 0;
    let brake = k('brake') || this.brakes.size ? 1 : 0;
    let handbrake = k('hand') || this.hand.size > 0;
    if (this.wheel) { steer = this.wheel.steer; brake = Math.max(brake, this.wheel.brake); }
    if (pad) {
      if (Math.abs(pad.steer) > Math.abs(steer)) steer = pad.steer;
      throttle = Math.max(throttle, pad.throttle);
      brake = Math.max(brake, pad.brake);
      handbrake ||= pad.handbrake;
    }
    if (this.autoGas && brake === 0) throttle = 1;
    return { throttle, brake, steer, handbrake };
  }

  /** Reads the gamepad's Start button; true on the frame it goes down. */
  pollStart(): boolean {
    const pads = typeof navigator !== 'undefined' && navigator.getGamepads ? navigator.getGamepads() : null;
    const p = pads ? [...pads].find((g) => g && g.connected) : null;
    const now = !!p?.buttons[9]?.pressed;
    const pressed = now && !this.startBefore;
    this.startBefore = now;
    if (pressed) this.onAnyInput();
    return pressed;
  }

  clear(): void {
    this.keys.clear();
    this.brakes.clear();
    this.hand.clear();
    this.wheel = null;
  }
}
