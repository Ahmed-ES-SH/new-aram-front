"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Organization } from "../../_dashboard/_organizations/types/organization";
import OrganizationCard from "../_organizations/OrganizationCard";
import { useLocale, useTranslations } from "next-intl";
import { directionMap } from "@/app/constants/_website/global";

interface OrganizationsSliderProps {
  organizations: Organization[];
  title?: string;
  subtitle?: string;
}

export default function OrganizationsSlider({
  organizations,
}: OrganizationsSliderProps) {
  const locale = useLocale();
  const t = useTranslations("organizationsSlider");

  // Swiper navigation refs
  const navigationPrevRef = React.useRef<HTMLButtonElement>(null);
  const navigationNextRef = React.useRef<HTMLButtonElement>(null);

  return (
    <section dir={directionMap[locale]} className="pt-16 p-2">
      <div className="w-full">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center mb-4">
            {/* <FaBuilding className="text-3xl text-blue-500 mr-3" /> */}
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
              {t("title")}
            </h2>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
            {t("subtitle")}
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-purple-500 mx-auto rounded-full"></div>
        </div>

        {/* Slider Container */}
        <div className="relative  h-[550px]">
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
              900: {
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
            {organizations.map((organization, index) => (
              <SwiperSlide key={organization.id}>
                <OrganizationCard index={index} organization={organization} />
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
