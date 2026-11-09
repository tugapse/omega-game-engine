## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| entities/index | /entities/index.md |

This component serves as the primary aggregation point for all core entity definitions within the application. Its main responsibility is to export a unified interface, allowing consumers to import all fundamental building blockssuch as lights, cameras, generic entities, scenes, etc.from a single, centralized location. This pattern promotes clean dependency management and simplifies the codebase structure.

Architecturally, this file acts as a facade or barrel file for the entire entity subsystem. It consolidates exports from specific submodules like [lights](/entities/lights.md), [camera](/entities/camera.md), [entity](/entities/entity.md), and [scene](/entities/scene.md). This centralization ensures that the application's data model and scene graph components are easily discoverable and consistently imported across the project.

## 2. Public API & Interfaces
This file contains no public exports.

## 3. Implementation Details & Side Effects
Structural definitions only; no complex logic or side effects.

## 4. Dependencies & Configuration
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** None.

- **Internal:** [lights](/entities/lights.md), [camera](/entities/camera.md), [entity](/entities/entity.md), [scene](/entities/scene.md)