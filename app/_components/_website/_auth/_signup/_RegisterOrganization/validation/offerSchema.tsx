import { z } from "zod";

export function getOfferSchema(t: (key: string) => string) {
  // إضافة نوع T لـ t
  return z
    .object({
      // 1. استخدام 'message' بدلاً من 'required_error' لـ z.string()
      title: z
        .string({
          message: t("offer.title.required"), // تم التصحيح
        })
        .min(3, { message: t("offer.title.min") })
        .max(150, { message: t("offer.title.max") }),

      description: z
        .string({
          message: t("offer.description.required"), // تم التصحيح
        })
        .min(8, { message: t("offer.description.min") })
        .max(2000, { message: t("offer.description.max") }),

      image: z
        .any()
        .refine((v) => v === null || v instanceof File, {
          message: t("offer.image.invalid"),
        })
        .optional()
        .nullable(),

      // 2. استخدام 'message' بدلاً من 'errorMap' لـ z.enum()
      discount_type: z.enum(["percentage", "fixed"], {
        message: t("offer.discount_type.invalid"), // تم التصحيح
      }),

      discount_value: z.coerce
        .number({
          message: t("offer.discount_value.numeric"), // استخدام 'message' بدلاً من 'invalid_type_error'
        })
        .refine((val) => val !== null && val !== undefined, {
          // ضمان أن القيمة موجودة بعد التحويل
          message: t("offer.discount_value.required"),
        })
        .positive({
          message: t("offer.discount_value.positive"),
        })
        // إذا كنت تريد التأكد من أن القيمة ليست صفر (0) أيضاً، يمكنك إضافة:
        .refine((val) => val > 0, {
          message: t("offer.discount_value.positive"), // أو رسالة مختلفة لـ > 0
        }),

      start_date: z
        .string({
          message: t("offer.start_date.required"), // تم التصحيح
        })
        .refine((s) => !Number.isNaN(Date.parse(s)), {
          message: t("offer.start_date.invalid"),
        }),

      end_date: z
        .string({
          message: t("offer.end_date.required"), // تم التصحيح
        })
        .refine((s) => !Number.isNaN(Date.parse(s)), {
          message: t("offer.end_date.invalid"),
        }),

      category_id: z.coerce
        .number()
        .int({ message: t("offer.category_id.invalid") }) // must be integer
        .positive({ message: t("offer.category_id.invalid") }) // must be > 0
        .refine((val) => val !== null && !isNaN(val), {
          message: t("offer.category_id.required"),
        }),

      code: z
        .string({
          message: t("offer.code.required"), // تم التصحيح
        })
        .min(3, { message: t("offer.code.min") })
        .max(32, { message: t("offer.code.max") })
        .regex(/^[A-Z0-9-_]+$/i, {
          message: t("offer.code.invalid"),
        }),
    })
    .superRefine((data, ctx) => {
      const start = Date.parse(data.start_date);
      const end = Date.parse(data.end_date);

      if (!Number.isNaN(start) && !Number.isNaN(end) && end < start) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t("offer.end_date.after_start"),
          path: ["end_date"],
        });
      }

      if (data.discount_type === "percentage") {
        if (typeof data.discount_value === "number") {
          if (data.discount_value <= 0 || data.discount_value > 100) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: t("offer.discount_value.range"),
              path: ["discount_value"],
            });
          }
        }
      }
    });
}
