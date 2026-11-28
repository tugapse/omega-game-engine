## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| **AudioCache** | [src/audio/audio-cache.ts](/src/audio/audio-cache.ts) |

This component provides a framework-agnostic manager for handling audio assets, focusing on caching short, frequently accessed audio clips in RAM. It manages the lifecycle of these assets, including fetching them from URLs, decoding them using the `AudioContext`, and providing mechanisms for retrieval. It supports optional Least Recently Used (LRU) eviction to prevent excessive memory consumption.

The `AudioCache` acts as a core service layer responsible for resource management within the audio subsystem. It interfaces with browser APIs like `fetch` and `AudioContext` to handle loading and decoding. It integrates with streaming mechanisms via `createStream` for long-form content, fitting into the application's media playback service architecture.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| `CacheConfig` | Interface | Defines configuration options for the cache, including whether LRU eviction is active and the maximum memory ceiling. |
| `AudioCache` | Class | Manages the caching, loading, and streaming of audio assets. |
| `load(id: string, relativeUrl: string): Promise<AudioBuffer>` | Method | Fetches an asset by URL, decodes it, and caches it. Returns the decoded `AudioBuffer`. |
| `get(id: string): AudioBuffer` | Method | Retrieves a cached `AudioBuffer` by ID, updating its access time if LRU is enabled. Throws an error if not found. |
| `register(id: string, buffer: AudioBuffer): void` | Method | Manually adds a pre-decoded `AudioBuffer` to the cache, triggering eviction if necessary. |
| `has(id: string): boolean` | Method | Checks if an asset ID is currently present in the cache. |
| `unload(id: string): void` | Method | Removes a specific asset from the cache and updates internal memory tracking. |
| `clear(): void` | Method | Empties the entire cache, resetting all tracking variables. |
| `setLRU(enabled: boolean): void` | Method | Toggles the LRU eviction policy for the cache. |
| `createStream(id: string, relativeUrl: string, outputNode: AudioNode): HTMLAudioElement` | Method | Creates and registers an HTML5 Audio element for continuous streaming playback, connecting it to a specified `AudioNode`. |
| `destroyStream(id: string): void` | Method | Stops and cleans up a registered streaming audio element. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The cache uses a `Map` for O(1) average-time lookups and an array (`lruQueue`) to maintain access order for LRU eviction. When loading, it performs asynchronous fetching, off-thread decoding via `audioContext.decodeAudioData`, and size estimation. Eviction is managed by iteratively removing the oldest item from the `lruQueue` until the memory limit is satisfied.
- **Side Effects:** Interacts with the network via `fetch` to retrieve assets. Mutates internal state (`cache`, `currentCacheBytes`, `lruQueue`, `activeStreams`). Interacts with the browser's audio stack via `AudioContext` and `HTMLAudioElement`.
- **Error Handling:** Catches network errors during `fetch` and decoding, rethrowing them as descriptive errors prefixed with the asset ID. The `get` method throws an error if the requested ID is missing from the cache.

## 4. Dependencies & Configuration
**Environment & Configuration:**
- No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** `fetch`, `AudioContext`, `HTMLAudioElement`, `AudioNode` (Browser APIs).
- **Internal:** None.