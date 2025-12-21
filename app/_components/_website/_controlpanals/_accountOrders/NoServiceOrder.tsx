"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  FiSearch,
  FiArrowRight,
  FiRefreshCw,
  FiFileText,
  FiMessageSquare,
} from "react-icons/fi";
import { HiOutlineExclamation } from "react-icons/hi";
import LocaleLink from "../../_global/LocaleLink";
import { useAppSelector } from "@/app/Store/hooks";

interface NoServiceOrderProps {
  onBackToOrders?: () => void;
}

export default function NoServiceOrder({
  onBackToOrders,
}: NoServiceOrderProps) {
  const t = useTranslations("NoServiceOrder");
  const { user } = useAppSelector((state) => state.user);

  const handleBackClick = () => {
    if (onBackToOrders) {
      onBackToOrders();
    } else {
      // السلوك الافتراضي - العودة للصفحة السابقة
      window.history.back();
    }
  };

  const suggestions = [
    { icon: FiFileText, text: t("suggestions.checkNumber") },
    { icon: FiMessageSquare, text: t("suggestions.contactSupport") },
    { icon: FiRefreshCw, text: t("suggestions.refreshPage") },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center w-full p-4">
      <div className="w-full">
        {/* البطاقة الرئيسية */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl p-8 md:p-10"
        >
          {/* الأيقونة الرئيسية */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="flex justify-center mb-8"
          >
            <div className="relative">
              <div className="w-32 h-32 bg-linear-to-br from-red-50 to-red-100 rounded-full flex items-center justify-center">
                <div className="w-24 h-24 bg-linear-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center">
                  <HiOutlineExclamation className="w-16 h-16 text-red-500" />
                </div>
              </div>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                className="absolute -top-2 -right-2 w-12 h-12 bg-linear-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center"
              >
                <FiSearch className="w-6 h-6 text-blue-600" />
              </motion.div>
            </div>
          </motion.div>

          {/* العنوان والوصف */}
          <div className="text-center mb-10">
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
            >
              {t("title")}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-lg text-gray-600 mb-6 max-w-md mx-auto leading-relaxed"
            >
              {t("description")}
            </motion.p>

            {/* رمز الخطأ */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="inline-block px-4 py-2 bg-gray-100 rounded-full"
            >
              <span className="text-sm font-mono text-gray-700">
                {t("errorCode")}
              </span>
            </motion.div>
          </div>

          {/* قسم الاقتراحات */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mb-10"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
              {t("suggestions.title")}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {suggestions.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="bg-primary/20 rounded-xl p-5 text-center border border-gray-200"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-sm mb-4">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <p className="text-gray-700 font-medium">{item.text}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* زر العودة */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="flex justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleBackClick}
              className="group relative px-8 py-4 bg-primary text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              {/* تأثير الخلفية المتحركة */}
              <motion.div
                className="absolute inset-0 bg-primary"
                initial={{ x: "-100%" }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />

              {/* المحتوى */}
              <LocaleLink
                href={`/${
                  user?.account_type == "user"
                    ? "usercontrolpanel"
                    : "centercontrolpanel"
                }/myorders?userId=${user?.id}&account_type=${
                  user?.account_type
                }`}
                className="relative flex items-center justify-center gap-3"
              >
                <span className="text-lg">{t("backButton")}</span>
                <motion.div
                  initial={{ x: -5 }}
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <FiArrowRight className="w-5 h-5" />
                </motion.div>
              </LocaleLink>

              {/* تأثير اللمعان */}
              <motion.div
                className="absolute top-0 left-0 w-20 h-full bg-white/20 skew-x-12"
                initial={{ x: "-100%" }}
                whileHover={{ x: "300%" }}
                transition={{ duration: 0.8 }}
              />
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
