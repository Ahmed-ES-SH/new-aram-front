"use client";

import { useLocale, useTranslations } from "next-intl";
import { Card } from "@/app/_components/_dashboard/_cards/types";
import { directionMap } from "@/app/constants/_website/global";
import { useEffect, useState } from "react";
import FreeCardPopup from "./FreeCardPopup";
import { getIconComponent } from "@/app/_helpers/helpers";
import { useAppDispatch, useAppSelector } from "@/app/Store/hooks";
import { toast } from "sonner";
import { addItemWithOne, isItemInCart } from "@/app/Store/cartSlice";

// Components
import HeroSection from "./HeroSection";
import BenefitsSection from "./BenefitsSection";
import KeywordsSection from "./KeywordsSection";
import ShareSection from "./ShareSection";
import PricingSidebar from "./PricingSidebar";

interface CardDetailsProps {
  card: Card;
}

export default function CardPageComponent({ card }: CardDetailsProps) {
  const GlobalisInCart = useAppSelector((state) =>
    isItemInCart(state, card.id)
  );
  const { activeCurrency } = useAppSelector((state) => state.currency);
  const dispatch = useAppDispatch();

  const locale = useLocale();
  const t = useTranslations("cardPage");

  const [couponPopup, setCouponPopup] = useState(false);
  const [isInCart, setIsInCart] = useState(false);

  const CategoryIcon = getIconComponent(card.category?.icon_name);

  const successMessage =
    locale === "en"
      ? "The card has been added to the cart successfully!"
      : "تم إضافة البطاقة الى السلة بنجاح !";

  const handleAddToCart = () => {
    dispatch(addItemWithOne(card));
    toast.success(successMessage);
    setIsInCart(true);
  };

  const savedPrice =
    Number.parseFloat(card.price_before_discount) -
    Number.parseFloat(card.price);

  const discountPercentage = Math.round(
    (savedPrice / Number.parseFloat(card.price_before_discount)) * 100
  );

  const handleShare = (platform: string) => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(card.title);

    let shareUrl = "";
    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
        break;
      case "whatsapp":
        shareUrl = `https://wa.me/?text=${text}%20${url}`;
        break;
    }

    window.open(shareUrl, "_blank", "noopener,noreferrer");
  };

  useEffect(() => {
    if (GlobalisInCart) {
      setIsInCart(GlobalisInCart);
    }
  }, [GlobalisInCart]);

  return (
    <div
      dir={directionMap[locale]}
      className="min-h-screen lg:mt-24 bg-linear-to-br from-slate-50 via-white to-blue-50"
    >
      {/* Hero Section */}
      <HeroSection card={card} locale={locale} CategoryIcon={CategoryIcon} />

      {/* Main Content */}
      <div className="c-container mx-auto px-4 mt-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Content */}
          <div className="lg:col-span-2 space-y-6">
            <BenefitsSection benefits={card.benefits} locale={locale} t={t} />
            <KeywordsSection keywords={card.keywords} locale={locale} t={t} />
            <ShareSection locale={locale} t={t} onShare={handleShare} />
          </div>

          {/* Right Sidebar */}
          <PricingSidebar
            card={card}
            locale={locale}
            t={t}
            activeCurrency={activeCurrency}
            discountPercentage={discountPercentage}
            savedPrice={savedPrice}
            isInCart={isInCart}
            onAddToCart={handleAddToCart}
            onCouponClick={() => setCouponPopup(true)}
          />
        </div>
      </div>

      {/* Coupon Popup */}
      <FreeCardPopup
        isOpen={couponPopup}
        onClose={() => setCouponPopup(false)}
      />
    </div>
  );
}
