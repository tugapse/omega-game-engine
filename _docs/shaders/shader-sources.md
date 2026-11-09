## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| ShaderSources | /shaders/shader-sources.md |

This component serves as a centralized registry for all shader file paths used throughout the application. It encapsulates mappings for both fragment shaders (`frag`) and vertex shaders (`vert`), providing a single, consistent source of truth for asset loading related to rendering pipelines. By centralizing these paths, it prevents hardcoding shader locations across various parts of the codebase, improving maintainability and simplifying asset management.

Architecturally, `ShaderSources` functions as a static configuration utility or a resource map. It is consumed by the rendering system or asset loader to correctly locate the necessary shader source files when setting up rendering passes, such as those for entity picking, lighting calculations, or post-processing effects like retro filters.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| ShaderSources.frag | Object | A map containing string keys corresponding to shader types and their associated file paths. |
| ShaderSources.vertex | Object | A map containing string keys corresponding to shader types and their associated file paths. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The component defines two static read-only objects, `frag` and `vertex`, which act as dictionaries mapping descriptive shader names (e.g., `entity_picker`, `handle`) to their respective file paths within the asset directory structure.

- **Side Effects:** None.

- **Error Handling:** None.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
None.