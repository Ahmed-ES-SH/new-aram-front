import { useSearchParams, useRouter, usePathname } from "next/navigation";
import React from "react";

export default function LanguageBtns() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // ✅ تغيير اللغة
  const handleChangeLanguage = (locale: "en" | "ar") => {
    // URLSearchParams object

    const pathWithoutLocale = pathname.split("/").slice(2).join("/");
    const queryString = searchParams.toString();

    router.push(
      `/${locale}/${pathWithoutLocale}${queryString ? "?" + queryString : ""}`
    );
  };

  return (
    <>
      <p
        onClick={() => handleChangeLanguage("en")}
        className="hover:underline underline-gray-300 cursor-pointer text-sm"
      >
        English
      </p>
      <p
        onClick={() => handleChangeLanguage("ar")}
        className="hover:underline underline-gray-300 cursor-pointer text-sm"
      >
        العربية
      </p>
    </>
  );
}
