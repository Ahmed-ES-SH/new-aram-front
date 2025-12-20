"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { category } from "@/app/types/_dashboard/GlobalTypes";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/free-mode";

interface CategoryFilterProps {
  categories: category[];
  selectedCategory: category | null;
  onSelectCategory: (category: category | null) => void;
  locale: string;
}

export default function CategoryFilter({
  categories,
  selectedCategory,
  onSelectCategory,
  locale,
}: CategoryFilterProps) {
  const t = useTranslations("servicesPage.categories");

  return (
    <section className="py-8 px-4">
      <div className="max-w-6xl mx-auto relative pb-12">
        {/* Swiper Slider */}
        <Swiper
          modules={[Autoplay, Navigation, FreeMode]}
          spaceBetween={16}
          slidesPerView={"auto"}
          freeMode={true}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          navigation={{
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          }}
          className="category-swiper"
        >
          {/* All categories button */}
          <SwiperSlide className="!w-auto">
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelectCategory(null)}
              className={`flex flex-col items-center gap-2 px-6 py-4 rounded-xl transition-colors min-w-[100px] ${
                selectedCategory === null
                  ? "bg-primary text-white shadow-lg shadow-primary/20"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                <span className="text-xl">🏠</span>
              </div>
              <span className="text-sm font-medium">{t("all")}</span>
            </motion.button>
          </SwiperSlide>

          {/* Category items */}
          {categories.map((category, index) => (
            <SwiperSlide key={category.id} className="w-auto!">
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onSelectCategory(category)}
                className={`flex flex-col items-center gap-2 px-6 py-4 rounded-xl transition-colors min-w-[150px] ${
                  selectedCategory?.id == category.id
                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <div className="w-12 h-12 rounded-full overflow-hidden bg-white">
                  <Image
                    src={category.image ?? "/defaults/noImage.png"}
                    alt={
                      locale === "ar" ? category.title_ar : category.title_en
                    }
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-sm font-medium whitespace-nowrap">
                  {locale === "ar" ? category.title_ar : category.title_en}
                </span>
              </motion.button>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Navigation Arrows */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-4 z-10">
          <div className="swiper-button-prev !static !m-0 !flex !items-center !justify-center !h-8 w-8! !bg-white !shadow-lg !rounded-full !text-teal-500 after:!text-xs"></div>
          <div className="swiper-button-next !static !m-0 !flex !items-center !justify-center !h-8 !w-8 !bg-white !shadow-lg !rounded-full !text-teal-500 after:!text-xs"></div>
        </div>
      </div>

      <style jsx global>{`
        .category-swiper {
          padding: 8px 10px;
        }

        .swiper-button-disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }
      `}</style>
    </section>
  );
}
