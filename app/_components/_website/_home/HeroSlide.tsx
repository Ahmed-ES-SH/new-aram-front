"use client";
import { motion } from "framer-motion";
import { useLocale } from "next-intl";
import { directionMap } from "@/app/constants/_website/global";
import { Slide } from "../../_dashboard/_slides/SlideDashCard";
import Img from "../_global/Img";

interface props {
  slide: Slide;
}

export default function HeroSlide({ slide }: props) {
  const locale = useLocale();
  return (
    <div
      dir={directionMap[locale]}
      className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center min-h-[60vh]"
    >
      {/* Left Content */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="space-y-8"
      >
        <div className="space-y-6">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight"
          >
            {slide.title[locale]}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-gray-600 leading-relaxed max-w-2xl"
          >
            {slide.description[locale]}
          </motion.p>
        </div>
      </motion.div>

      {/* Right Content - Image with Colored Circle */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="relative flex items-center justify-center"
      >
        {/* Colored Circle Background */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
          className={`absolute w-80 h-80 lg:w-96 lg:h-96 bg-primary/30 rounded-full blur-3xl`}
        />

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="relative z-10"
        >
          <Img
            src={slide.image ?? "/bg-hero-1.png"}
            alt={`${slide.id} booking illustration`}
            className="w-full max-w-md lg:max-w-lg h-auto object-contain"
          />
        </motion.div>

        {/* Floating Elements */}
        <motion.div
          animate={{ y: [-10, 10, -10] }}
          transition={{
            duration: 3,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          style={{ background: `${slide.circle_1_color}30` }}
          className="absolute top-10 right-10 w-16 h-16  rounded-full flex items-center justify-center shadow-lg"
        >
          <div
            style={{ background: `${slide.circle_1_color}` }}
            className="w-8 h-8 bg-orange-500 rounded-full"
          />
        </motion.div>

        <motion.div
          animate={{ y: [10, -10, 10] }}
          transition={{
            duration: 4,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 1,
          }}
          style={{ background: `${slide.circle_2_color}30` }}
          className="absolute bottom-20 left-10 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center shadow-lg"
        >
          <div
            style={{ background: `${slide.circle_2_color}` }}
            className="w-6 h-6 bg-blue-500 rounded-full"
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
