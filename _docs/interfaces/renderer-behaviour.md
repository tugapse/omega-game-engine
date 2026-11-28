## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| IRendererBehaviour | [interfaces/renderer-behaviour.ts](/interfaces/renderer-behaviour.ts) |

This interface defines the contract for any object intended to manage or interact with a WebGL rendering context. Its primary responsibility is to encapsulate the necessary methods and properties required for a renderer implementation to operate correctly within the application's rendering pipeline.

This component serves as a structural definition within the application's service layer, specifically governing how rendering logic interacts with the underlying graphics API. It acts as a dependency contract that concrete renderer implementations must adhere to when being injected or utilized by higher-level components.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| IRendererBehaviour | Interface | Defines the structure for a renderer implementation, requiring access to the WebGL2RenderingContext and a method to set that context. |
| setGl | Method | Accepts a `WebGL2RenderingContext` object and stores it within the implementing object. |

## 3. Implementation Details & Side Effects
Structural definitions only; no complex logic or side effects.

## 4. Dependencies & Configuration
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** None
- **Internal:** None