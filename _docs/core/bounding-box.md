## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| BoundingBox, BoundingSphere | [src/core/bounding-box.ts](/src/core/bounding-box.ts) |

This component defines geometric primitives used for spatial representation in 3D space: `BoundingBox` and `BoundingSphere`. The `BoundingBox` encapsulates a volume using minimum and maximum coordinates along the X, Y, and Z axes, while `BoundingSphere` defines a volume using a central point and a radius. These structures are fundamental for collision detection, spatial partitioning, and object containment checks within the system.

These classes serve as core data models within the application's geometry subsystem. They inherit from `JsonSerializable`, indicating they are designed to be easily serialized and deserialized, fitting into the application's data persistence or network communication layers alongside other models like [JsonSerializable](/src/core/json-serializable.md).

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| BoundingBox | Class | Represents a 3D bounding box defined by its minimum and maximum coordinates. |
| BoundingBox.width | Getter | Returns the width (max_x - min_x) of the bounding box. |
| BoundingBox.height | Getter | Returns the height (max_y - min_y) of the bounding box. |
| BoundingBox.depth | Getter | Returns the depth (max_z - min_z) of the bounding box. |
| BoundingSphere | Class | Represents a 3D bounding sphere defined by its center and radius. |

## 3. Implementation Details & Side Effects
- **Core Logic:** `BoundingBox` calculates its dimensions (width, height, depth) by subtracting the minimum coordinate from the corresponding maximum coordinate. Both classes utilize a constructor that calls `super()` to initialize the `JsonSerializable` base class with a descriptive type name.
- **Side Effects:** None.
- **Error Handling:** None.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** None.
- **Internal:** [JsonSerializable](/src/core/json-serializable.md)