import { getTranslations as getTranslationsNextIntl } from "next-intl/server";
import { decorateWithI18nLLM } from "./decorator";

export const getTranslations = async () => {
  const t = await getTranslationsNextIntl();
  return decorateWithI18nLLM(t);
};
