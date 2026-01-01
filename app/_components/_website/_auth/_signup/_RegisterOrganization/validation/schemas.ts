import { z } from "zod";

export const accountSchema = z.object({
  email: z.string({ message: "required" }).email("invalid_email"),
  password: z.string({ message: "required" }).min(8, "min_8"),
  phone_number: z.string({ message: "required" }).min(8, "invalid_phone"), // Simple length check, adjust as needed
  // Location is complex object, usually we check if it's not null
  // We can validate it at component level or assume if it's in state it's valid
  // But strictly speeking, we can add a custom check
});

export const infoSchema = z.object({
  title: z.string({ message: "required" }).min(3, "min_3").max(100, "max_100"),
  description: z
    .string({ message: "required" })
    .min(10, "min_10")
    .max(1000, "max_1000"),
});

export const mediaSchema = z.object({
  image: z.custom<File>((v) => v instanceof File, { message: "required" }),
  logo: z.custom<File>((v) => v instanceof File, { message: "required" }),
  categories: z.array(z.number()).min(1, "required"),
  subcategories: z.array(z.number()).min(1, "required"),
});

export const schedulingSchema = z.object({
  open_at: z.string({ message: "required" }).min(1, "required"),
  close_at: z.string({ message: "required" }).min(1, "required"),
  confirmation_price: z.coerce.number().min(0, "min_0"),
  confirmation_status: z.boolean(),
  booking_status: z.boolean(),
});

export const offerSchema = z
  .object({
    title: z
      .string({ message: "required" })
      .min(3, "min_3")
      .max(150, "max_150"),
    description: z
      .string({ message: "required" })
      .min(8, "min_8")
      .max(2000, "max_2000"),
    image: z.custom<File>((v) => v instanceof File, { message: "required" }),
    discount_type: z.enum(["percentage", "fixed"] as const, {
      message: "invalid_option",
    }),
    discount_value: z.coerce
      .number({ message: "numeric" })
      .positive("positive"),
    start_date: z
      .string({ message: "required" })
      .refine((val) => !isNaN(Date.parse(val)), "invalid_date"),
    end_date: z
      .string({ message: "required" })
      .refine((val) => !isNaN(Date.parse(val)), "invalid_date"),
    category_id: z.coerce.number().int().positive("required"),
    code: z
      .string({ message: "required" })
      .min(3, "min_3")
      .max(32, "max_32")
      .regex(/^[A-Z0-9-_]+$/i, "invalid_code"),
  })
  .superRefine((data, ctx) => {
    if (data.start_date && data.end_date) {
      const start = new Date(data.start_date).getTime();
      const end = new Date(data.end_date).getTime();
      if (end < start) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "end_date_after_start",
          path: ["end_date"],
        });
      }
    }

    if (data.discount_type === "percentage" && data.discount_value > 100) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "percentage_max_100",
        path: ["discount_value"],
      });
    }
  });
