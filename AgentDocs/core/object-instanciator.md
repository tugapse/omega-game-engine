## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | ObjectInstanciator |
| Source file | object-instanciator.ts |

The **ObjectInstanciator** serves as a centralized service provider for dependency injection and dynamic object creation within the engine. It acts as a registry that maps string-based identifiers to specific class constructors or factory functions, enabling the system to reconstruct complex object graphs from serialized data formats.

**Functional Mission**
The primary responsibility of **ObjectInstanciator** is to decouple the definition of a class from its instantiation process. By providing a mechanism to register dependencies and retrieve them via string keys, it solves the problem of dynamic type resolution, which is critical for deserialization workflows where the specific class type is only known at runtime via JSON data.

**System Context & Integration**
This component sits at a foundational level of the engine's lifecycle, acting as a bridge between raw data (such as JSON) and live engine entities. It is heavily utilized during scene loading or state restoration, where it transforms serialized definitions into functional instances. It integrates closely with [ClassMetadata](/AgentDocs/interfaces/class-metadata.md) to provide discovery capabilities, allowing editor tools or scene managers to query available classes based on their [ClassType](/AgentDocs/enums/class-type.enum.md).

- **INTERNAL REFERENCES**: [ClassMetadata](/AgentDocs/interfaces/class-metadata.md), [ClassType](/AgentDocs/enums/class-type.enum.md).

## 2. Environment & Configuration
**Environment Lookups:**
- No environment lookups identified.

**Hardcoded Constants:**
- No hardcoded constants identified.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `addDependency` | Static Method | Registers a constructor or factory function and optional metadata to the internal registry. |
| `getDependency` | Static Method | Retrieves a registered function by its string key; throws an error if the key is missing. |
| `instanciateObjectFromJsonData` | Static Method | Dynamically creates an instance of a registered class using provided arguments. |
| `getMetadata` | Static Method | Returns an array of [ClassMetadata](/AgentDocs/interfaces/class-metadata.md), optionally filtered by [ClassType](/AgentDocs/enums/class-type.enum.md). |

## 4. Execution Logic & Flow
- **Initialization**: The class initializes two private static maps: `dependecies` (storing functions) and `metadata` (storing [ClassMetadata](/AgentDocs/interfaces/class-metadata.md)).
- **Data Path (Instantiation)**: 
    1. Input: `className` (string) and optional `args` (array).
    2. Processing: Checks if `className` exists in the `dependecies` map.
    3. Execution: If found, calls the function with spread `args`. If `args` is empty, calls the function without arguments.
    4. Output: Returns the instantiated object of type `T` or `undefined` if the class is missing.
- **Conditional Branching**:
    - **Dependency Check**: In `getDependency`, if the key is not found, an `Error` is thrown to halt execution.
    - **Metadata Filtering**: In `getMetadata`, if `types` is provided, the logic converts the input to an array and performs a `.filter()` operation against the registered metadata.
    - **Existence Check**: In `instanciateObjectFromJsonData`, if the class is not found, a warning is logged to the console instead of throwing an error.

## 5. Resource Dependencies
- **Standard Libraries**: None identified.
- **Internal Modules**: 
    - [ClassType](/AgentDocs/enums/class-type.enum.md)
    - [ClassMetadata](/AgentDocs/interfaces/class-metadata.md)
- **External Packages**: None identified.