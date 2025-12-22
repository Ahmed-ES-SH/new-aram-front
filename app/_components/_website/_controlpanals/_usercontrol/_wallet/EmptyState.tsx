"use client";

import { useTranslations } from "next-intl";
import { FaReceipt } from "react-icons/fa";

export const EmptyState = () => {
  const t = useTranslations("wallet.transactions");

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center w-full min-h-[75vh]">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <FaReceipt className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-700 mb-2">{t("empty")}</h3>
      <p className="text-gray-500 max-w-sm">{t("emptyDescription")}</p>
    </div>
  );
};
