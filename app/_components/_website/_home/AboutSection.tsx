"use client";

import type React from "react";
import { motion } from "framer-motion";
import { FiCheck, FiShield, FiHeadphones } from "react-icons/fi";
import Img from "../_global/Img";
import { directionMap } from "@/app/constants/_website/global";

interface AboutSectionProps {
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  image?: string;
  locale?: string;
}

const AboutSection: React.FC<AboutSectionProps> = ({
  title,
  subtitle,
  description,
  features,
  image = "/about-img.png",
  locale = "en",
}) => {
  const featureIcons = [FiCheck, FiShield, FiHeadphones];

  return (
    <section
      dir={directionMap[locale]}
      className="py-16 px-4 mt-10 bg-gray-50 c-container"
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
              {title}
            </h2>
            <p className="text-xl text-gray-600 mb-6 text-pretty">{subtitle}</p>
            <p className="text-gray-700 mb-8 leading-relaxed text-pretty">
              {description}
            </p>

            <div className="space-y-4">
              {features.map((feature, index) => {
                const Icon = featureIcons[index] || FiCheck;
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
                    <span className="text-gray-700 font-medium">{feature}</span>
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
                src={image || "/placeholder.png"}
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
};

export default AboutSection;
