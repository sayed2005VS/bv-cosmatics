// Category Bundles Configuration
// Define product handles and discount percentages for each category

export interface CategoryBundle {
  categorySlug: string;
  titleEn: string;
  titleAr: string;
  descriptionEn: string;
  descriptionAr: string;
  productHandles: string[]; // Shopify product handles
  discountPercentage: number; // e.g., 20 means 20% off
}

export const CATEGORY_BUNDLES: CategoryBundle[] = [
  {
    categorySlug: 'hair-care',
    titleEn: 'Hair Care Set',
    titleAr: 'مجموعة العناية بالشعر',
    descriptionEn: 'Complete hair care routine',
    descriptionAr: 'روتين كامل للعناية بالشعر',
    productHandles: [
      'hair-mask-xpresso',
      'conditioner-xpresso',
      'shampoo-xpresso',
    ],
    discountPercentage: 20,
  },
  {
    categorySlug: 'skin-care',
    titleEn: 'Skin Care Set',
    titleAr: 'مجموعة العناية بالبشرة',
    descriptionEn: 'Complete skincare routine',
    descriptionAr: 'روتين كامل للعناية بالبشرة',
    productHandles: [
      // Add your skin care product handles here
      'product-handle-1',
      'product-handle-2',
      'product-handle-3',
    ],
    discountPercentage: 15,
  },
  {
    categorySlug: 'serums',
    titleEn: 'Serum Collection',
    titleAr: 'مجموعة السيروم',
    descriptionEn: 'Premium serum bundle',
    descriptionAr: 'باقة سيروم مميزة',
    productHandles: [
      // Add your serum product handles here
      'serum-handle-1',
      'serum-handle-2',
    ],
    discountPercentage: 25,
  },
  {
    categorySlug: 'body-care',
    titleEn: 'Body Care Set',
    titleAr: 'مجموعة العناية بالجسم',
    descriptionEn: 'Luxurious body care bundle',
    descriptionAr: 'باقة فاخرة للعناية بالجسم',
    productHandles: [
      // Add your body care product handles here
      'body-product-1',
      'body-product-2',
    ],
    discountPercentage: 18,
  },
];

// Helper function to get bundle by category slug
export const getBundleByCategory = (categorySlug: string): CategoryBundle | undefined => {
  return CATEGORY_BUNDLES.find(
    bundle => bundle.categorySlug.toLowerCase() === categorySlug.toLowerCase()
  );
};

// Helper function to calculate bundle pricing
export const calculateBundlePrice = (
  originalTotal: number,
  discountPercentage: number
): { bundlePrice: number; savings: number } => {
  const bundlePrice = originalTotal * (1 - discountPercentage / 100);
  const savings = originalTotal - bundlePrice;
  return { bundlePrice, savings };
};
