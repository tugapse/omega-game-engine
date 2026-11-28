## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| FbxReader | [src/parsers/fbx/fbx-reader.ts](/src/parsers/fbx/fbx-reader.ts) |

This component is responsible for parsing and deserializing data from FBX files, supporting both binary and ASCII formats. Its primary responsibility is to transform the raw binary or text stream of an FBX file into a structured, in-memory tree representation defined by the `FbxNode` interface. It handles version checking, format detection, and the complex process of inflating compressed binary arrays.

This module acts as a core data ingestion service within the application's parsing layer. It interfaces with the data model defined by `FbxNode` and `FbxProp`, providing high-level asynchronous functions like `readFbx` to consumers. It relies on internal logic within the `Reader` class to manage the parsing state, distinguishing between binary and ASCII parsing paths.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| `FbxNode` | Interface | Defines the structure of a node in the FBX hierarchy, containing a name, properties, and child nodes. |
| `FbxProp` | Type | A union type representing the various data types a property can hold (number, boolean, string, typed arrays, etc.). |
| `fbxVersion` | Function | Checks the header of an `ArrayBuffer` to determine the FBX version, returning the version number or `null` if it's not a recognized binary FBX file. |
| `isFbx` | Function | Determines if a given `ArrayBuffer` is an FBX file by checking for binary or ASCII markers. |
| `isAsciiFbx` | Function | Checks if an `ArrayBuffer` contains markers indicative of an ASCII FBX file. |
| `readFbx` | Function | Asynchronously reads an FBX file from an `ArrayBuffer`, returning the version and the root node array. Handles both binary (with decompression) and ASCII parsing. |
| `fbxChild` | Function | Searches a given `FbxNode` to find the first child node matching a specific name. |
| `fbxValue` | Function | Retrieves the first property value from a specific child node identified by name. |
| `readAsciiFbx` | Function | Synchronously parses an ASCII FBX file provided as a string into the node tree structure. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The binary parsing relies on the `Reader` class, which iteratively reads node headers to build the tree. Property reading involves a type-switch based on a single-byte type identifier. Compressed arrays ('f', 'd', 'l', 'i', 'b') are queued in `PendingArray` structures and inflated asynchronously using `DecompressionStream` via `inflateInto`. The ASCII parser uses a custom `AsciiTokens` class to tokenize the input string, recursively building the tree structure based on braces `{}`.
- **Side Effects:** The `readFbx` function involves asynchronous operations (`Promise.all` and `DecompressionStream`) which can interact with browser/Node environment features for decompression. The ASCII parser uses `atob` for base64 decoding, which is an environment operation.
- **Error Handling:** Throws an `Error` if the file is not recognized as FBX, if the version is unsupported (pre-7.x), or if an unknown FBX property type is encountered during binary parsing.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** `TextDecoder`, `DataView`, `Uint8Array`, `ArrayBuffer`, `Blob`, `DecompressionStream`, `Response` (Browser/Node APIs).
- **Internal:** None.