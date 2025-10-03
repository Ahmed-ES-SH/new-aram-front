"use client";
import { AnimatePresence, motion } from "framer-motion";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { MdErrorOutline } from "react-icons/md";
import React, { useState } from "react";
import { useTranslations } from "next-intl";

interface props {
  value: string;
  handlechange: any;
  errorpassword: string;
}

export default function PasswordInput({
  value,
  handlechange,
  errorpassword,
}: props) {
  const t = useTranslations("passwordInput");

  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0); // 0: weak, 1: medium, 2: strong

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const checkPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[!@#$%^&*]/.test(password)) strength++;

    if (strength <= 2) return 0;
    if (strength <= 4) return 1;
    return 2;
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handlechange(e);
    const strength = checkPasswordStrength(e.target.value);
    setPasswordStrength(strength);
  };

  return (
    <motion.div
      className="col-span-6 sm:col-span-3"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Label */}
      <label
        htmlFor="Password"
        className="block text-sm font-medium text-gray-700"
      >
        {t("password_label")}
      </label>

      {/* Input Wrapper */}
      <div className="relative">
        <input
          placeholder={"abCD34@#"}
          type={showPassword ? "text" : "password"}
          id="Password"
          name="password"
          className={`mt-1 py-2 outline-transparent focus:outline-main_orange duration-200 px-2 border w-full rounded-md bg-white text-sm shadow-sm
            ${
              errorpassword
                ? "border-red-400 bg-red-50 focus:outline-red-400"
                : "border-gray-200 text-gray-700"
            }`}
          value={value}
          onChange={handlePasswordChange}
        />
        {/* Toggle password visibility */}
        <span
          className={`absolute inset-y-0 pr-3 flex items-center cursor-pointer ltr:right-0 rtl:left-2`}
          onClick={togglePasswordVisibility}
        >
          {showPassword ? (
            <HiEyeOff className="text-gray-400 size-4" />
          ) : (
            <HiEye className="text-gray-400 size-4" />
          )}
        </span>
      </div>

      {/* Strength Bars */}
      <div className="flex gap-2 mt-2">
        {[0, 1, 2].map((index) => (
          <div
            key={index}
            className={`h-1 flex-1 rounded ${
              passwordStrength >= index
                ? passwordStrength === 0
                  ? "bg-red-500"
                  : passwordStrength === 1
                  ? "bg-yellow-500"
                  : "bg-green-500"
                : "bg-gray-200"
            }`}
          />
        ))}
      </div>

      {/* Strength Message */}
      <p className="text-sm mt-2 text-gray-500">
        {passwordStrength === 0
          ? t("password_weak")
          : passwordStrength === 1
          ? t("password_medium")
          : t("password_strong")}
      </p>

      {/* Error Message (animated) */}
      <AnimatePresence>
        {errorpassword && (
          <motion.div
            className="flex items-center gap-2 mt-2 text-red-600 text-sm"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
          >
            <MdErrorOutline className="text-red-500 text-lg" />
            <span>{errorpassword}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
