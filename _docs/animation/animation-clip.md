## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| **AnimationClip** | [src/animation/animation-clip.ts](/src/animation/animation-clip.ts) |

This component defines the structure and logic for handling skeletal animation data, specifically `AnimationClip`s, which contain a collection of `AnimationChannel`s. Its primary responsibility is to store keyframe data for various properties (translation, rotation, scale) across different bones and provide methods to sample the interpolated value of these properties at a given time.

It functions as a core data model and runtime utility within the animation system. It relies on the data structures defined here to drive the animation state, which is then consumed by the rendering or simulation pipeline, potentially interacting with components like [Animator](/path/to/animator.md) (if it existed in the manifest).

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| `AnimationInterpolation` | Type | Defines the interpolation method used between keyframes: 'STEP', 'LINEAR', or 'CUBICSPLINE'. |
| `AnimatedProperty` | Type | Defines the type of property being animated: 'translation', 'rotation', or 'scale'. |
| `AnimationChannel` | Interface | Defines a single animation track, specifying the target bone, the property being animated, the timestamps, the value data, and the interpolation method. |
| `AnimationClip` | Class | Represents the entire animation sequence, holding a name, an array of `AnimationChannel`s, and a calculated duration. |
| `AnimationClip.durationOf` | Static Method | Calculates the total duration of an `AnimationClip` by finding the maximum time across all its channels. |
| `componentCount` | Function | Returns the number of components (3 for translation/scale, 4 for rotation) associated with a given `AnimatedProperty`. |
| `findKey` | Function | Performs a binary search on the `times` array to find the index of the keyframe immediately preceding or at the given time `t`, utilizing a `hint` for optimized sequential playback. |
| `sampleChannel` | Function | Calculates the interpolated value of a specific `AnimationChannel` at time `t`. It handles 'STEP', 'LINEAR', and 'CUBICSPLINE' interpolation, returning the resulting values in `out` and the key index for the next hint. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The component implements time-based sampling. For linear interpolation, it performs simple linear blending between the values of two adjacent keyframes. For 'CUBICSPLINE', it applies Hermite spline interpolation using tangent data stored within the keyframe values. The `findKey` function ensures efficient time lookup, which is crucial for frame-rate independent sampling.
- **Side Effects:** None. The functions operate purely on input data structures (`Float32Array`, `AnimationChannel`) and write results to an output buffer (`out`).
- **Error Handling:** `findKey` handles edge cases such as empty time arrays or times outside the defined range by returning index 0 or `n-1`. `sampleChannel` checks for `dt > 0` before calculating the interpolation factor `s` to prevent division by zero.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** `gl-matrix` (imported as `quat`).
- **Internal:** None.