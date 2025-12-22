"use client";
import { useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import ServiceCard from "./service-card";
import { useLocale, useTranslations } from "next-intl";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { Service } from "./service";
import "swiper/css";
import "swiper/css/navigation";
import ServiceSliderHeader from "./ServiceSliderHeader";

interface props {
  services: Service[];
}

const ServicesSlider = ({ services }: props) => {
  const locale = useLocale();
  const t = useTranslations("servicesSlider");

  const swiperRef: any = useRef(null);
  const prevRef: any = useRef(null);
  const nextRef: any = useRef(null);

  useEffect(() => {
    if (swiperRef.current && swiperRef.current.swiper) {
      const swiper = swiperRef.current.swiper;

      // تحديث عناصر التنقل
      swiper.params.navigation.prevEl = prevRef.current;
      swiper.params.navigation.nextEl = nextRef.current;
      swiper.navigation.init();
      swiper.navigation.update();
    }
  }, [services]);

  return (
    <div className="relative c-container mb-4 mt-12" dir="ltr">
      {/* العناوين */}
      <ServiceSliderHeader />

      {/* السلايدر */}
      <Swiper
        ref={swiperRef}
        modules={[Navigation, Autoplay]}
        spaceBetween={30}
        slidesPerView={1}
        loop={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        navigation={{
          prevEl: prevRef.current,
          nextEl: nextRef.current,
        }}
        breakpoints={{
          640: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 4,
          },
        }}
        onInit={(swiper: any) => {
          swiper.params.navigation.prevEl = prevRef.current;
          swiper.params.navigation.nextEl = nextRef.current;
          swiper.navigation.init();
          swiper.navigation.update();
        }}
      >
        {services.map((service, index: number) => (
          <SwiperSlide key={service.id}>
            <ServiceCard service={service} locale={locale} index={index} />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* الأزرار المخصصة */}
      <div className="flex justify-center gap-4 mt-6">
        <button
          ref={prevRef}
          className="w-10 h-10 flex items-center justify-center rounded-full 
               bg-white shadow hover:bg-gray-100 transition text-xl 
               border border-gray-200"
        >
          {locale === "ar" ? <FiArrowRight /> : <FiArrowLeft />}
        </button>

        <button
          ref={nextRef}
          className="w-10 h-10 flex items-center justify-center rounded-full 
               bg-white shadow hover:bg-gray-100 transition text-xl 
               border border-gray-200"
        >
          {locale === "ar" ? <FiArrowLeft /> : <FiArrowRight />}
        </button>
      </div>
    </div>
  );
};

export default ServicesSlider;
