// components/centers/CentersHeader.tsx
import React from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Center } from "./types";
import IconLoader from "./IconLoader";

interface CentersHeaderProps {
  centers: Center[];
}

const CentersHeader: React.FC<CentersHeaderProps> = ({ centers }) => {
  const t = useTranslations("Centers");

  // استخراج الفئات الفريدة من المراكز
  const uniqueCategories = Array.from(
    new Map(
      centers.map((center) => [center.category.id, center.category])
    ).values()
  );

  // تأثير للعناصر في القائمة
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.5,
      },
    }),
  };

  return (
    <div className="text-center mb-12 relative overflow-hidden py-8">
      {/* خلفية متحركة */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="absolute inset-0 -z-10"
      >
        <motion.div
          animate={{
            x: [0, 30, 0],
            y: [0, -50, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="absolute -top-4 -left-4 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70"
        />
        <motion.div
          animate={{
            x: [0, -20, 0],
            y: [0, 20, 0],
            scale: [1, 0.9, 1],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 2,
          }}
          className="absolute -bottom-4 -right-4 w-72 h-72 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-70"
        />
      </motion.div>

      {/* العنوان الرئيسي */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4"
      >
        {t("title")}
      </motion.h2>

      {/* موجة */}
      <svg
        className="w-64 h-8 mx-auto mb-4"
        viewBox="0 0 200 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <motion.path
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          d="M0 10C40 10 40 0 80 0C120 0 120 10 160 10C200 10 200 0 240 0"
          stroke="#3B82F6"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>

      {/* الوصف */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-lg text-gray-600 max-w-2xl mx-auto mb-8"
      >
        {t("description")}
      </motion.p>

      {/* شبكة الفئات */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="flex flex-wrap justify-center gap-4 md:gap-6"
      >
        {uniqueCategories.slice(0, 6).map((category, index) => (
          <motion.div
            key={category.id}
            custom={index}
            variants={itemVariants}
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="flex flex-col items-center justify-center p-4 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 bg-white/50 backdrop-blur-sm border border-white/20"
            style={{
              backgroundColor: `${category.bg_color}20`, // شفافية 20
            }}
          >
            <div
              className="p-3 rounded-full mb-2"
              style={{ backgroundColor: category.bg_color }}
            >
              <IconLoader
                iconName={category.icon_name}
                className="w-6 h-6 text-white"
              />
            </div>
            <span
              className="text-sm font-semibold"
              style={{ color: category.bg_color }}
            >
              {category.title_en}
            </span>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default CentersHeader;
