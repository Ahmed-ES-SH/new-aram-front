import { motion, AnimatePresence } from "framer-motion";
import { FiAlertCircle } from "react-icons/fi";
import { FieldRenderer } from "./FieldRenderer";
import { FieldDefinition } from "./types";
import { useTranslations } from "next-intl";

interface StepFormProps {
  schema: { name?: string; fields: FieldDefinition[] };
  formData: any;
  errors: Record<string, string[]>;
  handleChange: (fieldKey: string, value: any) => void;
  submitting: boolean;
  handleNext: () => void;
  checkVisibility: (field: FieldDefinition) => boolean;
  globalError: string | null;
}

export const StepForm = ({
  schema,
  formData,
  errors,
  handleChange,
  submitting,
  handleNext,
  checkVisibility,
  globalError,
}: StepFormProps) => {
  const t = useTranslations("servicePage.dynamicServiceForm");

  return (
    <motion.form
      key="step1"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      onSubmit={(e) => {
        e.preventDefault();
        handleNext();
      }}
      className="space-y-6 w-full"
      noValidate
    >
      {/* Render Fields */}
      <div className="bg-white  max-h-[60vh] overflow-y-auto z-999999 rounded-2xl p-6 shadow-sm border border-gray-100 space-y-6">
        {schema.name && <h2 className="text-xl font-bold">{schema.name}</h2>}
        {schema.fields
          .sort((a, b) => a.order - b.order)
          .map((field) => {
            if (!checkVisibility(field)) return null;
            return (
              <motion.div
                key={field.key}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {field.type !== "checkbox" && (
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {field.label}{" "}
                    {field.required && <span className="text-red-500">*</span>}
                  </label>
                )}
                <FieldRenderer
                  field={field}
                  value={formData[field.key]}
                  error={errors[field.key]}
                  onChange={handleChange}
                  submitting={submitting}
                />
                <AnimatePresence>
                  {errors[field.key]?.map((err, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      className="text-red-500 text-xs mt-1 flex items-center gap-1"
                    >
                      <FiAlertCircle size={12} /> {err}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            );
          })}
      </div>
      {globalError && (
        <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg">
          {globalError}
        </div>
      )}
      <button
        type="submit"
        className="w-fit ml-auto block py-3 lg:px-12 px-4 bg-primary text-white rounded-xl font-bold hover:bg-primary/90"
      >
        {t("next")}
      </button>
    </motion.form>
  );
};
