import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import arTranslations from '@/locales/ar.json';
import enTranslations from '@/locales/en.json';

type Language = 'ar' | 'en';

type NestedObject = { [key: string]: string | NestedObject };

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (keyOrEn: string, ar?: string) => string;
  isRTL: boolean;
}

const translations: Record<Language, NestedObject> = {
  ar: arTranslations,
  en: enTranslations,
};

const getNestedValue = (obj: NestedObject, path: string): string | null => {
  const keys = path.split('.');
  let result: string | NestedObject = obj;
  
  for (const key of keys) {
    if (result && typeof result === 'object' && key in result) {
      result = result[key];
    } else {
      return null;
    }
  }
  
  return typeof result === 'string' ? result : null;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('ar');

  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  // Supports both formats:
  // New: t('product.description') - uses translation files
  // Legacy: t('English text', 'Arabic text') - inline translations
  const t = (keyOrEn: string, ar?: string): string => {
    // If second argument provided, use legacy inline format
    if (ar !== undefined) {
      return language === 'ar' ? ar : keyOrEn;
    }
    
    // Otherwise, try to get from translation files
    const value = getNestedValue(translations[language], keyOrEn);
    return value ?? keyOrEn;
  };

  const isRTL = language === 'ar';

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
