export interface Product {
  id: string;
  name: string;
  category: 'Skincare' | 'Makeup' | 'Body Care';
  price: number;
  originalPrice: number; // For crossed-out pricing and discount calculation
  image: string;
  description: string;
  rating: number;
  reviews: number;
  isNew?: boolean;
  isBestSeller?: boolean;
}

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Rose Quartz Illuminating Serum',
    category: 'Skincare',
    price: 68,
    originalPrice: 85,
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=800',
    description: 'Infused with real rose quartz extract for a celestial, hydrated glow.',
    rating: 4.9,
    reviews: 124,
    isBestSeller: true
  },
  {
    id: '2',
    name: 'Velvet Matte Cushion Lipstick',
    category: 'Makeup',
    price: 24,
    originalPrice: 32,
    image: 'https://images.unsplash.com/photo-1586776977607-310e9c725c37?auto=format&fit=crop&q=80&w=800',
    description: 'Long-lasting matte finish with a weightless, hydrating feel.',
    rating: 4.8,
    reviews: 98,
    isNew: true
  },
  {
    id: '3',
    name: 'Whipped Silk Body Butter',
    category: 'Body Care',
    price: 36,
    originalPrice: 45,
    image: 'https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?auto=format&fit=crop&q=80&w=800',
    description: 'Whipped shea and cocoa butter for 24-hour ultra-luxurious hydration.',
    rating: 4.7,
    reviews: 86
  },
  {
    id: '4',
    name: 'Midnight Elixir Recovery Oil',
    category: 'Skincare',
    price: 76,
    originalPrice: 95,
    image: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&q=80&w=800',
    description: 'Overnight cell-rejuvenating facial oil with premium active botanicals.',
    rating: 4.9,
    reviews: 210,
    isBestSeller: true
  },
  {
    id: '5',
    name: 'Flawless Radiance Foundation',
    category: 'Makeup',
    price: 46,
    originalPrice: 58,
    image: 'https://images.unsplash.com/photo-1599733594230-6b823276abcc?auto=format&fit=crop&q=80&w=800',
    description: 'Seamless cover with micro-light reflectors for a natural radiant halo.',
    rating: 4.6,
    reviews: 142
  },
  {
    id: '6',
    name: 'French Peony Relaxing Bath Salts',
    category: 'Body Care',
    price: 19,
    originalPrice: 28,
    image: 'https://images.unsplash.com/photo-1607006344380-b6775a0824a7?auto=format&fit=crop&q=80&w=800',
    description: 'Soothe muscles and mind with hand-harvested pink salt crystals.',
    rating: 4.8,
    reviews: 74,
    isNew: true
  },
  {
    id: '7',
    name: 'Hydrating Blossom Toner',
    category: 'Skincare',
    price: 29,
    originalPrice: 38,
    image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=800',
    description: 'Infused with distilled Bulgarian damask rose petals to balance and soothe.',
    rating: 4.7,
    reviews: 115
  },
  {
    id: '8',
    name: 'Satin Silk Shimmer Highlighter',
    category: 'Makeup',
    price: 22,
    originalPrice: 30,
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=800',
    description: 'Ultra-fine cream highlighter reflecting beautiful iridescent pink-gold champagne.',
    rating: 4.9,
    reviews: 180,
    isBestSeller: true
  },
  {
    id: '9',
    name: 'Rose-Gold Nourishing Body Oil',
    category: 'Body Care',
    price: 42,
    originalPrice: 55,
    image: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&q=80&w=800',
    description: 'Lightweight luxurious dry body oil leaving a soft golden shimmer skin-finish.',
    rating: 4.8,
    reviews: 132,
    isNew: true
  }
];

