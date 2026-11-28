## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| EntityType | [enums/entity-type.enum.ts](/enums/entity-type.enum.ts) |

This component defines the `EntityType` enumeration, which serves as a standardized, immutable set of identifiers for classifying different types of entities within the engine's simulation or scene graph. The use of numerical values is critical for efficient serialization, allowing the engine to persist and reconstruct entity types reliably across sessions.

This enumeration functions as a core data model component, providing a canonical vocabulary for entity classification. It is referenced by other systems, such as entity managers or rendering pipelines, to determine how an entity should be processed, rendered, or interacted with, linking directly to the overall scene structure managed by components like [SCENE](/enums/entity-type.enum.ts).

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| EntityType | Enum | Defines distinct types for entities such as `STATIC`, `LIGHT_AMBIENT`, `CAMERA`, and `SCENE`. |

## 3. Implementation Details & Side Effects
Structural definitions only; no complex logic or side effects.

## 4. Dependencies & Configuration
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** None
- **Internal:** None