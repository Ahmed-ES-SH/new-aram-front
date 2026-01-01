/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FaBullseye,
  FaInfoCircle,
  FaLightbulb,
  FaRocket,
} from "react-icons/fa";
import { MdOutlineChecklist } from "react-icons/md";
import { AiOutlineFundView } from "react-icons/ai";
import { useLocale } from "next-intl";
import { directionMap } from "@/app/constants/_website/global";
import Img from "../_global/Img";

interface Props {
  data: any;
}

const icons = [FaInfoCircle, FaBullseye, FaLightbulb, FaRocket];

export default function AboutMainSections({ data }: Props) {
  const locale = useLocale();
  const isRTL = locale === "ar";

  const initialSections: any = [
    {
      id: "first_section",
      title: "القسم الأول",
      imageKey: "first_section_image",
    },
    {
      id: "second_section",
      title: "القسم الثانى",
      imageKey: "second_section_image",
    },
    {
      id: "thired_section",
      title: "القسم الثالث",
      imageKey: "thired_section_image",
    },
    {
      id: "fourth_section",
      title: "القسم الرابع",
      imageKey: "fourth_section_image",
    },
  ];

  const [sections, setSections] = useState(initialSections);

  useEffect(() => {
    if (data) {
      const updatedSections = initialSections.map((section: any) => ({
        ...section,
        titleEn: data[`${section.id}_title_en`] || "",
        titleAr: data[`${section.id}_title_ar`] || "",
        contentEn: data[`${section.id}_content_en`] || "",
        contentAr: data[`${section.id}_content_ar`] || "",
        image: data[section.imageKey] || "/about/about.webp",
      }));
      setSections(updatedSections);
    }
  }, [data]);

  return (
    <div
      dir={directionMap[locale]}
      className="w-full bg-gray-50 py-20 overflow-hidden"
    >
      <div className="container mx-auto px-4">
        {sections.map((section: any, index: number) => {
          const Icon = icons[index] || FaInfoCircle;
          const isEven = index % 2 === 0;

          return (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className={`flex flex-col lg:flex-row items-center gap-12 lg:gap-20 mb-32 last:mb-0 ${
                isEven ? "" : "lg:flex-row-reverse"
              }`}
            >
              {/* Image Side */}
              <div className="w-full lg:w-1/2 relative group">
                <div className="relative h-full md:h-[400px] xl:h-[500px] w-full rounded-2xl  shadow-2xl transform transition-transform duration-500 group-hover:scale-[1.02]">
                  <Img
                    src={section.image}
                    alt={isRTL ? section.titleAr : section.titleEn}
                    className="w-full h-full rounded-2xl object-cover z-20 relative"
                  />
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/50 rounded-2xl to-transparent opacity-60" />
                  <div className="w-full h-full rounded-2xl bg-primary/70 absolute lg:-top-12 lg:-left-12 -top-4 -left-2 z-10"></div>
                </div>

                {/* Decorative Elements */}
                <div
                  className={`absolute -bottom-6 -right-6 w-24 h-24 bg-primary/10 rounded-full blur-2xl -z-10 ${
                    isRTL ? "right-auto -left-6" : ""
                  }`}
                />
                <div
                  className={`absolute -top-6 -left-6 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -z-10 ${
                    isRTL ? "left-auto -right-6" : ""
                  }`}
                />
              </div>

              {/* Content Side */}
              <div className="w-full lg:w-1/2 space-y-6">
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <Icon className="text-2xl" />
                  </div>
                  <span className="text-sm font-bold text-primary tracking-wider uppercase">
                    0{index + 1}
                  </span>
                </div>

                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                  {isRTL ? section.titleAr : section.titleEn}
                </h2>

                <div className="h-1 w-20 bg-linear-to-r from-primary to-transparent rounded-full" />

                <p className="text-lg text-gray-600 leading-relaxed">
                  {isRTL ? section.contentAr : section.contentEn}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
