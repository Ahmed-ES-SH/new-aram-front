"use client";

import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
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
import { Slide } from "../../_dashboard/_slides/SlideDashCard";
import { directionMap } from "@/app/constants/_website/global";
import HeroSlide from "./HeroSlide";

interface props {
  slides: Slide[];
}

export default function HeroSlider({ slides }: props) {
  const locale = useLocale();
  const t = useTranslations("hero.video");
  const swiperRef = useRef<SwiperType>(null);

  return (
    <section className="relative min-h-screen lg:mt-20  flex items-center justify-center  bg-linear-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-12 lg:py-20">
        <Swiper
          dir="ltr"
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
          {slides.map((slide, index) => (
            <SwiperSlide key={`${slide.id}+as${index}`}>
              <HeroSlide slide={slide} />
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
