import { ShoppingBag, Menu, X, Globe } from 'lucide-react';
import { useState } from 'react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
          <a href="/" className="font-display text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
            Lumière
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#products" className="font-body text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Products
            </a>
            <a href="#bundles" className="font-body text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Sets
            </a>
            <a href="#testimonials" className="font-body text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Reviews
            </a>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Language Switcher */}
            <button className="flex items-center gap-1.5 p-2 text-muted-foreground hover:text-foreground transition-colors">
              <Globe size={18} />
              <span className="hidden sm:inline text-sm font-medium">EN</span>
            </button>

            {/* Cart */}
            <button className="relative p-2 text-foreground hover:text-primary transition-colors">
              <ShoppingBag size={22} />
              <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-primary text-primary-foreground text-xs font-semibold rounded-full flex items-center justify-center">
                2
              </span>
            </button>
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
                Products
              </a>
              <a 
                href="#bundles" 
                className="font-body text-base font-medium text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Sets
              </a>
              <a 
                href="#testimonials" 
                className="font-body text-base font-medium text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Reviews
              </a>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
