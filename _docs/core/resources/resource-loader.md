## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| **ResourceLoader** | [core/resources/resource-loader.ts](/core/resources/resource-loader.ts) |

This component defines the contracts and implementations necessary for loading various types of external assets—such as text files (shaders, meshes), images (textures), and binary data (3D models)—into the application environment. It abstracts the mechanism by which these resources are retrieved, allowing the core engine to remain decoupled from the specific loading strategy (e.g., HTTP fetching, local file system access).

It serves as a critical service layer within the application architecture, providing the interface through which the rendering and asset management systems acquire the data they need to operate. Implementations like [DefaultResourceLoader](/core/resources/resource-loader.ts) bridge this interface to standard browser APIs like `fetch` and `Image`.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| `LoadedImage` | Type | Represents an image asset ready for GPU upload, containing the image element/bitmap and its dimensions. |
| `ResourceLoader` | Interface | Defines the contract for loading resources: `loadText`, `loadImage`, and optional `loadBinary`. |
| `UriResolver` | Type | A function signature used to transform a raw resource URI string into a resolvable URL string or a promise resolving to one. |
| `DefaultResourceLoader` | Class | Implements `ResourceLoader` using the browser's `fetch` API and an injected `UriResolver` to handle resource fetching. |
| `DefaultResourceLoader.loadText(uri: string)` | Method | Fetches text content from a URI, resolving to a Promise containing the string content. |
| `DefaultResourceLoader.loadBinary(uri: string)` | Method | Fetches binary data from a URI, resolving to a Promise containing an `ArrayBuffer`. |
| `DefaultResourceLoader.loadImage(uri: string)` | Method | Fetches an image from a URI, resolving to a Promise containing a `LoadedImage`. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The `DefaultResourceLoader` uses the provided `resolve` function to convert the input `uri` into a concrete URL. For text and binary loading, it uses `fetch` and checks the `response.ok` status before returning the content. Image loading is handled asynchronously by creating a native `Image` object and setting up `onload`/`onerror` handlers to resolve or reject the promise based on the image loading success.
- **Side Effects:** Interacts with the network via the global `fetch` API.
- **Error Handling:** `loadText` and `loadBinary` throw an `Error` if the HTTP response status is not OK. `loadImage` rejects the promise if the underlying `Image` element fails to load (`onerror`).

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** `fetch` (Browser API), `Image` (Browser API)
- **Internal:** None