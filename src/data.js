export const INGREDIENTS = [
  { id: 'flour', name: 'Flour', symbol: 'bag' },
  { id: 'sugar', name: 'Sugar', symbol: 'jar' },
  { id: 'butter', name: 'Butter', symbol: 'butter' },
  { id: 'egg', name: 'Egg', symbol: 'egg' },
  { id: 'milk', name: 'Milk', symbol: 'bottle' },
  { id: 'cocoa', name: 'Cocoa', symbol: 'jar' },
  { id: 'chocolate-chips', name: 'Chocolate chips', symbol: 'chips' },
  { id: 'raisins', name: 'Raisins', symbol: 'berries' },
  { id: 'blueberries', name: 'Blueberries', symbol: 'berries' },
  { id: 'honey', name: 'Honey', symbol: 'jar' },
  { id: 'coffee', name: 'Coffee', symbol: 'beans' },
  { id: 'tea', name: 'Tea', symbol: 'leaf' },
];

export const RECIPES = {
  cookie: {
    id: 'cookie', name: 'Grandma’s cookies', singular: 'cookie',
    ingredients: ['flour', 'sugar', 'butter', 'egg'], flavors: ['plain', 'chocolate'],
    toppings: ['chocolate-chips', 'raisins'], frostings: [],
    bake: { goldenStart: 12, goldenEnd: 21 }, price: 6, cost: 2, unlockDay: 1,
    description: 'Crisp edges, a soft middle, and a little love in every batch.',
  },
  muffin: {
    id: 'muffin', name: 'Morning muffins', singular: 'muffin',
    ingredients: ['flour', 'sugar', 'butter', 'egg', 'milk'], flavors: ['vanilla', 'chocolate'],
    toppings: ['blueberries', 'chocolate-chips'], frostings: [],
    bake: { goldenStart: 14, goldenEnd: 23 }, price: 7, cost: 3, unlockDay: 2,
    description: 'A tender, golden little reason to slow down with a warm drink.',
  },
  cupcake: {
    id: 'cupcake', name: 'Celebration cupcakes', singular: 'cupcake',
    ingredients: ['flour', 'sugar', 'butter', 'egg', 'milk'], flavors: ['vanilla', 'chocolate'],
    toppings: ['sprinkles'], frostings: ['vanilla', 'chocolate', 'strawberry'],
    bake: { goldenStart: 13, goldenEnd: 22 }, price: 8, cost: 3, unlockDay: 3,
    description: 'A soft cake, a generous swirl, and a tiny everyday celebration.',
  },
};

export const DRINKS = [
  { id: 'coffee', name: 'Coffee', varieties: ['house'], extras: ['milk', 'sugar'], color: '#603f29', price: 3 },
  { id: 'tea', name: 'Tea', varieties: ['breakfast', 'chamomile'], extras: ['honey'], color: '#c8923f', price: 3 },
  { id: 'hot-chocolate', name: 'Hot chocolate', varieties: ['classic'], extras: ['cream', 'marshmallows'], color: '#805239', price: 4 },
];

export const CUSTOMERS = [
  { id: 'maple', name: 'Mr. Maple', description: 'Patient, kind, and always ready for tea.', hair: 'bald', accessory: 'glasses', colors: { skin: '#e7b190', hair: '#e8e0d4', shirt: '#759884' }, patience: 210,
    dialogue: { greeting: 'A little tea and something sweet? Lovely.', returning: 'My favorite little stop. Hello again!', happy: 'Beautifully baked. I shall tell my walking group!', gentle: 'A little practice makes every batch better.' } },
  { id: 'maya', name: 'Maya', description: 'Loves colorful cupcakes and cozy hot chocolate.', hair: 'buns', accessory: 'earrings', colors: { skin: '#b87554', hair: '#372821', shirt: '#cd7590' }, patience: 180,
    dialogue: { greeting: 'Something colorful would make my day!', returning: 'I’ve been dreaming about your cupcakes.', happy: 'It’s almost too pretty to eat. Almost!', gentle: 'Every cupcake has its own personality.' } },
  { id: 'theo', name: 'Theo', description: 'A coffee fan with a very busy notebook.', hair: 'short', accessory: 'glasses', colors: { skin: '#d7a077', hair: '#664434', shirt: '#7598ad' }, patience: 150,
    dialogue: { greeting: 'A coffee and a little fuel for my ideas, please.', returning: 'Back for my usual burst of inspiration!', happy: 'That’s my afternoon sorted. Thank you!', gentle: 'We all have busy moments. Keep going!' } },
  { id: 'ruby', name: 'Ruby', description: 'Never keeps a good bakery a secret.', hair: 'curly', accessory: 'scarf', colors: { skin: '#efc6a1', hair: '#ae5840', shirt: '#d09952' }, patience: 185,
    dialogue: { greeting: 'It smells wonderful in here!', returning: 'I brought the neighborhood news—and an appetite.', happy: 'Everyone on my street needs to try this!', gentle: 'I can tell there’s a lot of heart in this kitchen.' } },
  { id: 'sam', name: 'Sam', description: 'Has a favorite way to make every order.', hair: 'swept', accessory: 'cap', colors: { skin: '#92664c', hair: '#302a28', shirt: '#84946d' }, patience: 180,
    dialogue: { greeting: 'I have a couple of little requests, please.', returning: 'You remember my favorites! That means a lot.', happy: 'Just the way I like it. What a treat!', gentle: 'Thanks for listening to my little requests.' } },
  { id: 'june', name: 'June', description: 'Comes back for favorites and treats for friends.', hair: 'bob', accessory: 'headband', colors: { skin: '#e7ae88', hair: '#554030', shirt: '#a58aac' }, patience: 200,
    dialogue: { greeting: 'Something lovely to share, please.', returning: 'My friends asked me to bring more!', happy: 'A little box of happiness. See you soon!', gentle: 'Sharing a treat is still a lovely thing.' } },
];

export const GRANDMA = { id: 'grandma', name: 'Grandma', hair: 'bun', accessory: 'glasses', colors: { skin: '#edc5a4', hair: '#eae4d7', shirt: '#b8c7ab' } };

export const UPGRADES = [
  { id: 'second-oven', name: 'A second oven shelf', description: 'Bake two orders at the same time.', cost: 18, unlockDay: 2 },
  { id: 'faster-mixing', name: 'Grandma’s lucky whisk', description: 'Mix your batter 40% faster.', cost: 12, unlockDay: 1 },
  { id: 'clear-timer', name: 'A cheerful oven timer', description: 'A clearer countdown and a longer golden window.', cost: 10, unlockDay: 1 },
  { id: 'faster-drinks', name: 'Cozy drink dispenser', description: 'Fill every cup 35% faster.', cost: 14, unlockDay: 2 },
  { id: 'pretty-display', name: 'A lovely pastry display', description: 'Waiting customers feel more patient.', cost: 16, unlockDay: 3 },
  { id: 'recipe-variations', name: 'Grandma’s recipe notes', description: 'Unlock extra flavors and mix-ins in the scrapbook and future orders.', cost: 12, unlockDay: 2 },
];

export const DAY_TITLES = ['A little helping hand', 'Familiar faces', 'A swirl of something new', 'The word gets around', 'The neighborhood tea party'];
export const TUTORIAL = [
  { station: 'counter', title: 'Every good visit starts with hello', text: 'Take a ticket at the counter. Its recipe stays with you at every station.' },
  { station: 'mixing', title: 'A little of this, a little of that', text: 'Add the recipe ingredients, hold to mix, then tap each marked tray position.' },
  { station: 'oven', title: 'Watch for golden', text: 'Put your tray in the oven. Make the drink while it bakes, then remove it in the golden window.' },
  { station: 'decorating', title: 'Your finishing touch', text: 'Follow the swirl with taps or a gentle drag. Choose the requested frosting and toppings.' },
  { station: 'drinks', title: 'Something warm to go with it', text: 'Choose a cup and drink. Hold to fill to the line, add extras, and use a lid for takeaway.' },
  { station: 'counter', title: 'Send a little happiness home', text: 'Match the pastry and drink on the ticket, choose a box or tray, and serve. Mistakes are always fixable.' },
];
