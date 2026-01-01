
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TRANSLATIONS } from './translations';
// Fixed: Imported missing locales and types from specific entry points to resolve missing export errors.
import { enUS } from 'date-fns/locale/en-US';
import { fr } from 'date-fns/locale/fr';
import { zhCN } from 'date-fns/locale/zh-CN';

// Fixed: Defined Locale type based on enUS to avoid missing 'Locale' export from date-fns root in some versions or environments.
type Locale = typeof enUS;

export type Language = 'en' | 'fr' | 'zh';

interface I18nState {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof TRANSLATIONS.en) => string;
  getDateLocale: () => Locale;
}

export const useI18nStore = create<I18nState>()(
  persist(
    (set, get) => ({
      language: 'en',
      setLanguage: (language) => set({ language }),
      t: (key) => {
        const lang = get().language;
        // Fallback to English if translation is missing for the active language
        return (TRANSLATIONS[lang] as any)[key] || TRANSLATIONS['en'][key] || key;
      },
      getDateLocale: () => {
        const lang = get().language;
        switch(lang) {
          case 'fr': return fr;
          case 'zh': return zhCN;
          default: return enUS;
        }
      }
    }),
    { name: 'avry-i18n' }
  )
);
