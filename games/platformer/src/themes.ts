// The look of each world: colours of the sky, the ground and blocks, the
// light, and what stands in the background. Plain data, used by look.ts.
import { Theme } from './level';

export interface ThemeLook {
  /** Sky gradient, top to bottom (CSS colours), and the clear colour behind everything (0..1). */
  sky: [string, string, string];
  clear: [number, number, number];
  /** Ground: the top layer (grass, crystal crust), its highlights and lower edge; the earth below and its specks. */
  top: [string, string, string];
  earth: [string, string, string];
  /** Under the level (the view never shows the bottom). */
  deep: [number, number, number];
  /** Solid blocks: face, light edge, dark edge, middle panel. */
  block: [string, string, string, string];
  /** Rivets or crystals drawn on blocks. */
  blockMark: string | null;
  /** Ambient and sun light colours, and the sun's strength. */
  ambient: [number, number, number];
  sun: [number, number, number];
  /** Background: hills (meadow), crystals (caves) or clouds and towers (clouds). */
  scenery: 'hills' | 'crystals' | 'clouds';
  /** Background colours, far then near. */
  far: [number, number, number];
  near: [number, number, number];
  /** Platforms: moving ones and falling ones (0..1). */
  mover: [number, number, number];
  faller: [number, number, number];
  /** The page behind the canvas, while loading. */
  page: string;
}

export const THEMES: Record<Theme, ThemeLook> = {
  meadow: {
    sky: ['#3d8ff0', '#9fd2ff', '#e4f4ff'],
    clear: [0.6, 0.82, 1],
    top: ['#5fbf3c', '#74d24c', '#4aa22e'],
    earth: ['#7a5130', '#8c6038', '#69452a'],
    deep: [0.36, 0.23, 0.14],
    block: ['#8f96a8', '#b4bccd', '#656b7a', '#7d8496'],
    blockMark: null,
    ambient: [0.55, 0.58, 0.66],
    sun: [1, 0.96, 0.88],
    scenery: 'hills',
    far: [0.48, 0.72, 0.62],
    near: [0.36, 0.7, 0.38],
    mover: [0.95, 0.75, 0.2],
    faller: [0.78, 0.5, 0.3],
    page: '#9fd2ff',
  },
  caves: {
    sky: ['#000000', '#04020b', '#0c0619'],
    clear: [0.08, 0.05, 0.15],
    top: ['#3fd6c8', '#8ff5ea', '#259a92'],
    earth: ['#3b2f55', '#4a3c69', '#2c2340'],
    deep: [0.16, 0.12, 0.24],
    block: ['#6a4fa3', '#957ad0', '#432f6e', '#5a4290'],
    blockMark: '#c9a8ff',
    ambient: [0.42, 0.36, 0.6],
    sun: [0.7, 0.75, 1],
    scenery: 'crystals',
    far: [0.42, 0.22, 0.75],
    near: [0.16, 0.7, 0.68],
    mover: [0.35, 0.9, 0.85],
    faller: [0.62, 0.42, 0.85],
    page: '#1f1238',
  },
  clouds: {
    sky: ['#ff7e6b', '#ffb88a', '#ffe9c7'],
    clear: [1, 0.8, 0.65],
    top: ['#9aa6ba', '#c3ccdb', '#6e7a8e'],
    earth: ['#59637a', '#6a758e', '#475066'],
    deep: [0.95, 0.9, 0.92],
    block: ['#8e9bb3', '#c0cadb', '#5d6880', '#f2b134'],
    blockMark: '#3a4152',
    ambient: [0.66, 0.58, 0.6],
    sun: [1, 0.86, 0.72],
    scenery: 'clouds',
    far: [0.98, 0.93, 0.95],
    near: [1, 1, 1],
    mover: [0.95, 0.6, 0.2],
    faller: [0.85, 0.85, 0.9],
    page: '#ffb88a',
  },
};
