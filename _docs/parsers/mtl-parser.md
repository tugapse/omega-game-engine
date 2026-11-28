## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| MtlParser | [src/parsers/mtl-parser.ts](/src/parsers/mtl-parser.ts) |

This component is responsible for parsing the contents of a Wavefront .mtl (Material Template Library) file string. Its primary responsibility is to ingest raw text data representing material definitions and convert it into a structured, usable object format, specifically `ParsedMtlData`.

The `MtlParser` acts as a specialized data ingestion service within the application's parsing layer. It consumes raw file content and populates the `ParsedMtlData` structure, which is then used by downstream systems, such as rendering pipelines, to access material properties like color, texture maps, and shininess.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| MtlParser | Class | Provides methods to parse MTL content and manage the parsing state. |
| parse(mtlContent: string): ParsedMtlData | Method | Parses the entire MTL file content string, returning a map of all defined materials. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The parser iterates over lines of the input string. It uses a state machine approach, tracking the `currentMaterial`. Based on the line's prefix (`newmtl`, `Ns`, `Ka`, etc.), it invokes specialized handlers (`handleNewMaterial`, `setNumericProperty`, etc.) to populate the current material object. Numeric and color properties are converted into appropriate data types, utilizing `vec4` from `gl-matrix` for color representation.
- **Side Effects:** None. The component operates purely on the input string and internal state variables.
- **Error Handling:** The parser handles malformed lines by skipping them or by checking if `parseFloat` results in `NaN`, preventing invalid data from corrupting the material properties.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** `gl-matrix`
- **Internal:** [./interfaces](/src/parsers/interfaces.md)