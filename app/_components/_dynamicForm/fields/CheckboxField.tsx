"use client";

import { motion } from "framer-motion";
import { FiCheck } from "react-icons/fi";
import { BaseFieldProps, LocalizedText } from "../types";

function getLocalizedText(
  text: LocalizedText | string | undefined,
  locale: "ar" | "en"
): string {
  if (!text) return "";
  if (typeof text === "string") return text;
  return text[locale] || text.ar || text.en || "";
}

export default function CheckboxField({
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
  const isChecked = Boolean(value);

  // Single checkbox (no options)
  if (!field.options || field.options.length === 0) {
    return (
      <div className={`w-full ${field.width === "half" ? "md:w-1/2" : ""}`}>
        <label
          className={`
            flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all duration-200
            ${disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50"}
            ${
              isChecked
                ? "border-primary bg-primary/5"
                : hasError
                ? "border-red-200"
                : "border-gray-200"
            }
          `}
        >
          <div
            onClick={() => !disabled && onChange(!isChecked)}
            className={`
              w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all
              ${
                isChecked
                  ? "bg-primary border-primary"
                  : hasError
                  ? "border-red-400"
                  : "border-gray-300"
              }
            `}
          >
            {isChecked && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              >
                <FiCheck className="text-white" size={14} />
              </motion.div>
            )}
          </div>
          <div className="flex-1">
            <span
              className={`text-sm ${
                isChecked ? "text-primary font-medium" : "text-gray-700"
              }`}
            >
              {getLocalizedText(field.label, locale)}
              {field.required && <span className="text-red-500 mr-1">*</span>}
            </span>
            {field.description && (
              <p className="text-xs text-gray-500 mt-1">
                {getLocalizedText(field.description, locale)}
              </p>
            )}
          </div>
        </label>

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

  // Multiple checkboxes (with options)
  const selectedValues: string[] = Array.isArray(value) ? value : [];

  const handleChange = (optionValue: string, checked: boolean) => {
    if (checked) {
      onChange([...selectedValues, optionValue]);
    } else {
      onChange(selectedValues.filter((v) => v !== optionValue));
    }
  };

  return (
    <div className={`w-full ${field.width === "half" ? "md:w-1/2" : ""}`}>
      <label className="block text-sm font-medium text-gray-700 mb-3">
        {getLocalizedText(field.label, locale)}
        {field.required && <span className="text-red-500 mr-1">*</span>}
      </label>

      <div className="space-y-2">
        {field.options.map((option, index) => {
          const isOptionChecked = selectedValues.includes(option.value);

          return (
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
                  isOptionChecked
                    ? "border-primary bg-primary/5"
                    : hasError
                    ? "border-red-200"
                    : "border-gray-200"
                }
              `}
            >
              <div
                onClick={() =>
                  !disabled &&
                  !option.disabled &&
                  handleChange(option.value, !isOptionChecked)
                }
                className={`
                  w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all
                  ${
                    isOptionChecked
                      ? "bg-primary border-primary"
                      : "border-gray-300"
                  }
                `}
              >
                {isOptionChecked && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  >
                    <FiCheck className="text-white" size={14} />
                  </motion.div>
                )}
              </div>
              <span
                className={`text-sm ${
                  isOptionChecked ? "text-primary font-medium" : "text-gray-700"
                }`}
              >
                {getLocalizedText(option.label, locale)}
              </span>
            </motion.label>
          );
        })}
      </div>

      {field.description && !hasError && (
        <p className="mt-2 text-xs text-gray-500">
          {getLocalizedText(field.description, locale)}
        </p>
      )}

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
