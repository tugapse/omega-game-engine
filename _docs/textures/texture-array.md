## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| **TextureArray** | [src/textures/texture-array.ts](/src/textures/texture-array.ts) |

This component implements a `TextureArray`, a WebGL2 texture type designed to hold multiple 2D layers (like terrain layers for color and normals) within a single texture resource. It manages the creation, configuration, and manipulation of this 3D texture structure, allowing shaders to sample specific layers via an index.

This class serves as a core resource management utility within the rendering pipeline. It is responsible for abstracting the low-level WebGL texture operations, providing a structured interface for asset loading and rendering components, such as those that might utilize [Texture](/src/textures/texture.md) or specific rendering contexts.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| `TextureArray` | Class | Manages a WebGL2 TEXTURE_2D_ARRAY, allowing layers to be set, mipmaps generated, and the texture bound to a specific unit. |
| `setLayer(layer: number, rgba: Uint8Array \| Uint8ClampedArray): void` | Method | Writes the RGBA data for a specific layer into the texture array. |
| `generateMipmaps(): void` | Method | Triggers the generation of mipmaps for the entire texture array. |
| `bind(unit: number): void` | Method | Activates a specific texture unit and binds the `glTexture` to it for use in rendering. |
| `destroy(): void` | Method | Releases the underlying WebGL texture resource to prevent memory leaks. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The constructor initializes the texture using `gl.texStorage3D` to allocate storage for a specified number of layers, size, and format. Subsequent methods handle data uploading (`texSubImage3D`), mipmap generation (`generateMipmap`), and texture binding (`activeTexture`, `bindTexture`). Anisotropic filtering is optionally enabled if the extension is available.
- **Side Effects:** Interacts heavily with the WebGL rendering context (`WebGL2RenderingContext`), causing state changes on the GPU (texture creation, binding, data upload, parameter setting).
- **Error Handling:** No explicit exception handling is present; operations rely on the underlying WebGL context to report errors.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** WebGL2RenderingContext, WebGLTexture, Uint8Array, Uint8ClampedArray.
- **Internal:** None.