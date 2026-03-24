"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { t, type Lang, type TranslationKey } from "./translations";

type Theme = "dark" | "light";

interface LanguageContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: TranslationKey) => string;
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "zh",
  setLang: () => {},
  t: (key) => key,
  theme: "dark",
  setTheme: () => {},
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("zh");
  const [theme, setThemeState] = useState<Theme>("dark");

  useEffect(() => {
    const savedLang = localStorage.getItem("lang") as Lang | null;
    if (savedLang === "zh" || savedLang === "en") setLangState(savedLang);

    const savedTheme = localStorage.getItem("theme") as Theme | null;
    if (savedTheme === "light") {
      setThemeState("light");
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
    }
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("lang", l);
  };

  const setTheme = (t: Theme) => {
    setThemeState(t);
    localStorage.setItem("theme", t);
    if (t === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: (key) => t(key, lang), theme, setTheme }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
