"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { Card } from "../../_dashboard/_cards/types";
import { directionMap } from "@/app/constants/_website/global";
import { useLocale, useTranslations } from "next-intl";
import {
  FaCrown,
  FaGem,
  FaStar,
  FaShieldAlt,
  FaPercent,
  FaClock,
} from "react-icons/fa";
import { useRef } from "react";
import { MembershipCard } from "../_global/_memberShipCard-v2";

interface CardsSectionProps {
  cards: Card[];
}

export default function CardsSection({ cards }: CardsSectionProps) {
  const locale = useLocale();
  const t = useTranslations("homeCards");
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.3]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);

  if (!cards) return null;

  // Feature highlights for the header
  const features = [
    {
      icon: <FaCrown className="text-amber-400" />,
      text: t("features.premium"),
      color: "from-amber-500/20 to-amber-600/10",
    },
    {
      icon: <FaShieldAlt className="text-emerald-400" />,
      text: t("features.secure"),
      color: "from-emerald-500/20 to-emerald-600/10",
    },
    {
      icon: <FaPercent className="text-purple-400" />,
      text: t("features.exclusive"),
      color: "from-purple-500/20 to-purple-600/10",
    },
    {
      icon: <FaClock className="text-blue-400" />,
      text: t("features.lifetime"),
      color: "from-blue-500/20 to-blue-600/10",
    },
  ];

  return (
    <section
      dir={directionMap[locale]}
      ref={containerRef}
      className="relative py-24 px-4  overflow-hidden"
    >
      {/* Decorative corner accents */}
      <div className="absolute top-0 right-0 w-32 h-32 border-t-2 border-r-2 border-purple-400/20 rounded-tr-lg" />

      <div className="relative z-10 c-container mx-auto">
        {/* Premium Header */}
        <motion.div style={{ y, opacity, scale }} className="text-center mb-16">
          {/* Badge with animation */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="inline-flex items-center gap-2 px-6 py-3 mb-8 bg-primary text-white rounded-full shadow-xl"
          >
            <FaGem className="animate-pulse" />
            <span className="font-semibold tracking-wider">
              {t("badge.premium")}
            </span>
            <FaStar className="text-yellow-300" />
          </motion.div>

          {/* Main Title with Gradient */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-6xl font-bold mb-6 text-primary"
          >
            {t("title")}
          </motion.h2>

          {/* Animated Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-xl text-gray-600  mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            {t("subtitle")}
          </motion.p>

          {/* Feature Highlights */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-16">
            {features.map((feature, index) => (
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
                    {feature.icon}
                  </div>
                  <p className="font-semibold text-gray-800 ">{feature.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Cards Grid */}
        <div className="relative">
          {/* Decorative line */}
          <div className="absolute top-1/2 left-0 right-0 h-px bg-linear-to-r from-transparent via-gray-300/50 to-transparent /50 -translate-y-1/2" />

          {/* Animated cards container */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8 relative z-10"
          >
            {cards.map((card, index) => (
              <motion.div
                key={`${card.id}-${index}-card.id`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, type: "spring" }}
                whileHover={{
                  y: -10,
                  transition: { type: "spring", stiffness: 300 },
                }}
                className="group relative"
              >
                {/* Card glow effect on hover */}
                <div className="absolute inset-0 bg-linear-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Card content */}
                <div className="relative transform transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-blue-500/10">
                  <MembershipCard data={card} />
                </div>

                {/* Hover indicator */}
                <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-8 h-1 bg-primary rounded-full" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
