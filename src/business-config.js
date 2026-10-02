/** Owner-editable business information. Empty values remain hidden in the game. */
export const BUSINESS = {
  name: 'Grandma’s Bakeria',
  tagline: 'A little love in every batch.',
  story: 'Grandma’s recipes bring people together. Help her make a bakery the neighborhood remembers, so she can spend more time baking and less time handing out flyers.',
  introduction: 'Help me bake something people will come back for, and maybe I can finally put these flyers away!',
  colors: { cream: '#fffefa', ink: '#171717', sage: '#d8d8d2', peach: '#eeeeea', rose: '#bdbdb7' },
  logo: '',
  menuUrl: '',
  orderUrl: '',
  visitUrl: '',
  gameUrl: '',
  address: '',
  hours: '',
  featuredProducts: [], // e.g. { recipeId: 'cupcake', name: 'Strawberry Sunday cupcake', url: 'https://your-bakery.example/menu/cupcake' }
  publicOffer: null, // { title: 'Owner-approved offer', description: '...', terms: '...', expires: '2026-12-31', url: 'https://...' }
  analytics: null, // Optional function(eventName, metadata). Never receives personal data or claims purchases.
  loyalty: null, // Reserved for a purchase-verifying integration. Virtual game stamps never represent purchase rewards.
};

export function safeBusinessUrl(value) {
  if (!value) return '';
  try { const url = new URL(value); return ['https:', 'http:'].includes(url.protocol) ? url.href : ''; }
  catch { return ''; }
}

export function activeOffer(now = new Date()) {
  const offer = BUSINESS.publicOffer;
  if (!offer || !offer.title || !offer.terms || !offer.expires) return null;
  const expiry = new Date(`${offer.expires}T23:59:59`);
  return Number.isFinite(expiry.getTime()) && expiry >= now ? offer : null;
}

export function trackEvent(name, metadata = {}) {
  const allowed = ['start', 'completion', 'repeat-play', 'menu-click', 'order-link-click', 'share', 'visit-click'];
  if (allowed.includes(name) && typeof BUSINESS.analytics === 'function') {
    try { BUSINESS.analytics(name, metadata); } catch { /* Analytics cannot interrupt a game. */ }
  }
}
