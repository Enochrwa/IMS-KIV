import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-http-backend";
import { I18N_NAMESPACE, SUPPORTED_LOCALE } from "@kivunova/kivufrontendcommon";

const S3_BASE_URL =
  import.meta.env.VITE_S3_TRANSLATION_BUCKET ||
  "https://default-bucket.s3.amazonaws.com";

const DEFAULT_LANG =
  import.meta.env.VITE_S3_DEFAULT_LANG || SUPPORTED_LOCALE[0];

i18n
  .use(Backend) // 👈 fetch from S3
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    lng: DEFAULT_LANG,
    fallbackLng: DEFAULT_LANG,
    supportedLngs: SUPPORTED_LOCALE,
    fallbackNS: false,
    ns: [I18N_NAMESPACE],
    defaultNS: I18N_NAMESPACE,
    interpolation: {
      escapeValue: false
    },
    detection: {
      // Prioritize URL path first, then localStorage, then navigator
      order: ["path", "localStorage", "navigator"],
      lookupFromPathIndex: 0,
      caches: ["localStorage"]
    },
    backend: { loadPath: `${S3_BASE_URL}/i18n/{{lng}}/{{ns}}.json` }
  });

export default i18n;
