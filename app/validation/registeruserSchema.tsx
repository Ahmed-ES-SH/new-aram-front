import { z } from "zod";

export const getRegisterUserSchema = (t: (key: string) => string) => {
  return z.object({
    id_number: z
      .string()
      .optional() // يخلي الحقل مش مطلوب
      .refine((val) => !val || /^\d+$/.test(val), {
        message: t("id_number.numeric"), // الرسالة لو مش أرقام
      }),
    name: z.string().min(1, t("name.required")),
    email: z.string().min(1, t("email.required")).email(t("email.email")),
    password: z
      .string()
      .min(1, t("password.required"))
      .min(8, t("password.min")),
    password_confirmation: z
      .string()
      .min(1, t("password_confirmation.required")),
    phone: z
      .string()
      .min(1, t("phone.required"))
      .regex(/^[0-9]{10,15}$/, t("phone.regex")),
    gender: z.enum(["male", "female"], {
      message: t("gender.in"),
    }),
    birth_date: z
      .string()
      .min(1, t("birth_date.required"))
      .refine((val) => !isNaN(Date.parse(val)), t("birth_date.date")),
    country: z.string().optional(),
    image: z.any().optional(),
  });
};
