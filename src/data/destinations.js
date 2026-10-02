/**
 * DESTINATIONS: the state package ledger.
 * Add a state by appending an object. Fields:
 *  id        unique slug (also used for the image slot name)
 *  name      English state name
 *  script    state name in its regional script
 *  lang      BCP-47 tag for the script (screen readers + font selection)
 *  places    3–4 signature places
 *  days      package duration label
 *  price     "starting from" price in INR (null = placeholder "₹___")
 *  tags      any of: mountains | beaches | heritage | spiritual | food
 *  accent    accent colour used for the row glow
 *  image     path to a preview photo, e.g. '/images/destinations/rajasthan.jpg'
 *            Leave '' to use the generated illustrated placeholder.
 *  url       link for "View Package"
 */
export const destinations = [
  {
    id: 'rajasthan', name: 'Rajasthan', script: 'राजस्थान', lang: 'hi',
    places: ['Jaipur', 'Udaipur', 'Jaisalmer', 'Jodhpur'],
    days: '7 Days · 6 Nights', price: null,
    tags: ['heritage', 'food'], accent: '#E8833A', image: '', url: '#plan',
  },
  {
    id: 'kerala', name: 'Kerala', script: 'കേരളം', lang: 'ml',
    places: ['Alleppey', 'Munnar', 'Kochi', 'Varkala'],
    days: '6 Days · 5 Nights', price: null,
    tags: ['beaches', 'mountains', 'food'], accent: '#2E9E6B', image: '', url: '#plan',
  },
  {
    id: 'telangana', name: 'Telangana', script: 'తెలంగాణ', lang: 'te',
    places: ['Hyderabad Old City', 'Warangal', 'Ramappa', 'Nagarjuna Sagar'],
    days: '4 Days · 3 Nights', price: null,
    tags: ['heritage', 'food'], accent: '#C2477A', image: '', url: '#plan',
  },
  {
    id: 'himachal-pradesh', name: 'Himachal Pradesh', script: 'हिमाचल प्रदेश', lang: 'hi',
    places: ['Manali', 'Spiti', 'Dharamshala', 'Kasol'],
    days: '8 Days · 7 Nights', price: null,
    tags: ['mountains', 'spiritual'], accent: '#3D7CC9', image: '', url: '#plan',
  },
  {
    id: 'goa', name: 'Goa', script: 'गोंय', lang: 'kok',
    places: ['Fontainhas', 'Palolem', 'Divar Island', 'Dudhsagar'],
    days: '5 Days · 4 Nights', price: null,
    tags: ['beaches', 'food'], accent: '#D99A00', image: '', url: '#plan',
  },
  {
    id: 'tamil-nadu', name: 'Tamil Nadu', script: 'தமிழ்நாடு', lang: 'ta',
    places: ['Madurai', 'Kanchipuram', 'Chettinad', 'Mahabalipuram'],
    days: '6 Days · 5 Nights', price: null,
    tags: ['heritage', 'spiritual', 'food'], accent: '#B5462E', image: '', url: '#plan',
  },
  {
    id: 'uttarakhand', name: 'Uttarakhand', script: 'उत्तराखण्ड', lang: 'hi',
    places: ['Rishikesh', 'Haridwar', 'Auli', 'Valley of Flowers'],
    days: '7 Days · 6 Nights', price: null,
    tags: ['mountains', 'spiritual'], accent: '#5B8C3A', image: '', url: '#plan',
  },
  {
    id: 'west-bengal', name: 'West Bengal', script: 'পশ্চিমবঙ্গ', lang: 'bn',
    places: ['Kolkata', 'Darjeeling', 'Shantiniketan', 'Sundarbans'],
    days: '6 Days · 5 Nights', price: null,
    tags: ['heritage', 'mountains', 'food'], accent: '#8C4FB5', image: '', url: '#plan',
  },
];

export const filters = [
  { id: 'all', label: 'All States' },
  { id: 'mountains', label: 'Mountains' },
  { id: 'beaches', label: 'Beaches' },
  { id: 'heritage', label: 'Heritage' },
  { id: 'spiritual', label: 'Spiritual' },
  { id: 'food', label: 'Food Trails' },
];
