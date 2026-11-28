## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| **collada-parser** | [src/parsers/collada/collada-parser.ts](/src/parsers/collada/collada-parser.ts) |

This component is responsible for parsing COLLADA (.dae) files, which are common interchange formats for 3D models. Its primary responsibility is to ingest the raw XML structure of a COLLADA document and transform it into a structured, in-memory representation of a 3D asset, encapsulated within the `ModelData` structure. This process involves interpreting node hierarchies, geometry definitions, material properties, and animation data.

This parser acts as a specialized data ingestion service within the engine's asset pipeline. It consumes raw text input and produces a complete [ModelData](/core/model/model-data.md) object, which serves as the canonical representation of the loaded 3D model. It relies heavily on utility functions from [../xml](/parsers/xml.md) and mathematical libraries like `gl-matrix` for matrix and vector operations.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| `isCollada` | Function | Checks if a given `ArrayBuffer` contains the signature of a COLLADA (.dae) document by inspecting the initial bytes. |
| `parseCollada` | Function | Parses a complete COLLADA document provided as a string, returning a fully constructed `ModelData` object. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The parsing is managed by the `ColladaConverter` class. It first indexes all XML elements by ID during construction. The `convert` method orchestrates the parsing: it reads asset metadata (like unit scale), traverses the scene graph starting from the root nodes, reads geometry via `readGeometry`, processes skinning data via `readSkin`, and finally reads animation data via `readAnimations`. Geometry processing involves complex vertex deduplication using a key derived from position, normal, and UV coordinates. Skinning data links geometry primitives to bone structures defined in the controller.
- **Side Effects:** The component mutates the internal state of the `ColladaConverter` instance (e.g., populating `this.model`) and relies on `console.warn` for non-critical warnings during parsing.
- **Error Handling:** Fallback mechanisms exist for missing attributes or elements (e.g., using default values or skipping processing if a required element like `geometry` is missing). The `readSkin` method includes a warning if a joint name cannot be mapped to a known node.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** `gl-matrix`
- **Internal:** [../../animation/animation-clip.md](/src/animation/animation-clip.ts), [../../core/mesh.md](/src/core/mesh.ts), [../../core/model/model-data.md](/src/core/model/model-data.ts), [../xml.md](/src/parsers/xml.ts)