## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| **index** | [entities/lights/index.ts](/entities/lights/index.ts) |

This component serves as a central barrel file for the lighting system within the engine. Its primary responsibility is to aggregate and export all related light entity definitions, providing a single, unified entry point for consumers needing access to various light types.

It acts as a high-level aggregation point within the application's data model layer. By exporting specific light implementations like [light](/entities/lights/light.md), [point-light](/entities/lights/point-light.md), and [spot-light](/entities/lights/spot-light.md), it simplifies dependency management for other parts of the engine that interact with lighting geometry or properties.

## 2. Public API & Interfaces
This file contains no public exports.

## 3. Implementation Details & Side Effects
Structural definitions only; no complex logic or side effects.

## 4. Dependencies & Configuration
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** None
- **Internal:** [directional-light](/entities/lights/directional-light.md), [light-attenuation](/entities/lights/light-attenuation.md), [light-cone](/entities/lights/light-cone.md), [light](/entities/lights/light.md), [point-light](/entities/lights/point-light.md), [spot-light](/entities/lights/spot-light.md)