---
name: "Grandma’s Bakeria"
description: "An open white bakery world drawn in original black ink."
colors:
  ink: "#080808"
  paper: "#fff"
  grey: "#666"
  line: "#e6e6e6"
  secondary-rule: "#999"
  state-light: "#fafafa"
  state-dark: "#444"
typography:
  title:
    fontFamily: "'Avenir Next', 'Trebuchet MS', Arial, sans-serif"
    fontSize: "23px"
    fontWeight: 500
    lineHeight: 1.5
    letterSpacing: ".025em"
  headline:
    fontFamily: "'Avenir Next', 'Trebuchet MS', Arial, sans-serif"
    fontSize: "17px"
    fontWeight: 500
    lineHeight: 1.5
    letterSpacing: ".05em"
  body:
    fontFamily: "'Avenir Next', 'Trebuchet MS', Arial, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.7
    letterSpacing: ".025em"
  label:
    fontFamily: "'Avenir Next', 'Trebuchet MS', Arial, sans-serif"
    fontSize: "13px"
    fontWeight: 500
    lineHeight: 1.7
    letterSpacing: ".065em"
  navigation:
    fontFamily: "'Avenir Next', 'Trebuchet MS', Arial, sans-serif"
    fontSize: "11px"
    fontWeight: 400
    lineHeight: 1.7
    letterSpacing: ".09em"
  supporting:
    fontFamily: "'Avenir Next', 'Trebuchet MS', Arial, sans-serif"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.8
    letterSpacing: ".025em"
rounded:
  square: "0"
  hold: "28px 24px 27px 23px"
  field: "12px"
spacing:
  tight: "8px"
  small: "12px"
  standard: "20px"
  roomy: "28px"
  section: "35px"
  wide: "45px"
components:
  button-primary:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.square}"
    padding: "10px 5px"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.square}"
    padding: "10px 5px"
  navigation:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.navigation}"
    padding: "0"
  field-share:
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.field}"
    padding: ".7rem"
    width: "100%"
  recipe-chip:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    padding: "4px 0"
  choice:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.square}"
    padding: "9px 7px"
  ingredient:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.square}"
    padding: "8px 0"
  ticket:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    padding: "18px 0"
  hold:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.hold}"
    padding: "10px 15px"
---

# Design System: Grandma’s Bakeria

## Overview

**Creative North Star: "The White Bakery, Drawn in Ink"**

This built world follows the user's HEYTEA reference through open white space, small widely spaced navigation, informal stroke lettering, and black profile figures. Grandma’s Bakeria keeps its own characters and bakery drawings. Warmth comes from Grandma's expression, imperfect strokes, and familiar objects: a bowl, recipe book, pastry, flyer stack, and cup of tea.

Illustration floats directly on the white page. The interface has a light hand: regular or medium local sans text, narrow rules, simple arrows, and grayscale progress. Gameplay keeps the same visual restraint while making the current recipe, ticket, station, and urgent oven state available. The rejected generic bold sans headings and gray card surfaces are outside this world.

**Key Characteristics:**

- Original reusable vector lettering for display headings.
- Solid black hair, expressive profile faces, and open outline bodies.
- Loose line drawings floating in broad white space.
- Small, spaced, regular navigation and readable local sans controls.
- Flat white surfaces, fine separators, and explicit monochrome state feedback.

## Colors

The palette is paper white and near-black ink, with neutral grays reserved for supporting text, rules, and preparation states. The frontmatter is the normative token layer; the current stylesheet's cream, paper, peach, and soft aliases all resolve to white.

### Primary

- **Bakery Ink** (`ink`): text, original lettering, mascot hair and contours, active station marks, selected rules, focus outlines, and filled progress.

### Neutral

- **Open Paper** (`paper`): the page, controls, sheets, cups, and unfilled illustration areas.
- **Quiet Gray** (`grey`): supporting copy, navigation at rest, recipe details, and secondary numerical labels.
- **Fine Rule** (`line`): ticket dividers, choice rows, station boundaries, and receipt separators.
- **Secondary Rule** (`secondary-rule`): the lighter underline on secondary actions.
- **Raw White** (`state-light`): the raw pastry and active oven window's slight tonal shift.
- **Overbaked Gray** (`state-dark`): the dark end of the baking band and overbaked pastry fill.

Pastry and drink drawings use additional parameterized neutral fills to distinguish flavor, frosting, liquid, and cooking state. These are illustration data in `src/art.js`, rather than a new accent palette. State remains named in text.

**The Paper-and-Ink Rule.** Keep large areas white. Use black for identity and action, and neutral gray for subordinate information or visible preparation state.

## Typography

**Display Lettering:** the original `handLetter()` inline SVG alphabet in `src/art.js`; it is artwork, not a font family. It draws lowercase paths with rounded stroke ends, slight rotations, uneven baselines, and a consistent stroke weight. Display lettering therefore has no fabricated font token.

**Body and Control Font:** the local Avenir Next / Trebuchet MS / Arial sans stack. No font files or remote font service are required.

**Character:** display lettering supplies the friendly irregularity; quiet regular and medium sans text supplies precision. Navigation uses wide tracking without heavy weight. Numerical timers and money use tabular figures in the same local font.

### Hierarchy

- **Display:** SVG lettering for the welcome heading, mode names, station titles, and selected sheet/results headings. Size the artwork by its container, preserving its viewBox and accessible label.
- **Title:** plain section titles; the modal variant uses regular weight.
- **Headline:** supporting task headings. Customer dialogue uses regular weight, with a larger tablet and desktop treatment.
- **Body:** baseline readable text; dialogue and recipes have more open line spacing where used.
- **Label:** medium-weight action text. Smaller control variants and recipe labels remain regular or medium, never bold display substitutes.
- **Navigation:** regular small labels. The welcome navigation grows at the two wider breakpoints while retaining generous letter spacing.
- **Supporting:** muted copy; the current game also uses compact contextual labels for persistent progress and tickets.

**The Two-Handwriting Rule.** Use the original SVG alphabet for short expressive headings, and the local sans stack for instructions, status, controls, and numbers.

## Layout

The general spatial grammar is mobile-first, open, and led by floating artwork. Welcome content is contained to a broad page width (1440px); station content has a tighter working width (940px); results use a reading width (960px). Desktop does not stretch artwork to fill its available area. Side margins expand with the viewport, and the blank areas remain deliberate.

Phones use stacked workspaces, a persistent compact ticket control, and five fixed bottom station actions. The bottom bar respects the safe-area inset. At the tablet breakpoint (700px), tickets become an exposed horizontal rail and ingredient selection expands from four to six columns. Mixing and drinks can place artwork beside controls, and decoration brings options beside the pastry. At the desktop breakpoint (1080px), tickets occupy a separate side rail (310px), divided by a fine line.

Small phones have a compact adjustment (360px). Short landscape viewports (550px maximum height) reduce header and workspace height, expose more controls horizontally, and suppress the progress ribbon. They also switch back to the compact ticket drawer and fixed bottom station actions, overriding the tablet or desktop ticket rail. Keep this accommodation when extending the game: the working surface and important actions must remain reachable.

Spacing comes from compact gaps inside related controls, larger separation between work areas, and broad white breathing room around art. Distinct welcome-page composition belongs to `.impeccable/surfaces/src-app-js.md`; it is not a template every game screen must repeat.

## Elevation & Depth

The built system uses no box shadows. Depth comes from solid hair against open contours, illustration overlap, grayscale liquid or dough fill, and UI rules. Tickets and recipes remain part of the white surface. Temporary dialogs and the phone ticket drawer use translucent black backdrops and plain white sheets; those overlays are the functional layering exception.

**The Flat Paper Rule.** Separate permanent interface regions with space and light rules. Reserve dimmed backdrops for temporary focus sheets.

Motion explains work and response: a short customer entrance, ticket reveal, ingredient drop, whisk rotation, dough rise, cup steam, and bounded monochrome rewards. Reduced motion removes these animations while progress fills, timers, labels, and completion marks remain meaningful. Exact motion and breakpoint values live in the sidecar.

## Shapes

Most interface components are square, borderless white or transparent rows. Main actions use an ink underline; secondary actions use a lighter rule. Choices use a fine bottom edge with a darker, heavier selected edge. The active station has a short, slightly tilted underline.

Curves belong to physical bakery objects and tactile work controls. The hold control has a subtly uneven outline; tray, oven, toast, cup, pastry, and bowl contours keep their original irregular rounded geometry. Do not spread these object shapes into a generic rounded-card layout. The share fallback field retains its observed rounded border.

Artwork uses rounded stroke ends and joins. Interface icons have consistent original paths; detailed food drawings use finer internal lines and larger outer contours. Mascot silhouettes combine filled hair with a white face and open body, preserving the distinctive profile.

## Components

### Buttons

Simple text actions with a visible ink underline.

- **Shape:** square corners and transparent surface.
- **Primary:** medium sans label, generous minimum touch height (48px), and ink underline (2px).
- **Secondary / Ghost:** the same text structure with a lighter underline (1px). Compact actions and icon-only controls retain a minimum target (44px).
- **Hover / Focus:** pointer hover lowers opacity; keyboard focus uses an ink outline (2px) offset from the control (5px). Disabled controls visibly reduce opacity.

### Chips

Small inline annotations rather than filled badges.

- **Status:** plain muted text on a transparent surface, with no capsule container.
- **Recipe:** an inline ingredient drawing and label; a completed item gains an explicit ink check mark.

### Cards / Containers

Open rows and rails rather than a stack of filled cards.

- **Tickets:** a profile portrait, customer name, persistent order text, miniature pastry/cup, stage label, and thin patience meter. A fine top rule becomes ink for the active ticket.
- **Receipts / Upgrades / Scrapbook:** white surfaces separated by rules, using shared pastry and icon artwork.
- **Sheets:** plain square white modal bodies, aligned to the bottom on phones and centered on larger screens. Scroll within their bounded height. Lead with the heading; tutorial progress follows it, and results status follows the results heading. Dialogs capture keyboard focus, keep Tab navigation inside, and restore the triggering control when closed.

### Inputs / Fields

Native controls with restrained monochrome treatment.

- **Settings:** native checkboxes inside choice rows, ink accent, readable accompanying labels, and the shared keyboard focus outline.
- **Share field:** a read-only full-width text field, lightly outlined, with a minimum height (48px). It exists for copying the current game URL.
- **Choice buttons:** label or artwork plus text, transparent background, fine bottom rule, and heavier ink selection. Never communicate state only through a grayscale change.

### Navigation

- **Welcome:** a small Grandma mark and regular, widely spaced text links. Phone navigation hides supplementary label text where the corresponding accessible control remains present. The icon-only share action retains a full touch target (44px by 44px).
- **Stations:** five icon-and-label actions. Inactive labels are gray; active labels become ink with a short underline. Oven attention adds a small ink dot as well as the persistent oven-alert action.
- **Responsive behavior:** fixed bottom actions on phones, sticky station actions on wider screens; ticket access changes from drawer to horizontal rail to desktop side rail.

### Ingredient Selector

An original ink ingredient drawing floats above a compact readable label. Each control has a generous target; added ingredients gain a small check. Pointer hover gently rotates the drawing. Keep the recipe requirements visible nearby.

### Hold Control

A white, irregular rounded outline with an explicit percentage and a bottom ink progress line. The full-width target supports holding or repeated tapping. Its tactile silhouette is specific to stirring and pouring.

### Shared Artwork

Use the existing generators in `src/art.js`: profile characters, original lettering, pastries, cup, bowl, tools, containers, and icons. Preserve semantic labels for meaningful artwork and readable text beside interface icons. Asset inventory and restrictions are recorded in `ASSET_MANIFEST.md`.

## Do's and Don'ts

### Do:

- **Do** follow the user's HEYTEA reference through white space, restrained navigation, original black profile figures, and loose line artwork.
- **Do** reuse the SVG alphabet and asset generators before adding a new visual vocabulary.
- **Do** keep art free to float directly on white, with fine rules separating functional regions.
- **Do** preserve important touch targets, visible focus, persistent tickets and oven alerts, and keyboard or tap alternatives.
- **Do** pair grayscale state with words, numbers, checks, progress, or another explicit marker.
- **Do** preserve the complete bakery game while extending this visual system.

### Don't:

- **Don't** restore generic bold sans hero headings or large gray card surfaces.
- **Don't** use HEYTEA's logo, brand name, or copied artwork in Grandma’s Bakeria.
- **Don't** add shadows, decorative gradients, textures, or broad colored surfaces to the permanent interface.
- **Don't** require downloaded media, fonts, icon packs, sprite sheets, or browser runtime libraries; the sole permitted external image is an optional owner-supplied logo.
- **Don't** require dragging, rotation, or decorative motion to complete an action.
