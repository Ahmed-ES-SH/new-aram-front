"use client";

import { motion, AnimatePresence } from "framer-motion";
import { IoClose, IoStar } from "react-icons/io5";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { Offer } from "../../_dashboard/_offers/types";
import { getIconComponent } from "@/app/_helpers/helpers";
import { useState } from "react";
import { FaCheck, FaCopy } from "react-icons/fa";

interface OfferPopupProps {
  offer: Offer | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function OfferPopup({
  offer,
  isOpen,
  onClose,
}: OfferPopupProps) {
  const locale = useLocale();
  const t = useTranslations("offerPopup");

  const [copied, setCopied] = useState(false);

  if (!offer) return null;

  const isExpired = offer.status === "expired";
  const usageText = offer.usage_limit
    ? `2/${offer.usage_limit}`
    : t("unlimited");

  const CategoryIcon = offer && getIconComponent(offer.category.icon_name);

  // Function to copy code
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(offer.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // reset after 2s
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[99]"
          />

          {/* Popup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="fixed inset-0 z-[99] flex items-center justify-center  p-4"
          >
            <div className="bg-background rounded-2xl shadow-2xl md:w-[90vw] w-full h-[90vh] max-w-7xl max-h-[900px] overflow-hidden relative">
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute text-red-400 top-6 right-6 z-10 p-2 rounded-full bg-red-200/30 hover:text-white hover:bg-red-300/80 transition-colors"
              >
                <IoClose className="w-6 h-6 " />
              </button>

              <div className="flex h-full max-md:flex-col-reverse max-md:w-full overflow-y-auto">
                {/* Left Section */}
                <div className="flex-1 p-8 lg:overflow-y-auto">
                  {/* Category Badge */}
                  <div
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6"
                    style={{ backgroundColor: offer.category.bg_color }}
                  >
                    <span className="text-lg">
                      <CategoryIcon />
                    </span>
                    <span className="text-white">
                      {locale == "en"
                        ? offer.category.title_en
                        : offer.category.title_ar}
                    </span>
                  </div>

                  {/* Offer Section */}
                  <div className="mb-8">
                    <div className="relative w-full h-64 mb-6 rounded-xl overflow-hidden">
                      <Image
                        src={offer.image || "/placeholder.svg"}
                        alt={offer.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <h1 className="text-3xl font-bold text-foreground mb-4">
                      {offer.title}
                    </h1>
                    <p className="text-muted-foreground text-lg leading-relaxed">
                      {offer.description}
                    </p>
                  </div>

                  {/* Organization Section */}
                  <div className="border-t border-border pt-8">
                    <div className="flex items-start gap-6">
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                        <Image
                          src={offer.organization.image || "/placeholder.svg"}
                          alt={offer.organization.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h2 className="text-xl font-semibold text-foreground mb-2">
                          {offer.organization.title}
                        </h2>
                        <p className="text-muted-foreground mb-3 leading-relaxed">
                          {offer.organization.description}
                        </p>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <IoStar
                                key={i}
                                className={`w-4 h-4 ${
                                  i <
                                  Math.floor(Number(offer.organization.rating))
                                    ? "text-yellow-400"
                                    : "text-muted"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {offer.organization.rating} {t("rating")}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Section - Sticky */}
                <div className="md:w-96 w-full bg-muted/30 border-l border-border">
                  <div className="sticky top-0 p-8 h-full overflow-y-auto">
                    {/* Discount Code */}
                    {/* Discount Code */}
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold text-foreground mb-4">
                        {t("discountCode")}
                      </h3>
                      <div className="bg-primary/10 border-2 border-primary/20 rounded-xl p-6 text-center relative">
                        <div className="font-mono text-2xl font-bold text-primary tracking-wider">
                          {offer.code}
                        </div>
                        {/* Copy Button */}
                        <button
                          onClick={handleCopy}
                          className="absolute top-2 right-2 text-primary hover:text-primary/70 transition"
                          title={copied ? "Copied!" : "Copy"}
                        >
                          {copied ? (
                            <FaCheck size={18} />
                          ) : (
                            <FaCopy size={18} />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Offer Details */}
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-6">
                        {t("offerDetails")}
                      </h3>

                      <div className="space-y-4">
                        {/* Start Date */}
                        <div className="flex justify-between items-center py-3 border-b border-border">
                          <span className="text-muted-foreground">
                            {t("startDate")}
                          </span>
                          <span className="font-medium text-foreground">
                            {new Date(offer.start_date).toLocaleDateString()}
                          </span>
                        </div>

                        {/* End Date */}
                        <div className="flex justify-between items-center py-3 border-b border-border">
                          <span className="text-muted-foreground">
                            {t("endDate")}
                          </span>
                          <span className="font-medium text-foreground">
                            {new Date(offer.end_date).toLocaleDateString()}
                          </span>
                        </div>

                        {/* Usage Limit */}
                        <div className="flex justify-between items-center py-3 border-b border-border">
                          <span className="text-muted-foreground">
                            {t("usageLimit")}
                          </span>
                          <span className="font-medium text-foreground">
                            {usageText}
                          </span>
                        </div>

                        {/* Status */}
                        <div className="flex justify-between items-center py-3">
                          <span className="text-muted-foreground">
                            {t("status")}
                          </span>
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              isExpired
                                ? "bg-destructive/10 text-destructive"
                                : "bg-green-100 text-green-700"
                            }`}
                          >
                            {isExpired ? t("expired") : t("active")}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
