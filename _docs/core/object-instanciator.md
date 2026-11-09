## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| ObjectInstanciator | core/object-instanciator.md |

This component provides a centralized, static utility for managing and dynamically creating instances of classes based on string identifiers. Its primary responsibility is to decouple the instantiation logic from the calling code, allowing objects to be reconstructed reliably, especially when deserializing data structures (like JSON) that only contain class names.

It functions as a core service layer within the application architecture. It acts as a registry, holding references to constructors or factory functions, which are then retrieved and executed by methods like `instanciateObjectFromJsonData`. This pattern is crucial for implementing a robust dependency injection system and enabling runtime type resolution across the application, interacting with metadata stored in [class-metadata](/interfaces/class-metadata.md).

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| ObjectInstanciator.addDependency | Method | Registers a class constructor or factory function under a specific string name, optionally storing associated metadata. |
| ObjectInstanciator.getDependency | Method | Retrieves the registered function associated with a given class name, throwing an error if not found. |
| ObjectInstanciator.instanciateObjectFromJsonData | Method | Instantiates an object by looking up its class name and executing the corresponding constructor or factory, optionally passing arguments. |
| ObjectInstanciator.getMetadata | Method | Retrieves metadata for registered classes, allowing filtering by one or more specified [class-type](/enums/class-type.enum.md). |

## 3. Implementation Details & Side Effects
- **Core Logic:** The component maintains two static maps: `dependecies` (mapping class names to functions) and `metadata` (mapping class names to `ClassMetadata`). `addDependency` populates these maps. `instanciateObjectFromJsonData` checks the `dependecies` map; if found, it executes the stored function, passing arguments if provided, and returns the resulting instance. `getMetadata` filters the stored metadata based on provided `ClassType` values.

- **Side Effects:** It mutates its internal static state (`dependecies` and `metadata`) when `addDependency` is called. It also logs a warning to the console when `instanciateObjectFromJsonData` is called for an unregistered class.

- **Error Handling:** `getDependency` explicitly throws an `Error` if the requested class name is not present in the dependency map. `instanciateObjectFromJsonData` handles missing dependencies by logging a warning and returning `undefined`.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** None
- **Internal:** [class-type](/enums/class-type.enum.md), [class-metadata](/interfaces/class-metadata.md)