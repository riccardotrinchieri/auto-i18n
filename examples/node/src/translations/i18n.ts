import i18n from "i18next";

import enTranslation from "./locales/en.json";
import itTranslation from "./locales/it.json";

i18n.init({
  detection: { order: ["navigator"] },
  resources: {
    en: {
      translation: enTranslation,
    },
    it: {
      translation: itTranslation,
    },
  },
  fallbackLng: "en",
  supportedLngs: ["en", "it", "fr"],
  keySeparator: "-->",
  nsSeparator: "==>",
});

export default i18n;
