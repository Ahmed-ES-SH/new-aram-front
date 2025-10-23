"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useLocale } from "next-intl";
import { directionMap } from "@/app/constants/_website/global";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Offer } from "@/app/_components/_dashboard/_offers/types";
import OfferCard from "../../../_offers/OfferCard";

interface CardsSliderProps {
  offers: Offer[];
}

export default function OffersSlider({ offers }: CardsSliderProps) {
  const locale = useLocale();

  // Swiper navigation refs
  const navigationPrevRef = React.useRef<HTMLButtonElement>(null);
  const navigationNextRef = React.useRef<HTMLButtonElement>(null);

  if (!offers) {
    return (
      <div className="w-full min-h-[50vh] flex items-center justify-center border border-gray-300 rounded-lg shadow-md max-xl:hidden">
        <div>
          <p>
            {locale == "en"
              ? "This center currently has no displayable offers."
              : "هذا المركز حتى الان لا يحتوى على عروض قابلة للعرض"}
          </p>
        </div>
      </div>
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
            {offers.map((card, index) => (
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
