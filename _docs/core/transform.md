## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| **Transform** | [src/core/transform.ts](/src/core/transform.ts) |

This component defines the `Transform` class, which is responsible for managing the spatial properties (position, rotation, and scale) of any entity within the 3D scene. It encapsulates the necessary mathematical operations to calculate the entity's local and world-space transformations, primarily through the use of model matrices (`mat4`).

The `Transform` acts as a core data model component within the scene graph architecture. It inherits from [JsonSerializable](/src/core/json-serializable.md) to allow for serialization and deserialization, enabling persistence of scene state. It manages hierarchical relationships via `parent` and `children`, ensuring that transformations are correctly propagated down the scene graph hierarchy.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| `Transform` | Class | Manages the position, rotation, and scale of an entity in 3D space, supporting hierarchical transformations. |
| `toEuler(out: vec3, q: quat): void` | Function | Converts a quaternion rotation (`q`) into Euler angles (radians) and stores them in `out`. |
| `modelMatrix` | Getter | Returns the computed world transformation matrix (`mat4`) for the entity. |
| `localPosition` | Getter | Returns the entity's position relative to its parent in local space (`vec3`). |
| `localRotation` | Getter | Returns the entity's rotation in degrees relative to its parent (`vec3`). |
| `localRotationQuat` | Getter | Returns the entity's rotation as a quaternion relative to its parent (`quat`). |
| `localScale` | Getter | Returns the entity's scale relative to its parent (`vec3`). |
| `worldPosition` | Getter/Setter | Retrieves or sets the entity's position in world space. Setting this automatically calculates the local position based on the parent's transform. |
| `worldRotationQuat` | Getter/Setter | Retrieves or sets the entity's rotation as a quaternion in world space. |
| `worldRotation` | Getter/Setter | Retrieves or sets the entity's rotation as Euler angles in degrees in world space. |
| `worldScale` | Getter/Setter | Retrieves or sets the entity's scale in world space. |
| `parent` | Getter | Returns the parent `Transform` object, or `null` if none exists. |
| `children` | Getter | Returns a read-only array of child `Transform` objects. |
| `setLocalPosition(x, y, z)` | Method | Sets the local position of the transform and marks the transform as dirty. |
| `setLocalRotation(xDegrees, yDegrees, zDegrees)` | Method | Sets the local rotation using Euler angles (degrees) and marks the transform as dirty. |
| `setLocalScale(x, y, z)` | Method | Sets the local scale of the transform and marks the transform as dirty. |
| `setWorldPosition(x, y, z)` | Method | Sets the world position by calling the `worldPosition` setter. |
| `setWorldRotation(xDegrees, yDegrees, zDegrees)` | Method | Sets the world rotation by calling the `worldRotation` setter. |
| `setWorldScale(x, y, z)` | Method | Sets the world scale by calling the `worldScale` setter. |
| `translate(x, y, z)` | Method | Translates the entity in its local space and marks the transform as dirty. |
| `rotate(xDegrees, yDegrees, zDegrees)` | Method | Rotates the entity in its local space by the given Euler angles (degrees) and marks the transform as dirty. |
| `scale(x, y, z)` | Method | Scales the entity in its local space and marks the transform as dirty. |
| `setParent(parent)` | Method | Changes the parent of this transform, updating the scene graph structure and marking the transform as dirty. |
| `right` | Getter | Returns the right vector of the entity in world space, derived from the model matrix. |
| `left` | Getter | Returns the left vector of the entity in world space. |
| `up` | Getter | Returns the up vector of the entity in world space, derived from the model matrix. |
| `down` | Getter | Returns the down vector of the entity in world space. |
| `forward` | Getter | Returns the forward vector of the entity in world space, derived from the model matrix. |
| `back` | Getter | Returns the back vector of the entity in world space. |
| `lookAt(target, worldUp)` | Method | Orientates the transform to look at a specified target point, updating the world rotation. |
| `toJsonObject()` | Method | Serializes the transform's local state (position, rotation, scale) into a `JsonSerializedData` object. |
| `fromJson(jsonObject)` | Method | Deserializes the transform's local state from a `JsonSerializedData` object. |
| `rotateByQuat(q: quat)` | Method | Rotates the entity by an external quaternion `q` in local space. |
| `setDirty(dirty: boolean)` | Method | Manually sets the internal dirty flag, forcing matrix recalculation on the next access. |
| `setLocalRotationQuat(newRotation: quat)` | Method | Sets the local rotation directly using a quaternion and updates the internal Euler representation. |
| `getEulerFromQuat(q: quat)` | Method | Converts an arbitrary quaternion into Euler angles (degrees). |

## 3. Implementation Details & Side Effects
- **Core Logic:** The component relies on a dirty-checking mechanism (`_dirty`). When any local property is mutated, `_dirty` is set to true. The `current` getter triggers `updateMatrices()` if dirty. `updateMatrices()` calculates the local transformation matrix (`_localMatrix`) from the local properties and then computes the final world matrix (`_modelMatrix`) by multiplying the parent's world matrix by the local matrix. World space setters (like `worldPosition`) calculate the necessary local changes by inverting the parent's world matrix.
- **Side Effects:** Mutates internal state (`_position`, `_rotation`, `_scale`, `_modelMatrix`, `_dirty`). It also mutates the structure of the scene graph by modifying the `_children` array when `setParent` is called.
- **Error Handling:** The `toEuler` helper function uses `Math.max(-1, Math.min(1, ...))` to clamp the input to `Math.asin`, preventing potential domain errors due to floating-point inaccuracies during quaternion-to-Euler conversion.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** `gl-matrix`, `uuid`
- **Internal:** [../entities](/src/core/entities.md), [../interfaces/json-serialized-data](/src/interfaces/json-serialized-data.md), [./json-serializable](/src/core/json-serializable.md), [./vector](/src/core/vector.md)