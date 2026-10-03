import { RECIPES, CUSTOMERS, DRINKS, INGREDIENTS, UPGRADES, DAY_TITLES } from './data.js';

export const DRINK_FILL_TARGET = 0.8;
export const SAVE_KEY = 'grandmas-bakeria-v1';
const clamp = (n, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, n));
const money = n => Math.round(n * 100) / 100;
const clone = value => JSON.parse(JSON.stringify(value));
const customerFor = order => CUSTOMERS.find(customer => customer.id === order.customerId);
const emptyDecoration = () => ({ frosting: null, toppings: [], coverage: 0, sprinkles: 0, points: [] });
const emptyDrink = () => ({ cup: false, type: null, variety: null, fill: 0, extras: [], lid: false, finished: false });
let serial = 0;

export function createProfile() {
  return {
    version: 1, coins: 30,
    settings: { sound: false, relaxed: false, reducedMotion: false },
    upgrades: {}, successfulVisits: {}, regulars: [], milestones: [],
    advertising: { runsCancelled: 0, savings: 0, timeSaved: 0 },
    finance: { sales: 0, tips: 0, ingredientCosts: 0, upgradeCosts: 0, profit: 0 },
    bestScores: { quick: 0, story: 0, daily: 0 }, scrapbook: [], unlockedDay: 1,
    unlockedRecipes: ['cookie'], wordOfMouth: 0, completedSessions: 0,
    dailyCompletions: {}, totalServed: 0, tutorialSeen: false,
  };
}

function orderSpec(customerId, family, flavor, topping, drinkType, extras = [], takeaway = false, quantity = 1, frosting = null, variety = null) {
  return { customerId, family, flavor, topping, frosting, quantity, takeaway,
    drink: { type: drinkType, variety: variety || (drinkType === 'tea' ? 'breakfast' : drinkType === 'coffee' ? 'house' : 'classic'), extras, takeaway } };
}

function schedule(mode, day, profile) {
  if (mode === 'quick') return [
    orderSpec('maple', 'cookie', 'plain', 'chocolate-chips', 'tea'),
    orderSpec('theo', 'muffin', 'vanilla', 'blueberries', 'coffee', ['milk'], true),
    orderSpec('maya', 'cupcake', 'vanilla', 'sprinkles', 'hot-chocolate', ['marshmallows'], true, 1, 'strawberry'),
  ];
  const varied = Boolean(profile.upgrades['recipe-variations']);
  const days = {
    1: [
      orderSpec('maple', 'cookie', 'plain', 'chocolate-chips', 'tea'),
      orderSpec('theo', 'cookie', 'plain', 'chocolate-chips', 'coffee', [], true),
      orderSpec('ruby', 'cookie', 'plain', 'chocolate-chips', 'tea'),
    ],
    2: [
      orderSpec('maple', 'cookie', 'plain', varied ? 'raisins' : 'chocolate-chips', 'tea', ['honey']),
      orderSpec('theo', 'muffin', 'vanilla', 'blueberries', 'coffee', ['milk'], true),
      orderSpec('ruby', 'muffin', varied ? 'chocolate' : 'vanilla', 'chocolate-chips', 'tea', [], false, 1, null, 'chamomile'),
    ],
    3: [
      orderSpec('maya', 'cupcake', 'vanilla', 'sprinkles', 'hot-chocolate', ['marshmallows'], true, 1, 'strawberry'),
      orderSpec('sam', 'cupcake', 'chocolate', null, 'coffee', ['milk', 'sugar'], false, 1, 'vanilla'),
      orderSpec('june', 'cupcake', 'vanilla', 'sprinkles', 'tea', ['honey'], true, 1, 'chocolate', 'chamomile'),
    ],
    4: [
      orderSpec('maya', 'cupcake', 'vanilla', 'sprinkles', 'hot-chocolate', ['marshmallows'], true, 1, 'strawberry'),
      orderSpec('sam', 'cookie', 'chocolate', 'raisins', 'coffee', ['milk', 'sugar'], true, 2),
      orderSpec('june', 'muffin', 'vanilla', 'blueberries', 'tea', ['honey'], true, 2, null, 'chamomile'),
      orderSpec('maple', 'cookie', 'plain', 'raisins', 'tea', ['honey']),
    ],
    5: [
      orderSpec('maple', 'cookie', 'plain', 'raisins', 'tea', ['honey']),
      orderSpec('maya', 'cupcake', 'vanilla', 'sprinkles', 'hot-chocolate', ['marshmallows'], true, 1, 'strawberry'),
      orderSpec('theo', 'muffin', 'chocolate', 'chocolate-chips', 'coffee', ['milk'], true),
      orderSpec('ruby', 'cupcake', 'chocolate', 'sprinkles', 'hot-chocolate', ['cream'], false, 1, 'chocolate'),
      orderSpec('sam', 'muffin', 'vanilla', 'blueberries', 'coffee', ['milk', 'sugar'], true),
      orderSpec('june', 'cupcake', 'vanilla', 'sprinkles', 'tea', ['honey'], true, 2, 'vanilla', 'chamomile'),
    ],
  };
  const orders = days[day];
  // Recommendations have a concrete effect: a strong first day brings Maya in
  // one day early. Her scheduled day-three visit remains, giving a fair return.
  if (day === 2 && profile.wordOfMouth >= 35 && !(profile.successfulVisits.maya > 0)) {
    orders.push({ ...orderSpec('maya', 'muffin', 'vanilla', 'chocolate-chips', 'hot-chocolate', [], true), referred: true });
  }
  return orders;
}

function makeOrder(spec, id, profile) {
  const recipe = RECIPES[spec.family];
  const requiredIngredients = [...recipe.ingredients];
  if (spec.flavor === 'chocolate') requiredIngredients.push('cocoa');
  if (spec.topping && spec.family !== 'cupcake') requiredIngredients.push(spec.topping);
  return {
    ...clone(spec), id, stage: 'ingredients', requiredIngredients, ingredients: [],
    mixProgress: 0, portions: 0, portionPositions: [], bakeTime: 0, bakeQuality: 0,
    bakeState: 'raw', goldenNotified: false, overbakedNotified: false,
    decoration: emptyDecoration(), drinkPrep: emptyDrink(), packaging: null,
    elapsed: 0, score: null, taken: false, ingredientCharged: false, remakes: 0,
    returning: (profile.successfulVisits[spec.customerId] || 0) > 0,
    greeting: spec.referred ? 'Ruby told me about your lovely bakery. I had to stop by!' : customerFor(spec).dialogue[(profile.successfulVisits[spec.customerId] || 0) > 0 ? 'returning' : 'greeting'],
  };
}

export function createSession(mode = 'quick', profile = createProfile(), day = 1) {
  mode = mode === 'story' ? 'story' : 'quick';
  day = mode === 'story' ? Math.round(clamp(Number(day) || 1, 1, 5)) : 1;
  const id = `${Date.now().toString(36)}-${++serial}`;
  const session = {
    id, mode, day, title: mode === 'quick' ? 'A little taste of the Bakeria' : DAY_TITLES[day - 1],
    phase: 'playing', time: 0, paused: false, capacity: mode === 'quick' ? 1 : day < 2 ? 1 : day < 4 ? 2 : 3,
    ovenSlots: profile.upgrades['second-oven'] ? 2 : 1,
    queue: schedule(mode, day, profile).map((spec, i) => makeOrder(spec, `${id}-${i + 1}`, profile)),
    orders: [], selectedOrderId: null, results: [], events: [], lastMessage: '',
    dayStats: { customersServed: 0, satisfaction: 0, sales: 0, tips: 0, ingredientCosts: 0, costs: 0, profit: 0, newRegulars: 0, advertisingSavings: 0, timeSaved: 0, milestones: [] },
    startRegulars: profile.regulars.length, dailyRecipe: dailyChallenge(), completedRecorded: false,
  };
  for (const recipe of Object.values(RECIPES)) {
    if ((mode === 'quick' || recipe.unlockDay <= day) && !profile.unlockedRecipes.includes(recipe.id)) profile.unlockedRecipes.push(recipe.id);
  }
  if (mode === 'story') profile.unlockedDay = Math.max(profile.unlockedDay, day);
  return session;
}

export function getRecipe(order) {
  const recipe = RECIPES[order.family];
  return { ...recipe, requiredIngredients: [...order.requiredIngredients], mixSeconds: 3, bakeSeconds: recipe.bake.goldenStart, quantity: order.quantity };
}

export function getBakeWindow(order, profile) {
  const recipe = RECIPES[order.family];
  return { goldenStart: recipe.bake.goldenStart, goldenEnd: recipe.bake.goldenEnd + (profile.upgrades['clear-timer'] ? 6 : 0) + (profile.settings.relaxed ? 18 : 0) };
}

function emit(session, type, message, extra = {}) {
  const event = { id: `${session.id}-event-${++serial}`, type, message, at: session.time, ...extra };
  session.events.push(event);
  if (session.events.length > 24) session.events.shift();
  session.lastMessage = message;
  return event;
}

function expense(session, profile, amount) {
  // Grandma covers any shortfall. The player can always finish a shift.
  const charged = Math.min(profile.coins, amount);
  profile.coins = money(profile.coins - charged);
  profile.finance.ingredientCosts = money(profile.finance.ingredientCosts + charged);
  profile.finance.profit = money(profile.finance.sales + profile.finance.tips - profile.finance.ingredientCosts - profile.finance.upgradeCosts);
  session.dayStats.ingredientCosts = money(session.dayStats.ingredientCosts + charged);
  session.dayStats.costs = session.dayStats.ingredientCosts;
  session.dayStats.profit = money(session.dayStats.sales + session.dayStats.tips - session.dayStats.costs);
}

function ingredientMatch(actual, expected) {
  const all = new Set([...actual, ...expected]);
  if (!all.size) return 1;
  return [...all].filter(item => actual.includes(item) && expected.includes(item)).length / all.size;
}

function bakingQuality(order, profile) {
  const { goldenStart, goldenEnd } = getBakeWindow(order, profile);
  if (order.bakeTime < goldenStart) return clamp(order.bakeTime / goldenStart * 0.8, 0.05, 0.8);
  if (order.bakeTime <= goldenEnd) return 1;
  return clamp(1 - (order.bakeTime - goldenEnd) / 24, 0.15, 1);
}

export function scoreOrder(order, session, profile) {
  const requestedDrink = Boolean(order.drink?.type);
  const accuracyParts = [ingredientMatch(order.ingredients, order.requiredIngredients)];
  if (order.family === 'cupcake') {
    accuracyParts.push(order.decoration.frosting === order.frosting ? 1 : 0);
    accuracyParts.push(ingredientMatch(order.decoration.toppings, order.topping ? [order.topping] : []));
  }
  if (requestedDrink) {
    accuracyParts.push(order.drinkPrep.type === order.drink.type && order.drinkPrep.variety === order.drink.variety ? 1 : 0);
    accuracyParts.push(ingredientMatch(order.drinkPrep.extras, order.drink.extras));
  }
  const accuracy = accuracyParts.reduce((a, b) => a + b, 0) / accuracyParts.length;
  const baking = order.bakeQuality;
  const presentationParts = [order.packaging === (order.takeaway ? 'box' : 'tray') ? 1 : 0];
  if (order.family === 'cupcake') presentationParts.push(clamp(order.decoration.coverage / 0.75));
  if (requestedDrink) {
    presentationParts.push(clamp(1 - Math.abs(order.drinkPrep.fill - DRINK_FILL_TARGET) / 0.5));
    presentationParts.push(order.drinkPrep.lid === order.takeaway ? 1 : 0);
  }
  const presentation = presentationParts.reduce((a, b) => a + b, 0) / presentationParts.length;
  const patience = customerFor(order).patience + (profile.upgrades['pretty-display'] ? 70 : 0);
  const waiting = profile.settings.relaxed ? 1 : clamp(1 - Math.max(0, order.elapsed - patience * 0.65) / (patience * 2), 0.35, 1);
  const total = Math.round((accuracy * 0.4 + baking * 0.25 + presentation * 0.2 + waiting * 0.15) * 100);
  const payment = money(RECIPES[order.family].price * order.quantity + (DRINKS.find(drink => drink.id === order.drink?.type)?.price || 0));
  const tip = total >= 90 ? 3 : total >= 80 ? 2 : total >= 65 ? 1 : 0;
  let feedback = customerFor(order).dialogue[total >= 80 ? 'happy' : 'gentle'];
  const missingExtra = order.drink?.extras.find(extra => !order.drinkPrep.extras.includes(extra));
  if (missingExtra) feedback = `A lovely treat! Next time, remember the ${missingExtra}.`;
  else if (baking < 0.8) feedback = order.bakeTime < getBakeWindow(order, profile).goldenStart ? 'A little more time in the oven next time. You’re getting there!' : 'A touch less oven time next time. Thank you for the care!';
  else if (order.family === 'cupcake' && order.decoration.frosting !== order.frosting) feedback = `A sweet little treat! I was hoping for ${order.frosting} frosting.`;
  else if (requestedDrink && Math.abs(order.drinkPrep.fill - DRINK_FILL_TARGET) > 0.15) feedback = 'Beautifully baked! The little fill line will help with the drink.';
  return { total, accuracy: Math.round(accuracy * 100), baking: Math.round(baking * 100), presentation: Math.round(presentation * 100), waiting: Math.round(waiting * 100), feedback, payment, tip };
}

function recordService(order, session, profile) {
  const score = scoreOrder(order, session, profile);
  order.score = score;
  order.stage = 'served';
  profile.coins = money(profile.coins + score.payment + score.tip);
  profile.finance.sales = money(profile.finance.sales + score.payment);
  profile.finance.tips = money(profile.finance.tips + score.tip);
  profile.finance.profit = money(profile.finance.sales + profile.finance.tips - profile.finance.ingredientCosts - profile.finance.upgradeCosts);
  profile.totalServed++;
  session.dayStats.customersServed++;
  session.dayStats.sales = money(session.dayStats.sales + score.payment);
  session.dayStats.tips = money(session.dayStats.tips + score.tip);
  session.dayStats.profit = money(session.dayStats.sales + session.dayStats.tips - session.dayStats.costs);
  let newRegular = false;
  if (score.total >= 80) {
    profile.successfulVisits[order.customerId] = (profile.successfulVisits[order.customerId] || 0) + 1;
    if (profile.successfulVisits[order.customerId] >= 2 && !profile.regulars.includes(order.customerId)) {
      profile.regulars.push(order.customerId);
      session.dayStats.newRegulars++;
      newRegular = true;
      emit(session, 'regular', `${customerFor(order).name} is now a regular!`, { customerId: order.customerId });
    }
    profile.wordOfMouth = clamp(profile.wordOfMouth + (score.total >= 90 ? 14 : 8), 0, 100);
  }
  for (let milestone = 1; milestone <= Math.min(3, Math.floor(profile.regulars.length / 2)); milestone++) {
    if (!profile.milestones.includes(milestone)) {
      profile.milestones.push(milestone);
      profile.advertising.runsCancelled++;
      profile.advertising.savings += 10;
      profile.advertising.timeSaved += 20;
      session.dayStats.advertisingSavings += 10;
      session.dayStats.timeSaved += 20;
      session.dayStats.milestones.push(milestone);
      emit(session, 'milestone', 'Two new regulars! Grandma saved 10 coins and 20 minutes of advertising.', { milestone });
    }
  }
  const recipeId = `${order.family}-${order.flavor}-${order.frosting || ''}-${order.topping || ''}`;
  const scrapbook = profile.scrapbook.find(item => item.id === recipeId);
  if (!scrapbook) profile.scrapbook.push({ id: recipeId, family: order.family, flavor: order.flavor, frosting: order.frosting, topping: order.topping, title: `${titleCase(order.flavor)} ${RECIPES[order.family].singular}`, score: score.total, date: localDate(), virtual: true });
  else scrapbook.score = Math.max(scrapbook.score, score.total);
  if (order.family === session.dailyRecipe.family && order.flavor === session.dailyRecipe.flavor && score.total >= 80) {
    profile.dailyCompletions[session.dailyRecipe.date] = Math.max(profile.dailyCompletions[session.dailyRecipe.date] || 0, score.total);
    profile.bestScores.daily = Math.max(profile.bestScores.daily, score.total);
  }
  const result = { orderId: order.id, customerId: order.customerId, family: order.family, flavor: order.flavor, frosting: order.frosting, topping: order.topping, quantity: order.quantity, total: score.total, score, payment: score.payment, tip: score.tip, newRegular };
  session.results.push(result);
  session.dayStats.satisfaction = Math.round(session.results.reduce((sum, result) => sum + result.total, 0) / session.results.length);
  emit(session, 'served', score.feedback, { orderId: order.id, score: score.total, payment: score.payment, tip: score.tip });
  const active = session.orders.filter(item => item.stage !== 'served');
  session.selectedOrderId = active[0]?.id || null;
  if (!session.queue.length && !active.length) {
    session.phase = session.mode === 'quick' || session.day === 5 ? 'complete' : 'day-results';
    profile.bestScores[session.mode] = Math.max(profile.bestScores[session.mode] || 0, session.dayStats.satisfaction);
    if (session.phase === 'complete' && !session.completedRecorded) {
      profile.completedSessions++;
      session.completedRecorded = true;
    }
    if (session.mode === 'story') profile.unlockedDay = Math.max(profile.unlockedDay, Math.min(5, session.day + 1));
    emit(session, 'day-complete', session.mode === 'story' && session.day === 5 ? profile.regulars.length >= 6 ? 'The neighborhood tea party is a success. Grandma has time for her own cup of tea.' : 'The neighborhood tea party brought everyone together. Keep baking to bring more friends back.' : 'The last happy customer is on their way. Time for a little rest.');
  }
  return score;
}

export function dispatch(session, profile, action) {
  if (!session || !profile || !action?.type) return { ok: false, message: 'There is no active bakery session.' };
  const fail = message => { session.lastMessage = message; return { ok: false, message }; };
  const success = (message, type = action.type, extra = {}) => ({ ok: true, message, event: emit(session, type, message, extra) });
  if (action.type === 'pause') { session.paused = true; return success('Take a breath. Everything is paused.'); }
  if (action.type === 'resume') { session.paused = false; return success('Welcome back to the bakery.'); }
  if (action.type === 'settings') {
    for (const name of ['sound', 'relaxed', 'reducedMotion']) if (typeof action.settings?.[name] === 'boolean') profile.settings[name] = action.settings[name];
    return success('Your preferences are saved.');
  }
  if (action.type === 'upgrade') {
    const upgrade = UPGRADES.find(item => item.id === action.upgradeId);
    if (!upgrade) return fail('That upgrade is not in Grandma’s catalog.');
    if (profile.upgrades[upgrade.id]) return fail('You already have this upgrade.');
    if (profile.unlockedDay < upgrade.unlockDay) return fail(`This upgrade unlocks on day ${upgrade.unlockDay}.`);
    if (profile.coins < upgrade.cost) return fail('A few more bakery coins will cover this upgrade.');
    profile.coins = money(profile.coins - upgrade.cost);
    profile.upgrades[upgrade.id] = true;
    profile.finance.upgradeCosts = money(profile.finance.upgradeCosts + upgrade.cost);
    profile.finance.profit = money(profile.finance.sales + profile.finance.tips - profile.finance.ingredientCosts - profile.finance.upgradeCosts);
    session.ovenSlots = profile.upgrades['second-oven'] ? 2 : 1;
    return success(`${upgrade.name} is ready for the next batch!`, 'upgrade', { upgradeId: upgrade.id });
  }
  if (session.paused) return fail('The bakery is paused. Resume to keep baking.');
  if (session.phase !== 'playing') return fail('This shift is finished. Start the next day or play again.');
  if (action.type === 'take-order') {
    const active = session.orders.filter(order => order.stage !== 'served');
    if (active.length >= session.capacity) return fail(`You have room for ${session.capacity} active ${session.capacity === 1 ? 'ticket' : 'tickets'}.`);
    const index = action.customerId ? session.queue.findIndex(order => order.customerId === action.customerId) : 0;
    if (index < 0 || !session.queue[index]) return fail('Everyone’s order has been taken.');
    const [order] = session.queue.splice(index, 1);
    order.taken = true;
    session.orders.push(order);
    session.selectedOrderId = order.id;
    return success(`${customerFor(order).name}: “${order.greeting}”`, 'order-taken', { orderId: order.id });
  }
  const order = session.orders.find(item => item.id === (action.orderId || session.selectedOrderId));
  if (!order) return fail('Take or select an order ticket first.');
  if (order.stage === 'served') return fail('That customer has already received their order.');
  if (action.type === 'select-order') { session.selectedOrderId = order.id; return success(`${customerFor(order).name}’s ticket selected.`); }
  const amount = fallback => typeof action.amount === 'number' && Number.isFinite(action.amount) ? clamp(action.amount, 0, 1) : fallback;
  const invalidatePackage = () => { order.packaging = null; };
  switch (action.type) {
    case 'add-ingredient': {
      if (!['ingredients', 'mixing'].includes(order.stage) || order.mixProgress > 0) return fail('Remake this bowl to change its ingredients.');
      if (!INGREDIENTS.some(ingredient => ingredient.id === action.ingredient)) return fail('Choose an ingredient from the shelf.');
      if (order.ingredients.includes(action.ingredient)) return fail('That ingredient is already in the bowl.');
      if (!order.ingredientCharged) {
        expense(session, profile, RECIPES[order.family].cost * order.quantity);
        order.ingredientCharged = true;
      }
      order.ingredients.push(action.ingredient);
      if (order.requiredIngredients.every(item => order.ingredients.includes(item))) order.stage = 'mixing';
      return success(`${titleCase(action.ingredient)} added to ${customerFor(order).name}’s bowl.`, 'ingredient', { orderId: order.id, ingredient: action.ingredient });
    }
    case 'mix':
      if (order.stage !== 'mixing') return fail('Add all of the recipe ingredients before mixing.');
      order.mixProgress = clamp(order.mixProgress + amount(0.1) * (profile.upgrades['faster-mixing'] ? 1.4 : 1));
      if (order.mixProgress >= 1) order.stage = 'portioning';
      return success(order.mixProgress >= 1 ? 'Smooth and ready! Portion onto the tray.' : 'A gentle stir, a little love.', 'mix', { orderId: order.id });
    case 'portion': {
      if (order.stage !== 'portioning') return fail('Mix the bowl before portioning the tray.');
      const index = action.index === undefined ? Array.from({ length: order.quantity }, (_, i) => i).find(i => !order.portionPositions.includes(i)) : action.index;
      if (!Number.isInteger(index) || index < 0 || index >= order.quantity || order.portionPositions.includes(index)) return fail('Choose an empty marked place on the tray.');
      order.portionPositions.push(index);
      order.portions = order.portionPositions.length;
      if (order.portions >= order.quantity) order.stage = 'ready-to-bake';
      return success(order.stage === 'ready-to-bake' ? 'Your tray is ready for the oven.' : 'One lovely portion. Fill the other marked place.', 'portion', { orderId: order.id });
    }
    case 'start-bake':
      if (order.stage !== 'ready-to-bake') return fail('Fill the marked tray positions before baking.');
      if (session.orders.filter(item => item.stage === 'baking').length >= session.ovenSlots) return fail('The oven is full. Remove a tray or add a second shelf.');
      order.stage = 'baking'; order.bakeTime = 0; order.bakeState = 'underbaked';
      return success('Into the oven! There’s time to make the drink.', 'bake-start', { orderId: order.id });
    case 'remove-bake':
      if (order.stage !== 'baking') return fail('This tray is not in the oven.');
      order.bakeQuality = bakingQuality(order, profile); order.stage = 'baked';
      return success(order.bakeQuality >= 0.95 ? 'Golden and lovely. Time for the finishing touch!' : 'Tray removed. You can finish it or remake the pastry.', 'bake-remove', { orderId: order.id });
    case 'frosting':
      if (!RECIPES[order.family].frostings.length || !['baked', 'decorating', 'ready'].includes(order.stage)) return fail('Bake a cookie or cupcake before choosing its icing.');
      if (!RECIPES[order.family].frostings.includes(action.flavor)) return fail('Choose an icing from this recipe’s shelf.');
      order.decoration.frosting = action.flavor; order.decoration.coverage = 0; order.decoration.points = []; order.stage = 'decorating'; invalidatePackage();
      return success(`${titleCase(action.flavor)} frosting is in the piping bag.`, 'frosting', { orderId: order.id });
    case 'decorate':
      if (!['baked', 'decorating'].includes(order.stage)) return fail('Bake the pastry before adding finishing touches.');
      if (order.family === 'cupcake' && !order.decoration.frosting) return fail('Choose a frosting before piping.');
      if (order.family === 'cookie' && !order.decoration.frosting) order.decoration.frosting = 'vanilla';
      order.stage = 'decorating'; order.decoration.coverage = clamp(order.decoration.coverage + amount(0.2));
      if (Number.isFinite(action.x) && Number.isFinite(action.y) && order.decoration.points.length < 360) order.decoration.points.push({ x: clamp(action.x), y: clamp(action.y), start: !!action.strokeStart });
      else if (!Number.isFinite(action.x) && !Number.isFinite(action.y) && order.decoration.points.length < 350) {
        const cy = order.family === 'cupcake' ? .27 : .5;
        for (let i = 0; i < 10; i++) { const angle = i / 9 * Math.PI * 2; order.decoration.points.push({x:.5 + Math.cos(angle)*.17,y:cy + Math.sin(angle)*.13,start:i === 0}); }
      }
      return success(order.decoration.coverage >= 0.75 ? 'A beautiful finishing touch!' : 'Follow the little guide with gentle taps or strokes.', 'decorate', { orderId: order.id });
    case 'topping':
      if (order.family !== 'cupcake' || !['baked', 'decorating', 'ready'].includes(order.stage)) return fail('Cookie and muffin mix-ins go into the mixing bowl.');
      if (!RECIPES.cupcake.toppings.includes(action.topping)) return fail('Choose a topping from the recipe shelf.');
      if (!order.decoration.toppings.includes(action.topping)) order.decoration.toppings.push(action.topping);
      order.decoration.sprinkles = Math.min(24, order.decoration.sprinkles + 6); invalidatePackage();
      return success('A cheerful little scatter of sprinkles.', 'sprinkle', { orderId: order.id, x: clamp(action.x ?? 0.5), y: clamp(action.y ?? 0.5) });
    case 'finish-decoration':
      if (!['baked', 'decorating'].includes(order.stage)) return fail('Your pastry needs to come out of the oven first.');
      if (order.family === 'cupcake' && (!order.decoration.frosting || order.decoration.coverage < 0.25)) return fail('Choose a frosting and pipe a little swirl first.');
      order.stage = 'ready';
      return success('Pastry finished and ready to serve.', 'pastry-ready', { orderId: order.id });
    case 'select-cup':
      if (!order.drink) return fail('This ticket does not include a drink.');
      order.drinkPrep.cup = true; invalidatePackage();
      return success(`A clean cup for ${customerFor(order).name}.`, 'cup', { orderId: order.id });
    case 'select-drink': {
      if (!order.drinkPrep.cup) return fail('Choose a cup first.');
      const drink = DRINKS.find(item => item.id === action.drinkType);
      if (!drink) return fail('Choose coffee, tea, or hot chocolate.');
      const variety = action.variety || drink.varieties[0];
      if (!drink.varieties.includes(variety)) return fail('Choose one of the available drink varieties.');
      const cup = order.drinkPrep.cup;
      order.drinkPrep = { ...emptyDrink(), cup, type: drink.id, variety }; invalidatePackage();
      return success(`${drink.name} selected. Fill the cup to the marked line.`, 'drink-select', { orderId: order.id });
    }
    case 'fill-drink':
      if (!order.drinkPrep.type || order.drinkPrep.finished) return fail('Choose a drink before filling a fresh cup.');
      order.drinkPrep.fill = clamp(order.drinkPrep.fill + amount(0.1) * (profile.upgrades['faster-drinks'] ? 1.35 : 1)); invalidatePackage();
      return success(order.drinkPrep.fill >= 0.75 && order.drinkPrep.fill <= 0.85 ? 'Right at the line. Lovely!' : 'Hold to fill, then release at the line.', 'pour', { orderId: order.id });
    case 'drink-extra': {
      const drink = DRINKS.find(item => item.id === order.drinkPrep.type);
      if (!drink || order.drinkPrep.fill <= 0 || order.drinkPrep.finished) return fail('Fill the drink before adding extras.');
      if (!drink.extras.includes(action.extra)) return fail('That extra belongs with a different drink.');
      if (order.drinkPrep.extras.includes(action.extra)) return fail('That extra is already in the cup.');
      order.drinkPrep.extras.push(action.extra); invalidatePackage();
      return success(`${titleCase(action.extra)} added.`, 'drink-extra', { orderId: order.id });
    }
    case 'drink-lid':
      if (order.drinkPrep.fill <= 0 || order.drinkPrep.finished) return fail('Fill the cup before putting on a lid.');
      order.drinkPrep.lid = true; invalidatePackage();
      return success('Lid on. Ready for a little journey.', 'drink-lid', { orderId: order.id });
    case 'finish-drink':
      if (!order.drinkPrep.type || order.drinkPrep.fill < 0.2) return fail('Choose and fill a drink first.');
      order.drinkPrep.finished = true;
      return success('The drink is ready. Bring it together with the pastry.', 'drink-ready', { orderId: order.id });
    case 'package':
      if (order.stage !== 'ready' || (order.drink && !order.drinkPrep.finished)) return fail('Finish both the pastry and drink before packaging.');
      if (!['tray', 'box'].includes(action.packaging)) return fail('Choose a serving tray or takeaway box.');
      order.packaging = action.packaging;
      return success(action.packaging === 'box' ? 'Folded up with care. Ready to hand over.' : 'Together on a lovely tray. Ready to hand over.', 'package', { orderId: order.id });
    case 'serve': {
      if (order.stage !== 'ready' || !order.packaging || (order.drink && !order.drinkPrep.finished)) return fail('Assemble the pastry, drink, and serving container first.');
      if (action.customerId && action.customerId !== order.customerId) return fail('Check the name on this ticket before handing it over.');
      const score = recordService(order, session, profile);
      return { ok: true, message: score.feedback, score };
    }
    case 'remake':
      expense(session, profile, 1); order.remakes++; invalidatePackage();
      if (action.item === 'drink') order.drinkPrep = emptyDrink();
      else {
        Object.assign(order, { stage: 'ingredients', ingredients: [], mixProgress: 0, portions: 0, portionPositions: [], bakeTime: 0, bakeQuality: 0, bakeState: 'raw', goldenNotified: false, overbakedNotified: false, decoration: emptyDecoration() });
      }
      return success('A fresh start for one ingredient coin. Grandma says mistakes are how we learn.', 'remake', { orderId: order.id });
    default: return fail('That action is not available at this station.');
  }
}

export function tick(session, profile, dtSeconds) {
  if (!session || session.paused || session.phase !== 'playing' || !Number.isFinite(dtSeconds) || dtSeconds <= 0) return session;
  session.time += dtSeconds;
  for (const order of session.orders) {
    if (order.stage === 'served') continue;
    order.elapsed += dtSeconds;
    if (order.stage === 'baking') {
      order.bakeTime += dtSeconds;
      const { goldenStart, goldenEnd } = getBakeWindow(order, profile);
      order.bakeState = order.bakeTime < goldenStart ? 'underbaked' : order.bakeTime <= goldenEnd ? 'golden' : 'overbaked';
      if (order.bakeState === 'golden' && !order.goldenNotified) {
        order.goldenNotified = true;
        emit(session, 'oven-golden', `${customerFor(order).name}’s ${RECIPES[order.family].name.toLowerCase()} are golden!`, { orderId: order.id });
      }
      if (order.bakeState === 'overbaked' && !order.overbakedNotified) {
        order.overbakedNotified = true;
        emit(session, 'oven-overbaked', `${customerFor(order).name}’s tray is getting dark. Take it out when you can.`, { orderId: order.id });
      }
    }
  }
  return session;
}

export function nextDay(session, profile) {
  if (session.mode !== 'story' || session.phase !== 'day-results' || session.day >= 5) return session;
  return createSession('story', profile, session.day + 1);
}

function localDate(date = new Date()) {
  const value = date instanceof Date ? date : new Date(date);
  if (!Number.isFinite(value.getTime())) return localDate(new Date());
  return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, '0')}-${String(value.getDate()).padStart(2, '0')}`;
}

function titleCase(value) { return String(value).replaceAll('-', ' ').replace(/^./, letter => letter.toUpperCase()); }

export function dailyChallenge(date = new Date()) {
  const day = localDate(date);
  const index = [...day].reduce((sum, letter) => (sum * 31 + letter.charCodeAt(0)) >>> 0, 0) % 3;
  const options = [
    { family: 'cookie', flavor: 'plain', topping: 'chocolate-chips', title: 'A little cookie kindness', description: 'Serve a plain cookie with at least 80% satisfaction.' },
    { family: 'muffin', flavor: 'vanilla', topping: 'blueberries', title: 'A blueberry morning', description: 'Serve a vanilla muffin with at least 80% satisfaction.' },
    { family: 'cupcake', flavor: 'vanilla', frosting: 'strawberry', topping: 'sprinkles', title: 'A little pink celebration', description: 'Serve a vanilla cupcake with at least 80% satisfaction.' },
  ];
  return { ...options[index], id: `daily-${day}`, date: day, reward: 'A virtual recipe stamp in your baking scrapbook' };
}

export function saveGame(profile, session = null) {
  try {
    if (typeof localStorage === 'undefined') return false;
    localStorage.setItem(SAVE_KEY, JSON.stringify({ version: 1, savedAt: new Date().toISOString(), profile, session }));
    return true;
  } catch { return false; }
}

export function loadGame() {
  try {
    if (typeof localStorage === 'undefined') return null;
    const saved = JSON.parse(localStorage.getItem(SAVE_KEY) || 'null');
    if (!saved || saved.version !== 1 || !saved.profile || saved.profile.version !== 1) return null;
    const defaults = createProfile();
    const profile = { ...defaults, ...saved.profile, settings: { ...defaults.settings, ...saved.profile.settings }, finance: { ...defaults.finance, ...saved.profile.finance }, advertising: { ...defaults.advertising, ...saved.profile.advertising }, bestScores: { ...defaults.bestScores, ...saved.profile.bestScores } };
    if (!Number.isFinite(profile.coins) || !Array.isArray(profile.regulars) || !Array.isArray(profile.scrapbook) || !Array.isArray(profile.milestones)) return null;
    let session = saved.session;
    if (session && (!Array.isArray(session.orders) || !Array.isArray(session.queue) || !['quick', 'story'].includes(session.mode) || !session.dayStats)) session = null;
    if (session) session.paused = true; // Nothing advances while the player is away.
    return { profile, session, savedAt: saved.savedAt };
  } catch { return null; }
}
