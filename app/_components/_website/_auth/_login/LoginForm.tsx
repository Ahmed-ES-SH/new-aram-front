"use client";

import type React from "react";

import { useState } from "react";
import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { useLocale, useTranslations } from "next-intl";
import { SocialButton } from "./SocialButton";
import { PasswordInput } from "./PasswordInput";
import { TextInput } from "./TextInput";
import { directionMap } from "@/app/constants/_website/global";
import { instance } from "@/app/_helpers/axios";
import Cookie from "cookie-universal";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/app/Store/hooks";
import { setUser } from "@/app/Store/userSlice";
import { toast } from "sonner";
import { useLoginSchema } from "@/app/validation/useLoginSchema";

interface LoginFormData {
  phoneOrEmail: string;
  password: string;
}

interface LoginFormErrors {
  phoneOrEmail?: string;
  password?: string;
}

export function LoginForm() {
  const cookie = Cookie();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const locale = useLocale();
  const t = useTranslations("login");
  const loginError = useTranslations("loginValidation");

  const schema = useLoginSchema();

  const [formData, setFormData] = useState<LoginFormData>({
    phoneOrEmail: "",
    password: "",
  });
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = schema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: LoginFormErrors = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof LoginFormErrors;
        fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);
    try {
      const data = {
        login: formData.phoneOrEmail,
        password: formData.password,
      };
      const response = await instance.post(`/login`, data);
      if (response.status == 200) {
        const token = response.data.token;
        cookie.set("aram_token", token);
        const user = response.data.user;
        dispatch(setUser(user));
        setTimeout(() => {
          router.push(`/${locale}`);
        }, 300);
      }
    } catch (error: any) {
      console.error("Login error:", error);
      if (error.status == 401) {
        toast.error(loginError("invalid_credentials"));
      }
      if (error.status == 404) {
        toast.error(loginError("user_not_found"));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange =
    (field: keyof LoginFormData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));

      // Clear error when user starts typing
      if (errors[field]) {
        setErrors((prev) => ({
          ...prev,
          [field]: undefined,
        }));
      }
    };

  const handleSocialLogin = (provider: "google" | "facebook") => {
    console.log(`Login with ${provider}`);
    // Implement social login logic here
  };

  return (
    <motion.div
      dir={directionMap[locale]}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-md mx-auto"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900  mb-2">{t("title")}</h1>
        <p className="text-gray-600 ">{t("subtitle")}</p>
      </motion.div>

      {/* Social Login Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-3 mb-6"
      >
        <SocialButton
          provider="google"
          icon={FcGoogle}
          onClick={() => handleSocialLogin("google")}
          disabled={isLoading}
        >
          {t("continueWithGoogle")}
        </SocialButton>

        <SocialButton
          provider="facebook"
          icon={FaFacebook}
          onClick={() => handleSocialLogin("facebook")}
          disabled={isLoading}
        >
          {t("continueWithFacebook")}
        </SocialButton>
      </motion.div>

      {/* Divider */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="relative mb-6"
      >
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-gray-50  text-gray-500">
            {t("orContinueWith")}
          </span>
        </div>
      </motion.div>

      {/* Login Form */}
      <motion.form
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        <TextInput
          id="phoneOrEmail"
          label={t("phoneOrEmail")}
          placeholder={t("phoneOrEmailPlaceholder")}
          value={formData.phoneOrEmail}
          onChange={handleInputChange("phoneOrEmail")}
          error={errors.phoneOrEmail}
          disabled={isLoading}
          autoComplete="username"
        />

        <div className="space-y-2">
          <PasswordInput
            id="password"
            label={t("password")}
            placeholder={t("passwordPlaceholder")}
            value={formData.password}
            onChange={handleInputChange("password")}
            error={errors.password}
            disabled={isLoading}
            autoComplete="current-password"
          />

          <div className="flex justify-end">
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="
                text-sm text-blue-600 hover:text-blue-500 
                 transition-colors duration-200
                focus:outline-none focus:underline
              "
            >
              {t("forgotPassword")}
            </motion.button>
          </div>
        </div>

        <motion.button
          type="submit"
          disabled={isLoading}
          whileHover={{ scale: isLoading ? 1 : 1.02 }}
          whileTap={{ scale: isLoading ? 1 : 0.98 }}
          className="
            w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400
            text-white font-medium py-3 px-4 rounded-lg
            transition-all duration-200 ease-in-out
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
            disabled:cursor-not-allowed
            
          "
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>{t("loading")}</span>
            </div>
          ) : (
            t("signIn")
          )}
        </motion.button>
      </motion.form>
    </motion.div>
  );
}
