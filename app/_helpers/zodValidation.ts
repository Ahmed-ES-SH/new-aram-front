import { z } from "zod";
import { InputField } from "../types/_dashboard/GlobalTypes";

export const generateZodSchema = (inputs: InputField[]) => {
  const shape: Record<string, z.ZodTypeAny> = {};

  inputs.forEach((input) => {
    let schema: z.ZodTypeAny = z.string();

    // Handle File type
    if (
      input.type === "file" ||
      input.fildType === "user-image" ||
      input.fildType === "normal-image"
    ) {
      schema = z.any(); // Zod doesn't have native File in all envs, and we handle files specially
    } else if (input.type === "number" || input.fildType === "number-input") {
      // Coerce to number if it's a number input
      // schema = z.coerce.number();
      // Since value might be string in state, stick to string and use regex or coerce?
      // Form state seems to be string mostly. Let's keep it loose for now or check current usage.
      // Assuming values are stored as strings in the form state for text inputs.
      schema = z.string();
    } else if (
      input.fildType === "select-type" ||
      input.fildType === "select-org"
    ) {
      schema = z.union([z.string(), z.number()]);
    }

    // Apply rules
    if (input.validation?.required) {
      if (schema instanceof z.ZodString) {
        schema = schema.min(1, {
          message: input.validation.message?.ar || "هذا الحقل مطلوب",
        });
      } else {
        // For non-strings (like Files or complex objects), just check existence if needed
        // But z.any().refine(...) is needed for files.
        // Simplest:
        schema = schema.refine(
          (val) => val !== null && val !== undefined && val !== "",
          { message: input.validation.message?.ar || "هذا الحقل مطلوب" }
        );
      }
    } else {
      // Optional
      if (schema instanceof z.ZodString) {
        schema = schema.optional().or(z.literal(""));
      } else {
        schema = schema.optional();
      }
    }

    if (input.validation?.minLength && schema instanceof z.ZodString) {
      schema = schema.min(input.validation.minLength, {
        message:
          input.validation.message?.ar ||
          `يجب أن يحتوي على ${input.validation.minLength} أحرف على الأقل`,
      });
    }

    if (
      (input.type === "email" || input.validation?.email) &&
      schema instanceof z.ZodString
    ) {
      schema = schema.email({
        message: input.validation?.message?.ar || "البريد الإلكتروني غير صالح",
      });
    }

    shape[input.name] = schema;
  });

  return z.object(shape);
};
