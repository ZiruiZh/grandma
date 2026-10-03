# Asset manifest

Bundled artwork: **18 unchanged owner-supplied PNGs**. The user explicitly supplied these assets after the initial zero-image brief. No remote asset download is required at runtime. Optional owner logo stays hidden unless configured. Runtime libraries: **zero**.

The minimalist identity uses the supplied black-line artwork, open white surfaces, reusable stroke lettering, and local system text. Original artwork is displayed without redraws, recoloring, extra fills, shadows, 3D effects, or character animation. Preparation tools can move during player gestures; original image files stay unchanged. HEYTEA informs spacing and restraint; no HEYTEA logo or downloaded brand asset is used.

| Component | Contents | Implementation |
| --- | --- | --- |
| Brand wordmark | Configurable live bakery name, original Grandma portrait motif | HTML and `brandMark()` inline SVG |
| Bakery environment | Window, shelves, display, worktop, register, recipe book, flyer stack, regular notes, tea; station oven and drink workspace | `grandmaVignette()` SVG, original character-sheet crop, and reusable HTML/CSS station surfaces |
| Shared character | Grandma, Mr. Maple, Maya, Theo, Ruby, Sam, June | One unchanged transparent character sheet; seven static SVG viewport crops via `originalCharacter()` |
| Expressions | Neutral, happy, waiting, disappointed | Original faces are retained; satisfaction and reactions use readable text |
| Pastries | Cookie, muffin, cupcake; plain/vanilla/chocolate; supported recipe toppings | Original cookie, muffin, chocolate-chip muffin, cupcake and sprinkle-cupcake PNGs via `suppliedPastry()` |
| Baking states | Raw, golden, overbaked | Unaltered drawings; explicit bake status, timer, and progress band |
| Ingredients | Flour, sugar, butter, egg, milk, cocoa, chips, raisins, blueberries, honey, coffee, tea | Supplied ingredient PNGs plus generated icons for ingredients without supplied drawings; readable labels |
| Decorations | Frosting/cream swirl, drizzle lines, sprinkles, marshmallows | Original cupcake/sprinkle drawings; icing is a separate live SVG stroke layer directly over the pastry |
| Drink vessel | One cup, optional handle, takeaway lid | `cup()` viewport crops of the supplied tool sheet |
| Drink contents | Coffee, two tea varieties, hot chocolate, milk, fill level, cream and marshmallows | Original cup crops with clipped live liquid behind their unchanged strokes; readable fill level and extras |
| Tools | Bowl, whisk, scoop, piping bag, kettle | `bowl()` and `toolIcon()` viewport crops of the supplied tool sheet |
| Containers | Baking tray, serving plate, takeaway box | `servingContainer()` SVG |
| Interface icons | Play, pause, home, settings, sound/mute, arrow, check, close, coin, heart, star, clock, share, station icons | Original supplied tool-sheet icons where available; shared inline SVG paths for remaining controls |
| Interface surfaces | Buttons, station bar, tickets, drawer, meters, dialogs, receipts, scrapbook and upgrades | Semantic HTML with mobile-first CSS |
| Effects | Preparation meters, separate frosting guide, payment feedback and milestone results | Player-driven whisk movement, tray drag, direct icing strokes and liquid pouring; characters remain static |
| Sound | Bell, mixing, pouring, ding, payment, milestone | Optional synthesized Web Audio; zero sound files |
| Typography | Titles, dialogue, labels, numbers | Original reusable SVG alphabet for display headings; local Avenir Next / Trebuchet MS / Arial stacks for readable controls; no downloaded font |
| Recipe/customer data | Supported combinations, timing, economy, six profiles, returning dialogue, tutorial | `src/data.js` |
| Business configuration | Brand copy/colors, featured products, links, address, hours, optional offer and analytics | `src/business-config.js` |
| Optional logo | Existing bakery logo supplied by owner | At most one image; none included |

SVG viewports keep the original high-resolution PNGs intact. Text accompanies meaningful state and icons. Work surfaces remain visible on phones; source drawings remain unchanged while preparation gestures, status and progress stay explicit. Core gameplay makes no external asset or API requests.

Record any future approved addition here with its source, license, purpose, and path. Prefer changes to existing components over new image files.

## Supplied artwork inventory

All 18 uploaded PNGs are copied byte-for-byte into `src/assets/`. Duplicate uploads of the recipe sheet reuse the same file. `src/assets/manifest.json` records original filenames and dimensions. SVG viewports remove only surrounding padding on screen; source files remain intact.

| File | Use |
| --- | --- |
| `blueberries.png` | Ingredient selection and recipe chips |
| `butter.png` | Ingredient selection and recipe chips |
| `choc-chip-muffin.png` | Chocolate-chip muffin tickets and finished pastries |
| `chocolate.png` | Chocolate ingredient choice |
| `cocoa.png` | Ingredient selection and recipe chips |
| `cookie.png` | Cookie tickets, trays and finished orders |
| `croissant.png` | Grandma’s display vignette |
| `cupcake.png` | Cupcake tickets and finished pastries |
| `egg.png` | Ingredient selection and recipe chips |
| `flour.png` | Ingredient selection and recipe chips |
| `honey.png` | Ingredient selection and recipe chips |
| `milk.png` | Ingredient selection and recipe chips |
| `muffin.png` | Muffin tickets and finished pastries |
| `raisins.png` | Ingredient selection and recipe chips |
| `sprinkles-cupcake.png` | Finished sprinkled cupcakes |
| `recipe-sheet.png` | Illustrated pantry inside the recipe book |
| `tools-sheet.png` | Static oven, bowl, whisk, scoop, piping bag, cups and interface icons; full sheet in recipe book |
| `customer-sheet.png` | Static original Grandma and six customer crops |

The original `customersandgrandma.png` supplies Grandma and all six customers. Its transparent background, strokes and faces are preserved byte-for-byte. SVG viewports isolate the seven complete drawings without changing the source image. No characters were redrawn.
