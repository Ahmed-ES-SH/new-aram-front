"use client";
import React, { useEffect, useRef, useState } from "react";
import { easeOut, motion, useInView } from "framer-motion";
import {
  FaUsers,
  FaPercent,
  FaGift,
  FaAward,
  FaSmile,
  FaChartLine,
  FaRocket,
  FaChartBar,
} from "react-icons/fa";
import { useLocale } from "next-intl";
import { BiBuilding } from "react-icons/bi";
import { useTranslations } from "use-intl";

interface StatItem {
  id: number;
  icon: React.ComponentType<{ className?: string }>;
  value: string;
  label: { en: string; ar: string };
  color: string;
  // For number animation
  numericValue?: number;
  isPercentage?: boolean;
  isMultiplier?: boolean;
}

interface StatsSectionProps {
  stats?: StatItem[];
  title?: string;
  subtitle?: string;
}

// Default stats data
const defaultStats: StatItem[] = [
  {
    id: 1,
    icon: FaUsers,
    value: "1200+",
    label: { en: "Happy Customers", ar: "عملاء سعداء" },
    color: "text-blue-500",
    numericValue: 1200,
  },
  {
    id: 2,
    icon: BiBuilding,
    value: "350+",
    label: { en: "Partner Centers", ar: "مراكز شريكة" },
    color: "text-green-500",
    numericValue: 350,
  },
  {
    id: 3,
    icon: FaPercent,
    value: "20%",
    label: { en: "Average Discount", ar: "متوسط الخصم" },
    color: "text-purple-500",
    numericValue: 20,
    isPercentage: true,
  },
  {
    id: 4,
    icon: FaGift,
    value: "500+",
    label: { en: "Offers Used", ar: "العروض المستخدمة" },
    color: "text-pink-500",
    numericValue: 500,
  },
  {
    id: 5,
    icon: FaAward,
    value: "98%",
    label: { en: "Satisfaction Rate", ar: "معدل الرضا" },
    color: "text-yellow-500",
    numericValue: 98,
    isPercentage: true,
  },
  {
    id: 6,
    icon: FaSmile,
    value: "24/7",
    label: { en: "Customer Support", ar: "دعم العملاء" },
    color: "text-indigo-500",
  },
  {
    id: 7,
    icon: FaChartLine,
    value: "75%",
    label: { en: "Return Customers", ar: "العملاء العائدون" },
    color: "text-teal-500",
    numericValue: 75,
    isPercentage: true,
  },
  {
    id: 8,
    icon: FaRocket,
    value: "2x",
    label: { en: "Growth Rate", ar: "معدل النمو" },
    color: "text-red-500",
    numericValue: 2,
    isMultiplier: true,
  },
];

// Component for animated numbers
const AnimatedNumber: React.FC<{
  value: number;
  isPercentage?: boolean;
  isMultiplier?: boolean;
  suffix?: string;
}> = ({ value, isPercentage = false, isMultiplier = false, suffix = "+" }) => {
  const [currentValue, setCurrentValue] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (inView) {
      const duration = 2000; // Animation duration in ms
      const steps = 60; // Number of steps
      const increment = value / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= value) {
          setCurrentValue(value);
          clearInterval(timer);
        } else {
          setCurrentValue(Math.floor(current));
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }
  }, [inView, value]);

  return (
    <span ref={ref}>
      {isMultiplier && "×"}
      {currentValue.toLocaleString()}
      {isPercentage && "%"}
      {!isPercentage && !isMultiplier && suffix}
    </span>
  );
};

export default function StatsSection({
  stats = defaultStats,
}: StatsSectionProps) {
  const locale = useLocale();
  const t = useTranslations("offers.statsSection");

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  // Animation variants for Framer Motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: easeOut,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: easeOut,
      },
    },
  };

  return (
    <section
      className="pb-16 pt-12 mt-10 px-4 bg-gray-50 rounded-t-lg shadow-sm"
      ref={ref}
    >
      <div className="w-full mx-auto">
        {/* Header Section */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={headerVariants}
          className="text-center mb-16"
        >
          <div className="inline-flex gap-4 items-center justify-center mb-4">
            <div className="p-3 rounded-full bg-primary/10 text-primary mr-3">
              <FaChartBar className="text-2xl" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
              {t("title")}
            </h2>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
            {t("subtitle")}
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-purple-500 mx-auto rounded-full"></div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.id}
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center"
            >
              {/* Icon with colored background */}
              <div
                className={`p-4 rounded-full mb-4 ${stat.color} bg-opacity-10`}
              >
                <stat.icon className={`text-2xl ${stat.color}`} />
              </div>

              {/* Stat value with animation for numeric values */}
              <h3 className="text-3xl font-bold text-gray-800 mb-2">
                {stat.numericValue !== undefined ? (
                  <AnimatedNumber
                    value={stat.numericValue}
                    isPercentage={stat.isPercentage}
                    isMultiplier={stat.isMultiplier}
                  />
                ) : (
                  stat.value
                )}
              </h3>

              {/* Stat label */}
              <p className="text-gray-600">{stat.label[locale]}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
