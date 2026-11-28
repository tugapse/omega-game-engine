## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| ShaderSources | [src/shaders/shader-sources.ts](/src/shaders/shader-sources.ts) |

This component serves as a centralized repository for string constants defining the file paths to various shader programs used throughout the application. It organizes these paths into two distinct static maps: `frag` for fragment shaders and `vertex` for vertex shaders. By centralizing these references, it ensures consistency across the rendering pipeline when loading shader assets.

This utility class functions as a configuration or resource mapping layer within the rendering subsystem. It decouples the application logic that requests a specific shader effect (e.g., 'entity_picker') from the physical location of the shader source files, allowing for easier asset management and modification without altering core rendering logic components like [Renderer](/path/to/renderer.md) or [Material](/path/to/material.md).

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| `ShaderSources.frag` | Object | A read-only map containing string paths to various fragment shader files. |
| `ShaderSources.vertex` | Object | A read-only map containing string paths to various vertex shader files. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The class provides static, read-only properties (`frag` and `vertex`) which are simple object literals mapping descriptive keys (e.g., 'color', 'handle') to their corresponding asset file paths (e.g., 'assets/shaders/frag/color.frag').
- **Side Effects:** None.
- **Error Handling:** None.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** None.
- **Internal:** None.