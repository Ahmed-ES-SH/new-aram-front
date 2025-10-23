"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { FiSettings, FiInfo, FiGrid } from "react-icons/fi";

interface ProfileHeaderProps {
  activeTab: "booking" | "info" | "subcategories";
  onTabChange: (tab: "booking" | "info" | "subcategories") => void;
}

export default function ProfileHeader({
  activeTab,
  onTabChange,
}: ProfileHeaderProps) {
  const t = useTranslations("organizationProfile");

  const tabs = [
    {
      id: "booking" as const,
      label: t("tabs.bookingSettings"),
      icon: FiSettings,
    },
    {
      id: "info" as const,
      label: t("tabs.organizationInfo"),
      icon: FiInfo,
    },
    {
      id: "subcategories" as const,
      label: t("tabs.OrganizationSpecializations"),
      icon: FiGrid,
    },
  ];

  return (
    <div className="border-b border-gray-200">
      <div className="flex items-center  gap-1 p-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <motion.button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center  gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                isActive
                  ? "text-white bg-primary"
                  : "text-gray-600 hover:bg-primary/50 hover:text-white"
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Icon className="size-6" />
              <span
                className={`lg:block text-xs ${isActive ? "block" : "hidden"}`}
              >
                {tab.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
