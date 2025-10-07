"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaCopy, FaCheck } from "react-icons/fa";
import { useTranslations } from "next-intl";
import Img from "../../../_global/Img";
import { CardData } from "./OwnedCreditCard";

interface CardDetailsModalProps {
  data: CardData;
  isOpen: boolean;
  onClose: () => void;
}

export function CardDetailsModal({
  data,
  isOpen,
  onClose,
}: CardDetailsModalProps) {
  const t = useTranslations("card");
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatCardNumber = (number: string) => {
    return number.replace(/(\d{4})(?=\d)/g, "$1 ");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-yellow-100 text-yellow-800";
      case "expired":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-[99] flex items-center justify-center p-4"
          >
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh]"
            >
              {/* Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
                <h2 className="text-xl font-bold text-gray-900">
                  {t("cardDetails")}
                </h2>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6 overflow-y-auto max-h-[70vh]">
                {/* Card Image */}
                {data.card.image && (
                  <div className="w-full aspect-video rounded-xl overflow-hidden bg-gray-100">
                    <Img
                      src={data.card.image || "/placeholder.svg"}
                      alt={data.card.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Card Number */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    {t("cardNumber")}
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-50 rounded-lg px-4 py-3 font-mono text-lg">
                      {formatCardNumber(data.card_number)}
                    </div>
                    <button
                      onClick={() =>
                        copyToClipboard(data.card_number, "cardNumber")
                      }
                      className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      {copiedField === "cardNumber" ? (
                        <FaCheck className="text-lg" />
                      ) : (
                        <FaCopy className="text-lg" />
                      )}
                    </button>
                  </div>
                  {copiedField === "cardNumber" && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-sm text-green-600"
                    >
                      {t("copied")}
                    </motion.p>
                  )}
                </div>

                {/* CVV */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    {t("cvv")}
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-50 rounded-lg px-4 py-3 font-mono text-lg">
                      {data.cvv}
                    </div>
                    <button
                      onClick={() => copyToClipboard(String(data.cvv), "cvv")}
                      className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      {copiedField === "cvv" ? (
                        <FaCheck className="text-lg" />
                      ) : (
                        <FaCopy className="text-lg" />
                      )}
                    </button>
                  </div>
                  {copiedField === "cvv" && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-sm text-green-600"
                    >
                      {t("copied")}
                    </motion.p>
                  )}
                </div>

                {/* Grid Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      {t("status")}
                    </label>
                    <div
                      className={`${getStatusColor(
                        data.status
                      )} rounded-lg px-4 py-3 text-center font-medium capitalize`}
                    >
                      {t(data.status)}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      {t("usageLimit")}
                    </label>
                    <div className="bg-gray-50 rounded-lg px-4 py-3 text-center">
                      {data.usage_limit ?? t("unlimited")}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      {t("currentUsage")}
                    </label>
                    <div className="bg-gray-50 rounded-lg px-4 py-3 text-center">
                      {data.current_usage}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      {t("issueDate")}
                    </label>
                    <div className="bg-gray-50 rounded-lg px-4 py-3 text-center text-sm">
                      {formatDate(data.issue_date)}
                    </div>
                  </div>

                  <div className="col-span-2 space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      {t("expiryDate")}
                    </label>
                    <div className="bg-gray-50 rounded-lg px-4 py-3 text-center">
                      {formatDate(data.expiry_date)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 rounded-b-2xl">
                <button
                  onClick={onClose}
                  className="w-full bg-gray-900 text-white font-medium py-3 px-6 rounded-xl hover:bg-gray-800 transition-colors"
                >
                  {t("close")}
                </button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
