/**
 * Grandma's Bakeria — original, reusable vector artwork.
 * Every helper returns an inline SVG string. No images, fonts, or network calls.
 * All illustrations have their own viewBox and inherit sizing from their parent.
 * Portrait ids: grandma, maple / mr-maple, maya, theo, ruby, sam, june.
 * Pastry state: raw, golden, overbaked. Extra unknown options are harmless.
 */

const INK = '#3d302b';
const CREAM = '#fff7e8';
let serial = 0;
const uid = (prefix) => `bakeria-${prefix}-${++serial}`;
const clamp = (value, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, Number(value) || 0));
const esc = (text) => String(text ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const svg = (viewBox, content, label = '', cls = '', extra = '') => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" class="art ${esc(cls)}" ${label ? `role="img" aria-label="${esc(label)}"` : 'aria-hidden="true"'} ${extra}>${content}</svg>`;

/** A shared, stroke-based interface and station icon collection. */
export function icon(name, size = 24) {
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
  return `<svg class="icon icon-${esc(name)}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${clamp(size, 12, 240)}" height="${clamp(size, 12, 240)}" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.sparkle}</svg>`;
}

/** Decorative brand motif. Keep the business name in live HTML for configurability. */
export function brandMark(nameOrSize = 44) {
  const size = typeof nameOrSize === 'number' ? clamp(nameOrSize, 12, 240) : 44;
  return svg('0 0 64 64', `<path d="M15 49 11 27c-12-7-2-20 7-13C20 0 42 0 45 14c11-8 22 7 8 14l-5 21Z" fill="${CREAM}" stroke="${INK}" stroke-width="2.5"/><path d="M17 39h30m-23-9-2-8m12 8v-9m9 9 2-8" fill="none" stroke="#bf6351" stroke-width="2.5" stroke-linecap="round"/><path d="M15 45h34v10H15Z" fill="#bf6351" stroke="${INK}" stroke-width="2.5"/><path d="m29 46 4 4 5-5" fill="none" stroke="${CREAM}" stroke-width="2"/>`, typeof nameOrSize === 'string' ? nameOrSize : '', 'brand-mark', `width="${size}" height="${size}"`);
}

const PEOPLE = {
  grandma: { skin: '#efbea0', hair: '#eee6d4', shirt: '#78948c', apron: '#fff1d9', cheeks: '#d88473', style: 'bun', glasses: true },
  maple: { skin: '#edc3a2', hair: '#b9b4a4', shirt: '#967856', apron: null, cheeks: '#d49883', style: 'bald', glasses: true, moustache: true },
  maya: { skin: '#b77854', hair: '#3c2927', shirt: '#d97570', apron: null, cheeks: '#c06453', style: 'puffs', accessory: '#e7b354' },
  theo: { skin: '#e4b693', hair: '#6b4434', shirt: '#5b798b', apron: null, cheeks: '#d38a73', style: 'swoop', accessory: '#dfae58' },
  ruby: { skin: '#f1c4a6', hair: '#ac573c', shirt: '#7c9475', apron: null, cheeks: '#d98276', style: 'bob', accessory: '#e9b254' },
  sam: { skin: '#c78d68', hair: '#322d2b', shirt: '#b39ab5', apron: null, cheeks: '#ba7760', style: 'short', glasses: true },
  june: { skin: '#dfb394', hair: '#50453c', shirt: '#d4a14f', apron: null, cheeks: '#d28b73', style: 'ponytail', accessory: '#779389' },
};

/** Shared character illustration. ClassName is escaped; ids may be customer ids or names. */
export function character(id = 'grandma', expression = 'neutral', className = '') {
  const profile = typeof id === 'object' && id ? id : null;
  const key = String(profile?.id || id).toLowerCase().replace('mr. ', '').replace('mr-', '').replace('mr_', '');
  const p = { ...(PEOPLE[key] || PEOPLE.grandma), ...(profile?.colors || {}) };
  const happy = expression === 'happy';
  const waiting = expression === 'waiting';
  const sad = expression === 'disappointed';
  const hairBack = {
    bun: `<circle cx="87" cy="29" r="24"/><circle cx="64" cy="40" r="18"/><circle cx="109" cy="40" r="18"/><path d="M40 89V70c0-57 101-57 101 0v22Z"/>`,
    bald: '<path d="M40 92V69c0-22 18-40 49-40s51 18 51 40v23l-16-2-8-40H67l-12 40Z"/>',
    puffs: '<circle cx="35" cy="53" r="25"/><circle cx="140" cy="53" r="25"/><path d="M42 90V65c0-51 94-51 94 0v28Z"/>',
    swoop: '<path d="M39 96V68c-12-12-6-22 4-26 0-17 15-22 29-18 11-19 39-10 44 0 26 0 30 18 21 37v35Z"/>',
    bob: '<path d="M36 115V67c0-56 109-57 109 2v50c-15 18-97 18-109-4Z"/>',
    short: '<path d="M40 97V57c0-12 3-20 13-23-1-15 20-14 26-9 8-16 32-14 36-1 22-7 38 15 24 29v47Z"/>',
    ponytail: '<path d="M127 59c22-25 44-3 28 22-8 14-6 33 6 44-36 6-43-24-34-39Z"/><path d="M40 97V65c0-51 99-51 99 0v32Z"/>',
  }[p.style];
  const hairFront = {
    bun: '<path d="M43 69c5-22 20-27 26-28 10 17 44 19 65 29-2-19-18-35-45-35-27 0-43 13-46 34Z"/>',
    bald: '<path d="M47 72c-3-17 3-27 16-29l-7 33m71-5c3-18-5-27-14-28l7 35"/>',
    puffs: '<path d="M45 65c0-37 88-43 88 0-17-4-34-19-40-26-10 13-29 24-48 26Z"/>',
    swoop: '<path d="M42 74c4-39 80-52 93-12-33 7-44-13-51-15-8 12-24 22-42 27Z"/>',
    bob: '<path d="M42 70c-1-22 12-38 40-39 40-3 54 17 57 42-29 0-43-10-50-27-8 12-23 19-47 24Z"/>',
    short: '<path d="M44 65c5-19 84-24 90 0l1-20-21-9-40-1-25 12Z"/>',
    ponytail: '<path d="M43 70c5-26 15-37 44-37 34 0 42 16 47 39-28-3-45-16-49-28-10 17-26 22-42 26Z"/>',
  }[p.style];
  const eyes = happy ? '<path d="M63 83q5-7 10 0m31 0q5-7 10 0" fill="none"/>' : '<ellipse cx="68" cy="83" rx="2.8" ry="3.6"/><ellipse cx="109" cy="83" rx="2.8" ry="3.6"/>';
  const eyebrows = sad ? '<path d="m61 74 12-4m31 0 12 4"/>' : waiting ? '<path d="M61 72h12m31 0h12"/>' : '<path d="m62 72 10-1m33 0 10 1"/>';
  const mouth = sad ? '<path d="M80 112q9-8 18 0"/>' : happy ? '<path d="M77 105q12 17 24 0Z" fill="#8b4a42"/><path d="M81 106h16" stroke="#fff7e8" stroke-width="3"/>' : waiting ? '<path d="M80 108q9 3 18-1"/>' : '<path d="M81 108h15"/>';
  const glasses = p.glasses ? '<g fill="none" stroke="#675b4a" stroke-width="2.3"><rect x="52" y="72" width="31" height="23" rx="10"/><rect x="96" y="72" width="31" height="23" rx="10"/><path d="M83 81q7-5 13 0m-53-3 9 1m75 0 9-1"/></g>' : '';
  const accessories = p.style === 'puffs' ? `<path d="m31 30 11-12 3 16 13-1-7 13-12-9-10 7Z" fill="${p.accessory}" stroke="${INK}" stroke-width="2"/>` : p.style === 'bob' ? `<path d="M53 51 70 42" stroke="${p.accessory}" stroke-width="7" stroke-linecap="round"/>` : p.style === 'ponytail' ? `<path d="M136 58q8 5 7 16" stroke="${p.accessory}" stroke-width="8" fill="none"/>` : '';
  return svg('0 0 180 240', `
    <g stroke="${INK}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
      <path d="M35 224v-47c0-28 26-43 55-43s55 15 55 43v47" fill="${p.shirt}"/>
      <path d="M36 174c-18 3-23 39-12 48 7 8 17 5 19-5l9-34m91-9c20 9 24 41 12 49-9 7-15-1-17-10l-8-29" fill="${p.shirt}"/>
      <path d="M26 211c-15 2-15 22-2 24 12 3 22-14 11-19m120-5c15 2 15 22 2 24-12 3-22-14-11-19" fill="${p.skin}"/>
      <path d="M76 123v21q13 17 26 0v-21" fill="${p.skin}"/>
      ${p.apron ? `<path d="m64 142 5 37h-8v48h59v-48h-9l5-37" fill="${p.apron}"/><path d="M75 197h32v13q-16 13-32 0Z" fill="#e8cdb1"/><path d="m87 202 5 5 6-6" fill="none" stroke="#b86957"/>` : '<path d="m69 139 19 22 22-22M88 161v66" fill="none" opacity=".35"/>'}
      <g fill="${p.hair}">${hairBack}</g>
      <ellipse cx="43" cy="86" rx="9" ry="13" fill="${p.skin}"/><ellipse cx="136" cy="86" rx="9" ry="13" fill="${p.skin}"/>
      <path d="M45 65c0-37 89-37 89 0v26c0 30-19 46-45 46S45 120 45 91Z" fill="${p.skin}"/>
      <g fill="${p.hair}">${hairFront}</g>
      <ellipse cx="58" cy="100" rx="9" ry="5" fill="${p.cheeks}" stroke="none" opacity=".6"/><ellipse cx="120" cy="100" rx="9" ry="5" fill="${p.cheeks}" stroke="none" opacity=".6"/>
      <g fill="${INK}" stroke-width="2.8">${eyes}</g>
      <g fill="none" stroke-width="1.8">${eyebrows}<path d="m90 88-3 10h5" opacity=".5"/>${mouth}</g>
      ${p.moustache ? `<path d="M88 100c-4-7-9 6-19 5 1 10 16 11 20 4 6 7 19 5 21-4-10 1-16-12-22-5Z" fill="${p.hair}" stroke-width="1.3"/>` : ''}
      ${glasses}${accessories}
      ${key === 'theo' ? '<path d="m61 143-7 83m64-83 8 83" stroke="#344f61" stroke-width="8"/>' : ''}
      ${key === 'ruby' ? '<circle cx="43" cy="102" r="4" fill="#e9b254"/><circle cx="137" cy="102" r="4" fill="#e9b254"/>' : ''}
      ${key === 'grandma' ? '<path d="M58 109h9m42 0h9" stroke="#b58571" stroke-width="1"/>' : ''}
    </g>`, `${key === 'grandma' ? 'Grandma' : key}, ${expression}`, `character character-${key} ${className}`);
}

const sprinkles = (cx = 80, cy = 58, count = 15, spread = 48) => Array.from({ length: count }, (_, n) => {
  const a = n * 2.39996;
  const r = Math.sqrt((n + .5) / count) * spread;
  const x = cx + Math.cos(a) * r;
  const y = cy + Math.sin(a) * r * .47;
  return `<path d="m${x.toFixed(1)} ${y.toFixed(1)} 4 ${n % 2 ? -3 : 3}" stroke="${['#da6a70', '#e4af48', '#6d9b8b', '#fff5db', '#805272'][n % 5]}" stroke-width="3.5" stroke-linecap="round"/>`;
}).join('');

/** Three silhouettes; every recipe variation reuses these shapes. */
export function pastry(family = 'cookie', options = {}) {
  if (family && typeof family === 'object') {
    const order = family;
    const state = typeof options === 'string' ? options : options.state || 'golden';
    family = order.family || 'cookie';
    const actualFrosting = order.decoration ? order.decoration.frosting : order.frosting;
    const actualToppings = order.decoration?.toppings || [];
    const actualMixIn = order.ingredients?.includes(order.topping) ? order.topping : '';
    options = {
      ...order,
      state,
      frosting: actualFrosting || 'none',
      topping: family === 'cupcake' ? '' : actualMixIn,
      sprinkles: family === 'cupcake' && actualToppings.includes('sprinkles'),
    };
  }
  family = String(family).replace(/s$/, '');
  const { flavor = 'vanilla', topping = '', frosting = 'strawberry', state = 'golden', sprinkles: withSprinkles = false } = options;
  const raw = state === 'raw' || state === 'underbaked';
  const burnt = state === 'overbaked' || state === 'burnt';
  const chocolate = flavor === 'chocolate';
  const base = burnt ? '#714231' : raw ? (chocolate ? '#99775d' : '#eddbaf') : chocolate ? '#956040' : '#e4b16a';
  const edge = burnt ? '#4b2f28' : raw ? '#c7af86' : chocolate ? '#6c442f' : '#bd8245';
  const icing = { strawberry: '#e6949a', vanilla: '#fff3d9', chocolate: '#83543f', cream: '#fff3d9' }[frosting] || '#e6949a';
  const spots = Array.from({ length: 9 }, (_, n) => {
    const a = n * 2.39996;
    const r = 10 + (n % 3) * 13;
    const x = 80 + Math.cos(a) * r;
    const y = 72 + Math.sin(a) * r * .74;
    if (topping === 'blueberries') return `<circle cx="${x}" cy="${y}" r="6" fill="#69788f" stroke="#4b576d" stroke-width="1.5"/><path d="m${x - 2} ${y - 2} 3 1" stroke="#a9b2c1" stroke-width="2"/>`;
    if (topping === 'raisins') return `<ellipse cx="${x}" cy="${y}" rx="5" ry="3.8" transform="rotate(${n * 33} ${x} ${y})" fill="#6b4647"/>`;
    return `<path d="m${x} ${y - 4} 5 8-10-1Z" fill="#60412e" stroke="#50392a" stroke-width="1"/>`;
  }).join('');
  const decoration = (topping && !['none', 'plain', 'sprinkles'].includes(topping)) ? spots : '';
  const cookie = `<ellipse cx="80" cy="113" rx="58" ry="9" fill="#4b2f28" opacity=".08"/><path d="M25 80c-5-34 21-55 54-55 34 0 60 19 58 54-3 29-28 44-58 43S28 108 25 80Z" fill="${edge}" stroke="${INK}" stroke-width="2.5"/><path d="M25 74c-3-27 20-48 54-48 34-1 59 17 58 45-2 29-25 44-57 44S28 101 25 74Z" fill="${base}" stroke="${INK}" stroke-width="2.5"/><path d="M39 66q4-20 27-25m-18 55 5 3m62-19 6-5" fill="none" stroke="${raw ? '#fff1d0' : '#f9d293'}" stroke-width="4" stroke-linecap="round"/>${decoration}`;
  const muffin = `<ellipse cx="80" cy="127" rx="48" ry="7" fill="#4b2f28" opacity=".08"/><path d="m34 70 14 57q33 14 65 0l14-57Z" fill="#d3a777" stroke="${INK}" stroke-width="2.5"/><path d="m46 83 10 40m9-36 4 41m19-41-2 42m20-43-8 40m18-47-10 44" fill="none" stroke="#a3754e" stroke-width="2"/><path d="M33 83C12 73 25 44 44 42c4-24 36-28 51-15 18-12 43 2 44 20 24 13 18 37-6 40-15 10-27 4-36-1-10 11-26 9-35 1-12 7-22 4-29-4Z" fill="${base}" stroke="${INK}" stroke-width="2.5"/><path d="M46 47q6-11 21-13m45 7q9 0 13 9" fill="none" stroke="${raw ? '#fff1d0' : '#f4cc8d'}" stroke-width="4" stroke-linecap="round"/>${decoration}`;
  const frostingPath = `<path d="M30 76c-7-14 6-23 18-25-6-11 3-22 17-23C66 12 89 16 91 4c18 9 24 23 15 32 21 1 29 13 21 24 24 6 21 28 4 30H43c-12-1-16-5-13-14Z" fill="${icing}" stroke="${INK}" stroke-width="2.5"/><path d="M51 50q36 9 63-6M43 72q45 12 82-8M69 29q10 7 30 2" fill="none" stroke="${frosting === 'chocolate' ? '#5f3c30' : '#c8747f'}" stroke-width="2" opacity=".4" stroke-linecap="round"/>`;
  const cupcake = `<ellipse cx="80" cy="132" rx="48" ry="7" fill="#4b2f28" opacity=".08"/><path d="M30 83q-4-30 49-31 52 0 52 30v11H30Z" fill="${base}" stroke="${INK}" stroke-width="2.5"/><path d="m32 88 14 42q34 14 67 0l15-42q-48 9-96 0Z" fill="#90aba0" stroke="${INK}" stroke-width="2.5"/><path d="m48 96 7 31m9-29 3 34m14-34v35m15-35-3 34m20-35-9 32" stroke="#587b70" stroke-width="2" fill="none"/><path d="m68 112 12 11 12-11" fill="none" stroke="#eff3db" stroke-width="2"/>${raw || frosting === 'none' ? '' : frostingPath}${withSprinkles || topping === 'sprinkles' ? sprinkles(81, 63, 17, 45) : ''}`;
  return svg('0 0 160 145', family === 'cupcake' ? cupcake : family === 'muffin' ? muffin : cookie, `${state} ${flavor} ${family}`, `pastry pastry-${family} pastry-${state}`);
}

/** A single vessel, clipped liquid, reusable handle, toppings, steam and takeaway lid. */
export function cup(options = {}) {
  options = options || {};
  const { type = 'coffee', fill = .8 } = options;
  const extras = options.extras || [options.extra || ''];
  const extra = extras.includes('marshmallows') ? 'marshmallows' : extras.includes('cream') ? 'cream' : extras.includes('milk') ? 'milk' : options.extra || '';
  const takeaway = options.lid ?? options.takeaway ?? false;
  const cid = uid('cup');
  const level = clamp(fill);
  const tea = ['tea', 'earl-grey', 'chamomile', 'earl grey'].includes(type);
  const liquid = tea ? '#c99a46' : ['hot chocolate', 'hot-chocolate', 'hotChocolate', 'chocolate'].includes(type) ? '#865339' : extras.includes('milk') ? '#be9870' : '#684b35';
  const y = 113 - level * 72;
  return svg('0 0 140 150', `
    <defs><clipPath id="${cid}"><path d="M34 43h70l-7 69q-27 10-56 0Z"/></clipPath></defs>
    <ellipse cx="69" cy="134" rx="51" ry="8" fill="#49342b" opacity=".09"/>
    <g class="steam" fill="none" stroke="#9faaa0" stroke-width="3" stroke-linecap="round" opacity="${level > .2 ? '.7' : '0'}"><path d="M54 33c-9-9 7-13 0-22"/><path d="M73 29c-9-9 7-13 0-22"/><path d="M91 33c-9-9 7-13 0-22"/></g>
    ${takeaway ? '' : `<path d="M105 54h7c31 0 25 50-11 39" fill="none" stroke="${INK}" stroke-width="13"/><path d="M105 54h7c31 0 25 50-11 39" fill="none" stroke="#e5c6a1" stroke-width="8"/>`}
    <path d="M30 39h79l-8 79q-30 14-62 0Z" fill="#fff4dc" stroke="${INK}" stroke-width="2.8"/>
    <g clip-path="url(#${cid})"><rect x="32" y="${y}" width="74" height="80" fill="${liquid}"/><ellipse cx="69" cy="${y}" rx="37" ry="6" fill="${tea ? '#e0b565' : '#b18660'}"/>
      ${extra === 'milk' && level > .2 ? `<path d="M42 ${y + 7}q37 16 49-1M47 ${y + 17}q26 10 40-2" stroke="#e5c9a0" stroke-width="4" fill="none" stroke-linecap="round"/>` : ''}
      ${extra === 'marshmallows' && level > .2 ? [46, 65, 82].map((x, n) => `<rect x="${x}" y="${y - 7 + n % 2 * 5}" width="14" height="12" rx="4" fill="#fff8ee" stroke="#cfb99f" stroke-width="1.2" transform="rotate(${n * 12 - 8} ${x + 7} ${y})"/>`).join('') : ''}
    </g>
    <path d="M31 39q37 10 77 0" fill="none" stroke="${INK}" stroke-width="2.8"/>
    <path d="M43 57 47 91" stroke="#fff9eb" stroke-width="4" stroke-linecap="round" opacity=".65"/>
    <path d="M96 55.4H85" stroke="#493d31" stroke-width="4" stroke-linecap="round"/><path d="M96 55.4H85" stroke="#fff1d4" stroke-width="2" stroke-linecap="round"/>
    <path d="m61 91 8 8 8-8" stroke="#fff6df" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    ${extra === 'cream' && level > .2 ? `<path d="M41 43c-1-9 9-11 16-10-2-10 6-13 12-12 8-1 9-7 9-7 14 9 6 17 7 18 14 0 17 13 9 15Z" fill="#fff5df" stroke="${INK}" stroke-width="1.8"/><path d="M56 33q14 8 29-1" fill="none" stroke="#d0b695" stroke-width="1.5"/>` : ''}
    ${takeaway ? `<path d="M31 33h77l7 9v8H25v-8Z" fill="#79968a" stroke="${INK}" stroke-width="2.5"/><path d="M38 29h63v7H38Z" fill="#a1b6a5" stroke="${INK}" stroke-width="2"/><path d="M55 31h14" stroke="${INK}" stroke-width="3" stroke-linecap="round"/><path d="m38 77 64 0-3 30q-29 9-58-1Z" fill="#d4b488" stroke="${INK}" stroke-width="1.8"/><path d="m61 88 8 8 8-8" stroke="#86684d" stroke-width="2" fill="none"/>` : ''}`, `${type} ${Math.round(level * 100)}% full${takeaway ? ', takeaway' : ''}`, `drink-cup ${level > 0 ? 'has-drink' : 'empty-cup'}`);
}

/** Mixing bowl illustration; numeric progress and ingredient count control the contents. */
export function bowl(progress = 0, ingredients = 0) {
  const p = clamp(progress);
  const items = clamp(ingredients, 0, 12);
  return svg('0 0 280 240', `
    <ellipse cx="140" cy="214" rx="93" ry="12" fill="#66442c" opacity=".1"/>
    <path d="M39 112q4 95 100 95t102-95" fill="#83a396" stroke="${INK}" stroke-width="3"/>
    <path d="M56 143q12 41 44 46" fill="none" stroke="#c4d5ba" stroke-width="7" stroke-linecap="round"/>
    <ellipse cx="140" cy="111" rx="103" ry="34" fill="#f7ead2" stroke="${INK}" stroke-width="3"/>
    ${items ? `<ellipse cx="140" cy="116" rx="83" ry="23" fill="${p > .6 ? '#e0b976' : '#f1d9a1'}"/><path d="M89 111q39-25 90 2-43 31-68 0 36-13 48 5" fill="none" stroke="${p > .6 ? '#c99657' : '#fff4d2'}" stroke-width="6" stroke-linecap="round"/>` : ''}
    ${items > 1 && p < .9 ? '<ellipse cx="112" cy="114" rx="17" ry="11" fill="#e8b14d"/><path d="m156 111 10-8 12 9-13 7Z" fill="#f6e9bc"/><circle cx="148" cy="103" r="4" fill="#fff9e8"/><circle cx="175" cy="118" r="3" fill="#fff9e8"/>' : ''}
    <g class="bowl-whisk" style="transform-origin:145px 116px"><path d="m151 106 54-66" stroke="${INK}" stroke-width="13" stroke-linecap="round"/><path d="m162 92 43-52" stroke="#ce9970" stroke-width="8" stroke-linecap="round"/><path d="M151 103c-48-13-52 38-23 24l23-24c4 36-24 34-23 24m23-24c-22 3-41 18-23 24" fill="none" stroke="#777d76" stroke-width="3"/></g>
    <path d="M37 113q1 24 103 33 96-7 103-31" fill="none" stroke="${INK}" stroke-width="3"/>
    <path d="M120 174q20 17 40 0" fill="none" stroke="#e9edd4" stroke-width="3" stroke-linecap="round"/>`, 'Mixing bowl and whisk', 'mixing-bowl');
}

/** Ingredient symbols with distinct colors; use alongside text labels. */
export function ingredient(name, size = 44) {
  const normalized = String(name).toLowerCase().replace('chocolate chips', 'chips').replace('chocolate-chips', 'chips');
  const colors = { flour: '#ae9472', sugar: '#c68387', butter: '#cba248', egg: '#c48760', milk: '#739b9e', cocoa: '#95664e', chips: '#825c41', raisins: '#906c86', blueberries: '#647d9d', honey: '#c69b44', coffee: '#8b6249', tea: '#73977d' };
  return icon(normalized, size).replace('<svg ', `<svg style="color:${colors[normalized] || '#8b775f'}" `);
}

/** Ergonomic application aliases; all helpers return an SVG string. */
export const ingredientIcon = ingredient;
export function toolIcon(name, size = 72) {
  if (['tray', 'plate', 'box'].includes(name)) return serving(name);
  if (name === 'bowl') return bowl(.35, 3).replace(/<g class="bowl-whisk"[\s\S]*?<\/g>/, '');
  return tool(name, size);
}
export const servingContainer = (type = 'plate') => serving(type);

/** Baking tools: bowl, whisk, scoop, piping bag, kettle. */
export function tool(name, size = 72) {
  if (name === 'bowl') return bowl(0, 0);
  const drawings = {
    whisk: '<path d="m44 37 22-27" stroke="#946b4e" stroke-width="10" stroke-linecap="round"/><path d="M44 35c-33-9-39 36-17 31l17-31c6 35-12 43-17 31m17-31c-27 15-33 31-17 31" fill="none" stroke="#7c8981" stroke-width="3"/>',
    scoop: '<path d="m43 36 21-25" stroke="#9b6f50" stroke-width="10" stroke-linecap="round"/><path d="M12 57c-2-24 27-37 43-19 16 24-25 49-43 19Z" fill="#aebcb2" stroke="#3d302b" stroke-width="2.5"/><path d="M20 54q7-16 23-9" fill="none" stroke="#edf2e8" stroke-width="4" stroke-linecap="round"/>',
    piping: '<path d="m48 13 19 16-39 36-14-12Z" fill="#f1d0cd" stroke="#3d302b" stroke-width="2.5"/><path d="m14 53 14 12-21 8Z" fill="#a4b3a9" stroke="#3d302b" stroke-width="2.5"/><path d="m48 13 3-8 18 16-2 8m-23-3-18 24" fill="none" stroke="#3d302b" stroke-width="2.5"/>',
    kettle: '<path d="M27 22c-8-23 38-23 30 3" fill="none" stroke="#3d302b" stroke-width="7"/><path d="M22 36 9 26 6 36l15 22m-1-25h41l9 26q-3 16-31 15T10 59Z" fill="#9caf9c" stroke="#3d302b" stroke-width="2.5"/><path d="M22 32h40l-6-8H28Z" fill="#e4c79f" stroke="#3d302b" stroke-width="2.5"/><path d="M43 25v-5m-18 28-3 9" fill="none" stroke="#3d302b" stroke-width="3" stroke-linecap="round"/>',
  };
  return svg('0 0 80 80', drawings[name] || drawings.piping, name, `tool tool-${esc(name)}`, `width="${size}" height="${size}"`);
}

/** Containers can carry an optional inline SVG content string from these helpers. */
export function serving(type = 'plate', content = '') {
  const box = type === 'box' || type === 'takeaway';
  const tray = type === 'tray';
  const shape = box ? `<path d="m20 54 20-36h140l20 36v71H20Z" fill="#ebd2ac" stroke="${INK}" stroke-width="3"/><path d="M20 54h180m-180 0 26 23h128l26-23m-90 23v48" fill="none" stroke="${INK}" stroke-width="2.5"/><path d="m95 96 15 12 15-12" fill="none" stroke="#a96554" stroke-width="3"/>` : tray ? `<rect x="12" y="28" width="196" height="108" rx="17" fill="#9faea3" stroke="${INK}" stroke-width="3"/><rect x="23" y="37" width="174" height="88" rx="11" fill="#d1d8c8" stroke="#718477" stroke-width="2"/><path d="M16 65v30m188-30v30" stroke="#5c7065" stroke-width="4" stroke-linecap="round"/>` : `<ellipse cx="110" cy="101" rx="100" ry="34" fill="#e7d9bc" stroke="${INK}" stroke-width="2.5"/><ellipse cx="110" cy="94" rx="100" ry="34" fill="#fff6df" stroke="${INK}" stroke-width="2.5"/><ellipse cx="110" cy="94" rx="80" ry="24" fill="none" stroke="#9da994" stroke-width="2"/>`;
  return svg('0 0 220 150', shape + content, `${type} for serving`, `serving serving-${esc(type)}`);
}

/** Small effects use shared shapes and may be animated by application CSS. */
export function effect(type = 'sparkle', count = 7) {
  const n = Math.round(clamp(count, 1, 18));
  return svg('0 0 200 160', Array.from({ length: n }, (_, i) => {
    const x = 20 + (i * 53) % 160;
    const y = 20 + (i * 37) % 105;
    const color = ['#d89c43', '#be655b', '#83a392'][i % 3];
    if (type === 'steam') return `<path class="effect-particle" style="animation-delay:${i * .17}s" d="M${x} 130c-20-20 20-40 0-60" fill="none" stroke="#aab9a8" stroke-width="4" stroke-linecap="round"/>`;
    if (type === 'crumbs' || type === 'confetti') return `<rect class="effect-particle" style="animation-delay:${i * .07}s" x="${x}" y="${y}" width="${type === 'crumbs' ? 4 : 7}" height="${type === 'crumbs' ? 4 : 12}" rx="2" fill="${color}" transform="rotate(${i * 29} ${x} ${y})"/>`;
    return `<g class="effect-particle" style="animation-delay:${i * .08}s" transform="translate(${x} ${y})" fill="${color}">${type === 'hearts' ? '<path d="M0 4c-10-12-20 0-10 8L0 20l10-8C20 4 10-8 0 4Z"/>' : '<path d="m0-10 3 7 7 3-7 3-3 7-3-7-7-3 7-3Z"/>'}</g>`;
  }).join(''), '', `effect effect-${esc(type)}`);
}

/** The complete welcome environment is composed from the same reusable artwork. */
export function bakeryScene() {
  const nested = (art, x, y, w, h) => art.replace('<svg ', `<svg x="${x}" y="${y}" width="${w}" height="${h}" `);
  const hangingLight = (x) => `<path d="M${x} 47v77" stroke="${INK}" stroke-width="3"/><path d="m${x - 33} 153 15-32h36l15 32Z" fill="#879d87" stroke="${INK}" stroke-width="2.5"/><ellipse cx="${x}" cy="153" rx="33" ry="6" fill="#f2d79b" stroke="${INK}" stroke-width="2"/><path d="m${x - 28} 161-26 65h108l-26-65Z" fill="#ffe1a0" opacity=".15"/>`;
  const jar = (x, y, color, contents) => `<g transform="translate(${x} ${y})"><rect x="0" y="4" width="35" height="48" rx="6" fill="#f8edcf" stroke="${INK}" stroke-width="2"/><path d="M4 22h27v25H4Z" fill="${color}" opacity=".7"/><rect x="-1" width="37" height="8" rx="3" fill="#8fa28d" stroke="${INK}" stroke-width="2"/><rect x="8" y="24" width="19" height="15" rx="2" fill="#fff3da"/><path d="${contents || 'M13 30h10m-8 4h6'}" stroke="#a18562" stroke-width="1.5"/></g>`;
  return svg('0 0 960 680', `
    <defs>
      <pattern id="bakery-wallpaper" width="38" height="38" patternUnits="userSpaceOnUse"><path d="M19 12v14m-7-7h14" stroke="#dac8a7" stroke-width="1" opacity=".28"/><circle cx="19" cy="19" r="2" fill="#dac8a7" opacity=".26"/></pattern>
      <pattern id="bakery-floor" width="100" height="80" patternUnits="userSpaceOnUse" patternTransform="skewX(-30)"><rect width="100" height="80" fill="#d8c9aa"/><path d="M0 0h50v40H0ZM50 40h50v40H50Z" fill="#ede0c4"/></pattern>
      <clipPath id="bakery-scene-clip"><rect x="12" y="12" width="936" height="656" rx="28"/></clipPath>
      <linearGradient id="bakery-window-light" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#d0e4d8"/><stop offset="1" stop-color="#f4ebc6"/></linearGradient>
    </defs>
    <g clip-path="url(#bakery-scene-clip)">
      <rect x="12" y="12" width="936" height="656" fill="#f4e7ca"/>
      <rect x="12" y="55" width="936" height="459" fill="url(#bakery-wallpaper)"/>
      <path d="M12 493h936v175H12Z" fill="url(#bakery-floor)"/>
      <path d="M12 447h936v58H12Z" fill="#8ba092"/>
      <path d="M12 456h936m-936 33h936" stroke="#6d8877" stroke-width="2"/>
      <path d="M12 447h936" stroke="${INK}" stroke-width="3"/>
      <path d="M12 16h936v40H12Z" fill="#729185"/>
      ${Array.from({ length: 20 }, (_, i) => `<path d="M${i * 50 - 12} 16h25v46q-12 15-25 0Z" fill="#f5e7cb"/>`).join('')}
      <path d="M12 17h936" stroke="${INK}" stroke-width="3"/>
      ${hangingLight(334)}${hangingLight(753)}
      <g>
        <path d="M72 345V185c0-132 215-132 215 0v160Z" fill="#acb59b" stroke="${INK}" stroke-width="3"/>
        <path d="M84 330V186c0-116 191-116 191 0v144Z" fill="url(#bakery-window-light)" stroke="${INK}" stroke-width="2"/>
        <path d="M84 268c37-29 58-14 87-16 37-42 69-31 104-20v98H84Z" fill="#9fb18e"/>
        <path d="M84 298c42-10 61-1 102 2 42-25 63-19 89-6v36H84Z" fill="#819b80"/>
        <circle cx="236" cy="159" r="22" fill="#f5d798"/>
        <path d="M92 164q42-71 102-61M92 175q44-75 108-63" stroke="#fff7de" stroke-width="6" stroke-linecap="round" opacity=".6" fill="none"/>
        <path d="M180 86v248M80 229h198" stroke="${INK}" stroke-width="9"/>
        <path d="M180 86v248M80 229h198" stroke="#f2deb8" stroke-width="5"/>
        <path d="M66 336h227v16H66Z" fill="#bd9370" stroke="${INK}" stroke-width="2.5"/>
        <path d="M114 330h42l-6-34h-30Z" fill="#b46b54" stroke="${INK}" stroke-width="2"/>
        <g fill="#70866b" stroke="#526c50" stroke-width="1.7"><path d="M135 301c-34-7-35-33-28-36 24-1 28 21 28 36Z"/><path d="M135 287c-7-35 3-52 11-44 14 14 0 39-11 44Z"/><path d="M136 303c3-37 28-43 35-31-1 18-17 27-35 31Z"/><path d="M135 310v-54" fill="none"/></g>
      </g>
      <g transform="rotate(-4 408 235)">
        <rect x="331" y="189" width="157" height="134" rx="5" fill="#ac7e52" stroke="${INK}" stroke-width="3"/>
        <rect x="339" y="197" width="141" height="118" rx="2" fill="#43594d"/>
        <text x="409" y="223" text-anchor="middle" font-family="Georgia,serif" font-size="17" font-style="italic" fill="#f4e9cb">Made with love</text>
        <path d="M356 235h106m-88 43h67m-74 12h81" stroke="#dddfc5" stroke-width="2" stroke-linecap="round" opacity=".8"/>
        <text x="410" y="263" text-anchor="middle" font-family="Georgia,serif" font-size="16" fill="#f4e9cb">fresh every day</text>
        <path d="m404 298 6 5 6-5" fill="none" stroke="#d39f91" stroke-width="2"/>
      </g>
      <g>
        <path d="M665 217h231v13H665Zm16 13v20m198-20v20M671 350h219v13H671Zm13 13v19m192-19v19" fill="#be9470" stroke="${INK}" stroke-width="2.5"/>
        ${jar(691, 162, '#ccb276')}${jar(738, 162, '#9b7152')}${jar(785, 162, '#c9ae6c')}
        <path d="M842 215v-40q16-14 33 0v40Z" fill="#d8b774" stroke="${INK}" stroke-width="2"/><path d="m850 176 16 11m-17 2 17 11m-16 2 14 11" stroke="#a87e43" stroke-width="3" stroke-linecap="round"/>
        <path d="M690 342q-5-42 13-46 15-36 33-12 33-9 31 47l-8 14Z" fill="#ddb676" stroke="${INK}" stroke-width="2"/><path d="m709 296 19 17m-26-4 19 16m-18-3 12 11m23-38 14 16" stroke="#ae8148" stroke-width="3" stroke-linecap="round"/>
        ${jar(790, 297, '#bd8278')}${jar(839, 297, '#8b93a7')}
      </g>
      <path d="M360 398h493v100H360Z" fill="#b89573" stroke="${INK}" stroke-width="2.5"/>
      <path d="M359 398h498v14H359Z" fill="#7c6450" stroke="${INK}" stroke-width="2.5"/>
      <path d="M686 421h145v70H686Z" fill="#849386" stroke="${INK}" stroke-width="2"/><path d="M700 444h117v36H700Z" fill="#554e43" stroke="${INK}" stroke-width="2"/><path d="M710 453h97v19h-97Z" fill="#d3a060" opacity=".7"/><circle cx="705" cy="432" r="3" fill="#dbceb0"/><circle cx="718" cy="432" r="3" fill="#dbceb0"/><circle cx="818" cy="432" r="3" fill="#dfae70"/>
      <g transform="rotate(3 630 188)"><rect x="594" y="154" width="62" height="72" rx="2" fill="#fff7dd" stroke="#bc9c74" stroke-width="1.5"/><path d="M607 173h36m-36 8h25m-25 8h32" stroke="#c49c7d" stroke-width="2"/><path d="m614 204 7 6 8-7" fill="none" stroke="#c78476" stroke-width="2"/><circle cx="625" cy="158" r="3" fill="#b97054"/></g>
      ${nested(character('grandma', 'happy'), 479, 236, 192, 261)}
      <g>
        <path d="M68 466h828v152H68Z" fill="#779185" stroke="${INK}" stroke-width="3"/>
        <path d="M86 495h227v97H86Zm245 0h254v97H331Zm272 0h274v97H603Z" fill="none" stroke="#556f62" stroke-width="2"/>
        <path d="M91 500h217m29 0h243m29 0h263" stroke="#9fb0a0" stroke-width="2"/>
        <path d="M61 448h843v25H61Z" fill="#e2bd86" stroke="${INK}" stroke-width="3"/>
        <path d="M61 448h843v9H61Z" fill="#f2d2a0"/>
        <path d="M68 618h828v12H68Z" fill="#62796a" stroke="${INK}" stroke-width="2.5"/>
        <g transform="translate(460 546)"><path d="M-41-26q41-19 82 0v35q-41 23-82 0Z" fill="#e8d6af" stroke="#526e5e" stroke-width="2"/><path d="M-23-4q0-24 13-25 6-19 23-7 24-2 26 20" fill="none" stroke="#587864" stroke-width="2"/><path d="M-21-4h43l-6 16h-30Z" fill="#819e86" stroke="#587864" stroke-width="2"/><path d="m-6 1 6 5 6-5" fill="none" stroke="#f4e5be" stroke-width="2"/><path d="m-34 14-9 2m77-2 9 2" stroke="#587864" stroke-width="2"/></g>
      </g>
      <g>
        <path d="M94 439v-73q0-15 15-15h220q15 0 15 15v73Z" fill="#dbe0c7" fill-opacity=".6" stroke="${INK}" stroke-width="2.5"/>
        <path d="M92 431h254v17H92Z" fill="#bf946a" stroke="${INK}" stroke-width="2.5"/>
        <path d="M109 369h220m-220 35h220" stroke="#9ba690" stroke-width="2"/>
        ${nested(pastry('cupcake', { frosting: 'strawberry', sprinkles: true }), 115, 359, 65, 59)}
        ${nested(pastry('cupcake', { frosting: 'vanilla', sprinkles: true }), 178, 359, 65, 59)}
        ${nested(pastry('muffin', { topping: 'blueberries' }), 245, 359, 65, 59)}
        <path d="M105 363v55m9-55v35m213-35v28" stroke="#fffbe7" stroke-width="3" stroke-linecap="round" opacity=".7"/>
        <rect x="175" y="431" width="82" height="25" rx="2" fill="#fff3d6" stroke="#a77f57" stroke-width="1.5"/><text x="216" y="448" fill="#6e5441" font-size="12" font-family="Georgia,serif" text-anchor="middle">freshly baked</text>
      </g>
      <g transform="rotate(-5 415 426)">
        <path d="M366 439v-37q27-14 50 0 24-12 50 0v37q-26-9-50 1-22-12-50-1Z" fill="#b96e59" stroke="${INK}" stroke-width="2"/>
        <path d="M369 433v-35q24-11 47 1 25-12 47 0v34q-26-9-47 2-22-13-47-2Z" fill="#fff0d1" stroke="${INK}" stroke-width="1.5"/>
        <path d="M416 401v33m-36-24 24 2m-24 5 25 2m-25 5 19 2m26-18h26m-26 7h21m-21 7h25" stroke="#b99a75" stroke-width="1.5"/>
      </g>
      <g transform="rotate(7 659 432)"><path d="M625 414h70v29h-70Z" fill="#d9c4a0" stroke="${INK}" stroke-width="1.8"/><path d="M621 408h70v29h-70Z" fill="#eddfc0" stroke="${INK}" stroke-width="1.8"/><path d="M618 402h70v29h-70Z" fill="#f8efd8" stroke="${INK}" stroke-width="1.8"/><text x="653" y="414" font-family="Georgia,serif" font-size="8" text-anchor="middle" fill="#af6b53">VISIT OUR BAKERY</text><path d="M631 421h43m-33 5h21" stroke="#a4a086" stroke-width="1.5"/></g>
      <g><path d="M752 414h88v32h-88Z" fill="#85998a" stroke="${INK}" stroke-width="2.5"/><path d="m766 414 6-43h54l7 43Z" fill="#9eafa0" stroke="${INK}" stroke-width="2.5"/><rect x="778" y="378" width="42" height="17" rx="2" fill="#455f50" stroke="${INK}" stroke-width="1.5"/><text x="800" y="390" font-family="monospace" font-size="10" fill="#deedc7" text-anchor="middle">HELLO!</text><path d="M778 404h40m-48 27h54" stroke="#4f6959" stroke-width="3" stroke-linecap="round"/><circle cx="796" cy="431" r="2.5" fill="#c3a779"/></g>
      ${nested(cup({ type: 'tea', fill: .72 }), 852, 380, 65, 70)}
      <g transform="translate(39 551)"><path d="M-13 18h42l-6 48H-7Z" fill="#bd815b" stroke="${INK}" stroke-width="2.5"/><g fill="#7f9876" stroke="#4f694d" stroke-width="2"><path d="M9 22C-40-1-29-34-9-20 4-8 9 22 9 22Z"/><path d="M9 13C-2-32 18-57 27-37 36-17 9 13 9 13Z"/><path d="M10 25C21-23 47-24 47-5 45 15 10 25 10 25Z"/><path d="M9 25V-16" fill="none"/></g></g>
      <g fill="#fff1c6" stroke="#b88a55" stroke-width="1.5"><path d="m560 162 3 9 9 3-9 3-3 9-3-9-9-3 9-3Z"/><path d="m913 308 2 6 6 2-6 2-2 6-2-6-6-2 6-2Z"/></g>
    </g>
    <rect x="12" y="12" width="936" height="656" rx="28" fill="none" stroke="${INK}" stroke-width="3"/>`, 'Grandma welcomes you to her cozy bakery, with a recipe book, homemade pastries, and a stack of flyers on the counter.', 'bakery-scene');
}
