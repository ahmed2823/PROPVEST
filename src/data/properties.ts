export type Property = {
  id: string;
  name: string;
  location: string;
  image: string;
  price: number;
  minimum: number;
  yield: number;
  appreciation: number;
  funded: number;
  bedrooms: string;
  area: string;
  status: string;
  type: string;
  description: string;
};

export const properties: Property[] = [
  {
    id: 'marina',
    name: 'Marine Heights',
    location: 'Marine Lines, Mumbai',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=85',
    price: 1850000,
    minimum: 10000,
    yield: 8.2,
    appreciation: 6.4,
    funded: 74,
    bedrooms: '1 bed',
    area: '812 sq ft',
    status: 'Ready to move',
    type: 'Apartment',
    description: 'A bright, fully furnished apartment with sweeping views of the Arabian Sea, a short walk from the waterfront promenade and local shopping.',
  },
  {
    id: 'jvc',
    name: 'The Orchard Residences',
    location: 'Whitefield, Bengaluru',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85',
    price: 1240000,
    minimum: 10000,
    yield: 9.1,
    appreciation: 5.8,
    funded: 58,
    bedrooms: 'Studio',
    area: '536 sq ft',
    status: 'High yield',
    type: 'Apartment',
    description: 'A modern, thoughtfully designed residence in a fast-growing community, with everyday amenities and excellent connectivity.',
  },
  {
    id: 'business-bay',
    name: 'Canal View Residences',
    location: 'Powai, Mumbai',
    image: 'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=1200&q=85',
    price: 2150000,
    minimum: 10000,
    yield: 7.6,
    appreciation: 7.2,
    funded: 86,
    bedrooms: '2 beds',
    area: '1,098 sq ft',
    status: 'Almost funded',
    type: 'Apartment',
    description: 'A contemporary home moments from Powai Lake, surrounded by restaurants, business destinations and city views.',
  },
  {
    id: 'palm',
    name: 'Palm Garden Villa',
    location: 'Golf Course Road, Gurugram',
    image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=85',
    price: 4750000,
    minimum: 10000,
    yield: 7.9,
    appreciation: 8.1,
    funded: 42,
    bedrooms: '3 beds',
    area: '2,014 sq ft',
    status: 'New opportunity',
    type: 'Villa',
    description: 'An elegant island residence with generous outdoor space, resort-style facilities and easy access to the Palm’s best-known landmarks.',
  },
];
