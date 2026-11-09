## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| EntityType | enums/entity-type.enum.md |

This component defines a strongly-typed enumeration, `EntityType`, which serves as a canonical identifier for every distinct type of object or entity within the engine's runtime environment. Its primary responsibility is to provide a fixed, predictable set of constants that dictate the fundamental nature of an entity, such as whether it is a light source, a camera, or static geometry.

This enum functions as a core data model component, central to the engine's serialization and entity management systems. By using these defined types, other systemslike the rendering pipeline or scene graph managercan reliably interpret and process entities without needing to rely on ambiguous string identifiers. It is a foundational piece of the engine's data structure layer.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| EntityType | Enum | Defines the fixed types for entities in the engine, including `STATIC`, `LIGHT_AMBIENT`, `LIGHT_DIRECTIONAL`, `LIGHT_POINT`, `LIGHT_SPOT`, `CAMERA`, and `SCENE`. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The component defines a set of named integer constants. The numerical values are assigned sequentially, starting from -1, to facilitate efficient serialization and comparison across different engine subsystems.
- **Side Effects:** None.
- **Error Handling:** None.

## 4. Dependencies & Configuration
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** None.

- **Internal:** None.