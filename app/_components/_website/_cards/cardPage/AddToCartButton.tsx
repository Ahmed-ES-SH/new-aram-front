"use client";

import { motion } from "framer-motion";
import { useLocale } from "next-intl";
import { FaShoppingCart, FaCheck } from "react-icons/fa";

// Static texts (can be later moved to translation files)
const texts = {
  en: {
    addToCart: "Add to Cart",
    addedToCart: "Added to Cart",
  },
  ar: {
    addToCart: "أضف إلى السلة",
    addedToCart: "تمت الإضافة إلى السلة",
  },
};

interface Props {
  isInCart: boolean;
  handleAddToCart: () => void;
}

export default function AddToCartButton({ isInCart, handleAddToCart }: Props) {
  const locale = useLocale();
  const t = texts[locale];

  return (
    <>
      {isInCart ? (
        <motion.div
          className="w-full bg-green-600 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center cursor-not-allowed"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          <FaCheck className="mr-2" />
          {t.addedToCart}
        </motion.div>
      ) : (
        <motion.button
          onClick={handleAddToCart}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center transition-colors duration-200"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <FaShoppingCart className="mr-2" />
          {t.addToCart}
        </motion.button>
      )}
    </>
  );
}
