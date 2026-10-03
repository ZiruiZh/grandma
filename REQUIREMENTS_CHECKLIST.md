# Release requirements and verification

The user’s final direction directly references https://www.heytea.com/: small spaced navigation, hand-lettered headlines, original black profile mascots, loose ink drawings, open white surfaces, and mobile-first composition. All assets share this visual language. The game uses no downloaded media or fonts and no browser runtime libraries.

## Verified in this revision

| Area | Evidence |
| --- | --- |
| Original reusable artwork | Final asset gallery reviewed: seven unchanged original transparent character-sheet crops; all 15 individual supplied pastry/ingredient PNGs; source ingredient/tool sheets; original oven, bowl, whisk, scoop, piping bag, cups and icon crops. All 18 uploaded PNG hashes match their sources. Explicit clip rectangles prevent neighboring figures from leaking into wider containers. `src/supplied-assets.js` |
| Typography and reference | HEYTEA homepage and products viewed in the browser on desktop and phone. Display lettering uses one original stroke alphabet; controls use local system fonts. No remote font or HEYTEA brand asset is loaded. Later supplied original PNGs are bundled locally. |
| Welcome/story | Grandma, recipe book, flyer stack, exact introductory line, two modes, daily recipe, scrapbook, sharing, and configurable brand copy are present. |
| Complete browser order | Standalone `dist/` build previously completed cookie/tea. Final original-art source completed all three Quick Play orders: cookie/tea, blueberry muffin/coffee with milk and takeaway lid, cupcake/strawberry frosting/sprinkles/hot chocolate with marshmallows. Session scored 96%; cupcake scored 100%. Mixing/pouring used keyboard alternatives; cupcake guide used ten pointer taps. |
| First-run tutorial | Fresh origin shows the tutorial; skip proceeds into play. |
| Responsive layout | Phone 390×844, tablet 768×1024, desktop 1280×800, and landscape 844×390 checked. No horizontal document overflow. Phone has persistent ticket drawer and station navigation; tablet has an order strip; desktop has a side ticket panel. |
| Targets and accessibility | Important visible buttons in the phone gameplay check measured at least 44px high; the mobile share target measures 44×44px. SVG display lettering has accessible text. Mixing/pouring keyboard alternatives exercised; oven warning is a working station link. Reduced-motion setting applies the root class; pause menu and save/home controls exercised. Scrapbook, ticket drawer, and pause dialogs focus inside the dialog and restore their opener on dismissal. |
| Final design review | PASS. Final original-art review independently verified all 18 PNG hashes, original character/crop integrity, tool/pastry crops, original asset integrity and prior static treatment and responsive controls. Initial UI review: all four findings resolved: dialog focus, compact tickets in short landscape, mobile share target, and overlay heading hierarchy. Landscape recapture shows the station heading and compact ticket drawer with no horizontal overflow. |
| Standalone source/build | `npm run build` succeeds. Built game served independently on port 5174; tested order completed, no browser console errors. Native modules, local PNGs and inline SVG require no runtime dependency, CDN, API, or backend. |
| Regression suite | `npm test`: 24 passing tests, including complete Quick Play, five-day progression, six regulars, exactly three advertising milestones, correct finance separation, ownership of multiple tickets, two oven shelves, pause, remakes, upgrades, save/resume, supported recipes, daily challenges and business configuration. |

## Requirements retained in the engine

- Quick Play serves three customers; Story Mode progresses across five days with recipe unlocks, upgrades, returning neighbors and the final event.
- Five stations share selected tickets and independently owned bowls, trays, pastries and drinks. Characters remain static; original tool crops follow gestures and live liquid/icing layers supply preparation feedback. The latest user request puts live icing directly over the original pastry, with unchanged source files.
- Supported recipe/drink combinations, generous golden windows, recoverable remakes, friendly scoring and the 40/25/20/15 weights remain.
- Two successful visits earn a regular. Six regulars cancel three fictional flyer runs, avoiding 30 coins and saving 60 minutes. Avoided spending never increases sales or operating profit.
- Local progress includes recipes, upgrades, settings, best scores and scrapbook entries. No missed-day punishment or account requirement.
- Empty business links, purchase rewards and offers stay hidden. Public offers require owner terms and expiry. Analytics never claims unverified purchases.

## Remaining device-specific acceptance checks

Automated checks establish game rules; they do not claim physical-device coverage. Native sharing, clipboard permissions, sound output and prolonged touch holds should still be checked on the target iOS/Android devices. A final five-day browser walkthrough with simultaneous trays, offer configuration and real owner links is separate from the passing automated story/economy tests.

1. Repeat the completed Quick Play walkthrough on physical touch devices, including direct pastry piping. Test a recoverable early bake and drink remake.
2. Complete five story days, buy upgrades, switch simultaneous tickets, and verify all three savings milestones on the results screens.
3. Pause and hide the browser while baking; confirm timer/patience freeze and resume behavior on the actual target device.
4. Configure approved owner branding/products/links/offer in `src/business-config.js`; check conversion, offer terms, sharing and optional analytics.
5. Deploy `dist/` to the intended static host and exercise native sharing and storage behavior under its real HTTPS origin.

See `README.md` for setup and configuration, and `ASSET_MANIFEST.md` for the complete reusable inventory.

## Latest interaction update

Browser check completed one cookie-and-tea order using six whisk drags, a tray dropped into the oven, direct icing on the cookie, kettle dragging and keyboard pouring, packaging and payment. The original 18 PNG files are unchanged. Continuous input and optional cookie icing have regression coverage. Vercel production: https://grandma-bakeria.vercel.app.
