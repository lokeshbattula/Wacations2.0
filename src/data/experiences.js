/**
 * EIGHT TASTES OF INDIA: one entry per interactive 3D object.
 * `model` maps to a builder in src/scenes/tastesModels.js.
 * `chip` pre-selects that experience chip in the enquiry form ("Add to my journey").
 * `image` is an optional photo for the story dialog ('' = illustrated placeholder),
 * e.g. 'images/experiences/chai.jpg' (no leading slash, so it works on GitHub Pages).
 */
export const experiences = [
  {
    id: 'chai', model: 'chai', chip: 'Food', label: 'चाय', lang: 'hi', tint: '#B5562E',
    title: 'Street Tastes',
    copy: ['Clay-cup chai at dawn, a sizzle of jalebi at dusk.', 'We walk you to the stalls locals queue for.'],
    example: 'Sip kulhad chai on a 6 a.m. walk through Old Delhi’s Chandni Chowk.',
    image: '',
  },
  {
    id: 'textile', model: 'textile', chip: 'Fashion', label: 'நெசவு', lang: 'ta', tint: '#A3195B',
    title: 'Fashion & Handlooms',
    copy: ['Silk that whispers when it moves; blocks carved by hand.', 'Meet the weavers, then wear their work.'],
    example: 'Weave a strand of Kanchipuram silk on a family loom, then drape it.',
    image: '',
  },
  {
    id: 'diya', model: 'diya', chip: 'Festivals', label: 'दीप', lang: 'hi', tint: '#D9851A',
    title: 'Festivals & Rituals',
    copy: ['A thousand lamps on the ghats. Drums in the lanes.', 'We time your trip to the celebration.'],
    example: 'Float a diya on the Ganga during the Rishikesh evening aarti.',
    image: '',
  },
  {
    id: 'mask', model: 'mask', chip: 'Festivals', label: 'കഥകളി', lang: 'ml', tint: '#2E8B57',
    title: 'Performing Arts',
    copy: ['Painted faces, rolling eyes, stories older than kings.', 'Sit backstage while the colours go on.'],
    example: 'Watch a Kathakali artist paint their face, two hours before the show in Kochi.',
    image: '',
  },
  {
    id: 'shikara', model: 'shikara', chip: 'Nature', label: 'വഞ്ചി', lang: 'ml', tint: '#14525C',
    title: 'Stays with Character',
    copy: ['Wake on water, in havelis, in tea-estate bungalows.', 'Every bed comes with a story.'],
    example: 'Sleep on a kettuvallam houseboat drifting through the Alleppey backwaters.',
    image: '',
  },
  {
    id: 'auto', model: 'auto', chip: 'Nature', label: 'ఆటో', lang: 'te', tint: '#C9A100',
    title: 'Local Rides',
    copy: ['Painted autos, vintage taxis, toy trains in the clouds.', 'Getting there becomes the memory.'],
    example: 'Ride a yellow Ambassador taxi across Howrah Bridge at first light.',
    image: '',
  },
  {
    id: 'pottery', model: 'pottery', chip: 'Crafts', label: 'కుమ్మరి', lang: 'te', tint: '#A0522D',
    title: 'Crafts & Artisans',
    copy: ['Clay, brass, lacquer and lac. Hands that remember centuries.', 'You leave with something you made.'],
    example: 'Shape your own terracotta pot with a potter’s family in Kutch.',
    image: '',
  },
  {
    id: 'dabba', model: 'dabba', chip: 'Food', label: 'मसाला', lang: 'hi', tint: '#C8553D',
    title: 'Cook with Families',
    copy: ['Seven spices, one steel tin, a grandmother’s recipe.', 'Eat what you cook, at their table.'],
    example: 'Cook Hyderabadi biryani with a family in the Old City.',
    image: '',
  },
];
