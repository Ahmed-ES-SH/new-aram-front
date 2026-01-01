import { z } from "zod";

export const benefitSchema = z.object({
  title: z.string().min(1, "مطلوب"),
});

export const formSchema = z.object({
  id: z.number().optional(),
  title: z
    .string()
    .min(1, "اسم المركز مطلوب")
    .min(2, "اسم المركز يجب أن يكون حرفين على الأقل"),
  description: z
    .string()
    .min(1, "وصف المركز مطلوب")
    .min(10, "الوصف يجب أن يكون 10 أحرف على الأقل"),
  email: z.string().email("البريد الإلكتروني غير صالح"),
  password: z.string().optional(),
  phone_number: z.string().min(5, "رقم الهاتف يجب أن يكون 5 أرقام على الأقل"),
  status: z.string(),
  active: z.coerce.number(),
  booking_status: z.coerce.number(),
  confirmation_status: z.coerce.number(),
  confirmation_price: z.coerce
    .number()
    .min(0, "سعر التأكيد يجب أن يكون 0 أو أكثر"),
  open_at: z.string().min(1, "وقت البدء مطلوب"),
  close_at: z.string().min(1, "وقت الإغلاق مطلوب"),
  url: z.string().optional().or(z.literal("")),
  accaptable_message: z.string().optional(),
  unaccaptable_message: z.string().optional(),
  location: z.object({
    address: z.string().min(1, "العنوان مطلوب"),
    coordinates: z.object({
      lat: z.coerce.number(),
      lng: z.coerce.number(),
    }),
  }),
  categories: z.array(z.number()).min(1, "يرجى اختيار قسم واحد على الأقل"),
  sub_categories: z.array(z.number()).optional(),
  keywords: z.array(z.object({ id: z.number(), title: z.string() })).optional(),
  benefits: z.array(benefitSchema).optional(),
  email_verified: z.any().optional(),
});

export type FormValues = z.infer<typeof formSchema>;
