"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { useRef } from "react";
import type { Swiper as SwiperType } from "swiper";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { FaArrowRight, FaPlay } from "react-icons/fa";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
import Img from "../_global/Img";

interface SlideData {
  key: "fitness" | "restaurant" | "events";
  image: string;
  bgColor: string;
}

const slides: SlideData[] = [
  {
    key: "fitness",
    image: "/bg-hero-1.png",
    bgColor: "bg-orange-400/20",
  },
  {
    key: "restaurant",
    image: "/bg-hero-1.png",
    bgColor: "bg-red-400/20",
  },
  {
    key: "events",
    image: "/bg-hero-1.png",
    bgColor: "bg-purple-400/20",
  },
];

export default function HeroSlider() {
  const t = useTranslations("hero.slider");
  const swiperRef = useRef<SwiperType>(null);

  return (
    <section className="relative min-h-screen flex items-center justify-center  bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-12 lg:py-20">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={0}
          slidesPerView={1}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
            bulletClass: "swiper-pagination-bullet !bg-orange-500 !opacity-50",
            bulletActiveClass: "swiper-pagination-bullet-active !opacity-100",
          }}
          onBeforeInit={(swiper) => {
            swiperRef.current = swiper;
          }}
          className="w-full"
        >
          {slides.map((slide) => (
            <SwiperSlide key={slide.key}>
              <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center min-h-[80vh]">
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
                      className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight"
                    >
                      {t(`${slide.key}.heading`)}
                    </motion.h1>

                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.4 }}
                      className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-lg"
                    >
                      {t(`${slide.key}.subheading`)}
                    </motion.p>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="flex flex-col sm:flex-row gap-4"
                  >
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="inline-flex items-center justify-center px-8 py-4 bg-primary hover:bg-yellow-400 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
                    >
                      {t(`${slide.key}.primaryButton`)}
                      <FaArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="inline-flex items-center justify-center px-8 py-4 bg-white hover:bg-gray-50 text-gray-900 font-semibold rounded-xl border-2 border-gray-200 hover:border-gray-300 shadow-lg hover:shadow-xl transition-all duration-300 group"
                    >
                      <FaPlay className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                      {t(`${slide.key}.secondaryButton`)}
                    </motion.button>
                  </motion.div>
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
                    className={`absolute w-80 h-80 lg:w-96 lg:h-96 ${slide.bgColor} rounded-full blur-3xl`}
                  />

                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.7 }}
                    className="relative z-10"
                  >
                    <Img
                      src={"/bg-hero-1.png"}
                      alt={`${slide.key} booking illustration`}
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
                    className="absolute top-10 right-10 w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center shadow-lg"
                  >
                    <div className="w-8 h-8 bg-orange-500 rounded-full" />
                  </motion.div>

                  <motion.div
                    animate={{ y: [10, -10, 10] }}
                    transition={{
                      duration: 4,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                      delay: 1,
                    }}
                    className="absolute bottom-20 left-10 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center shadow-lg"
                  >
                    <div className="w-6 h-6 bg-blue-500 rounded-full" />
                  </motion.div>
                </motion.div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom Navigation */}
        <div className="flex justify-center items-center gap-4 mt-8">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => swiperRef.current?.slidePrev()}
            className="p-3 bg-white hover:bg-gray-50 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200"
          >
            <BiChevronLeft className="h-6 w-6 text-gray-700" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => swiperRef.current?.slideNext()}
            className="p-3 bg-white hover:bg-gray-50 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200"
          >
            <BiChevronRight className="h-6 w-6 text-gray-700" />
          </motion.button>
        </div>
      </div>
    </section>
  );
}
