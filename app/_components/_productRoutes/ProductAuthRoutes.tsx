import FetchData from "@/app/_helpers/FetchData";
import { redirect } from "next/navigation";
import React from "react";

export default async function ProductAuthRoutes({
  children,
  locale = "en",
}: {
  locale?: "en" | "ar";
  children: React.ReactNode;
}) {
  const user = await FetchData(`/current-user`, false);

  if (!user) {
    redirect(`/${locale}/login`);
  }

  return <>{children}</>;
}
