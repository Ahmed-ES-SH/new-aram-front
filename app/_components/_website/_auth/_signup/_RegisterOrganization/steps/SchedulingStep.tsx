"use client";

import type React from "react";

import { useTranslations } from "next-intl";
import {
  FaArrowRight,
  FaArrowLeft,
  FaClock,
  FaDollarSign,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useValidation } from "../hooks/useValidation";
import { schedulingSchema } from "../validation/schemas";
import { MdErrorOutline } from "react-icons/md";

interface SchedulingStepProps {
  open_at: string;
  close_at: string;
  confirmation_price: number;
  confirmation_status: boolean;
  booking_status: boolean;
  onUpdate: (data: {
    open_at?: string;
    close_at?: string;
    confirmation_price?: number;
    confirmation_status?: boolean;
    booking_status?: boolean;
  }) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export function SchedulingStep({
  open_at,
  close_at,
  confirmation_price,
  confirmation_status,
  booking_status,
  onUpdate,
  onNext,
  onPrevious,
}: SchedulingStepProps) {
  const t = useTranslations("registration");

  const { validate, errors, clearError } = useValidation(schedulingSchema);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      validate({
        open_at,
        close_at,
        confirmation_price,
        confirmation_status,
        booking_status,
      })
    ) {
      onNext();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="w-full"
    >
      <div className="bg-card rounded-lg border border-border p-8 shadow-sm">
        <h2 className="text-2xl font-semibold text-foreground mb-2">
          {t("steps.scheduling")}
        </h2>
        <p className="text-muted-foreground mb-8">{t("schedulingTitle")}</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Time Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Opening Time */}
            <div className="space-y-2">
              <label
                htmlFor="open_at"
                className="block text-sm font-medium text-foreground"
              >
                {t("fields.open_at.label")}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaClock className="h-5 w-5 text-muted-foreground" />
                </div>
                <input
                  type="time"
                  id="open_at"
                  value={open_at}
                  onChange={(e) => {
                    onUpdate({ open_at: e.target.value });
                    clearError("open_at");
                  }}
                  // required
                  className={`
                    w-full pl-12 pr-4 py-3 rounded-lg border border-input
                    bg-background text-foreground
                    focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent
                    transition-all duration-200
                    ${
                      errors.open_at
                        ? "border-red-400 focus:outline-red-400"
                        : "border-gray-200 focus:outline-main_orange"
                    }
                  `}
                />
              </div>
              {/* Error Message */}
              <AnimatePresence>
                {errors.open_at && (
                  <motion.div
                    className="flex items-center gap-1 text-red-500 text-sm mt-2"
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <MdErrorOutline className="size-4" />
                    <span>{errors.open_at}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Closing Time */}
            <div className="space-y-2">
              <label
                htmlFor="close_at"
                className="block text-sm font-medium text-foreground"
              >
                {t("fields.close_at.label")}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaClock className="h-5 w-5 text-muted-foreground" />
                </div>
                <input
                  type="time"
                  id="close_at"
                  value={close_at}
                  onChange={(e) => {
                    onUpdate({ close_at: e.target.value });
                    clearError("close_at");
                  }}
                  // required
                  className={`
                    w-full pl-12 pr-4 py-3 rounded-lg border border-input
                    bg-background text-foreground
                    focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent
                    transition-all duration-200
                    ${
                      errors.close_at
                        ? "border-red-400 focus:outline-red-400"
                        : "border-gray-200 focus:outline-main_orange"
                    }
                  `}
                />
              </div>
              {/* Error Message */}
              <AnimatePresence>
                {errors.close_at && (
                  <motion.div
                    className="flex items-center gap-1 text-red-500 text-sm mt-2"
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <MdErrorOutline className="size-4" />
                    <span>{errors.close_at}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Confirmation Price */}
          <div className="space-y-2">
            <label
              htmlFor="confirmation_price"
              className="block text-sm font-medium text-foreground"
            >
              {t("fields.confirmation_price.label")}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FaDollarSign className="h-5 w-5 text-muted-foreground" />
              </div>
              <input
                type="number"
                id="confirmation_price"
                value={confirmation_price}
                onChange={(e) => {
                  onUpdate({ confirmation_price: Number(e.target.value) });
                  clearError("confirmation_price");
                }}
                placeholder={t("fields.confirmation_price.placeholder")}
                // required
                min="0"
                step="0.01"
                className={`
                  w-full pl-12 pr-4 py-3 rounded-lg border border-input
                  bg-background text-foreground
                  focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent
                  transition-all duration-200
                  placeholder:text-muted-foreground
                  ${
                    errors.confirmation_price
                      ? "border-red-400 focus:outline-red-400"
                      : "border-gray-200 focus:outline-main_orange"
                  }
                `}
              />
            </div>
            {/* Error Message */}
            <AnimatePresence>
              {errors.confirmation_price && (
                <motion.div
                  className="flex items-center gap-1 text-red-500 text-sm mt-2"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.3 }}
                >
                  <MdErrorOutline className="size-4" />
                  <span>{errors.confirmation_price}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Status Toggles */}
          <div className="space-y-4 pt-2">
            {/* Confirmation Status */}
            <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-muted/30">
              <div className="flex-1">
                <label
                  htmlFor="confirmation_status"
                  className="block text-sm font-medium text-foreground"
                >
                  {t("fields.confirmation_status.label")}
                </label>
                <p className="text-xs text-muted-foreground mt-1">
                  {confirmation_status
                    ? t("fields.confirmation_status.enabled")
                    : t("fields.confirmation_status.disabled")}
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={confirmation_status}
                onClick={() =>
                  onUpdate({ confirmation_status: !confirmation_status })
                }
                className={`
                  relative inline-flex h-6 w-11 items-center rounded-full
                  transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
                  ${confirmation_status ? "bg-primary" : "bg-input"}
                `}
              >
                <motion.span
                  layout
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className={`
                    inline-block h-4 w-4 transform rounded-full bg-white shadow-lg
                    ${
                      confirmation_status
                        ? "ltr:translate-x-6 rtl:-translate-x-6"
                        : "ltr:translate-x-1 rtl:-translate-x-1"
                    }
                  `}
                />
              </button>
            </div>

            {/* Booking Status */}
            <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-muted/30">
              <div className="flex-1">
                <label
                  htmlFor="booking_status"
                  className="block text-sm font-medium text-foreground"
                >
                  {t("fields.booking_status.label")}
                </label>
                <p className="text-xs text-muted-foreground mt-1">
                  {booking_status
                    ? t("fields.booking_status.enabled")
                    : t("fields.booking_status.disabled")}
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={booking_status}
                onClick={() => onUpdate({ booking_status: !booking_status })}
                className={`
                  relative inline-flex h-6 w-11 items-center rounded-full
                  transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
                  ${booking_status ? "bg-primary" : "bg-input"}
                `}
              >
                <motion.span
                  layout
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className={`
                    inline-block h-4 w-4 transform rounded-full bg-white shadow-lg
                    ${
                      booking_status
                        ? "ltr:translate-x-6 rtl:-translate-x-6"
                        : "ltr:translate-x-1 rtl:-translate-x-1"
                    }
                  `}
                />
              </button>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-4">
            <motion.button
              type="button"
              onClick={onPrevious}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="
                flex items-center gap-2 px-6 py-3 rounded-lg
                bg-secondary text-secondary-foreground font-medium
                hover:opacity-90 transition-opacity
                focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
              "
            >
              <FaArrowLeft className="h-4 w-4 rtl:rotate-180" />
              {t("buttons.previous")}
            </motion.button>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="
                flex items-center gap-2 px-6 py-3 rounded-lg
                bg-primary text-primary-foreground font-medium
                hover:opacity-90 transition-opacity
                focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
              "
            >
              {t("buttons.next")}
              <FaArrowRight className="h-4 w-4 rtl:rotate-180" />
            </motion.button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
