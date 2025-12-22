"use client";
import { AnimatePresence, motion } from "framer-motion";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { MdErrorOutline } from "react-icons/md";
import { useState } from "react";
import { useLocale } from "next-intl";
import { directionMap } from "@/app/constants/_website/global";
import { inputType } from "./_RegisterUserPage/FormInputs";

interface InputProps {
  input: inputType;
  value: string | boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

export default function InputComponent({
  input,
  value,
  onChange,
  error,
}: InputProps) {
  const locale = useLocale();

  const [showPassword, setShowPassword] = useState(false);
  const isPassword =
    input.type === "password" || input.name === "password_confirmation";

  return (
    <motion.div
      dir={directionMap[locale]}
      className="col-span-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Label */}
      <label
        htmlFor={input.id}
        className="block text-sm font-medium text-gray-700"
      >
        {input.label}
      </label>

      {/* Input Wrapper */}
      <div className="relative">
        <input
          id={input.id}
          name={input.name}
          type={isPassword ? (showPassword ? "text" : "password") : input.type}
          placeholder={input.placeholder}
          value={typeof value === "boolean" ? undefined : value}
          checked={typeof value === "boolean" ? value : undefined}
          onChange={onChange}
          className={`mt-1 py-2 px-2 outline-transparent rtl:text-right ltr:text-left focus:outline-main_orange duration-200 border w-full rounded-md bg-white text-sm text-gray-700 shadow-sm ${
            error
              ? "border-red-400 focus:outline-red-400"
              : "border-gray-200 focus:outline-main_orange"
          }`}
        />

        {/* Toggle password visibility */}
        {isPassword && (
          <span
            className={`absolute inset-y-0 flex items-center cursor-pointer ltr:right-3 rtl:left-3`}
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <HiEyeOff className="text-gray-400 size-4" />
            ) : (
              <HiEye className="text-gray-400 size-4" />
            )}
          </span>
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
    </motion.div>
  );
}
