"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiPlayCircle, FiX } from "react-icons/fi";
import { useLocale, useTranslations } from "next-intl";
import { LocaleType } from "@/app/types/_dashboard/GlobalTypes";
import Img from "../_global/Img";
import { SiSnowflake } from "react-icons/si";
import DynamicServiceForm from "../_DynamicServiceForm";
import { Form, VideoFile } from "../../_dashboard/_serviceEditor/types";
import { directionMap } from "@/app/constants/_website/global";

export interface HeroData {
  id: number | string;
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  watchBtn: string;
  exploreBtn: string;
  heroImage: string;
  backgroundImage: string;
  video?: VideoFile;
  form?: Form;
  serviceSlug?: string;
  price?: number;
  price_before_discount?: number;
}

interface HeroProps {
  data?: HeroData;
}

const VideoModal = ({
  video,
  onClose,
}: {
  video: VideoFile;
  onClose: () => void;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative w-full max-w-4xl bg-black rounded-2xl overflow-hidden shadow-2xl aspect-video"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 end-4 z-10 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
        >
          <FiX size={24} />
        </button>

        {video.is_file === 1 ? (
          <video
            src={video.video_url}
            controls
            autoPlay
            className="w-full h-full object-contain"
          />
        ) : (
          <iframe
            src={
              video.video_url.includes("youtube") ||
              video.video_url.includes("youtu.be")
                ? video.video_url.includes("embed")
                  ? video.video_url
                  : `https://www.youtube.com/embed/${
                      video.video_url.split("v=")[1]?.split("&")[0] ||
                      video.video_url.split("/").pop()
                    }?autoplay=1`
                : video.video_url
            }
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )}
      </motion.div>
    </motion.div>
  );
};

export default function HeroServiceSection({ data }: HeroProps) {
  const locale = useLocale() as LocaleType;
  const t = useTranslations("servicePage.hero_section");
  const isRTL = locale === "ar";
  const [showVideo, setShowVideo] = useState(false);
  const [showOrderForm, setShowOrderForm] = useState(false);

  // Use backend data if available, otherwise fall back to defaults
  const content = data
    ? {
        id: data.id,
        badge: data.badge,
        title: data.title,
        subtitle: data.subtitle,
        description: data.description,
        watchBtn: data.watchBtn,
        exploreBtn: data.exploreBtn,
      }
    : {
        id: 0,
        badge: t("badge"),
        title: t("title"),
        subtitle: t("subtitle"),
        description: t("description"),
        watchBtn: t("watchBtn"),
        exploreBtn: t("exploreBtn"),
      };

  const heroImage = data?.heroImage || "/services/service-man.png";
  const backgroundImage = data?.backgroundImage || "/service-wave.svg";

  return (
    <div
      dir={directionMap[locale]}
      className={`min-h-screen relative overflow-hidden text-start`}
    >
      {/* الخلفية */}
      <Img
        src={backgroundImage}
        className="w-full h-[40%] lg:rotate-180 absolute lg:top-0 bottom-0 start-0 z-10 object-cover"
        alt="wave background"
      />
      <div className="w-full min-h-screen absolute inset-0 z-10 bg-black opacity-5"></div>

      {/* المحتوى الرئيسي */}
      <div className="c-container relative z-20 pt-12 md:pt-20 lg:pt-24">
        <div className="flex flex-col rtl:lg:flex-row-reverse ltr:lg:flex-row items-center justify-between gap-8 lg:gap-12 xl:gap-16 w-full min-h-[calc(100vh-5rem)] md:min-h-[calc(100vh-6rem)]">
          {/* المحتوى النصي */}
          <motion.div
            initial={{ opacity: 0, x: isRTL ? -50 : 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className={`w-full lg:w-1/2 ${isRTL ? "lg:order-2" : "lg:order-1"}`}
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className={`inline-flex items-center gap-2 px-4 py-2 bg-linear-to-r rtl:bg-linear-to-l from-blue-50 to-purple-50 rounded-full mb-4 md:mb-6 border border-blue-100`}
            >
              <span className="text-xs md:text-sm font-medium text-blue-700">
                ✨ {content.badge}
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-gray-800 leading-tight"
            >
              {content.title}
            </motion.h1>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6 md:mb-8 gradient-text"
            >
              {content.subtitle}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="text-base md:text-lg text-gray-600 mb-6 md:mb-8 leading-relaxed max-w-full lg:max-w-[90%]"
            >
              {content.description}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className={`flex flex-col sm:flex-row gap-3 sm:gap-4`}
            >
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => data?.video && setShowVideo(true)}
                className={`flex items-center justify-center gap-2 px-5 sm:px-6 py-3 hover:scale-105 hover:shadow-xl duration-300 bg-linear-to-r rtl:bg-linear-to-l from-primary to-primary-red text-white rounded-full font-medium shadow-lg w-full sm:w-auto ${
                  !data?.video ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={!data?.video}
              >
                <FiPlayCircle className="text-lg sm:text-xl" />
                <span className="text-sm sm:text-base">{t("watchBtn")}</span>
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowOrderForm(true)}
                className="flex items-center justify-center gap-2 px-5 sm:px-6 py-3 bg-white hover:bg-primary hover:text-white duration-300 text-gray-800 rounded-full font-medium shadow-lg hover:shadow-xl transition-all border border-gray-200 w-full sm:w-auto"
              >
                <SiSnowflake className="text-lg sm:text-xl" />
                <span className="text-sm sm:text-base">{t("orderNow")}</span>
              </motion.button>
            </motion.div>
          </motion.div>

          {/* الصورة */}
          <motion.div
            initial={{ opacity: 0, x: isRTL ? 50 : -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className={`w-full lg:w-1/2 flex justify-center ${
              isRTL ? "lg:order-1" : "lg:order-2"
            }`}
          >
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Img
                src={heroImage}
                className="w-full max-w-[350px] sm:max-w-[450px] md:max-w-[500px] lg:max-w-full lg:w-[550px] xl:w-[600px]"
                alt={"hero image"}
                priority
              />
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Popups */}
      <AnimatePresence>
        {/* Video Popup */}
        {showVideo && data?.video && (
          <VideoModal video={data.video} onClose={() => setShowVideo(false)} />
        )}

        {/* Order Form Popup */}
        {showOrderForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-9999 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={() => setShowOrderForm(false)}
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="relative w-full max-w-6xl bg-white rounded-3xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 z-10 flex items-center justify-between p-6 bg-white border-b border-gray-100">
                <h3 className="text-xl font-bold text-gray-900">
                  {content.title} - {t("orderNow")}
                </h3>
                <button
                  onClick={() => setShowOrderForm(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <FiX size={24} />
                </button>
              </div>

              <div className="p-6">
                {data?.form ? (
                  <DynamicServiceForm
                    initialForm={data.form}
                    serviceSlug={data.serviceSlug || ""}
                    service={data}
                    price={data.price}
                    price_before_discount={data.price_before_discount}
                    onSuccess={() => setShowOrderForm(false)}
                  />
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <p>No service configuration found.</p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
