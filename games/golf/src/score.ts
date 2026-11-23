// Names for a score on a hole.

/** "Birdie!", "Par", "Bogey"… for `strokes` on a hole of `par`. */
export function scoreName(strokes: number, par: number): string {
  if (strokes === 1) return 'Hole in one!';
  const d = strokes - par;
  const names: Record<number, string> = { [-3]: 'Albatroz!', [-2]: 'Eagle!', [-1]: 'Birdie!', 0: 'Par', 1: 'Bogey', 2: 'Duplo bogey', 3: 'Triplo bogey' };
  return names[d] ?? `+${d}`;
}
