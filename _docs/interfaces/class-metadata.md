## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| ClassMetadata | interfaces/class-metadata.md |

This component defines the `ClassMetadata` interface, which serves as a standardized contract for describing a class within the system. Its primary responsibility is to encapsulate essential metadatasuch as the class's name, its operational type, and its physical locationallowing the engine to manage and reference different classes consistently across the application.

This interface acts as a core data model within the application's structure. It is used by various parts of the engine, particularly those responsible for reflection, loading, and routing, to understand the nature and location of any given class instance or definition, often in conjunction with the `ClassType` enum found in `/enums/class-type.enum.md`.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| ClassMetadata | Interface | Defines the structure for metadata associated with a class, including its name, type, path, and optional description. |

## 3. Implementation Details & Side Effects
Structural definitions only; no complex logic or side effects.

## 4. Dependencies & Configuration
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** None.

- **Internal:** [class-type](/enums/class-type.md)