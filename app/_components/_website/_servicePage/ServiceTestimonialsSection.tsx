"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide, useSwiper } from "swiper/react"; // استخدام useSwiper
import { Pagination, A11y } from "swiper/modules";

// استيراد أنماط Swiper الأساسية (مهم جداً!)
import "swiper/css";
import "swiper/css/pagination"; // نحتاج فقط لنمط التنقيط
import { FiChevronLeft, FiChevronRight, FiStar } from "react-icons/fi";
import Img from "../_global/Img";

interface Testimonial {
  text: string;
  name: string;
  rating: number;
  avatar: string;
}

interface ServiceTestimonialsSectionProps {
  t: any;
}

// 1. مكون فرعي خاص بالأزرار للتحكم في Swiper
const CustomNavigationButtons = ({ isRTL }: { isRTL: boolean }) => {
  // الحصول على نسخة Swiper للتحكم بها
  const swiper = useSwiper();

  return (
    <div className="flex justify-center gap-4 mt-8">
      {/* زر التنقل إلى الشريحة السابقة */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => swiper.slidePrev()} // دالة Swiper للذهاب للخلف
        className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-gray-700 hover:bg-linear-to-r hover:from-primary outline-none hover:to-primary-red hover:text-white transition-all duration-300"
      >
        {isRTL ? (
          <FiChevronRight className="text-xl" />
        ) : (
          <FiChevronLeft className="text-xl" />
        )}
      </motion.button>

      {/* زر التنقل إلى الشريحة التالية */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => swiper.slideNext()} // دالة Swiper للذهاب للأمام
        className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-gray-700 hover:bg-linear-to-r hover:from-primary outline-none hover:to-primary-red hover:text-white transition-all duration-300"
      >
        {isRTL ? (
          <FiChevronLeft className="text-xl" />
        ) : (
          <FiChevronRight className="text-xl" />
        )}
      </motion.button>
    </div>
  );
};

export default function ServiceTestimonialsSection({
  t,
}: ServiceTestimonialsSectionProps) {
  const isRTL = t.language === "ar";
  // نحتاج إلى حالة لتتبع الشريحة النشطة يدوياً للتحكم في التنقيط
  const [activeIndex, setActiveIndex] = useState(0);

  // دالة لمسح أو توليد نجوم التقييم
  const renderStars = (rating: number) => {
    return [...Array(rating)].map((_, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: i * 0.1 }}
      >
        <FiStar className="text-yellow-400 fill-yellow-400 text-2xl mx-1" />
      </motion.div>
    ));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="mb-20"
    >
      <h2 className={`text-4xl font-bold text-gray-800 mb-12 text-center`}>
        {t.testimonialTitle}
      </h2>

      <div className="relative max-w-7xl mx-auto px-2 lg:px-6">
        <Swiper
          // تحديد الوحدات المستخدمة
          modules={[Pagination, A11y]}
          direction="horizontal"
          spaceBetween={30}
          slidesPerView={2}
          breakpoints={{
            0: {
              slidesPerView: 1,
            },
            768: {
              slidesPerView: 2,
            },
          }}
          loop={true} // للتكرار اللانهائي
          // تحديث الحالة عند تغيير الشريحة
          onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
          // نحصل على نسخة Swiper لتمكين التنقيط اليدوي
          onSwiper={(swiper) => setActiveIndex(swiper.realIndex)}
          className="pb-8"
          style={{ boxShadow: "none" }}
        >
          {t.testimonials.map((testimonial: Testimonial, index: number) => (
            <SwiperSlide key={index}>
              <div
                style={{ boxShadow: "none" }}
                className="bg-white h-full rounded-3xl p-8 lg:p-12 shadow-2xl border border-gray-100 min-h-[300px] flex flex-col justify-center"
              >
                <div className="flex justify-center mb-6">
                  {renderStars(testimonial.rating)}
                </div>

                <p
                  className={`text-xl text-gray-700 mb-8 leading-relaxed ${
                    isRTL ? "text-right" : "text-left"
                  }`}
                >
                  "{testimonial.text}"
                </p>

                <div
                  className={`flex items-center gap-4 ${
                    isRTL ? "justify-end" : "justify-start"
                  }`}
                >
                  <div className="w-12 h-12 rounded-full bg-linear-to-br from-primary to-primary-red flex items-center justify-center text-white font-bold">
                    <Img
                      src={testimonial.avatar ?? "/defaults/male-noimage.jpg"}
                      errorSrc="/defaults/male-noimage.jpg"
                      alt={testimonial.name}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <div className={isRTL ? "text-right" : "text-left"}>
                    <p className="font-bold text-gray-800">
                      {testimonial.name}
                    </p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}

          {/* تضمين مكون الأزرار المخصص */}
          <CustomNavigationButtons isRTL={isRTL} />
        </Swiper>

        {/* التنقيط اليدوي (Pips/Dots) */}
        <div className="flex justify-center gap-2 mt-4">
          {t.testimonials.map((_, index) => (
            <motion.button
              key={index}
              // هنا نستخدم الحالة (activeIndex) التي يتم تحديثها بواسطة Swiper
              onClick={() => {}}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === activeIndex
                  ? "w-8 bg-linear-to-r from-primary to-primary-red"
                  : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
