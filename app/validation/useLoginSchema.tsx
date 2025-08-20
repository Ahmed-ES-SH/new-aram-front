import { z } from "zod";
import { useTranslations } from "next-intl";

export const useLoginSchema = () => {
  const t = useTranslations("loginValidation");

  return z.object({
    phoneOrEmail: z
      .string()
      .min(1, t("phoneOrEmail_required"))
      .refine(
        (value) =>
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ||
          /^\+?[0-9]{8,15}$/.test(value),
        { message: t("phoneOrEmail_invalid") }
      ),
    password: z
      .string()
      .min(1, t("password_required"))
      .min(3, t("password_min", { min: 3 })),
  });
};
