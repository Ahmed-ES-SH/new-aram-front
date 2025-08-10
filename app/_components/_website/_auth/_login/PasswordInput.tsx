"use client";

import type React from "react";

import { forwardRef, useState } from "react";
import { motion } from "framer-motion";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useTranslations } from "next-intl";

interface PasswordInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string;
  error?: string;
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ label, error, className = "", ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const t = useTranslations("login");

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="space-y-2"
      >
        <label
          htmlFor={props.id}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          {label}
        </label>
        <div className="relative">
          <input
            ref={ref}
            type={showPassword ? "text" : "password"}
            className={`
              w-full outline-none px-4 py-3 pr-12 border border-gray-300 rounded-lg
              focus:ring-2 focus:ring-blue-500 focus:border-transparent
              transition-all duration-200 ease-in-out
              placeholder-gray-400 text-gray-900
              dark:bg-gray-800 dark:border-gray-600 dark:text-white
              dark:placeholder-gray-500 dark:focus:ring-blue-400
              ${error ? "border-red-500 focus:ring-red-500" : ""}
              ${className}
            `}
            {...props}
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="
              absolute inset-y-0 right-0 flex items-center pr-4
              text-gray-400 hover:text-gray-600 dark:hover:text-gray-300
              transition-colors duration-200
              focus:outline-none focus:text-blue-500
            "
            aria-label={showPassword ? t("hidePassword") : t("showPassword")}
          >
            {showPassword ? (
              <FiEyeOff className="w-5 h-5" />
            ) : (
              <FiEye className="w-5 h-5" />
            )}
          </button>
        </div>
        {error && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="text-sm text-red-600 dark:text-red-400"
          >
            {error}
          </motion.p>
        )}
      </motion.div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";
