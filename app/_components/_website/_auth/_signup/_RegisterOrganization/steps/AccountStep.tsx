"use client";

import type React from "react";

import { useLocale, useTranslations } from "next-intl";
import {
  FaEnvelope,
  FaLock,
  FaArrowRight,
  FaMapMarkerAlt,
  FaPhone,
} from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";
import { Location } from "@/app/_components/_dashboard/_dynamicComponents/DynamicElementPage";
import { Dispatch, SetStateAction, useState } from "react";
import { FaMapLocation } from "react-icons/fa6";
import dynamic from "next/dynamic";
import { instance } from "@/app/_helpers/axios";
import { VscLoading } from "react-icons/vsc";
import { MdErrorOutline } from "react-icons/md";

const DynamicMapSelector = dynamic(
  () => import("@/app/_components/_maps/MapSelector"),
  { ssr: false }
);

interface AccountStepProps {
  email: string;
  password: string;
  phone_number: string;
  location: Location | null;
  setLocation: Dispatch<SetStateAction<Location | null>>;
  onUpdate: (data: {
    email?: string;
    password?: string;
    phone_number?: string;
  }) => void;
  onNext: () => void;
}

export function AccountStep({
  email,
  password,
  phone_number,
  location,
  setLocation,
  onUpdate,
  onNext,
}: AccountStepProps) {
  const locale = useLocale();
  const t = useTranslations("registration");

  const [showMap, setShowMap] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await instance.post(`/validate-org-email`, { email });
      if (response.status == 200) {
        onNext();
      }
    } catch (error: any) {
      console.log(error);
      if (error?.response?.status == 422) {
        setEmailError({
          ar: "البريد الالكترونى مستخدم بالفعل حاول استخدام بريد أخر .",
          en: "The email address is already in use. Try using another one.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className=""
    >
      <div className="bg-card rounded-lg border border-border p-8 shadow-sm">
        <h2 className="text-2xl font-semibold text-foreground mb-2">
          {t("steps.account")}
        </h2>
        <p className="text-muted-foreground mb-8">{t("accountStepTitle")}</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-foreground"
            >
              {t("fields.email.label")}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FaEnvelope className="h-5 w-5 text-muted-foreground" />
              </div>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => onUpdate({ email: e.target.value })}
                placeholder={t("fields.email.placeholder")}
                required
                className={`
                  w-full pl-12 pr-4 py-3 rounded-lg border border-input
                  bg-background text-foreground
                  focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent
                  transition-all duration-200
                  placeholder:text-muted-foreground
                  ${
                    emailError
                      ? "border-red-400 focus:outline-red-400"
                      : "border-gray-200 focus:outline-main_orange"
                  }
                `}
              />
            </div>
            {/* Error Message */}
            <AnimatePresence>
              {emailError && (
                <motion.div
                  className="flex items-center gap-1 text-red-500 text-sm mt-2"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.3 }}
                >
                  <MdErrorOutline className="size-4" />
                  <span>{emailError[locale]}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-foreground"
            >
              {t("fields.password.label")}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FaLock className="h-5 w-5 text-muted-foreground" />
              </div>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => onUpdate({ password: e.target.value })}
                placeholder={t("fields.password.placeholder")}
                required
                minLength={8}
                className="
                  w-full pl-12 pr-4 py-3 rounded-lg border border-input
                  bg-background text-foreground
                  focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent
                  transition-all duration-200
                  placeholder:text-muted-foreground
                "
              />
            </div>
          </div>

          {/* Phone Number Field */}
          <div className="space-y-2">
            <label
              htmlFor="phone_number"
              className="block text-sm font-medium text-foreground"
            >
              {t("fields.phone_number.label")}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FaPhone className="h-5 w-5 text-muted-foreground" />
              </div>
              <input
                type="tel"
                id="phone_number"
                value={phone_number}
                onChange={(e) => onUpdate({ phone_number: e.target.value })}
                placeholder={t("fields.phone_number.placeholder")}
                required
                className="
                  w-full pl-12 pr-4 py-3 rounded-lg border border-input
                  bg-background text-foreground
                  focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent
                  transition-all duration-200
                  placeholder:text-muted-foreground
                "
              />
            </div>
          </div>

          {/* location Field */}
          <div className="space-y-2 w-full">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-foreground"
            >
              {t("fields.location.label")}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FaMapLocation className="h-5 w-5 text-muted-foreground" />
              </div>
              <input
                type="text"
                id="location"
                value={location && (location.address as any)}
                onChange={(e) => onUpdate({ email: e.target.value })}
                placeholder={t("fields.location.placeholder")}
                readOnly
                className="
                  w-full pl-12 pr-4 py-3 rounded-lg border border-input
                  bg-background text-foreground
                read-only:bg-gray-100 read-only:border-gray-300
                  transition-all duration-200
                  placeholder:text-muted-foreground
                "
              />
            </div>
            <div
              onClick={() => setShowMap(true)}
              className="w-fit rtl:mr-auto ltr:ml-auto cursor-pointer hover:text-red-500 underline text-red-300 flex items-center gap-1"
            >
              {t("fields.location.selectLocation")}
              <FaMapMarkerAlt className="size-6" />
            </div>
          </div>

          {/* Next Button */}
          <div className="flex justify-end pt-4">
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="
                flex items-center gap-2 px-6 py-3 rounded-lg
                bg-primary text-primary-foreground font-medium
                hover:opacity-90 transition-opacity
                disabled:bg-orange-200
                focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
              "
            >
              {loading ? (
                <VscLoading className="animate-spin size-6" />
              ) : (
                <div className="flex items-center gap-1">
                  {t("buttons.next")}
                  <FaArrowRight className="h-4 w-4 rtl:rotate-180" />
                </div>
              )}
            </motion.button>
          </div>
        </form>
      </div>

      {/* map poup */}
      <DynamicMapSelector
        locale={locale as "en" | "ar"}
        showMap={showMap}
        onClose={() => setShowMap(false)}
        setLocation={setLocation}
        initialLocation={location}
        key={"Map-selector"}
      />
    </motion.div>
  );
}
