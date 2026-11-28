## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| **interfaces.ts** | [parsers/interfaces.ts](/parsers/interfaces.ts) |

This component defines the core data structures used to represent geometry and material properties parsed from standard 3D file formats like OBJ and MTL. It establishes contracts for how raw file data is transformed into structured, usable data ready for rendering pipelines.

It serves as the primary data model layer for the parsing subsystem. By defining interfaces such as [ParsedObjData](/parsers/interfaces.ts.md), [ObjFace](/parsers/interfaces.ts.md), and [MtlMaterial](/parsers/interfaces.ts.md), it ensures type safety and consistency across the application when handling imported assets.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| `ParsedObjData` | Interface | Represents the consolidated mesh data parsed from an OBJ file, ready for use in a graphics API like WebGL. |
| `ObjFace` | Interface | Represents a single face (polygon) as defined in the OBJ file, storing 0-based indices to original vertex, UV, and normal lists. |
| `MtlMaterial` | Interface | Represents a single material definition parsed from an MTL file, containing properties like color, shininess, and texture map paths. |
| `ParsedMtlData` | Interface | Holds a collection of materials parsed from an MTL file, mapped by their material names. |

## 3. Implementation Details & Side Effects
Structural definitions only; no complex logic or side effects.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** `gl-matrix`
- **Internal:** None