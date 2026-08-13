import React, { createContext, useContext, useEffect, useState } from "react";
import { translations } from "@/i18n";

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [lang, setLang] = useState(() => localStorage.getItem("lang") || "ar");
  const [favorites, setFavorites] = useState(() => {
    try { return JSON.parse(localStorage.getItem("favorites") || "[]"); } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem("lang", lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const toggleLang = () => setLang((l) => (l === "ar" ? "en" : "ar"));

  const toggleFavorite = (id) =>
    setFavorites((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]));

  const isFavorite = (id) => favorites.includes(id);

  const t = translations[lang];

  return (
    <AppContext.Provider value={{ lang, toggleLang, t, favorites, toggleFavorite, isFavorite }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
