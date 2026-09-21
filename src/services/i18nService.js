// src/services/i18nService.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import translationsData from '../data/translations.json';

export const SUPPORTED_LANGUAGES = translationsData.languages || [
  { code: 'en', label: 'English', badge: 'EN' },
  { code: 'hi', label: 'हिन्दी', badge: 'हिन्दी' }
];

const DEFAULT_LANG = 'en';
const STORAGE_KEY = 'school_app_preferred_lang';

/**
 * Core translation resolver with parameter interpolation
 * @param {string} lang - 'en' | 'hi' (or any future language code)
 * @param {string} path - dot separated path (e.g. 'parent.childLunchBox')
 * @param {string} fallback - fallback string if key not found
 * @param {Object} params - optional replacement parameters { name: 'Aarav' }
 * @returns {string} translated text
 */
export function t(lang = DEFAULT_LANG, path = '', fallback = '', params = null) {
  const currentLang = translationsData[lang] ? lang : DEFAULT_LANG;
  const parts = path.split('.');
  
  let current = translationsData[currentLang];
  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = current[part];
    } else {
      current = null;
      break;
    }
  }

  // Fallback to English if key missing in selected language
  if (current === null || typeof current === 'undefined') {
    let engVal = translationsData[DEFAULT_LANG];
    for (const part of parts) {
      if (engVal && typeof engVal === 'object' && part in engVal) {
        engVal = engVal[part];
      } else {
        engVal = null;
        break;
      }
    }
    current = engVal;
  }

  let result = current !== null && typeof current !== 'undefined' ? current : (fallback || path);

  // Parameter interpolation: replace {name}, {count}, etc.
  if (params && typeof result === 'string') {
    Object.keys(params).forEach((k) => {
      result = result.replace(new RegExp(`\\{${k}\\}`, 'g'), params[k]);
    });
  }

  return result;
}

// React Context for Multi-Language State
const I18nContext = createContext({
  lang: DEFAULT_LANG,
  setLang: () => {},
  t: (path, fallback, params) => t(DEFAULT_LANG, path, fallback, params),
  supportedLanguages: SUPPORTED_LANGUAGES
});

export function I18nProvider({ children, defaultLanguage = DEFAULT_LANG }) {
  const [lang, setLangState] = useState(() => {
    try {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved && translationsData[saved]) return saved;
      }
    } catch (e) {
      // Fallback to default
    }
    return defaultLanguage;
  });

  const setLang = (newLang) => {
    if (translationsData[newLang]) {
      setLangState(newLang);
      try {
        if (typeof window !== 'undefined') {
          localStorage.setItem(STORAGE_KEY, newLang);
        }
      } catch (e) {
        // ignore
      }
    }
  };

  const translate = (path, fallback, params) => t(lang, path, fallback, params);

  return React.createElement(
    I18nContext.Provider,
    {
      value: {
        lang,
        setLang,
        t: translate,
        supportedLanguages: SUPPORTED_LANGUAGES
      }
    },
    children
  );
}

/**
 * React Hook to access multi-language functions in any component
 */
export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    return {
      lang: DEFAULT_LANG,
      setLang: () => {},
      t: (path, fallback, params) => t(DEFAULT_LANG, path, fallback, params),
      supportedLanguages: SUPPORTED_LANGUAGES
    };
  }
  return ctx;
}

export const I18nService = {
  t,
  SUPPORTED_LANGUAGES,
  DEFAULT_LANG,
  getRawData: () => translationsData
};

export default I18nService;
