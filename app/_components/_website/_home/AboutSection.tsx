"use client";
import type React from "react";
import { motion } from "framer-motion";
import Img from "../_global/Img";
import { directionMap } from "@/app/constants/_website/global";
import { getIconComponent } from "@/app/_helpers/helpers";
import { useLocale } from "next-intl";

interface text {
  en: string;
  ar: string;
}

interface feature {
  en: string;
  ar: string;
  icon_name: string;
}

interface AboutSectionProps {
  data: {
    column_1: text;
    column_2: text;
    column_3: text;
    column_4: feature[];
    image: string;
  };
}

export default function AboutSection({ data }: AboutSectionProps) {
  const locale = useLocale();

  const {
    column_1: title,
    column_2: subtitle,
    column_3: description,
    column_4: features,
    image,
  } = data;

  if (!data) return null;

  return (
    <section
      dir={directionMap[locale]}
      className="py-16 px-4 mt-10 c-container overflow-hidden"
    >
      <div className="">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className={locale === "ar" ? "text-right" : "text-left"}
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 text-balance">
              {title[locale]}
            </h2>
            <p className="text-xl text-gray-600 mb-6 text-pretty">
              {subtitle[locale]}
            </p>
            <p className="text-gray-700 mb-8 leading-relaxed text-pretty">
              {description[locale]}
            </p>

            <div className="space-y-4">
              {features &&
                features.map((feature, index) => {
                  const Icon = getIconComponent(feature.icon_name);
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="flex items-center gap-3"
                    >
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Icon className="w-4 h-4 text-blue-600" />
                      </div>
                      <span className="text-gray-700 font-medium">
                        {feature[locale]}
                      </span>
                    </motion.div>
                  );
                })}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative overflow-hidden rounded-2xl shadow-2xl">
              <Img
                src={image || "/about-img.png"}
                alt="About us"
                className="w-full h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
