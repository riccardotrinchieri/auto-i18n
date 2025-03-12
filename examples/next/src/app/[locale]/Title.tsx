import { useTranslations } from "@/i18n/hook";

export const Title = () => {
  const t = useTranslations();
  return <h1>{t("Homepage-->Hi I am Riccardo $dot How are you?")}</h1>;
};
