import { describe, expect, it } from 'vitest';
import { readPad } from './input';

const pad = (buttons: number[], axes: number[] = [0, 0]) => ({
  connected: true, axes, buttons: Array.from({ length: 17 }, (_, i) => ({ pressed: buttons.includes(i), value: buttons.includes(i) ? 1 : 0 })),
}) as unknown as Gamepad;

describe('gamepad', () => {
  it('reads nothing without a pad', () => {
    expect(readPad(null)).toEqual({ left: false, right: false, up: false, down: false, jump: false, run: false, start: false });
    expect(readPad([null, null]).jump).toBe(false);
  });
  it('the stick or the cross moves, A jumps, B or X runs, Start pauses', () => {
    expect(readPad([pad([], [-0.8, 0])]).left).toBe(true);
    expect(readPad([pad([], [0.3, 0])]).right).toBe(false);
    expect(readPad([pad([15])]).right).toBe(true);
    expect(readPad([pad([0])]).jump).toBe(true);
    expect(readPad([pad([1])]).run).toBe(true);
    expect(readPad([pad([2])]).run).toBe(true);
    expect(readPad([pad([9])]).start).toBe(true);
    expect(readPad([null, pad([0])]).jump).toBe(true);
  });
});
