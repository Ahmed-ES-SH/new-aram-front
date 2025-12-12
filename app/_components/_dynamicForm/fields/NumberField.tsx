"use client";

import { motion } from "framer-motion";
import { FiMinus, FiPlus, FiAlertCircle } from "react-icons/fi";
import { BaseFieldProps, LocalizedText } from "../types";

function getLocalizedText(
  text: LocalizedText | string | undefined,
  locale: "ar" | "en"
): string {
  if (!text) return "";
  if (typeof text === "string") return text;
  return text[locale] || text.ar || text.en || "";
}

export default function NumberField({
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
  const numValue = parseFloat(value) || 0;
  const step = field.step_increment || 1;
  const min = field.min ?? 0;
  const max = field.max ?? Infinity;

  const increment = () => {
    const newValue = Math.min(numValue + step, max);
    onChange(newValue);
  };

  const decrement = () => {
    const newValue = Math.max(numValue - step, min);
    onChange(newValue);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    // Allow empty string for clearing
    if (inputValue === "") {
      onChange("");
      return;
    }
    const parsed = parseFloat(inputValue);
    if (!isNaN(parsed)) {
      onChange(parsed);
    }
  };

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

      <div className="relative flex items-center gap-2">
        {/* Decrement Button */}
        <button
          type="button"
          onClick={decrement}
          disabled={disabled || numValue <= min}
          className={`
            w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200
            ${
              disabled || numValue <= min
                ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200 active:scale-95"
            }
          `}
        >
          <FiMinus size={18} />
        </button>

        {/* Input */}
        <div className="relative flex-1">
          <input
            id={field.id}
            name={field.name}
            type="number"
            value={value ?? ""}
            onChange={handleInputChange}
            onBlur={onBlur}
            disabled={disabled}
            min={min}
            max={max !== Infinity ? max : undefined}
            step={step}
            placeholder={getLocalizedText(field.placeholder, locale)}
            className={`
              w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 outline-none text-center
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
              [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
            `}
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

        {/* Increment Button */}
        <button
          type="button"
          onClick={increment}
          disabled={disabled || numValue >= max}
          className={`
            w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200
            ${
              disabled || numValue >= max
                ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200 active:scale-95"
            }
          `}
        >
          <FiPlus size={18} />
        </button>
      </div>

      {/* Range indicator */}
      {(field.min !== undefined || field.max !== undefined) && (
        <div className="flex justify-between mt-1.5">
          <span className="text-xs text-gray-400">
            {locale === "ar" ? "الحد الأدنى" : "Min"}: {min}
          </span>
          <span className="text-xs text-gray-400">
            {locale === "ar" ? "الحد الأقصى" : "Max"}:{" "}
            {max !== Infinity ? max : "∞"}
          </span>
        </div>
      )}

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
          className="mt-1.5 text-sm text-red-500"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}
