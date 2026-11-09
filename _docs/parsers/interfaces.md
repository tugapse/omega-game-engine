## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| Parsers interfaces | parsers/interfaces.md |

This component defines the strict data structures (interfaces) used throughout the engine for representing geometry and material data parsed from standard 3D file formats like OBJ and MTL. It serves as the canonical contract for how raw file data is transformed into usable, structured objects ready for rendering pipelines.

This file acts as a core data model layer within the application architecture. It dictates the shape of data passed between the file parsing services and the rendering/scene management systems, ensuring type safety across the application boundary.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| ParsedObjData | Interface | Represents the consolidated mesh data parsed from an OBJ file, ready for use in a graphics API like WebGL. |
| ObjFace | Interface | Represents a single face (polygon) as defined in the OBJ file, storing 0-based indices to original vertex, UV, and normal lists. |
| MtlMaterial | Interface | Represents a single material definition parsed from an MTL file. |
| ParsedMtlData | Interface | Holds a collection of materials parsed from an MTL file, mapped by their material names. |

## 3. Implementation Details & Side Effects
Structural definitions only; no complex logic or side effects.

## 4. Dependencies & Configuration
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** `gl-matrix`
- **Internal:** None