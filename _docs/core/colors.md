## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| Colors | core/colors.md |

This component serves as a centralized, static registry for a comprehensive collection of predefined color constants. Its primary responsibility is to provide developers with immediate, type-safe access to standard and named colors (e.g., `red`, `blue`, `darkSlateBlue`) without the overhead of instantiating a new `Color` object for every usage.

Architecturally, this class functions as a utility facade within the application's core services layer. It encapsulates concrete color definitions, relying on the `Color` class (imported from [color](/core/color.md)) to manage the underlying RGB/RGBA representation. This pattern promotes consistency across the application by ensuring all color usages reference a single, canonical source.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| `white` | Getter | Returns a solid white color instance. |
| `black` | Getter | Returns a solid black color instance. |
| `red` | Getter | Returns a solid red color instance. |
| `green` | Getter | Returns a solid green color instance. |
| `blue` | Getter | Returns a solid blue color instance. |
| `yellow` | Getter | Returns a solid yellow color instance. |
| `cyan` | Getter | Returns a solid cyan color instance. |
| `magenta` | Getter | Returns a solid magenta color instance. |
| `gray` | Getter | Returns a mid-level gray color instance (RGB 0.5, 0.5, 0.5). |
| `grey` | Getter | Returns a mid-level grey color instance (alternative spelling). |
| `clear` | Getter | Returns a transparent black color instance (RGBA 0, 0, 0, 0). |
| `transparent` | Getter | Returns a fully transparent color instance (RGBA 0, 0, 0, 0). |
| `cornflowerBlue` | Getter | Returns the specific cornflower blue color. |
| `aliceBlue` | Getter | Returns the specific alice blue color. |
| `antiqueWhite` | Getter | Returns the specific antique white color. |
| `aqua` | Getter | Returns the specific aqua color. |
| `aquamarine` | Getter | Returns the specific aquamarine color. |
| `azure` | Getter | Returns the specific azure color. |
| `beige` | Getter | Returns the specific beige color. |
| `bisque` | Getter | Returns the specific bisque color. |
| `blanchedAlmond` | Getter | Returns the specific blanched almond color. |
| `blueViolet` | Getter | Returns the specific blue violet color. |
| `brown` | Getter | Returns the specific brown color. |
| `burlyWood` | Getter | Returns the specific burly wood color. |
| `cadetBlue` | Getter | Returns the specific cadet blue color. |
| `chartreuse` | Getter | Returns the specific chartreuse color. |
| `chocolate` | Getter | Returns the specific chocolate color. |
| `coral` | Getter | Returns the specific coral color. |
| `crimson` | Getter | Returns the specific crimson color. |
| `darkBlue` | Getter | Returns the specific dark blue color. |
| `darkCyan` | Getter | Returns the specific dark cyan color. |
| `darkGoldenrod` | Getter | Returns the specific dark goldenrod color. |
| `darkGray` | Getter | Returns the specific dark gray color. |
| `darkGreen` | Getter | Returns the specific dark green color. |
| `darkKhaki` | Getter | Returns the specific dark khaki color. |
| `darkMagenta` | Getter | Returns the specific dark magenta color. |
| `darkOliveGreen` | Getter | Returns the specific dark olive green color. |
| `darkOrange` | Getter | Returns the specific dark orange color. |
| `darkOrchid` | Getter | Returns the specific dark orchid color. |
| `darkRed` | Getter | Returns the specific dark red color. |
| `darkSalmon` | Getter | Returns the specific dark salmon color. |
| `darkSeaGreen` | Getter | Returns the specific dark sea green color. |
| `darkSlateBlue` | Getter | Returns the specific dark slate blue color. |
| `darkSlateGray` | Getter | Returns the specific dark slate gray color. |
| `darkTurquoise` | Getter | Returns the specific dark turquoise color. |
| `darkViolet` | Getter | Returns the specific dark violet color. |
| `deepPink` | Getter | Returns the specific deep pink color. |
| `deepSkyBlue` | Getter | Returns the specific deep sky blue color. |
| `dimGray` | Getter | Returns the specific dim gray color. |
| `dodgerBlue` | Getter | Returns the specific dodger blue color. |
| `firebrick` | Getter | Returns the specific firebrick color. |
| `floralWhite` | Getter | Returns the specific floral white color. |
| `forestGreen` | Getter | Returns the specific forest green color. |
| `fuchsia` | Getter | Returns the specific fuchsia color. |
| `gainsboro` | Getter | Returns the specific gainsboro color. |
| `ghostWhite` | Getter | Returns the specific ghost white color. |
| `gold` | Getter | Returns the specific gold color. |
| `goldenrod` | Getter | Returns the specific goldenrod color. |
| `greenYellow` | Getter | Returns the specific green yellow color. |
| `honeydew` | Getter | Returns the specific honeydew color. |
| `hotPink` | Getter | Returns the specific hot pink color. |
| `indianRed` | Getter | Returns the specific indian red color. |
| `indigo` | Getter | Returns the specific indigo color. |
| `ivory` | Getter | Returns the specific ivory color. |
| `khaki` | Getter | Returns the specific khaki color. |
| `lavender` | Getter | Returns the specific lavender color. |
| `lavenderBlush` | Getter | Returns the specific lavender blush color. |
| `lawnGreen` | Getter | Returns the specific lawn green color. |
| `lemonChiffon` | Getter | Returns the specific lemon chiffon color. |
| `lightBlue` | Getter | Returns the specific light blue color. |
| `lightCoral` | Getter | Returns the specific light coral color. |
| `lightCyan` | Getter | Returns the specific light cyan color. |
| `lightGoldenrodYellow` | Getter | Returns the specific light goldenrod yellow color. |
| `lightGray` | Getter | Returns the specific light gray color. |
| `lightGreen` | Getter | Returns the specific light green color. |
| `lightPink` | Getter | Returns the specific light pink color. |
| `lightSalmon` | Getter | Returns the specific light salmon color. |
| `lightSeaGreen` | Getter | Returns the specific light sea green color. |
| `lightSkyBlue` | Getter | Returns the specific light sky blue color. |
| `lightSlateGray` | Getter | Returns the specific light slate gray color. |
| `lightSteelBlue` | Getter | Returns the specific light steel blue color. |
| `lightYellow` | Getter | Returns the specific light yellow color. |
| `lime` | Getter | Returns the specific lime color. |
| `limeGreen` | Getter | Returns the specific lime green color. |
| `linen` | Getter | Returns the specific linen color. |
| `maroon` | Getter | Returns the specific maroon color. |
| `mediumAquamarine` | Getter | Returns the specific medium aquamarine color. |
| `mediumBlue` | Getter | Returns the specific medium blue color. |
| `mediumOrchid` | Getter | Returns the specific medium orchid color. |
| `mediumPurple` | Getter | Returns the specific medium purple color. |
| `mediumSeaGreen` | Getter | Returns the specific medium sea green color. |
| `mediumSlateBlue` | Getter | Returns the specific medium slate blue color. |
| `mediumSpringGreen` | Getter | Returns the specific medium spring green color. |
| `mediumTurquoise` | Getter | Returns the specific medium turquoise color. |
| `mediumVioletRed` | Getter | Returns the specific medium violet red color. |
| `midnightBlue` | Getter | Returns the specific midnight blue color. |
| `mintCream` | Getter | Returns the specific mint cream color. |
| `mistyRose` | Getter | Returns the specific misty rose color. |
| `moccasin` | Getter | Returns the specific moccasin color. |
| `navajoWhite` | Getter | Returns the specific navajo white color. |
| `navy` | Getter | Returns the specific navy color. |
| `oldLace` | Getter | Returns the specific old lace color. |
| `olive` | Getter | Returns the specific olive color. |
| `oliveDrab` | Getter | Returns the specific olive drab color. |
| `orange` | Getter | Returns the specific orange color. |
| `orangeRed` | Getter | Returns the specific orange red color. |
| `orchid` | Getter | Returns the specific orchid color. |
| `paleGoldenrod` | Getter | Returns the specific pale goldenrod color. |
| `paleGreen` | Getter | Returns the specific pale green color. |
| `paleTurquoise` | Getter | Returns the specific pale turquoise color. |
| `paleVioletRed` | Getter | Returns the specific pale violet red color. |
| `papayaWhip` | Getter | Returns the specific papaya whip color. |
| `peachPuff` | Getter | Returns the specific peach puff color. |
| `peru` | Getter | Returns the specific peru color. |
| `pink` | Getter | Returns the specific pink color. |
| `plum` | Getter | Returns the specific plum color. |
| `powderBlue` | Getter | Returns the specific powder blue color. |
| `purple` | Getter | Returns the specific purple color. |
| `rosyBrown` | Getter | Returns the specific rosy brown color. |
| `royalBlue` | Getter | Returns the specific royal blue color. |
| `saddleBrown` | Getter | Returns the specific saddle brown color. |
| `salmon` | Getter | Returns the specific salmon color. |
| `sandyBrown` | Getter | Returns the specific sandy brown color. |
| `seaGreen` | Getter | Returns the specific sea green color. |
| `seaShell` | Getter | Returns the specific sea shell color. |
| `sienna` | Getter | Returns the specific sienna color. |
| `silver` | Getter | Returns the specific silver color. |
| `skyBlue` | Getter | Returns the specific sky blue color. |
| `slateBlue` | Getter | Returns the specific slate blue color. |
| `slateGray` | Getter | Returns the specific slate gray color. |
| `snow` | Getter | Returns the specific snow color. |
| `springGreen` | Getter | Returns the specific spring green color. |
| `steelBlue` | Getter | Returns the specific steel blue color. |
| `tan` | Getter | Returns the specific tan color. |
| `teal` | Getter | Returns the specific teal color. |
| `thistle` | Getter | Returns the specific thistle color. |
| `tomato` | Getter | Returns the specific tomato color. |
| `turquoise` | Getter | Returns the specific turquoise color. |
| `violet` | Getter | Returns the specific violet color. |
| `wheat` | Getter | Returns the specific wheat color. |
| `whiteSmoke` | Getter | Returns the specific white smoke color. |
| `yellowGreen` | Getter | Returns the specific yellow green color. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The class exposes numerous static getter properties, each returning a new instance of the `Color` class initialized with specific RGB or RGBA values corresponding to named color standards. This acts as a lookup table for predefined color constants.

- **Side Effects:** None.

- **Error Handling:** None.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** None.

- **Internal:** [color](/core/color.md)