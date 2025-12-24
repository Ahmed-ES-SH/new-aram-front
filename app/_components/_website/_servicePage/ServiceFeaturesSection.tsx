"use client";
import React from "react";
import { easeOut, motion } from "framer-motion";
import { FiStar, FiBook, FiDollarSign } from "react-icons/fi";
import { LocaleType } from "@/app/types/_dashboard/GlobalTypes";
import { useLocale } from "next-intl";
import { getIconComponent } from "@/app/_helpers/helpers";

interface ProblemItem {
  icon: string;
  title: string;
  description: string;
}

interface ProblemSectionData {
  title: string;
  subtitle: string;
  items: ProblemItem[];
}

interface FeaturesProps {
  data?: ProblemSectionData;
}

// Default translations fallback
const defaultTranslations = {
  ar: {
    title: "هل تعاني من هذه المشاكل؟",
    subtitle: "الطرق التقليدية تكلفك الوقت والمال والفعالية",
    features: [
      {
        icon: "star",
        title: "صعوبة التقييم",
        description:
          "عميلك سيجد نفسه أمام 10 خطوات معقدة وصعوبة أنت لتغيير سمعتك الرقمية",
      },
      {
        icon: "book",
        title: "قوائم طعام قديمة",
        description:
          "تغيير الأسعار يتطلب إعادة طباعة القائمة بالكامل وكلفة مستمرة وتطوير غير احترافي",
      },
      {
        icon: "dollar",
        title: "هدر الورق والمال",
        description:
          "88% من البطاقات الورقية يتم التخلص منها خلال أسبوع واحد أنت تدفع لترمى في المهملة",
      },
    ],
  },
  en: {
    title: "Do You Suffer from These Problems?",
    subtitle: "Traditional methods cost you time, money, and effectiveness",
    features: [
      {
        icon: "star",
        title: "Rating Difficulty",
        description:
          "Your customer will find themselves facing 10 complex steps and difficulty for you to change your digital reputation",
      },
      {
        icon: "book",
        title: "Outdated Menus",
        description:
          "Changing prices requires reprinting the entire menu with continuous cost and unprofessional development",
      },
      {
        icon: "dollar",
        title: "Paper and Money Waste",
        description:
          "88% of paper cards are disposed of within one week - you pay to throw them in the trash",
      },
    ],
  },
};

const iconComponents: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  star: FiStar,
  book: FiBook,
  dollar: FiDollarSign,
};

export default function ServiceFeaturesSection({ data }: FeaturesProps) {
  const locale = useLocale() as LocaleType;
  const isRTL = locale === "ar";

  // Use backend data if available, otherwise fall back to defaults
  const content = data
    ? {
        title: data.title,
        subtitle: data.subtitle,
        features: data.items.map((item) => ({
          icon: item.icon,
          title: item.title,
          description: item.description,
        })),
      }
    : defaultTranslations[locale];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: easeOut,
      },
    },
  };

  return (
    <div
      className={`py-20 bg-linear-to-br from-gray-50 via-blue-50 to-purple-50 ${
        isRTL ? "rtl" : "ltr"
      }`}
    >
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className={`text-center mb-16 ${
            isRTL ? "text-right" : "text-left"
          } lg:text-center`}
        >
          <h2 className="text-2xl lg:text-4xl xl:text-5xl font-bold text-gray-800 mb-4">
            {content.title}
          </h2>
          <p className="lg:text-lg text-base text-gray-600 max-w-2xl mx-auto">
            {content.subtitle}
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {content.features.map((feature, index) => {
            const IconComponent = getIconComponent(feature.icon);

            return (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{
                  y: -10,
                  transition: { duration: 0.3 },
                }}
                className="group"
              >
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 h-full border border-gray-100">
                  <motion.div
                    whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                    transition={{ duration: 0.5 }}
                    className="mb-6"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-red-100 to-pink-100 flex items-center justify-center group-hover:from-red-200 group-hover:to-pink-200 transition-all duration-300">
                      <IconComponent className="text-3xl text-red-600" />
                    </div>
                  </motion.div>

                  <h3
                    className={`text-2xl font-bold text-gray-800 mb-4 ${
                      isRTL ? "text-right" : "text-left"
                    }`}
                  >
                    {feature.title}
                  </h3>

                  <p
                    className={`text-gray-600 leading-relaxed ${
                      isRTL ? "text-right" : "text-left"
                    }`}
                  >
                    {feature.description}
                  </p>

                  <motion.div
                    className="mt-6 h-1 bg-linear-to-r from-red-500 to-pink-500 rounded-full"
                    initial={{ width: 0 }}
                    whileInView={{ width: "100%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.3 + index * 0.2 }}
                  />
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
