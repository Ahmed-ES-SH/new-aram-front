"use client";

import type React from "react";

import { useTranslations } from "next-intl";
import {
  FaArrowRight,
  FaArrowLeft,
  FaBuilding,
  FaAlignLeft,
} from "react-icons/fa";
import { motion } from "framer-motion";

interface InfoStepProps {
  title: string;
  description: string;
  onUpdate: (data: { title?: string; description?: string }) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export function InfoStep({
  title,
  description,
  onUpdate,
  onNext,
  onPrevious,
}: InfoStepProps) {
  const t = useTranslations("registration");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
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
          {t("steps.info")}
        </h2>
        <p className="text-muted-foreground mb-8">{t("infoStepTitle")}</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title Field */}
          <div className="space-y-2">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-foreground"
            >
              {t("fields.title.label")}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FaBuilding className="h-5 w-5 text-muted-foreground" />
              </div>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => onUpdate({ title: e.target.value })}
                placeholder={t("fields.title.placeholder")}
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

          {/* Description Field */}
          <div className="space-y-2">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-foreground"
            >
              {t("fields.description.label")}
            </label>
            <div className="relative">
              <div className="absolute top-3 left-0 pl-4 pointer-events-none">
                <FaAlignLeft className="h-5 w-5 text-muted-foreground" />
              </div>
              <textarea
                id="description"
                value={description}
                onChange={(e) => onUpdate({ description: e.target.value })}
                placeholder={t("fields.description.placeholder")}
                required
                rows={5}
                className="
                  w-full pl-12 pr-4 py-3 rounded-lg border border-input
                  bg-background text-foreground
                  focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent
                  transition-all duration-200
                  placeholder:text-muted-foreground
                  resize-none
                "
              />
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
