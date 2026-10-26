## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | MtlParser |
| Source file | mtl-parser.ts |

The **MtlParser** is a specialized utility class designed to interpret and transform Wavefront .mtl (Material Template Library) file contents into structured data. It acts as a bridge between raw text-based material definitions and the engine's internal material representation, ensuring that visual properties like diffuse color, specular coefficients, and texture maps are correctly typed and ready for engine consumption.

**Functional Mission**
The primary responsibility of **MtlParser** is to parse string-based MTL data and convert it into a `ParsedMtlData` object. It solves the problem of translating human-readable material parameters (such as `Ka`, `Kd`, and `map_Kd`) into machine-efficient formats, specifically converting RGB color triplets into `vec4` structures and handling the inversion of transparency values (`Tr` to `d`).

**System Context & Integration**
This component functions as a critical stage in the asset ingestion pipeline. It is typically invoked following the parsing of an .obj file by the [obj-parser](/AgentDocs/parsers/obj-parser.md) to resolve the material references defined within the geometry. The output of this parser provides the necessary data to instantiate [MtlMaterial](/AgentDocs/parsers/interfaces.md) objects, which are subsequently used by shaders and renderers to define the visual surface properties of meshes within the [scene](/AgentDocs/entities/scene.md).

## 2. Environment & Configuration
**Environment Lookups:**
- No environment lookups identified.

**Hardcoded Constants:**
- `1.0` (Default: `1.0`)  Used as the Alpha component in `vec4` color conversions and as the base for inverting transparency (`Tr`) values.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `MtlParser` | Class | Orchestrates the parsing of MTL file strings into structured material objects. |
| `parse` | Method | The public entry point that accepts a string, iterates through lines, and returns `ParsedMtlData`. |
| `resetParser` | Method | Clears internal state (`parsedMaterials` and `currentMaterial`) to ensure a clean slate for new parsing tasks. |
| `handleNewMaterial` | Method | Manages the lifecycle of material objects by committing the previous material and initializing a new one upon encountering `newmtl`. |
| `setNumericProperty` | Method | Parses and assigns scalar values (e.g., `Ns`, `Ni`, `d`, `illum`) to the current material, with optional inversion logic. |
| `setColorProperty` | Method | Parses RGB triplets and converts them into `vec4` objects for color properties (`Ka`, `Kd`, `Ks`, `Ke`). |
| `setTextureMapProperty` | Method | Extracts file paths for texture maps (e.g., `map_Kd`) from the input string. |

## 4. Execution Logic & Flow
- **Initialization**: The parser starts with an empty `parsedMaterials` object and a `null` `currentMaterial` reference.
- **Data Path**: 
    1. **Input**: A raw string containing MTL file content.
    2. **Line Processing**: The string is split by newlines; empty lines and comments (`#`) are discarded.
    3. **Tokenization**: Each line is split by whitespace to identify the `prefix` (command) and subsequent `parts` (values).
    4. **Dispatch**: A `switch` statement routes the command to specific handlers (`setNumericProperty`, `setColorProperty`, or `setTextureMapProperty`).
    5. **Transformation**: 
        - Colors are transformed from `[R, G, B]` strings to `vec4(R, G, B, 1.0)`.
        - Transparency (`Tr`) is transformed via `1.0 - value` to satisfy the `d` (dissolve) property requirement.
    6. **Output**: A `ParsedMtlData` object containing all successfully parsed materials.
- **Conditional Branching**:
    - If `newmtl` is encountered, the parser checks if a `currentMaterial` is already being processed; if so, it saves it to the collection before starting the new one.
    - If a property is encountered before any `newmtl` declaration, the property is ignored (due to the `!this.currentMaterial` guard).
    - The final material in the file is explicitly saved after the loop completes to ensure the last block is not lost.

## 5. Resource Dependencies
- **Standard Libraries**: None identified.
- **Internal Modules**: 
    - [MtlMaterial](/AgentDocs/parsers/interfaces.md)
    - [ParsedMtlData](/AgentDocs/parsers/interfaces.md)
- **External Packages**: 
    - `gl-matrix` (specifically `vec4`)