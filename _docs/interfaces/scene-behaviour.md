## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| SceneEntityBehaviour | [src/interfaces/scene-behaviour.ts](/src/interfaces/scene-behaviour.ts) |

This interface defines a contract for entity behaviours that require explicit lifecycle hooks around the main game loop operations. It mandates specific methods that must be implemented to control execution flow before and after updates, and before and after rendering.

This component serves as a structural definition within the engine's behaviour system. It extends the base [EntityBehaviour](/src/behaviours/entity-behaviour.ts) and dictates the specific points at which custom logic (like input handling, state changes, or rendering preparation) can be injected into the core engine loop, acting as a high-level interface for scene-aware logic.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| SceneEntityBehaviour | Interface | Extends `EntityBehaviour` and requires implementation of lifecycle methods: `beforeUpdate(ellapsed: number): void`, `afterUpdate(): void`, `beforeDraw(): void`, and `afterDraw(): void`. |

## 3. Implementation Details & Side Effects
Structural definitions only; no complex logic or side effects.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** None
- **Internal:** [../behaviours/entity-behaviour](/src/behaviours/entity-behaviour.ts)