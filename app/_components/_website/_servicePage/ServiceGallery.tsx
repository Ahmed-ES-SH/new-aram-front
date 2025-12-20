"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence, spring } from "framer-motion";
import {
  IoClose,
  IoChevronForward,
  IoChevronBack,
  IoExpand,
} from "react-icons/io5";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Keyboard } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// --- Types ---
interface ServiceImage {
  id: string;
  src: string;
  alt: string;
}

interface LocalizationContent {
  galleryTitle: string;
  viewDetails: string;
  close: string;
  next: string;
  prev: string;
}

interface ServiceGalleryProps {
  images: ServiceImage[];
  translations?: LocalizationContent;
  locale?: "ar" | "en";
}

// --- Default Translations (Fallback) ---
const defaultTranslations: Record<"ar" | "en", LocalizationContent> = {
  ar: {
    galleryTitle: "معرض صور الخدمة",
    viewDetails: "عرض الصورة",
    close: "إغلاق",
    next: "التالي",
    prev: "السابق",
  },
  en: {
    galleryTitle: "Service Gallery",
    viewDetails: "View Image",
    close: "Close",
    next: "Next",
    prev: "Previous",
  },
};

export default function ServiceGallery({
  images,
  translations,
  locale = "en",
}: ServiceGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const swiperRef = useRef<SwiperType | null>(null);

  const t = translations || defaultTranslations[locale];
  const isRTL = locale === "ar";

  // --- Handlers ---
  const openModal = (index: number) => setSelectedIndex(index);
  const closeModal = () => setSelectedIndex(null);

  const showNext = useCallback(() => {
    if (selectedIndex === null) return;
    setSelectedIndex((prev) => (prev! + 1) % images.length);
  }, [selectedIndex, images.length]);

  const showPrev = useCallback(() => {
    if (selectedIndex === null) return;
    setSelectedIndex((prev) => (prev! - 1 + images.length) % images.length);
  }, [selectedIndex, images.length]);

  // Keyboard Navigation for Modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (e.key === "Escape") closeModal();
      if (e.key === "ArrowRight") isRTL ? showPrev() : showNext();
      if (e.key === "ArrowLeft") isRTL ? showNext() : showPrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, isRTL, showNext, showPrev]);

  // --- Animation Variants ---
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
  };

  const modalScale = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { type: spring, damping: 25, stiffness: 300 },
    },
    exit: { scale: 0.9, opacity: 0 },
  };

  return (
    <section className="w-full py-10">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-blue-600 inline-block mb-2">
            {t.galleryTitle}
          </h2>
          <div className="h-1 w-20 mx-auto rounded-full bg-linear-to-r from-blue-500 to-purple-600" />
        </div>

        {/* Swiper Slider */}
        <div className="relative">
          <Swiper
            modules={[Navigation, Pagination, Keyboard]}
            spaceBetween={16}
            slidesPerView={1}
            keyboard={{ enabled: true }}
            dir={isRTL ? "rtl" : "ltr"}
            breakpoints={{
              640: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 4 },
            }}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
              setIsBeginning(swiper.isBeginning);
              setIsEnd(swiper.isEnd);
            }}
            onSlideChange={(swiper) => {
              setIsBeginning(swiper.isBeginning);
              setIsEnd(swiper.isEnd);
            }}
            className="!pb-12"
          >
            {images.map((img, index) => (
              <SwiperSlide key={img.id}>
                <motion.div
                  whileHover={{ scale: 1.02, y: -5 }}
                  whileTap={{ scale: 0.98 }}
                  className="group relative cursor-pointer overflow-hidden rounded-xl bg-gray-100 aspect-square shadow-sm"
                  onClick={() => openModal(index)}
                >
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />

                  {/* Overlay on Hover */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="bg-linear-to-r from-blue-500 to-purple-600 p-3 rounded-full text-white shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <IoExpand size={24} />
                    </div>
                  </div>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Navigation Buttons - Show based on position */}
          {!isBeginning && (
            <button
              onClick={() => swiperRef.current?.slidePrev()}
              className={`absolute top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white shadow-lg hover:bg-linear-to-r hover:from-blue-500 hover:to-purple-600 hover:text-white transition-all hover:scale-110 ${
                isRTL ? "right-2" : "left-2"
              }`}
              aria-label={t.prev}
            >
              {isRTL ? (
                <IoChevronForward size={24} />
              ) : (
                <IoChevronBack size={24} />
              )}
            </button>
          )}

          {!isEnd && (
            <button
              onClick={() => swiperRef.current?.slideNext()}
              className={`absolute top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white shadow-lg hover:bg-linear-to-r hover:from-blue-500 hover:to-purple-600 hover:text-white transition-all hover:scale-110 ${
                isRTL ? "left-2" : "right-2"
              }`}
              aria-label={t.next}
            >
              {isRTL ? (
                <IoChevronBack size={24} />
              ) : (
                <IoChevronForward size={24} />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            className="fixed inset-0 z-999999 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={fadeIn}
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-5 right-5 z-50 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label={t.close}
            >
              <IoClose size={32} />
            </button>

            {/* Main Image Container */}
            <motion.div
              className="relative w-full max-w-5xl max-h-[85vh] flex items-center justify-center"
              variants={modalScale}
            >
              {/* Image */}
              <motion.img
                key={selectedIndex}
                src={images[selectedIndex].src}
                alt={images[selectedIndex].alt}
                className="max-h-[80vh] w-auto max-w-full rounded-lg shadow-2xl object-contain"
                initial={{ opacity: 0, x: isRTL ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              />

              {/* Caption */}
              <div className="absolute -bottom-12 left-0 right-0 text-center text-white/90">
                <p className="text-lg font-medium">
                  {images[selectedIndex].alt}
                </p>
                <span className="text-sm opacity-75 block">
                  {selectedIndex + 1} / {images.length}
                </span>
              </div>
            </motion.div>

            {/* Navigation Buttons */}
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4 md:px-10 pointer-events-none">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  showPrev();
                }}
                className="pointer-events-auto p-3 rounded-full bg-white/10 hover:bg-linear-to-r hover:from-blue-500 hover:to-purple-600 text-white backdrop-blur-md transition-all hover:scale-110"
                aria-label={t.prev}
              >
                {isRTL ? (
                  <IoChevronForward size={24} />
                ) : (
                  <IoChevronBack size={24} />
                )}
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  showNext();
                }}
                className="pointer-events-auto p-3 rounded-full bg-white/10 hover:bg-linear-to-r hover:from-blue-500 hover:to-purple-600 text-white backdrop-blur-md transition-all hover:scale-110"
                aria-label={t.next}
              >
                {isRTL ? (
                  <IoChevronBack size={24} />
                ) : (
                  <IoChevronForward size={24} />
                )}
              </button>
            </div>

            {/* Backdrop Click Handler (Close) */}
            <div className="absolute inset-0 -z-10" onClick={closeModal} />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
