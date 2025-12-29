"use client";
import { ReactNode, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiCheck, FiChevronDown } from "react-icons/fi";

// Custom Select Component
interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder: string;
  icon?: ReactNode;
}
export default function CustomSelect({
  value,
  onChange,
  options,
  placeholder,
  icon,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div ref={ref} className="relative w-full">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between gap-2 px-4 py-3 rounded-xl border-2 transition-all duration-200 text-sm font-medium text-right
          ${
            isOpen
              ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
              : "border-gray-100 bg-white hover:border-gray-200 hover:bg-gray-50"
          }`}
      >
        <div className="flex items-center gap-2 flex-1">
          {icon && <span className="text-gray-400">{icon}</span>}
          <span className={value ? "text-gray-900" : "text-gray-400"}>
            {selectedOption?.label || placeholder}
          </span>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <FiChevronDown className="text-gray-400" size={16} />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 top-full left-0 right-0 mt-2 bg-white rounded-xl border border-gray-100 shadow-xl overflow-hidden"
          >
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium transition-colors text-right
                  ${
                    value === option.value
                      ? "bg-primary/5 text-primary"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
              >
                <span>{option.label}</span>
                {value === option.value && (
                  <FiCheck size={16} className="text-primary" />
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
