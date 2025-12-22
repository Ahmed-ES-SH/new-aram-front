"use client";

import { motion } from "framer-motion";
import { BaseFieldProps, LocalizedText } from "../types";

function getLocalizedText(
  text: LocalizedText | string | undefined,
  locale: "ar" | "en"
): string {
  if (!text) return "";
  if (typeof text === "string") return text;
  return text[locale] || text.ar || text.en || "";
}

export default function RadioField({
  field,
  value,
  error,
  touched,
  disabled,
  locale,
  onChange,
  onBlur,
}: BaseFieldProps) {
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
      <label className="block text-sm font-medium text-gray-700 mb-3">
        {getLocalizedText(field.label, locale)}
        {field.required && <span className="text-red-500 mr-1">*</span>}
      </label>

      <div className="space-y-2">
        {field.options?.map((option, index) => (
          <motion.label
            key={option.value}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`
              flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all duration-200
              ${
                disabled || option.disabled
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-gray-50"
              }
              ${
                value === option.value
                  ? "border-primary bg-primary/5"
                  : hasError
                  ? "border-red-200"
                  : "border-gray-200"
              }
            `}
          >
            <input
              type="radio"
              name={field.name}
              value={option.value}
              checked={value === option.value}
              onChange={(e) => onChange(e.target.value)}
              onBlur={onBlur}
              disabled={disabled || option.disabled}
              className="w-4 h-4 text-primary focus:ring-primary border-gray-300"
            />
            <span
              className={`text-sm ${
                value === option.value
                  ? "text-primary font-medium"
                  : "text-gray-700"
              }`}
            >
              {getLocalizedText(option.label, locale)}
            </span>
          </motion.label>
        ))}
      </div>

      {/* Description */}
      {field.description && !hasError && (
        <p className="mt-2 text-xs text-gray-500">
          {getLocalizedText(field.description, locale)}
        </p>
      )}

      {/* Error Message */}
      {hasError && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-sm text-red-500"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}
