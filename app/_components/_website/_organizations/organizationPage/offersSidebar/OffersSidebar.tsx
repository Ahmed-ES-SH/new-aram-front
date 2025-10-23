"use client";
import { Offer } from "@/app/_components/_dashboard/_offers/types";
import React from "react";
import OfferCard from "../../../_offers/OfferCard";
import { useLocale } from "next-intl";
import { motion } from "framer-motion";
import { BiSolidOffer } from "react-icons/bi";

interface props {
  offers: Offer[];
}

export default function OffersSidebar({ offers }: props) {
  const locale = useLocale();

  if (!offers) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex-1 h-[86vh] sticky top-28 left-0 flex flex-col items-center justify-center border border-gray-200 bg-white rounded-2xl shadow-md max-xl:hidden"
      >
        <motion.div
          initial={{ rotate: -10, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
          className="flex flex-col items-center text-center p-6"
        >
          <BiSolidOffer className="size-32 text-red-500 mb-4" />
          <p className="text-gray-600 text-base leading-relaxed">
            {locale === "en"
              ? "This center currently has no displayable offers."
              : "هذا المركز حتى الآن لا يحتوي على عروض قابلة للعرض"}
          </p>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <div className="h-screen overflow-y-auto sticky top-28 left-0 p-2 border border-gray-300 rounded-lg hidden-scrollbar shadow-md flex-1 max-xl:hidden">
      <div className="w-full grid lg:grid-cols-1 grid-cols-2 gap-3 items-center ">
        {offers &&
          offers.length > 0 &&
          offers.map((offer, index) => (
            <OfferCard
              index={index}
              offer={offer}
              key={`offer-${offer.id}-${index}`}
            />
          ))}
      </div>
    </div>
  );
}
