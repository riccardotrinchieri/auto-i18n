import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import enTranslation from "./locales/en.json";
import itTranslation from "./locales/it.json";
import frTranslation from "./locales/fr.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    detection: { order: ["navigator"] },
    resources: {
      en: {
        translation: enTranslation,
      },
      it: {
        translation: itTranslation,
      },
      fr: {
        translation: frTranslation,
      },
    },
    fallbackLng: "en",
    supportedLngs: ["en", "it", "fr"],
    keySeparator: "-->",
    nsSeparator: "==>",
  });

export default i18n;
