# Grandma’s Bakeria

An original browser game about helping Grandma grow a bakery through care, good pastries, and happy returning neighbors. The final visual direction is a mobile-first, black-and-white sketchbook: irregular outlines, hand-drawn shapes, system handwriting fonts, and a procedural Three.js/WebGL bakery.

Three.js is the only browser runtime library. Every visual is created with geometry, HTML, CSS, inline SVG, or procedural animation. There are no downloaded images, textures, models, fonts, videos, icon packs, sprite sheets, or audio files.

## Run locally

Requires Node.js 18 or later. Install the JavaScript dependency, then start the local server:

```sh
npm ci
npm run dev
```

Open <http://localhost:5173>. Use `PORT=8080 npm run dev` to choose a different port. The development server is intended for local preview.

```sh
npm test
npm run build
```

The build creates `dist/`, including `three.module.js`, its `three.core.js` dependency, and the Three.js license. Deploy the contents of that directory at the root of a static web host; no CDN, API, paid service, or backend is required. For a subdirectory deployment, adjust the root-relative script, stylesheet, and import-map paths in `index.html`. Serve over HTTP or HTTPS rather than opening `index.html` with a `file:` URL. HTTPS is recommended for native sharing and clipboard support.

WebGL renders the bakery scene; HTML controls, text, and the game engine remain separate from it. The scene is constructed in code, with a capped pixel ratio and disposable geometry/materials. On devices without a usable WebGL context, the game keeps its HTML/SVG controls rather than requiring a downloaded scene or model.

## Play

Quick Play welcomes first-time players with three customers. Story Mode follows five days, introduces more recipes and simultaneous orders, and ends with a neighborhood bakery event. The aim is to earn six regular customers and give Grandma back an hour she had planned to spend distributing flyers.

1. At the **Counter**, greet a customer and take their ticket.
2. At **Mixing**, select the ingredients on the recipe card, mix, and tap the marked tray positions to portion the order.
3. At the **Oven**, start baking and remove the tray during the golden window. The oven continues while you work at other stations.
4. At **Decorating**, apply the requested frosting and toppings and finish the pastry.
5. At **Drinks**, select a cup and drink, fill to the marked line, add the requested extras, and finish it.
6. Return to the **Counter**, select a serving tray or takeaway box, and hand the assembled order to its customer.

The selected ticket identifies which bowl, tray, drink, and finished items you are working on. Switch tickets to work on another order. Remake an item if needed; the small ingredient charge is recoverable through later sales. Sound is optional. Pause and relaxed play are available, and the game pauses when its browser tab is hidden.

The controls support pointer and touch input. Focus buttons with Tab and activate them with Enter or Space; use number keys 1–5 to switch stations and Escape to pause. Tap/select-and-place controls provide alternatives to drawing or dragging, including the “Pipe a little” button. Reduced-motion preferences are respected. The monochrome baking display pairs shade changes with explicit underbaked, golden, and overbaked status text.

## Progress and game economy

Gameplay saves locally in the browser on the current device and origin; it does not require an account or backend. Browser storage can be cleared by the player or browser and does not transfer automatically between devices. Scores, recipe discoveries, settings, upgrades, and the baking scrapbook are virtual game progress.

An order score combines accuracy (40%), baking quality (25%), presentation and drink preparation (20%), and waiting time (15%). Scoring adapts to the ordered items. Two visits scoring at least 80% make a customer a regular. Every two new regulars cancel one fictional flyer run, avoiding 10 coins and 20 minutes of advertising. A milestone is awarded once. Avoided advertising spending is tracked separately from bakery revenue and operating profit.

## Configure a real bakery

Edit `src/business-config.js` before building. Keep unconfigured links and business details empty; the interface hides unavailable actions. Use only real, approved business information.

The configuration supports the bakery name and palette tokens, its short story, signature products, menu and ordering links, address and hours, and an optional public offer. Keep palette customizations neutral to preserve the black-and-white visual direction. Map an in-game recipe to an actual menu item to give players a relevant “Try this at the bakery” next step after playing. A public offer must have clear terms and an expiry supplied by the business.

| Field | Set it to |
| --- | --- |
| `name`, `tagline`, `story`, `introduction` | The bakery’s approved branding and introductory copy |
| `colors` | Owner palette tokens; use black, white, and gray values to preserve the sketchbook appearance |
| `logo` | An optional owner-supplied logo; leave empty to use the text wordmark |
| `menuUrl`, `orderUrl`, `visitUrl` | Absolute HTTP(S) URLs for the menu, ordering service, and visit/directions page |
| `gameUrl` | The published game’s absolute URL for sharing; leave empty to share the current page |
| `address`, `hours` | Accurate business details; leave empty until supplied |
| `featuredProducts` | An array of `{ recipeId, name, url }`; `recipeId` is `cookie`, `muffin`, or `cupcake` |
| `publicOffer` | `null`, or `{ title, description, terms, expires, url }` with a `YYYY-MM-DD` expiry |
| `analytics` | `null`, or a function `(eventName, metadata) => { ... }` connecting to your own analytics |
| `loyalty` | Reserved for a future purchase-verifying integration; leave `null` |

Only HTTP(S) business links are accepted. An offer without a title, terms, or valid expiry is hidden; expired offers are also hidden. Offer expiry uses the visitor’s local end of day. Configuration is public client-side code: never put API secrets, private keys, customer records, or unpublished offer codes in it.

The optional analytics hook receives `start`, `completion`, `repeat-play`, `menu-click`, `order-link-click`, `share`, and `visit-click` events. A hook failure cannot interrupt gameplay. Supply any consent mechanism required by your analytics provider and jurisdiction before connecting it. The game itself makes no analytics network requests by default.

Purchase rewards are separate from game achievements. This standalone game does not verify purchases, maintain customer balances, issue single-use rewards, or redeem offers. Those features require a connected service with purchase verification and redemption controls. No purchase-verified loyalty interface is shown by default.

The game is designed to introduce the bakery and its products, encourage repeat play and player-initiated sharing, and make it easy for interested visitors to see the menu or order. Gameplay does not guarantee real customer loyalty, purchases, or advertising savings. Measure verified purchases only through a properly connected purchase system.

## Source layout

- `index.html` — browser entry point.
- `src/app.js` — screen rendering, controls, and browser lifecycle.
- `src/engine.js` — game state, actions, timers, progression, scoring, and local saves.
- `src/data.js` — recipes, customers, story scheduling, dialogue, and upgrades.
- `src/business-config.js` — optional real bakery configuration.
- `src/art.js` — reusable vector characters, pastries, tools, cups, and icons.
- `src/scene3d.js` — procedural Three.js/WebGL bakery, outlined geometry, station props, camera, animation, and renderer cleanup.
- `src/styles.css` — mobile-first monochrome interface, irregular sketch outlines, responsive layouts, and procedural effects.
- `tests/engine.test.js` — deterministic game-rule regression tests.
- `tests/business-config.test.js` — business-link, offer-expiry, and analytics boundary tests.
- `ASSET_MANIFEST.md` — complete reusable asset inventory.
- `REQUIREMENTS_CHECKLIST.md` — implementation map, acceptance walkthrough, and verification evidence.
- `server.mjs` / `build.mjs` — Node development server and static build that copies the local Three.js runtime.

## Validation

Run `npm test` after changing recipes or rules. The deterministic tests cover complete orders, ticket isolation, oven capacity and pause behavior, recoverable remakes, scoring, loyalty and advertising bookkeeping, upgrades, word-of-mouth referrals, the five-day return schedule, saving/resuming, safe business links, and public offers.

After a visual change, check narrow portrait phones, phone landscape, tablets, and desktop; test keyboard activation, pause/resume, hidden-tab pause, sound off, and reduced motion. Verify the built `dist/` separately: Three.js module imports must resolve without the development `node_modules` directory, and the scene must show the same active ticket and station as the controls. Browser checks still pending in this environment are marked explicitly in `REQUIREMENTS_CHECKLIST.md`.
