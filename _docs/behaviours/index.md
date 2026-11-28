## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| **Index** | [behaviours/index.ts](/behaviours/index.ts) |

This component serves as a central barrel file for exporting various behavior modules within the application. Its primary responsibility is to aggregate and expose a comprehensive set of behavioral logic units, allowing other parts of the system to import specific behaviors without needing to know their exact subdirectory structure.

It functions as a public interface layer within the application's architecture. By aggregating exports from specific directories like `./renderer/` and `./entity-behaviour`, it standardizes how different subsystems—such as rendering pipelines and entity logic—are accessed across the codebase, providing a unified entry point for behavior management.

## 2. Public API & Interfaces
This file contains no public exports.

## 3. Implementation Details & Side Effects
Structural definitions only; no complex logic or side effects.

## 4. Dependencies & Configuration
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** None
- **Internal:** [renderer-behaviour](/behaviours/renderer/renderer-behaviour.md), [mesh-renderer-behaviour](/behaviours/renderer/mesh-renderer-behaviour.md), [skinned-mesh-renderer-behaviour](/behaviours/renderer/skinned-mesh-renderer-behaviour.md), [skybox-renderer](/behaviours/renderer/skybox-renderer.md), [entity-behaviour](/behaviours/entity-behaviour.md), [camera-fly-behaviour](/behaviours/camera-fly-behaviour.md), [sun-behaviour](/behaviours/sun-behaviour.md), [rotate-behaviour](/behaviours/rotate-behaviour.md)