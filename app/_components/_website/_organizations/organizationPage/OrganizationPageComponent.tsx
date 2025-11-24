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
import {
  LocationType,
  Organization,
} from "@/app/_components/_dashboard/_organizations/types/organization";
import { directionMap } from "@/app/constants/_website/global";
import Img from "../../_global/Img";
import dynamic from "next/dynamic";
import ContactInfo from "./ContactInfo";
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
import OffersSidebar from "./offersSidebar/OffersSidebar";
import CTASection from "./CTASection";
import { GiPriceTag } from "react-icons/gi";
import OffersSlider from "./offersSidebar/OffersSlider";

const MapComponentWithRoute = dynamic(
  () => import("@/app/_components/_maps/MapComponentWithRoute"),
  { ssr: false }
);

interface CenterDetailsProps {
  organization: Organization;
  offers: Offer[];
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

export default function CenterDetails({
  organization,
  offers,
}: CenterDetailsProps) {
  const { user } = useAppSelector((state) => state.user);

  const router = useRouter();

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

  const errorStartConversation =
    locale == "en"
      ? "You can't start a conversation with yourself!"
      : "لا تستطيع بدء محادثة مع نفسك !";

  const [loadingConversation, setLoadingConversation] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [checkCurrentUser, setCheckCurrentUser] = useState(false);
  const [location, setLocation] = useState<LocationType | null>(null);

  const handleStartConversation = async () => {
    if (!user) {
      setCheckCurrentUser(true);
      return;
    }

    if (
      user?.id == organization?.id &&
      user?.account_type === organization.account_type
    ) {
      toast.error(errorStartConversation);
      return;
    }

    setLoadingConversation(true);
    try {
      const participant_one_id = user?.id;
      const participant_one_type = user?.account_type;
      const participant_two_id = organization?.id;
      const participant_two_type = "organization";
      const data = {
        participant_one_id,
        participant_one_type,
        participant_two_id,
        participant_two_type,
      };
      const response = await instance.post(`/start-conversation`, data);
      if (response.status == 201) {
        const conversation = response.data.data;

        // تغيير المسار
        router.push(
          `/${locale}/conversations/${formatTitle(
            `conversationwith ${organization.title}`
          )}?conversationId=${conversation.id}&userId=${user?.id}&userType=${
            user?.account_type
          }&receiverId=${organization?.id}&receiverType=${
            organization.account_type
          }`
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

  useEffect(() => {
    if (user?.location) {
      setLocation(user.location);
    }
  }, [user]);

  return (
    <div
      dir={directionMap[locale]}
      className="min-h-screen mt-24 mb-8 bg-background"
    >
      <div className="xl:w-[90%] w-[98%] mx-auto pt-4">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 lg:gap-3">
          {/* Left Section - Main Content */}
          <motion.div
            className="xl:col-span-3 xl:border xl:border-gray-300 xl:rounded-t-2xl xl:shadow-md p-2 relative"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            {/* Hero */}
            <motion.div
              className="h-64 sm:h-80 absolute top-0 left-0 w-full rounded-t-2xl overflow-hidden mb-8 lg:mb-10"
              variants={fadeInUp}
            >
              <Img
                src={organization.image ?? "/defaults/noImage.png"}
                errorSrc="/defaults/noImage.png"
                alt={organization.title}
                className="object-cover w-full h-full"
              />
              <div className="absolute inset-0 bg-black/30" />
            </motion.div>
            <div className="sm:h-80 h-64 w-full"></div>

            {/* logo + Title + Category + Stats */}
            <motion.div
              className="pb-6 lg:pb-8 border-b border-gray-200 space-y-4"
              variants={fadeInUp}
            >
              <div className="flex items-center max-md:flex-col max-md:items-start gap-2">
                <Img
                  src={organization.logo ?? "/logo.png"}
                  errorSrc="/logo.png"
                  alt={`${organization.title} logo`}
                  className="w-20 rounded-full lg:w-16 lg:h-16 object-cover p-1 lg:p-2"
                />
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
                    {organization.title}
                  </h1>
                  <span
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-white text-sm font-medium w-fit"
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
              </div>

              <div className="flex flex-wrap items-center gap-4 lg:gap-6 text-muted-foreground text-sm">
                <div className="flex items-center bg-primary/20 px-3 py-1 rounded-full text-primary gap-1">
                  <FaStar className="w-4 h-4 text-primary" />
                  <span className="font-medium">{organization.rating}</span>
                </div>
                {organization.confirmation_status && (
                  <div className="flex items-center gap-1">
                    <GiPriceTag className="text-green-400" />
                    <span>${organization.confirmation_price}</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <FaCalendarAlt className="w-4 h-4" />
                  <span>
                    {organization.number_of_reservations} {t("reservations")}
                  </span>
                </div>
              </div>
              <CTASection
                loadingConversation={loadingConversation}
                organization={organization}
                handleStartConversation={handleStartConversation}
                handleBook={handleBook}
              />
            </motion.div>

            {/* Description */}
            <motion.div
              className="py-6 lg:py-8 border-b border-gray-200 space-y-3"
              variants={fadeInUp}
            >
              <h2 className="text-xl font-semibold">{t("description")}</h2>
              <p className="text-muted-foreground leading-relaxed text-sm lg:text-base">
                {organization.description}
              </p>
            </motion.div>

            {/* Contact Info */}
            <ContactInfo organization={organization} t={t} />

            {/* location on map  */}
            <MapComponentWithRoute
              orgLocation={organization.location}
              userLocation={location?.coordinates ?? null}
            />

            {/* Working Hours */}
            <motion.div
              className="py-6 lg:py-8 border-b border-gray-200 space-y-3"
              variants={fadeInUp}
            >
              <h2 className="text-xl font-semibold">{t("workingHours")}</h2>
              <div className="flex items-center gap-3 text-muted-foreground">
                <FaClock className="w-5 h-5 text-primary" />
                <span className="text-sm lg:text-base">
                  {t("openAt")} {formatTime(organization.open_at, locale)} –{" "}
                  {t("closeAt")} {formatTime(organization.close_at, locale)}
                </span>
              </div>
            </motion.div>

            {/* Benefits */}
            {organization.benefits && organization.benefits.length > 0 && (
              <motion.div
                className="py-6 lg:py-8 border-b border-gray-200 space-y-4"
                variants={fadeInUp}
              >
                <h2 className="text-xl font-semibold">{t("benefits")}</h2>
                <ul className="space-y-3">
                  {organization.benefits.map((benefit) => (
                    <li key={benefit.id} className="flex items-start gap-3">
                      <FaCheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground text-sm lg:text-base">
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
              <motion.div className="py-6 lg:py-8" variants={fadeInUp}>
                <h2 className="text-xl font-semibold">{t("keywords")}</h2>
                <div className="flex flex-wrap gap-2 mt-3">
                  {organization.keywords.map((keyword) => (
                    <span
                      key={keyword.id}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-xs lg:text-sm"
                    >
                      <FaTag className="w-3 h-3" />
                      {keyword.title}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
          <OffersSlider offers={offers} />
          <OffersSidebar offers={offers} />
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
