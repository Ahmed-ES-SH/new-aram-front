/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaBullseye, FaInfoCircle } from "react-icons/fa";
import { useLocale } from "next-intl";
import { directionMap } from "@/app/constants/_website/global";
import Img from "../_global/Img";
import { MdOutlineChecklist } from "react-icons/md";
import { AiOutlineFundView } from "react-icons/ai";

interface props {
  data: any;
}

export default function AboutMainSections({ data }: props) {
  const locale = useLocale();

  const initialSections: any = [
    {
      id: "first_section",
      title: "القسم الأول",
      placeholder: "القسم الأول",
      titleEn: "",
      titleAr: "",
      contentEn: "",
      contentAr: "",
    },
    {
      id: "second_section",
      title: "القسم الثانى",
      placeholder: "القسم الثانى",
      titleEn: "",
      titleAr: "",
      contentEn: "",
      contentAr: "",
    },
    {
      id: "thired_section",
      title: "القسم الثالث",
      placeholder: "القسم الثالث",
      titleEn: "",
      titleAr: "",
      contentEn: "",
      contentAr: "",
    },
    {
      id: "fourth_section",
      title: "القسم الرابع",
      placeholder: "القسم الرابع",
      titleEn: "",
      titleAr: "",
      contentEn: "",
      contentAr: "",
    },
  ];
  const [sections, setSections] = useState(initialSections);
  const [FirstSectionimage, setFirstSectionimage] = useState(null);
  const [SecondSectionimage, setSecondSectionimage] = useState(null);
  const [ThiredSectionimage, setThiredSectionimage] = useState(null);
  const [FourthSectionimage, setFourthSectionimage] = useState(null);

  useEffect(() => {
    if (data) {
      const updatedSections = sections.map((section: any) => ({
        ...section,
        contentEn: data[`${section.id}_contnet_en`] || "",
        contentAr: data[`${section.id}_contnet_ar`] || "",
        titleAr: data[`${section.id}_title_ar`] || "",
        titleEn: data[`${section.id}_title_en`] || "",
      }));
      setSections(updatedSections);
      setFirstSectionimage(data.first_section_image || null);
      setSecondSectionimage(data.second_section_image || null);
      setThiredSectionimage(data.thired_section_image || null);
      setFourthSectionimage(data.fourth_section_image || null);
    }
  }, [data]);

  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div dir={directionMap[locale]} className="c-container mx-auto px-4 py-8">
      {/* About Us Section */}
      <motion.section
        className="w-full bg-white overflow-hidden flex flex-col md:flex-row items-stretch mb-12"
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Text content */}
        <div className="flex-1 p-6 flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-4 flex items-center gap-2">
            <FaInfoCircle className="text-primary" />
            {locale === "en" ? sections[0].titleEn : sections[0].titleAr}
          </h2>
          <p className="text-gray-700 leading-relaxed">
            {locale === "en" ? sections[0].contentEn : sections[0].contentAr}
          </p>
        </div>

        {/* Image */}
        <div className="flex-1 relative h-[300px] md:h-[600px]">
          <Img
            src={FirstSectionimage ? FirstSectionimage : "/about/about.webp"}
            alt="about image"
            className="w-full h-full object-cover rounded-xl"
          />
        </div>
      </motion.section>

      {/* Our Goals Section (mirrored) */}
      <motion.section
        className="w-full bg-white overflow-hidden flex flex-col md:flex-row-reverse items-stretch mb-12"
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Text */}
        <div className="flex-1 p-6 flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-4 flex items-center gap-2">
            <FaBullseye className="text-primary" />
            {locale === "en" ? sections[1].titleEn : sections[1].titleAr}
          </h2>
          <p className="text-gray-700 leading-relaxed">
            {locale === "en" ? sections[1].contentEn : sections[1].contentAr}
          </p>
        </div>

        {/* Image */}
        <div className="flex-1 relative h-[300px] md:h-[600px]">
          <Img
            src={SecondSectionimage ? SecondSectionimage : "/about/about.webp"}
            alt="goals image"
            className="w-full h-full object-cover rounded-xl"
          />
        </div>
      </motion.section>

      {/* Our Values Section */}
      <motion.section
        className="w-full bg-white overflow-hidden flex flex-col md:flex-row items-stretch mb-12"
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Text */}
        <div className="flex-1 p-6 flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-4 flex items-center gap-2">
            <MdOutlineChecklist className="text-primary" />
            {locale === "en" ? sections[2].titleEn : sections[2].titleAr}
          </h2>
          <p className="text-gray-700 leading-relaxed">
            {locale === "en" ? sections[2].contentEn : sections[2].contentAr}
          </p>
        </div>

        {/* Image */}
        <div className="flex-1 relative h-[300px] md:h-[600px]">
          <Img
            src={ThiredSectionimage ? ThiredSectionimage : "/about/about.webp"}
            alt="values image"
            className="w-full h-full object-cover rounded-xl"
          />
        </div>
      </motion.section>

      {/* Our Vision Section (mirrored) */}
      <motion.section
        className="w-full bg-white overflow-hidden flex flex-col md:flex-row-reverse items-stretch mb-12"
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Text */}
        <div className="flex-1 p-6 flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-4 flex items-center gap-2">
            <AiOutlineFundView className="text-primary" />
            {locale === "en" ? sections[3].titleEn : sections[3].titleAr}
          </h2>
          <p className="text-gray-700 leading-relaxed">
            {locale === "en" ? sections[3].contentEn : sections[3].contentAr}
          </p>
        </div>

        {/* Image */}
        <div className="flex-1 relative h-[300px] md:h-[600px]">
          <Img
            src={FourthSectionimage ? FourthSectionimage : "/about/about.webp"}
            alt="vision image"
            className="w-full h-full object-cover rounded-xl"
          />
        </div>
      </motion.section>
    </div>
  );
}
