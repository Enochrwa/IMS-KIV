// src/components/LanguageLayout.jsx
import React, { useContext, useEffect } from "react";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import i18n from "i18next";
import {
  getCurrentLocale,
  KivuI18nContext,
  LOCALE,
  SUPPORTED_LOCALE
} from "@kivunova/kivufrontendcommon";

const LanguageLayout = () => {
  const { lang } = useParams();
  const isValidLang = lang && SUPPORTED_LOCALE.includes(lang as LOCALE);
  const { setLanguage, language, defaultLang } = useContext(KivuI18nContext);
  const currentLocale = getCurrentLocale(defaultLang);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (setLanguage) {
      if (isValidLang) {
        setLanguage(lang as LOCALE);
      } else {
        // Determine the authoritative current language

        setLanguage(currentLocale);
      }
    }
  }, [lang]);

  /** 🔁 Whenever language changes, update i18n + localStorage */
  useEffect(() => {
    if (language) {
      if (i18n.language !== language) {
        i18n.changeLanguage(language);
      }
      localStorage.setItem("lang", language);
    }
  }, [language]);

  /** 🚦 Redirect if the URL uses default lang (hide it in path) */
  useEffect(() => {
    if (lang === defaultLang) {
      const cleanPath = location.pathname.replace(`/${defaultLang}`, "") || "/";
      navigate(cleanPath, { replace: true });
    }
  }, [lang, defaultLang, location.pathname, navigate]);

  return (
    <>
      {/*
        This is where your shared UI (like Navbar) would go if it needs to be
        aware of the `lang` parameter. Otherwise, place it outside the Routes.
      */}
      <Outlet />
    </>
  );
};

export default LanguageLayout;
