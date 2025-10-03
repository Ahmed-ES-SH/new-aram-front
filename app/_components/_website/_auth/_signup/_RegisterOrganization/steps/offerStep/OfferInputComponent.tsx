"use client";
import { AnimatePresence } from "framer-motion";
import React from "react";
import { IconType } from "react-icons";
import { MdErrorOutline } from "react-icons/md";
import { motion } from "framer-motion";

interface Option {
  value: string;
  label: string;
}

interface InputComponentProps {
  id: string;
  name: string;
  type?: string; // text | select | number | date
  value: string;
  label: string;
  error: string;
  placeholder?: string;
  icon?: IconType;
  textarea?: boolean;
  options?: Option[]; // used if type === "select"
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
}

export default function OfferInputComponent({
  id,
  name,
  type = "text",
  value,
  label,
  placeholder,
  icon: Icon,
  textarea = false,
  options = [],
  error,
  onChange,
}: InputComponentProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium text-foreground">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-muted-foreground" />
          </div>
        )}

        {textarea ? (
          <textarea
            id={id}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`w-full h-28 pl-12 pr-4 py-3 rounded-lg border border-input
              bg-background text-foreground focus:outline-none focus:ring-2
              focus:ring-ring focus:border-transparent transition-all duration-200
              placeholder:text-muted-foreground ${
                error
                  ? "border-red-400 focus:outline-red-400"
                  : "border-gray-200 focus:outline-main_orange"
              }`}
          />
        ) : type === "select" ? (
          <select
            id={id}
            name={name}
            value={value}
            onChange={onChange}
            className={`w-full pl-12 pr-4 py-3 rounded-lg border border-input
              bg-background text-foreground
              focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent
              transition-all duration-200 ${
                error
                  ? "border-red-400 focus:outline-red-400"
                  : "border-gray-200 focus:outline-main_orange"
              } `}
          >
            <option value="" disabled>
              {placeholder}
            </option>
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            id={id}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`w-full pl-12 pr-4 py-3 rounded-lg border border-input
              bg-background text-foreground focus:outline-none focus:ring-2
              focus:ring-ring focus:border-transparent transition-all duration-200
              placeholder:text-muted-foreground ${
                error
                  ? "border-red-400 focus:outline-red-400"
                  : "border-gray-200 focus:outline-main_orange"
              }`}
          />
        )}
      </div>
      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            className="flex items-center gap-1 text-red-500 text-sm mt-2"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.3 }}
          >
            <MdErrorOutline className="size-4" />
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
