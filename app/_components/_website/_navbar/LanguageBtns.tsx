"use client";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Cookie from "cookie-universal";

export default function LanguageBtns() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const cookie = Cookie();

  // ✅ تغيير اللغة
  const handleChangeLanguage = (locale: "en" | "ar") => {
    // URLSearchParams object

    const pathWithoutLocale = pathname.split("/").slice(2).join("/");
    const queryString = searchParams.toString();

    cookie.set("aram_locale", locale);
    router.push(
      `/${locale}/${pathWithoutLocale}${queryString ? "?" + queryString : ""}`
    );
    router.refresh();
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
