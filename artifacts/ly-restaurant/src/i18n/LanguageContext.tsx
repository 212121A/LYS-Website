import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import translations, { LangCode, Translations } from "./translations";

interface LanguageContextType {
  lang: LangCode;
  setLang: (l: LangCode) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "de",
  setLang: () => {},
  t: translations.de,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<LangCode>(() => {
    const saved = localStorage.getItem("lys_lang");
    return (saved as LangCode) ?? "de";
  });

  const setLang = (l: LangCode) => {
    setLangState(l);
    localStorage.setItem("lys_lang", l);
    document.documentElement.dir = translations[l].dir;
    document.documentElement.lang = l;
  };

  useEffect(() => {
    document.documentElement.dir = translations[lang].dir;
    document.documentElement.lang = lang;
  }, []);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
