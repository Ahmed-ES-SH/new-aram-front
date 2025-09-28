"use client";
import { motion } from "framer-motion";
import Img from "../_global/Img";
import { Offer } from "../../_dashboard/_offers/types";
import { formatTitle, getIconComponent } from "@/app/_helpers/helpers";
import { directionMap } from "@/app/constants/_website/global";
import { useLocale, useTranslations } from "next-intl";
import LocaleLink from "../_global/LocaleLink";
import { BiClipboard } from "react-icons/bi";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa";
import { BsEye } from "react-icons/bs";
import OfferPopup from "./OfferPopup";

interface OfferCardProps {
  offer: Offer;
  index: number;
}

export default function OfferCard({ offer, index }: OfferCardProps) {
  const locale = useLocale();
  const t = useTranslations("offerCard");

  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);

  const CategoryIcon = getIconComponent(offer.category.icon_name);
  const isActive = offer.status === "active";
  // const usagePercentage = (offer.number_of_uses / offer.usage_limit) * 100;

  // Format date to a more readable format
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(
      locale === "ar" ? "ar-EG" : "en-US",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
      }
    );
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success("تم نسخ الكود بنجاح");
  };

  useEffect(() => {
    if (copied) {
      setTimeout(() => {
        setCopied(false);
      }, 1000);
    }
  }, [copied]);

  return (
    <>
      <motion.div
        dir={directionMap[locale]}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.3 }}
        className="relative group bg-white rounded-2xl shadow-lg overflow-hidden w-full max-w-md mx-auto border border-gray-100"
      >
        {/* Discount Circle - Top Right Corner */}
        <div className="absolute top-4 ltr:left-4 rtl:right-4 z-20">
          <div className="w-[70px] h-[70px]  bg-primary rounded-full flex items-center justify-center shadow-lg border-2 border-white">
            <span className="text-white font-bold ">
              {offer.discount_type === "percentage"
                ? `${offer.discount_value}%`
                : `$${offer.discount_value}`}
            </span>
          </div>
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
            <svg
              className="w-3 h-3 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zm7-10a1 1 0 01.967.744L14.146 7.2 17 7.5a1 1 0 01.78 1.625l-3.1 4.4-1.15 4.2a1 1 0 01-1.941-.002l-1.15-4.2-3.1-4.4A1 1 0 017 7.5l2.845-.3L12 2.744A1 1 0 0112 2z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>

        {/* Status Badge */}
        <div className="absolute top-4 ltr:right-4 rtl:left-4 z-10">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              isActive
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {isActive ? t("active") : t("expired")}
          </span>
        </div>

        {/* Image Section */}
        <div className="relative h-48 overflow-hidden">
          <Img
            src={offer.image}
            alt={offer.title}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>

          {/* Category Icon */}
          <div className="absolute bottom-4 ltr:left-4 rtl:right-4 flex gap-2 items-center">
            <div
              className="p-3 rounded-full text-white shadow-lg"
              style={{ backgroundColor: `${offer.category.bg_color}70` }}
            >
              {CategoryIcon && <CategoryIcon size={20} />}
            </div>
            <span className="ml-2 text-white font-medium">
              {locale === "ar"
                ? offer.category.title_ar
                : offer.category.title_en}
            </span>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-5 pt-7 relative">
          {/* preview icon */}
          <div
            onClick={() => setOpen(true)}
            className="group-hover:right-4 duration-300 hover:bg-sky-500  hover:scale-110 cursor-pointer text-white shadow absolute top-4 right-4 md:-right-12 w-10 h-10 rounded-full border border-gray-200 bg-sky-300 flex items-center justify-center"
          >
            <BsEye className="" />
          </div>
          {/* Title and Organization */}
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            {offer.title}
          </h3>
          <div className="flex items-center justify-between max-sm:flex-col max-sm:items-start w-full gap-1 mb-3">
            <div className="flex items-center gap-1">
              <span className="text-sm text-gray-600">{t("from")}</span>
              <LocaleLink
                href={`/organizations/${formatTitle(
                  offer.organization.title
                )}?organizationId=${offer.organization.id}`}
                className="mr-1 text-sm hover:underline font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                {offer.organization.title}
              </LocaleLink>
            </div>
            <div className="flex items-center gap-1 max-sm:self-end px-2 rounded-full bg-primary text-white mr-2">
              <span className="">★</span>
              <span className="text-xs  mr-1">{offer.organization.rating}</span>
            </div>
          </div>
          {/* Description */}
          <p className="text-gray-600 mb-4 text-sm leading-relaxed">
            {offer.description.length > 80
              ? offer.description.slice(0, 80) + "..."
              : offer.description}
          </p>
          {/* Promo Code - Moved up since discount badge is now at top */}
          <div className="bg-gray-100 px-3 py-2 rounded-lg flex items-center gap-1 justify-center mb-4">
            <span className="text-sm text-gray-600 mr-2">{t("code")}:</span>
            <span className="font-mono font-bold text-primary">
              {offer.code}
            </span>
            <button
              className="ml-2 text-gray-500 hover:text-primary transition-colors"
              onClick={() => handleCopyCode(offer.code)}
              aria-label="Copy code"
            >
              {copied ? (
                <FaCheck className="text-green-400" />
              ) : (
                <BiClipboard />
              )}
            </button>
          </div>
          {/* Usage Limit */}
          <div className="mb-4">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>{t("usageLimit")}</span>
              <span>
                {offer.usage_limit} {t("timesUsed")}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-primary w-full h-2 rounded-full transition-all duration-500"></div>
            </div>
          </div>
          {/* Dates */}
          <div className="flex justify-between max-md:flex-col max-md:gap-4 text-xs text-gray-500 border-t border-gray-100 pt-3">
            <div className="text-red-400">
              <span className="font-medium">{t("endsAt")}:</span>
              <span> {formatDate(offer.end_date)}</span>
            </div>
            <div>
              <span className="font-medium">{t("startsFrom")}:</span>
              <span> {formatDate(offer.start_date)}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* offer popup */}
      <OfferPopup isOpen={open} onClose={() => setOpen(false)} offer={offer} />
    </>
  );
}
