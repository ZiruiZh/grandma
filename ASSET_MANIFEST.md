# Asset manifest

Grandma’s Bakeria uses original code-generated artwork in a black-and-white, hand-drawn sketchbook style. Required downloaded **media asset files: 0**. Downloaded images, textures, models, stock artwork, fonts, icon packs, videos, animation sprite sheets, and prerecorded audio: **0**. One existing owner-supplied logo may be added as an optional business customization; the default game has no image assets.

**Runtime code library: Three.js.** This is locally served JavaScript, not a media asset. The build ships the Three.js ES module and the modules it imports alongside the game. Core gameplay does not load a CDN or remote asset service.

This inventory describes reusable components rather than separate image files. Variants share geometry and change color, text, props, or state.

| Component | Variants / contents | Implementation |
| --- | --- | --- |
| Brand wordmark | Configurable bakery name and baking motif | Live system-font text and inline SVG |
| Bakery environment | Wall, floor, counter, worktop, oven, mixing area, decorating area, drinks area, recipe book, flyers | Procedural Three.js geometry and outlined edges in `src/scene3d.js`; reusable HTML/CSS and SVG props |
| WebGL scene | Camera, lights, station props, irregular outline loops, animation | Local Three.js runtime; orthographic camera, primitive meshes, generated line geometry; no model or texture files |
| Character template | Grandma, Mr. Maple, Maya, Theo, Ruby, Sam, June | Parameterized inline SVG with clothing, hair, color, and accessories |
| Facial expressions | Neutral, happy, waiting, disappointed | Swappable SVG eyes, brows, and mouth |
| Pastry silhouettes | Cookie, muffin, cupcake | Three reusable vector shapes |
| Pastry states | Raw, golden, overbaked; vanilla and chocolate | Grayscale fills, scale, recipe parameters, and explicit text labels |
| Ingredient symbols | Flour, sugar, butter, egg, milk, cocoa, chocolate chips, raisins, blueberries, honey, coffee, tea | Shared inline SVG symbols |
| Decorations | Frosting/cream, drizzle, sprinkles, marshmallows | Reusable SVG primitives and bounded procedural marks |
| Drink container | Cup, handle, optional takeaway lid | Shared inline SVG cup with fill-level clipping |
| Drink contents | Coffee, tea varieties, hot chocolate, milk, extras | Grayscale fills, clipped SVG liquid, procedural WebGL liquid geometry, and reusable topping shapes |
| Baking tools | Bowl, whisk, scoop, piping bag, kettle | Reusable inline SVG shapes |
| Serving containers | Baking tray, serving plate, takeaway box | CSS and inline SVG |
| Interface icons | Play, pause, home, settings, sound on/off, arrow, check, close, coin, heart, star, clock, share | Shared inline SVG component |
| Interface surfaces | Buttons, station navigation, tickets, meters, dialogs, customer cards, receipts, scrapbook | Semantic HTML and mobile-first CSS with asymmetric outlines, dotted/dashed strokes, and monochrome shadows |
| Animation/effects | Customer entrance, ticket opening, ingredients, whisk, pastry expansion, steam, frosting, sprinkles, cup fill, packaging, floating rewards, celebration | Three.js transforms, CSS keyframes, SVG, and small procedural effects; reduced-motion alternatives |
| Sound | Order bell, mixing, pouring, oven ding, payment, milestone | Optional synthesized browser audio; no sound files |
| Typography | Titles, dialogue, labels, numbers | Local system stacks: Comic Sans MS, Bradley Hand, Chalkboard SE, and system fallbacks; no web fonts |
| Recipe data | Supported options, ingredients, timings, prices, scoring | Structured native JavaScript modules |
| Customer content | Six profiles, Grandma’s story, reactions, returning visits, tutorial | Structured text and state |
| Business content | Name, colors, story, featured products, links, address, hours, public offer | Owner-editable configuration |
| Optional logo | One existing owner-provided business logo | Optional image; none included |

## Ownership and additions

Characters, recipes, artwork, and interface composition are original to this project. No assets from Papa’s games are used. The reference informs the order-and-station gameplay pattern only.

Keep new variants within the existing reusable components whenever possible. Record any approved external addition here with its source, license, purpose, and file path. Do not add a dependency on remote asset hosts for core gameplay.

| Approved code dependency | Source / license | Purpose / distribution |
| --- | --- | --- |
| Three.js | npm package `three`, upstream `https://github.com/mrdoob/three.js`; MIT license | Procedural WebGL renderer. Installed under `node_modules/three`; `three.module.js` and `three.core.js` are copied into `dist/node_modules/three/build`; the license is copied to `dist/node_modules/three/LICENSE`. |

The package lock records the exact installed version. Three.js is the only library loaded by the browser; development tooling is not artwork or a runtime media dependency.

## Accessibility and performance

Vector assets scale with the layout; the WebGL renderer caps its pixel ratio and resizes with its container. Text labels accompany meaningful icons and baking shades. Essential game state is also shown through text and meters. The scene is decorative and does not replace keyboard-accessible HTML controls. Character variants and recipes reuse geometry, and renderer resources are disposed when a scene is replaced. Reduced motion suppresses motion-heavy effects while retaining state information.
