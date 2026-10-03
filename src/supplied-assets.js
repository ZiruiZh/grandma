/** Owner-supplied transparent artwork, preserved byte-for-byte. */
export const SUPPLIED_ASSETS = {
  "blueberries": {
    "file": "blueberries.png",
    "width": 359,
    "height": 371,
    "bounds": [
      69,
      85,
      317,
      340
    ]
  },
  "butter": {
    "file": "butter.png",
    "width": 279,
    "height": 302,
    "bounds": [
      51,
      49,
      247,
      260
    ]
  },
  "choc-chip-muffin": {
    "file": "choc-chip-muffin.png",
    "width": 301,
    "height": 288,
    "bounds": [
      36,
      51,
      262,
      258
    ]
  },
  "chocolate": {
    "file": "chocolate.png",
    "width": 187,
    "height": 333,
    "bounds": [
      22,
      46,
      161,
      288
    ]
  },
  "cocoa": {
    "file": "cocoa.png",
    "width": 372,
    "height": 330,
    "bounds": [
      45,
      50,
      317,
      287
    ]
  },
  "cookie": {
    "file": "cookie.png",
    "width": 306,
    "height": 253,
    "bounds": [
      62,
      25,
      281,
      228
    ]
  },
  "croissant": {
    "file": "croissant.png",
    "width": 442,
    "height": 274,
    "bounds": [
      71,
      91,
      367,
      203
    ]
  },
  "cupcake": {
    "file": "cupcake.png",
    "width": 347,
    "height": 332,
    "bounds": [
      66,
      52,
      306,
      289
    ]
  },
  "egg": {
    "file": "egg.png",
    "width": 205,
    "height": 279,
    "bounds": [
      30,
      41,
      179,
      246
    ]
  },
  "flour": {
    "file": "flour.png",
    "width": 318,
    "height": 446,
    "bounds": [
      48,
      58,
      291,
      379
    ]
  },
  "honey": {
    "file": "honey.png",
    "width": 401,
    "height": 405,
    "bounds": [
      60,
      17,
      380,
      362
    ]
  },
  "milk": {
    "file": "milk.png",
    "width": 282,
    "height": 299,
    "bounds": [
      39,
      54,
      254,
      263
    ]
  },
  "muffin": {
    "file": "muffin.png",
    "width": 306,
    "height": 315,
    "bounds": [
      38,
      54,
      264,
      261
    ]
  },
  "raisins": {
    "file": "raisins.png",
    "width": 205,
    "height": 325,
    "bounds": [
      27,
      39,
      178,
      276
    ]
  },
  "sprinkles-cupcake": {
    "file": "sprinkles-cupcake.png",
    "width": 338,
    "height": 332,
    "bounds": [
      50,
      52,
      290,
      289
    ]
  },
  "recipe-sheet": {
    "file": "recipe-sheet.png",
    "width": 2360,
    "height": 1640,
    "bounds": [
      108,
      78,
      2030,
      1306
    ]
  },
  "tools-sheet": {
    "file": "tools-sheet.png",
    "width": 2360,
    "height": 1640,
    "bounds": [
      126,
      132,
      2107,
      1535
    ]
  },
  "customer-sheet": {
    "file": "customer-sheet.png",
    "width": 596,
    "height": 770,
    "bounds": [
      0,
      0,
      596,
      770
    ]
  }
};
const assetUrl = file => new URL(`./assets/${file}`, import.meta.url).href;
const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

/** Crop transparent padding with an SVG viewport; never alter the source image. */
export function suppliedArt(key, label = '', cls = '') {
  const asset = SUPPLIED_ASSETS[key];
  if (!asset) return '';
  const [x,y,right,bottom] = asset.bounds;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${x} ${y} ${right-x} ${bottom-y}" class="art supplied-art asset-${key} ${escape(cls)}" ${label ? `role="img" aria-label="${escape(label)}"` : 'aria-hidden="true"'}><image href="${assetUrl(asset.file)}" width="${asset.width}" height="${asset.height}"/></svg>`;
}

/** Original pastry artwork at every stage; cooking state remains explicit in the UI. */
export function suppliedPastry(family, options = {}) {
  const key = family === 'cookie' ? 'cookie' : family === 'muffin' ? (options.topping === 'chocolate-chips' ? 'choc-chip-muffin' : 'muffin') : options.sprinkles ? 'sprinkles-cupcake' : 'cupcake';
  const state = options.state || 'golden';
  return suppliedArt(key, `${state} ${options.flavor || 'vanilla'} ${family}`, `pastry pastry-${family} pastry-${state}`);
}

export const ORIGINAL_CAST = {
  grandma: {name:'Grandma', bounds:[411,20,563,288]},
  maple: {name:'Mr. Maple', bounds:[230,28,377,267]},
  theo: {name:'Theo', bounds:[42,29,190,262]},
  maya: {name:'Maya', bounds:[4,282,234,541]},
  sam: {name:'Sam', bounds:[248,308,350,536]},
  ruby: {name:'Ruby', bounds:[366,369,582,548]},
  june: {name:'June', bounds:[140,560,420,713]},
};

/** A viewport crop of the original sheet. No redraw, recolor, shading, or movement. */
export function originalCharacter(person = 'grandma', cls = '', portrait = false) {
  const id = String(person?.id || person).replace('mr-', '');
  const key = ORIGINAL_CAST[id] ? id : 'grandma';
  const cast = ORIGINAL_CAST[key];
  const [x,y,right,bottom] = portrait ? [411,20,563,169] : cast.bounds;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${x} ${y} ${right-x} ${bottom-y}" class="art character original-character character-${key} ${escape(cls)}" role="img" aria-label="${cast.name}"><image href="${assetUrl('customer-sheet.png')}" width="596" height="770"/></svg>`;
}
