## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| ObjectInstanciator | [src/core/object-instanciator.ts](/src/core/object-instanciator.ts) |

This component provides a centralized, static mechanism for managing and instantiating objects based on registered class names. It acts as a dependency resolver and factory, allowing the application to create instances of classes dynamically without hardcoding instantiation logic throughout the codebase.

It functions as a core service layer component, sitting between configuration/data sources and the business logic. It relies on registered metadata, potentially sourced from components like [ClassMetadata](/interfaces/class-metadata.md), to manage object creation lifecycle.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| `ObjectInstanciator.addDependency` | Method | Registers a class constructor or factory function under a specific class name, optionally associating it with metadata. |
| `ObjectInstanciator.getDependency` | Method | Retrieves the registered function associated with a given class name. |
| `ObjectInstanciator.instanciateObjectFromJsonData` | Method | Instantiates an object using the registered dependency for a class name, optionally passing constructor arguments. |
| `ObjectInstanciator.getMetadata` | Method | Retrieves metadata objects associated with registered classes, allowing filtering by specific [ClassType](/enums/class-type.enum.md). |

## 3. Implementation Details & Side Effects
- **Core Logic:** The component maintains two static maps: `dependecies` for storing the instantiation functions and `metadata` for storing associated metadata objects. `addDependency` populates these maps. `instanciateObjectFromJsonData` checks for the dependency, and if found, executes the associated function, passing arguments if provided. `getMetadata` iterates over all stored metadata and filters them based on the provided `types`.
- **Side Effects:** The `instanciateObjectFromJsonData` method calls `console.warn` if a requested class is not found in the dependencies map.
- **Error Handling:** If a class name is not found in `dependecies`, `instanciateObjectFromJsonData` logs a warning via `console.warn` and returns `undefined`.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** None
- **Internal:** [../enums/class-type.enum](/src/enums/class-type.enum.ts), [../interfaces/class-metadata](/src/interfaces/class-metadata.ts)