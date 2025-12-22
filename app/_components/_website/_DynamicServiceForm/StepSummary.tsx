import { motion } from "framer-motion";
import { FiLoader } from "react-icons/fi";
import { FieldDefinition } from "./types";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

interface StepSummaryProps {
  schema: { fields: FieldDefinition[] };
  formData: any;
  submitting: boolean;
  handleBack: () => void;
  handleSubmit: (e: any, summary: any) => void;
  price?: number;
  price_before_discount?: number;
  checkVisibility: (field: FieldDefinition) => boolean;
  globalError: string | null;
}

export const StepSummary = ({
  schema,
  formData,
  submitting,
  handleBack,
  handleSubmit,
  price,
  price_before_discount,
  checkVisibility,
  globalError,
}: StepSummaryProps) => {
  const t = useTranslations("servicePage.dynamicServiceForm");

  const [summary, setSummary] = useState<any>(null);

  useEffect(() => {
    const summaryData = schema.fields
      .sort((a, b) => a.order - b.order)
      .map((field) => {
        const value = formData[field.key];
        if (!value || !checkVisibility(field)) return null;

        let displayValue = String(value);
        if (field.type === "dropdown" || field.type === "radio") {
          const option = field.options?.choices.find(
            (c) => String(c.value) === String(value)
          );
          if (option) displayValue = option.label;
        } else if (
          field.type === "file_upload" ||
          field.type === "image_upload"
        ) {
          displayValue = value instanceof File ? value.name : "";
        } else if (Array.isArray(value)) {
          displayValue = value.join(", ");
        }

        return {
          key: field.key,
          label: field.label,
          value: displayValue,
          type: field.type,
        };
      })
      .filter((item) => item !== null);
    setSummary(summaryData);
  }, [schema]);

  console.log(summary);

  return (
    <motion.div
      key="step2"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-6">
        <h2 className="text-xl font-bold">{t("orderSummary")}</h2>

        {/* Pricing Section */}
        {(price !== undefined || price_before_discount !== undefined) && (
          <div className="bg-gray-50 rounded-xl p-4 space-y-2 border border-blue-100">
            <div className="flex justify-between items-center max-md:flex-col text-gray-600">
              <span>{t("servicePrice")}</span>
              <div className="flex items-center gap-2">
                {price_before_discount && (
                  <span className="text-sm line-through text-gray-400">
                    {price_before_discount} ر.ع
                  </span>
                )}
                <span className="font-bold text-primary text-lg">
                  {price} ر.ع
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Form Summary */}
        <div className="space-y-4">
          {schema.fields
            .sort((a, b) => a.order - b.order)
            .map((field) => {
              const value = formData[field.key];
              if (!value || !checkVisibility(field)) return null;

              let displayValue = String(value);
              if (field.type === "dropdown" || field.type === "radio") {
                const option = field.options?.choices.find(
                  (c) => String(c.value) === String(value)
                );
                if (option) displayValue = option.label;
              } else if (
                field.type === "file_upload" ||
                field.type === "image_upload"
              ) {
                displayValue = value instanceof File ? value.name : "";
              } else if (Array.isArray(value)) {
                displayValue = value.join(", ");
              }

              return (
                <div
                  key={field.key}
                  className="flex justify-between border-b border-gray-100 pb-2 last:border-0"
                >
                  <span className="text-gray-500 text-sm">{field.label}</span>
                  <span className="font-medium text-gray-800 text-sm text-end max-w-[60%]">
                    {displayValue}
                  </span>
                </div>
              );
            })}
        </div>
      </div>

      {globalError && (
        <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg">
          {globalError}
        </div>
      )}

      <div className="flex items-center max-md:flex-col-reverse max-md:w-full gap-4">
        <button
          type="button"
          onClick={handleBack}
          disabled={submitting}
          className="w-1/3 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200"
        >
          {t("back")}
        </button>
        <button
          onClick={(e) => handleSubmit(e, summary)}
          disabled={submitting}
          className="w-2/3 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 disabled:opacity-50"
        >
          {submitting ? (
            <FiLoader className="animate-spin inline-block" />
          ) : (
            <>
              {t("checkout")}
              {price && ` • ${price} ر.ع`}
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
};
