/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaBullseye, FaInfoCircle } from "react-icons/fa";
import { MdOutlineChecklist } from "react-icons/md";
import { AiOutlineFundView } from "react-icons/ai";
import { useLocale } from "next-intl";
import { directionMap } from "@/app/constants/_website/global";
import Img from "../_global/Img";

interface Props {
  data: any;
}

const icons = [FaInfoCircle, FaBullseye, MdOutlineChecklist, AiOutlineFundView];

export default function AboutMainSections({ data }: Props) {
  const locale = useLocale();

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
      const updatedSections = initialSections.map((section) => ({
        ...section,
        titleEn: data[`${section.id}_title_en`] || "",
        titleAr: data[`${section.id}_title_ar`] || "",
        contentEn: data[`${section.id}_contnet_en`] || "",
        contentAr: data[`${section.id}_contnet_ar`] || "",
        image: data[section.imageKey] || "/about/about.webp",
      }));
      setSections(updatedSections);
    }
  }, [data]);

  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div dir={directionMap[locale]} className="c-container mx-auto px-4 py-8">
      {sections.map((section, index) => {
        const Icon = icons[index];
        const isMirrored = index % 2 !== 0; // mirror every second section

        return (
          <motion.section
            key={section.id}
            className={`w-full bg-white overflow-hidden flex flex-col md:flex-row ${
              isMirrored ? "md:flex-row-reverse" : ""
            } items-stretch mb-12`}
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Text Content */}
            <div className="flex-1 p-6 flex flex-col justify-center">
              <h2 className="text-3xl font-bold mb-4 flex items-center gap-2">
                <Icon className="text-primary" />
                {locale === "en" ? section.titleEn : section.titleAr}
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {locale === "en" ? section.contentEn : section.contentAr}
              </p>
            </div>

            {/* Image */}
            <div className="flex-1 relative h-[300px] md:h-[600px] bg-primary rounded-xl overflow-hidden">
              <Img
                src={section.image}
                alt={section.titleAr}
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
          </motion.section>
        );
      })}
    </div>
  );
}
