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
    "width": 3200,
    "height": 2000,
    "bounds": [
      136,
      135,
      3038,
      1908
    ]
  }
};
const assetUrl = file => new URL(`./assets/${file}`, import.meta.url).href;
let cropSerial = 0;
function originalCrop(file, sourceWidth, sourceHeight, bounds, cls, label = '') {
  const [x,y,right,bottom] = bounds;
  const id = `original-crop-${++cropSerial}`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${x} ${y} ${right-x} ${bottom-y}" class="art ${escape(cls)}" ${label ? `role="img" aria-label="${escape(label)}"` : 'aria-hidden="true"'}><defs><clipPath id="${id}"><rect x="${x}" y="${y}" width="${right-x}" height="${bottom-y}"/></clipPath></defs><image clip-path="url(#${id})" href="${assetUrl(file)}" width="${sourceWidth}" height="${sourceHeight}"/></svg>`;
}
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
  grandma: {name:'Grandma', bounds:[1644,119,2178,1040]},
  maple: {name:'Mr. Maple', bounds:[1018,160,1534,1002]},
  theo: {name:'Theo', bounds:[256,157,797,947]},
  maya: {name:'Maya', bounds:[120,1020,961,1885]},
  sam: {name:'Sam', bounds:[1072,1094,1431,1894]},
  ruby: {name:'Ruby', bounds:[1502,1291,2214,1924]},
  june: {name:'June', bounds:[2216,1373,3054,1845]},
};

/** A viewport crop of the original sheet. No redraw, recolor, shading, or movement. */
export function originalCharacter(person = 'grandma', cls = '', portrait = false) {
  const id = String(person?.id || person).replace('mr-', '');
  const key = ORIGINAL_CAST[id] ? id : 'grandma';
  const cast = ORIGINAL_CAST[key];
  return originalCrop('customer-sheet.png',3200,2000,portrait ? [1644,119,2130,625] : cast.bounds,`character original-character character-${key} ${cls}`,cast.name);
}

/** Viewport regions of the unchanged tools sheet. */
export const TOOL_REGIONS = {
  bowl:[126,160,318,309], whisk:[436,132,531,334], scoop:[158,438,358,544],
  piping:[382,381,580,580], oven:[809,370,1485,1135], kettle:[143,653,332,835],
  'coffee-cup':[1648,299,1811,602], 'tea-cup':[1920,402,2107,600],
  'chocolate-cup':[1640,709,1863,938], 'milk-cup':[1962,710,2097,899],
  pause:[141,960,265,1109], play:[356,1002,470,1123], home:[537,988,692,1132],
  settings:[127,1193,280,1339], sound:[349,1226,486,1342], muted:[577,1232,744,1364],
  arrow:[1134,1262,1242,1354], check:[1409,1247,1634,1451], clock:[1795,1030,1961,1189],
};
export function suppliedTool(key, label = '', cls = '') {
  const bounds = TOOL_REGIONS[key];
  if (!bounds) return '';
  return originalCrop('tools-sheet.png',2360,1640,bounds,`supplied-art sheet-crop tool-${key} ${cls}`,label);
}
