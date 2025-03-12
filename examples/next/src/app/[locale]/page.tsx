import { getTranslations } from "next-intl/server";
import { APiButton } from "./ApiButton";
import { Title } from "./Title";

export default async function HomePage() {
  const t = await getTranslations("");
  return (
    <div>
      <div>{t("This happens in an async component")}</div>
      <Title />
      <APiButton />
    </div>
  );
}
