"use client";

import { directionMap } from "@/app/constants/_website/global";
import { useAppSelector } from "@/app/Store/hooks";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { FiChevronRight, FiHome } from "react-icons/fi";

export default function Breadcrumb() {
  const { user } = useAppSelector((state) => state.user);

  const pathname = usePathname();
  const searchParams = useSearchParams();

  const locales = ["ar", "en"];
  const segments = pathname.split("/").filter(Boolean);
  const isLocale = locales.includes(segments[0]);
  const locale = isLocale ? segments[0] : "en";
  const pathSegments = isLocale ? segments.slice(1) : segments;

  const translations: Record<string, { en: string; ar: string }> = {
    accountdashboard: {
      en: "Profile",
      ar: "الملف الشخصى",
    },
    reviews: {
      en: "Reviews",
      ar: "مراجعات العملاء",
    },
    portfolio: {
      en: "Portfolio",
      ar: "معرض الأعمال",
    },
    balance: {
      en: "Balance",
      ar: "الرصيد",
    },
    services: {
      en: "Services",
      ar: "الخدمات",
    },
    orders: {
      en: "Orders",
      ar: "الطلبات",
    },
    addservice: {
      en: "Add Service",
      ar: "أضف خدمة",
    },
    accountorders: {
      en: "Orders",
      ar: "الطلبات",
    },
    accountproposals: {
      en: "Offers",
      ar: "عروضى",
    },
    blog: {
      en: "Blog",
      ar: "المدونة",
    },
  };

  // إنشاء نسخة جديدة من searchParams تتضمن userId
  const params = new URLSearchParams(searchParams.toString());
  if (user?.id) {
    params.set("userId", user.id.toString());
  }
  const finalQuery = params.toString();

  const breadcrumbs = pathSegments.map((segment, index) => {
    const basePath =
      "/" +
      (isLocale ? `${locale}/` : "") +
      pathSegments.slice(0, index + 1).join("/");
    const href = finalQuery ? `${basePath}?${finalQuery}` : basePath;

    const key = segment.toLowerCase();
    const name =
      translations[key]?.[locale] ??
      decodeURIComponent(segment)
        .replace(/-/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());

    return { name, href };
  });

  return (
    <nav
      dir={directionMap[locale]}
      className="flex items-center lg:text-lg  text-gray-600 mt-6 pb-1  border-b border-gray-200 w-[90%] mx-auto mb-3"
      aria-label="Breadcrumb"
    >
      <ol className="inline-flex items-center flex-wrap gap-x-1 md:gap-x-2 gap-y-2 rtl:space-x-reverse w-fit px-3 ltr:mr-auto rtl:ml-auto">
        {/* Home Link */}
        <li>
          <Link
            href={finalQuery ? `/${locale}?${finalQuery}` : `/${locale}`}
            className="flex items-center gap-2 hover:text-blue-600 transition-colors"
          >
            <FiHome className="w-4 h-4" />
            <span className="hidden sm:block">
              {locale === "ar" ? "الرئيسية" : "Home"}
            </span>
          </Link>
        </li>

        {/* Dynamic Segments */}
        {breadcrumbs.map((crumb, index) => (
          <li
            key={crumb.href}
            className="flex items-center max-sm:text-[14px] max-md:text-[16px]"
          >
            <FiChevronRight className="mx-2 text-gray-400" />
            {index === breadcrumbs.length - 1 ? (
              <span className="text-gray-900 font-medium">
                {crumb.name.length > 15
                  ? crumb.name.slice(0, 15) + "..."
                  : crumb.name}
              </span>
            ) : (
              <Link
                href={crumb.href}
                className="hover:text-blue-600 transition-colors"
              >
                {crumb.name.length > 15
                  ? crumb.name.slice(0, 15) + "..."
                  : crumb.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
