import { createContext, useContext, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

const LanguageContext = createContext();

export const LANGUAGES = {
  en: { code: "en", name: "English", flag: "🇺🇸" },
  id: { code: "id", name: "Indonesia", flag: "🇮🇩" },
};

export function LanguageProvider({ children }) {
  const { i18n } = useTranslation();
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem("language");
    return saved || "en";
  });

  useEffect(() => {
    localStorage.setItem("language", language);
    i18n.changeLanguage(language);
  }, [language, i18n]);

  const changeLanguage = (lang) => {
    if (LANGUAGES[lang]) {
      setLanguage(lang);
    }
  };

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "en" ? "id" : "en"));
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        languages: LANGUAGES,
        changeLanguage,
        toggleLanguage,
        currentLanguage: LANGUAGES[language],
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

export default LanguageContext;
