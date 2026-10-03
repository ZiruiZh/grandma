/** Original supplied artwork composed with reusable monochrome SVG. */
import { suppliedArt, suppliedPastry, originalCharacter, suppliedTool } from './supplied-assets.js';
export { suppliedArt, suppliedTool } from './supplied-assets.js';
const INK = '#080808';
const clamp = value => Math.max(0, Math.min(1, Number(value) || 0));
const esc = text => String(text ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const svg = (box, content, label = '', cls = '', extra = '') => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${box}" class="art ${esc(cls)}" ${label ? `role="img" aria-label="${esc(label)}"` : 'aria-hidden="true"'} ${extra}>${content}</svg>`;
/** A shared, stroke-based interface and station icon collection. */
export function icon(name, size = 24) {
  if (['play','pause','home','settings','sound','muted','arrow','check','clock','oven','bowl','scoop','piping','kettle','whisk'].includes(name)) return suppliedTool(name, '', `icon icon-${name}`);
  const paths = {
    play: '<path d="m9 5 11 7-11 7Z" fill="currentColor" stroke-linejoin="round"/>',
    pause: '<path d="M8 5v14M16 5v14" stroke-width="4"/>',
    home: '<path d="m3 11 9-8 9 8M5 10v11h5v-7h4v7h5V10"/>',
    settings: '<path d="m9 3-1 3-3 1-2 4 2 2v4l4 2 3-1 3 1 4-2v-4l2-2-2-4-3-1-1-3Z"/><circle cx="12" cy="11" r="3"/>',
    sound: '<path d="M4 9h4l5-4v14l-5-4H4ZM17 8q4 4 0 8M20 5q7 7 0 14"/>',
    muted: '<path d="M4 9h4l5-4v14l-5-4H4ZM18 9l5 6m0-6-5 6"/>',
    arrow: '<path d="M4 12h16m-6-6 6 6-6 6"/>',
    check: '<path d="m5 12 4 4L20 5" stroke-width="2.7"/>',
    close: '<path d="m6 6 12 12M18 6 6 18"/>',
    coin: '<circle cx="12" cy="12" r="9"/><path d="M14.8 8.5c-4-2-7 2-3 3.5s4 5-3 3.5M12 6v12"/>',
    heart: '<path d="M12 21 3.8 13C-3 6.4 6 0 12 7c6-7 15-.6 8.2 6Z"/>',
    star: '<path d="m12 2 3 6.3 7 1-5 4.9 1.2 6.8-6.2-3.2-6.2 3.2L7 14.2 2 9.3l7-1Z"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/>',
    share: '<path d="M12 15V2m-4 4 4-4 4 4M5 10H3v11h18V10h-2"/>',
    book: '<path d="M12 5C9 2 4 2 2 3v16c4-2 8-1 10 2 2-3 6-4 10-2V3c-4-1-7 0-10 2v16M5 7h4M5 11h4m6-4h4m-4 4h4"/>',
    oven: '<rect x="3" y="2" width="18" height="20" rx="3"/><path d="M3 8h18M7 5h1m5 0h1m4 0h.1"/><rect x="6" y="11" width="12" height="8" rx="1"/>',
    bowl: '<path d="M2 10h20c-1 8-4 11-10 11S3 18 2 10ZM7 5l10 5m-3-9 4 9"/>',
    cup: '<path d="M3 8h14v8a6 6 0 0 1-12 0L3 8ZM17 9h3c5 0 4 7-3 7M6 3v2m5-3v3M2 22h18"/>',
    counter: '<path d="M2 12h20v4H2Zm2 4v6m16-6v6M5 12V6h10v6M7 6V2h6v4m4 6V9h4v3"/>',
    scoop: '<path d="m14 10 7-8" stroke-width="3"/><ellipse cx="8" cy="16" rx="6" ry="5" transform="rotate(-40 8 16)"/><path d="M5 15q3-4 6-2"/>',
    piping: '<path d="m13 3 8 8-12 9-5-5Z"/><path d="m4 15 5 5-7 2Zm9-12 2-2 8 8-2 2"/>',
    kettle: '<path d="M8 7c-4-9 13-9 9 0M6 9h13l3 9q0 4-10 4T3 18Zm0 1-4-3-1 3 3 6m3-7h11l-2-3h-7Z"/>',
    whisk: '<path d="m15 9 7-7m-9 5 4 4C9 27-3 15 13 7Zm0 0C5 18 6 22 17 11M13 7C3 13 4 17 17 11"/>',
    cookie: '<circle cx="12" cy="12" r="9"/><path d="m7 7 2 1m6-2v2m-3 5 1 2m-6 0 1 2m8-5 1 1m-1 5h1" stroke-width="3"/>',
    leaf: '<path d="M20 3C2 1 0 19 9 20 19 23 23 10 20 3ZM5 22 17 7M10 16l-1-6m5 2h5"/>',
    box: '<path d="m2 8 10-5 10 5v13H2ZM2 8h20M8 3l4 5 4-5m-4 5v13"/>',
    sparkle: '<path d="m12 2 2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5Z"/>',
    flour: '<path d="M6 3h12l-1 5 3 13H4L7 8Zm1 5h10m-5 4v6m-3-4 3 2 3-2"/>',
    sugar: '<path d="M5 4h14l-1 5 2 12H4L6 9ZM8 12h8v5H8Z"/>',
    butter: '<path d="M3 10h18v10H3ZM3 10l5-5h10l3 5M8 5v5m-6 12h20"/>',
    egg: '<path d="M20 15C20 4 12-2 6 6c-7 10-1 18 7 16 4 0 7-3 7-7Z"/>',
    milk: '<path d="M7 2h9v4l3 4v12H5V10l2-4ZM5 10h14M7 6h9m-6 8h4v5h-4Z"/>',
    cocoa: '<path d="M5 4h14v18H5ZM4 4h16M9 10q8-4 6 4-8 4-6-4Z"/>',
    chips: '<path d="m7 3 4 7H3Zm10 2 5 8H12ZM10 14l5 8H5Z"/>',
    raisins: '<ellipse cx="7" cy="7" rx="3" ry="5" transform="rotate(25 7 7)"/><ellipse cx="17" cy="15" rx="4" ry="6" transform="rotate(-20 17 15)"/><path d="m5 5 1 4m9 3 2 6"/>',
    blueberries: '<circle cx="7" cy="15" r="5"/><circle cx="17" cy="15" r="5"/><circle cx="12" cy="6" r="5"/><path d="m5 13 2 1 2-1m6 0 2 1 2-1m-7-9v3"/>',
    honey: '<path d="M7 3h10v4H7Zm1 4-4 4v11h16V11l-4-4M8 13h8v5H8Z"/>',
    coffee: '<path d="M6 3h12v19H6ZM5 3h14M9 16c-4-7 9-9 6-2-1 4-4 5-6 2Zm0 0 6-6"/>',
    tea: '<path d="M6 3h12v19H6ZM5 3h14m7 3-7 10m0 0c-5-7-3-10 3-8 6 2 4 5-3 8Z"/>',
  };
  return `<svg class="icon icon-${esc(name)}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${clamp(size, 12, 240)}" height="${clamp(size, 12, 240)}" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.sparkle}</svg>`;
}


/** Original stroke lettering: the same reusable alphabet across the game. */
const LETTERS = {
  a:'M3 12Q8 6 14 11L15 22M14 12Q3 8 2 17T14 19',
  b:'M3 2L2 23M3 13Q17 5 16 17T3 21',
  c:'M16 11Q8 6 3 13T5 22Q10 25 16 21',
  d:'M15 2L16 23M15 12Q2 7 2 17T16 20',
  e:'M3 16L16 14Q16 7 8 9T3 21Q9 26 16 21',
  f:'M6 25L7 8Q7 0 16 3M2 11L14 10',
  g:'M15 10L15 24Q16 33 5 30M14 12Q2 7 2 17T14 21',
  h:'M3 2L2 24M3 15Q11 4 15 12L16 23',
  i:'M8 11L7 23M8 3L8 4',
  j:'M12 11L12 24Q11 33 3 28M12 3L12 4',
  k:'M3 2L2 24M15 9L3 18M8 15L17 24',
  l:'M7 2L6 22Q7 25 13 22',
  m:'M2 10L3 24M3 14Q7 6 10 13L11 23M10 13Q16 7 19 14L20 23',
  n:'M3 10L3 24M3 14Q14 4 16 14L17 23',
  o:'M10 9Q1 8 2 17T10 24Q19 23 17 15T10 9',
  p:'M3 10L2 31M3 13Q16 6 17 16T3 21',
  q:'M15 10L17 30M14 12Q2 7 2 17T15 20',
  r:'M3 10L3 24M3 15Q9 7 16 11',
  s:'M15 11Q5 5 3 12Q2 16 11 17T14 23Q8 27 2 22',
  t:'M8 3L7 20Q7 26 15 21M2 11L15 10',
  u:'M3 10L3 18Q2 28 14 21M15 10L16 24',
  v:'M2 10L9 24L17 9',
  w:'M1 10L5 24L11 14L16 24L21 9',
  x:'M2 10L17 24M16 10L2 23',
  y:'M2 10L9 23M17 10L9 29Q7 33 3 31',
  z:'M2 11L16 10L3 23L17 22',
  '’':'M8 1L5 7', "'":'M8 1L5 7', '.':'M8 22L8 23',
  '-':'M2 16L14 15', '&':'M17 24Q1 13 8 5T13 11Q0 17 4 23T18 14',
};
export function handLetter(text, cls = '') {
  let x = 2;
  const glyphs = [...String(text).toLowerCase()].map((letter,i)=>{
    const advance = letter === ' ' ? 14 : letter === 'm' || letter === 'w' ? 28 : letter === 'i' || letter === 'l' || letter === '.' ? 17 : 25;
    const path = LETTERS[letter];
    const out = path ? `<path d="${path}" transform="translate(${x} ${i%3 === 0 ? 1 : 0}) rotate(${i%4-1} 10 16)"/>` : '';
    x += advance; return out;
  }).join('');
  return svg(`0 0 ${x+2} 36`, `<g fill="none" stroke="#080808" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">${glyphs}</g>`, text, `hand-letter ${cls}`);
}

/** Keep the supplied characters exactly as drawn; expression feedback lives in text. */
export function character(person = 'grandma', expression = 'neutral', cls = '') {
  return originalCharacter(person, cls);
}

export function brandMark(name = 'Grandma’s Bakeria') {
  return originalCharacter('grandma', 'brand-mark', true);
}

/** Small original vignette, drawn with the same strokes as the mascot. */
export function grandmaVignette(progress = {}) {
  const regulars = progress.regulars || 0;
  const runs = Math.max(0,3-(progress.runsCancelled || 0));
  const nest = (art,x,y,w,h)=>art.replace('<svg ',`<svg x="${x}" y="${y}" width="${w}" height="${h}" `);
  return svg('0 0 390 330', `<g fill="white" stroke="${INK}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
    <path d="M37 89q8-36 46-25 29-14 54 3 32 4 32 34 24 16 3 41 10 33-30 41-20 20-53 2-45 2-45-25-29-13-7-42-15-12 0-29Z"/>
    <path d="M101 182q-9 39-4 57m32-60q-7 25-6 46l18 24" fill="none"/>
    <path d="M55 97q6-8 17-6m-12-6-1 14m64 15q-13-7-18-20 17-1 21 13 7-13 19-8-3 12-18 18Z" fill="none" stroke-width="3"/>
    <path d="m60 142 10-5 10 6-4 10H65Z"/><path d="M107 60q-3-14 5-21m7 23q10-10 11-16" fill="none" stroke-width="3"/>
    <path d="M171 272q-3-37 36-38 9-35 43-23 32-15 54 19 32 4 28 43" fill="none"/>
    ${runs ? `<path d="m188 277-20 24h59l20-24Zm-16 29h56m-56 7h55"/><path d="M185 290h33" stroke-width="2"/>` : nest(cup({type:'tea',fill:.8}),147,239,57,65)}
    <path d="M43 253v-28q20-11 42-1 24-10 45 1v28q-22-7-45 1-24-9-42-1Zm42-29v30"/><path d="M53 234h22m-22 7h17m25-7h25m-25 7h20" stroke-width="2"/>
    ${nest(character('grandma',regulars >= 2 ? 'happy' : 'neutral'),187,63,183,218)}
    ${nest(cup({type:'tea',fill:.8}),145,184,42,75)}
    ${nest(suppliedArt('croissant', 'A croissant on Grandma’s display'),24,279,112,43)}
    <path d="M309 34q8-12 14 0 9-12 14 1-3 8-14 15-11-7-14-16Z" fill="none" stroke-width="3"/>
  </g>`, `Grandma beside her recipe book and ${runs} flyer runs, with a quiet cup of tea.`, 'grandma-vignette');
}

/** Food drawings stay unaltered, including during baking. */
export function pastry(family = 'cookie', options = {}) {
  if (typeof family === 'object') {
    const order = family;
    const state = typeof options === 'string' ? options : options.state || 'golden';
    family = order.family;
    options = {...order, state, topping:order.topping, sprinkles:order.decoration?.toppings?.includes('sprinkles')};
  }
  return suppliedPastry(family, options);
}

/** Original cup drawing; fill/extras are shown by controls and ticket text. */
export function cup(options = {}) {
  const key = options.lid || options.takeaway ? 'coffee-cup' : options.type === 'tea' ? 'tea-cup' : options.type === 'hot-chocolate' ? 'chocolate-cup' : 'coffee-cup';
  return suppliedTool(key, `${options.type || 'cup'}, ${Math.round(clamp(options.fill ?? .8)*100)}% full${options.lid ? ', takeaway lid added' : ''}`, 'drink-cup');
}

/** A live liquid layer beneath the unchanged transparent cup drawing. */
export function liveCup(prep = {}) {
  const fill = clamp(prep.fill || 0);
  const key = prep.type === 'tea' ? 'tea-cup' : prep.type === 'hot-chocolate' ? 'chocolate-cup' : 'coffee-cup';
  const clipId = `live-liquid-${key}`;
  const color = prep.extras?.includes('milk') ? '#dacbb9' : prep.type === 'tea' ? '#e4d8be' : prep.type === 'hot-chocolate' ? '#c8b5a5' : '#bcb0a5';
  const nest = suppliedTool(key).replace('<svg ', '<svg x="35" y="65" width="150" height="180" ');
  const shape = key === 'tea-cup' ? 'M48 100H148L132 217H68Z' : key === 'chocolate-cup' ? 'M44 112H143L129 220H63Z' : 'M78 124H143L134 218H85Z';
  const extras = prep.extras || [];
  return svg('0 0 220 260', `<defs><clipPath id="${clipId}"><path d="${shape}"/></clipPath></defs><g clip-path="url(#${clipId})"><rect data-cup-liquid x="38" y="${218-fill*133}" width="120" height="200" fill="${color}"/><ellipse data-cup-surface cx="103" cy="${218-fill*133}" rx="53" ry="5" fill="#f0e9dd" style="opacity:${fill > .01 ? 1 : 0}"/></g>${nest}<path class="cup-fill-line" d="M45 112h114" fill="none" stroke="currentColor" stroke-width="1.4" stroke-dasharray="4 4"/><text x="166" y="116" font-size="11" fill="currentColor">80%</text>${extras.includes('marshmallows') ? '<g fill="white" stroke="#555" stroke-width="1"><rect x="83" y="105" width="13" height="11" rx="3"/><rect x="99" y="109" width="13" height="11" rx="3"/><rect x="116" y="103" width="13" height="11" rx="3"/></g>' : ''}${extras.includes('cream') ? '<path d="M74 107q-8-10 9-13-3-9 10-10 6-1 9-7 11 10 6 18 13-2 10 12Z" fill="white" stroke="#555" stroke-width="1"/>' : ''}${prep.lid ? '<path d="M50 103h100l5 8H45Z" fill="white" stroke="#555" stroke-width="1.5"/>' : ''}`, 'Your cup, live fill line at eighty percent', 'live-cup-art');
}

export function bowl(progress = 0, ingredients = 0) {
  const nest = (art,x,y,w,h) => art.replace('<svg ', `<svg x="${x}" y="${y}" width="${w}" height="${h}" `);
  return svg('0 0 280 200', `${nest(suppliedTool('bowl'),35,60,160,120)}${nest(suppliedTool('whisk'),201,23,53,135)}`, 'Original mixing bowl and whisk', 'mixing-bowl');
}

export const ingredientIcon = name => ['flour','butter','egg','milk','cocoa','blueberries','raisins','honey'].includes(name) ? suppliedArt(name) : name === 'chocolate-chips' ? suppliedArt('chocolate') : icon(String(name).replace('chocolate-chips','chips'), 32);
export const ingredient = ingredientIcon;
export function toolIcon(name, size = 72) {
  if (['tray','plate','box'].includes(name)) return servingContainer(name);
  if (name === 'bowl') return bowl(.35,3);
  return icon(name, size);
}
export const tool = toolIcon;
export function servingContainer(type = 'plate') {
  return svg('0 0 220 150', `<g fill="white" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round">${type === 'box' ? '<path d="m20 53 22-35h136l22 35v72H20Z"/><path d="M20 53h180l-25 24H45Zm90 24v48" fill="white"/><path d="m96 99 14 10 14-10" fill="none"/>' : type === 'tray' ? '<rect x="13" y="30" width="194" height="102" rx="13" fill="white"/><rect x="25" y="41" width="170" height="79" rx="6"/>' : '<ellipse cx="110" cy="96" rx="97" ry="31"/><ellipse cx="110" cy="92" rx="79" ry="22" fill="white"/>'}</g>`, `${type} for serving`, `serving serving-${type}`);
}
export const serving = servingContainer;
