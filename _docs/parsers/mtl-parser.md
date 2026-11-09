## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| MtlParser | parsers/mtl-parser.md |

This component is responsible for parsing the contents of a Wavefront .mtl (Material Template Library) file string. Its primary responsibility is to read the raw, line-based material definitions from the file and transform them into a structured, usable object format, specifically `ParsedMtlData`.

The `MtlParser` acts as a dedicated data ingestion service within the application's asset pipeline. It consumes raw text data and populates the structured material definitions, which are then likely consumed by rendering or asset management systems that rely on the data structures defined in `/parsers/interfaces.md`.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| MtlParser | Class | Provides methods to parse MTL content and manage the parsing state. |
| parse(mtlContent: string): ParsedMtlData | Method | Parses the entire MTL content string, returning an object containing all defined materials keyed by name. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The parser iterates over lines of the input string, skipping comments and empty lines. It uses a state machine approach, tracking the `currentMaterial`. Based on the line's prefix (`newmtl`, `Ns`, `Kd`, etc.), it calls specialized handlers to either create a new material object or set specific properties (numeric, color, texture map) on the active material.
- **Side Effects:** None. The component operates purely on the input string and internal state, producing a new data structure.
- **Error Handling:** The parser handles malformed lines by ignoring them if the prefix is unknown. Numeric parsing uses `parseFloat` and checks for `isNaN` to prevent invalid data from corrupting the material properties.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** `gl-matrix`
- **Internal:** [interfaces](/parsers/interfaces.md)