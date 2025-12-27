// Local products system - replacing Shopify integration

import productSerum from '@/assets/product-serum.png';
import productCream from '@/assets/product-cream.png';
import productCleanser from '@/assets/product-cleanser.png';
import productBooster from '@/assets/product-booster.png';
import productTreatment from '@/assets/product-treatment.png';
import productNightCream from '@/assets/product-night-cream.png';

export interface LocalProduct {
  id: string;
  handle: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  price: number;
  compareAtPrice?: number;
  currency: string;
  images: string[];
  category: string;
  inStock: boolean;
  variants: Array<{
    id: string;
    title: string;
    price: number;
    compareAtPrice?: number;
    availableForSale: boolean;
  }>;
}

// Local products data
export const localProducts: LocalProduct[] = [
  {
    id: 'prod-1',
    handle: 'vitamin-c-serum',
    title: 'Vitamin C Brightening Serum',
    titleAr: 'سيروم فيتامين سي للتفتيح',
    description: 'A powerful antioxidant serum that brightens and evens skin tone while reducing the appearance of fine lines.',
    descriptionAr: 'سيروم مضاد للأكسدة قوي يفتح البشرة ويوحد لونها مع تقليل ظهور الخطوط الدقيقة.',
    price: 350,
    compareAtPrice: 450,
    currency: 'EGP',
    images: [productSerum],
    category: 'serums',
    inStock: true,
    variants: [
      { id: 'var-1-1', title: '30ml', price: 350, compareAtPrice: 450, availableForSale: true },
      { id: 'var-1-2', title: '50ml', price: 520, compareAtPrice: 650, availableForSale: true },
    ],
  },
  {
    id: 'prod-2',
    handle: 'hydrating-day-cream',
    title: 'Hydrating Day Cream SPF 30',
    titleAr: 'كريم نهاري مرطب بعامل حماية 30',
    description: 'Lightweight moisturizer with sun protection. Perfect for daily use under makeup.',
    descriptionAr: 'مرطب خفيف مع حماية من الشمس. مثالي للاستخدام اليومي تحت المكياج.',
    price: 280,
    compareAtPrice: 350,
    currency: 'EGP',
    images: [productCream],
    category: 'moisturizers',
    inStock: true,
    variants: [
      { id: 'var-2-1', title: '50ml', price: 280, compareAtPrice: 350, availableForSale: true },
    ],
  },
  {
    id: 'prod-3',
    handle: 'gentle-foaming-cleanser',
    title: 'Gentle Foaming Cleanser',
    titleAr: 'غسول رغوي لطيف',
    description: 'A gentle yet effective cleanser that removes impurities without stripping the skin.',
    descriptionAr: 'غسول لطيف وفعال يزيل الشوائب دون تجفيف البشرة.',
    price: 180,
    compareAtPrice: 220,
    currency: 'EGP',
    images: [productCleanser],
    category: 'cleansers',
    inStock: true,
    variants: [
      { id: 'var-3-1', title: '150ml', price: 180, compareAtPrice: 220, availableForSale: true },
      { id: 'var-3-2', title: '250ml', price: 280, compareAtPrice: 350, availableForSale: true },
    ],
  },
  {
    id: 'prod-4',
    handle: 'collagen-booster',
    title: 'Collagen Booster Treatment',
    titleAr: 'علاج معزز الكولاجين',
    description: 'Advanced anti-aging treatment that stimulates collagen production for firmer, younger-looking skin.',
    descriptionAr: 'علاج متقدم لمكافحة الشيخوخة يحفز إنتاج الكولاجين لبشرة أكثر شباباً.',
    price: 550,
    compareAtPrice: 700,
    currency: 'EGP',
    images: [productBooster],
    category: 'treatments',
    inStock: true,
    variants: [
      { id: 'var-4-1', title: '30ml', price: 550, compareAtPrice: 700, availableForSale: true },
    ],
  },
  {
    id: 'prod-5',
    handle: 'hair-repair-treatment',
    title: 'Hair Repair Treatment',
    titleAr: 'علاج إصلاح الشعر',
    description: 'Intensive repair treatment for damaged hair. Restores shine and strength.',
    descriptionAr: 'علاج مكثف للشعر التالف. يستعيد اللمعان والقوة.',
    price: 420,
    compareAtPrice: 520,
    currency: 'EGP',
    images: [productTreatment],
    category: 'hair-care',
    inStock: true,
    variants: [
      { id: 'var-5-1', title: '100ml', price: 420, compareAtPrice: 520, availableForSale: true },
      { id: 'var-5-2', title: '200ml', price: 750, compareAtPrice: 950, availableForSale: true },
    ],
  },
  {
    id: 'prod-6',
    handle: 'retinol-night-cream',
    title: 'Retinol Night Cream',
    titleAr: 'كريم ليلي بالريتينول',
    description: 'Powerful night cream with retinol to reduce wrinkles and improve skin texture.',
    descriptionAr: 'كريم ليلي قوي بالريتينول لتقليل التجاعيد وتحسين ملمس البشرة.',
    price: 480,
    compareAtPrice: 600,
    currency: 'EGP',
    images: [productNightCream],
    category: 'moisturizers',
    inStock: true,
    variants: [
      { id: 'var-6-1', title: '50ml', price: 480, compareAtPrice: 600, availableForSale: true },
    ],
  },
];

// Fetch all products
export const fetchProducts = async (limit?: number): Promise<LocalProduct[]> => {
  // Simulate async fetch
  await new Promise(resolve => setTimeout(resolve, 100));
  return limit ? localProducts.slice(0, limit) : localProducts;
};

// Fetch single product by handle
export const fetchProductByHandle = async (handle: string): Promise<LocalProduct | null> => {
  await new Promise(resolve => setTimeout(resolve, 100));
  return localProducts.find(p => p.handle === handle) || null;
};

// Get products by category
export const getProductsByCategory = async (category: string): Promise<LocalProduct[]> => {
  await new Promise(resolve => setTimeout(resolve, 100));
  return localProducts.filter(p => p.category.toLowerCase() === category.toLowerCase());
};

// Get products by handles (for bundles)
export const getProductsByHandles = async (handles: string[]): Promise<LocalProduct[]> => {
  await new Promise(resolve => setTimeout(resolve, 100));
  return handles
    .map(handle => localProducts.find(p => p.handle === handle))
    .filter((p): p is LocalProduct => p !== undefined);
};
