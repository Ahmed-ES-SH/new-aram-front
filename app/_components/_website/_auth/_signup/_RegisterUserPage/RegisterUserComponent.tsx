"use client";
import React, { useEffect, useRef, useState } from "react";
import { FaCameraRetro } from "react-icons/fa";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { instance } from "@/app/_helpers/axios";
import { directionMap } from "@/app/constants/_website/global";
import { useLocale, useTranslations } from "next-intl";
import FormInputs from "./FormInputs";
import Img from "../../../_global/Img";
import VerifyMessage from "./verifyMessage";
import { toast } from "sonner";
import { getRegisterUserSchema } from "@/app/validation/registeruserSchema";
import z from "zod";

export default function RegisterUserComponent() {
  const locale = useLocale();

  const t = useTranslations("registerUserPage");
  const t_validation = useTranslations("validation");

  const searchParams = useSearchParams();
  const promoCode: any = searchParams.get("currentCode");
  const decodeCode = atob(promoCode);
  const imageref = useRef<any>(null);
  const [form, setForm] = useState({
    id_number: "",
    name: "",
    email: "",
    phone: "",
    password: "",
    password_confirmation: "",
    gender: "",
    birth_date: "",
  });
  const [step, setStep] = useState(1);
  const [image, setimage] = useState<null | File>(null);
  const [loading, setloading] = useState(false);
  const [errors, seterrors] = useState<any>([]);

  const handleimagechange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setimage(files[0]);
    }
  };

  const checkCode = async (newuserId: any) => {
    try {
      if (newuserId) {
        const response = await instance.post(`/promoter-new-member`, {
          promoter_code: decodeCode,
          new_account_id: newuserId,
          new_account_type: "User",
        });
        if (response.status == 201) {
          setStep(2);
        }
      } else {
        setStep(2);
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setloading(true);
    seterrors({});

    try {
      const schema = await getRegisterUserSchema(t_validation);
      const parsed = schema.safeParse(form);

      if (!parsed.success) {
        const formattedErrors: Record<string, string> = {};

        // هنا TypeScript يعرف إن parsed.error هو ZodError
        parsed.error.issues.forEach((err) => {
          if (err.path.length > 0) {
            formattedErrors[err.path[0] as string] = err.message;
          }
        });

        seterrors(formattedErrors);

        if (form.password !== form.password_confirmation) {
          seterrors({
            ...errors,
            password_confirmation: t_validation("password_confirmation.match"),
          });
        }

        setloading(false);
        return;
      }

      if (form.password !== form.password_confirmation) {
        seterrors({
          ...errors,
          password_confirmation: t_validation("password_confirmation.match"),
        });
        return;
      }

      const formdata = new FormData();
      Object.entries(form).forEach(([key, value]) =>
        formdata.append(key, value as string)
      );
      if (image) formdata.append("image", image);

      const response = await instance.post("/register", formdata);

      if (response.status === 201) {
        setStep(2);
        await instance.post(`/resend-verification-email/User`, {
          email: form.email,
        });
        const user = response.data.data;
        if (decodeCode && user) checkCode(user.id);
      }
    } catch (error: any) {
      console.error("Validation or request error:", error);
      if (error?.response?.data?.errors) {
        seterrors(error.response.data.errors);
      } else if (error) {
        toast.error("حدث خطأ غير متوقع. يرجى المحاولة لاحقًا.");
      }
    } finally {
      setloading(false);
    }
  };

  useEffect(() => {
    // إذا لم يكن هناك أخطاء حالية، لا تفعل شيئاً
    if (!errors || Object.keys(errors).length === 0) return;

    const checkValidation = async () => {
      const schema = await getRegisterUserSchema(t_validation);
      const newErrors = { ...errors };

      // تحقق فقط من الحقول التي لديها خطأ حالي
      for (const field of Object.keys(errors)) {
        // نستخدم Zod للتحقق من صحة الحقل الحالي فقط
        // نأخذ المخطط الخاص بالحقل المحدد
        const fieldSchema = schema.shape[field];

        if (fieldSchema) {
          // ننشئ مخططاً مؤقتاً للحقل الواحد للتحقق منه
          const tempSchema = z.object({
            [field]: fieldSchema,
          });

          // قيمة الحقل الحالي
          const fieldValue = form[field];

          // نقوم بالتحقق من صحة الحقل
          const parsed = tempSchema.safeParse({ [field]: fieldValue });

          if (parsed.success) {
            // 🟢 التحقق نجح: إزالة الخطأ المرتبط بهذا الحقل
            delete newErrors[field];
          }
        }
      }

      // ⚠️ حالة خاصة لتأكيد كلمة المرور
      if (
        newErrors.password_confirmation &&
        form.password === form.password_confirmation
      ) {
        delete newErrors.password_confirmation;
      }

      // لو فيه تعديل في الأخطاء، نحدّث الـ state
      if (Object.keys(newErrors).length !== Object.keys(errors).length) {
        seterrors(newErrors);
      }
    };

    checkValidation();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form]); // يعاد التشغيل عند تغيير أي حقل في الـ form

  return (
    <>
      {step == 1 && (
        <section dir={directionMap[locale]} className="">
          <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
            <main className="flex items-center justify-center mt-8 lg:mt-4 p-2 md:p-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6">
              <motion.div
                className="w-full p-2 "
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="relative mt-16 block ">
                  <div className="flex items-center gap-3 max-lg:mt-12">
                    <h1 className="text-2xl font-bold text-gray-700  sm:text-3xl md:text-4xl">
                      {t("welcome")}
                    </h1>
                    <input
                      type="file"
                      name="image"
                      hidden
                      ref={imageref}
                      onChange={handleimagechange}
                    />
                    <motion.div
                      onClick={() => imageref.current.click()}
                      className="w-12 h-12 overflow-hidden border-2 border-indigo-400 cursor-pointer hover:bg-indigo-400 group duration-200 rounded-full flex items-center justify-center"
                      whileHover={{ scale: 1.1 }}
                    >
                      {image ? (
                        <Img
                          src={URL.createObjectURL(image)}
                          className="w-full"
                        />
                      ) : (
                        <FaCameraRetro className="size-7 text-indigo-400 group-hover:text-white duration-200" />
                      )}
                    </motion.div>
                  </div>
                  <motion.p
                    className="mt-4 leading-relaxed text-gray-500"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                  >
                    {t("welcome_subtitle")}
                  </motion.p>
                </div>

                <form
                  onSubmit={handleSubmit}
                  className="mt-8 grid grid-cols-6 gap-6"
                >
                  <FormInputs
                    form={form}
                    setForm={setForm}
                    errors={errors}
                    loading={loading}
                  />
                </form>
              </motion.div>
            </main>
            <motion.section
              className="relative flex h-32 items-end max-lg:hidden bg-gray-900 lg:col-span-5 lg:h-full xl:col-span-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            >
              <Img
                src="/register-user.png"
                className="absolute inset-0 h-full w-full object-cover opacity-80 "
              />
            </motion.section>
          </div>
        </section>
      )}

      {/* verify email message */}
      {step == 2 && <VerifyMessage email={form.email} t={t} />}
    </>
  );
}
