// components/MembershipCard/PriceSection.tsx
"use client";
import React from "react";
import { motion } from "framer-motion";

interface PriceSectionProps {
  price: number;
  priceBeforeDiscount: number;
}

const PriceSection: React.FC<PriceSectionProps> = ({
  price,
  priceBeforeDiscount,
}) => {
  const hasDiscount = priceBeforeDiscount > price;

  const priceNumber = Number(price);
  const priceBeforeDiscountNumber = Number(priceBeforeDiscount);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="flex items-center gap-4 py-2"
    >
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold text-white">
          ${priceNumber.toFixed(2)}
        </span>
        <span className="text-gray-400 text-sm">/month</span>
      </div>

      {hasDiscount && (
        <div className="flex items-center gap-2">
          <span className="text-gray-400 line-through text-lg">
            ${priceBeforeDiscountNumber.toFixed(2)}
          </span>
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="px-2 py-1 bg-linear-to-r from-green-500 to-emerald-400 text-xs font-bold text-white rounded-lg"
          >
            SAVE ${(priceBeforeDiscountNumber - priceNumber).toFixed(2)}
          </motion.span>
        </div>
      )}
    </motion.div>
  );
};

export default PriceSection;
