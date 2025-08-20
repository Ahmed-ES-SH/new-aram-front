"use client";

import { directionMap } from "@/app/constants/_website/global";
import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { useState, useRef, useEffect } from "react";
import {
  LuArrowLeft,
  LuArrowRight,
  LuPlay,
  LuVolume2,
  LuVolumeX,
} from "react-icons/lu";

export default function HeroVideo() {
  const locale = useLocale();
  const t = useTranslations("hero.video");
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay failed, which is expected in many browsers
        setIsPlaying(false);
      });
    }
  }, []);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const stats = [
    { number: "50K+", label: { en: "Happy Customers", ar: "عملاء سعداء" } },
    { number: "1M+", label: { en: "Bookings Made", ar: "عدد الحجوزات" } },
    { number: "500+", label: { en: "Partner Venues", ar: "أماكن شريكة" } },
  ];

  return (
    <section
      dir={directionMap[locale]}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          autoPlay
          muted={isMuted}
          loop
          playsInline
          poster="/placeholder.svg?height=1080&width=1920"
        >
          <source src="/videos/BigBuckBunny.mp4" type="video/mp4" />
          {/* Fallback for browsers that don't support video */}
          <div className="w-full h-full bg-gradient-to-br from-yellow-500 to-purple-600" />
        </video>

        {/* Dark Overlay for Text Readability */}
        <div className="absolute inset-0 bg-black/50" />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
      </div>

      {/* Video Controls */}
      <div className="absolute top-6 ltr:right-6 rtl:left-6 z-20 flex gap-2">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleMute}
          className="p-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full transition-all duration-300"
        >
          {isMuted ? (
            <LuVolumeX className="h-5 w-5 text-white" />
          ) : (
            <LuVolume2 className="h-5 w-5 text-white" />
          )}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={togglePlay}
          className="p-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full transition-all duration-300"
        >
          {isPlaying ? (
            <div className="w-5 h-5 flex items-center justify-center">
              <div className="w-1 h-4 bg-white mr-1" />
              <div className="w-1 h-4 bg-white" />
            </div>
          ) : (
            <LuPlay className="h-5 w-5 text-white ml-0.5" />
          )}
        </motion.button>
      </div>

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
              className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight"
            >
              {t("heading")}
            </motion.h1>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="text-lg md:text-xl lg:text-2xl text-gray-200 leading-relaxed max-w-3xl"
            >
              {t("subheading")}
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
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 lg:gap-12">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label[locale]}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 1 + index * 0.1 }}
                  className="text-center ltr:lg:text-left rtl:lg:text-right"
                >
                  <div className="text-3xl lg:text-4xl font-bold text-white mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-300 text-sm lg:text-base font-medium">
                    {stat.label[locale]}
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

      {/* Floating Elements */}
      <motion.div
        animate={{
          y: [-20, 20, -20],
          rotate: [0, 5, 0, -5, 0],
        }}
        transition={{
          duration: 6,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        className="absolute top-1/4 right-10 w-20 h-20 bg-yellow-500/20 backdrop-blur-sm rounded-full border border-yellow-500/30 hidden lg:block"
      />

      <motion.div
        animate={{
          y: [20, -20, 20],
          rotate: [0, -5, 0, 5, 0],
        }}
        transition={{
          duration: 8,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: 1,
        }}
        className="absolute bottom-1/4 right-20 w-16 h-16 bg-purple-500/20 backdrop-blur-sm rounded-full border border-purple-500/30 hidden lg:block"
      />

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
    </section>
  );
}
