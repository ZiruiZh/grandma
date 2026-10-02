# Release requirements checklist

The final visual direction is mobile-first, minimalist black and white, with irregular hand-drawn outlines, system handwriting fonts, and a procedural Three.js/WebGL scene. The original gameplay, story, business boundaries, and accessibility requirements remain. “Pending” identifies a runtime check that has not yet been completed; source review is not a claim of browser verification.

| Experience | Implementation / evidence | Verification and status |
| --- | --- | --- |
| New visual direction and zero media assets | `src/styles.css`, `src/scene3d.js`, `src/art.js` | Source contains mobile-first monochrome CSS, asymmetric outlines, procedural meshes/lines, and local system fonts. Final screenshots: pending. Three.js is a code library, not a downloaded media asset. |
| Warm introduction; Grandma, recipe book, flyers; exact introductory line | `src/business-config.js`, `src/app.js`, procedural welcome scene in `src/scene3d.js` | Copy verified; scene builds Grandma, recipe book, and flyers. Emotional progression: pending UI review. |
| Quick Play: three customers; Story: five days and neighborhood event | Engine session creation, day schedule, `DAY_TITLES` in `src/data.js` | Engine schedule has three Quick Play orders. A public-action walkthrough completed all five story days. Browser timing/UI: pending. |
| Complete order loop across five stations | `src/engine.js` actions; `src/app.js` station controls | Automated tests complete pastry + drink + packaging + payment for all three pastry families. Browser controls: pending. |
| Clear tickets, ownership, persistent selected ticket and oven warnings | Order IDs and ticket data in engine; desktop panel/mobile drawer in UI | Automated tests verify independent bowls, trays, drinks, selected tickets, and oven capacity. Browser persistence/alerts: pending. |
| Supported cookies, muffins, cupcakes and gradual unlocks | `RECIPES` in `src/data.js` | Catalog verified. All 19 baseline story orders were prepared and scored 100% using their requested ingredients/options. |
| Tactile ingredients, hold/stir, generous portion targets | Mixing actions and UI effects | Pointer hold, tap/keyboard alternative, release/cancel, and visible progress: pending. |
| Timed baking, golden window, recoverable mistakes | Recipe golden windows are 12–21, 14–23, and 13–22 seconds; engine oven capacity and remake actions | Tests cover bake states, one-time alerts, paused timers, remakes, and no permanent insolvency. Monochrome state text/shades and sound: pending browser check. |
| Frosting, recipe-supported toppings, bounded sprinkles | Decorating actions, inline SVG, UI pointer handlers | Finish each pastry family; alternate taps; score forgiving accuracy; marks stay on pastry: pending. |
| Coffee, two teas, hot chocolate, extras, fill line, takeaway lid | `DRINKS` in `src/data.js`; reusable cup and engine drink preparation | Catalog verified. Full preparation, over/underfill, correct extras, and remake: pending. |
| Six original customers; friendly reactions and returning dialogue | `CUSTOMERS` and `GRANDMA` in `src/data.js`; shared character component | All six required personalities and returning/happy/gentle dialogue verified. Entrance/exit and expressions: pending. |
| Correct assembly, payment, tips, weighted scoring | Counter UI and engine scoring | Tests verify exact 40/25/20/15 weighting, pastry-only adaptation, matched customer, and preventing duplicate payment. |
| Two successful visits earn a regular; six regulars attainable | Profile visit history and story return schedule | Independent perfect-service walkthrough earned all six regulars by Day 4; repeat visits on Day 5 did not duplicate regulars. |
| Fictional advertising milestones separate from finances | Engine profile advertising ledger and results UI | Tests/walkthrough earn exactly three milestones, 30 avoided coins, and 60 saved minutes, excluding savings from revenue and profit. UI display: pending. |
| Recommendations introduce later customers | `profile.wordOfMouth` and day-two referral scheduling in engine | Test verifies strong day-one service introduces Maya early and preserves her returning visit; no referral without enough word of mouth. |
| Grandma’s environment improves | Flyer count, regular notes, happier expression, quiet tea in UI/art | Compare opening, intermediate milestone, and story completion: pending. |
| Real branding, product discovery, conversion links | `src/business-config.js`, result/welcome rendering | Config supports brand, colors, copy, optional logo, product mapping, menu/order/visit links, address/hours. Hidden empty values and rendered configuration: pending. |
| Safe public offers and honest business boundary | `activeOffer`, `safeBusinessUrl`, `loyalty: null` in config | Tests cover missing/expired offers and HTTP(S)-only links. Source labels game stamps virtual and does not render purchase rewards. Configured UI: pending. |
| Sharing and optional analytics | `gameUrl`, `trackEvent`, browser share/clipboard handlers | Native share plus fallback; starts/completions/repeats/menu/order events; no fabricated purchase events: pending. |
| Daily recipe, personal bests, scrapbook, replay | Daily challenge and profile history in engine; welcome challenge action and scrapbook UI | Tests verify date-stable supported challenges without missed-day penalties. Daily mode, bests, and replay through browser: pending. |
| Forgiving economy and six upgrades | `UPGRADES` in `src/data.js`; engine purchase/effect rules | Tests cover affordability, unlocks, one-time purchases, gameplay effects, and empty-purse recovery. Shop UI: pending. |
| Day and final results | Session summary and results UI | Served, score, sales, ingredient costs, tips, new regulars, ad milestones; next-day/replay controls: pending. |
| Mobile-first phone/tablet/desktop; no horizontal overflow | Base phone CSS; ≥700px tablet strip; ≥1080px desktop ticket panel; landscape query | Inspect phone 390×844, landscape 844×390, tablet 768×1024, desktop 1440×900: pending. |
| Accessible input and time controls | Semantic buttons, pointer handling, pause/settings, visibility handler, reduced-motion WebGL option | Engine pause/input freeze tests pass. CSS has ≥44px controls and reduced-motion overrides; browser keyboard focus, hidden-tab behavior, and live WebGL update: pending. |
| Code-generated artwork and effects only | `src/art.js`, `src/scene3d.js`, CSS; `ASSET_MANIFEST.md` | Source audit finds no texture/model/font/media fetches. One optional owner logo; inline SVG favicon. Three.js is locally served runtime code. |
| Maintainable separation and locally saved core | Native modules; Three.js scene; local persistence; Node server/static build | Engine save/resume tests pass, including unavailable storage. Build succeeds and a file-graph check confirms the required `three.core.js` is present. Browser resume/WebGL rendering: pending. No paid service/API/backend. |
| Setup and configuration documentation | `README.md`, `ASSET_MANIFEST.md` | Updated for `npm ci`, local Three.js, generated WebGL scene, monochrome palette, business configuration, and zero downloaded media. |

## Acceptance walkthrough

1. Start Quick Play with sound off; complete a cookie-and-tea order and a cupcake-and-hot-chocolate order using taps or keyboard actions. Remove one pastry early, remake it, and verify the ingredient charge.
2. Leave a tray baking, change station and selected ticket, and finish its drink. Confirm the alert names the correct order and golden timing remains visible.
3. Pause while baking; wait; resume. Repeat by hiding the tab. Confirm baking and customer patience do not advance while paused or hidden.
4. In Story Mode, finish five days with successful repeat visits. Buy the second oven shelf and use two trays. Confirm six regulars, exactly three advertising milestones, 30 avoided coins, and 60 saved minutes without increasing sales revenue.
5. Reload with an active ticket and owned upgrade. Confirm the order’s ingredients, bake state, drink, profile, and settings resume consistently.
6. Inspect welcome, each station, drawer/ticket strip, results, upgrades, pause, and scrapbook at the four viewport sizes above. Repeat essential controls with keyboard and reduced motion. Confirm the monochrome WebGL scene follows the selected ticket, baking state, and drink fill.
7. With empty business configuration, confirm no dead menu/order/offer/redeem controls. With real test configuration, confirm product links, safe URLs, offer expiry/terms, sharing fallback, and analytics callbacks.
8. Serve only `dist/` from a clean static root and inspect network/module errors. Confirm `three.module.js` and its relative imports resolve locally, with no media, model, or font downloads. Check that unavailable WebGL leaves usable controls.

## Release evidence

- A Node catalog/configuration check passed: six unique customers, six upgrades, two tea varieties, 10–20 second bake starts, generous golden windows, hidden unconfigured offer, rejected `javascript:` / `data:` links, and an analytics allowlist that excludes unverified purchase events.
- `node --test tests/business-config.test.js`: three passing tests cover safe business links, required/expired offers, and optional analytics including failure isolation and rejecting unverified purchase/redemption events.
- An independent engine walkthrough prepared and served every baseline story order through public actions, completed all five days, and verified six regulars and separate/idempotent advertising savings.
- `npm test`: 22 passing tests, including 19 engine checks and three business-configuration checks.
- `npm run build`: passed. `node --check src/scene3d.js`: passed. A built-module file-graph audit found `three.module.js` requires `./three.core.js` and confirmed that dependency is included.
- Browser verification is pending: this QA agent’s browser tool reports no available browser, including the in-app browser. No screenshot, touch, or keyboard runtime check is represented as passed on that basis.
