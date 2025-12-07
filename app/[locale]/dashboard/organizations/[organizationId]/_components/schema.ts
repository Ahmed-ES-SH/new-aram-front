import { z } from "zod";

export const benefitSchema = z.object({
  title: z.string().min(1, "Required"),
});

export const formSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(2, "Title is too short"),
  description: z.string().min(10, "Description is too short"),
  email: z.string().email(),
  phone_number: z.string().min(5, "Phone number is invalid"),
  status: z.string(),
  active: z.coerce.number(),
  booking_status: z.coerce.number(),
  confirmation_status: z.coerce.number(),
  confirmation_price: z.coerce.number(),
  open_at: z.string(),
  close_at: z.string(),
  url: z.string().optional().or(z.literal("")),
  accaptable_message: z.string().optional(),
  unaccaptable_message: z.string().optional(),
  location: z.object({
    address: z.string(),
    coordinates: z.object({
      lat: z.number(),
      lng: z.number(),
    }),
  }),
  categories: z.array(z.number()).min(1, "Select at least one category"),
  sub_categories: z.array(z.number()),
  keywords: z.array(z.object({ id: z.number(), title: z.string() })),
  benefits: z.array(benefitSchema),
});

export type FormValues = z.infer<typeof formSchema>;
