import { RegistrationForm } from "@/app/_components/_website/_auth/_signup/_RegisterOrganization/RegistrationForm";
import FetchData from "@/app/_helpers/FetchData";
import { getSharedMetadata } from "@/app/_helpers/helpers";
import { category } from "@/app/types/_dashboard/GlobalTypes";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";

export async function generateMetadata() {
  const t = await getTranslations("metaSignupPage");
  const sharedMetadata = await getSharedMetadata(t("title"), t("description"));
  return {
    title: `${t("title")} - Center Account`,
    description: `${t("description")} - Center Account`,
    ...sharedMetadata,
  };
}

export default async function RegisterOrganizationPage({ params }: any) {
  const { locale } = await params;
  const categories = await FetchData(`/categories-with-subcategories`, false);

  const user = await FetchData(`/current-user`, false);

  if (user) redirect(`/${locale}`);

  return <RegistrationForm categories={categories as category[]} />;
}
