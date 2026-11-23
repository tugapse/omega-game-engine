// The three places the tracks are in: a city at night, a desert and a snowy
// mountain. What is off the road (its grip and drag) is here, so the physics
// and the tests see it; the colours, the light and the scenery are for the look.

export type ThemeName = 'city' | 'desert' | 'snow';

export interface Theme {
  name: ThemeName;
  /** The name shown. */
  label: string;
  /** What is past the kerbs: its grip and its drag (N per m/s). */
  off: { grip: number; drag: number };
  /** The sky (clear colour), the ambient light and the sun (or the moon): colour and angles (degrees). */
  sky: [number, number, number];
  ambient: [number, number, number];
  sun: [number, number, number];
  sunAngle: [number, number];
  /** The ground off the road: its colour and the speckles' two colours (CSS). */
  ground: [string, string, string];
  /** The road's base colour, the kerbs' two colours and the barriers' two stripes (CSS). */
  road: string;
  kerb: [string, string];
  barrier: [string, string];
  /** What stands round the track. */
  scenery: 'city' | 'desert' | 'snow';
  /** The smoke's colour (0 to 1). */
  smoke: [number, number, number];
  /** Fog: its colour and density (0 for none). */
  fog: [number, number, number];
  fogDensity: number;
}

export const THEMES: Record<ThemeName, Theme> = {
  city: {
    name: 'city', label: 'Cidade à noite',
    off: { grip: 0.6, drag: 260 },
    sky: [0.04, 0.05, 0.12], ambient: [0.3, 0.32, 0.48], sun: [0.55, 0.6, 0.85], sunAngle: [60, 140],
    ground: ['#1d3a2a', '#24452f', '#17301f'],
    road: '#2c2c36', kerb: ['#ff3ea5', '#f4f1ea'], barrier: ['#2de2ff', '#ff3ea5'],
    scenery: 'city', smoke: [0.55, 0.55, 0.65],
    fog: [0.06, 0.07, 0.15], fogDensity: 0.006,
  },
  desert: {
    name: 'desert', label: 'Deserto',
    off: { grip: 0.55, drag: 330 },
    sky: [0.55, 0.7, 0.88], ambient: [0.5, 0.42, 0.36], sun: [1, 0.9, 0.72], sunAngle: [40, 60],
    ground: ['#d9a35f', '#e3b06c', '#c99252'],
    road: '#4a4048', kerb: ['#ff8a3d', '#f4f1ea'], barrier: ['#ff8a3d', '#f4f1ea'],
    scenery: 'desert', smoke: [0.85, 0.72, 0.55],
    fog: [0.78, 0.76, 0.74], fogDensity: 0.0016,
  },
  snow: {
    name: 'snow', label: 'Montanha com neve',
    off: { grip: 0.5, drag: 220 },
    sky: [0.72, 0.82, 0.95], ambient: [0.5, 0.55, 0.65], sun: [1, 0.98, 0.95], sunAngle: [50, 20],
    ground: ['#eef3f8', '#ffffff', '#d8e2ec'],
    road: '#3a3d48', kerb: ['#2d7bff', '#f4f1ea'], barrier: ['#2d7bff', '#f4f1ea'],
    scenery: 'snow', smoke: [0.9, 0.93, 0.97],
    fog: [0.78, 0.85, 0.95], fogDensity: 0.004,
  },
};
