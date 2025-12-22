"use client";

import { useLocale } from "next-intl";
import React from "react";
import { IconType } from "react-icons";
import { motion, AnimatePresence } from "framer-motion";
import { FiAlertCircle } from "react-icons/fi";

interface FormInputProps {
  type?: string;
  name?: string;
  value?: string | number;
  label: string;
  placeholder?: string;
  icon?: IconType;
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  options?: { code: string; name: string; name_en?: string }[];
  disabled?: boolean;
  error?: string;
  className?: string;
}

export const FormInput: React.FC<FormInputProps> = ({
  type = "text",
  name,
  value,
  label,
  placeholder,
  icon: Icon,
  onChange,
  options,
  disabled,
  error,
  className = "",
}) => {
  const locale = useLocale();

  const commonClasses = `
    w-full px-4 py-2.5 rounded-lg border
    ${
      error
        ? "border-red-500 focus:ring-red-500"
        : "border-input focus:ring-ring"
    }
    bg-background text-foreground 
    focus:outline-none transition-all duration-300
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {/* Label */}
      <label className="block text-sm font-medium text-foreground">
        <div className="flex items-center gap-2">
          {Icon && <Icon className="w-4 h-4 text-muted-foreground" />}
          {label}
        </div>
      </label>

      {/* Input / Select */}
      {options ? (
        <motion.select
          key={name}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={commonClasses}
          whileFocus={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          {options.map((option) => (
            <option key={option.code} value={option.name_en ?? option.code}>
              {locale === "ar" ? option.name : option.name_en ?? option.name}
            </option>
          ))}
        </motion.select>
      ) : (
        <motion.input
          key={name}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          className={commonClasses}
          whileFocus={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        />
      )}

      {/* Error Animation */}
      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            key={error}
            className="flex items-center gap-1 text-red-500 text-xs mt-1"
            initial={{ opacity: 0, y: -5 }}
            animate={{
              opacity: 1,
              y: 0,
              x: [0, -4, 4, -3, 3, 0], // small shake
            }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <FiAlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
