## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| SceneEntityBehaviour | interfaces/scene-behaviour.md |

This interface defines a contract for entity behaviours that require granular control over the entity's lifecycle relative to the main game loop. It extends the base `EntityBehaviour` by introducing specific hooks`beforeUpdate`, `afterUpdate`, `beforeDraw`, and `afterDraw`allowing developers to inject custom logic at precise moments during the frame processing cycle.

This component serves as a structural definition within the application's behaviour management system. It dictates the expected structure for any behaviour that needs to participate in the full rendering and simulation pipeline, ensuring that all implementing classes adhere to a standardized lifecycle pattern for integration with the core engine loop.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| SceneEntityBehaviour | Interface | Extends `EntityBehaviour` and adds lifecycle hooks for frame-based operations. |
| beforeUpdate | Method | Called before the main update loop. Accepts the elapsed time in milliseconds. |
| afterUpdate | Method | Called after the main update loop completes. |
| beforeDraw | Method | Called immediately before the main drawing process begins. |
| afterDraw | Method | Called immediately after the main drawing process concludes. |

## 3. Implementation Details & Side Effects
Structural definitions only; no complex logic or side effects.

## 4. Dependencies & Configuration
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** None
- **Internal:** [EntityBehaviour](/behaviours/entity-behaviour.md)