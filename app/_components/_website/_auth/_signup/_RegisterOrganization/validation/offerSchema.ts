import { z } from "zod";

export const getOfferSchema = (t: any) => {
  return z
    .object({
      title: z
        .string({ message: t("required") })
        .min(3, t("min_3"))
        .max(150, t("max_150")),
      description: z
        .string({ message: t("required") })
        .min(10, t("min_10"))
        .max(2000, t("max_2000")),
      image: z.custom<File>((v) => v instanceof File, {
        message: t("image_required"),
      }),
      discount_type: z.enum(["percentage", "fixed"] as const, {
        message: t("invalid_option"),
      }),
      discount_value: z.coerce
        .number({ message: t("numeric") })
        .positive(t("positive")),
      start_date: z
        .string({ message: t("required") })
        .refine((val) => !isNaN(Date.parse(val)), t("invalid_date")),
      end_date: z
        .string({ message: t("required") })
        .refine((val) => !isNaN(Date.parse(val)), t("invalid_date")),
      category_id: z.coerce.number().int().positive(t("required")),
      code: z
        .string({ message: t("required") })
        .min(3, t("min_3"))
        .max(32, t("max_32"))
        .regex(/^[A-Z0-9-_]+$/i, t("invalid_code")),

      // Optional fields that might be in the object but not validated strictly or pass through
      status: z.string().optional(),
      organization_id: z.any().optional(),
    })
    .superRefine((data, ctx) => {
      if (data.start_date && data.end_date) {
        const start = new Date(data.start_date).getTime();
        const end = new Date(data.end_date).getTime();
        if (end < start) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t("end_date_after_start"),
            path: ["end_date"],
          });
        }
      }

      if (data.discount_type === "percentage" && data.discount_value > 100) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t("percentage_max_100"),
          path: ["discount_value"],
        });
      }
    });
};
