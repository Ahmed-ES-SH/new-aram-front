// 1. Feature List Item Component
"use client";
import { LocaleType } from "@/app/types/_dashboard/GlobalTypes";
import { motion } from "framer-motion";
import { useLocale } from "next-intl";
import { FeatureData } from "./types";

interface FeatureItemProps {
  item: FeatureData;
  isActive: boolean;
  onClick: () => void;
}

export default function ServiceFeatureItem({
  item,
  isActive,
  onClick,
}: FeatureItemProps) {
  const locale = useLocale() as LocaleType;

  return (
    <motion.div
      layout
      onClick={onClick}
      className={`
        cursor-pointer group relative p-6 rounded-2xl transition-all duration-300 ease-out
        border overflow-hidden
        ${
          isActive
            ? "bg-primary/10 border-primary shadow-md"
            : "bg-white border-transparent hover:bg-slate-50 hover:border-slate-100"
        }
      `}
    >
      {/* Active Indicator Strip */}
      {isActive && (
        <motion.div
          layoutId="activeStrip"
          className={`absolute top-0 bottom-0 w-1.5 bg-primary ${
            locale === "ar" ? "right-0" : "left-0"
          }`}
        />
      )}

      <div className="flex items-start gap-4">
        {/* Icon Container */}
        <div
          className={`
          shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-white shadow-sm
          ${item.color}
          ${locale === "ar" ? "order-2" : "order-1"}
        `}
        >
          <item.icon className="text-xl" />
        </div>

        {/* Text Content */}
        <div
          className={`flex-1 ${
            locale === "ar" ? "text-right order-1" : "text-left order-2"
          }`}
        >
          <h3
            className={`font-bold text-lg mb-1 ${
              isActive ? "text-primary" : "text-slate-800"
            }`}
          >
            {item.title}
          </h3>
          <p
            className={`text-sm leading-relaxed ${
              isActive ? "text-black" : "text-slate-500"
            }`}
          >
            {item.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
