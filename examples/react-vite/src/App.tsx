import { useTranslation } from "react-i18next";
import "./translations/i18n";
import i18n from "./translations/i18n";

function App() {
  const { t } = useTranslation();

  return (
    <>
      <div>current language: {i18n.language}</div>
      <div>{t("Hello")}</div>
      <div>{t("homepage-->tile-->HELLO WORLD")}</div>
      <div>{t("homepage-->text-->How are you?")}</div>

      <div>{t("settings-->Language")}</div>
      <div>{t("settings-->Account")}</div>

      <div>{t("upgrade-plan-->Thank you for upgrading your plan!")}</div>

      <div>
        {t("upgrade-plan-->Upgrade your plane to unlock beautifull features")}
      </div>
    </>
  );
}

export default App;
