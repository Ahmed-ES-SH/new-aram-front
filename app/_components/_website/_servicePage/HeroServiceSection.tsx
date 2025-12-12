"use client";
import React from "react";
import { motion } from "framer-motion";
import { FiPlayCircle, FiGrid } from "react-icons/fi";
import { useLocale } from "next-intl";
import { LocaleType } from "@/app/types/_dashboard/GlobalTypes";
import Img from "../_global/Img";

interface HeroProps {
  language?: "ar" | "en";
}

const translations = {
  ar: {
    badge: "الحل الجديد من التسويق الذكي",
    title: "لمسة واحدة..",
    subtitle: "عالم من الفرص",
    description:
      "استبدل البطاقات الورقية القديمة ببطاقات NFC الذكية من ترانم الخليج. شارك بياناتك، اعرض قائمة طعامك، وضاعف تقييماتك على جوجل بمجرد لمسة هاتف.",
    watchBtn: "شاهد كيف تعمل",
    exploreBtn: "اكتشف المنتجات",
  },
  en: {
    badge: "The New Smart Marketing Solution",
    title: "One Touch..",
    subtitle: "World of Opportunities",
    description:
      "Replace old paper cards with smart NFC cards from Tarannum Al Khaleej. Share your data, display your menu, and multiply your Google reviews with just a phone touch.",
    watchBtn: "Watch How It Works",
    exploreBtn: "Explore Products",
  },
};

export default function HeroServiceSection() {
  const locale = useLocale() as LocaleType;

  const t = translations[locale];
  const isRTL = locale === "ar";

  return (
    <div className={`min-h-screen relative overflow-hidden`}>
      {/* الخلفية */}
      <Img
        src="/service-wave.svg"
        className="w-full h-[40%] lg:rotate-180 absolute lg:top-0 bottom-0  left-0 z-10 object-cover"
        alt="wave background"
      />
      <div className="w-full min-h-screen absolute inset-0 z-10 bg-black opacity-5"></div>

      {/* المحتوى الرئيسي */}
      <div className="c-container relative z-20 pt-12 md:pt-20 lg:pt-24">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12 xl:gap-16 w-full min-h-[calc(100vh-5rem)] md:min-h-[calc(100vh-6rem)]">
          {/* المحتوى النصي */}
          <motion.div
            initial={{ opacity: 0, x: isRTL ? -50 : 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className={`w-full lg:w-1/2 ${isRTL ? "lg:order-2" : "lg:order-1"}`}
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className={`inline-flex items-center gap-2 px-4 py-2 bg-linear-to-r from-blue-50 to-purple-50 rounded-full mb-4 md:mb-6 border border-blue-100`}
            >
              <span className="text-xs md:text-sm font-medium text-blue-700">
                ✨ {t.badge}
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-gray-800 leading-tight"
            >
              {t.title}
            </motion.h1>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6 md:mb-8 gradient-text"
            >
              {t.subtitle}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="text-base md:text-lg text-gray-600 mb-6 md:mb-8 leading-relaxed max-w-full lg:max-w-[90%]"
            >
              {t.description}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className={`flex flex-col sm:flex-row gap-3 sm:gap-4 ${
                isRTL ? "sm:justify-end" : "sm:justify-start"
              }`}
            >
              <motion.button
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 10px 30px rgba(59, 130, 246, 0.3)",
                }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center gap-2 px-5 sm:px-6 py-3 bg-linear-to-r from-primary  to-primary-red text-white rounded-full font-medium shadow-lg hover:shadow-xl transition-all w-full sm:w-auto"
              >
                <FiPlayCircle className="text-lg sm:text-xl" />
                <span className="text-sm sm:text-base">{t.watchBtn}</span>
              </motion.button>

              <motion.button
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
                }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center gap-2 px-5 sm:px-6 py-3 bg-white text-gray-800 rounded-full font-medium shadow-lg hover:shadow-xl transition-all border border-gray-200 w-full sm:w-auto"
              >
                <FiGrid className="text-lg sm:text-xl" />
                <span className="text-sm sm:text-base">{t.exploreBtn}</span>
              </motion.button>
            </motion.div>
          </motion.div>

          {/* الصورة */}
          <motion.div
            initial={{ opacity: 0, x: isRTL ? 50 : -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className={`w-full lg:w-1/2 flex justify-center ${
              isRTL ? "lg:order-1" : "lg:order-2"
            }`}
          >
            <Img
              src={"/services/service-man.png"}
              className="w-full max-w-[350px] sm:max-w-[450px] md:max-w-[500px] lg:max-w-full lg:w-[550px] xl:w-[600px]"
              alt={"hero image"}
              priority
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
