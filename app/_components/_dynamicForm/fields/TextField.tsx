"use client";

import { motion } from "framer-motion";
import { FiAlertCircle } from "react-icons/fi";
import { BaseFieldProps, LocalizedText } from "../types";

// Helper to get localized text
function getLocalizedText(
  text: LocalizedText | string | undefined,
  locale: "ar" | "en"
): string {
  if (!text) return "";
  if (typeof text === "string") return text;
  return text[locale] || text.ar || text.en || "";
}

export default function TextField({
  field,
  value,
  error,
  touched,
  disabled,
  locale,
  onChange,
  onBlur,
}: BaseFieldProps) {
  const inputType =
    field.type === "email"
      ? "email"
      : field.type === "phone"
      ? "tel"
      : field.type === "url"
      ? "url"
      : "text";

  const hasError = touched && error;

  return (
    <div
      className={`w-full ${
        field.width === "half"
          ? "md:w-1/2"
          : field.width === "third"
          ? "md:w-1/3"
          : ""
      }`}
    >
      <label
        htmlFor={field.id}
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        {getLocalizedText(field.label, locale)}
        {field.required && <span className="text-red-500 mr-1">*</span>}
      </label>

      <div className="relative">
        <input
          id={field.id}
          name={field.name}
          type={inputType}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          disabled={disabled}
          placeholder={getLocalizedText(field.placeholder, locale)}
          min={field.min}
          max={field.max}
          className={`
            w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 outline-none
            ${
              disabled
                ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                : "bg-white"
            }
            ${
              hasError
                ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                : "border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10"
            }
          `}
          dir={
            field.type === "email" || field.type === "url" ? "ltr" : undefined
          }
        />

        {hasError && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-red-500"
          >
            <FiAlertCircle size={18} />
          </motion.div>
        )}
      </div>

      {/* Description */}
      {field.description && !hasError && (
        <p className="mt-1.5 text-xs text-gray-500">
          {getLocalizedText(field.description, locale)}
        </p>
      )}

      {/* Error Message */}
      {hasError && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1.5 text-sm text-red-500 flex items-center gap-1"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}
