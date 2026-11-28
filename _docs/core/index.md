## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| **core/index.ts** | [src/core/index.ts](/src/core/index.ts) |

This file serves as the primary barrel export for the core module of the application. Its responsibility is to aggregate and expose a comprehensive set of fundamental types, utilities, and systems across the entire engine. By exporting everything from its submodules, it provides a single, unified entry point for consumers to access the engine's functionality.

Architecturally, this component acts as a central aggregation layer or facade. It allows external consumers to interact with disparate parts of the engine—such as rendering systems ([/src/core/render.md]), geometric primitives ([/src/core/mesh.md]), resource management ([/src/core/resources/resource-manager.md]), and input handling ([/src/core/input.md])—through a consistent, top-level namespace.

## 2. Public API & Interfaces
This file contains no public exports.

## 3. Implementation Details & Side Effects
Structural definitions only; no complex logic or side effects.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** None
- **Internal:** [./bounding-box](/src/core/bounding-box.md), [./camera-ubo](/src/core/camera-ubo.md), [./canvas-viewport](/src/core/canvas-viewport.md), [./color](/src/core/color.md), [./colors](/src/core/colors.md), [./event-emitter](/src/core/event-emitter.md), [./input](/src/core/input.md), [./json-serializable](/src/core/json-serializable.md), [./mesh](/src/core/mesh.md), [./object-instanciator](/src/core/object-instanciator.md), [./range](/src/core/range.md), [./scene-fog](/src/core/scene-fog.md), [./transform](/src/core/transform.md), [./vector](/src/core/vector.md), [./render](/src/core/render.md), [./resources/resource-cache](/src/core/resources/resource-cache.md), [./resources/resource-loader](/src/core/resources/resource-loader.md), [./resources/resource-manager](/src/core/resources/resource-manager.md), [./resources/resources](/src/core/resources/resources.md), [./resources/builtin-textures](/src/core/resources/builtin-textures.md), [./pointer](/src/core/pointer.md)