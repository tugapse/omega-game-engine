## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| IRenderPass | core/render/render-pass.interface |

This interface defines the contract for any rendering pass within the application. Its primary responsibility is to encapsulate the lifecycle and execution logic required to perform a specific rendering operation, such as depth pre-pass, shadow mapping, or final scene composition. It ensures that all rendering stages adhere to a standardized set of methods for initialization, execution, and cleanup.

This component serves as a core abstraction layer within the rendering pipeline architecture. It dictates how individual rendering stages interact with the underlying WebGL context and the main scene data structure, allowing the rendering manager to iterate over and manage various rendering passes sequentially or in parallel.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| IRenderPass | Interface | Defines the structure for a rendering pass, including methods for setup, execution, and resource management. |
| name | Property | A string identifier for the specific rendering pass. |
| initialize | Method | Sets up the rendering pass using the provided WebGL2RenderingContext. |
| execute | Method | Executes the rendering logic for the pass using the provided Scene object. |
| cleanup | Method | Releases any resources held by the rendering pass. |
| resize | Method | Adjusts the rendering pass dimensions to match the viewport size. |
| setGl | Method | Injects the necessary WebGL2RenderingContext into the pass instance. |

## 3. Implementation Details & Side Effects
Structural definitions only; no complex logic or side effects.

## 4. Dependencies & Configuration
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** None
- **Internal:** [Scene](/entities.md)