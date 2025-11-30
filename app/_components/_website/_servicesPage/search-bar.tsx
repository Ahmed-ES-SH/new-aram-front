"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { FiSearch } from "react-icons/fi";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

// Search bar component with animated focus state
export default function SearchBar({ value, onChange }: SearchBarProps) {
  const t = useTranslations("servicesPage.search");

  return (
    <section className="max-w-3xl mx-auto px-4 -mt-6 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        whileFocus={{ scale: 1.02 }}
        className="relative"
      >
        {/* Search icon */}
        <div className="absolute inset-y-0 start-0 flex items-center ps-4 pointer-events-none">
          <FiSearch className="w-5 h-5 text-gray-400" />
        </div>

        {/* Search input with scale animation on focus */}
        <motion.input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={t("placeholder")}
          whileFocus={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="w-full py-4 ps-12 pe-4 bg-white border border-gray-200 rounded-2xl shadow-lg shadow-gray-100 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-shadow"
        />
      </motion.div>
    </section>
  );
}
