import { Menu, X, Globe } from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { CartDrawer } from './CartDrawer';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'ar' ? 'en' : 'ar');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-foreground hover:text-primary transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Logo */}
          <a href="/" className="font-display text-xl md:text-2xl font-semibold tracking-tight text-foreground">
            BV-Cosmatics
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#products" className="font-body text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              {t('Products', 'المنتجات')}
            </a>
            <a href="#bundles" className="font-body text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              {t('Sets', 'المجموعات')}
            </a>
            <a href="#testimonials" className="font-body text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              {t('Reviews', 'التقييمات')}
            </a>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Language Switcher */}
            <button 
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 p-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Globe size={18} />
              <span className="hidden sm:inline text-sm font-medium">{language === 'ar' ? 'EN' : 'عربي'}</span>
            </button>

            {/* Cart */}
            <CartDrawer />
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-border/50 animate-fade-in">
            <div className="flex flex-col gap-4">
              <a 
                href="#products" 
                className="font-body text-base font-medium text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('Products', 'المنتجات')}
              </a>
              <a 
                href="#bundles" 
                className="font-body text-base font-medium text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('Sets', 'المجموعات')}
              </a>
              <a 
                href="#testimonials" 
                className="font-body text-base font-medium text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('Reviews', 'التقييمات')}
              </a>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
