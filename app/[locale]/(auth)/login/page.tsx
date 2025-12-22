import { LoginForm } from "@/app/_components/_website/_auth/_login/LoginForm";
import FetchData from "@/app/_helpers/FetchData";
import { getSharedMetadata } from "@/app/_helpers/helpers";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import React from "react";

export async function generateMetadata() {
  const t = await getTranslations("metaLoginPage");
  const sharedMetadata = await getSharedMetadata(t("title"), t("description"));
  return {
    title: t("title"),
    description: t("description"),
    ...sharedMetadata,
  };
}

export default async function LoginPage({ params }: any) {
  const { locale } = await params;
  const user = await FetchData("/current-user", false);

  if (user && !user.error) redirect(`/${locale}`);

  return (
    <>
      <main className="min-h-screen bg-gray-50 mt-12 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl max-lg:mt-8 p-2 py-12 border border-gray-200 shadow-lg rounded-2xl">
          <LoginForm />
        </div>
      </main>
    </>
  );
}
