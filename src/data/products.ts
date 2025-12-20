import productCleanser from '@/assets/product-cleanser.png';
import productSerum from '@/assets/product-serum.png';
import productCream from '@/assets/product-cream.png';
import productTreatment from '@/assets/product-treatment.png';
import productBooster from '@/assets/product-booster.png';
import productNightCream from '@/assets/product-night-cream.png';
import customer1 from '@/assets/customer-1.png';
import customer2 from '@/assets/customer-2.png';
import customer3 from '@/assets/customer-3.png';

export interface Product {
  id: string;
  name: string;
  nameAr: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  size?: string;
  badge?: string;
  badgeAr?: string;
}

export interface Bundle {
  id: string;
  name: string;
  nameAr: string;
  label: string;
  labelAr: string;
  headline: string;
  headlineAr: string;
  products: {
    id: string;
    name: string;
    nameAr: string;
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
  customerImage: string;
  rating: number;
  review: string;
  reviewAr: string;
  productName: string;
  productNameAr: string;
  productType: 'single' | 'bundle';
  productImage: string;
}

export const categories = [
  { id: 'all', name: 'All Products', nameAr: 'جميع المنتجات' },
  { id: 'cleansers', name: 'Cleansers', nameAr: 'المنظفات' },
  { id: 'serums', name: 'Serums', nameAr: 'السيروم' },
  { id: 'moisturizers', name: 'Moisturizers', nameAr: 'المرطبات' },
  { id: 'treatments', name: 'Treatments', nameAr: 'العلاجات' },
];

export const products: Product[] = [
  {
    id: '1',
    name: 'Gentle Foam Cleanser',
    nameAr: 'غسول رغوي لطيف',
    price: 89,
    image: productCleanser,
    category: 'cleansers',
    size: '150ml',
    badge: 'Best Seller',
    badgeAr: 'الأكثر مبيعاً',
  },
  {
    id: '2',
    name: 'Vitamin C Brightening Serum',
    nameAr: 'سيروم فيتامين سي للتفتيح',
    price: 149,
    image: productSerum,
    category: 'serums',
    size: '30ml',
    badge: 'New',
    badgeAr: 'جديد',
  },
  {
    id: '3',
    name: 'Hydrating Day Cream',
    nameAr: 'كريم نهاري مرطب',
    price: 119,
    image: productCream,
    category: 'moisturizers',
    size: '50ml',
  },
  {
    id: '4',
    name: 'Retinol Night Treatment',
    nameAr: 'علاج الريتينول الليلي',
    price: 179,
    originalPrice: 199,
    image: productTreatment,
    category: 'treatments',
    size: '30ml',
  },
  {
    id: '5',
    name: 'Hyaluronic Acid Booster',
    nameAr: 'معزز حمض الهيالورونيك',
    price: 129,
    image: productBooster,
    category: 'serums',
    size: '30ml',
  },
  {
    id: '6',
    name: 'Nourishing Night Cream',
    nameAr: 'كريم ليلي مغذي',
    price: 139,
    image: productNightCream,
    category: 'moisturizers',
    size: '50ml',
  },
];

export const bundle: Bundle = {
  id: 'bundle-1',
  name: 'Complete Glow Routine',
  nameAr: 'روتين التوهج الكامل',
  label: 'Best-Selling Routine',
  labelAr: 'الروتين الأكثر مبيعاً',
  headline: 'Your Complete Path to Radiant Skin',
  headlineAr: 'طريقك الكامل للبشرة المشرقة',
  products: [
    { id: '1', name: 'Gentle Foam Cleanser', nameAr: 'غسول رغوي لطيف', size: '150ml', price: 69, originalPrice: 89, image: productCleanser },
    { id: '2', name: 'Vitamin C Serum', nameAr: 'سيروم فيتامين سي', size: '30ml', price: 119, originalPrice: 149, image: productSerum },
    { id: '3', name: 'Hydrating Day Cream', nameAr: 'كريم نهاري مرطب', size: '50ml', price: 99, originalPrice: 119, image: productCream },
  ],
  totalPrice: 287,
  originalTotal: 357,
};

export const testimonials: Testimonial[] = [
  {
    id: '1',
    customerName: 'Sarah M.',
    customerImage: customer1,
    rating: 5,
    review: 'My skin has never looked better. Visible results in just 2 weeks!',
    reviewAr: 'بشرتي لم تبدو أفضل من هذا أبداً. نتائج ملحوظة في أسبوعين فقط!',
    productName: 'Vitamin C Brightening Serum',
    productNameAr: 'سيروم فيتامين سي للتفتيح',
    productType: 'single',
    productImage: productSerum,
  },
  {
    id: '2',
    customerName: 'Nour A.',
    customerImage: customer2,
    rating: 5,
    review: 'The complete routine transformed my skincare game. Worth every penny.',
    reviewAr: 'الروتين الكامل غيّر طريقة عنايتي ببشرتي. يستحق كل قرش.',
    productName: 'Complete Glow Routine',
    productNameAr: 'روتين التوهج الكامل',
    productType: 'bundle',
    productImage: productCream,
  },
  {
    id: '3',
    customerName: 'Layla K.',
    customerImage: customer3,
    rating: 5,
    review: 'Finally found a cleanser that doesn\'t dry out my skin!',
    reviewAr: 'أخيراً وجدت غسول لا يجفف بشرتي!',
    productName: 'Gentle Foam Cleanser',
    productNameAr: 'غسول رغوي لطيف',
    productType: 'single',
    productImage: productCleanser,
  },
];

export const heroSlides = [
  {
    id: '1',
    label: 'New Launch',
    labelAr: 'إطلاق جديد',
  },
  {
    id: '2',
    label: 'Best Sellers',
    labelAr: 'الأكثر مبيعاً',
  },
  {
    id: '3',
    label: 'Special Offer',
    labelAr: 'عرض خاص',
  },
];
