// components/MembershipCard/HoverActions.tsx
import React from "react";
import { motion } from "framer-motion";
import { FaShoppingCart, FaEye } from "react-icons/fa";
import { HoverActionsProps } from "./types";

const HoverActions: React.FC<HoverActionsProps> = ({
  isVisible,
  onAddToCart,
  onViewDetails,
  addToCartText,
  viewDetailsText,
}) => {
  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{
        y: isVisible ? 0 : -100,
        opacity: isVisible ? 1 : 0,
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20,
      }}
      className="absolute top-6 right-6 z-20 flex flex-col gap-2"
    >
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onAddToCart}
        className="flex items-center gap-2 px-4 py-3 bg-linear-to-r from-blue-600 to-blue-500 text-white rounded-xl shadow-lg hover:shadow-xl transition-shadow"
      >
        <FaShoppingCart />
        <span className="text-sm font-medium">{addToCartText}</span>
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onViewDetails}
        className="flex items-center gap-2 px-4 py-3 bg-linear-to-r from-gray-800 to-gray-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-600"
      >
        <FaEye />
        <span className="text-sm font-medium">{viewDetailsText}</span>
      </motion.button>
    </motion.div>
  );
};

export default HoverActions;
