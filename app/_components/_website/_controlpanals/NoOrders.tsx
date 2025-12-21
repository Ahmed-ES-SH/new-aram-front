"use client";
import { useLocale } from "next-intl";
import Link from "next/link";
import { FiShoppingBag } from "react-icons/fi";
import { useTranslations } from "use-intl";

export default function NoOrders() {
  const locale = useLocale();
  const t = useTranslations("noOrders");

  return (
    <div className="flex flex-col items-center justify-center h-screen w-full text-center p-8">
      <div className="flex flex-col items-center gpa-2">
        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6 text-primary">
          <FiShoppingBag size={48} />
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">{t("title")}</h3>
        <p className="text-gray-500 max-w-md mb-8">{t("message")}</p>
        <Link
          href="/services"
          className="px-8 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
        >
          {t("button")}
        </Link>
      </div>
    </div>
  );
}
