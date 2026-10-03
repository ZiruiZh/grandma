---
version: 1
slug: "src-app-js"
primary_target: "src/app.js"
related_targets: ["src/art.js","src/supplied-assets.js","src/styles.css","src/interactions.js","ASSET_MANIFEST.md"]
---

# Welcome and bakery game

## Scope and visitor mode

Welcome is Persuade: choose a short baking break or Grandma’s five-day story. Stations, tickets, recipes, results, and settings are Operate: tasks stay clear and recoverable.

## Audience, job, and action

Phone, tablet, and desktop visitors should understand Grandma needs a little help and start Quick Play or Story Mode without an account. Returning visitors continue their story. The selected ticket, next task, and oven attention remain visible or immediately reachable.

## Chosen direction and memorable moment

HEYTEA supplies the spatial authority: open white space, restrained regular navigation, and generous gaps. The supplied PNGs, including the exact uploaded transparent character sheet, supply the artwork authority. The final user direction is to preserve the original assets; possible redrawn or 3D character treatments were rejected. The welcome’s familiar moment is the original Grandma beside “good bakes / by grandma,” a recipe book, flyers, an original cup, and a croissant.

## First viewport and page sequence

Phone welcome has a small original Grandma portrait opposite recipe-book/share controls, a left-aligned stroke heading, and the right-aligned vignette. Quick Play and Story Mode are open arrow actions below. The exact supplied introduction follows, then today’s recipe, scrapbook, optional configured business links, and a quiet footer. The share icon retains a full touch target.

Tablet places heading and vignette side by side. Desktop places the static original Grandma at left, the heading in the middle, and the vignette at right, with centered mode actions underneath. This composition belongs to the welcome.

## Play surfaces and proof

Counter uses the unchanged customer crops. Mixing places the moving original whisk inside the bowl with circular drag, hold, tap, and keyboard alternatives. The tray drags into a marked oven door, with a load button fallback; base recipes reach golden in seven to eight seconds and retain a nine-second golden window. Icing is dragged directly onto the cookie or cupcake in a clipped SVG layer above the unchanged pastry. Drinks use a tipping kettle, live liquid beneath the original cup, an 80% line, and draggable or tappable extras. Progress and timers update smoothly with the pointer/RAF controller.

Phone ticket access is a persistent compact drawer. Wider layouts expose a horizontal rail and then a side rail; short landscape returns to the drawer and fixed station actions. Tickets retain original customer and food drawings with readable order text. The scrapbook’s illustrated pantry displays both complete original ingredient and tool sheets. Results use white receipt rows, fine rules, and status below the heading. Dialogs keep keyboard focus inside and return it on close.

## Constraints and unresolved decisions

DESIGN.md documents the current built world; ASSET_MANIFEST.md inventories the approved local assets. Eighteen uploaded PNGs remain byte-for-byte unchanged. The user’s exact transparent customersandgrandma.png is bundled as customer-sheet.png at its original dimensions (3200 by 2000). Seven static character regions and the Grandma portrait crop preserve the original faces and transparency. Explicit clip rectangles match the viewports so surrounding figures cannot appear through letterboxing. The latest user direction adds direct preparation gestures and supersedes the earlier static-tool/separate-guide constraint. Source PNG bytes and characters remain unchanged and static. Intact tool containers may move, and separate pale liquid/icing state layers may appear under or over the original drawing.

Preserve the full original game, explicit preparation progress, pause behavior, tap/keyboard alternatives, focus visibility, and persistent oven alerts. No remote media, downloaded font, or browser runtime library is required. Real business details and offers remain conditional on configuration. The preparation patch continues the same visual world and is intended for the existing production surface at https://grandma-bakeria.vercel.app.
