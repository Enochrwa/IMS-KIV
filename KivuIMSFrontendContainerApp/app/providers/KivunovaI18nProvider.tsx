import React, { useState } from "react";
import i18n from "i18next";
import {
  KivuI18nContext,
  LOCALE,
  SUPPORTED_LOCALE
} from "@kivunova/kivufrontendcommon";

export const KivunovaI18nProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const DEFAULT_LANG =
    import.meta.env.VITE_S3_DEFAULT_LANG || SUPPORTED_LOCALE[0];

  // Determine the authoritative current language
  const cachedLang = localStorage.getItem("lang");

  const [language, setLanguage] = useState<LOCALE>(
    cachedLang || i18n.language || DEFAULT_LANG
  );

  return (
    <KivuI18nContext.Provider
      value={{ language, setLanguage, defaultLang: DEFAULT_LANG }}
    >
      {children}
    </KivuI18nContext.Provider>
  );
};
