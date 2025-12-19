import productCleanser from '@/assets/product-cleanser.png';
import productSerum from '@/assets/product-serum.png';
import productCream from '@/assets/product-cream.png';
import productTreatment from '@/assets/product-treatment.png';
import productBooster from '@/assets/product-booster.png';
import productNightCream from '@/assets/product-night-cream.png';

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  size?: string;
  badge?: string;
}

export interface Bundle {
  id: string;
  name: string;
  label: string;
  headline: string;
  products: {
    id: string;
    name: string;
    size: string;
    price: number;
    originalPrice: number;
    image: string;
  }[];
  totalPrice: number;
  originalTotal: number;
}

export interface Testimonial {
  id: string;
  customerName: string;
  rating: number;
  review: string;
  productName: string;
  productType: 'single' | 'bundle';
  productImage: string;
}

export const categories = [
  { id: 'all', name: 'All Products' },
  { id: 'cleansers', name: 'Cleansers' },
  { id: 'serums', name: 'Serums' },
  { id: 'moisturizers', name: 'Moisturizers' },
  { id: 'treatments', name: 'Treatments' },
];

export const products: Product[] = [
  {
    id: '1',
    name: 'Gentle Foam Cleanser',
    price: 89,
    image: productCleanser,
    category: 'cleansers',
    size: '150ml',
    badge: 'Best Seller',
  },
  {
    id: '2',
    name: 'Vitamin C Brightening Serum',
    price: 149,
    image: productSerum,
    category: 'serums',
    size: '30ml',
    badge: 'New',
  },
  {
    id: '3',
    name: 'Hydrating Day Cream',
    price: 119,
    image: productCream,
    category: 'moisturizers',
    size: '50ml',
  },
  {
    id: '4',
    name: 'Retinol Night Treatment',
    price: 179,
    originalPrice: 199,
    image: productTreatment,
    category: 'treatments',
    size: '30ml',
  },
  {
    id: '5',
    name: 'Hyaluronic Acid Booster',
    price: 129,
    image: productBooster,
    category: 'serums',
    size: '30ml',
  },
  {
    id: '6',
    name: 'Nourishing Night Cream',
    price: 139,
    image: productNightCream,
    category: 'moisturizers',
    size: '50ml',
  },
];

export const bundle: Bundle = {
  id: 'bundle-1',
  name: 'Complete Glow Routine',
  label: 'Best-Selling Routine',
  headline: 'Your Complete Path to Radiant Skin',
  products: [
    { id: '1', name: 'Gentle Foam Cleanser', size: '150ml', price: 69, originalPrice: 89, image: productCleanser },
    { id: '2', name: 'Vitamin C Serum', size: '30ml', price: 119, originalPrice: 149, image: productSerum },
    { id: '3', name: 'Hydrating Day Cream', size: '50ml', price: 99, originalPrice: 119, image: productCream },
  ],
  totalPrice: 287,
  originalTotal: 357,
};

export const testimonials: Testimonial[] = [
  {
    id: '1',
    customerName: 'Sarah M.',
    rating: 5,
    review: 'My skin has never looked better. Visible results in just 2 weeks!',
    productName: 'Vitamin C Brightening Serum',
    productType: 'single',
    productImage: productSerum,
  },
  {
    id: '2',
    customerName: 'Nour A.',
    rating: 5,
    review: 'The complete routine transformed my skincare game. Worth every penny.',
    productName: 'Complete Glow Routine',
    productType: 'bundle',
    productImage: productCream,
  },
  {
    id: '3',
    customerName: 'Layla K.',
    rating: 5,
    review: 'Finally found a cleanser that doesn\'t dry out my skin!',
    productName: 'Gentle Foam Cleanser',
    productType: 'single',
    productImage: productCleanser,
  },
];
