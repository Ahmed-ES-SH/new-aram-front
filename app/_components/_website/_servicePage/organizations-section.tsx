"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import {
  fadeInUp,
  staggerContainer,
  scaleIn,
  hoverScale,
} from "./animation-variants";
import { Service } from "../../_dashboard/_services/types";
import { useTranslations } from "next-intl";
import { BsFillBuildingFill } from "react-icons/bs";
import Img from "../_global/Img";

interface OrganizationsSectionProps {
  organizations: Service["organizations"];
}

export function OrganizationsSection({
  organizations,
}: OrganizationsSectionProps) {
  const t = useTranslations();

  if (organizations.length === 0) return null;

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={fadeInUp}
      className="space-y-4"
    >
      {/* Section Header */}
      <div className="flex items-center gap-2">
        <BsFillBuildingFill className="w-5 h-5 text-blue-500" />
        <h2 className="text-xl font-bold text-gray-900">
          {t("service.organizations")}
        </h2>
      </div>

      {/* Organizations Grid */}
      <motion.div
        variants={staggerContainer}
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
      >
        {organizations.map((org, index) => (
          <motion.div
            key={index}
            variants={scaleIn}
            whileHover={hoverScale}
            className="flex flex-col items-center gap-3 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
          >
            <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-gray-50">
              <Img
                src={org.logo ?? "/logo.png"}
                errorSrc="/logo.png"
                alt={org.title}
                className="object-contain p-2"
              />
            </div>
            <p className="text-sm font-medium text-gray-700 text-center truncate w-full">
              {org.title}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
}
