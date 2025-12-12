"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  FaClock,
  FaCrown,
  FaGem,
  FaPercent,
  FaShieldAlt,
  FaStar,
} from "react-icons/fa";
import { useLocale, useTranslations } from "next-intl";
import { cardsHeaderType } from "@/app/_components/_dashboard/_statictexts/CardsHeaderSection";
import { useState } from "react";
import { getIconComponent } from "@/app/_helpers/helpers";

interface props {
  containerRef: any;
  staticData: cardsHeaderType;
}

export default function CardsHeader({ containerRef, staticData }: props) {
  const t = useTranslations("homeCards");
  const locale = useLocale();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.3]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);

  const [badge] = useState<TextType>({
    en: staticData.column_1.en,
    ar: staticData.column_1.ar,
  });
  const [title] = useState<TextType>({
    en: staticData.column_2.en,
    ar: staticData.column_2.ar,
  });
  const [subtitle] = useState<TextType>({
    en: staticData.column_3.en,
    ar: staticData.column_3.ar,
  });
  const [features] = useState<CardsFeature[]>(staticData.column_4 ?? []);

  return (
    <motion.div style={{ y, opacity, scale }} className="text-center mb-16">
      {/* Badge with animation */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200 }}
        className="inline-flex items-center gap-2 px-6 py-3 mb-8 bg-primary text-white rounded-full shadow-xl"
      >
        <FaGem className="animate-pulse" />
        <span className="font-semibold tracking-wider">{badge[locale]}</span>
        <FaStar className="text-yellow-300" />
      </motion.div>

      {/* Main Title with Gradient */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-5xl md:text-6xl font-bold mb-6 text-primary"
      >
        {title[locale]}
      </motion.h2>

      {/* Animated Subtitle */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="text-xl text-gray-600  mb-12 max-w-3xl mx-auto leading-relaxed"
      >
        {subtitle[locale]}
      </motion.p>

      {/* Feature Highlights */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-16">
        {features.map((feature, index) => {
          const Icon = getIconComponent(feature.icon_name);
          console.log(feature);
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className={`group hover:scale-105 duration-300 relative p-6 rounded-2xl bg-linear-to-br ${feature.color} backdrop-blur-sm border border-gray-200/50 /50`}
            >
              {/* Hover effect */}
              <div className="absolute inset-0 bg-linear-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />

              <div className="relative z-10">
                <div className="text-3xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                  <Icon className={` text-primary`} />
                </div>
                <p className="font-semibold text-gray-800 ">
                  {feature.text[locale]}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
