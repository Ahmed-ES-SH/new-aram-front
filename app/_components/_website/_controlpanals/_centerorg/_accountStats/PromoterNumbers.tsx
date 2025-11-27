// components/PromoterDashboard.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaCopy,
  FaCheckCircle,
  FaLink,
  FaShoppingCart,
  FaUserPlus,
} from "react-icons/fa";
import { useTranslations } from "next-intl";
import { promoterType } from "./types";

interface PromoterNumbersProps {
  promoter: promoterType;
  baseUrl: string;
}

export default function PromoterNumbers({
  promoter,
  baseUrl,
}: PromoterNumbersProps) {
  const t = useTranslations("promoter");
  const [copiedItem, setCopiedItem] = useState<string | null>(null);

  // Function to handle copying text to clipboard
  const handleCopy = async (text: string, itemName: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedItem(itemName);
      setTimeout(() => setCopiedItem(null), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const signupLink = `${baseUrl}/membership?ref=${promoter.referral_code}`;

  // Statistics data for mapping
  const stats = [
    {
      key: "visits",
      value: promoter.total_visits,
      icon: FaLink,
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      textColor: "text-blue-600",
    },
    {
      key: "signups",
      value: promoter.total_signups,
      icon: FaUserPlus,
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
      textColor: "text-yellow-600",
    },
    {
      key: "purchases",
      value: promoter.total_purchases,
      icon: FaShoppingCart,
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      textColor: "text-green-600",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Referral Code Section */}
      <section>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          {t("yourCode")}
        </h2>
        <div className="flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
          <code className="flex-1 font-mono text-lg text-gray-700 bg-gray-50 px-3 py-2 rounded">
            {promoter.referral_code}
          </code>
          <button
            onClick={() => handleCopy(promoter.referral_code, "code")}
            className="p-3 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            aria-label="Copy referral code"
          >
            <AnimatePresence mode="wait">
              {copiedItem === "code" ? (
                <motion.div
                  key="check"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="text-green-500"
                >
                  <FaCheckCircle size={20} />
                </motion.div>
              ) : (
                <motion.div
                  key="copy"
                  initial={{ scale: 1 }}
                  exit={{ scale: 0 }}
                >
                  <FaCopy size={20} />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
      </section>

      {/* Links Section */}
      <section>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          {t("yourLinks")}
        </h2>
        <div className="space-y-4">
          {/* Signup Link */}
          <div className="flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-1">Signup Link</p>
              <code className="font-mono text-gray-700 break-all">
                {signupLink}
              </code>
            </div>
            <button
              onClick={() => handleCopy(signupLink, "signupLink")}
              className="p-3 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              aria-label="Copy signup link"
            >
              <AnimatePresence mode="wait">
                {copiedItem === "signupLink" ? (
                  <motion.div
                    key="check"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="text-green-500"
                  >
                    <FaCheckCircle size={20} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="copy"
                    initial={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  >
                    <FaCopy size={20} />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat) => {
            const IconComponent = stat.icon;
            return (
              <div
                key={stat.key}
                className={`${stat.bgColor} ${stat.borderColor} border-2 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-gray-800">
                      {stat.value}
                    </p>
                    <p className="text-gray-600 mt-1">{t(stat.key as any)}</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <IconComponent className={`text-xl ${stat.textColor}`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
