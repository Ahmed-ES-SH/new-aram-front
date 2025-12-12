"use client";

import { useState, useCallback, useMemo } from "react";
import type {
  FormField,
  FormSchema,
  ValidationRule,
  LocalizedText,
} from "../types";

interface UseFormValidationResult {
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isValid: boolean;
  validateField: (name: string, value: any) => string | undefined;
  validateAllFields: (values: Record<string, any>) => boolean;
  setFieldTouched: (name: string) => void;
  setAllTouched: () => void;
  clearErrors: () => void;
  setServerErrors: (
    errors: Record<string, string | string[] | LocalizedText>
  ) => void;
}

function getLocalizedText(
  text: LocalizedText | string | undefined,
  locale: "ar" | "en"
): string {
  if (!text) return "";
  if (typeof text === "string") return text;
  return text[locale] || text.ar || text.en || "";
}

// Default error messages
const DEFAULT_MESSAGES: Record<string, { ar: string; en: string }> = {
  required: { ar: "هذا الحقل مطلوب", en: "This field is required" },
  email: { ar: "البريد الإلكتروني غير صالح", en: "Invalid email address" },
  url: { ar: "الرابط غير صالح", en: "Invalid URL" },
  phone: { ar: "رقم الهاتف غير صالح", en: "Invalid phone number" },
  min: { ar: "القيمة أقل من الحد الأدنى", en: "Value is less than minimum" },
  max: {
    ar: "القيمة أكبر من الحد الأقصى",
    en: "Value is greater than maximum",
  },
  minLength: { ar: "النص قصير جداً", en: "Text is too short" },
  maxLength: { ar: "النص طويل جداً", en: "Text is too long" },
  pattern: {
    ar: "القيمة لا تتطابق مع النمط المطلوب",
    en: "Value does not match required pattern",
  },
};

export function useFormValidation(
  schema: FormSchema,
  locale: "ar" | "en" = "ar"
): UseFormValidationResult {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Build field map for quick lookup
  const fieldMap = useMemo(() => {
    const map: Record<string, FormField> = {};
    schema.fields.forEach((field) => {
      map[field.name] = field;
    });
    return map;
  }, [schema.fields]);

  // Validate a single field
  const validateField = useCallback(
    (name: string, value: any): string | undefined => {
      const field = fieldMap[name];
      if (!field) return undefined;

      // Get validation rules
      const rules: ValidationRule[] = field.validation || [];

      // Add implicit required rule if field.required is true
      if (field.required && !rules.some((r) => r.type === "required")) {
        rules.unshift({
          type: "required",
          message: DEFAULT_MESSAGES.required,
        });
      }

      for (const rule of rules) {
        const errorMessage =
          getLocalizedText(rule.message, locale) ||
          DEFAULT_MESSAGES[rule.type]?.[locale] ||
          DEFAULT_MESSAGES[rule.type]?.ar ||
          "خطأ في التحقق";

        switch (rule.type) {
          case "required": {
            const isEmpty =
              value === undefined ||
              value === null ||
              value === "" ||
              (Array.isArray(value) && value.length === 0);
            if (isEmpty) {
              setErrors((prev) => ({ ...prev, [name]: errorMessage }));
              return errorMessage;
            }
            break;
          }

          case "email": {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (value && !emailRegex.test(value)) {
              setErrors((prev) => ({ ...prev, [name]: errorMessage }));
              return errorMessage;
            }
            break;
          }

          case "url": {
            try {
              if (value) new URL(value);
            } catch {
              setErrors((prev) => ({ ...prev, [name]: errorMessage }));
              return errorMessage;
            }
            break;
          }

          case "phone": {
            const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/;
            if (value && !phoneRegex.test(value)) {
              setErrors((prev) => ({ ...prev, [name]: errorMessage }));
              return errorMessage;
            }
            break;
          }

          case "min": {
            const numValue = parseFloat(value);
            if (!isNaN(numValue) && numValue < Number(rule.value)) {
              setErrors((prev) => ({ ...prev, [name]: errorMessage }));
              return errorMessage;
            }
            break;
          }

          case "max": {
            const numValue = parseFloat(value);
            if (!isNaN(numValue) && numValue > Number(rule.value)) {
              setErrors((prev) => ({ ...prev, [name]: errorMessage }));
              return errorMessage;
            }
            break;
          }

          case "minLength": {
            if (value && String(value).length < Number(rule.value)) {
              setErrors((prev) => ({ ...prev, [name]: errorMessage }));
              return errorMessage;
            }
            break;
          }

          case "maxLength": {
            if (value && String(value).length > Number(rule.value)) {
              setErrors((prev) => ({ ...prev, [name]: errorMessage }));
              return errorMessage;
            }
            break;
          }

          case "pattern": {
            if (value && rule.value) {
              const regex = new RegExp(String(rule.value));
              if (!regex.test(String(value))) {
                setErrors((prev) => ({ ...prev, [name]: errorMessage }));
                return errorMessage;
              }
            }
            break;
          }
        }
      }

      // Clear error if valid
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });

      return undefined;
    },
    [fieldMap, locale]
  );

  // Validate all fields
  const validateAllFields = useCallback(
    (values: Record<string, any>): boolean => {
      let isValid = true;
      const newErrors: Record<string, string> = {};

      schema.fields.forEach((field) => {
        const error = validateField(field.name, values[field.name]);
        if (error) {
          isValid = false;
          newErrors[field.name] = error;
        }
      });

      setErrors(newErrors);
      return isValid;
    },
    [schema.fields, validateField]
  );

  // Set field as touched
  const setFieldTouched = useCallback((name: string) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
  }, []);

  // Set all fields as touched
  const setAllTouched = useCallback(() => {
    const allTouched: Record<string, boolean> = {};
    schema.fields.forEach((field) => {
      allTouched[field.name] = true;
    });
    setTouched(allTouched);
  }, [schema.fields]);

  // Clear all errors
  const clearErrors = useCallback(() => {
    setErrors({});
    setTouched({});
  }, []);

  // Set server-side errors
  const setServerErrors = useCallback(
    (serverErrors: Record<string, string | string[] | LocalizedText>) => {
      const formatted: Record<string, string> = {};
      Object.entries(serverErrors).forEach(([key, value]) => {
        if (typeof value === "string") {
          formatted[key] = value;
        } else if (Array.isArray(value)) {
          formatted[key] = value[0];
        } else if (typeof value === "object") {
          formatted[key] = getLocalizedText(value, locale);
        }
      });
      setErrors(formatted);
    },
    [locale]
  );

  // Check if form is valid
  const isValid = useMemo(() => Object.keys(errors).length === 0, [errors]);

  return {
    errors,
    touched,
    isValid,
    validateField,
    validateAllFields,
    setFieldTouched,
    setAllTouched,
    clearErrors,
    setServerErrors,
  };
}
