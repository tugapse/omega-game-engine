## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| Animator | [src/animation/animator.ts](/src/animation/animator.ts) |

The `Animator` class is responsible for managing and playing back skeletal animation clips associated with a model entity. It handles the loading of animation data from model URIs, manages the state of playback (including time, speed, and looping), and calculates the resulting bone transformations based on the active animation clips.

This component acts as a core service within the entity system, inheriting from [EntityBehaviour](/src/behaviours/entity-behaviour.md). It interfaces with [Resources](/src/core/resources/resources.md) to fetch model data and uses [Transform](/src/core/transform.md) objects to apply the calculated pose changes to the entity's descendants.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| `AnimationEvent<T>` | Class | A minimal typed event emitter allowing external systems to subscribe to animation lifecycle events (e.g., `onFinished`, `onLoop`). |
| `PlayState` | Interface | Defines the runtime state required for a single playing animation clip, including targets, time, and blending hints. |
| `Animator` | Class | Manages animation playback. Provides methods like `play()` and `crossFade()` to control animation state and exposes properties like `clipUris` and `speed`. |
| `Animator.clipList` | Getter | Returns a read-only array containing all loaded `AnimationClip` instances available to the animator. |
| `Animator.currentClip` | Getter | Returns the `AnimationClip` currently being played or faded into. |
| `Animator.time` | Getter/Setter | Retrieves or sets the current playback time in seconds of the active animation clip. |
| `Animator.whenLoaded()` | Method | Returns a `Promise` that resolves when all animation clips have been successfully loaded. |
| `Animator.addClip(clip: AnimationClip)` | Method | Adds an `AnimationClip` to the animator's internal list for runtime use. |
| `Animator.getClip(nameOrIndex: string \| number)` | Method | Retrieves a loaded `AnimationClip` either by its name or its index in the clip list. |
| `Animator.play(nameOrIndex: string \| number, options?: { loop?: boolean })` | Method | Starts playing a specified clip from the beginning, overriding any current playback. |
| `Animator.crossFade(nameOrIndex: string \| number, duration?: number, options?: { loop?: boolean })` | Method | Initiates a smooth transition from the current clip to a new specified clip over a given duration. |
| `Animator.stop()` | Method | Halts all animation playback, leaving bones in their current pose. |
| `Animator.isPlaying(name?: string)` | Method | Checks if any animation is currently playing, optionally filtering by clip name. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The `Animator` maintains two primary states: `current` and `previous` for crossfading. The `advance` method steps time forward for both states, calculating the blend weight (`w`) based on `fadeTime` versus `fadeDuration`. The `apply` method samples channels from both clips using `sampleChannel`, mixes the resulting transforms (using `mix` for interpolation), and writes the final local transforms to the target `Transform` objects via `write`. Bone identification is performed by traversing the entity hierarchy starting from the parent using `collectBones`.
- **Side Effects:** Mutates the local transforms of `Transform` objects belonging to the entity's descendants. It interacts with the external state via `Resources.for().getModel()` during clip loading. It emits events via `AnimationEvent` instances (`onFinished`, `onLoop`).
- **Error Handling:** Catches errors during clip loading in `loadClips()` and logs them to the console. It includes checks to prevent division by zero or invalid states during time advancement and blending.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** `gl-matrix`
- **Internal:** [EntityBehaviour](/src/behaviours/entity-behaviour.md), [Resources](/src/core/resources/resources.md), [Transform](/src/core/transform.md), [model-data](/src/core/model/model-data.ts), [json-serialized-data](/src/interfaces/json-serialized-data.ts), [animation-clip](/src/animation/animation-clip.ts)