"use client";

import { motion } from "framer-motion";
import { FiAlertCircle } from "react-icons/fi";
import { BaseFieldProps, LocalizedText } from "../types";

function getLocalizedText(
  text: LocalizedText | string | undefined,
  locale: "ar" | "en"
): string {
  if (!text) return "";
  if (typeof text === "string") return text;
  return text[locale] || text.ar || text.en || "";
}

export default function TextareaField({
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
  const charCount = (value || "").length;
  const maxLength = field.validation?.find((v) => v.type === "maxLength")
    ?.value as number | undefined;

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
        <textarea
          id={field.id}
          name={field.name}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          disabled={disabled}
          placeholder={getLocalizedText(field.placeholder, locale)}
          rows={field.rows || 4}
          maxLength={maxLength}
          className={`
            w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 outline-none resize-none
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
        />

        {hasError && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute left-3 top-3 text-red-500"
          >
            <FiAlertCircle size={18} />
          </motion.div>
        )}
      </div>

      {/* Character count and description */}
      <div className="flex items-center justify-between mt-1.5">
        {field.description && !hasError ? (
          <p className="text-xs text-gray-500">
            {getLocalizedText(field.description, locale)}
          </p>
        ) : hasError ? (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-red-500"
          >
            {error}
          </motion.p>
        ) : (
          <span />
        )}

        {maxLength && (
          <span
            className={`text-xs ${
              charCount > maxLength * 0.9 ? "text-orange-500" : "text-gray-400"
            }`}
          >
            {charCount}/{maxLength}
          </span>
        )}
      </div>
    </div>
  );
}
