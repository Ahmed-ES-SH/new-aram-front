"use client";

import React from "react";

import { useLocale, useTranslations } from "next-intl";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
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

const ErrorMessage = ({ message }: { message: string }) => (
  <motion.div
    initial={{ opacity: 0, height: 0, y: -10 }}
    animate={{ opacity: 1, height: "auto", y: 0 }}
    exit={{ opacity: 0, height: 0, y: -10 }}
    className="flex items-center gap-2 mt-2 text-red-500 bg-red-50 px-3 py-2 rounded-md text-sm font-medium border border-red-100"
  >
    <MdErrorOutline className="w-4 h-4 shrink-0" />
    <span>{message}</span>
  </motion.div>
);

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
    const isValid = validate({ image, logo, categories, subcategories } as any);

    if (isValid) {
      onNext();
    } else {
      // Find the first error and scroll to it
      const firstErrorField =
        Object.keys(errors)[0] ||
        Object.keys(
          validate({ image, logo, categories, subcategories } as any) || {}
        )[0]; // Re-validate to get errors if state update is slow, though useValidation usually updates state immediately.
      // Actually useValidation updates 'errors' state. We might need to rely on the fact that errors state will be updated.
      // But since setState is async, we might not have the updated errors immediately here if we just called validate().
      // However, standard pattern is usually: validate returns errors or boolean.
      // Assuming useValidation returns boolean but updates state side-effect.

      // Let's manually check the object we just validated vs schema to know what failed if 'errors' isn't ready, OR
      // we can setTimeout to scroll after render.

      // Better approach: Since we know the fields, we can check them in order.
      const fields = ["image", "logo", "categories", "subcategories"];
      // We can rely on the fact that we'll re-render with errors. But to scroll NOW, we need to know.
      // Let's delay the scroll slightly to allow React to render the error states.

      setTimeout(() => {
        const errorElement = document.querySelector('[data-has-error="true"]');
        if (errorElement) {
          errorElement.scrollIntoView({ behavior: "smooth", block: "center" });
          // Optional: Add a shake animation class or focus
        }
      }, 100);
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
            <div
              id="field-image"
              className={`flex flex-col items-start gap-3 flex-1 transition-all duration-300 ${
                errors.image
                  ? "p-2 rounded-xl bg-red-50/50 border border-red-100"
                  : ""
              }`}
              data-has-error={!!errors.image}
            >
              <ImageUploader
                label={t("fields.image.label")}
                hint={t("fields.image.hint")}
                value={image}
                onChange={(file) => {
                  onUpdate({ image: file });
                  clearError("image");
                }}
              />
              <AnimatePresence>
                {errors.image && <ErrorMessage message={errors.image} />}
              </AnimatePresence>
            </div>

            <div
              id="field-logo"
              className={`flex flex-col items-start gap-3 flex-1 transition-all duration-300 ${
                errors.logo
                  ? "p-2 rounded-xl bg-red-50/50 border border-red-100"
                  : ""
              }`}
              data-has-error={!!errors.logo}
            >
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
              <AnimatePresence>
                {errors.logo && <ErrorMessage message={errors.logo} />}
              </AnimatePresence>
            </div>
          </div>

          <div
            id="field-categories"
            className={`space-y-3 transition-all duration-300 ${
              errors.categories
                ? "p-4 rounded-xl bg-red-50/30 border border-red-100"
                : ""
            }`}
            data-has-error={!!errors.categories}
          >
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
            <AnimatePresence>
              {errors.categories && (
                <ErrorMessage message={errors.categories} />
              )}
            </AnimatePresence>
          </div>

          <div
            id="field-subcategories"
            className={`space-y-3 transition-all duration-300 ${
              errors.subcategories
                ? "p-4 rounded-xl bg-red-50/30 border border-red-100"
                : ""
            }`}
            data-has-error={!!errors.subcategories}
          >
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
            <AnimatePresence>
              {errors.subcategories && (
                <ErrorMessage message={errors.subcategories} />
              )}
            </AnimatePresence>
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
