"use client";

import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, EffectCoverflow } from "swiper/modules";
import { ArticleType } from "@/app/types/_dashboard/GlobalTypes";
import { useLocale } from "next-intl";
import { directionMap } from "@/app/constants/_website/global";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-coverflow";

import { motion } from "framer-motion";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";

import ArticleCard from "../../_blog/ArticleCard";

interface SwiperComponentProps {
  articles: ArticleType[];
}

export default function SwiperComponent({ articles }: SwiperComponentProps) {
  const locale = useLocale();
  const isRTL = directionMap[locale] === "rtl";

  // Refs for custom navigation buttons
  const prevRef = useRef<HTMLButtonElement | null>(null);
  const nextRef = useRef<HTMLButtonElement | null>(null);

  const swiperConfig = {
    modules: [Navigation, Autoplay, EffectCoverflow],
    spaceBetween: 24,
    slidesPerView: 1,
    centeredSlides: false,
    loop: true,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
    // We'll wire the navigation refs in onBeforeInit below
    navigation: {
      prevEl: prevRef.current,
      nextEl: nextRef.current,
    },
    pagination: {
      clickable: true,
      el: ".swiper-pagination",
    },
    breakpoints: {
      640: {
        slidesPerView: 1,
        spaceBetween: 20,
      },
      768: {
        slidesPerView: 2,
        spaceBetween: 24,
      },
      1024: {
        slidesPerView: 3,
        spaceBetween: 24,
      },
      1280: {
        slidesPerView: 4,
        spaceBetween: 24,
      },
    },
    effect: "slide" as const,
    speed: 600,
  };

  return (
    <div className="relative">
      {/* Left / Right custom nav buttons */}
      <div
        aria-hidden="true"
        className="absolute inset-y-0 left-0 flex items-center pointer-events-none z-20"
      >
        <motion.button
          ref={prevRef}
          initial={{ opacity: 0.95 }}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.98 }}
          className="pointer-events-auto ml-3 rounded-full p-3 shadow-lg
                     bg-primary text-primary-foreground font-medium
                     transition-transform duration-150 focus:outline-none
                     focus:ring-2 focus:ring-offset-2 focus:ring-primary/50
                     flex items-center justify-center"
          aria-label="Previous slide"
          title="Previous"
        >
          <HiChevronLeft size={20} />
        </motion.button>
      </div>

      <div
        aria-hidden="true"
        className="absolute inset-y-0 right-0 flex items-center pointer-events-none z-20"
      >
        <motion.button
          ref={nextRef}
          initial={{ opacity: 0.95 }}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.98 }}
          className="pointer-events-auto mr-3 rounded-full p-3 shadow-lg
                     bg-primary text-primary-foreground font-medium
                     transition-transform duration-150 focus:outline-none
                     focus:ring-2 focus:ring-offset-2 focus:ring-primary/50
                     flex items-center justify-center"
          aria-label="Next slide"
          title="Next"
        >
          <HiChevronRight size={20} />
        </motion.button>
      </div>

      <Swiper
        {...swiperConfig}
        dir={isRTL ? "rtl" : "ltr"}
        className="pb-12"
        // Ensure Swiper uses the button refs created above
        onBeforeInit={(swiper) => {
          // @ts-ignore
          if (swiper.params.navigation) {
            // @ts-ignore
            swiper.params.navigation.prevEl = prevRef.current;
            // @ts-ignore
            swiper.params.navigation.nextEl = nextRef.current;
          }
        }}
      >
        {articles.map((article) => (
          <SwiperSlide key={`${article.id}+${article.title_en}`}>
            <ArticleCard article={article} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
