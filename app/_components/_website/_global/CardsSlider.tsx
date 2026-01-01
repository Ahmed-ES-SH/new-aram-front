"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useLocale, useTranslations } from "next-intl";
import { directionMap } from "@/app/constants/_website/global";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Card } from "../../_dashboard/_cards/types";
import CreditCard from "./CreditCard";
import { MembershipCard } from "./_memberShipCard-v2";

interface CardsSliderProps {
  cards: Card[];
  title?: string;
  subtitle?: string;
}

export default function CardsSlider({ cards }: CardsSliderProps) {
  const locale = useLocale();
  const t = useTranslations("cardsSlider");

  // Swiper navigation refs
  const navigationPrevRef = React.useRef<HTMLButtonElement>(null);
  const navigationNextRef = React.useRef<HTMLButtonElement>(null);

  return (
    <section
      dir={directionMap[locale]}
      className="pt-12 mt-12 mb-3 c-container border-t border-gray-300 p-2"
    >
      <div className="w-[95%] mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
            {t("title")}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
            {t("subtitle")}
          </p>
          <div className="w-24 h-1 bg-linear-to-r from-blue-400 to-purple-500 mx-auto rounded-full"></div>
        </div>

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
                slidesPerView: 2,
              },
              1024: {
                slidesPerView: 3,
              },
              1300: {
                slidesPerView: 4,
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
            {cards.map((card) => (
              <SwiperSlide key={card.id}>
                <MembershipCard data={card} />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Navigation Arrows */}
          <button
            ref={navigationPrevRef}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white p-3 rounded-full shadow-md hover:bg-gray-100 transition-colors -translate-x-1/2 hidden md:flex items-center justify-center"
            aria-label={t("prevButton")}
          >
            <FaChevronLeft className="text-gray-700" />
          </button>
          <button
            ref={navigationNextRef}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white p-3 rounded-full shadow-md hover:bg-gray-100 transition-colors translate-x-1/2 hidden md:flex items-center justify-center"
            aria-label={t("nextButton")}
          >
            <FaChevronRight className="text-gray-700" />
          </button>
        </div>
      </div>
    </section>
  );
}
