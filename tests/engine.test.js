import test from 'node:test';
import assert from 'node:assert/strict';
import { createProfile, createSession, dispatch, tick, getBakeWindow, scoreOrder, nextDay, dailyChallenge, saveGame, loadGame, SAVE_KEY, DRINK_FILL_TARGET } from '../src/engine.js';
import { RECIPES, CUSTOMERS, DRINKS, UPGRADES } from '../src/data.js';

function setup(mode = 'quick', day = 1) {
  const profile = createProfile();
  return { profile, session: createSession(mode, profile, day) };
}

function act(session, profile, type, payload = {}) {
  const result = dispatch(session, profile, { type, ...payload });
  assert.equal(result.ok, true, `${type}: ${result.message}`);
  return result;
}

function take(session, profile, customerId) {
  act(session, profile, 'take-order', { customerId });
  return session.orders.find(order => order.id === session.selectedOrderId);
}

function mixAndPortion(session, profile, order) {
  for (const ingredient of order.requiredIngredients) act(session, profile, 'add-ingredient', { orderId: order.id, ingredient });
  act(session, profile, 'mix', { orderId: order.id, amount: 1 });
  for (let index = 0; index < order.quantity; index++) act(session, profile, 'portion', { orderId: order.id, index });
}

function finishPastry(session, profile, order) {
  if (order.family === 'cupcake') {
    act(session, profile, 'frosting', { orderId: order.id, flavor: order.frosting });
    act(session, profile, 'decorate', { orderId: order.id, amount: 1, x: 0.5, y: 0.5 });
    if (order.topping) act(session, profile, 'topping', { orderId: order.id, topping: order.topping });
  }
  act(session, profile, 'finish-decoration', { orderId: order.id });
}

function finishDrink(session, profile, order) {
  if (!order.drink) return;
  act(session, profile, 'select-cup', { orderId: order.id });
  act(session, profile, 'select-drink', { orderId: order.id, drinkType: order.drink.type, variety: order.drink.variety });
  act(session, profile, 'fill-drink', { orderId: order.id, amount: DRINK_FILL_TARGET / (profile.upgrades['faster-drinks'] ? 1.35 : 1) });
  for (const extra of order.drink.extras) act(session, profile, 'drink-extra', { orderId: order.id, extra });
  if (order.takeaway) act(session, profile, 'drink-lid', { orderId: order.id });
  act(session, profile, 'finish-drink', { orderId: order.id });
}

function completeOrder(session, profile, order = take(session, profile)) {
  mixAndPortion(session, profile, order);
  act(session, profile, 'start-bake', { orderId: order.id });
  // Drinks are prepared while the pastry belongs to its oven tray.
  finishDrink(session, profile, order);
  tick(session, profile, getBakeWindow(order, profile).goldenStart + 1);
  act(session, profile, 'remove-bake', { orderId: order.id });
  finishPastry(session, profile, order);
  act(session, profile, 'package', { orderId: order.id, packaging: order.takeaway ? 'box' : 'tray' });
  const result = act(session, profile, 'serve', { orderId: order.id, customerId: order.customerId });
  return { order, result };
}

test('Quick Play completes three original pastry-and-drink orders at full satisfaction', () => {
  const { profile, session } = setup();
  const families = [];
  while (session.queue.length) {
    const { order, result } = completeOrder(session, profile);
    families.push(order.family);
    assert.equal(result.score.total, 100);
    assert.equal(order.drinkPrep.finished, true);
  }
  assert.deepEqual(families, ['cookie', 'muffin', 'cupcake']);
  assert.equal(session.phase, 'complete');
  assert.equal(session.dayStats.customersServed, 3);
  assert.equal(profile.bestScores.quick, 100);
  assert.equal(profile.scrapbook.length, 3);
  assert.equal(profile.completedSessions, 1);
  assert.equal(profile.totalServed, 3);
});

test('five days schedule every customer twice, gradual demand, and a six-customer final event', () => {
  const profile = createProfile();
  const visits = {};
  const capacities = [];
  for (let day = 1; day <= 5; day++) {
    const session = createSession('story', profile, day);
    capacities.push(session.capacity);
    for (const order of session.queue) {
      visits[order.customerId] = (visits[order.customerId] || 0) + 1;
      assert.ok(RECIPES[order.family].unlockDay <= day);
      assert.ok(RECIPES[order.family].flavors.includes(order.flavor));
      assert.ok(!order.topping || RECIPES[order.family].toppings.includes(order.topping));
      assert.ok(!order.frosting || RECIPES[order.family].frostings.includes(order.frosting));
      const drink = DRINKS.find(drink => drink.id === order.drink.type);
      assert.ok(drink.varieties.includes(order.drink.variety));
      assert.ok(order.drink.extras.every(extra => drink.extras.includes(extra)));
    }
    if (day === 5) assert.equal(session.queue.length, 6);
  }
  assert.deepEqual(capacities, [1, 2, 2, 3, 3]);
  assert.ok(CUSTOMERS.every(customer => visits[customer.id] >= 2));
});

test('the complete story earns six regulars and each advertising milestone exactly once', () => {
  const profile = createProfile();
  let session = createSession('story', profile);
  let sales = 0;
  for (let day = 1; day <= 5; day++) {
    assert.equal(session.day, day);
    while (session.queue.length) completeOrder(session, profile);
    sales += session.dayStats.sales;
    if (day < 5) {
      assert.equal(session.phase, 'day-results');
      session = nextDay(session, profile);
    }
  }
  assert.equal(session.phase, 'complete');
  assert.equal(profile.regulars.length, 6);
  assert.deepEqual(profile.milestones, [1, 2, 3]);
  assert.deepEqual(profile.advertising, { runsCancelled: 3, savings: 30, timeSaved: 60 });
  assert.equal(profile.finance.sales, sales, 'avoided advertising spending is never revenue');
  assert.equal(profile.coins, 30 + profile.finance.sales + profile.finance.tips - profile.finance.ingredientCosts);
  assert.equal(profile.finance.profit, profile.finance.sales + profile.finance.tips - profile.finance.ingredientCosts);
  const replay = createSession('story', profile, 5);
  while (replay.queue.length) completeOrder(replay, profile);
  assert.deepEqual(profile.advertising, { runsCancelled: 3, savings: 30, timeSaved: 60 });
  assert.deepEqual(profile.milestones, [1, 2, 3]);
  assert.equal(replay.dayStats.advertisingSavings, 0);
});

test('word of mouth introduces Maya a day early after excellent service', () => {
  const quietProfile = createProfile();
  assert.equal(createSession('story', quietProfile, 2).queue.some(order => order.customerId === 'maya'), false);
  const profile = createProfile();
  const firstDay = createSession('story', profile, 1);
  while (firstDay.queue.length) completeOrder(firstDay, profile);
  assert.ok(profile.wordOfMouth >= 35);
  const secondDay = nextDay(firstDay, profile);
  const referral = secondDay.queue.find(order => order.customerId === 'maya');
  assert.equal(referral.referred, true);
  assert.match(referral.greeting, /Ruby told me/);
  assert.equal(referral.family, 'muffin');
  while (secondDay.queue.length) completeOrder(secondDay, profile);
  const thirdDay = nextDay(secondDay, profile);
  assert.equal(thirdDay.queue.find(order => order.customerId === 'maya').returning, true);
});

test('multiple orders retain their own bowls, trays, drinks, and selected ticket', () => {
  const { profile, session } = setup('story', 4);
  const first = take(session, profile);
  const second = take(session, profile);
  const third = take(session, profile);
  assert.equal(dispatch(session, profile, { type: 'take-order' }).ok, false);
  act(session, profile, 'add-ingredient', { orderId: first.id, ingredient: 'flour' });
  act(session, profile, 'select-cup', { orderId: second.id });
  act(session, profile, 'select-drink', { orderId: second.id, drinkType: second.drink.type });
  assert.deepEqual(first.ingredients, ['flour']);
  assert.deepEqual(second.ingredients, []);
  assert.deepEqual(third.ingredients, []);
  assert.equal(first.drinkPrep.cup, false);
  assert.equal(second.drinkPrep.cup, true);
  act(session, profile, 'select-order', { orderId: first.id });
  assert.equal(session.selectedOrderId, first.id);
  assert.equal(second.drinkPrep.type, second.drink.type);
});

test('one oven shelf enforces capacity and second shelf allows simultaneous baking', () => {
  const { profile, session } = setup('story', 4);
  profile.coins = 100;
  const first = take(session, profile);
  const second = take(session, profile);
  mixAndPortion(session, profile, first);
  mixAndPortion(session, profile, second);
  act(session, profile, 'start-bake', { orderId: first.id });
  assert.equal(dispatch(session, profile, { type: 'start-bake', orderId: second.id }).ok, false);
  act(session, profile, 'upgrade', { upgradeId: 'second-oven' });
  act(session, profile, 'start-bake', { orderId: second.id });
  tick(session, profile, 5);
  assert.equal(first.bakeTime, 5);
  assert.equal(second.bakeTime, 5);
  assert.equal(session.ovenSlots, 2);
});

test('pause freezes bake and patience timers and blocks station inputs', () => {
  const { profile, session } = setup();
  const order = take(session, profile);
  mixAndPortion(session, profile, order);
  act(session, profile, 'start-bake');
  tick(session, profile, 3);
  act(session, profile, 'pause');
  tick(session, profile, 300);
  assert.equal(order.bakeTime, 3);
  assert.equal(order.elapsed, 3);
  assert.equal(session.time, 3);
  assert.equal(dispatch(session, profile, { type: 'select-cup' }).ok, false);
  assert.equal(order.drinkPrep.cup, false);
  act(session, profile, 'resume');
  tick(session, profile, 2);
  assert.equal(order.bakeTime, 5);
});

test('oven transitions and alerts are consistent and emitted once per tray', () => {
  const { profile, session } = setup();
  const order = take(session, profile);
  mixAndPortion(session, profile, order);
  act(session, profile, 'start-bake');
  tick(session, profile, 2);
  assert.equal(order.bakeState, 'underbaked');
  tick(session, profile, 10);
  assert.equal(order.bakeState, 'golden');
  tick(session, profile, 2);
  assert.equal(session.events.filter(event => event.type === 'oven-golden').length, 1);
  tick(session, profile, 9);
  assert.equal(order.bakeState, 'overbaked');
  tick(session, profile, 1);
  assert.equal(session.events.filter(event => event.type === 'oven-overbaked').length, 1);
  act(session, profile, 'remove-bake');
  assert.ok(order.bakeQuality < 1);
});

test('remaking a baked pastry clears dependent progress and keeps its finished drink', () => {
  const { profile, session } = setup();
  const order = take(session, profile);
  mixAndPortion(session, profile, order);
  act(session, profile, 'start-bake');
  finishDrink(session, profile, order);
  tick(session, profile, 60);
  act(session, profile, 'remove-bake');
  finishPastry(session, profile, order);
  act(session, profile, 'package', { packaging: 'tray' });
  const before = profile.coins;
  act(session, profile, 'remake', { item: 'pastry' });
  assert.equal(profile.coins, before - 1);
  assert.equal(order.stage, 'ingredients');
  assert.equal(order.portions, 0);
  assert.equal(order.bakeTime, 0);
  assert.equal(order.packaging, null);
  assert.deepEqual(order.ingredients, []);
  assert.equal(order.drinkPrep.finished, true);
  mixAndPortion(session, profile, order);
  act(session, profile, 'start-bake');
  tick(session, profile, 13);
  act(session, profile, 'remove-bake');
  finishPastry(session, profile, order);
  act(session, profile, 'package', { packaging: 'tray' });
  assert.equal(act(session, profile, 'serve').score.total, 100);
});

test('drinks can be remade without losing pastry ownership or oven progress', () => {
  const { profile, session } = setup();
  const order = take(session, profile);
  mixAndPortion(session, profile, order);
  act(session, profile, 'start-bake');
  finishDrink(session, profile, order);
  tick(session, profile, 4);
  act(session, profile, 'remake', { item: 'drink' });
  assert.equal(order.stage, 'baking');
  assert.equal(order.bakeTime, 4);
  assert.equal(order.drinkPrep.type, null);
  assert.equal(order.drinkPrep.fill, 0);
});

test('even an empty purse cannot permanently block a recoverable order', () => {
  const { profile, session } = setup();
  profile.coins = 0;
  const order = take(session, profile);
  act(session, profile, 'add-ingredient', { ingredient: 'flour' });
  act(session, profile, 'remake', { item: 'pastry' });
  const { result } = completeOrder(session, profile, order);
  assert.equal(result.score.total, 100);
  assert.ok(profile.coins > 0);
});

test('unsupported ingredients, recipe options, drink extras, and illegal actions are rejected', () => {
  const { profile, session } = setup();
  const order = take(session, profile);
  assert.equal(dispatch(session, profile, { type: 'add-ingredient', ingredient: 'motor-oil' }).ok, false);
  assert.equal(dispatch(session, profile, { type: 'mix' }).ok, false);
  assert.equal(dispatch(session, profile, { type: 'start-bake' }).ok, false);
  assert.equal(dispatch(session, profile, { type: 'serve' }).ok, false);
  act(session, profile, 'select-cup');
  assert.equal(dispatch(session, profile, { type: 'select-drink', drinkType: 'soda' }).ok, false);
  assert.equal(dispatch(session, profile, { type: 'select-drink', drinkType: 'tea', variety: 'imaginary' }).ok, false);
  act(session, profile, 'select-drink', { drinkType: 'tea', variety: 'breakfast' });
  act(session, profile, 'fill-drink', { amount: 0.8 });
  assert.equal(dispatch(session, profile, { type: 'drink-extra', extra: 'marshmallows' }).ok, false);
  assert.equal(dispatch(session, profile, { type: 'frosting', flavor: 'strawberry' }).ok, false);
  assert.equal(dispatch(session, profile, { type: 'topping', topping: 'sprinkles' }).ok, false);
  assert.deepEqual(order.ingredients, []);
});

test('scoring applies exact 40/25/20/15 weighting and adapts to a pastry-only ticket', () => {
  const { profile, session } = setup();
  const order = take(session, profile);
  order.drink = null;
  mixAndPortion(session, profile, order);
  act(session, profile, 'start-bake');
  tick(session, profile, 13);
  act(session, profile, 'remove-bake');
  finishPastry(session, profile, order);
  act(session, profile, 'package', { packaging: 'tray' });
  let score = scoreOrder(order, session, profile);
  assert.equal(score.total, 100);
  assert.equal(score.payment, RECIPES.cookie.price);
  order.bakeQuality = 0;
  score = scoreOrder(order, session, profile);
  assert.equal(score.total, 75);
  order.bakeQuality = 1;
  order.ingredients = [];
  score = scoreOrder(order, session, profile);
  assert.equal(score.total, 60);
  order.ingredients = [...order.requiredIngredients];
  order.packaging = 'box';
  score = scoreOrder(order, session, profile);
  assert.equal(score.total, 80);
});

test('service checks customer identity and cannot collect payment twice', () => {
  const { profile, session } = setup();
  const { order } = completeOrder(session, profile);
  const coins = profile.coins;
  assert.equal(dispatch(session, profile, { type: 'serve', orderId: order.id }).ok, false);
  assert.equal(profile.coins, coins);
  const second = take(session, profile);
  mixAndPortion(session, profile, second);
  act(session, profile, 'start-bake');
  finishDrink(session, profile, second);
  tick(session, profile, 15);
  act(session, profile, 'remove-bake');
  finishPastry(session, profile, second);
  act(session, profile, 'package', { packaging: 'box' });
  assert.equal(dispatch(session, profile, { type: 'serve', customerId: 'june' }).ok, false);
  act(session, profile, 'serve', { customerId: second.customerId });
});

test('upgrades enforce affordability/unlocks, persist unique purchases, and change gameplay', () => {
  const { profile, session } = setup('story', 1);
  assert.equal(dispatch(session, profile, { type: 'upgrade', upgradeId: 'second-oven' }).ok, false);
  act(session, profile, 'upgrade', { upgradeId: 'faster-mixing' });
  const coins = profile.coins;
  assert.equal(dispatch(session, profile, { type: 'upgrade', upgradeId: 'faster-mixing' }).ok, false);
  assert.equal(profile.coins, coins);
  const order = take(session, profile);
  for (const ingredient of order.requiredIngredients) act(session, profile, 'add-ingredient', { ingredient });
  act(session, profile, 'mix', { amount: 0.5 });
  assert.equal(order.mixProgress, 0.7);
  const initialEnd = getBakeWindow(order, profile).goldenEnd;
  act(session, profile, 'upgrade', { upgradeId: 'clear-timer' });
  assert.equal(getBakeWindow(order, profile).goldenEnd, initialEnd + 6);
  profile.unlockedDay = 5;
  profile.coins = 200;
  for (const upgrade of UPGRADES.filter(upgrade => !profile.upgrades[upgrade.id])) act(session, profile, 'upgrade', { upgradeId: upgrade.id });
  act(session, profile, 'select-cup');
  act(session, profile, 'select-drink', { drinkType: 'coffee' });
  act(session, profile, 'fill-drink', { amount: 0.4 });
  assert.equal(order.drinkPrep.fill, 0.54);
  const varied = createSession('story', profile, 2);
  assert.equal(varied.queue[0].topping, 'raisins');
  assert.equal(Object.keys(profile.upgrades).length, 6);
});

test('relaxed mode widens the golden window and removes waiting pressure', () => {
  const { profile, session } = setup();
  const order = take(session, profile);
  const original = getBakeWindow(order, profile).goldenEnd;
  act(session, profile, 'settings', { settings: { relaxed: true } });
  assert.equal(getBakeWindow(order, profile).goldenEnd, original + 18);
  order.elapsed = 10000;
  assert.equal(scoreOrder(order, session, profile).waiting, 100);
});

test('save/resume preserves independent in-progress tickets and pauses away time', () => {
  const values = new Map();
  globalThis.localStorage = { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) };
  try {
    const { profile, session } = setup('story', 4);
    const first = take(session, profile);
    mixAndPortion(session, profile, first);
    act(session, profile, 'start-bake');
    const second = take(session, profile);
    finishDrink(session, profile, second);
    tick(session, profile, 7);
    assert.equal(saveGame(profile, session), true);
    const restored = loadGame();
    assert.equal(restored.session.paused, true);
    assert.equal(restored.session.orders[0].bakeTime, 7);
    assert.equal(restored.session.orders[1].drinkPrep.finished, true);
    assert.equal(restored.session.selectedOrderId, second.id);
    tick(restored.session, restored.profile, 100);
    assert.equal(restored.session.orders[0].bakeTime, 7);
    act(restored.session, restored.profile, 'resume');
    tick(restored.session, restored.profile, 1);
    assert.equal(restored.session.orders[0].bakeTime, 8);
    values.set(SAVE_KEY, '{not json');
    assert.equal(loadGame(), null);
    values.set(SAVE_KEY, JSON.stringify({ version: 2, profile }));
    assert.equal(loadGame(), null);
  } finally { delete globalThis.localStorage; }
});

test('storage-disabled environments remain fully playable', () => {
  const { profile, session } = setup();
  globalThis.localStorage = { getItem() { throw new Error('disabled'); }, setItem() { throw new Error('quota'); } };
  try {
    assert.equal(saveGame(profile, session), false);
    assert.equal(loadGame(), null);
    assert.equal(completeOrder(session, profile).result.score.total, 100);
  } finally { delete globalThis.localStorage; }
});

test('daily challenge is deterministic, supported, and never penalizes missed days', () => {
  const date = new Date(2026, 9, 2, 12);
  assert.deepEqual(dailyChallenge(date), dailyChallenge(new Date(2026, 9, 2, 20)));
  const challenge = dailyChallenge(date);
  assert.equal(challenge.date, '2026-10-02');
  assert.ok(RECIPES[challenge.family].flavors.includes(challenge.flavor));
  const { profile, session } = setup();
  const challengeBefore = { ...profile.dailyCompletions };
  dailyChallenge(new Date(2027, 1, 1));
  assert.deepEqual(profile.dailyCompletions, challengeBefore);
  while (session.queue.length) completeOrder(session, profile);
  assert.equal(profile.dailyCompletions[session.dailyRecipe.date], 100);
});

test('continuous input accepts frame-sized amounts and stops cleanly at completion', () => {
  const {profile,session} = setup();
  const order = take(session,profile);
  for (const ingredient of order.requiredIngredients) act(session,profile,'add-ingredient',{ingredient});
  for (let frame = 0; frame < 120; frame++) act(session,profile,'mix',{amount:1/240});
  assert.ok(Math.abs(order.mixProgress-.5) < 1e-10);
  act(session,profile,'pause');
  assert.equal(dispatch(session,profile,{type:'mix',amount:1/240}).ok,false);
  assert.ok(Math.abs(order.mixProgress-.5) < 1e-10);
  act(session,profile,'resume');
  act(session,profile,'mix',{amount:.501});
  assert.equal(order.mixProgress,1);
  assert.equal(order.stage,'portioning');
  act(session,profile,'select-cup');
  act(session,profile,'select-drink',{drinkType:'tea',variety:'breakfast'});
  for (let frame = 0; frame < 300; frame++) act(session,profile,'fill-drink',{amount:.8/300});
  assert.ok(Math.abs(order.drinkPrep.fill-.8) < 1e-10);
});

test('optional cookie icing retains separate strokes through saves without changing its recipe score', () => {
  const {profile,session} = setup();
  const order = take(session,profile);
  mixAndPortion(session,profile,order);
  act(session,profile,'start-bake');
  tick(session,profile,getBakeWindow(order,profile).goldenStart+.5);
  act(session,profile,'remove-bake');
  act(session,profile,'decorate',{amount:.1,x:.3,y:.4,strokeStart:true});
  act(session,profile,'decorate',{amount:.1,x:.6,y:.5});
  act(session,profile,'decorate',{amount:.1,x:.4,y:.6,strokeStart:true});
  assert.equal(order.decoration.frosting,'vanilla');
  assert.deepEqual(order.decoration.points.map(p=>p.start),[true,false,true]);
  assert.equal(dispatch(session,profile,{type:'frosting',flavor:'strawberry'}).ok,false);
  act(session,profile,'finish-decoration');
  finishDrink(session,profile,order);
  act(session,profile,'package',{packaging:'tray'});
  assert.equal(scoreOrder(order,session,profile).total,100);
  const copy = JSON.parse(JSON.stringify(session));
  assert.deepEqual(copy.orders[0].decoration.points,order.decoration.points);
});
