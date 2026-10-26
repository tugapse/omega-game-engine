## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | EventEmitter |
| Source file | event-emitter.ts |

The **EventEmitter** serves as a fundamental communication primitive within the engine, providing a decoupled mechanism for object-to-object signaling. By implementing the Observer pattern, it allows disparate modules to communicate via named events without requiring direct dependencies on one another, thereby reducing architectural coupling.

**Functional Mission**
The primary responsibility of the **EventEmitter** is to manage a registry of callback functions associated with specific string-based event identifiers. It solves the problem of synchronous or asynchronous notification dispatching, acting as a lightweight message bus that facilitates the "publish-subscribe" pattern.

**System Context & Integration**
This component acts as a low-level utility used by higher-level managers and systems to broadcast state changes or lifecycle hooks. For instance, it provides the underlying logic that could be utilized by the [Engine Event Manager](/AgentDocs/managers/engine-event-manager.md) to coordinate complex system-wide notifications. It handles the transition of arbitrary data payloads from an emitter to all registered subscribers, ensuring that downstream modules can react to engine events (such as input, rendering updates, or scene changes) in a controlled manner.

## 2. Environment & Configuration
**Environment Lookups:**
- No environment lookups identified.

**Hardcoded Constants:**
- No hardcoded constants identified.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `EventEmitter` | Class | Provides the core infrastructure for event subscription and dispatching. |
| `on` | Method | Registers a callback function to a specific event key within the internal listener map. |
| `emit` | Method | Iterates through the registered callbacks for a given event key and executes them with the provided data. |

## 4. Execution Logic & Flow
- **Initialization**: The class initializes an empty `Map` named `listeners`, where keys are strings (event names) and values are arrays of `Function` objects.
- **Data Path**: 
    1. **Subscription (`on`)**: `event (string)` + `callback (Function)` $\rightarrow$ Check if key exists in `listeners` $\rightarrow$ If not, initialize empty array $\rightarrow$ Push `callback` to array.
    2. **Emission (`emit`)**: `event (string)` + `data (any)` $\rightarrow$ Check if key exists in `listeners` $\rightarrow$ Retrieve array $\rightarrow$ Execute each `callback` in the array passing `data` as the argument.
- **Conditional Branching**: 
    - In `on`: Checks `this.listeners.has(event)` to prevent errors when accessing a non-existent key before pushing a new listener.
    - In `emit`: Checks `this.listeners.has(event)` to ensure the loop only executes if there are active subscribers for the requested event.

## 5. Resource Dependencies
- **Standard Libraries**: None
- **Internal Modules**: 
    - None
- **External Packages**: None