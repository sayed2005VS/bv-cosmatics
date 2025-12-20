import { useState } from 'react';
import ProductCard from './ProductCard';
import { products, categories } from '@/data/products';
import { useLanguage } from '@/contexts/LanguageContext';

const ProductsSection = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const { language, t } = useLanguage();

  const filteredProducts = activeCategory === 'all' 
    ? products 
    : products.filter(p => p.category === activeCategory);

  return (
    <section id="products" className="section-padding bg-background">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="label-subtle mb-3 block">{t('Our Collection', 'مجموعتنا')}</span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-medium text-foreground">
            {t('Premium Skincare', 'العناية الفاخرة بالبشرة')}
          </h2>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === category.id
                  ? 'bg-primary text-primary-foreground shadow-gold'
                  : 'bg-secondary text-secondary-foreground hover:bg-cream-dark'
              }`}
            >
              {language === 'ar' ? category.nameAr : category.name}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {filteredProducts.map((product, index) => (
            <div 
              key={product.id}
              className="animate-fade-up opacity-0"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;
