import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Sparkles, Droplets, Sun, Moon, Heart, Leaf } from 'lucide-react';

const categories = [
  {
    id: 1,
    slug: 'serums',
    nameEn: 'Serums',
    nameAr: 'سيروم',
    icon: Droplets,
    color: 'from-blue-500/20 to-blue-600/20',
    borderColor: 'border-blue-500/30',
  },
  {
    id: 2,
    slug: 'moisturizers',
    nameEn: 'Moisturizers',
    nameAr: 'مرطبات',
    icon: Heart,
    color: 'from-pink-500/20 to-pink-600/20',
    borderColor: 'border-pink-500/30',
  },
  {
    id: 3,
    slug: 'cleansers',
    nameEn: 'Cleansers',
    nameAr: 'منظفات',
    icon: Sparkles,
    color: 'from-purple-500/20 to-purple-600/20',
    borderColor: 'border-purple-500/30',
  },
  {
    id: 4,
    slug: 'sun-care',
    nameEn: 'Sun Care',
    nameAr: 'واقي شمس',
    icon: Sun,
    color: 'from-amber-500/20 to-amber-600/20',
    borderColor: 'border-amber-500/30',
  },
  {
    id: 5,
    slug: 'night-care',
    nameEn: 'Night Care',
    nameAr: 'عناية ليلية',
    icon: Moon,
    color: 'from-indigo-500/20 to-indigo-600/20',
    borderColor: 'border-indigo-500/30',
  },
  {
    id: 6,
    slug: 'natural',
    nameEn: 'Natural',
    nameAr: 'طبيعي',
    icon: Leaf,
    color: 'from-green-500/20 to-green-600/20',
    borderColor: 'border-green-500/30',
  },
];

const CategoriesSection = () => {
  const { language, t } = useLanguage();

  return (
    <section className="section-padding bg-secondary">
      <div className="container-custom">
        <div className="text-center mb-12">
          <span className="label-subtle mb-3 block">{t('Browse By', 'تصفحي حسب')}</span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-medium text-foreground">
            {t('Categories', 'الأقسام')}
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {categories.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <Link
                key={category.id}
                to={`/category/${category.slug}`}
                className="animate-fade-up opacity-0"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`group relative p-6 rounded-2xl bg-gradient-to-br ${category.color} border ${category.borderColor} transition-all duration-300 hover:scale-105 hover:shadow-card`}>
                  <div className="flex flex-col items-center text-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-background/80 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                      <IconComponent className="w-7 h-7 text-foreground" />
                    </div>
                    <h3 className="font-display text-lg font-medium text-foreground">
                      {language === 'ar' ? category.nameAr : category.nameEn}
                    </h3>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
