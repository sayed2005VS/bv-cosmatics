import { Menu, Globe } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { CartDrawer } from './CartDrawer';
import { MobileNav } from './MobileNav';

interface HeaderProps {
  isTransparent?: boolean;
}

const Header = ({ isTransparent = false }: HeaderProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleLanguage = () => {
    setLanguage(language === 'ar' ? 'en' : 'ar');
  };

  // Determine if header should be transparent (only when at top AND isTransparent prop is true)
  const showTransparent = isTransparent && !isScrolled;

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          showTransparent 
            ? 'bg-transparent' 
            : 'bg-background/80 backdrop-blur-md border-b border-border/50 shadow-soft'
        }`}
        style={{ transition: 'var(--transition-header)' }}
      >
        <div className="container-custom">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className={`md:hidden p-2 transition-colors ${
                showTransparent 
                  ? 'text-white hover:text-white/80' 
                  : 'text-foreground hover:text-primary'
              }`}
              aria-label="Toggle menu"
            >
              <Menu size={24} />
            </button>

            {/* Logo */}
            <a 
              href="/" 
              className={`font-display text-xl md:text-2xl font-semibold tracking-tight transition-colors ${
                showTransparent ? 'text-white drop-shadow-lg' : 'text-foreground'
              }`}
            >
              BV-Cosmatics
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <a 
                href="#products" 
                className={`font-body text-sm font-medium transition-colors ${
                  showTransparent 
                    ? 'text-white/90 hover:text-white' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {t('Products', 'المنتجات')}
              </a>
              <a 
                href="#bundles" 
                className={`font-body text-sm font-medium transition-colors ${
                  showTransparent 
                    ? 'text-white/90 hover:text-white' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {t('Sets', 'المجموعات')}
              </a>
              <a 
                href="#testimonials" 
                className={`font-body text-sm font-medium transition-colors ${
                  showTransparent 
                    ? 'text-white/90 hover:text-white' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {t('Reviews', 'التقييمات')}
              </a>
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              {/* Language Switcher */}
              <button 
                onClick={toggleLanguage}
                className={`flex items-center gap-1.5 p-2 transition-colors ${
                  showTransparent 
                    ? 'text-white hover:text-white/80' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Globe size={18} />
                <span className="hidden sm:inline text-sm font-medium">
                  {language === 'ar' ? 'EN' : 'عربي'}
                </span>
              </button>

              {/* Cart */}
              <CartDrawer forceWhite={showTransparent} />
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Side Drawer Navigation */}
      <MobileNav 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />
    </>
  );
};

export default Header;
