## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | interfaces.ts |
| Source file | src/parsers/interfaces.ts |

The **interfaces.ts** component serves as the structural blueprint for data exchange within the parsing subsystem. It defines the formal contracts for how raw 3D model data (specifically OBJ and MTL formats) is structured after being processed, ensuring type safety and predictable data shapes for downstream consumers.

**Functional Mission**
The primary responsibility of **interfaces.ts** is to provide a centralized set of TypeScript interfaces that standardize the representation of parsed geometric and material data. It solves the problem of data inconsistency by defining exactly how vertex attributes, face indices, and material properties must be shaped before they are passed to the engine's core mesh or material systems.

**System Context & Integration**
This component acts as the data-contract layer between the low-level parsers and the high-level engine entities. Specifically, it provides the output structures used by [obj-parser](/AgentDocs/parsers/obj-parser.md) and [mtl-parser](/AgentDocs/parsers/mtl-parser.md). Once the parsers populate these interfaces, the resulting data is typically consumed by [mesh](/AgentDocs/core/mesh.md) components or [lit-material](/AgentDocs/materials/lit-material.md) to instantiate renderable objects within the [scene](/AgentDocs/entities/scene.md).

## 2. Environment & Configuration
**Environment Lookups:**
No environment lookups identified.

**Hardcoded Constants:**
No hardcoded constants identified.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `ParsedObjData` | Interface | Defines the final, flattened buffer structure (vertices, normals, uvs, indices) optimized for GPU upload. |
| `ObjFace` | Interface | Defines the intermediate structure for a single polygon, mapping local indices to original attribute lists. |
| `MtlMaterial` | Interface | Defines the properties of a material, including colors (Ka, Kd, Ks, Ke), shininess (Ns), and texture map paths. |
| `ParsedMtlData` | Interface | A dictionary-style mapping of material names to their respective `MtlMaterial` definitions. |

## 4. Execution Logic & Flow
Direct exports or structural definitions only; no internal logic flow.

## 5. Resource Dependencies
- **Standard Libraries**: None
- **Internal Modules**: 
    - None
- **External Packages**: 
    - `gl-matrix` (via `vec4`)