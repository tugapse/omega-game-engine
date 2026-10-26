## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | Transform |
| Source file | transform.ts |

The **Transform** component serves as the mathematical backbone for spatial positioning within the engine. It manages the translation, rotation, and scale of objects, providing a bridge between local coordinate spaces and global world spaces through hierarchical matrix multiplication.

**Functional Mission**
The primary responsibility of **Transform** is to maintain and compute the spatial state of an entity. It solves the problem of complex hierarchical movement by implementing a "dirty flag" pattern, ensuring that expensive matrix recalculations (local-to-world conversions) only occur when a property has actually changed.

**System Context & Integration**
As a core component, **Transform** is tightly integrated with [SceneEntity](/AgentDocs/entities/index.md) to define where an object exists in the scene. It acts as a data provider for the rendering pipeline, supplying the `modelMatrix` required by shaders to position geometry correctly. It facilitates parent-child relationships, allowing transformations to propagate down a scene graph, and provides utility methods like `lookAt` to drive procedural animations or camera orientations.

- **INTERNAL REFERENCES**: [SceneEntity](/AgentDocs/entities/index.md), [JsonSerializable](/AgentDocs/core/json-serializable.md), [Vector3](/AgentDocs/core/vector.md), [JsonSerializedData](/AgentDocs/interfaces/json-serialized-data.md).

## 2. Environment & Configuration
**Environment Lookups:**
- No environment lookups identified.

**Hardcoded Constants:**
- `0.4995 * unit` (Threshold)  Used in `toEuler` to detect gimbal lock/singularity conditions during quaternion-to-Euler conversion.
- `180 / Math.PI` (Conversion Factor)  Used to convert radians to degrees for Euler angle representations.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `Transform` | Class | Manages 3D spatial state (position, rotation, scale) and hierarchical matrix math. |
| `toEuler` | Func | Private helper to convert a `quat` to Euler angles in radians. |
| `modelMatrix` | Getter | Returns the computed `mat4` representing the object's position in world space. |
| `localPosition` | Getter | Returns the `vec3` position relative to the parent. |
| `localRotation` | Getter | Returns the `vec3` Euler angles (degrees) relative to the parent. |
| `localRotationQuat` | Getter | Returns the `quat` rotation relative to the parent. |
| `localScale` | Getter | Returns the `vec3` scale relative to the parent. |
| `worldPosition` | Getter/Setter | Accesses/modifies position in global coordinate space. |
| `worldRotationQuat` | Getter/Setter | Accesses/modifies rotation in global coordinate space using quaternions. |
| `worldRotation` | Getter/Setter | Accesses/modifies rotation in global coordinate space using Euler degrees. |
| `worldScale` | Getter/Setter | Accesses/modifies scale in global coordinate space. |
| `setLocalPosition` | Method | Updates local translation and marks the transform as dirty. |
| `setLocalRotation` | Method | Updates local Euler rotation and updates the internal quaternion. |
| `setLocalScale` | Method | Updates local scale and marks the transform as dirty. |
| `translate` | Method | Performs additive translation in local space. |
| `rotate` | Method | Performs additive rotation in local space. |
| `scale` | Method | Performs multiplicative scaling in local space. |
| `updateMatrices` | Method | Recursively recalculates `_localMatrix` and `_modelMatrix` for the hierarchy. |
| `setParent` | Method | Establishes a hierarchical link between this transform and another. |
| `lookAt` | Method | Reorients the transform to face a specific world-space target. |
| `toJsonObject` | Method | Serializes spatial state for persistence. |
| `fromJson` | Method | Restores spatial state from serialized data. |

## 4. Execution Logic & Flow
- **Initialization**: The constructor initializes `_position` to `(0,0,0)`, `_rotation` to identity, `_scale` to `(1,1,1)`, and sets the `_dirty` flag to `true`. A unique `_uuid` is generated via `uuidv4`.
- **Data Path (Matrix Update)**: 
    1. **Trigger**: A setter (e.g., `setLocalPosition`) or mutator (e.g., `translate`) is called.
    2. **Invalidation**: The `_dirty` flag is set to `true`.
    3. **Request**: A consumer accesses `modelMatrix`.
    4. **Processing**: `updateMatrices()` is invoked.
        - `_localMatrix` is built from `_rotation`, `_position`, and `_scale`.
        - If a `_parent` exists, `_modelMatrix = parent.modelMatrix * _localMatrix`.
        - If no parent, `_modelMatrix = _localMatrix`.
    5. **Propagation**: The method calls `child.setDirty(true)` and `child.updateMatrices()` recursively.
    6. **Output**: The updated `mat4` is returned.
- **Conditional Branching**:
    - **Gimbal Lock Detection**: In `toEuler`, the `test` variable checks if the rotation is near a singularity (pitch $\pm 90^\circ$) to prevent mathematical instability.
    - **Hierarchy Check**: In `worldPosition` setters and `updateMatrices`, the logic branches based on whether `_parent` is `null` to determine if calculations should be relative or absolute.

## 5. Resource Dependencies
- **Standard Libraries**: `uuid` (via `v4`)
- **Internal Modules**: 
    - [SceneEntity](/AgentDocs/entities/index.md)
    - [JsonSerializedData](/AgentDocs/interfaces/json-serialized-data.md)
    - [JsonSerializable](/AgentDocs/core/json-serializable.md)
    - [Vector3](/AgentDocs/core/vector.md)
- **External Packages**: `gl-matrix` (provides `mat4`, `quat`, `vec3`)