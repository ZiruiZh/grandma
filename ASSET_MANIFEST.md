# Asset manifest

Bundled artwork: **17 unchanged owner-supplied PNGs and one direct Goodnotes character-sheet capture**. The user explicitly supplied these assets after the initial zero-image brief. No remote asset download is required at runtime. Optional owner logo stays hidden unless configured. Runtime libraries: **zero**.

The minimalist identity uses the supplied black-line artwork, open white surfaces, reusable stroke lettering, and local system text. Original artwork is displayed without redraws, recoloring, extra fills, shadows, 3D effects, or character animation. HEYTEA informs spacing and restraint; no HEYTEA logo or downloaded brand asset is used.

| Component | Contents | Implementation |
| --- | --- | --- |
| Brand wordmark | Configurable live bakery name, original Grandma portrait motif | HTML and `brandMark()` inline SVG |
| Bakery environment | Window, shelves, display, worktop, register, recipe book, flyer stack, regular notes, tea; station oven and drink workspace | `grandmaVignette()` SVG, original character-sheet crop, and reusable HTML/CSS station surfaces |
| Shared character | Grandma, Mr. Maple, Maya, Theo, Ruby, Sam, June | One unchanged Goodnotes sheet; seven static SVG viewport crops via `originalCharacter()` |
| Expressions | Neutral, happy, waiting, disappointed | Original faces are retained; satisfaction and reactions use readable text |
| Pastries | Cookie, muffin, cupcake; plain/vanilla/chocolate; supported recipe toppings | Original cookie, muffin, chocolate-chip muffin, cupcake and sprinkle-cupcake PNGs via `suppliedPastry()` |
| Baking states | Raw, golden, overbaked | Unaltered drawings; explicit bake status, timer, and progress band |
| Ingredients | Flour, sugar, butter, egg, milk, cocoa, chips, raisins, blueberries, honey, coffee, tea | Supplied ingredient PNGs plus generated icons for ingredients without supplied drawings; readable labels |
| Decorations | Frosting/cream swirl, drizzle lines, sprinkles, marshmallows | Parameterized SVG paths and bounded DOM marks |
| Drink vessel | One cup, optional handle, takeaway lid | `cup()` SVG |
| Drink contents | Coffee, two tea varieties, hot chocolate, milk, fill level, cream and marshmallows | Clip path, neutral fills, shared topping geometry and steam |
| Tools | Bowl, whisk, scoop, piping bag, kettle | `bowl()`, `toolIcon()` and shared SVG paths |
| Containers | Baking tray, serving plate, takeaway box | `servingContainer()` SVG |
| Interface icons | Play, pause, home, settings, sound/mute, arrow, check, close, coin, heart, star, clock, share, station icons | One consistent original inline SVG collection |
| Interface surfaces | Buttons, station bar, tickets, drawer, meters, dialogs, receipts, scrapbook and upgrades | Semantic HTML with mobile-first CSS |
| Effects | Customer entrances/exits, ticket reveal, ingredient drop, whisk rotation, pastry rise, steam, piping, sprinkles, cup fill, package closure, coins, hearts/stars, celebration | CSS keyframes, clipped SVG, bounded DOM particles |
| Sound | Bell, mixing, pouring, ding, payment, milestone | Optional synthesized Web Audio; zero sound files |
| Typography | Titles, dialogue, labels, numbers | Original reusable SVG alphabet for display headings; local Avenir Next / Trebuchet MS / Arial stacks for readable controls; no downloaded font |
| Recipe/customer data | Supported combinations, timing, economy, six profiles, returning dialogue, tutorial | `src/data.js` |
| Business configuration | Brand copy/colors, featured products, links, address, hours, optional offer and analytics | `src/business-config.js` |
| Optional logo | Existing bakery logo supplied by owner | At most one image; none included |

SVG scales without raster blur. Text accompanies meaningful state and icons. Work surfaces remain visible on phones; reduced motion removes decorative movement while preserving fills, status, and progress. Core gameplay makes no external asset or API requests.

Record any future approved addition here with its source, license, purpose, and path. Prefer changes to existing components over new image files.

## Supplied artwork inventory

All 17 uploaded PNGs are copied byte-for-byte into `src/assets/`. Duplicate uploads of the recipe sheet reuse the same file. `src/assets/manifest.json` records original filenames and dimensions. SVG viewports remove only surrounding padding on screen; source files remain intact.

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
| `tools-sheet.png` | Baking tool/oven/cup artwork sheet; integration in progress |
| `customer-sheet.png` | Static original Grandma and six customer crops |

The Goodnotes character sheet was directly captured from the provided read-only page because export requires sign-in. Its cream paper and original faces are preserved. No characters were redrawn.
