## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | AudioCache |
| Source file | audio-cache.ts |

The **AudioCache** serves as a specialized memory management layer for the audio subsystem. It is designed to handle the dual requirements of low-latency playback for short sound effects and memory-efficient streaming for long-form audio assets like background music.

**Functional Mission**
The primary responsibility of **AudioCache** is to optimize the memory footprint of the audio engine by implementing a hybrid storage strategy. It solves the problem of RAM exhaustion by providing an automated Least Recently Used (LRU) eviction policy for decoded `AudioBuffer` objects while simultaneously facilitating the streaming of large files via `HTMLAudioElement` to bypass the need for full uncompressed PCM loading.

**System Context & Integration**
This component acts as a middleware between raw network assets and the playback engines. It interacts closely with the [Audio Engine](/AgentDocs/audio/audio-engine.md) to provide ready-to-play buffers for immediate execution. By managing the lifecycle of audio data, it prevents memory leaks and ensures that the high-frequency access of sound effects does not interfere with the stability of the broader system. It provides the necessary data structures that downstream voice factories or sequencers require to trigger audio events without incurring the latency of repeated network fetches or decoding operations.

## 2. Environment & Configuration
**Environment Lookups:**
- `useLRU` (via `CacheConfig`)  Determines if the cache should automatically evict assets when `maxCacheBytes` is exceeded.
- `maxCacheBytes` (via `CacheConfig`)  Sets the soft limit for the total size of uncompressed PCM data allowed in the `AudioBuffer` cache.

**Hardcoded Constants:**
- `maxCacheBytes` (Default: `52428800`)  Sets a default 50MB limit for the memory cache.
- `4` (via `estimateBufferSize`)  Represents the byte size of a 32-bit float sample.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `CacheConfig` | Interface | Defines configuration parameters for LRU behavior and memory limits. |
| `AudioCache` | Class | The primary manager for audio asset lifecycle, caching, and streaming. |
| `load` | Method | Fetches, decodes, and caches an audio asset from a URL. |
| `get` | Method | Retrieves a previously loaded `AudioBuffer` from the cache. |
| `register` | Method | Manually injects a pre-existing `AudioBuffer` into the cache. |
| `has` | Method | Checks for the existence of an asset in the cache. |
| `unload` | Method | Manually removes a specific asset and updates memory counters. |
| `clear` | Method | Resets the entire cache and memory tracking. |
| `setLRU` | Method | Toggles the LRU eviction policy at runtime. |
| `createStream` | Method | Initializes an `HTMLAudioElement` for streaming long-form audio. |
| `destroyStream` | Method | Stops and cleans up a streaming audio resource. |

## 4. Execution Logic & Flow
- **Initialization**: The class is instantiated with an `AudioContext` and a `CacheConfig`. It initializes an empty `Map` for buffers, a `Map` for active streams, an empty `lruQueue` array, and sets `currentCacheBytes` to 0.
- **Data Path (Loading)**: 
    1. **Check**: If `id` exists in `cache`, update LRU position and return.
    2. **Fetch**: Request `relativeUrl` via `fetch`.
    3. **Decode**: Convert `ArrayBuffer` to `AudioBuffer` using `audioContext.decodeAudioData`.
    4. **Size Estimation**: Calculate bytes using `numberOfChannels * length * 4`.
    5. **Eviction**: If `useLRU` is true, call `evictToFit` to remove oldest assets until `currentCacheBytes + newBytes <= maxCacheBytes`.
    6. **Storage**: Add to `cache`, increment `currentCacheBytes`, and push `id` to `lruQueue`.
- **Conditional Branching**:
    - **LRU Logic**: During `load`, `register`, or `get`, the `lruQueue` is updated to move the accessed `id` to the end (most recent).
    - **Eviction Loop**: In `evictToFit`, a `while` loop continues to `shift()` the oldest `id` from `lruQueue` and delete it from `cache` as long as the memory limit is exceeded.
    - **Stream Management**: `createStream` checks `activeStreams` to prevent duplicate stream creation for the same `id`.

## 5. Resource Dependencies
- **Standard Libraries**: `Map`, `Array`, `Promise`, `Error`
- **Internal Modules**: 
    - [Audio Engine](/AgentDocs/audio/audio-engine.md) (Contextual dependency)
- **External Packages**: 
    - `Web Audio API` (`AudioContext`, `AudioBuffer`, `AudioNode`)
    - `HTML5 Audio API` (`HTMLAudioElement`, `Audio`)
    - `Fetch API` (`fetch`)