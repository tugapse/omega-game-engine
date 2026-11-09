## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| behaviours/index | /behaviours/index.md |

This component acts as a central aggregation point for various behaviour modules within the engine. Its primary responsibility is to export a unified interface, allowing consumers to easily access and utilize different types of entity and rendering behaviours without needing to know the specific sub-module paths. It consolidates functionality related to how entities behave and how visual elements are rendered.

Architecturally, this file serves as a public API facade for the behaviour system. It groups related behaviourssuch as those for rendering (`/renderer/renderer-behaviour.md`, `/renderer/mesh-renderer-behaviour.md`, `/renderer/skybox-renderer.md`) and entity control (`/entity-behaviour.md`, `/camera-fly-behaviour.md`)into a single, importable namespace. This structure promotes modularity and simplifies dependency management for higher-level systems.

## 2. Public API & Interfaces
This file contains no public exports.

## 3. Implementation Details & Side Effects
Structural definitions only; no complex logic or side effects.

## 4. Dependencies & Configuration
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** None.

- **Internal:** [renderer-behaviour](/renderer/renderer-behaviour.md), [mesh-renderer-behaviour](/renderer/mesh-renderer-behaviour.md), [skybox-renderer](/renderer/skybox-renderer.md), [entity-behaviour](/entity-behaviour.md), [camera-fly-behaviour](/camera-fly-behaviour.md).