import { useState } from "react";
import { z, ZodSchema } from "zod";
import { useTranslations } from "next-intl";

type ValidationErrors<T> = Partial<Record<keyof T, string>>;

export function useValidation<T>(schema: ZodSchema<T>) {
  const [errors, setErrors] = useState<ValidationErrors<T>>({});
  const t = useTranslations("registration.validation");
  // Assuming keys like: registration.validation.required, registration.validation.invalid_email, etc.

  const validate = (data: T): boolean => {
    const result = schema.safeParse(data);

    if (!result.success) {
      const fieldErrors: ValidationErrors<T> = {};

      result.error.issues.forEach((issue) => {
        const path = issue.path[0] as keyof T;
        // The message from schema is the error code (e.g., "required")
        // We translate it here.
        // We might need to handle fallbacks if key doesn't exist,
        // but for now strict mapping is fine or simple fallback.
        const msgCode = issue.message;

        let translatedMsg = msgCode;
        try {
          translatedMsg = t(msgCode);
        } catch (e) {
          // fallback if translation fails or key missing
          translatedMsg = msgCode;
        }

        // Only set the first error for each field
        if (!fieldErrors[path]) {
          fieldErrors[path] = translatedMsg;
        }
      });

      setErrors(fieldErrors);
      return false;
    }

    setErrors({});
    return true;
  };

  const clearError = (field: keyof T) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  return {
    errors,
    validate,
    clearError,
    setErrors,
  };
}
