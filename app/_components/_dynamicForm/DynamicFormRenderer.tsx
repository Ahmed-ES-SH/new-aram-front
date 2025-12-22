"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiLoader,
  FiArrowLeft,
  FiArrowRight,
  FiCheck,
  FiAlertTriangle,
} from "react-icons/fi";
import { useLocale } from "next-intl";

import {
  FormSchema,
  FormField,
  DynamicFormRendererProps,
  LocalizedText,
  ConditionalRule,
} from "./types";
import { useFormValidation } from "./hooks/useFormValidation";
import FormStepIndicator from "./FormStepIndicator";
import NoFormFallback from "./NoFormFallback";
import {
  TextField,
  TextareaField,
  SelectField,
  RadioField,
  CheckboxField,
  FileUploadField,
  DateField,
  NumberField,
} from "./fields";

// Helper to get localized text
function getLocalizedText(
  text: LocalizedText | string | undefined,
  locale: "ar" | "en"
): string {
  if (!text) return "";
  if (typeof text === "string") return text;
  return text[locale] || text.ar || text.en || "";
}

// Check if a field should be visible based on conditional rules
function checkConditionalVisibility(
  rule: ConditionalRule | undefined,
  values: Record<string, any>
): boolean {
  if (!rule) return true;

  const fieldValue = values[rule.field];

  switch (rule.operator) {
    case "equals":
      return fieldValue === rule.value;
    case "notEquals":
      return fieldValue !== rule.value;
    case "contains":
      return String(fieldValue).includes(String(rule.value));
    case "greaterThan":
      return Number(fieldValue) > Number(rule.value);
    case "lessThan":
      return Number(fieldValue) < Number(rule.value);
    default:
      return true;
  }
}

// Get the field component based on field type
function getFieldComponent(field: FormField) {
  switch (field.type) {
    case "text":
    case "email":
    case "phone":
    case "url":
    case "hidden":
      return TextField;
    case "textarea":
      return TextareaField;
    case "select":
      return SelectField;
    case "radio":
      return RadioField;
    case "checkbox":
      return CheckboxField;
    case "file":
    case "image":
      return FileUploadField;
    case "date":
    case "time":
    case "datetime":
      return DateField;
    case "number":
      return NumberField;
    case "color":
      return TextField; // Basic color input
    default:
      return TextField;
  }
}

export default function DynamicFormRenderer({
  schema,
  initialData = {},
  onSubmit,
  onStepChange,
  onValuesChange,
  locale: propLocale,
  disabled = false,
  showSubmitButton = true,
  submitButtonClassName,
  className,
}: DynamicFormRendererProps) {
  const defaultLocale = useLocale() as "ar" | "en";
  const locale = propLocale || defaultLocale;
  const isRTL = locale === "ar";

  // State
  const [values, setValues] = useState<Record<string, any>>(() => {
    const defaults: Record<string, any> = {};
    schema.fields.forEach((field) => {
      defaults[field.name] = field.defaultValue ?? "";
    });
    return { ...defaults, ...initialData };
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  // Validation
  const {
    errors,
    touched,
    validateField,
    validateAllFields,
    setFieldTouched,
    setAllTouched,
    setServerErrors,
  } = useFormValidation(schema, locale);

  // Check if multi-step form
  const isMultiStep = schema.steps && schema.steps.length > 1;
  const totalSteps = schema.steps?.length || 1;

  // Get fields for current step
  const currentStepFields = useMemo(() => {
    if (!isMultiStep) return schema.fields;
    return schema.fields.filter((field) => (field.step || 1) === currentStep);
  }, [schema.fields, currentStep, isMultiStep]);

  // Filter visible fields based on conditional rules
  const visibleFields = useMemo(() => {
    return currentStepFields.filter((field) =>
      checkConditionalVisibility(field.conditionalOn, values)
    );
  }, [currentStepFields, values]);

  // Handle field value change
  const handleChange = useCallback(
    (fieldName: string, value: any) => {
      setValues((prev) => {
        const newValues = { ...prev, [fieldName]: value };
        onValuesChange?.(newValues);
        return newValues;
      });
      // Validate on change if field was touched
      if (touched[fieldName]) {
        validateField(fieldName, value);
      }
      setSubmitError(null);
    },
    [touched, validateField, onValuesChange]
  );

  // Handle field blur
  const handleBlur = useCallback(
    (fieldName: string) => {
      setFieldTouched(fieldName);
      validateField(fieldName, values[fieldName]);
    },
    [setFieldTouched, validateField, values]
  );

  // Validate current step
  const validateCurrentStep = useCallback((): boolean => {
    let isValid = true;
    visibleFields.forEach((field) => {
      const error = validateField(field.name, values[field.name]);
      if (error) {
        isValid = false;
        setFieldTouched(field.name);
      }
    });
    return isValid;
  }, [visibleFields, validateField, values, setFieldTouched]);

  // Handle next step
  const handleNextStep = useCallback(() => {
    if (validateCurrentStep()) {
      setCompletedSteps((prev) => [...new Set([...prev, currentStep])]);
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
      onStepChange?.(currentStep + 1);
    }
  }, [validateCurrentStep, currentStep, totalSteps, onStepChange]);

  // Handle previous step
  const handlePrevStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    onStepChange?.(currentStep - 1);
  }, [currentStep, onStepChange]);

  // Handle step click
  const handleStepClick = useCallback(
    (step: number) => {
      if (step < currentStep || completedSteps.includes(step)) {
        setCurrentStep(step);
        onStepChange?.(step);
      }
    },
    [currentStep, completedSteps, onStepChange]
  );

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    setAllTouched();
    if (!validateAllFields(values)) {
      return;
    }

    if (!onSubmit) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const result = await onSubmit(values);
      if (result) {
        if (result.success) {
          setSubmitSuccess(true);
        } else if (result.errors) {
          setServerErrors(result.errors);
          setSubmitError(
            typeof result.message === "string"
              ? result.message
              : getLocalizedText(result.message, locale) ||
                  (locale === "ar"
                    ? "حدث خطأ أثناء الإرسال"
                    : "An error occurred")
          );
        }
      } else {
        setSubmitSuccess(true);
      }
    } catch (error: any) {
      console.error("Form submission error:", error);
      setSubmitError(
        error?.response?.data?.message ||
          (locale === "ar" ? "حدث خطأ أثناء الإرسال" : "An error occurred")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // If no fields, show fallback
  if (!schema.fields || schema.fields.length === 0) {
    return <NoFormFallback locale={locale} />;
  }

  // Success state
  if (submitSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl p-8 shadow-lg text-center"
      >
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <FiCheck className="text-green-600" size={40} />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          {locale === "ar" ? "تم الإرسال بنجاح!" : "Successfully Submitted!"}
        </h3>
        <p className="text-gray-500">
          {locale === "ar" ? "سنتواصل معك قريباً" : "We will contact you soon"}
        </p>
      </motion.div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`bg-white rounded-3xl p-6 md:p-8 shadow-lg border border-gray-100 ${
        className || ""
      }`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Form Header */}
      {schema.title && (
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-gray-900">
            {getLocalizedText(schema.title, locale)}
          </h2>
          {schema.description && (
            <p className="text-gray-500 mt-2">
              {getLocalizedText(schema.description, locale)}
            </p>
          )}
        </div>
      )}

      {/* Step Indicator */}
      {isMultiStep && schema.steps && (
        <FormStepIndicator
          steps={schema.steps}
          currentStep={currentStep}
          onStepClick={handleStepClick}
          locale={locale}
          completedSteps={completedSteps}
        />
      )}

      {/* Form Fields */}
      <div className="space-y-5">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: isRTL ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: isRTL ? 20 : -20 }}
            transition={{ duration: 0.2 }}
            className="flex flex-wrap gap-5"
          >
            {visibleFields.map((field) => {
              if (field.type === "hidden") {
                return (
                  <input
                    key={field.id}
                    type="hidden"
                    name={field.name}
                    value={values[field.name] || ""}
                  />
                );
              }

              const FieldComponent = getFieldComponent(field);

              return (
                <div
                  key={field.id}
                  className={`
                    ${
                      field.width === "half"
                        ? "w-full md:w-[calc(50%-10px)]"
                        : field.width === "third"
                        ? "w-full md:w-[calc(33.333%-14px)]"
                        : "w-full"
                    }
                  `}
                >
                  <FieldComponent
                    field={field}
                    value={values[field.name]}
                    error={errors[field.name]}
                    touched={touched[field.name]}
                    disabled={disabled || isSubmitting}
                    locale={locale}
                    onChange={(value) => handleChange(field.name, value)}
                    onBlur={() => handleBlur(field.name)}
                  />
                </div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Submit Error */}
      <AnimatePresence>
        {submitError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700"
          >
            <FiAlertTriangle size={20} />
            <span>{submitError}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation / Submit Buttons */}
      {showSubmitButton && (
        <div className="flex items-center justify-between mt-8 gap-4">
          {/* Previous Button */}
          {isMultiStep && currentStep > 1 ? (
            <button
              type="button"
              onClick={handlePrevStep}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
            >
              {isRTL ? <FiArrowRight size={18} /> : <FiArrowLeft size={18} />}
              {locale === "ar" ? "السابق" : "Previous"}
            </button>
          ) : (
            <div />
          )}

          {/* Next / Submit Button */}
          {isMultiStep && currentStep < totalSteps ? (
            <button
              type="button"
              onClick={handleNextStep}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25"
            >
              {locale === "ar" ? "التالي" : "Next"}
              {isRTL ? <FiArrowLeft size={18} /> : <FiArrowRight size={18} />}
            </button>
          ) : (
            <button
              type="submit"
              disabled={disabled || isSubmitting}
              className={`
                flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-medium transition-all
                ${
                  disabled || isSubmitting
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/25"
                }
                ${submitButtonClassName || ""}
              `}
            >
              {isSubmitting ? (
                <>
                  <FiLoader className="animate-spin" size={18} />
                  {locale === "ar" ? "جاري الإرسال..." : "Submitting..."}
                </>
              ) : (
                <>
                  <FiCheck size={18} />
                  {getLocalizedText(schema.submitButtonText, locale) ||
                    (locale === "ar" ? "إرسال" : "Submit")}
                </>
              )}
            </button>
          )}
        </div>
      )}
    </form>
  );
}
