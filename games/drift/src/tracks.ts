// The tracks. Phase 1 has one, a test loop with fast sweepers, a hairpin and
// an S, to tune the car on.
import { TrackSpec } from './track';

export const TEST_TRACK: TrackSpec = {
  id: 'test',
  name: 'Pista de testes',
  width: 14,
  kerb: 1.2,
  runoff: 6,
  points: [
    [0, 0], [110, 0], [150, 15], [168, 52], [160, 84], [134, 96], [108, 104], [90, 124],
    [92, 154], [76, 182], [40, 190], [0, 178], [-40, 145], [-28, 95], [-65, 62], [-55, 18],
  ],
};

export const TRACKS: TrackSpec[] = [TEST_TRACK];
