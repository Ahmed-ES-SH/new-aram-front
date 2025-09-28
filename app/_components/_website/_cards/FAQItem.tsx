import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BiChevronDown } from "react-icons/bi";

export interface FAQ {
  id: number;
  question: string;
  answer: string;
}

interface props {
  faq: FAQ;
  isOpen: boolean;
  onToggle: () => void;
}

export default function FAQItem({ faq, isOpen, onToggle }: props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="border relative max-sm:py-5 outline-none border-gray-200 rounded-lg mb-4 overflow-hidden"
    >
      <motion.button
        onClick={onToggle}
        className="w-full px-6 py-4 text-left bg-white md:hover:bg-gray-50 transition-colors duration-200 flex items-center justify-between"
        whileHover={{ backgroundColor: "#f9fafb" }}
      >
        <span className="text-lg text-right font-semibold text-gray-900 pr-4">
          {faq.question}
        </span>
        <motion.div
          className="max-sm:absolute max-sm:top-2 max-sm:left-2"
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <BiChevronDown className="w-5 h-5 text-primary" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-6 py-4 bg-blue-50 border-t border-gray-200">
              <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
