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
    customerName: 'mero sam',
    customerImage: customer1,
    rating: 5,
    review: 'It was a unique experience that I loved very much',
    reviewAr: 'كانت تجربة فريدة أحببتها جداً',
    productName: 'Hair Care Set',
    productNameAr: 'مجموعة العناية بالشعر',
    productType: 'bundle',
    productImage: productSerum,
  },
  {
    id: '2',
    customerName: 'sama ahmed',
    customerImage: customer2,
    rating: 5,
    review: "It's really beautiful, and I liked it very much, and I'll use all of your products seriously",
    reviewAr: 'المنتج جميل بجد، وعجبني جدًا، وأنا ناوية أستخدم كل منتجاتكم بجد ومن غير تردد.',
    productName: 'Hair Care Set',
    productNameAr: 'مجموعة العناية بالشعر',
    productType: 'bundle',
    productImage: productCream,
  },
  {
    id: '3',
    customerName: 'rahma samy',
    customerImage: customer3,
    rating: 5,
    review: 'More than wonderful, my daughter and I used it and made our hair wonderful and its smell was great, it gave a beautiful shine and clear moisturising, long-lasting in the hair',
    reviewAr: 'أكتر من رائع، أنا وبنتي استخدمناه وخلى شعرنا جميل جدًا، وريحتُه تحفة، وادى لمعة حلوة وترطيب واضح وبيفضل تأثيره في الشعر فترة طويلة.',
    productName: 'Hair Care Set',
    productNameAr: 'مجموعة العناية بالشعر',
    productType: 'bundle',
    productImage: productCleanser,
  },
  {
    id: '4',
    customerName: 'sara Emam',
    customerImage: customer1,
    rating: 5,
    review: 'I specialise in the world of beauty and it was difficult to have a group of hair care products like this product, it was really interesting when used, I will continue to use this product, it made my hair breathe',
    reviewAr: 'أنا شغلي في مجال التجميل، وكان صعب ألاقي مجموعة منتجات عناية بالشعر بالجودة دي، بجد كانت تجربة ممتعة، وهكمّل استخدم المنتج ده، وحسّيت إنه خلّى شعري يتنفس.',
    productName: 'Hair Care Set',
    productNameAr: 'مجموعة العناية بالشعر',
    productType: 'bundle',
    productImage: productSerum,
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
