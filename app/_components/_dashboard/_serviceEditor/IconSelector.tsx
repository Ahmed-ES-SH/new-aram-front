"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronDown } from "react-icons/fi";
import {
  FiStar,
  FiBook,
  FiDollarSign,
  FiCheck,
  FiHeart,
  FiShield,
  FiClock,
  FiUsers,
  FiGlobe,
  FiPhone,
  FiMail,
  FiMapPin,
} from "react-icons/fi";
import { AVAILABLE_ICONS } from "./types";

const ICON_COMPONENTS: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  star: FiStar,
  book: FiBook,
  dollar: FiDollarSign,
  check: FiCheck,
  heart: FiHeart,
  shield: FiShield,
  clock: FiClock,
  users: FiUsers,
  globe: FiGlobe,
  phone: FiPhone,
  mail: FiMail,
  location: FiMapPin,
};

interface IconSelectorProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export default function IconSelector({
  label,
  value,
  onChange,
}: IconSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const SelectedIcon = ICON_COMPONENTS[value] || FiStar;

  return (
    <div className="space-y-2 relative">
      <label className="text-sm font-medium text-gray-700">{label}</label>

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 rounded-xl border border-gray-200 flex items-center justify-between hover:border-primary transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <SelectedIcon className="text-primary" />
          </div>
          <span className="text-gray-700">{value || "اختر أيقونة"}</span>
        </div>
        <FiChevronDown
          className={`text-gray-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 p-4"
          >
            <div className="grid grid-cols-4 gap-2">
              {AVAILABLE_ICONS.map((iconName) => {
                const IconComponent = ICON_COMPONENTS[iconName] || FiStar;
                return (
                  <button
                    key={iconName}
                    type="button"
                    onClick={() => {
                      onChange(iconName);
                      setIsOpen(false);
                    }}
                    className={`
                      p-3 rounded-lg flex items-center justify-center transition-all
                      ${
                        value === iconName
                          ? "bg-primary text-white"
                          : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                      }
                    `}
                  >
                    <IconComponent />
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
