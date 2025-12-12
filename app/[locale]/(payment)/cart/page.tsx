import CartPageComponent from "@/app/_components/_website/_cart/CartPageComponent";
import { getSharedMetadata } from "@/app/_helpers/helpers";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations("metaCartPage");
  const sharedMetadata = await getSharedMetadata(t("title"), t("description"));
  return {
    title: t("title"),
    description: t("description"),
    ...sharedMetadata,
  };
}

export default async function CartPage({ params }: any) {
  const { locale } = await params;
  return <CartPageComponent locale={locale} />;
}
