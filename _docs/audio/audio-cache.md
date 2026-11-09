## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| AudioCache | audio/audio-cache.md |

This component provides a framework-agnostic system for managing audio assets, handling both short, low-latency sound effects via in-memory caching and long-form audio via background streaming. Its primary responsibility is to abstract the complexities of loading, decoding, and managing audio resources, ensuring fast retrieval for frequently used sounds while preventing excessive memory consumption from large tracks.

The `AudioCache` acts as a core service layer within the application architecture. It sits between the game logic/UI layer and the underlying Web Audio API, providing a controlled interface for resource management. It interacts with the `AudioContext` for decoding and manages its internal state (cache, streams, LRU tracking) based on the provided `CacheConfig`.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| CacheConfig | Interface | Defines configuration parameters for the cache, including LRU usage and maximum memory size. |
| AudioCache | Class | Manages loading, caching, and streaming of audio assets. |
| load | Method | Fetches an audio asset from a URL, decodes it, and caches it. Returns the decoded `AudioBuffer`. |
| get | Method | Retrieves a pre-loaded `AudioBuffer` from the cache, updating its access time. |
| register | Method | Manually adds a pre-existing `AudioBuffer` to the cache, respecting size limits. |
| has | Method | Checks if a specific asset ID is currently present in the cache. |
| unload | Method | Removes a specific asset from the cache, freeing up associated memory. |
| clear | Method | Empties the entire cache, resetting all tracking metrics. |
| setLRU | Method | Enables or disables the Least Recently Used (LRU) eviction policy dynamically. |
| createStream | Method | Creates and configures an `HTMLAudioElement` for streaming long audio tracks, connecting it to a specified `AudioNode`. |
| destroyStream | Method | Stops playback and cleans up a streaming audio element associated with a given ID. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The cache uses a `Map` for O(1) lookups and an array (`lruQueue`) to maintain access order for LRU eviction. When loading, it fetches data, decodes it, and checks if the addition exceeds `maxCacheBytes`. If LRU is active, it iteratively removes the oldest items from the `lruQueue` until the size constraint is met. Streaming uses the browser's native `HTMLAudioElement` API, bypassing the in-memory buffer for large files.

- **Side Effects:** Interacts with the network via `fetch()` when loading assets. Mutates internal state (cache map, byte counters, LRU queue). Interacts with the browser's Web Audio API (`AudioContext`, `AudioNode`) for decoding and streaming.

- **Error Handling:** `load` throws an error if the `fetch` request fails (non-2xx status) or if `decodeAudioData` fails. `get` throws an error if the requested ID is not found in the cache.

## 4. Dependencies & Configuration
**Environment & Configuration:**
- None

**Module Dependencies:**
- **Standard/External:** `fetch`, `AudioContext`, `HTMLAudioElement`, `AudioNode` (Browser APIs)
- **Internal:** None