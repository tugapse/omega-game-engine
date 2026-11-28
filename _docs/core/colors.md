## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| **Colors** | [src/core/colors.ts](/src/core/colors.ts) |

This component serves as a centralized, static registry for predefined color constants within the application. Its primary responsibility is to provide easy, direct access to a comprehensive set of named colors (e.g., `red`, `blue`, `darkGray`) without requiring consumers to instantiate a `Color` object manually for each use case.

It functions as a utility class within the application's core utility layer. By exposing these colors statically, it standardizes color usage across different parts of the system, ensuring consistency when interacting with other components like the `Color` class found in [src/core/color.ts](/src/core/color.ts).

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| `Colors.white` | Getter | Returns a solid white color instance. |
| `Colors.black` | Getter | Returns a solid black color instance. |
| `Colors.red` | Getter | Returns a solid red color instance. |
| `Colors.green` | Getter | Returns a solid green color instance. |
| `Colors.blue` | Getter | Returns a solid blue color instance. |
| `Colors.yellow` | Getter | Returns a solid yellow color instance. |
| `Colors.cyan` | Getter | Returns a solid cyan color instance. |
| `Colors.magenta` | Getter | Returns a solid magenta color instance. |
| `Colors.gray` | Getter | Returns a mid-level gray color instance. |
| `Colors.grey` | Getter | Returns a mid-level grey color instance (alternative spelling). |
| `Colors.clear` | Getter | Returns a transparent black color instance. |
| `Colors.transparent` | Getter | Returns a fully transparent color instance. |
| `Colors.cornflowerBlue` | Getter | Returns the color cornflower blue. |
| `Colors.aliceBlue` | Getter | Returns the color alice blue. |
| `Colors.antiqueWhite` | Getter | Returns the color antique white. |
| `Colors.aqua` | Getter | Returns the color aqua. |
| `Colors.aquamarine` | Getter | Returns the color aquamarine. |
| `Colors.azure` | Getter | Returns the color azure. |
| `Colors.beige` | Getter | Returns the color beige. |
| `Colors.bisque` | Getter | Returns the color bisque. |
| `Colors.blanchedAlmond` | Getter | Returns the color blanched almond. |
| `Colors.blueViolet` | Getter | Returns the color blue violet. |
| `Colors.brown` | Getter | Returns the color brown. |
| `Colors.burlyWood` | Getter | Returns the color burly wood. |
| `Colors.cadetBlue` | Getter | Returns the color cadet blue. |
| `Colors.chartreuse` | Getter | Returns the color chartreuse. |
| `Colors.chocolate` | Getter | Returns the color chocolate. |
| `Colors.coral` | Getter | Returns the color coral. |
| `Colors.crimson` | Getter | Returns the color crimson. |
| `Colors.darkBlue` | Getter | Returns the color dark blue. |
| `Colors.darkCyan` | Getter | Returns the color dark cyan. |
| `Colors.darkGoldenrod` | Getter | Returns the color dark goldenrod. |
| `Colors.darkGray` | Getter | Returns the color dark gray. |
| `Colors.darkGreen` | Getter | Returns the color dark green. |
| `Colors.darkKhaki` | Getter | Returns the color dark khaki. |
| `Colors.darkMagenta` | Getter | Returns the color dark magenta. |
| `Colors.darkOliveGreen` | Getter | Returns the color dark olive green. |
| `Colors.darkOrange` | Getter | Returns the color dark orange. |
| `Colors.darkOrchid` | Getter | Returns the color dark orchid. |
| `Colors.darkRed` | Getter | Returns the color dark red. |
| `Colors.darkSalmon` | Getter | Returns the color dark salmon. |
| `Colors.darkSeaGreen` | Getter | Returns the color dark sea green. |
| `Colors.darkSlateBlue` | Getter | Returns the color dark slate blue. |
| `Colors.darkSlateGray` | Getter | Returns the color dark slate gray. |
| `Colors.darkTurquoise` | Getter | Returns the color dark turquoise. |
| `Colors.darkViolet` | Getter | Returns the color dark violet. |
| `Colors.deepPink` | Getter | Returns the color deep pink. |
| `Colors.deepSkyBlue` | Getter | Returns the color deep sky blue. |
| `Colors.dimGray` | Getter | Returns the color dim gray. |
| `Colors.dodgerBlue` | Getter | Returns the color dodger blue. |
| `Colors.firebrick` | Getter | Returns the color firebrick. |
| `Colors.floralWhite` | Getter | Returns the color floral white. |
| `Colors.forestGreen` | Getter | Returns the color forest green. |
| `Colors.fuchsia` | Getter | Returns the color fuchsia. |
| `Colors.gainsboro` | Getter | Returns the color gainsboro. |
| `Colors.ghostWhite` | Getter | Returns the color ghost white. |
| `Colors.gold` | Getter | Returns the color gold. |
| `Colors.goldenrod` | Getter | Returns the color goldenrod. |
| `Colors.greenYellow` | Getter | Returns the color green yellow. |
| `Colors.honeydew` | Getter | Returns the color honeydew. |
| `Colors.hotPink` | Getter | Returns the color hot pink. |
| `Colors.indianRed` | Getter | Returns the color indian red. |
| `Colors.indigo` | Getter | Returns the color indigo. |
| `Colors.ivory` | Getter | Returns the color ivory. |
| `Colors.khaki` | Getter | Returns the color khaki. |
| `Colors.lavender` | Getter | Returns the color lavender. |
| `Colors.lavenderBlush` | Getter | Returns the color lavender blush. |
| `Colors.lawnGreen` | Getter | Returns the color lawn green. |
| `Colors.lemonChiffon` | Getter | Returns the color lemon chiffon. |
| `Colors.lightBlue` | Getter | Returns the color light blue. |
| `Colors.lightCoral` | Getter | Returns the color light coral. |
| `Colors.lightCyan` | Getter | Returns the color light cyan. |
| `Colors.lightGoldenrodYellow` | Getter | Returns the color light goldenrod yellow. |
| `Colors.lightGray` | Getter | Returns the color light gray. |
| `Colors.lightGreen` | Getter | Returns the color light green. |
| `Colors.lightPink` | Getter | Returns the color light pink. |
| `Colors.lightSalmon` | Getter | Returns the color light salmon. |
| `Colors.lightSeaGreen` | Getter | Returns the color light sea green. |
| `Colors.lightSkyBlue` | Getter | Returns the color light sky blue. |
| `Colors.lightSlateGray` | Getter | Returns the color light slate gray. |
| `Colors.lightSteelBlue` | Getter | Returns the color light steel blue. |
| `Colors.lightYellow` | Getter | Returns the color light yellow. |
| `Colors.lime` | Getter | Returns the color lime. |
| `Colors.limeGreen` | Getter | Returns the color lime green. |
| `Colors.linen` | Getter | Returns the color linen. |
| `Colors.maroon` | Getter | Returns the color maroon. |
| `Colors.mediumAquamarine` | Getter | Returns the color medium aquamarine. |
| `Colors.mediumBlue` | Getter | Returns the color medium blue. |
| `Colors.mediumOrchid` | Getter | Returns the color medium orchid. |
| `Colors.mediumPurple` | Getter | Returns the color medium purple. |
| `Colors.mediumSeaGreen` | Getter | Returns the color medium sea green. |
| `Colors.mediumSlateBlue` | Getter | Returns the color medium slate blue. |
| `Colors.mediumSpringGreen` | Getter | Returns the color medium spring green. |
| `Colors.mediumTurquoise` | Getter | Returns the color medium turquoise. |
| `Colors.mediumVioletRed` | Getter | Returns the color medium violet red. |
| `Colors.midnightBlue` | Getter | Returns the color midnight blue. |
| `Colors.mintCream` | Getter | Returns the color mint cream. |
| `Colors.mistyRose` | Getter | Returns the color misty rose. |
| `Colors.moccasin` | Getter | Returns the color moccasin. |
| `Colors.navajoWhite` | Getter | Returns the color navajo white. |
| `Colors.navy` | Getter | Returns the color navy. |
| `Colors.oldLace` | Getter | Returns the color old lace. |
| `Colors.olive` | Getter | Returns the color olive. |
| `Colors.oliveDrab` | Getter | Returns the color olive drab. |
| `Colors.orange` | Getter | Returns the color orange. |
| `Colors.orangeRed` | Getter | Returns the color orange red. |
| `Colors.orchid` | Getter | Returns the color orchid. |
| `Colors.paleGoldenrod` | Getter | Returns the color pale goldenrod. |
| `Colors.paleGreen` | Getter | Returns the color pale green. |
| `Colors.paleTurquoise` | Getter | Returns the color pale turquoise. |
| `Colors.paleVioletRed` | Getter | Returns the color pale violet red. |
| `Colors.papayaWhip` | Getter | Returns the color papaya whip. |
| `Colors.peachPuff` | Getter | Returns the color peach puff. |
| `Colors.peru` | Getter | Returns the color peru. |
| `Colors.pink` | Getter | Returns the color pink. |
| `Colors.plum` | Getter | Returns the color plum. |
| `Colors.powderBlue` | Getter | Returns the color powder blue. |
| `Colors.purple` | Getter | Returns the color purple. |
| `Colors.rosyBrown` | Getter | Returns the color rosy brown. |
| `Colors.royalBlue` | Getter | Returns the color royal blue. |
| `Colors.saddleBrown` | Getter | Returns the color saddle brown. |
| `Colors.salmon` | Getter | Returns the color salmon. |
| `Colors.sandyBrown` | Getter | Returns the color sandy brown. |
| `Colors.seaGreen` | Getter | Returns the color sea green. |
| `Colors.seaShell` | Getter | Returns the color sea shell. |
| `Colors.sienna` | Getter | Returns the color sienna. |
| `Colors.silver` | Getter | Returns the color silver. |
| `Colors.skyBlue` | Getter | Returns the color sky blue. |
| `Colors.slateBlue` | Getter | Returns the color slate blue. |
| `Colors.slateGray` | Getter | Returns the color slate gray. |
| `Colors.snow` | Getter | Returns the color snow. |
| `Colors.springGreen` | Getter | Returns the color spring green. |
| `Colors.steelBlue` | Getter | Returns the color steel blue. |
| `Colors.tan` | Getter | Returns the color tan. |
| `Colors.teal` | Getter | Returns the color teal. |
| `Colors.thistle` | Getter | Returns the color thistle. |
| `Colors.tomato` | Getter | Returns the color tomato. |
| `Colors.turquoise` | Getter | Returns the color turquoise. |
| `Colors.violet` | Getter | Returns the color violet. |
| `Colors.wheat` | Getter | Returns the color wheat. |
| `Colors.whiteSmoke` | Getter | Returns the color white smoke. |
| `Colors.yellowGreen` | Getter | Returns the color yellow green. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The class utilizes static getter properties to encapsulate the creation of specific `Color` instances. Each getter calls `new Color(...)` with predefined RGB or RGBA values, effectively caching or providing immediate access to a specific color definition.
- **Side Effects:** None. The class only performs object instantiation based on hardcoded values.
- **Error Handling:** None.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** None
- **Internal:** [src/core/color.ts](/src/core/color.ts)