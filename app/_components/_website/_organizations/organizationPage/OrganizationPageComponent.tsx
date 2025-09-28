"use client";
import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import {
  FaClock,
  FaStar,
  FaCalendarAlt,
  FaCheckCircle,
  FaUtensils,
  FaTag,
} from "react-icons/fa";
import { Organization } from "@/app/_components/_dashboard/_organizations/types/organization";
import { directionMap } from "@/app/constants/_website/global";
import Img from "../../_global/Img";
import dynamic from "next/dynamic";
import ContactInfo from "./ContactInfo";
import OrganizationSidebar from "./OrganizationSidebar";
import RatingSection from "./RatingSection";

const MapComponentWithRoute = dynamic(
  () => import("@/app/_components/_maps/MapComponentWithRoute"),
  { ssr: false }
);

interface CenterDetailsProps {
  organization: Organization;
}

export const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

export default function CenterDetails({ organization }: CenterDetailsProps) {
  const t = useTranslations("organization");
  const locale = useLocale();

  const formatTime = (time: string, locale: string) => {
    if (!time) return "";

    // split "HH:mm:ss"
    const [hours, minutes] = time.split(":").map(Number);

    const date = new Date();
    date.setHours(hours, minutes);

    return new Intl.DateTimeFormat(locale, {
      hour: "numeric",
      minute: "2-digit",
      hour12: true, // استخدم false لو حابب عرض 24 ساعة
    }).format(date);
  };

  const userLocation = {
    address: "Giza Pyramids, Giza",
    coordinates: { lat: 29.9792, lang: 31.1342 },
  };

  return (
    <div
      dir={directionMap[locale]}
      className="min-h-screen mt-24 bg-background"
    >
      <div className="c-container">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-10">
          {/* Left Section - Main Content */}
          <motion.div
            className="xl:col-span-3 max-xl:order-2"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            {/* Hero */}
            <motion.div
              className="relative h-64 sm:h-80 rounded-2xl overflow-hidden mb-10"
              variants={fadeInUp}
            >
              <Img
                src={organization.image ?? "/defaults/noImage.png"}
                errorSrc="/defaults/noImage.png"
                alt={organization.title}
                className="object-cover w-full h-full"
              />
              <div className="absolute inset-0 bg-black/30" />
              <div className="absolute bottom-4 left-4">
                <div className="w-20 h-20 rounded-full overflow-hidden border border-white shadow-lg bg-transparent">
                  <Img
                    src={organization.logo ?? "/logo.png"}
                    errorSrc="/logo.png"
                    alt={`${organization.title} logo`}
                    className="object-contain w-12 h-12  p-2"
                  />
                </div>
              </div>
            </motion.div>

            {/* Title + Category + Stats */}
            <motion.div
              className="pb-8 border-b border-gray-200 space-y-4"
              variants={fadeInUp}
            >
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
                  {organization.title}
                </h1>
                <span
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-white text-sm font-medium"
                  style={{
                    backgroundColor: `${organization.category.bg_color}30`,
                    color: organization.category.bg_color,
                  }}
                >
                  <FaUtensils className="w-4 h-4" />
                  {locale == "en"
                    ? organization.category.title_en
                    : organization.category.title_ar}
                </span>
              </div>

              <div className="flex items-center gap-6 text-muted-foreground text-sm">
                <div className="flex items-center bg-primary/20 px-3 rounded-full text-primary gap-1">
                  <FaStar className="w-4 h-4 text-primary" />
                  <span className="font-medium">{organization.rating}</span>
                </div>
                <div className="flex items-center gap-1">
                  <FaCalendarAlt className="w-4 h-4" />
                  <span>
                    {organization.number_of_reservations} {t("reservations")}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Description */}
            <motion.div
              className="py-8 border-b border-gray-200 space-y-3"
              variants={fadeInUp}
            >
              <h2 className="text-xl font-semibold">{t("description")}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {organization.description}
              </p>
            </motion.div>

            {/* Contact Info */}
            <ContactInfo organization={organization} t={t} />

            {/* location on map  */}
            <MapComponentWithRoute
              orgLocation={organization.location}
              userLocation={userLocation.coordinates}
            />

            {/* Working Hours */}
            <motion.div
              className="py-8 border-b border-gray-200 space-y-3"
              variants={fadeInUp}
            >
              <h2 className="text-xl font-semibold">{t("workingHours")}</h2>
              <div className="flex items-center gap-3 text-muted-foreground">
                <FaClock className="w-5 h-5 text-primary" />

                <span>
                  {t("openAt")} {formatTime(organization.open_at, locale)} –{" "}
                  {t("closeAt")} {formatTime(organization.close_at, locale)}
                </span>
              </div>
            </motion.div>

            {/* Benefits */}
            {organization.benefits && organization.benefits.length > 0 && (
              <motion.div
                className="py-8 border-b border-gray-200 space-y-4"
                variants={fadeInUp}
              >
                <h2 className="text-xl font-semibold">{t("benefits")}</h2>
                <ul className="space-y-3">
                  {organization.benefits.map((benefit) => (
                    <li key={benefit.id} className="flex items-start gap-3">
                      <FaCheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                      <span className="text-muted-foreground">
                        {benefit.title}
                      </span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            {/* rating section */}

            <RatingSection />

            {/* Keywords */}
            {organization.keywords && organization.keywords.length > 0 && (
              <motion.div className="py-8" variants={fadeInUp}>
                <h2 className="text-xl font-semibold">{t("keywords")}</h2>
                <div className="flex flex-wrap gap-2 mt-3">
                  {organization.keywords.map((keyword) => (
                    <span
                      key={keyword.id}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm"
                    >
                      <FaTag className="w-3 h-3" />
                      {keyword.title}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Right Section - Sidebar */}
          <OrganizationSidebar organization={organization} t={t} />
        </div>
      </div>
    </div>
  );
}
