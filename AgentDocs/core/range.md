## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | NumberRange |
| Source file | range.ts |

The **NumberRange** component serves as a specialized utility for managing numeric values that must adhere to specific boundary constraints. It provides a robust mechanism for clamping values within a defined minimum and maximum interval, ensuring that any state changes to the value remain within valid mathematical or logical bounds.

**Functional Mission**
The primary responsibility of **NumberRange** is to enforce data integrity for numeric properties that require strict boundary control and optional stepping. It solves the problem of "out-of-bounds" errors in engine parameters (such as light intensity, camera FOV, or color channels) by automatically re-clamping the internal value whenever the bounds or the value itself are modified.

**System Context & Integration**
This component acts as a foundational data structure within the core logic. By extending [JsonSerializable](/AgentDocs/core/json-serializable.md), it integrates seamlessly into the engine's serialization pipeline, allowing range-constrained properties to be saved and restored from JSON state. It is designed to be used as a property type within larger entities or configuration objects, providing a self-validating interface for numeric state.

## 2. Environment & Configuration
**Environment Lookups:**
- No environment lookups identified.

**Hardcoded Constants:**
- `Range` (via `constructor`)  The type identifier used during serialization.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `NumberRange` | Class | Manages a numeric value constrained by `min`, `max`, and `step` bounds. |
| `value` | Getter/Setter | Accesses or updates the current value, triggering automatic clamping. |
| `min` | Getter/Setter | Accesses or updates the lower bound; adjusts `max` if bounds cross. |
| `max` | Getter/Setter | Accesses or updates the upper bound; adjusts `min` if bounds cross. |
| `step` | Getter/Setter | Accesses or updates the numeric increment interval. |
| `toJsonObject` | Method | Serializes the range state (min, max, step, value) into a JSON-compatible object. |
| `fromJson` | Method | Populates the range state from a provided JSON object. |

## 4. Execution Logic & Flow
- **Initialization**: The constructor accepts `_value`, `_min`, `_max`, and `_step`. It initializes the class type as 'Range' via the `super` call to [JsonSerializable](/AgentDocs/core/json-serializable.md).
- **Data Path (Clamping Logic)**:
    1. **Input**: A new numeric value is provided via the `value` setter.
    2. **Processing**: The engine executes `Math.max(this._min, Math.min(this._max, value))`.
    3. **Output**: The `_value` property is updated to the clamped result.
- **Conditional Branching (Bound Integrity)**:
    - **Min Adjustment**: If `set min(min)` is called and the new `min` > current `max`, the `max` is automatically updated to equal the new `min`.
    - **Max Adjustment**: If `set max(max)` is called and the new `max` < current `min`, the `min` is automatically updated to equal the new `max`.
    - **Re-validation**: Both bound setters trigger a re-clamp of the current `_value` to ensure it remains valid under the new constraints.

## 5. Resource Dependencies
- **Standard Libraries**: `Math`
- **Internal Modules**: 
    - [JsonSerializable](/AgentDocs/core/json-serializable.md)
- **External Packages**: None identified.