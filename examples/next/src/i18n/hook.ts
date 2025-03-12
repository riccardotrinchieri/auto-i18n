import { useTranslations as useTranslationsNextIntl } from "next-intl";
import { decorateWithI18nLLM } from "./decorator";

export function useTranslations() {
  const t = useTranslationsNextIntl();
  return decorateWithI18nLLM(t);
}
