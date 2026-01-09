import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { translations, Language, TranslationKey } from './translations';

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

const I18nContext = createContext<I18nContextType | null>(null);

const STORAGE_KEY = 'dbd-blindtest-language';

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    // Try to get from localStorage
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'en' || stored === 'fr') {
      return stored;
    }
    // Try to detect from browser
    const browserLang = navigator.language.split('-')[0];
    if (browserLang === 'fr') {
      return 'fr';
    }
    return 'en';
  });

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(STORAGE_KEY, lang);
  }, []);

  const t = useCallback((key: TranslationKey): string => {
    return translations[language][key] || translations.en[key] || key;
  }, [language]);

  // Persist language choice
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, language);
  }, [language]);

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}
