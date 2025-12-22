"use client";

import { motion } from "framer-motion";
import { FaClock, FaLayerGroup } from "react-icons/fa";
import Img from "../../_global/Img";
import { HeroSectionProps } from "./types";

export default function HeroSection({
  card,
  locale,
  CategoryIcon,
}: HeroSectionProps) {
  return (
    <div className="relative">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 h-[500px] overflow-hidden">
        <Img
          src={card.image ?? "/defaults/noImage.png"}
          errorSrc="/defaults/noImage.png"
          alt={card.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-linear-to-t from-slate-50 via-transparent to-transparent" />
      </div>

      {/* Content Container */}
      <div className="relative c-container mx-auto px-4 pt-8 pb-16">
        {/* Category Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-md bg-white/20 border border-white/30 text-white text-sm font-medium"
            style={{ boxShadow: `0 0 20px ${card.category?.bg_color}40` }}
          >
            {CategoryIcon && <CategoryIcon className="text-lg" />}
            <span>
              {locale === "en"
                ? card.category?.title_en
                : card.category?.title_ar}
            </span>
          </div>
        </motion.div>

        {/* Title and Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-2xl mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
            {card.title}
          </h1>
          <p className="text-lg text-white/80 leading-relaxed">
            {card.description}
          </p>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap gap-4 mb-12"
        >
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl backdrop-blur-md bg-white/10 border border-white/20 text-white">
            <FaClock className="text-amber-400" />
            <span className="text-sm">{card.duration}</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl backdrop-blur-md bg-white/10 border border-white/20 text-white">
            <FaLayerGroup className="text-emerald-400" />
            <span className="text-sm">
              {card.services_count} {locale === "en" ? "Services" : "خدمات"}
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
