## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| **NumberRange** | [src/core/range.ts](/src/core/range.ts) |

This component defines the `NumberRange` class, which encapsulates a numeric value constrained by defined minimum and maximum bounds. Its primary responsibility is to ensure that any assigned value remains strictly within the specified range, providing robust boundary checking and clamping functionality.

This class serves as a core data model element within the application's state management layer. It inherits from [JsonSerializable](/src/core/json-serializable.md), allowing instances to be reliably serialized to and deserialized from JSON structures, making it suitable for persistence or network transfer.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| `NumberRange` | Class | Represents a numeric value constrained within a defined range. |
| `value` | Getter/Setter | Gets or sets the current value, automatically clamping the input between `min` and `max`. |
| `min` | Getter/Setter | Gets or sets the minimum bound. Setting it adjusts `max` if necessary and re-clamps `value`. |
| `max` | Getter/Setter | Gets or sets the maximum bound. Setting it adjusts `min` if necessary and re-clamps `value`. |
| `step` | Getter/Setter | Gets or sets the increment step used for range calculations. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The class maintains four protected internal fields: `_value`, `_min`, `_max`, and `_step`. The `value` setter enforces clamping using `Math.max(this._min, Math.min(this._max, value))`. The setters for `min` and `max` implement interdependent boundary checks; for instance, setting `min` greater than `max` forces `max` to equal `min`, and then re-clamps the internal `value`. Serialization and deserialization methods (`toJsonObject`, `fromJson`) manage the state mapping to and from JSON objects.
- **Side Effects:** None. The class operates entirely on its internal state.
- **Error Handling:** The setters implement defensive logic to maintain range integrity (e.g., adjusting bounds when one is set outside the other), effectively handling boundary violations internally rather than throwing exceptions.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** None
- **Internal:** [JsonSerializable](/src/core/json-serializable.md)