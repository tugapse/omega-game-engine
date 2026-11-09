## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| Lights | /entities/lights/index.md |

This index file serves as a central aggregation point for all light-related entities within the engine. Its primary responsibility is to export a unified interface, allowing consumers to import specific light types (like `PointLight` or `SpotLight`) or related concepts (like `LightAttenuation`) from a single, predictable entry point.

Architecturally, this component acts as a facade or barrel file within the `entities/lights` module. It consolidates the functionality provided by individual light implementations, ensuring that the rest of the application interacts with the light system through a clean, well-defined public API structure, referencing specific implementations like [DirectionalLight](/entities/lights/directional-light.md) and [Light](/entities/lights/light.md).

## 2. Public API & Interfaces
This file contains no public exports.

## 3. Implementation Details & Side Effects
Structural definitions only; no complex logic or side effects.

## 4. Dependencies & Configuration
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** None.

- **Internal:** [DirectionalLight](/entities/lights/directional-light.md), [LightAttenuation](/entities/lights/light-attenuation.md), [LightCone](/entities/lights/light-cone.md), [Light](/entities/lights/light.md), [PointLight](/entities/lights/point-light.md), [SpotLight](/entities/lights/spot-light.md).