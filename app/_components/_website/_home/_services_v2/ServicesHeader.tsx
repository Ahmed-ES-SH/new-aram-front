"use client";

import { servicesHeaderType } from "@/app/_components/_dashboard/_statictexts/ServicesEditSection";
import { getIconComponent } from "@/app/_helpers/helpers";
import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { FaRocket } from "react-icons/fa";

interface props {
  data: servicesHeaderType;
}

export function ServicesHeader({ data }: props) {
  const locale = useLocale();
  const isRTL = locale === "ar";

  const [badge] = useState<TextType>({
    en: data.column_1.en,
    ar: data.column_1.ar,
  });
  const [title] = useState<TextType>({
    en: data.column_2.en,
    ar: data.column_2.ar,
  });
  const [titleHighlight] = useState<TextType>({
    en: data.column_3.en,
    ar: data.column_3.ar,
  });
  const [subtitle] = useState<TextType>({
    en: data.column_4.en,
    ar: data.column_4.ar,
  });

  const [stats] = useState<ServicesStat[]>(data.column_5 ?? []);

  const statsColors = {
    0: "from-indigo-500 to-indigo-600",
    1: "from-emerald-500 to-teal-500",
    2: "from-amber-500 to-orange-500",
  };

  return (
    <div className="relative overflow-hidden" dir={isRTL ? "rtl" : "ltr"}>
      {/* Background Decorations */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-indigo-100 rounded-full blur-3xl opacity-60" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-100 rounded-full blur-3xl opacity-40" />
      </div>

      <div className="w-full py-16">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10">
          {/* Left Content */}
          <div className="max-w-3xl">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary rounded-full mb-6"
            >
              <FaRocket className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-primary">
                {badge[locale]}
              </span>
            </motion.div>

            {/* Title */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-2xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6"
            >
              {title[locale]}
              <span className="relative">
                <span className="relative z-10 bg-linear-to-r from-primary via-orange-400 to-primary bg-clip-text text-transparent">
                  {titleHighlight[locale]}
                </span>
                <motion.span
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className="absolute -bottom-2 left-0 right-0 h-3 bg-primary/50 z-0 origin-left rounded-full"
                />
              </span>
            </motion.h2>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg text-gray-600 leading-relaxed mb-8 text-pretty"
            >
              {subtitle[locale]}
            </motion.p>

            {/* Stats Row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap gap-6"
            >
              {stats.map((stat, index) => {
                const Icon = getIconComponent(stat.icon_name);
                return (
                  <motion.div
                    key={stat.icon_name}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl shadow-md border border-gray-100"
                  >
                    <div
                      className={`w-10 h-10 rounded-xl bg-linear-to-br ${statsColors[index]} flex items-center justify-center shadow-lg`}
                    >
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-xl font-bold text-gray-900">
                        {stat.value}
                      </div>
                      <div className="text-xs text-gray-500 font-medium">
                        {stat.label[locale]}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
