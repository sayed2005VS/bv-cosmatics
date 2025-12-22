import { X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileNav = ({ isOpen, onClose }: MobileNavProps) => {
  const { t, isRTL } = useLanguage();

  const navLinks = [
    { href: '#products', label: t('Products', 'المنتجات') },
    { href: '#bundles', label: t('Sets', 'المجموعات') },
    { href: '#testimonials', label: t('Reviews', 'التقييمات') },
  ];

  const handleLinkClick = () => {
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent 
        side={isRTL ? 'right' : 'left'} 
        className="w-[280px] p-0 bg-background/95 backdrop-blur-xl"
      >
        <SheetHeader className="p-6 pb-4 border-b border-border/50">
          <SheetTitle className="font-display text-xl font-semibold text-foreground text-start">
            BV-Cosmatics
          </SheetTitle>
        </SheetHeader>

        <nav className="flex flex-col p-6 gap-1">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={handleLinkClick}
              className="flex items-center px-4 py-3 rounded-xl font-body text-base font-medium text-foreground hover:bg-secondary hover:text-primary transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
};
