## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| BuiltinTextures | [src/core/resources/builtin-textures.ts](/src/core/resources/builtin-textures.ts) |

This component provides a set of predefined, hardcoded texture assets (white, black, normal, missing) embedded directly within the engine's code as Base64 Data URLs. Its primary responsibility is to ensure that these fundamental textures are always available for rendering without requiring any network fetching from a host application, guaranteeing immediate availability upon engine startup.

This module functions as a core resource provider, specifically managing the mapping between symbolic texture identifiers (like `builtin://white`) and their actual data representations. It serves as a foundational utility layer, allowing other parts of the engine, such as rendering systems, to reliably access default graphical elements without external dependencies, complementing other resource management systems like [TextureLoader](/path/to/texture_loader.md) if one existed.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| `BuiltinTextures` | Object | An immutable object containing symbolic URI keys for built-in textures. |
| `builtinTextureUrl` | Function | Retrieves the raw Data URL string corresponding to a given texture URI. Returns `undefined` if the URI is not recognized. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The component initializes constants for four specific texture Data URLs. It then constructs a lookup map (`BUILTIN_URLS`) using the symbolic keys from `BuiltinTextures` to map to their respective Data URLs. The `builtinTextureUrl` function performs a simple dictionary lookup against this map.
- **Side Effects:** None. The code only defines constants and performs in-memory lookups.
- **Error Handling:** The `builtinTextureUrl` function handles unknown URIs by returning `undefined`, which acts as the defined fallback mechanism for missing keys.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** None.
- **Internal:** None.