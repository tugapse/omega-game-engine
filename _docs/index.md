## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| **index.ts** | [src/index.ts](/src/index.ts) |

This file serves as the primary barrel export for the entire engine module. Its core responsibility is to aggregate and expose all major subsystems, components, and utilities defined across the various subdirectories of the project. By consolidating exports, it provides a single, high-level entry point for consumers of the engine API.

Architecturally, this component acts as the root facade or public interface layer for the entire application. It makes the functionality of specialized modules—such as [audio](/src/audio.md), [physics](/src/physics.md), [core](/src/core.md), and [engine](/src/engine.md)—available through a unified namespace, allowing consumers to interact with the entire system without needing to know the internal structure of every sub-module.

## 2. Public API & Interfaces
This file contains no public exports.

## 3. Implementation Details & Side Effects
Structural definitions only; no complex logic or side effects.

## 4. Dependencies & Configuration
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** None
- **Internal:** [audio](/src/audio.md), [behaviours](/src/behaviours.md), [core](/src/core.md), [entities](/src/entities.md), [enums](/src/enums.md), [interfaces](/src/interfaces.md), [managers](/src/managers.md), [materials](/src/materials.md), [parsers](/src/parsers.md), [primitives](/src/primitives.md), [shaders](/src/shaders.md), [textures](/src/textures.md), [engine](/src/engine.md), [animation](/src/animation.md), [model](/src/model.md), [physics](/src/physics.md), [terrain](/src/terrain.md)