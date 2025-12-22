"use client";

import { motion, spring } from "framer-motion";
import { FaTrash } from "react-icons/fa";
import { FiShoppingCart, FiEye, FiCheck } from "react-icons/fi";

interface HoverActionsProps {
  isVisible: boolean;
  t: (key: string) => string;
  onAddToCart: () => void;
  onRemoveFromCart: () => void;
  onViewDetails: () => void;
  isIncart: boolean;
}

export function HoverActions({
  isVisible,
  t,
  onAddToCart,
  onRemoveFromCart,
  onViewDetails,
  isIncart,
}: HoverActionsProps) {
  const buttonVariants = {
    hidden: { y: -60, opacity: 0 },
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: {
        type: spring,
        stiffness: 400,
        damping: 25,
        delay: i * 0.1,
      },
    }),
    exit: (i: number) => ({
      y: -60,
      opacity: 0,
      transition: {
        type: spring,
        stiffness: 400,
        damping: 25,
        delay: (1 - i) * 0.05,
      },
    }),
  };

  return (
    <motion.div
      className="absolute top-3 right-3 flex gap-2 z-20"
      initial="hidden"
      animate={isVisible ? "visible" : "exit"}
    >
      {/* Cart Action Button */}
      {isIncart ? (
        <motion.button
          custom={1}
          variants={buttonVariants}
          onClick={onRemoveFromCart}
          className="flex items-center gap-2 px-3 py-2 rounded-lg
               bg-destructive text-white
               border border-destructive/20
               font-semibold text-xs
               hover:bg-destructive/15
               transition-colors duration-200"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaTrash className="w-4 h-4" />
          <span>{t("membershipCard.removeFromCart")}</span>
        </motion.button>
      ) : (
        <motion.button
          custom={0}
          variants={buttonVariants}
          onClick={onAddToCart}
          className="flex items-center gap-2 px-3 py-2 rounded-lg
               bg-primary text-primary-foreground
               font-semibold text-xs
               shadow-lg hover:shadow-xl
               transition-shadow duration-200"
          style={{
            boxShadow: "0 4px 14px rgba(218, 165, 32, 0.4)",
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FiShoppingCart className="w-4 h-4" />
          <span>{t("membershipCard.addToCart")}</span>
        </motion.button>
      )}

      {/* View Details Button */}
      <motion.button
        custom={1}
        variants={buttonVariants}
        onClick={onViewDetails}
        className="flex items-center gap-2 px-3 py-2 rounded-lg
                   bg-secondary text-secondary-foreground
                   font-semibold text-xs
                   border border-border
                   shadow-lg hover:shadow-xl
                   transition-shadow duration-200"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <FiEye className="w-4 h-4" />
        <span>{t("membershipCard.viewDetails")}</span>
      </motion.button>
    </motion.div>
  );
}
