## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| ResourceCache | [core/resources/resource-cache.ts](/core/resources/resource-cache.ts) |

This component implements a keyed cache for managing loaded resources, incorporating reference counting to control resource lifecycle. Its primary responsibility is to ensure that a resource is loaded only once per key, even if multiple parts of the application request it concurrently. It manages the state of loading, successful loading, and resource usage via explicit reference counting.

The `ResourceCache` acts as a core service layer within the application architecture, abstracting the complexities of asynchronous loading and resource management away from consumers. It relies on the configuration provided via `ResourceCacheOptions` to handle the actual loading (`load`) and cleanup (`dispose`) logic, making it a centralized resource management utility.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| `ResourceHandle<V>` | Interface | A reference to a cached resource. Must call `release()` when finished to decrement the reference count. |
| `ResourceCacheOptions<V>` | Interface | Defines the contract for loading and disposing resources, requiring a `load` function and optionally a `dispose` function. |
| `ResourceCacheStats` | Interface | A structure detailing the current state of the cache, including counts for entries, loading tasks, unused resources, and total references. |
| `ResourceCache<V>` | Class | The main cache implementation. Provides methods to acquire, peek, remove, trim, clear, and view statistics for cached resources. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The cache uses a `Map` to store `Entry` objects, which track the promise of the load operation, the current reference count (`refs`), and the loaded value. When `acquire` is called, it checks for an existing entry; if none exists, it initiates a load via `startLoad`. If the load succeeds, a `ResourceHandle` is created, incrementing the reference count. The `trim` method iterates over entries, disposing of those with zero references and loaded state.
- **Side Effects:** The component interacts with external state via the `options` provided in the constructor. Specifically, it calls `this.options.load(key)` to initiate asynchronous loading (which may involve network or filesystem I/O) and calls `this.options.dispose?.(value)` during `trim()` and `clear()` to free underlying resources.
- **Error Handling:** If a load operation fails, the entry's reference count is decremented, and the error is propagated up to the caller of `acquire`. If a load fails, the entry is deleted from the cache map. The `disposeValue` method wraps the disposal call in a `try...catch` block to prevent disposal errors from crashing the cache operation.

## 4. Dependencies & Configuration
**Environment & Configuration:**
- No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** `Promise`, `Map` (Standard JavaScript/TypeScript features).
- **Internal:** None.