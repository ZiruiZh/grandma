import { BUSINESS, safeBusinessUrl, activeOffer, trackEvent } from './business-config.js';
import { RECIPES, DRINKS, CUSTOMERS, GRANDMA, INGREDIENTS, UPGRADES, DAY_TITLES, TUTORIAL } from './data.js';
import {
  createProfile, createSession, dispatch, tick, nextDay, dailyChallenge,
  saveGame, loadGame, getBakeWindow, DRINK_FILL_TARGET,
} from './engine.js';
import { brandMark, character, pastry, ingredientIcon, toolIcon, icon, cup, servingContainer } from './art.js';
import { createBakeryStage } from './scene3d.js';

const app = document.querySelector('#app');
const announcer = document.querySelector('#announcer');
const STORAGE_VISITS = 'grandmas-bakeria-plays';
let profile = createProfile();
let session = null;
let screen = 'welcome';
let station = 'counter';
let tutorialStep = -1;
let settingsOpen = false;
let scrapbookOpen = false;
let ticketDrawerOpen = false;
let shareFallbackUrl = '';
let toastTimer = 0;
let lastTick = performance.now();
let audioContext = null;
let heldTimer = 0;
let lastCustomerVisual = '';
const seenTicketIds = new Set();
const trackedCompletions = new Set();
let threeStage = null;

const previous = loadGame();
if (previous?.profile) profile = previous.profile;
applyBrand();

function applyBrand() {
  const colors = BUSINESS.colors || {};
  const root = document.documentElement.style;
  if (colors.cream) root.setProperty('--cream', colors.cream);
  if (colors.ink) root.setProperty('--ink', colors.ink);
  if (colors.sage) root.setProperty('--sage', colors.sage);
  if (colors.peach) root.setProperty('--peach', colors.peach);
  if (colors.rose) root.setProperty('--rose', colors.rose);
}

const escapeHtml = (value = '') => String(value).replace(/[&<>'"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[c]));
const cap = value => String(value || '').replaceAll('-', ' ').replace(/\b\w/g, c => c.toUpperCase());
const customerById = id => CUSTOMERS.find(c => c.id === id) || CUSTOMERS[0];
const selectedOrder = () => session?.orders?.find(o => o.id === session.selectedOrderId && o.stage !== 'served') || session?.orders?.find(o => o.stage !== 'served') || null;
const activeOrders = () => session?.orders?.filter(o => o.stage !== 'served') || [];
const pct = value => `${Math.max(0, Math.min(100, Math.round((value || 0) * 100)))}%`;

function announce(message) {
  announcer.textContent = '';
  requestAnimationFrame(() => { announcer.textContent = message; });
}

function customerName(order) { return customerById(order.customerId).name; }

function orderDescription(order) {
  if (!order) return 'No order selected.';
  const pastryName = order.quantity === 1 ? RECIPES[order.family].singular : `${RECIPES[order.family].singular}s`;
  const pastryBits = [`${order.quantity} ${order.flavor} ${pastryName}`];
  if (order.frosting) pastryBits.push(`with ${order.frosting} frosting`);
  if (order.topping) pastryBits.push(`and ${cap(order.topping).toLowerCase()}`);
  const drinkBits = order.drink ? [`${cap(order.drink.variety === 'classic' || order.drink.variety === 'house' ? order.drink.type : `${order.drink.variety} ${order.drink.type}`)}`] : [];
  if (order.drink?.extras?.length) drinkBits.push(`with ${order.drink.extras.map(cap).join(' and ').toLowerCase()}`);
  return `${pastryBits.join(' ')}, plus ${drinkBits.join(' ')}. ${order.takeaway ? 'Takeaway' : 'For here'}, please!`;
}

function wordmark(compact = false) {
  const ownerLogo = BUSINESS.logo ? `<img class="owner-logo" src="${escapeHtml(BUSINESS.logo)}" alt="">` : brandMark(BUSINESS.name);
  return `<div class="wordmark">${ownerLogo}${compact ? '' : `<span>${escapeHtml(BUSINESS.name)}</span>`}</div>`;
}

function businessLinks(className = 'button-row') {
  const links = [
    [safeBusinessUrl(BUSINESS.menuUrl), 'View Menu', 'menu-click'],
    [safeBusinessUrl(BUSINESS.orderUrl), 'Order Online', 'order-link-click'],
    [safeBusinessUrl(BUSINESS.visitUrl), 'Visit Grandma', 'visit-click'],
  ].filter(([url]) => url);
  if (!links.length) return '';
  return `<div class="${className}">${links.map(([url, label, event]) => `<a class="btn small cream" href="${escapeHtml(url)}" target="_blank" rel="noopener" data-track="${event}">${label}</a>`).join('')}</div>`;
}

function renderWelcome() {
  const challenge = dailyChallenge(new Date());
  const currentSave = loadGame();
  const resumable = currentSave?.session && currentSave.session.mode === 'story' && currentSave.session.phase !== 'complete';
  app.innerHTML = `<main class="welcome app-shell">
    <section class="welcome-scene" aria-label="Grandma stands behind her counter with her recipe book and three stacks of advertising flyers.">
      <div id="three-welcome" class="three-stage welcome-stage" aria-hidden="true"></div>
      <div class="welcome-art"><div class="grandma-hero">${character(GRANDMA, 'neutral')}</div></div>
      <div class="recipe-book"><strong>Grandma’s recipes</strong><span>Butter, patience & a pinch of joy.</span></div>
      <div class="flyer-stack" aria-label="Three planned flyer runs"><div class="flyer">Fresh baking today!</div><div class="flyer">Neighborhood treats</div><div class="flyer">Please visit us!</div></div>
    </section>
    <section class="welcome-copy">
      ${wordmark()}
      <p class="eyebrow">${escapeHtml(BUSINESS.tagline)}</p>
      <div><p class="eyebrow">A cozy bakery game</p><h1>Bake a place they’ll <em>remember.</em></h1></div>
      <p class="story">${escapeHtml(BUSINESS.story)}</p>
      <blockquote class="grandma-quote">“${escapeHtml(BUSINESS.introduction)}”</blockquote>
      <div class="mode-grid" aria-label="Choose a game mode">
        <button class="mode-card" data-start="quick"><strong>Quick Play</strong><span>Serve three neighbors in one complete bakery shift. No sign-up needed.</span><span class="mode-time">About 2–3 minutes</span></button>
        <button class="mode-card" data-start="story"><strong>${resumable ? 'Continue Story' : 'Story Mode'}</strong><span>Grow through five days, earn regulars, unlock recipes, and host a neighborhood tea party.</span><span class="mode-time">Five short days</span></button>
      </div>
      <div class="button-row">
        <button class="btn ghost small" data-start="daily">Today’s challenge · ${escapeHtml(challenge?.name || challenge?.title || 'Golden batch')}</button>
        <button class="btn ghost small" data-action="scrapbook">Baking scrapbook</button>
        <button class="btn ghost small" data-action="share">${icon('share')} Share the game</button>
      </div>
      ${businessLinks('welcome-links')}
    </section>
    ${scrapbookOpen ? scrapbookModal() : ''}${shareFallbackUrl ? shareFallbackModal() : ''}
  </main>`;
  mountVisual('three-welcome', 'counter', null);
}

function mountVisual(id, visualStation = station, order = selectedOrder()) {
  threeStage?.destroy?.();
  const host = document.getElementById(id);
  threeStage = host ? createBakeryStage(host, { station: visualStation, order, reducedMotion: profile.settings?.reducedMotion || matchMedia('(prefers-reduced-motion: reduce)').matches }) : null;
}

function startGame(mode) {
  const saved = loadGame();
  const engineMode = mode === 'daily' ? 'quick' : mode;
  if (engineMode === 'story' && saved?.session && saved.session.mode === 'story' && saved.session.phase !== 'complete') {
    profile = saved.profile;
    session = saved.session;
    if (session.paused) dispatch(session, profile, { type: 'resume' });
  } else {
    if (engineMode === 'story' && saved?.profile) profile = saved.profile;
    session = createSession(engineMode, profile, 1);
    if (mode === 'daily') {
      session.isDaily = true;
      const challenge = dailyChallenge(new Date());
      session.dailyRecipe = challenge;
      const order = session.queue[0];
      if (order) {
        order.family = challenge.family; order.flavor = challenge.flavor; order.topping = challenge.topping || null; order.frosting = challenge.frosting || null;
        order.quantity = 1; order.stage = 'ingredients'; order.ingredients = []; order.requiredIngredients = [...RECIPES[challenge.family].ingredients];
        if (challenge.flavor === 'chocolate') order.requiredIngredients.push('cocoa');
        if (challenge.topping && challenge.family !== 'cupcake') order.requiredIngredients.push(challenge.topping);
      }
    }
  }
  screen = 'game';
  station = 'counter';
  tutorialStep = profile.tutorialSeen ? -1 : 0;
  let plays = 1;
  try { plays = Number(localStorage.getItem(STORAGE_VISITS) || 0) + 1; localStorage.setItem(STORAGE_VISITS, String(plays)); } catch { /* Private or restricted storage still permits play. */ }
  trackEvent(plays > 1 ? 'repeat-play' : 'start', { mode });
  sound('bell');
  saveGame(profile, session);
  render();
}

function progressRibbon() {
  const regulars = profile.regulars?.length || 0;
  const word = Math.min(1, (profile.wordOfMouth || 0) / 100);
  const saved = profile.advertising?.timeSaved || 0;
  return `<div class="progress-ribbon" aria-label="Bakery progress">
    <div class="ribbon-stat"><span>Regulars</span><div class="meter"><span style="--value:${pct(regulars / 6)}"></span></div><strong>${regulars}/6</strong></div>
    <div class="ribbon-stat"><span>Word of mouth</span><div class="meter"><span style="--value:${pct(word)}"></span></div><strong>${Math.round(word * 100)}%</strong></div>
    <div class="ribbon-stat"><span>Grandma’s time saved</span><div class="meter"><span style="--value:${pct(saved / 60)}"></span></div><strong>${saved}m</strong></div>
  </div>`;
}

function ticketCard(order) {
  const customer = customerById(order.customerId);
  const patience = Math.max(0, 1 - order.elapsed / ((customer.patience || 180) * (profile.settings.relaxed ? 1.7 : 1)));
  const isNew = !seenTicketIds.has(order.id);
  seenTicketIds.add(order.id);
  return `<button class="ticket ${order.id === session.selectedOrderId ? 'active' : ''} ${isNew ? 'new' : ''}" data-select-order="${order.id}" aria-label="Select ${escapeHtml(customer.name)}’s order">
    <span class="portrait">${character(customer, order.elapsed > customer.patience * .65 ? 'waiting' : 'neutral')}</span>
    <span><span class="ticket-name"><span>${escapeHtml(customer.name)}</span><span>#${escapeHtml(order.id.slice(-3))}</span></span>
      <span class="ticket-order">${escapeHtml(orderDescription(order))}</span>
      <span class="ticket-icons">${pastry(order, order.stage === 'baking' ? 'raw' : (order.stage === 'baked' || order.stage === 'decorating' || order.stage === 'ready' ? 'golden' : 'raw'))}${cup(order.drinkPrep || {})}<span class="pill">${cap(order.stage)}</span></span>
      <span class="wait-meter" aria-label="Customer patience ${Math.round(patience * 100)} percent"><span style="width:${pct(patience)}"></span></span>
    </span>
  </button>`;
}

function ticketsContent() {
  const orders = activeOrders();
  return orders.length ? orders.map(ticketCard).join('') : `<div class="task-card"><strong>No active tickets.</strong><p class="muted">Greet the next neighbor at the counter.</p></div>`;
}

function ticketPanel() {
  return `<aside class="ticket-panel" aria-label="Order tickets"><div class="ticket-panel-head"><h2>Ticket rail</h2><span>${activeOrders().length}/${session.capacity || 1}</span></div><div class="ticket-stack">${ticketsContent()}</div></aside>`;
}

function phoneTicketDrawer() {
  const order = selectedOrder();
  return `<button class="ticket-drawer-button" data-action="tickets" aria-expanded="${ticketDrawerOpen}"><span>🎟 ${order ? `${customerName(order)} · ${cap(order.stage)}` : 'No active ticket'}</span><span>${activeOrders().length} ticket${activeOrders().length === 1 ? '' : 's'} ▾</span></button>
  ${ticketDrawerOpen ? `<div class="phone-ticket-overlay" data-action="close-tickets"><div class="drawer" role="dialog" aria-modal="true" aria-label="Order tickets"><div class="drawer-head"><strong>Ticket rail</strong><button class="btn icon-button ghost" data-action="close-tickets" aria-label="Close tickets">${icon('close')}</button></div><div class="ticket-stack">${ticketsContent()}</div></div></div>` : ''}`;
}

function stationHeading(title, note) {
  return `<div class="station-heading"><div><p class="eyebrow">${escapeHtml(title)}</p><h2 class="section-title">${escapeHtml(note)}</h2></div>${selectedOrder() ? `<span class="pill">Working on ${escapeHtml(customerName(selectedOrder()))}</span>` : ''}</div>`;
}

function emptyStation(message = 'Take an order at the counter to begin.') {
  return `<div class="empty-station"><div>${toolIcon('tray')}<h3>${escapeHtml(message)}</h3><button class="btn secondary" data-station="counter">Go to counter</button></div></div>`;
}

function renderCounter() {
  const order = selectedOrder();
  const waiting = session.queue?.[0];
  const assemblyReady = order?.stage === 'ready' && order.drinkPrep?.finished;
  const capacityOpen = activeOrders().length < (session.capacity || 1);
  const customer = assemblyReady ? customerById(order.customerId) : waiting && capacityOpen ? customerById(waiting.customerId || waiting.id) : (order ? customerById(order.customerId) : GRANDMA);
  const shouldEnter = lastCustomerVisual !== customer.id;
  lastCustomerVisual = customer.id;
  let action = '';
  if (assemblyReady) {
    const correctContainer = order.takeaway ? 'box' : 'tray';
    action = `<div class="speech"><h3>Assemble ${escapeHtml(customer.name)}’s order</h3><p>Place the finished pastry and drink together, then choose the right packaging.</p>
      <div class="assembly"><div class="assembly-slot">${pastry(order, 'golden')}<strong>${order.quantity} ${cap(order.family)}</strong></div><div class="assembly-slot">${cup(order.drinkPrep)}<strong>${cap(order.drink.type)}</strong></div></div>
      <div class="container-choice"><button class="choice-button ${order.packaging === 'tray' ? 'active' : ''}" data-package="tray">${servingContainer('tray')} For here</button><button class="choice-button ${order.packaging === 'box' ? 'active' : ''}" data-package="box">${servingContainer('box')} Takeaway box</button></div>
      <button class="btn" data-game="serve" ${order.packaging ? '' : 'disabled'}>${icon('check')} Hand to ${escapeHtml(customer.name)}</button>
      ${order.packaging && order.packaging !== correctContainer ? '<p class="muted">You can still change the packaging before serving.</p>' : ''}
    </div>`;
  } else if (waiting && capacityOpen) {
    action = `<div class="speech"><blockquote>“${escapeHtml(customer.dialogue?.[profile.successfulVisits?.[customer.id] ? 'returning' : 'greeting'] || 'Hello! Something lovely, please.')}”</blockquote><p>${escapeHtml(waiting.family ? orderDescription(waiting) : 'Greet me to see today’s order.')}</p><button class="btn" data-game="take-order">Greet & take order</button></div>`;
  } else if (order) {
    action = `<div class="speech"><blockquote>“I’ll be right here when it’s ready.”</blockquote><p>${escapeHtml(orderDescription(order))}</p><button class="btn secondary" data-station="${nextStation(order)}">Continue at ${cap(nextStation(order))}</button></div>`;
  } else {
    action = `<div class="speech"><blockquote>“A quiet counter is a good time to straighten the recipe cards.”</blockquote><p>The next neighbor will be here in a moment.</p></div>`;
  }
  return `<section class="station"><div class="station-wall"></div><div class="station-counter"></div><div class="station-content">${stationHeading('Counter', 'A warm hello starts every order')}<div class="customer-stage"><div class="customer-figure ${shouldEnter ? 'enter' : ''}">${character(customer, waiting ? 'happy' : 'neutral')}</div>${action}</div></div></section>`;
}

function nextStation(order) {
  if (['ingredients', 'mixing', 'portioning'].includes(order.stage)) return 'mixing';
  if (['ready-to-bake', 'baking'].includes(order.stage)) return 'oven';
  if (['baked', 'decorating'].includes(order.stage)) return 'decorating';
  if (!order.drinkPrep?.finished) return 'drinks';
  return 'counter';
}

function renderMixing() {
  const order = selectedOrder();
  if (!order) return stationShell('Mixing', 'Measure, stir, and portion', emptyStation());
  const required = order.requiredIngredients || RECIPES[order.family].ingredients;
  const readyIngredients = required.every(id => order.ingredients.includes(id));
  let work = '';
  if (order.stage === 'ingredients') {
    work = `<div class="recipe-strip" aria-label="Recipe ingredients">${required.map(id => `<span class="recipe-chip ${order.ingredients.includes(id) ? 'done' : ''}">${ingredientIcon(id)}${cap(id)}</span>`).join('')}</div>
      <div class="ingredient-shelf">${INGREDIENTS.map(item => `<button class="ingredient-btn ${order.ingredients.includes(item.id) ? 'added' : ''}" data-ingredient="${item.id}">${ingredientIcon(item.id)}${escapeHtml(item.name)}</button>`).join('')}</div>
      <p class="muted">Add the ingredients on Grandma’s recipe card. A wrong scoop is recoverable, but it costs a little.</p>`;
  } else if (order.stage === 'mixing') {
    work = `<div class="mix-worktop"><div class="bowl-wrap ${order.mixProgress > 0 && order.mixProgress < 1 ? 'mixing' : ''}">${toolIcon('bowl')}<div class="whisk">${toolIcon('whisk')}</div></div><div><h3>Stir until smooth</h3><p>Hold the whisk button, or tap it repeatedly.</p><button id="mix-hold" class="hold-button" style="--hold:${pct(order.mixProgress)}"><span>${Math.round(order.mixProgress * 100)}% mixed</span></button></div></div>`;
  } else if (order.stage === 'portioning') {
    work = `<h3>Portion ${order.quantity} ${RECIPES[order.family].singular}${order.quantity > 1 ? 's' : ''}</h3><p>Tap each marked spot. The targets are generous—Grandma isn’t measuring with a ruler.</p><div class="tray-grid">${Array.from({ length: order.quantity }, (_, i) => `<button class="portion-target ${i < order.portions ? 'filled' : ''}" data-portion="${i}" aria-label="${i < order.portions ? 'Filled' : 'Fill'} tray position ${i + 1}">${i < order.portions ? pastry(order, 'raw') : '+'}</button>`).join('')}</div>`;
  } else {
    work = `<div class="empty-station"><div>${pastry(order, order.bakeQuality ? 'golden' : 'raw')}<h3>This batch is ${cap(order.stage)}.</h3><button class="btn secondary" data-station="${nextStation(order)}">Go to ${cap(nextStation(order))}</button><button class="btn ghost small" data-remake="pastry">Remake pastry · 1 coin</button></div></div>`;
  }
  return stationShell('Mixing', `${cap(order.flavor)} ${RECIPES[order.family].name}`, `<div class="task-card">${readyIngredients && order.stage === 'ingredients' ? '<p class="pill">All ingredients added</p>' : ''}${work}</div>`);
}

function stationShell(label, title, content) {
  return `<section class="station"><div class="station-wall"></div><div class="station-counter"></div><div class="station-content">${stationHeading(label, title)}${content}</div></section>`;
}

function renderOven() {
  const order = selectedOrder();
  const slots = profile.upgrades?.['second-oven'] ? 2 : 1;
  const baking = activeOrders().filter(o => o.stage === 'baking');
  const selectedCanBake = order?.stage === 'ready-to-bake';
  const window = order ? getBakeWindow(order, profile) : { goldenStart: 12, goldenEnd: 21 };
  const bakeMax = Math.max(window.goldenEnd + 7, 25);
  const bakeRatio = order?.stage === 'baking' ? Math.min(1, order.bakeTime / bakeMax) : 0;
  const qualityLabel = !order ? '' : order.bakeTime < window.goldenStart ? 'Underbaked' : order.bakeTime <= window.goldenEnd ? 'Golden — take it out!' : 'Getting dark';
  const slotsHtml = Array.from({ length: slots }, (_, i) => {
    const item = baking[i];
    return `<div class="oven-slot ${item ? 'baking' : ''}">${item ? `<div><div class="bake-pastries">${Array.from({length:item.quantity},()=>pastry(item, item.bakeTime < window.goldenStart ? 'raw' : item.bakeTime <= window.goldenEnd ? 'golden' : 'overbaked')).join('')}</div><small>${escapeHtml(customerName(item))} · ${Math.round(item.bakeTime)}s</small></div>` : '<span>Empty shelf</span>'}</div>`;
  }).join('');
  return stationShell('Oven', 'Warm, watchful, and wonderfully fragrant', `<div class="oven-unit"><div class="oven-window ${baking.length ? 'hot' : ''}"><div class="oven-shelf">${slotsHtml}</div>${baking.length ? '<div class="steam"><i style="--x:-20px"></i><i style="--x:50px;--delay:.5s"></i><i style="--x:130px;--delay:1s"></i></div>' : ''}</div>
    <div class="oven-controls"><div><div class="bake-band" aria-label="Baking progress"><span style="--bake:${pct(bakeRatio)}"></span></div><small>${order?.stage === 'baking' ? qualityLabel : 'The golden band is generous.'}</small></div><span class="timer-display">${order?.stage === 'baking' ? `${Math.round(order.bakeTime)}s` : '—'}</span></div>
    <div class="button-row" style="margin-top:1rem">${selectedCanBake ? `<button class="btn" data-game="start-bake" ${baking.length >= slots ? 'disabled' : ''}>Put tray in oven</button>` : ''}${order?.stage === 'baking' ? '<button class="btn" data-game="remove-bake">Remove selected tray</button>' : ''}${order?.stage === 'baked' ? '<button class="btn secondary" data-station="decorating">Decorate this batch</button>' : ''}${!order ? '<span class="muted">Select a ticket to check its tray.</span>' : ''}</div>
  </div>`);
}

function renderDecorating() {
  const order = selectedOrder();
  if (!order) return stationShell('Decorating', 'A sweet finishing touch', emptyStation());
  if (!['baked', 'decorating', 'ready'].includes(order.stage)) return stationShell('Decorating', 'A sweet finishing touch', `<div class="task-card">${emptyStation(`Bake ${customerName(order)}’s pastry first.`)}</div>`);
  const isCupcake = order.family === 'cupcake';
  const frostings = RECIPES[order.family].frostings || [];
  const topping = isCupcake ? order.topping : null;
  const decor = order.decoration;
  return stationShell('Decorating', `${cap(order.family)} finishing bench`, `<div class="task-card"><div class="decorate-workspace"><div class="decor-options">
    ${isCupcake ? `<strong>Frosting</strong>${frostings.map((f, i) => `<button class="choice-button ${decor.frosting === f ? 'active' : ''}" data-frosting="${f}"><span class="frosting-swatch" style="--shade:${['#fff','#999','#222'][i % 3]}"></span>${cap(f)}</button>`).join('')}` : '<span class="pill">No frosting needed</span>'}
    ${topping ? `<button class="choice-button ${decor.toppings?.includes(topping) ? 'active' : ''}" data-topping="${topping}">${ingredientIcon(topping)} Add ${cap(topping)}</button>` : '<span class="muted">No topping requested.</span>'}
    <button class="choice-button" data-game="decorate">Pipe a little</button><button class="btn secondary" data-game="finish-decoration">Finish pastry</button>
  </div><div id="decor-canvas" class="decor-canvas" aria-label="Pastry decorating area. Tap or drag along the guide."><div class="decor-pastry">${pastry(order, 'golden')}</div>${isCupcake ? '<div class="pipe-guide"></div>' : ''}${Array.from({length:Math.round((decor.coverage || 0)*12)},(_,i)=>`<i class="frosting-mark" style="left:${40 + (i%4)*7}%;top:${39 + Math.floor(i/4)*8}%;--frosting:${decor.frosting === 'strawberry' ? '#e7a0a0' : decor.frosting === 'chocolate' ? '#75503e' : '#f6e7c9'}"></i>`).join('')}${Array.from({length:decor.sprinkles || 0},(_,i)=>`<i class="sprinkle-mark" style="left:${36+(i*17)%32}%;top:${36+(i*23)%34}%;--rotate:${(i*37)%150}deg;--sprinkle:${['#bd4b40','#e0a33a','#4f877a','#8e6aaa'][i%4]}"></i>`).join('')}</div></div>
    <p class="muted">${isCupcake ? `Tap or drag over the pastry to pipe a forgiving swirl${topping ? `, then add ${cap(topping).toLowerCase()}` : ''}.` : 'Give the baked pastry a quick finishing check, then mark it ready.'}</p>
  </div>`);
}

function renderDrinks() {
  const order = selectedOrder();
  if (!order) return stationShell('Drinks', 'A warm cup for the road', emptyStation());
  const prep = order.drinkPrep;
  const requested = DRINKS.find(d => d.id === order.drink.type);
  const selected = DRINKS.find(d => d.id === prep.type);
  return stationShell('Drinks', `${cap(order.drink.type)} for ${customerName(order)}`, `<div class="task-card"><div class="drink-workspace"><div class="cup-stage ${prep.fill > 0 && prep.fill < DRINK_FILL_TARGET ? 'filling' : ''}">${cup(prep)}${prep.fill >= .75 ? '<div class="steam-lines"><i style="--x:25px"></i><i style="--x:60px;animation-delay:.7s"></i></div>' : ''}</div><div class="drink-controls">
    <p class="recipe-strip"><span class="recipe-chip">Requested: ${cap(order.drink.variety)} ${cap(order.drink.type)}</span>${order.drink.extras.map(e => `<span class="recipe-chip">+ ${cap(e)}</span>`).join('')}${order.takeaway ? '<span class="recipe-chip">+ lid</span>' : ''}</p>
    ${!prep.cup ? '<button class="btn" data-game="select-cup">Choose a cup</button>' : `<div><strong>Choose the drink</strong><div class="choice-grid">${DRINKS.map(drink => drink.varieties.map(v => `<button class="choice-button ${prep.type === drink.id && prep.variety === v ? 'active' : ''}" data-drink="${drink.id}" data-variety="${v}">${cap(v)} ${cap(drink.id)}</button>`).join('')).join('')}</div></div>`}
    ${prep.type ? `<div class="fill-gauge"><button id="drink-hold" class="hold-button" style="--hold:${pct(prep.fill / DRINK_FILL_TARGET)}"><span>Hold to pour · ${Math.round(prep.fill * 100)}%</span></button><span>Line ${Math.round(DRINK_FILL_TARGET*100)}%</span></div>` : ''}
    ${selected ? `<div><strong>Add extras</strong><div class="button-row">${selected.extras.map(extra => `<button class="choice-button ${prep.extras?.includes(extra) ? 'active' : ''}" data-drink-extra="${extra}">+ ${cap(extra)}</button>`).join('')}${order.takeaway ? `<button class="choice-button ${prep.lid ? 'active' : ''}" data-game="drink-lid">${prep.lid ? '✓ ' : ''}Takeaway lid</button>` : ''}</div></div>` : ''}
    ${prep.type ? '<button class="btn secondary" data-game="finish-drink">Finish drink</button>' : ''}
    ${prep.finished ? '<p class="pill">Drink ready</p>' : ''}
    <button class="btn ghost small" data-remake="drink">Start drink again · 1 coin</button>
  </div></div></div>`);
}

function renderStation() {
  if (station === 'mixing') return renderMixing();
  if (station === 'oven') return renderOven();
  if (station === 'decorating') return renderDecorating();
  if (station === 'drinks') return renderDrinks();
  return renderCounter();
}

function ovenAlerts() {
  const alerts = activeOrders().filter(o => o.stage === 'baking').map(o => {
    const win = getBakeWindow(o, profile);
    if (o.bakeTime >= win.goldenStart) return `<span class="oven-alert">🔔 ${escapeHtml(customerName(o))}’s tray is ${o.bakeTime <= win.goldenEnd ? 'golden' : 'getting dark'}!</span>`;
    return '';
  }).filter(Boolean);
  return alerts.length ? `<div class="oven-alerts" aria-live="assertive">${alerts.join('')}</div>` : '';
}

function renderGame() {
  if (!session) return renderWelcome();
  if (session.phase === 'day-results' || session.phase === 'complete') return renderResults();
  app.innerHTML = `<main class="game app-shell">
    <header class="topbar">${wordmark()}<span class="day-chip">${session.isDaily ? 'Daily Recipe Challenge' : session.mode === 'quick' ? 'Quick Play' : `Day ${session.day} · ${DAY_TITLES[session.day - 1]}`}</span><span class="pill">${3 - (profile.advertising?.runsCancelled || 0)} flyer runs left</span><span class="money-chip">${icon('coin')} ${profile.coins}</span><div class="top-actions"><button class="btn icon-button" data-action="sound" aria-label="${profile.settings.sound ? 'Mute sound' : 'Turn sound on'}">${icon(profile.settings.sound ? 'sound' : 'muted')}</button><button class="btn icon-button" data-action="pause" aria-label="Pause game">${icon('pause')}</button></div></header>
    ${progressRibbon()}${phoneTicketDrawer()}${ovenAlerts()}
    <div class="game-layout"><div class="play-column"><div class="station-area"><div id="three-stage" class="three-stage" aria-hidden="true"></div>${renderStation()}</div>${stationNav()}</div>${ticketPanel()}</div>
    ${tutorialStep >= 0 ? tutorialModal() : ''}${settingsOpen ? pauseModal() : ''}
  </main>`;
  bindHoldControls();
  bindDecorCanvas();
  mountVisual('three-stage', station, selectedOrder());
}

function stationNav() {
  const items = [['counter','🏡','Counter'],['mixing','🥣','Mixing'],['oven','♨','Oven'],['decorating','🧁','Decorate'],['drinks','☕','Drinks']];
  const alert = activeOrders().some(o => o.stage === 'baking' && o.bakeTime >= getBakeWindow(o, profile).goldenStart);
  return `<nav class="station-nav" aria-label="Bakery stations">${items.map(([id,emoji,label]) => `<button class="station-tab ${station === id ? 'active' : ''} ${id === 'oven' && alert ? 'alert' : ''}" data-station="${id}" aria-current="${station === id ? 'page' : 'false'}"><span class="tab-icon">${emoji}</span>${label}</button>`).join('')}</nav>`;
}

function tutorialModal() {
  const step = TUTORIAL[tutorialStep];
  return `<div class="modal-backdrop"><section class="modal" role="dialog" aria-modal="true" aria-labelledby="tutorial-title"><div class="modal-body"><p class="eyebrow">How to play · ${tutorialStep + 1} of ${TUTORIAL.length}</p><h2 id="tutorial-title">${escapeHtml(step.title)}</h2><div class="tutorial-visual">${step.station === 'mixing' ? toolIcon('bowl') : step.station === 'oven' ? toolIcon('tray') : step.station === 'drinks' ? cup({type:'hot-chocolate',fill:.8,extras:['marshmallows']}) : character(tutorialStep ? CUSTOMERS[1] : GRANDMA, 'happy')}</div><p>${escapeHtml(step.text)}</p><div class="step-dots">${TUTORIAL.map((_, i) => `<span class="${i === tutorialStep ? 'active' : ''}"></span>`).join('')}</div><div class="button-row"><button class="btn ghost" data-action="skip-tutorial">Skip</button><button class="btn" data-action="tutorial-next">${tutorialStep === TUTORIAL.length - 1 ? 'Let’s bake' : 'Next'}</button></div></div></section></div>`;
}

function pauseModal() {
  return `<div class="modal-backdrop"><section class="modal" role="dialog" aria-modal="true" aria-labelledby="pause-title"><div class="modal-body"><p class="eyebrow">The bakery is paused</p><h2 id="pause-title">Take a little breather.</h2><p>Orders and ovens are frozen until you return.</p><label class="choice-button"><input type="checkbox" data-setting="sound" ${profile.settings.sound ? 'checked' : ''}> Sound effects</label><label class="choice-button"><input type="checkbox" data-setting="relaxed" ${profile.settings.relaxed ? 'checked' : ''}> Relaxed mode · more patient customers</label><label class="choice-button"><input type="checkbox" data-setting="reducedMotion" ${profile.settings.reducedMotion ? 'checked' : ''}> Reduce motion</label><div class="button-row" style="margin-top:1rem"><button class="btn" data-action="resume">Resume baking</button><button class="btn ghost" data-action="home">Save & return home</button></div></div></section></div>`;
}

function renderResults() {
  const stats = session.dayStats || {};
  const results = session.results || [];
  const last = results.slice(-Math.max(1, stats.customersServed || results.length));
  const milestone = session.events?.slice().reverse().find(e => e.type === 'advertising-milestone' || e.type === 'milestone');
  const complete = session.phase === 'complete';
  const featured = BUSINESS.featuredProducts?.find(item => last.some(r => session.orders.find(order => order.id === r.orderId)?.family === item.recipeId));
  const offer = activeOffer();
  const happiness = (profile.regulars?.length || 0) >= 4 ? 'happy' : 'neutral';
  const reachedGoal = (profile.regulars?.length || 0) >= 6;
  app.innerHTML = `<main class="results-screen"><div class="results-wrap"><header class="results-header"><div>${character(GRANDMA, happiness)}</div><div><p class="eyebrow">${session.isDaily ? 'Daily recipe complete' : complete ? (session.mode === 'story' ? 'Neighborhood bakery event' : 'Quick Play complete') : `Day ${session.day} complete`}</p><h1>${complete && session.mode === 'story' && reachedGoal ? 'Grandma has time for tea.' : 'A lovely day’s work.'}</h1><p>${session.isDaily ? `${escapeHtml(session.dailyRecipe.description)} Your best result is saved in this browser.` : complete && session.mode === 'story' ? (reachedGoal ? 'Your care brought six neighbors back, filled the recipe book with memories, and let Grandma put the last flyers away.' : `The neighborhood event was a joy. ${6 - (profile.regulars?.length || 0)} more regular${6 - (profile.regulars?.length || 0) === 1 ? '' : 's'} will help Grandma finish putting the flyers away.`) : 'Every warm welcome makes the bakery feel a little more like home.'}</p></div></header>
    <section class="receipt"><p class="eyebrow">Bakery receipt</p><h2 class="section-title">${escapeHtml(BUSINESS.name)}</h2><div class="stats-grid"><div class="stat-card"><strong>${stats.customersServed ?? last.length}</strong><span>Customers served</span></div><div class="stat-card"><strong>${Math.round(stats.satisfaction || average(last.map(r => r.total)) || 0)}%</strong><span>Average satisfaction</span></div><div class="stat-card"><strong>${stats.sales ?? sum(last,'payment')} coins</strong><span>Bakery sales</span></div><div class="stat-card"><strong>${stats.tips ?? sum(last,'tip')} coins</strong><span>Tips</span></div><div class="stat-card"><strong>−${stats.costs ?? stats.ingredientCosts ?? 0}</strong><span>Ingredient costs</span></div><div class="stat-card"><strong>${stats.profit ?? ((stats.sales || 0)+(stats.tips || 0)-(stats.costs || 0))}</strong><span>Operating profit</span></div><div class="stat-card"><strong>${profile.advertising?.savings || 0} coins</strong><span>Advertising avoided</span></div><div class="stat-card"><strong>${profile.advertising?.timeSaved || 0} min</strong><span>Grandma’s time saved</span></div></div>
      <p><strong>${stats.newRegulars ?? 0}</strong> new regular${(stats.newRegulars ?? 0) === 1 ? '' : 's'} today · <strong>${profile.regulars?.length || 0}/6</strong> story goal</p><div class="score-list">${last.map(resultRow).join('') || '<p class="muted">Your order results will appear here.</p>'}</div>
      ${milestone ? '<div class="milestone-card"><strong>🎉 Two new regulars!</strong><p>Grandma saved 10 coins and 20 minutes of advertising. This is tracked separately from bakery revenue.</p></div>' : ''}
    </section>
    ${session.mode === 'story' && !complete ? upgradeShop() : ''}
    ${featured && safeBusinessUrl(featured.url) ? `<div class="offer-card"><strong>Made you hungry?</strong><p>${escapeHtml(featured.name)} is available at the real bakery.</p><a class="btn secondary small" href="${escapeHtml(safeBusinessUrl(featured.url))}" target="_blank" rel="noopener">Try this at the bakery</a></div>` : ''}
    ${offer ? `<div class="offer-card"><p class="eyebrow">Current bakery offer</p><h3>${escapeHtml(offer.title)}</h3><p>${escapeHtml(offer.description || '')}</p><p><strong>Terms:</strong> ${escapeHtml(offer.terms)} · Expires ${escapeHtml(offer.expires)}</p>${safeBusinessUrl(offer.url) ? `<a class="btn secondary small" href="${escapeHtml(safeBusinessUrl(offer.url))}" target="_blank" rel="noopener">View offer</a>` : ''}</div>` : ''}
    <div class="cta-band"><div class="address-block"><strong>${escapeHtml(BUSINESS.name)}</strong>${BUSINESS.address ? `<br>${escapeHtml(BUSINESS.address)}` : ''}${BUSINESS.hours ? `<br>${escapeHtml(BUSINESS.hours)}` : ''}</div>${businessLinks()}<div class="button-row"><button class="btn cream" data-action="share">${icon('share')} Share the game</button>${!complete && session.mode === 'story' ? '<button class="btn" data-action="next-day">Next day</button>' : '<button class="btn" data-action="play-again">Play again</button>'}</div></div>
    <p class="muted" style="text-align:center">Game regulars and stamps are locally saved achievements. Real purchases and rewards require verification from the bakery.</p>
    ${scrapbookOpen ? scrapbookModal() : ''}${shareFallbackUrl ? shareFallbackModal() : ''}
  </div></main>`;
  if (milestone) celebration();
  const completionKey = `${session.id}:${session.day}`;
  if (!trackedCompletions.has(completionKey)) { trackedCompletions.add(completionKey); trackEvent('completion', { mode: session.mode, day: session.day }); }
}

function average(values) { return values.length ? values.reduce((a,b)=>a+(Number(b)||0),0)/values.length : 0; }
function sum(items, key) { return items.reduce((a, item) => a + Number(item[key] || item.score?.[key] || 0), 0); }

function resultRow(result) {
  const score = result.score || result;
  const customerId = result.customerId || result.order?.customerId || score.customerId;
  const name = customerById(customerId).name;
  return `<div class="score-row"><strong>${escapeHtml(name)}</strong><div class="meter"><span style="--value:${Math.max(0,Math.min(100,score.total || 0))}%"></span></div><span>${Math.round(score.total || 0)}%</span><p class="score-feedback">“${escapeHtml(score.feedback || (score.total >= 80 ? 'Beautifully baked!' : 'Thank you—every batch gets better.'))}” · ${score.payment || 0} coins + ${score.tip || 0} tip</p></div>`;
}

function upgradeShop() {
  return `<section style="margin-top:1.5rem"><p class="eyebrow">Spend bakery coins</p><h2 class="section-title">A little help for tomorrow</h2><div class="upgrade-grid">${UPGRADES.filter(u => u.unlockDay <= session.day + 1).map(u => `<article class="upgrade-card"><div><h3>${escapeHtml(u.name)}</h3><p>${escapeHtml(u.description)}</p></div>${profile.upgrades?.[u.id] ? '<span class="pill">Owned</span>' : `<button class="btn small secondary" data-upgrade="${u.id}" ${profile.coins < u.cost ? 'disabled' : ''}>${u.cost} coins</button>`}</article>`).join('')}</div></section>`;
}

function scrapbookModal() {
  const discovered = Array.isArray(profile.scrapbook) ? profile.scrapbook : [];
  return `<div class="modal-backdrop"><section class="modal" role="dialog" aria-modal="true" aria-labelledby="scrap-title"><div class="modal-body"><p class="eyebrow">Saved on this device</p><h2 id="scrap-title">Grandma’s baking scrapbook</h2><p>Recipes, personal bests, and game stamps live in this browser. They are keepsakes from play, not purchase rewards.</p><div class="scrapbook-grid">${Object.values(RECIPES).map(recipe => { const entries = discovered.filter(item => item.family === recipe.id); const open = recipe.unlockDay <= (profile.unlockedDay || 1) || entries.length; const best = entries.length ? Math.max(...entries.map(item => item.score || 0)) : 0; return `<div class="scrap-card">${pastry({family:recipe.id, flavor:'vanilla'}, open ? 'golden' : 'raw')}<strong>${open ? escapeHtml(recipe.name) : 'Recipe tucked away'}</strong><p class="muted">${open ? escapeHtml(recipe.description) : `Unlocks in Story Day ${recipe.unlockDay}`}</p><span class="pill">Best ${best || '—'}${best ? '%' : ''}</span></div>`; }).join('')}</div><div class="button-row"><button class="btn" data-action="close-scrapbook">Close scrapbook</button></div></div></section></div>`;
}

function shareFallbackModal() {
  return `<div class="modal-backdrop"><section class="modal" role="dialog" aria-modal="true" aria-labelledby="share-title"><div class="modal-body"><p class="eyebrow">Share the bakery</p><h2 id="share-title">Copy this game link</h2><p>Select the link below and copy it wherever you like.</p><input value="${escapeHtml(shareFallbackUrl)}" readonly aria-label="Game link" style="width:100%;min-height:48px;padding:.7rem;border:2px solid var(--line);border-radius:12px"><div class="button-row" style="margin-top:1rem"><button class="btn" data-action="close-share">Done</button></div></div></section></div>`;
}

function doAction(type, payload = {}) {
  if (!session) return;
  const result = dispatch(session, profile, { type, ...payload });
  if (!result?.ok && result?.message) showToast(result.message);
  else if (type === 'serve' && result?.score) showToast(`${result.message} · ${result.score.payment} coins + ${result.score.tip} tip`);
  else if (result?.message) announce(result.message);
  if (type === 'add-ingredient') sound('mix');
  if (type === 'fill-drink') sound('pour');
  if (type === 'remove-bake') sound('ding');
  if (type === 'serve') { sound('payment'); rewards(); }
  saveGame(profile, session);
  render();
}

function render() {
  if (heldTimer) { clearInterval(heldTimer); heldTimer = 0; }
  threeStage?.destroy?.(); threeStage = null;
  if (screen === 'welcome') renderWelcome(); else renderGame();
}

function refreshLiveIndicators() {
  for (const order of activeOrders()) {
    const customer = customerById(order.customerId);
    const patience = Math.max(0, 1 - order.elapsed / ((customer.patience || 180) * (profile.settings.relaxed ? 1.7 : 1)));
    const waitBar = document.querySelector(`[data-select-order="${CSS.escape(order.id)}"] .wait-meter span`);
    if (waitBar) waitBar.style.width = pct(patience);
  }
  const order = selectedOrder();
  if (station === 'oven' && order?.stage === 'baking') {
    const window = getBakeWindow(order, profile);
    const max = Math.max(window.goldenEnd + 7, 25);
    const needle = document.querySelector('.bake-band span');
    const clock = document.querySelector('.timer-display');
    if (needle) needle.style.setProperty('--bake', pct(Math.min(1, order.bakeTime / max)));
    if (clock) clock.textContent = `${Math.round(order.bakeTime)}s`;
  }
}

function bindHoldControls() {
  const bind = (id, action, amount, soundName) => {
    const el = document.querySelector(id);
    if (!el) return;
    let active = false;
    const expectedStage = action === 'mix' ? 'mixing' : null;
    const step = () => {
      const result = dispatch(session, profile, { type: action, amount });
      if (soundName) sound(soundName);
      saveGame(profile, session);
      const order = selectedOrder();
      if (action === 'mix') {
        threeStage?.react('mix');
        el.style.setProperty('--hold', pct(order?.mixProgress || 0));
        el.querySelector('span').textContent = `${Math.round((order?.mixProgress || 0) * 100)}% mixed`;
        document.querySelector('.bowl-wrap')?.classList.add('mixing');
      } else {
        threeStage?.updateDrink(order?.drinkPrep?.fill || 0);
        el.style.setProperty('--hold', pct((order?.drinkPrep?.fill || 0) / DRINK_FILL_TARGET));
        el.querySelector('span').textContent = `Hold to pour · ${Math.round((order?.drinkPrep?.fill || 0) * 100)}%`;
        const cupSvg = document.querySelector('.cup-stage svg');
        if (cupSvg && order) cupSvg.outerHTML = cup(order.drinkPrep);
      }
      if (!result?.ok || (expectedStage && order?.stage !== expectedStage)) { stop(); render(); }
    };
    const stop = () => { if (!active) return; active = false; clearInterval(heldTimer); heldTimer = 0; saveGame(profile, session); render(); };
    const start = event => { if (active) return; event.preventDefault(); active = true; step(); if (active) heldTimer = setInterval(step, 180); window.addEventListener('pointerup', stop, { once: true }); window.addEventListener('pointercancel', stop, { once: true }); };
    el.addEventListener('pointerdown', start);
    el.addEventListener('click', event => { if (event.detail === 0) { event.preventDefault(); step(); } });
    el.addEventListener('keydown', e => { if ((e.key === 'Enter' || e.key === ' ') && !e.repeat) { e.preventDefault(); step(); } });
  };
  bind('#mix-hold', 'mix', profile.upgrades?.['faster-mixing'] ? .2 : .14, 'mix');
  bind('#drink-hold', 'fill-drink', profile.upgrades?.['faster-drinks'] ? .16 : .11, 'pour');
}

function bindDecorCanvas() {
  const canvas = document.querySelector('#decor-canvas');
  if (!canvas) return;
  let drawing = false;
  const draw = e => {
    if (!drawing && e.type !== 'click') return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    dispatch(session, profile, { type: 'decorate', amount: .08, x, y });
    const mark = document.createElement('i');
    mark.className = 'frosting-mark'; mark.style.left = `${x*100}%`; mark.style.top = `${y*100}%`;
    canvas.append(mark);
  };
  canvas.addEventListener('pointerdown', e => { drawing = true; canvas.setPointerCapture(e.pointerId); draw(e); });
  canvas.addEventListener('pointermove', draw);
  canvas.addEventListener('pointerup', () => { drawing = false; saveGame(profile, session); render(); });
  canvas.addEventListener('click', draw);
}

function sound(name) {
  if (!profile.settings?.sound) return;
  try {
    audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
    const ctx = audioContext, osc = ctx.createOscillator(), gain = ctx.createGain();
    const notes = { bell: 640, mix: 180, pour: 260, ding: 880, payment: 720, milestone: 1040 };
    osc.type = name === 'mix' ? 'triangle' : 'sine'; osc.frequency.setValueAtTime(notes[name] || 440, ctx.currentTime);
    if (name === 'ding' || name === 'milestone') osc.frequency.exponentialRampToValueAtTime((notes[name] || 440) * 1.4, ctx.currentTime + .18);
    gain.gain.setValueAtTime(.045, ctx.currentTime); gain.gain.exponentialRampToValueAtTime(.001, ctx.currentTime + .28);
    osc.connect(gain).connect(ctx.destination); osc.start(); osc.stop(ctx.currentTime + .3);
  } catch { /* Sound is optional. */ }
}

function showToast(message) {
  document.querySelector('.toast')?.remove();
  const node = document.createElement('div'); node.className = 'toast'; node.textContent = message; document.body.append(node);
  clearTimeout(toastTimer); toastTimer = setTimeout(() => node.remove(), 2400); announce(message);
}

function rewards() {
  const layer = document.createElement('div'); layer.className = 'reward-layer';
  layer.innerHTML = Array.from({length: profile.settings?.reducedMotion ? 2 : 7}, (_, i) => `<i class="float-reward" style="--x:${42 + i*3}%">${i%2 ? '♥' : '★'}</i>`).join('');
  document.body.append(layer); setTimeout(() => layer.remove(), 1600);
}

function celebration() {
  sound('milestone');
  if (profile.settings?.reducedMotion) return;
  const layer = document.createElement('div'); layer.className = 'reward-layer';
  layer.innerHTML = Array.from({length: 26}, (_, i) => `<i class="confetti" style="--x:${(i*37)%100}%;--drift:${(i%2?1:-1)*(20+i*3)}px;--color:${['#bd4b40','#e0a33a','#74886a','#a9d3d0'][i%4]};animation-delay:${(i%7)*.07}s"></i>`).join('');
  document.body.append(layer); setTimeout(() => layer.remove(), 2200);
}

async function shareGame() {
  const url = safeBusinessUrl(BUSINESS.gameUrl) || location.href;
  const data = { title: BUSINESS.name, text: `I helped Grandma bake a neighborhood favorite at ${BUSINESS.name}!`, url };
  try {
    if (navigator.share) await navigator.share(data);
    else { await navigator.clipboard.writeText(`${data.text} ${url}`); showToast('Game link copied!'); }
    trackEvent('share', { mode: session?.mode || 'welcome' });
  } catch (error) { if (error?.name !== 'AbortError') { shareFallbackUrl = url; render(); } }
}

app.addEventListener('click', event => {
  const target = event.target.closest('button, a');
  if (!target) return;
  if (target.dataset.track) trackEvent(target.dataset.track, { location: screen });
  if (target.dataset.start) return startGame(target.dataset.start);
  if (target.dataset.station) { station = target.dataset.station; render(); return; }
  if (target.dataset.selectOrder) { doAction('select-order', { orderId: target.dataset.selectOrder }); ticketDrawerOpen = false; return; }
  if (target.dataset.ingredient) return doAction('add-ingredient', { ingredient: target.dataset.ingredient });
  if (target.dataset.portion !== undefined) return doAction('portion', { index: Number(target.dataset.portion) });
  if (target.dataset.frosting) return doAction('frosting', { flavor: target.dataset.frosting });
  if (target.dataset.topping) return doAction('topping', { topping: target.dataset.topping });
  if (target.dataset.drink) return doAction('select-drink', { drinkType: target.dataset.drink, variety: target.dataset.variety });
  if (target.dataset.drinkExtra) return doAction('drink-extra', { extra: target.dataset.drinkExtra });
  if (target.dataset.package) return doAction('package', { packaging: target.dataset.package });
  if (target.dataset.remake) return doAction('remake', { item: target.dataset.remake });
  if (target.dataset.upgrade) return doAction('upgrade', { upgradeId: target.dataset.upgrade });
  if (target.dataset.game) return doAction(target.dataset.game);
  const action = target.dataset.action;
  if (action === 'pause') { dispatch(session, profile, {type:'pause'}); settingsOpen = true; render(); }
  if (action === 'resume') { settingsOpen = false; dispatch(session, profile, {type:'resume'}); lastTick = performance.now(); render(); }
  if (action === 'home') { settingsOpen = false; saveGame(profile, session); screen = 'welcome'; render(); }
  if (action === 'sound') { profile.settings.sound = !profile.settings.sound; saveGame(profile, session); render(); }
  if (action === 'tickets') { ticketDrawerOpen = !ticketDrawerOpen; render(); }
  if (action === 'close-tickets') { ticketDrawerOpen = false; render(); }
  if (action === 'tutorial-next') { tutorialStep++; if (tutorialStep >= TUTORIAL.length) { tutorialStep = -1; profile.tutorialSeen = true; saveGame(profile, session); } render(); }
  if (action === 'skip-tutorial') { tutorialStep = -1; profile.tutorialSeen = true; saveGame(profile, session); render(); }
  if (action === 'scrapbook') { scrapbookOpen = true; render(); }
  if (action === 'close-scrapbook') { scrapbookOpen = false; render(); }
  if (action === 'share') shareGame();
  if (action === 'close-share') { shareFallbackUrl = ''; render(); }
  if (action === 'next-day') { session = nextDay(session, profile); station = 'counter'; saveGame(profile, session); render(); }
  if (action === 'play-again') { screen = 'welcome'; session = null; render(); }
});

app.addEventListener('change', event => {
  const input = event.target.closest('[data-setting]');
  if (!input || !session) return;
  const update = { [input.dataset.setting]: input.checked };
  dispatch(session, profile, { type: 'settings', settings: update });
  if (input.dataset.setting === 'reducedMotion') document.documentElement.classList.toggle('reduce-motion', input.checked);
  saveGame(profile, session);
});

document.addEventListener('visibilitychange', () => {
  if (!session || session.phase !== 'playing') return;
  if (document.hidden) dispatch(session, profile, { type: 'pause' });
  else if (!settingsOpen) { dispatch(session, profile, { type: 'resume' }); lastTick = performance.now(); }
  saveGame(profile, session);
});

window.addEventListener('keydown', event => {
  if (event.key === 'Escape' && session && screen === 'game') {
    settingsOpen = !settingsOpen;
    dispatch(session, profile, { type: settingsOpen ? 'pause' : 'resume' });
    render();
  }
  const number = Number(event.key);
  if (screen === 'game' && number >= 1 && number <= 5 && !settingsOpen) {
    station = ['counter','mixing','oven','decorating','drinks'][number - 1]; render();
  }
});

setInterval(() => {
  if (!session || screen !== 'game' || session.phase !== 'playing' || session.paused || tutorialStep >= 0) { lastTick = performance.now(); return; }
  const now = performance.now(); const delta = Math.min(1, (now - lastTick) / 1000); lastTick = now;
  const beforePhase = session.phase;
  const beforeShape = `${session.queue?.length || 0}:${session.orders?.length || 0}`;
  const beforeAlerts = activeOrders().filter(o => o.stage === 'baking' && o.bakeTime >= getBakeWindow(o, profile).goldenStart).length;
  const beforeBakeStates = activeOrders().filter(o => o.stage === 'baking').map(o => `${o.id}:${o.bakeState}`).join('|');
  tick(session, profile, delta);
  const afterAlerts = activeOrders().filter(o => o.stage === 'baking' && o.bakeTime >= getBakeWindow(o, profile).goldenStart).length;
  const afterBakeStates = activeOrders().filter(o => o.stage === 'baking').map(o => `${o.id}:${o.bakeState}`).join('|');
  if (afterAlerts > beforeAlerts) sound('ding');
  saveGame(profile, session);
  const afterShape = `${session.queue?.length || 0}:${session.orders?.length || 0}`;
  if (beforePhase !== session.phase || beforeShape !== afterShape || beforeAlerts !== afterAlerts || beforeBakeStates !== afterBakeStates) render();
  else refreshLiveIndicators();
}, 1000);

render();
