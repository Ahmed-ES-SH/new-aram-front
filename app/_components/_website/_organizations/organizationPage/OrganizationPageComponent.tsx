"use client";

import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import {
  FaClock,
  FaStar,
  FaCalendarAlt,
  FaCheckCircle,
  FaTag,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaGlobe,
} from "react-icons/fa";
import {
  LocationType,
  Organization,
} from "@/app/_components/_dashboard/_organizations/types/organization";
import { directionMap } from "@/app/constants/_website/global";
import Img from "../../_global/Img";
import dynamic from "next/dynamic";
import RatingSection from "./RatingSection";
import { useEffect, useState } from "react";
import { useAppSelector } from "@/app/Store/hooks";
import { toast } from "sonner";
import { instance } from "@/app/_helpers/axios";
import { useRouter } from "next/navigation";
import { formatTitle } from "@/app/_helpers/helpers";
import CheckCurrentUserPopup from "../../_global/CheckCurrentUserPopup";
import SelectTimePopup from "@/app/_components/_popups/_bookAppointment/SelectTimePopup";
import { Offer } from "@/app/_components/_dashboard/_offers/types";
import CTASection from "./CTASection";
import { GiPriceTag } from "react-icons/gi";
import OffersSidebar from "./offersSidebar/OffersSidebar";

const MapComponentWithRoute = dynamic(
  () => import("@/app/_components/_maps/MapComponentWithRoute"),
  { ssr: false }
);

interface CenterDetailsProps {
  organization: Organization;
  offers: Offer[];
}

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function CenterDetails({
  organization,
  offers,
}: CenterDetailsProps) {
  const { activeCurrency } = useAppSelector((state) => state.currency);
  const { user } = useAppSelector((state) => state.user);
  const router = useRouter();
  const t = useTranslations("organization");
  const locale = useLocale();

  const [loadingConversation, setLoadingConversation] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [checkCurrentUser, setCheckCurrentUser] = useState(false);
  const [location, setLocation] = useState<LocationType | null>(null);

  useEffect(() => {
    if (user?.location) {
      setLocation(user.location);
    }
  }, [user]);

  const formatTime = (time: string, locale: string) => {
    if (!time) return "";
    const [hours, minutes] = time.split(":").map(Number);
    const date = new Date();
    date.setHours(hours, minutes);
    return new Intl.DateTimeFormat(locale, {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(date);
  };

  const handleStartConversation = async () => {
    if (!user) {
      setCheckCurrentUser(true);
      return;
    }
    if (
      user?.id == organization?.id &&
      user?.account_type === organization.account_type
    ) {
      toast.error(
        locale == "en"
          ? "You can't start a conversation with yourself!"
          : "لا تستطيع بدء محادثة مع نفسك !"
      );
      return;
    }

    setLoadingConversation(true);
    try {
      const data = {
        participant_one_id: user?.id,
        participant_one_type: user?.account_type,
        participant_two_id: organization?.id,
        participant_two_type: "organization",
      };
      const response = await instance.post(`/start-conversation`, data);
      if (response.status == 201) {
        const conversation = response.data.data;
        router.push(
          `/${locale}/conversations/${formatTitle(
            `conversationwith ${organization.title}`
          )}?conversationId=${conversation.id}&userId=${user?.id}&userType=${
            user?.account_type
          }&receiverId=${organization?.id}&receiverType=organization`
        );
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingConversation(false);
    }
  };

  const handleBook = () => {
    if (!user) {
      setCheckCurrentUser(true);
      return;
    }
    setShowPopup(true);
  };

  return (
    <div
      dir={directionMap[locale]}
      className="min-h-screen mt-20 bg-gray-50/50 pb-16"
    >
      {/* 1. Hero Section */}
      <div className="relative h-[300px] lg:h-[420px] w-full overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent z-10" />
        <Img
          src={organization.image ?? "/defaults/noImage.png"}
          errorSrc="/defaults/noImage.png"
          alt={organization.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-4 left-0 w-full z-20 px-4 pb-8 c-container">
          <div className="flex flex-col md:flex-row items-end gap-6">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="w-16 h-16 lg:w-20 lg:h-20 rounded-2xl bg-white p-1 shadow-2xl shrink-0"
            >
              <Img
                src={organization.logo ?? "/logo.png"}
                errorSrc="/logo.png"
                alt={`${organization.title} logo`}
                className="w-full h-full object-cover rounded-xl"
              />
            </motion.div>
            <div className="flex-1 text-white pb-2">
              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-3xl lg:text-5xl font-bold mb-2 shadow-black/10 drop-shadow-md"
              >
                {organization.title}
              </motion.h1>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="flex flex-wrap items-center gap-4 text-sm font-medium text-white/90"
              >
                {organization.category && (
                  <span className="bg-primary/90 text-white px-3 py-1 rounded-full backdrop-blur-md shadow-sm">
                    {locale === "en"
                      ? organization.category.title_en
                      : organization.category.title_ar}
                  </span>
                )}
                <div className="flex items-center gap-1">
                  <FaStar className="text-yellow-400" />
                  <span>{organization.rating}</span>
                </div>
                <div className="flex items-center gap-1">
                  <FaCalendarAlt />
                  <span>
                    {organization.number_of_reservations} {t("reservations")}
                  </span>
                </div>
                {organization &&
                  organization.confirmation_price &&
                  activeCurrency && (
                    <div className="flex items-center gap-1 text-green-400">
                      <GiPriceTag />
                      <div className="flex items-center gap-1">
                        <span>{activeCurrency?.symbol}</span>
                        <span>
                          {(
                            Number(organization.confirmation_price) *
                            Number(activeCurrency.exchange_rate)
                          ).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  )}
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-8 relative z-30">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content */}
          <motion.div
            variants={stagger}
            initial="initial"
            animate="animate"
            className="lg:col-span-8 space-y-8"
          >
            {/* About Section */}
            <motion.div
              variants={fadeInUp}
              className="bg-white rounded-3xl p-6 lg:p-8 shadow-sm border border-gray-100"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="w-1.5 h-8 bg-primary rounded-full block" />
                {locale === "en" ? "Description" : "الوصف"}
              </h2>
              <p className="text-gray-600 leading-relaxed text-lg">
                {organization.description}
              </p>

              {/* Benefits Grid */}
              {organization.benefits && organization.benefits.length > 0 && (
                <div className="mt-8 pt-8 border-t border-gray-100">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">
                    {t("benefits")}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {organization.benefits.map((benefit) => (
                      <div
                        key={benefit.id}
                        className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100"
                      >
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                          <FaCheckCircle />
                        </div>
                        <span className="text-gray-700 font-medium text-sm">
                          {benefit.title}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Keywords */}
              {organization.keywords && organization.keywords.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-2">
                  {organization.keywords.map((keyword) => (
                    <span
                      key={keyword.id}
                      className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-medium flex items-center gap-1"
                    >
                      <FaTag className="text-gray-400" />
                      {keyword.title}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Map Section */}
            <motion.div
              variants={fadeInUp}
              className="bg-white rounded-3xl p-2 shadow-sm border border-gray-100 overflow-hidden"
            >
              <div className="p-4 pb-2">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <FaMapMarkerAlt className="text-primary" />
                  {locale === "en" ? "Location" : "الموقع"}
                </h2>
              </div>
              <div className="rounded-2xl overflow-hidden h-[400px] relative z-0">
                <MapComponentWithRoute
                  orgLocation={organization.location}
                  userLocation={location?.coordinates ?? null}
                />
              </div>
            </motion.div>

            {/* Ratings (Preserved) */}
            <motion.div variants={fadeInUp}>
              <RatingSection />
            </motion.div>
          </motion.div>

          {/* Sidebar */}
          <div className="lg:col-span-4  space-y-6  ">
            {/* CTA Card (Sticky Mobile Navigation usually handles this, but good to have here too) */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-white z-999999 rounded-3xl p-6 shadow-lg border-t-4 border-primary"
            >
              <div className="space-y-4">
                <CTASection
                  loadingConversation={loadingConversation}
                  organization={organization}
                  handleStartConversation={handleStartConversation}
                  handleBook={handleBook}
                />
              </div>

              {/* Working Hours */}
              <div className="mt-8 pt-6 border-t border-gray-100">
                <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FaClock className="text-primary" /> {t("workingHours")}
                </h4>
                <div className="bg-gray-50 rounded-xl p-4 flex justify-between items-center text-sm font-medium">
                  <div className="flex flex-col gap-1">
                    <span className="text-gray-500">{t("openAt")}</span>
                    <span className="text-gray-900 text-lg">
                      {formatTime(organization.open_at, locale)}
                    </span>
                  </div>
                  <div className="w-px h-8 bg-gray-200" />
                  <div className="flex flex-col gap-1 text-left" dir="ltr">
                    <span className="text-gray-500 text-right">
                      {t("closeAt")}
                    </span>
                    <span className="text-gray-900 text-lg">
                      {formatTime(organization.close_at, locale)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Contact Info Compact */}
              <div className="mt-8 pt-6 border-t border-gray-100 space-y-4">
                <h4 className="font-semibold text-gray-800 mb-2">
                  {t("contactInfo")}
                </h4>
                {organization?.location?.address && (
                  <div className="flex items-start gap-3 text-sm text-gray-600">
                    <FaMapMarkerAlt className="text-primary mt-1 shrink-0" />
                    <span>{organization.location.address}</span>
                  </div>
                )}
                {organization?.phone_number && (
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <FaPhone className="text-primary shrink-0" />
                    <span dir="ltr">{organization.phone_number}</span>
                  </div>
                )}
                {organization?.email && (
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <FaEnvelope className="text-primary shrink-0" />
                    <span>{organization.email}</span>
                  </div>
                )}
                {organization?.url && (
                  <a
                    href={organization.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 text-sm text-blue-600 hover:underline"
                  >
                    <FaGlobe className="shrink-0" />
                    <span>{t("website")}</span>
                  </a>
                )}
              </div>
            </motion.div>

            {/* Sidebar Offers */}
            {offers && offers.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <div className="bg-primary text-white p-4 rounded-t-3xl mt-8">
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    <GiPriceTag /> {locale == "ar" ? "العروض" : "Offers"}
                  </h3>
                </div>
                <div className="bg-white rounded-b-3xl p-4 shadow-sm border border-gray-100 border-t-0 space-y-4">
                  <OffersSidebar offers={offers} />
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      <CheckCurrentUserPopup
        isOpen={checkCurrentUser}
        onClose={() => setCheckCurrentUser(false)}
      />

      <SelectTimePopup
        organizationTitle={organization.title}
        organizationId={organization.id}
        isOpen={showPopup}
        onClose={() => setShowPopup(false)}
      />
    </div>
  );
}
