// components/centers/CenterCard.tsx
"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { FaStar, FaClock, FaUsers } from "react-icons/fa";
import CategoryBadge from "./CategoryBadge";
import KeywordTag from "./KeywordTag";
import Image from "next/image";
import { Center } from "./types";

interface CenterCardProps {
  center: Center;
  index: number;
}

const CenterCard: React.FC<CenterCardProps> = ({ center, index }) => {
  const locale = useLocale();
  const t = useTranslations("Centers");
  const [imageError, setImageError] = useState(false);
  const [logoError, setLogoError] = useState(false);

  const isOpen = () => {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    const [openHours, openMinutes] = center.open_at.split(":").map(Number);
    const [closeHours, closeMinutes] = center.close_at.split(":").map(Number);
    const openTime = openHours * 60 + openMinutes;
    const closeTime = closeHours * 60 + closeMinutes;

    return currentTime >= openTime && currentTime <= closeTime;
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.21, 0.47, 0.32, 0.98],
      },
    },
    hover: {
      y: -8,
      transition: { duration: 0.3 },
    },
  };

  return (
    <motion.div
      variants={cardVariants as any}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      whileHover="hover"
      className="group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl 
                 border border-gray-100 overflow-hidden transition-all duration-300"
    >
      {/* Image Container */}
      <div className="relative h-56 overflow-hidden">
        {!imageError ? (
          <Image
            src={center.image}
            alt={center.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            onError={() => setImageError(true)}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-linear-to-br from-blue-50 to-purple-50 flex items-center justify-center">
            <span className="text-gray-400">No Image</span>
          </div>
        )}

        {/* Logo */}
        <div className="absolute top-4 left-4 z-10">
          <div className="relative w-16 h-16 bg-white rounded-2xl shadow-xl p-1">
            {!logoError ? (
              <Image
                src={center.logo}
                alt="Logo"
                fill
                className="object-cover rounded-xl"
                onError={() => setLogoError(true)}
                sizes="64px"
              />
            ) : (
              <div className="w-full h-full bg-linear-to-br from-gray-100 to-gray-200 rounded-xl" />
            )}
          </div>
        </div>

        {/* Category Badge */}
        <div className="absolute top-4 right-4">
          <CategoryBadge category={center.category} />
        </div>

        {/* Open/Closed Badge */}
        <div
          className={`absolute bottom-4 right-4 px-4 py-2 rounded-full backdrop-blur-sm
          ${
            isOpen()
              ? "bg-green-500/20 text-green-700 border border-green-200"
              : "bg-red-500/20 text-red-700 border border-red-200"
          }`}
        >
          <span className="text-sm font-semibold flex items-center gap-1">
            <FaClock className="w-3 h-3" />
            {isOpen() ? t("open") : t("closed")}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Title and Rating */}
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-bold text-gray-900 line-clamp-1">
            {center.title}
          </h3>
          <div
            className="flex items-center gap-1 bg-linear-to-r from-amber-50 to-amber-100 
                        px-3 py-1.5 rounded-full"
          >
            <FaStar className="w-4 h-4 text-amber-500" />
            <span className="font-bold text-gray-900">{center.rating}</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 mb-4 line-clamp-2 min-h-12">
          {center.description}
        </p>

        {/* Stats */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-2 text-gray-700">
            <FaUsers className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium">
              {center.number_of_reservations} {t("reservations")}
            </span>
          </div>

          <div className="text-sm text-gray-500">
            {t("from")} {center.open_at.split(":").slice(0, 2).join(":")}{" "}
            {t("to")} {center.close_at.split(":").slice(0, 2).join(":")}
          </div>
        </div>

        {/* Keywords */}
        <div className="flex flex-wrap gap-2 mt-4">
          {center.keywords.slice(0, 3).map((keyword, idx) => (
            <KeywordTag key={keyword.id} keyword={keyword.title} index={idx} />
          ))}
          {center.keywords.length > 3 && (
            <span className="text-sm text-gray-400 font-medium px-2">
              +{center.keywords.length - 3} {t("more")}
            </span>
          )}
        </div>
      </div>

      {/* Gradient Overlay on Hover */}
      <div
        className="absolute inset-0 bg-linear-to-t from-white/50 to-transparent 
                    opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
      />
    </motion.div>
  );
};

export default CenterCard;
