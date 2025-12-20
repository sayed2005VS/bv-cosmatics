import { Share2, Facebook, MessageCircle, Link2, Check } from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

interface SocialShareProps {
  productTitle: string;
  productUrl: string;
}

const SocialShare = ({ productTitle, productUrl }: SocialShareProps) => {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);

  const encodedTitle = encodeURIComponent(productTitle);
  const encodedUrl = encodeURIComponent(productUrl);

  const shareLinks = [
    {
      name: 'Facebook',
      icon: Facebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      url: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    },
  ];

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(productUrl);
      setCopied(true);
      toast.success(t('Link copied!', 'تم نسخ الرابط!'));
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error(t('Failed to copy', 'فشل النسخ'));
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
          <Share2 className="w-5 h-5" />
          <span className="text-sm">{t('Share', 'مشاركة')}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {shareLinks.map((link) => (
          <DropdownMenuItem key={link.name} asChild>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 cursor-pointer"
            >
              <link.icon className="w-4 h-4" />
              {link.name}
            </a>
          </DropdownMenuItem>
        ))}
        <DropdownMenuItem onClick={copyToClipboard} className="flex items-center gap-2 cursor-pointer">
          {copied ? <Check className="w-4 h-4" /> : <Link2 className="w-4 h-4" />}
          {t('Copy Link', 'نسخ الرابط')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SocialShare;
