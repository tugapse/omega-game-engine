## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| NumberRange | core/range.md |

This component defines the `NumberRange` class, which encapsulates a numeric value constrained by defined minimum and maximum bounds. Its primary responsibility is to ensure that the internal value remains within the specified range, providing automatic clamping upon assignment or modification. It also supports serialization and deserialization to and from JSON structures.

This class functions as a core data model element within the application's state management layer. It extends `JsonSerializable` to integrate seamlessly with persistence mechanisms, allowing range constraints to be reliably stored and retrieved across different parts of the system, such as configuration or state objects managed by components like [JsonSerializable](/core/json-serializable.md).

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| `NumberRange` | Class | Represents a numeric value constrained within a defined range. |
| `value` | Getter/Setter | Gets or sets the current value, automatically clamping it between `min` and `max`. |
| `min` | Getter/Setter | Gets or sets the minimum bound. Adjusts `max` if `min` is increased beyond it, and re-clamps `value`. |
| `max` | Getter/Setter | Gets or sets the maximum bound. Adjusts `min` if `max` is decreased below it, and re-clamps `value`. |
| `step` | Getter/Setter | Gets or sets the increment step used for potential future stepping logic. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The class enforces range integrity through setter logic. The `value` setter uses `Math.max(min, Math.min(max, value))` to clamp the input. The `min` and `max` setters implement cross-constraint validation: setting one bound automatically adjusts the other if the relationship is violated, followed by re-clamping the current `value`.
- **Side Effects:** None. The component operates purely on its internal state variables.
- **Error Handling:** No explicit exceptions are thrown. Boundary violations are handled internally by clamping or adjusting related bounds.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** None
- **Internal:** [JsonSerializable](/core/json-serializable.md)