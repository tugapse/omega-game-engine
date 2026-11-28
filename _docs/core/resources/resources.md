## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| **Resources** | [src/core/resources/resources.ts](/src/core/resources/resources.ts) |

This component serves as the central, static entry point for managing all engine resources, particularly those tied to specific WebGL rendering contexts. Its primary responsibility is to provide context-aware resource management, ensuring that resources (like textures) are correctly scoped to the WebGL context that created them, allowing for proper memory cleanup and sharing across different rendering environments.

It functions as a high-level service layer within the application architecture. It orchestrates the use of lower-level components like [ResourceManager](/src/core/resources/resource-manager.md) and [ResourceLoader](/src/core/resources/resource-loader.md), providing global configuration points such as setting custom loaders or URI resolvers that affect how assets are located and fetched.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| `Resources.defaultLoader` | Constant | The engine's default resource loader, configured to use `Resources.resolveUri` for URI resolution. |
| `Resources.for(gl?: WebGL2RenderingContext | null)` | Static Method | Retrieves or creates the `ResourceManager` associated with a given WebGL context (`gl`), or the most recently used context if `gl` is null. |
| `Resources.setLoader(loader: ResourceLoader | null)` | Static Method | Replaces the global resource loading mechanism. Setting it to `null` restores the default loader. |
| `Resources.setUriResolver(resolver: UriResolver | null)` | Static Method | Sets or clears the URI resolver function used to transform asset URIs before fetching. |
| `Resources.resolveUri(uri: string)` | Static Method | Determines the final URL for a given URI, checking for built-in assets first, then applying the custom URI resolver if available. |
| `Resources.releaseContext(gl: WebGL2RenderingContext)` | Static Method | Frees all resources managed by a specific WebGL context and removes its manager from tracking. |
| `Resources.forgetTexture(texture: Texture)` | Static Method | Removes a specific texture from the cache of all managers without freeing the underlying resource. |
| `Resources.trim()` | Static Method | Iterates over all active resource managers and frees any resources that are not currently held by any active handle, returning the count of freed resources. |
| `Resources.stats()` | Static Method | Returns an array containing the statistics for every active `ResourceManager` instance across all contexts. |
| `Resources.clear()` | Static Method | Completely disposes of all resources across all contexts and resets the internal manager tracking state. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The class maintains static maps to track `ResourceManager` instances keyed by their associated `WebGL2RenderingContext`. It delegates loading logic to a configurable `ResourceLoader` and URI transformation to a configurable `UriResolver`. The `for()` method handles context-specific instantiation and retrieval of managers.
- **Side Effects:** Mutates static state (`managers`, `currentGl`, `uriResolver`, `customLoader`). It interacts with the network implicitly when the underlying `ResourceLoader` executes a fetch operation.
- **Error Handling:** Fallback mechanisms are implemented by checking for `null` values in configuration setters (e.g., `setLoader(null)` restores default behavior) and by checking for the existence of managers before attempting disposal or access.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** None.
- **Internal:** [ResourceManager](/src/core/resources/resource-manager.md), [ResourceManagerStats](/src/core/resources/resource-manager.md), [DefaultResourceLoader](/src/core/resources/resource-loader.md), [ResourceLoader](/src/core/resources/resource-loader.md), [UriResolver](/src/core/resources/resource-loader.md), [Texture](/src/textures/texture.md).