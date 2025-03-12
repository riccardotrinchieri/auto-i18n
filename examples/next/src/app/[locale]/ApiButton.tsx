"use client";
import { useTranslations } from "@/i18n/hook";

export const APiButton = () => {
  const t = useTranslations();

  return (
    <button
      onClick={() =>
        fetch("api").then(async (res) => {
          const responseBody = await res.json();

          /* i18next-extract-disable-next-line */
          alert(t(responseBody.message));
        })
      }
    >
      {t("Click me")}
    </button>
  );
};
