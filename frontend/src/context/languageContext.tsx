"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { dictionary } from ".././data/dictionary";

type LanguageType = keyof typeof dictionary;

interface LanguageContextProps {
  currentLang: LanguageType;
  setLanguage: (lang: LanguageType) => void;
  t: (key: keyof (typeof dictionary)["en"]) => string;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(
  undefined,
);

// Helper function to safely extract the language on initialization
const getInitialLanguage = (): LanguageType => {
  if (typeof window === "undefined") return "en";

  try {
    const savedLang = localStorage.getItem("nexus-core-lang") as LanguageType;
    if (savedLang && dictionary[savedLang]) {
      return savedLang;
    }
  } catch (error) {
    console.error("Failed to read from localStorage:", error);
  }

  return "en";
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // 1. Initialize state instantly on the first pass (No useEffect needed for state sync)
  const [currentLang, setCurrentLang] =
    useState<LanguageType>(getInitialLanguage);

  // 2. Synchronize the side effect (the DOM element attribute) to the document
  useEffect(() => {
    document.documentElement.lang = currentLang;
  }, [currentLang]); // Only syncs state outward to an external system, exactly as the error suggests!

  const setLanguage = (lang: LanguageType) => {
    setCurrentLang(lang);
    localStorage.setItem("nexus-core-lang", lang);
  };

  // 3. Translation resolver
  const t = (key: keyof (typeof dictionary)["en"]) => {
    return dictionary[currentLang][key] || dictionary["en"][key];
  };

  return (
    <LanguageContext.Provider value={{ currentLang, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context)
    throw new Error("useTranslation must be used within a LanguageProvider");
  return context;
};
