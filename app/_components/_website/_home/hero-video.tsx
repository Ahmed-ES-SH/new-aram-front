"use client";
import { directionMap } from "@/app/constants/_website/global";
import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { LuArrowLeft, LuArrowRight, LuPlay } from "react-icons/lu";
import VideoBackground from "../_global/_VideoPlayer/VideoBackground";
import VideoModal from "../_global/VideoModal";

interface props {
  data: any;
}

export default function HeroVideo({ data }: props) {
  const locale = useLocale();
  const t = useTranslations("hero.video");
  const [showDemo, setShowDemo] = useState(false);

  const {
    column_1: title,
    column_2: description,
    column_3: stats,
    main_video,
    demo_video,
  } = data;

  const backgroundVideoUrl = main_video?.video_url ?? "/videos/background.mp4";

  return (
    <section
      dir={directionMap[locale]}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Video Background */}
      <VideoBackground src={backgroundVideoUrl} overlayOpacity={0.7} />

      {/* Content Overlay */}
      <div className="relative z-10 container mx-auto px-4 py-12 lg:py-20">
        <div className="max-w-4xl">
          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-center ltr:lg:text-left rtl:lg:text-right space-y-8"
          >
            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight"
            >
              {title?.[locale]}
            </motion.h1>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="text-lg md:text-xl lg:text-xl text-gray-200 leading-relaxed max-w-3xl"
            >
              {description?.[locale]}
            </motion.p>

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center justify-center px-8 py-4 bg-primary hover:bg-yellow-400 text-white font-semibold rounded-xl shadow-2xl hover:shadow-yellow-500/25 transition-all duration-300 group"
              >
                {t("primaryButton")}
                {locale == "ar" ? (
                  <LuArrowLeft className="mr-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                ) : (
                  <LuArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                )}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowDemo(true)}
                className="flex items-center justify-center rtl:flex-row-reverse px-8 py-4 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white font-semibold rounded-xl border border-white/20 hover:border-white/40 shadow-2xl transition-all duration-300 group"
              >
                <LuPlay className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform rtl:rotate-180" />
                {t("secondaryButton")}
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="mt-16 lg:mt-24"
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 lg:gap-12">
              {stats &&
                stats.map((stat: any, index: number) => (
                  <motion.div
                    key={stat?.[locale] || index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 1 + index * 0.1 }}
                    className="text-center ltr:lg:text-left rtl:lg:text-right"
                  >
                    <div className="text-3xl lg:text-4xl font-bold text-white mb-2">
                      {stat.number}
                    </div>
                    <div className="text-gray-300 text-sm lg:text-base font-medium">
                      {stat?.[locale] ?? ""}
                    </div>
                  </motion.div>
                ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            className="w-1 h-3 bg-white/70 rounded-full mt-2"
          />
        </motion.div>
      </motion.div>

      <motion.div
        animate={{
          y: [-15, 15, -15],
          x: [-5, 5, -5],
        }}
        transition={{
          duration: 7,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: 2,
        }}
        className="absolute top-1/3 left-10 w-12 h-12 bg-blue-500/20 backdrop-blur-sm rounded-full border border-blue-500/30 hidden lg:block"
      />

      <VideoModal
        isOpen={showDemo}
        onClose={() => setShowDemo(false)}
        videoUrl={demo_video?.video_url}
      />
    </section>
  );
}
