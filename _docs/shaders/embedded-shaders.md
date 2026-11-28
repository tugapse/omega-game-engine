## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| **EMBEDDED_SHADERS** | [src/shaders/embedded-shaders.ts](/src/shaders/embedded-shaders.ts) |

This component serves as a static registry for GLSL source code strings, keyed by their corresponding ShaderSources URI. Its primary responsibility is to bundle essential, pre-compiled shader programs directly into the application bundle, making them immediately available for rendering pipelines without requiring runtime file loading.

It functions as a data provider within the rendering subsystem. Instead of relying on the file system to load shaders at runtime, this map provides a deterministic, embedded source of truth for various rendering effects, such as terrain rendering, post-processing, and skybox generation, which are referenced by other shader logic like [assets/shaders/frag/default-lit.frag](/assets/shaders/frag/default-lit.frag).

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| `EMBEDDED_SHADERS` | Object | A constant map where keys are ShaderSources URIs (strings) and values are the corresponding GLSL source code (strings). |

## 3. Implementation Details & Side Effects
- **Core Logic:** The component is a simple constant data structure initialized with hardcoded string literals containing GLSL source code. The structure maps a URI string to its shader content string.
- **Side Effects:** None.
- **Error Handling:** None.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** None.
- **Internal:** None.