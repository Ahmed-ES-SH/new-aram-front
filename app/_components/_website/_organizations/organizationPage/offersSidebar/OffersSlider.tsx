"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useLocale } from "next-intl";
import { directionMap } from "@/app/constants/_website/global";
import { motion } from "framer-motion";
import { Offer } from "@/app/_components/_dashboard/_offers/types";
import OfferCard from "../../../_offers/OfferCard";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { BiSolidOffer } from "react-icons/bi";

interface CardsSliderProps {
  offers: Offer[];
}

export default function OffersSlider({ offers }: CardsSliderProps) {
  const locale = useLocale();

  // Swiper navigation refs
  const navigationPrevRef = React.useRef<HTMLButtonElement>(null);
  const navigationNextRef = React.useRef<HTMLButtonElement>(null);
  if (!Array.isArray(offers)) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex-1 h-[86vh] sticky top-28 left-0 flex flex-col items-center justify-center border border-gray-200 bg-white rounded-2xl shadow-md xl:hidden"
      >
        <motion.div
          initial={{ rotate: -10, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
          className="flex flex-col items-center text-center p-6"
        >
          <BiSolidOffer className="size-32 text-red-500 mb-4" />
          <p className="text-gray-600 text-base leading-relaxed">
            {locale === "en"
              ? "This center currently has no displayable offers."
              : "هذا المركز حتى الآن لا يحتوي على عروض قابلة للعرض"}
          </p>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <section dir={directionMap[locale]} className="mb-3  p-2 xl:hidden">
      <div>
        {/* Slider Container */}
        <div className="relative h-fit">
          <Swiper
            modules={[Navigation, Autoplay]}
            spaceBetween={24}
            slidesPerView={1}
            breakpoints={{
              320: {
                slidesPerView: 1,
              },
              480: {
                slidesPerView: 1.5,
              },
              1024: {
                slidesPerView: 2,
              },
              1300: {
                slidesPerView: 3,
              },
            }}
            navigation={{
              prevEl: navigationPrevRef.current,
              nextEl: navigationNextRef.current,
            }}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            loop={true}
            onInit={(swiper: any) => {
              swiper.params.navigation.prevEl = navigationPrevRef.current;
              swiper.params.navigation.nextEl = navigationNextRef.current;
              swiper.navigation.init();
              swiper.navigation.update();
            }}
            className="pb-12"
          >
            {offers &&
              offers.map((card, index) => (
                <SwiperSlide key={card.id}>
                  <OfferCard offer={card} index={index} />
                </SwiperSlide>
              ))}
          </Swiper>

          {/* Custom Navigation Arrows */}
          <button
            ref={navigationPrevRef}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white p-3 rounded-full shadow-md hover:bg-gray-100 transition-colors -translate-x-1/2 hidden md:flex items-center justify-center"
          >
            <FaChevronLeft className="text-gray-700" />
          </button>
          <button
            ref={navigationNextRef}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white p-3 rounded-full shadow-md hover:bg-gray-100 transition-colors translate-x-1/2 hidden md:flex items-center justify-center"
          >
            <FaChevronRight className="text-gray-700" />
          </button>
        </div>
      </div>
    </section>
  );
}
