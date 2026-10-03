# Release requirements and verification

The user’s final direction directly references https://www.heytea.com/: small spaced navigation, hand-lettered headlines, original black profile mascots, loose ink drawings, open white surfaces, and mobile-first composition. All assets share this visual language. The game uses no downloaded media or fonts and no browser runtime libraries.

## Verified in this revision

| Area | Evidence |
| --- | --- |
| Original reusable artwork | Visual asset gallery reviewed: seven character configurations; three pastry silhouettes in raw/golden/overbaked states; coffee, milk, tea, hot chocolate, cream, marshmallows and takeaway cup; twelve ingredients; bowl, whisk, scoop, piping bag, kettle; three serving containers. `src/art.js` |
| Typography and reference | HEYTEA homepage and products viewed in the browser on desktop and phone. Display lettering uses one original stroke alphabet; controls use local system fonts. No remote font or brand asset is loaded. |
| Welcome/story | Grandma, recipe book, flyer stack, exact introductory line, two modes, daily recipe, scrapbook, sharing, and configurable brand copy are present. |
| Complete browser order | Served Mr. Maple’s cookie and breakfast tea in the standalone `dist/` build: ingredients → keyboard mixing → portion → bake → drink/cup/fill → golden alert → finish pastry → packaging → serve → payment and friendly feedback. |
| First-run tutorial | Fresh origin shows the tutorial; skip proceeds into play. |
| Responsive layout | Phone 390×844, tablet 768×1024, desktop 1280×800, and landscape 844×390 checked. No horizontal document overflow. Phone has persistent ticket drawer and station navigation; tablet has an order strip; desktop has a side ticket panel. |
| Targets and accessibility | Important visible buttons in the phone gameplay check measured at least 44px high; the mobile share target measures 44×44px. SVG display lettering has accessible text. Mixing/pouring keyboard alternatives exercised; oven warning is a working station link. Reduced-motion setting applies the root class; pause menu and save/home controls exercised. Scrapbook, ticket drawer, and pause dialogs focus inside the dialog and restore their opener on dismissal. |
| Final design review | PASS. All four review findings resolved: dialog focus, compact tickets in short landscape, mobile share target, and overlay heading hierarchy. Landscape recapture shows the station heading and compact ticket drawer with no horizontal overflow. |
| Standalone source/build | `npm run build` succeeds. Built game served independently on port 5174; tested order completed, no browser console errors. Native modules and inline SVG require no runtime dependency, CDN, API, or backend. |
| Regression suite | `npm test`: 22 passing tests, including complete Quick Play, five-day progression, six regulars, exactly three advertising milestones, correct finance separation, ownership of multiple tickets, two oven shelves, pause, remakes, upgrades, save/resume, supported recipes, daily challenges and business configuration. |

## Requirements retained in the engine

- Quick Play serves three customers; Story Mode progresses across five days with recipe unlocks, upgrades, returning neighbors and the final event.
- Five stations share selected tickets and independently owned bowls, trays, pastries and drinks.
- Supported recipe/drink combinations, generous golden windows, recoverable remakes, friendly scoring and the 40/25/20/15 weights remain.
- Two successful visits earn a regular. Six regulars cancel three fictional flyer runs, avoiding 30 coins and saving 60 minutes. Avoided spending never increases sales or operating profit.
- Local progress includes recipes, upgrades, settings, best scores and scrapbook entries. No missed-day punishment or account requirement.
- Empty business links, purchase rewards and offers stay hidden. Public offers require owner terms and expiry. Analytics never claims unverified purchases.

## Remaining device-specific acceptance checks

Automated checks establish game rules; they do not claim physical-device coverage. Native sharing, clipboard permissions, sound output and prolonged touch holds should still be checked on the target iOS/Android devices. A final five-day browser walkthrough with simultaneous trays, offer configuration and real owner links is separate from the passing automated story/economy tests.

1. Play all three Quick Play recipes with touch, including cupcake piping and sprinkles. Test a recoverable early bake and drink remake.
2. Complete five story days, buy upgrades, switch simultaneous tickets, and verify all three savings milestones on the results screens.
3. Pause and hide the browser while baking; confirm timer/patience freeze and resume behavior on the actual target device.
4. Configure approved owner branding/products/links/offer in `src/business-config.js`; check conversion, offer terms, sharing and optional analytics.
5. Deploy `dist/` to the intended static host and exercise native sharing and storage behavior under its real HTTPS origin.

See `README.md` for setup and configuration, and `ASSET_MANIFEST.md` for the complete reusable inventory.
