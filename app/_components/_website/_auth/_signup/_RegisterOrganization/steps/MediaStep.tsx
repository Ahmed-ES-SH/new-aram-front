"use client";

import React, { useState } from "react";

import { useLocale, useTranslations } from "next-intl";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { motion } from "framer-motion";
import { ImageUploader } from "../ImageUploader";
import { LogoUploader } from "../LogoUploader";
import { CategoriesSelector } from "../CategoriesSelector";
import { SubCategoriesSelector } from "../SubCategoriesSelector";
import { category } from "@/app/types/_dashboard/GlobalTypes";
import { MdErrorOutline } from "react-icons/md";
import { useValidation } from "../hooks/useValidation";
import { mediaSchema } from "../validation/schemas";

interface MediaStepProps {
  image: File | null;
  logo: File | null;
  categoriesData: category[];
  categories: number[];
  subcategories: number[];
  onUpdate: (data: {
    image?: File | null;
    logo?: File | null;
    categories?: number[];
    subcategories?: number[];
  }) => void;
  onPrevious: () => void;
  onNext: () => void;
}

export function MediaStep({
  image,
  logo,
  categories,
  categoriesData,
  subcategories,
  onUpdate,
  onPrevious,
  onNext,
}: MediaStepProps) {
  const t = useTranslations("registration");

  const locale = useLocale() as "en" | "ar";

  const { validate, errors, clearError } = useValidation(mediaSchema);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate({ image, logo, categories, subcategories } as any)) {
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
          {t("steps.media")}
        </h2>
        <p className="text-muted-foreground mb-8">{t("mediaStepTitle")}</p>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="flex items-center justify-between max-md:flex-col gap-3 w-full">
            {/* Image Uploader */}
            <div className="flex flex-col items-start gap-3 flex-1">
              <ImageUploader
                label={t("fields.image.label")}
                hint={t("fields.image.hint")}
                value={image}
                onChange={(file) => {
                  onUpdate({ image: file });
                  clearError("image");
                }}
              />
              {errors.image && (
                <div className="text-red-500 text-sm flex items-center gap-1 mt-1">
                  <MdErrorOutline /> {errors.image}
                </div>
              )}
            </div>
            <div className="flex flex-col items-start gap-3 flex-1">
              {/* Logo Uploader */}
              <LogoUploader
                label={t("fields.logo.label")}
                hint={t("fields.logo.hint")}
                value={logo}
                onChange={(file) => {
                  onUpdate({ logo: file });
                  clearError("logo");
                }}
              />
              {errors.logo && (
                <div className="text-red-500 text-sm flex items-center gap-1 mt-1">
                  <MdErrorOutline /> {errors.logo}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium text-foreground">
              {t("fields.categories.label")}
            </label>
            <CategoriesSelector
              locale={locale}
              categories={categoriesData}
              selectedCategories={categories}
              onChange={(cats: any) => {
                onUpdate({ categories: cats });
                clearError("categories");
              }}
            />
            {errors.categories && (
              <div className="text-red-500 text-sm flex items-center gap-1">
                <MdErrorOutline /> {errors.categories}
              </div>
            )}
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium text-foreground">
              {t("fields.subcategories.label")}
            </label>
            <SubCategoriesSelector
              locale={locale}
              categories={categoriesData}
              selectedCategories={categories}
              selectedSubcategories={subcategories}
              onChange={(subs: any) => {
                onUpdate({ subcategories: subs });
                clearError("subcategories");
              }}
            />
            {errors.subcategories && (
              <div className="text-red-500 text-sm flex items-center gap-1">
                <MdErrorOutline /> {errors.subcategories}
              </div>
            )}
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
              className="flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
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
