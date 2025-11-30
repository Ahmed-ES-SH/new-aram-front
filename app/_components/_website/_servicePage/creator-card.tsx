"use client";

import { motion } from "framer-motion";
import { FiUser, FiChevronRight } from "react-icons/fi";
import { fadeInUp, hoverScale, tapScale } from "./animation-variants";
import { Service } from "../../_dashboard/_services/types";
import { useTranslations } from "next-intl";
import Img from "../_global/Img";

interface CreatorCardProps {
  creator: Service["creater"];
}

export function CreatorCard({ creator }: CreatorCardProps) {
  const t = useTranslations();

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={fadeInUp}
      whileHover={hoverScale}
      whileTap={tapScale}
      className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 cursor-pointer transition-shadow hover:shadow-md"
    >
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div className="relative">
          <div className="w-14 h-14 rounded-full overflow-hidden ring-2 ring-blue-100">
            <Img
              src={creator.image ?? "/defaults/noImage.png"}
              errorSrc="/defaults/noImage.png"
              alt={creator.name}
              width={56}
              height={56}
              className="object-cover w-full h-full"
            />
          </div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
            className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center"
          >
            <FiUser className="w-3 h-3 text-white" />
          </motion.div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-0.5">
            {t("service.creator")}
          </p>
          <h3 className="text-lg font-semibold text-gray-900 truncate">
            {creator.name}
          </h3>
        </div>

        {/* Arrow */}
        <FiChevronRight className="w-5 h-5 text-gray-300" />
      </div>
    </motion.div>
  );
}
