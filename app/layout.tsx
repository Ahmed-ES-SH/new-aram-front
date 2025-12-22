import { getTranslations } from "next-intl/server";
import { getSharedMetadata } from "./_helpers/helpers";

export async function generateMetadata() {
  const t = await getTranslations("metaLayoutContent");
  const sharedMetadata = await getSharedMetadata(t("title"), t("description"));
  return {
    title: t("title"),
    description: t("description"),
    icons: {
      icon: "https://aram-gulf.com/favicon.ico",
      shortcut: "https://aram-gulf.com/logo-16x16.png",
      apple: "https://aram-gulf.com/apple-touch-icon.png",
    },
    ...sharedMetadata,
  };
}

export default function layout({ children }) {
  return <>{children}</>;
}
