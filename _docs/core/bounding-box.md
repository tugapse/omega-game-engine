## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| BoundingBox, BoundingSphere | core/bounding-box.md |

This component provides fundamental geometric primitives for spatial representation in 3D space: the Axis-Aligned Bounding Box (`BoundingBox`) and the Bounding Sphere (`BoundingSphere`). These structures are essential for efficient collision detection, spatial partitioning, and frustum culling within the engine. They encapsulate the necessary parameters (min/max coordinates or center/radius) to define a volume or a sphere.

These classes serve as core data models within the engine's geometry and physics subsystems. They inherit from `JsonSerializable`, indicating their role as serializable data structures that can be persisted or transmitted across system boundaries, fitting into the application's data model layer.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| BoundingBox | Class | Represents an AABB defined by min/max coordinates. Provides getters for width, height, and depth. |
| BoundingSphere | Class | Represents a 3D sphere defined by its center coordinates and radius. |
| BoundingBox.width | Getter | Returns the size of the box along the X-axis ($\text{max\_x} - \text{min\_x}$). |
| BoundingBox.height | Getter | Returns the size of the box along the Y-axis ($\text{max\_y} - \text{min\_y}$). |
| BoundingBox.depth | Getter | Returns the size of the box along the Z-axis ($\text{max\_z} - \text{min\_z}$). |

## 3. Implementation Details & Side Effects
- **Core Logic:** `BoundingBox` calculates its dimensions (width, height, depth) by subtracting the minimum coordinate from the maximum coordinate along each respective axis. `BoundingSphere` is a simple data container holding the center point and radius.
- **Side Effects:** None.
- **Error Handling:** None.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** None.
- **Internal:** [json-serializable](/core/json-serializable.md)