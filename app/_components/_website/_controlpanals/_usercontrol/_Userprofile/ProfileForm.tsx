"use client";

import type React from "react";
import { motion } from "framer-motion";
import { FiCamera, FiSave } from "react-icons/fi";
import { useLocale, useTranslations } from "next-intl";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { setUser, UserType } from "@/app/Store/userSlice";
import { toast } from "sonner";
import { instance } from "@/app/_helpers/axios";
import Img from "../../../_global/Img";
import dynamic from "next/dynamic";
import UserProfileForm from "./UserProfileForm";
import { useAppDispatch } from "@/app/Store/hooks";

const MapSelector = dynamic(
  () => import(`@/app/_components/_maps/MapSelector`),
  { ssr: false }
);

interface ProfileFormProps {
  user: UserType;
}

export function ProfileForm({ user }: ProfileFormProps) {
  const t = useTranslations("userProfile");
  const locale = useLocale() as "en" | "ar";

  const dispatch = useAppDispatch();

  const imageRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<UserType>(user);
  const [originalFormData, setOriginalFormData] = useState<UserType>(user);
  const [avatar, setAvatar] = useState({
    name: user?.name,
    email: user?.email,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [openMap, setOpenMap] = useState(false);
  const [location, setLocation] = useState(user?.location ?? null);
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrors({});

    try {
      const updatedData = new FormData();
      let hasAnyChange = false;

      // ✅ أولاً: فحص حقول formData
      Object.entries(formData).forEach(([key, value]) => {
        const originalValue =
          originalFormData[key as keyof typeof originalFormData];

        // ⛔️ لا ترسل كلمة المرور الفارغة إطلاقًا
        if (key === "password" && (!value || value === "")) {
          return;
        }

        // 🔍 تحقق من التغييرات
        const hasChanged =
          value instanceof File ||
          JSON.stringify(value) !== JSON.stringify(originalValue);

        if (hasChanged) {
          hasAnyChange = true;

          if (Array.isArray(value)) {
            value.forEach((item, index) =>
              updatedData.append(`${key}[${index}]`, item)
            );
          } else if (value instanceof File) {
            updatedData.append(key, value);
          } else if (value !== null && value !== undefined) {
            updatedData.append(key, String(value));
          }
        }
      });

      // ✅ ثانياً: فحص الموقع (location) بشكل منفصل
      const originalLocation = user?.location ?? null;
      const locationChanged =
        JSON.stringify(location) !== JSON.stringify(originalLocation);

      if (locationChanged) {
        hasAnyChange = true;
        updatedData.append("location", JSON.stringify(location)); // يرسل كـ JSON
      }

      // 🚫 لا ترسل الطلب إذا لم يتغير شيء
      if (!hasAnyChange) {
        toast.info("لم يتم تعديل أي بيانات!");
        setIsSaving(false);
        return;
      }

      // ✅ إرسال الطلب
      const response = await instance.post(
        `/update-user/${user?.id}`,
        updatedData
      );

      if (response.status === 200) {
        const data = response.data.data;
        setIsSaved(true);
        toast.success("تم تحديث بيانات الحساب بنجاح 🎉");
        setAvatar({ name: data.name, email: data.email });
        dispatch(setUser(data));

        // تحديث البيانات الأصلية بعد الحفظ
        setOriginalFormData(formData);
      }
    } catch (error: any) {
      console.log(error);
      const message =
        error?.response?.data?.message ||
        "حدث خطأ غير متوقع أثناء محاولة تحديث بيانات الحساب. حاول لاحقًا!";
      toast.error(message);

      if (error?.response?.data.errors) {
        setErrors(error?.response?.data.errors);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setFormData({ ...formData, image: files[0] });
    }
  };

  const handleImageUpload = () => {
    imageRef.current?.click();
  };

  useEffect(() => {
    if (isSaved) {
      const timer = setTimeout(() => {
        setIsSaved(false);
      }, 1500);

      // Cleanup when component unmounts or isSaved changes
      return () => clearTimeout(timer);
    }
  }, [isSaved]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="bg-card rounded-xl shadow-sm border border-border"
    >
      {/* Profile Image Section */}
      <div className="p-8 border-b border-border">
        <div className="flex items-center gap-6">
          <div className="relative group">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-border">
              {formData.image instanceof File ? (
                <Img
                  src={URL.createObjectURL(formData.image)}
                  alt={formData.name}
                  className="w-24 h-24  object-cover"
                />
              ) : (
                <Img
                  src={formData.image ?? "/defaults/male-noimage.jpg"}
                  errorSrc="/defaults/male-noimage.jpg"
                  alt={formData.name}
                  className="w-24 h-24  object-cover"
                />
              )}
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleImageUpload}
              className="absolute bottom-0 right-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-lg"
            >
              <FiCamera className="w-4 h-4" />
            </motion.button>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-foreground text-balance">
              {avatar.name}
            </h2>
            <p className="text-muted-foreground mt-1">{avatar.email}</p>
            <p className="text-xs text-red-500 mt-1">{formData.id_number}</p>
            <div className="flex items-center gap-2 mt-2">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  formData.status === "active"
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {t(`status.${formData.status}`)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <form onSubmit={handleSubmit} className="p-8">
        {/* image input to get the new image file */}
        <input
          type="file"
          hidden
          name="image"
          onChange={handleImageChange}
          ref={imageRef}
        />
        {/* user profile form with all fieldes */}
        <UserProfileForm
          formData={formData}
          setFormData={setFormData}
          location={location}
          setOpenMap={setOpenMap}
          errors={errors}
        />

        {/* Save Button */}
        <div className="mt-8 flex items-center gap-4">
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isSaving || isSaved}
            className={`flex items-center justify-center w-fit rtl:mr-auto ltr:ml-auto gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
              isSaved
                ? "bg-emerald-600 text-white"
                : "bg-primary text-primary-foreground hover:bg-primary/90"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isSaving ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 1,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}
                >
                  <FiSave className="w-5 h-5" />
                </motion.div>
                {t("saving")}
              </>
            ) : isSaved ? (
              <>
                <FiSave className="w-5 h-5" />
                {t("saved")}
              </>
            ) : (
              <>
                <FiSave className="w-5 h-5" />
                {t("saveChanges")}
              </>
            )}
          </motion.button>

          {isSaved && (
            <motion.p
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="text-sm text-emerald-600 font-medium"
            >
              {t("successMessage")}
            </motion.p>
          )}
        </div>
      </form>

      {/* map selector */}
      <MapSelector
        onClose={() => setOpenMap(false)}
        locale={locale}
        showMap={openMap}
        initialLocation={formData?.location}
        setLocation={setLocation}
      />
    </motion.div>
  );
}
