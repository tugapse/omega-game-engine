## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| Transform | /core/transform.md |

This component defines the `Transform` class, which is responsible for managing the spatial properties (position, rotation, and scale) of any entity within the 3D scene. Its primary responsibility is to calculate the final world-space transformation matrix (`_modelMatrix`) by composing local transformations with the transformations of its parent in the scene hierarchy.

The `Transform` acts as a core data model component within the scene graph architecture. It manages the relationship between entities via parent/child pointers, ensuring that transformations are calculated lazily and efficiently only when the transform state is marked as "dirty." It integrates with serialization mechanisms via the [JsonSerializable](/core/json-serializable.md) interface.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| `Transform` | Class | Manages local and world space transformations for a scene entity. |
| `modelMatrix` | Getter | Returns the final world-space transformation matrix. |
| `localPosition` | Getter | Gets the local position relative to the parent. |
| `localRotation` | Getter | Gets the local rotation as Euler angles (degrees). |
| `localRotationQuat` | Getter | Gets the local rotation as a quaternion. |
| `localScale` | Getter | Gets the local scale relative to the parent. |
| `worldPosition` | Getter/Setter | Gets or sets the world-space position. Setting this calculates the necessary local position. |
| `worldRotationQuat` | Getter/Setter | Gets or sets the world-space rotation using a quaternion. Setting this calculates the necessary local rotation. |
| `worldRotation` | Getter/Setter | Gets or sets the world-space rotation using Euler angles (degrees). |
| `worldScale` | Getter/Setter | Gets or sets the final, combined world-space scale. |
| `parent` | Getter | Returns the parent `Transform` or `null`. |
| `setLocalPosition(x, y, z)` | Method | Sets the local position and marks the transform as dirty. |
| `setLocalRotation(xDegrees, yDegrees, zDegrees)` | Method | Sets the local rotation using Euler angles and marks the transform as dirty. |
| `setLocalScale(x, y, z)` | Method | Sets the local scale and marks the transform as dirty. |
| `setWorldPosition(x, y, z)` | Method | Sets the world position by calling the `worldPosition` setter. |
| `setWorldRotation(xDegrees, yDegrees, zDegrees)` | Method | Sets the world rotation by calling the `worldRotation` setter. |
| `setWorldScale(x, y, z)` | Method | Sets the world scale by calling the `worldScale` setter. |
| `translate(x, y, z)` | Method | Moves the transform by the given amounts in local space and marks it dirty. |
| `rotate(xDegrees, yDegrees, zDegrees)` | Method | Rotates the transform by the given Euler angles in local space and marks it dirty. |
| `scale(x, y, z)` | Method | Scales the transform by multiplying the current local scale and marks it dirty. |
| `updateMatrices()` | Method | Recursively recalculates the local and model matrices for the transform and its children if dirty. |
| `setParent(parent)` | Method | Attaches this transform to a new parent, updating the hierarchy and marking the transform dirty. |
| `right` | Getter | Gets the right direction vector (+X) in world space. |
| `left` | Getter | Gets the left direction vector (-X) in world space. |
| `up` | Getter | Gets the up direction vector (+Y) in world space. |
| `down` | Getter | Gets the down direction vector (-Y) in world space. |
| `forward` | Getter | Gets the forward direction vector (+Z) in world space. |
| `back` | Getter | Gets the back direction vector (-Z) in world space. |
| `lookAt(target, worldUp)` | Method | Orientates the transform to face a target point in world space. |
| `toJsonObject()` | Method | Serializes the transform's state to a JSON object. |
| `fromJson(jsonObject)` | Method | Deserializes the transform's state from a JSON object. |
| `rotateByQuat(q)` | Method | Rotates the transform by applying an external quaternion. |
| `setDirty(dirty)` | Method | Manually sets the dirty flag. |
| `setLocalRotationQuat(newRotation)` | Method | Sets the local rotation using a quaternion and marks the transform dirty. |
| `getEulerFromQuat(q)` | Method | Converts a given quaternion to Euler angles in degrees. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The transformation calculation relies on composing local transformations (position, rotation, scale) into a local matrix (`_localMatrix`). The final world matrix (`_modelMatrix`) is derived by multiplying the parent's world matrix by the local matrix. The system uses a lazy evaluation pattern: the `_dirty` flag ensures that matrix recalculations only occur when `modelMatrix` is accessed or when `updateMatrices()` is explicitly called. World-space setters (like `worldPosition`) calculate the required local values by inverting the parent's world matrix/rotation, maintaining consistency across the hierarchy.
- **Side Effects:** Mutates the internal state (`_position`, `_rotation`, `_scale`, `_modelMatrix`, `_dirty`) of the `Transform` instance and its descendants when setters or mutator methods are called.
- **Error Handling:** The `toEuler` helper function includes checks (`test > 0.4995 * unit` and `test < -0.4995 * unit`) to handle gimbal lock scenarios during quaternion-to-Euler conversion, ensuring stable results.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** `gl-matrix`, `uuid`
- **Internal:** [SceneEntity](/core/entities.md), [JsonSerializedData](/core/interfaces/json-serialized-data.md), [JsonSerializable](/core/json-serializable.md), [Vector3](/core/vector.md)