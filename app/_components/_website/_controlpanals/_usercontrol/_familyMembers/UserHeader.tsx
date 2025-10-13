"use client";
import { motion } from "framer-motion";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import { useLocale, useTranslations } from "next-intl";
import Img from "../../../_global/Img";
import { BsSend } from "react-icons/bs";
import { useAppDispatch } from "@/app/Store/hooks";
import { setShowSendPopup } from "@/app/Store/variablesSlice";

export default function UserHeader({ user }) {
  const t = useTranslations("header");
  const locale = useLocale();

  const dispatch = useAppDispatch();

  // حساب العمر من تاريخ الميلاد
  const calculateAge = (birthDate: string): number => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }

    return age;
  };

  const age = calculateAge(user.birth_date);
  const isMale = user.gender === "male";
  const defaultImage = isMale
    ? "/defaults/male-noimage.jpg"
    : "/defaults/female-noimage.jpg";

  // تصنيف الألوان حسب الجنس
  const headerColors = isMale
    ? {
        gradient: "from-blue-600 to-blue-800",
        accent: "bg-blue-500",
        text: "text-blue-100",
        border: "border-blue-400",
      }
    : {
        gradient: "from-pink-600 to-pink-800",
        accent: "bg-pink-500",
        text: "text-pink-100",
        border: "border-pink-400",
      };

  return (
    <motion.header
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`bg-gradient-to-r ${headerColors.gradient} shadow-2xl rounded-2xl  mt-4 mb-8 overflow-hidden`}
    >
      <div className="container mx-auto px-6 py-8">
        {/* الصف العلوي */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          {/* معلومات المستخدم الرئيسية */}
          <div className="flex items-start max-md:flex-col gap-6 flex-1">
            {/* صورة المستخدم */}
            <motion.div whileHover={{ scale: 1.05 }} className="relative">
              <Img
                src={user.image ?? defaultImage}
                errorSrc={defaultImage}
                alt={user.name}
                className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-lg"
              />
              <div
                className={`absolute -bottom-2 -right-2 ${headerColors.accent} text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg flex items-center gap-2`}
              >
                <FaUser className="text-xs" />
                <span>
                  {age} {locale === "ar" ? "سنة" : "years"}
                </span>
              </div>
            </motion.div>

            {/* المعلومات الأساسية */}
            <div className="flex flex-col gap-3">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  {t("welcome")}, {user.name}
                </h1>
                <div className="flex flex-wrap items-center gap-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-2 ${
                      user.status === "active"
                        ? "bg-green-500 text-white"
                        : "bg-red-500 text-white"
                    }`}
                  >
                    {user.status === "active" ? (
                      <FaCheckCircle />
                    ) : (
                      <FaTimesCircle />
                    )}
                    {t("active")}
                  </span>

                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-2 ${
                      user.email_verified_at
                        ? "bg-green-500 text-white"
                        : "bg-yellow-500 text-white"
                    }`}
                  >
                    {user.email_verified_at ? (
                      <FaCheckCircle />
                    ) : (
                      <FaTimesCircle />
                    )}
                    {user.email_verified_at ? t("verified") : t("notVerified")}
                  </span>
                </div>
              </div>

              {/* المعلومات الإضافية */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-4 gap-4">
                <div className="flex items-start gap-3 text-white">
                  <FaEnvelope className={`text-lg ${headerColors.text}`} />
                  <div className="flex flex-col">
                    <span className="text-sm opacity-80">Email</span>
                    <span className="font-medium">{user.email}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-white">
                  <FaPhone className={`text-lg ${headerColors.text}`} />
                  <div className="flex flex-col">
                    <span className="text-sm opacity-80">Phone</span>
                    <span className="font-medium">{user.phone}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-white">
                  <FaMapMarkerAlt className={`text-lg ${headerColors.text}`} />
                  <div className="flex flex-col">
                    <span className="text-sm opacity-80">Country</span>
                    <span className="font-medium">{user.country}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* الإجراءات */}
          <div className="flex items-center gap-4">
            <motion.button
              onClick={() => dispatch(setShowSendPopup(true))}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`p-3 rounded-xl ${headerColors.accent} text-white shadow-lg hover:shadow-xl transition-shadow flex items-center gap-2`}
            >
              <BsSend />
              <span className="hidden sm:inline">{t("sendinvitation")}</span>
            </motion.button>
          </div>
        </div>

        {/* الصف السفلي - معلومات إضافية */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 pt-6 border-t border-white border-opacity-20 hidden xl:block"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-3 text-white">
              <FaCalendarAlt className={`text-lg ${headerColors.text}`} />
              <div className="flex flex-col">
                <span className="text-sm opacity-80">{t("memberSince")}</span>
                <span className="font-medium">
                  {new Date(user.created_at).toLocaleDateString(locale)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 text-white">
              <FaUser className={`text-lg ${headerColors.text}`} />
              <div className="flex flex-col">
                <span className="text-sm opacity-80">ID Number</span>
                <span className="font-medium">{user.id_number}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 text-white">
              <FaMapMarkerAlt className={`text-lg ${headerColors.text}`} />
              <div className="flex flex-col">
                <span className="text-sm opacity-80">Address</span>
                <span className="font-medium truncate max-w-xs">
                  {user?.location?.address ?? "غير موجود"}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.header>
  );
}
