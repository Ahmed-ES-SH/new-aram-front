"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { FiChevronLeft, FiChevronRight, FiImage } from "react-icons/fi";
import { fadeInUp, staggerContainer, scaleIn } from "./animation-variants";
import { useTranslations } from "next-intl";
import { Service } from "../../_dashboard/_services/types";
import Img from "../_global/Img";

export type serviceImage = {
  id: number;
  path: string;
  service_id: number;
  created_at: string;
  updated_at: string;
};

interface GallerySliderProps {
  images: serviceImage[];
}

export function GallerySlider({ images }: GallerySliderProps) {
  const t = useTranslations();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (images.length === 0) return null;

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={fadeInUp}
      className="space-y-4"
    >
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FiImage className="w-5 h-5 text-blue-500" />
          <h2 className="text-xl font-bold text-gray-900">
            {t("service.gallery")}
          </h2>
          <span className="text-sm text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
            {images.length}
          </span>
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
              canScrollLeft
                ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                : "bg-gray-50 text-gray-300 cursor-not-allowed"
            }`}
          >
            <FiChevronLeft className="w-5 h-5" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
              canScrollRight
                ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                : "bg-gray-50 text-gray-300 cursor-not-allowed"
            }`}
          >
            <FiChevronRight className="w-5 h-5" />
          </motion.button>
        </div>
      </div>

      {/* Slider */}
      <motion.div
        ref={scrollRef}
        onScroll={checkScroll}
        variants={staggerContainer}
        className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 -mx-4 px-4 snap-x snap-mandatory"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {images &&
          images.map((image, index) => {
            return (
              <motion.div
                key={index}
                variants={scaleIn}
                whileHover={{ scale: 1.03, y: -4 }}
                className="shrink-0 relative w-64 h-44 sm:w-72 sm:h-48 rounded-2xl overflow-hidden shadow-sm cursor-pointer snap-start"
              >
                <Img
                  src={(image.path as string) ?? "/defaults/noImage.png"}
                  errorSrc="/defaults/noImage.png"
                  alt={`Gallery image ${index + 1}`}
                  className="object-cover w-full h-full"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity" />
              </motion.div>
            );
          })}
      </motion.div>
    </motion.section>
  );
}
