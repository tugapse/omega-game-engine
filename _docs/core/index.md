## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| index | /core/index.md |

This file serves as the primary public entry point and aggregation layer for the core functionalities of the engine. It exports a comprehensive collection of modules, allowing consumers to import specific, well-defined subsystemssuch as rendering, input handling, vector mathematics, and scene managementfrom a single, unified location.

Architecturally, this component acts as a facade or barrel file. It centralizes access to the engine's various services, ensuring that consumers interact with the system through a predictable, high-level interface rather than needing to know the exact internal location of every dependency like [bounding-box](/core/bounding-box.md) or [transform](/core/transform.md).

## 2. Public API & Interfaces
This file contains no public exports.

## 3. Implementation Details & Side Effects
Structural definitions only; no complex logic or side effects.

## 4. Dependencies & Configuration
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** None.

- **Internal:** [bounding-box](/core/bounding-box.md), [camera-ubo](/core/camera-ubo.md), [canvas-viewport](/core/canvas-viewport.md), [color](/core/color.md), [colors](/core/colors.md), [engineCache](/core/engineCache.md), [event-emitter](/core/event-emitter.md), [input](/core/input.md), [json-serializable](/core/json-serializable.md), [mesh](/core/mesh.md), [object-instanciator](/core/object-instanciator.md), [range](/core/range.md), [scene-fog](/core/scene-fog.md), [transform](/core/transform.md), [vector](/core/vector.md), [render](/core/render.md).