"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FaCreditCard } from "react-icons/fa";
import { useTranslations } from "next-intl";
import { CardDetailsModal } from "./CardDetailsModal";

export interface CardData {
  id: number;
  cvv: number;
  owner_id: number;
  issue_date: string;
  usage_limit: number | null;
  expiry_date: string;
  current_usage: number;
  owner_type: string;
  card_number: string;
  status: "active" | "inactive" | "expired";
  card_id: number;
  created_at: string;
  updated_at: string;
  card: {
    id: number;
    title: string;
    image: string;
  };
}

interface CreditCardProps {
  data: CardData;
}

export function OwnedCreditCard({ data }: CreditCardProps) {
  const t = useTranslations("card");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formatCardNumber = (number: string) => {
    return number.replace(/(\d{4})(?=\d)/g, "$1 ");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear()).slice(-2);
    return `${month}/${year}`;
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className={`w-full max-w-md relative`}
      >
        {/* expire patch */}

        {data.status == "expired" && (
          <span className=" absolute top-6 ltr:right-4 rtl:left-4 px-2 py-1 rounded-full bg-red-500 text-white border border-red-500 z-40 ">
            {t("expired")}
          </span>
        )}
        <div
          className={`relative duration-300 ${
            data.status == "expired" ? "grayscale-100 hover:grayscale-0" : ""
          }`}
        >
          {/* Card */}
          <div
            style={{
              backgroundImage: `url(${data.card.image ?? "/cards/card_1.jpg"})`,
            }}
            className={`relative w-full bg-cover aspect-[1.586/1] rounded-2xl  p-6 shadow-2xl overflow-hidden`}
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl transform translate-x-32 -translate-y-32" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full blur-3xl transform -translate-x-24 translate-y-24" />
            </div>

            {/* Card Content */}
            <div className="relative h-full flex flex-col justify-between text-white">
              {/* Top Section */}
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <FaCreditCard className="text-2xl" />
                  <span className="text-sm font-medium opacity-90">
                    {data.card.title}
                  </span>
                </div>
                <div className="flex gap-1">
                  <div className="w-8 h-8 rounded-full bg-white opacity-80" />
                  <div className="w-8 h-8 rounded-full bg-white opacity-60 -ml-3" />
                </div>
              </div>

              {/* Card Number */}
              <div className="space-y-1">
                <p className="text-xs opacity-70">{t("cardNumber")}</p>
                <p className="text-xl font-mono tracking-wider">
                  {formatCardNumber(data.card_number)}
                </p>
              </div>

              {/* Bottom Section */}
              <div className="flex justify-between items-end">
                <div className="space-y-1">
                  <p className="text-xs opacity-70">{t("cardHolder")}</p>
                  <p className="text-sm font-medium">{data.card.title}</p>
                </div>
                <div className="space-y-1 text-right">
                  <p className="text-xs opacity-70">{t("validThru")}</p>
                  <p className="text-sm font-mono">
                    {formatDate(data.expiry_date)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* View Details Button */}
          <motion.button
            onClick={() => setIsModalOpen(true)}
            className="mt-4 w-full text-white bg-primary font-medium py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
          >
            {t("viewDetails")}
          </motion.button>
        </div>
      </motion.div>

      <CardDetailsModal
        data={data}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
