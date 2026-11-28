## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| **index** | [parsers/fbx/index.ts](/parsers/fbx/index.ts) |

This component serves as the primary entry point and aggregation layer for FBX file parsing functionality within the system. Its main responsibility is to expose the core FBX reading and parsing capabilities by re-exporting specific modules from its subdirectories.

Architecturally, this file acts as a facade or barrel file within the parsers subsystem. It aggregates functionality from specific implementation modules, namely [fbx-reader](/parsers/fbx/fbx-reader.md) and [fbx-parser](/parsers/fbx/fbx-parser.md), allowing consumers to import the entire FBX parsing suite from a single, unified location.

## 2. Public API & Interfaces
This file contains no public exports.

## 3. Implementation Details & Side Effects
Structural definitions only; no complex logic or side effects.

## 4. Dependencies & Configuration
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** None
- **Internal:** [fbx-reader](/parsers/fbx/fbx-reader.md), [fbx-parser](/parsers/fbx/fbx-parser.md)