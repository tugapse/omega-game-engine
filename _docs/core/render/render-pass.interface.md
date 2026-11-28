## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| **RenderContext** | [core/render/render-pass.interface.ts](/core/render/render-pass.interface.ts) |
| **IRenderPass** | [core/render/render-pass.interface.ts](/core/render/render-pass.interface.ts) |

This component defines the contracts necessary for implementing rendering stages within the application. The `IRenderPass` interface establishes a standardized lifecycle for any rendering operation, requiring methods for initialization, execution, cleanup, and viewport resizing. The `RenderContext` interface provides the necessary runtime data—including the WebGL context, frame data, and target/source render targets—that a specific pass needs to perform its drawing operations.

This file serves as a core architectural contract within the rendering subsystem. It dictates how individual rendering passes interact with the engine's state, ensuring that scene traversal, drawing, and post-processing steps can be managed uniformly, whether they are part of the main rendering loop or specialized effects.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| `RenderContext` | Interface | Holds the necessary resources for a rendering pass during execution, including the WebGL context, frame data, and render targets. |
| `IRenderPass` | Interface | Defines the contract for a rendering pass, requiring methods for setup, execution against a scene, cleanup, and handling of viewport changes. |

## 3. Implementation Details & Side Effects
Structural definitions only; no complex logic or side effects.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** None
- **Internal:** [../../entities](/../../entities.md), [./frame-data](/./frame-data.md), [./render-target](/./render-target.md)