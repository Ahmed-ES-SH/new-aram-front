"use client";

import { motion } from "framer-motion";
import { FaClock } from "react-icons/fa";
import { useLocale, useTranslations } from "next-intl";
import { Card } from "@/app/_components/_dashboard/_cards/types";
import Img from "../../_global/Img";
import { directionMap } from "@/app/constants/_website/global";
import MiniCreditCard from "../../_global/MiniCreditCard";
import { FaFacebook, FaTwitter, FaLinkedin, FaWhatsapp } from "react-icons/fa";
import { BiSolidOffer } from "react-icons/bi";
import { useEffect, useState } from "react";
import FreeCardPopup from "./FreeCardPopup";
import { getIconComponent } from "@/app/_helpers/helpers";
import { useAppDispatch, useAppSelector } from "@/app/Store/hooks";
import { toast } from "sonner";
import { addItemWithOne, isItemInCart } from "@/app/Store/cartSlice";
import AddToCartButton from "./AddToCartButton";

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  const [copunePopup, setCopunePopup] = useState(false);
  const [isIncart, setIsIncart] = useState(false);

  // Function to share current page
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

  const CategoryIcon = getIconComponent(card.category.icon_name);

  const successMessage =
    locale == "en"
      ? "The card has been added to the cart successfully!"
      : "تم إضافة البطاقة الى السلة بنجاح !";

  const handleAddToCart = () => {
    dispatch(addItemWithOne(card));
    toast.success(successMessage);
    setIsIncart(true);
  };

  const savedPrice =
    Number.parseFloat(card.price_before_discount) -
    Number.parseFloat(card.price);

  useEffect(() => {
    if (GlobalisInCart) {
      setIsIncart(GlobalisInCart);
    }
  }, [GlobalisInCart]);

  return (
    <div
      dir={directionMap[locale]}
      className="min-h-screen mt-20 bg-gray-50 py-8"
    >
      <div className="c-container mx-auto max-lg:p-1">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Section - Main Content */}
          <motion.div
            className="lg:col-span-2 space-y-8 max-lg:order-2"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Card Image and Title */}
            <motion.div
              className="bg-white rounded-lg shadow-md overflow-hidden"
              variants={itemVariants}
            >
              <div className="relative h-96 w-full">
                <Img
                  src={card.image ?? "/defaults/noImage.png"}
                  errorSrc="/defaults/noImage.png"
                  alt={card.title}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="p-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  {card.title}
                </h1>
                <p className="text-gray-600 text-lg leading-relaxed">
                  {card.description}
                </p>
              </div>
            </motion.div>

            {/* Category Badge */}
            <motion.div variants={itemVariants}>
              <div
                className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium"
                style={{
                  backgroundColor: `${card.category.bg_color}20`,
                  color: card.category.bg_color,
                }}
              >
                <CategoryIcon className="mr-2" />
                <span className="">
                  {card.category.title_en} / {card.category.title_ar}
                </span>
              </div>
            </motion.div>

            {/* Benefits */}
            <motion.div
              className="bg-white rounded-lg shadow-md p-6"
              variants={itemVariants}
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {t("benefits")}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {card.benefits.map((benefit, index) => (
                  <motion.div
                    key={benefit.id}
                    className="flex items-center p-3 bg-green-50 rounded-lg"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <span className="text-gray-700">{benefit.title}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Keywords */}
            <motion.div
              className="bg-white rounded-lg shadow-md p-6"
              variants={itemVariants}
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {t("keywords")}
              </h2>
              <div className="flex flex-wrap gap-2">
                {card.keywords.map((keyword, index) => (
                  <motion.span
                    key={keyword.id}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    {keyword.title}
                  </motion.span>
                ))}
              </div>
            </motion.div>

            {/* Social Share */}
            <motion.div
              className="bg-white rounded-lg shadow-md p-6"
              variants={itemVariants}
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {t("share")}
              </h2>
              <div className="flex gap-4">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-600 text-white"
                  onClick={() => handleShare("facebook")}
                >
                  <FaFacebook />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-sky-400 text-white"
                  onClick={() => handleShare("twitter")}
                >
                  <FaTwitter />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-700 text-white"
                  onClick={() => handleShare("linkedin")}
                >
                  <FaLinkedin />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-green-500 text-white"
                  onClick={() => handleShare("whatsapp")}
                >
                  <FaWhatsapp />
                </motion.button>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Section - Sticky Box */}
          <motion.div
            className="lg:col-span-1 max-lg:order-1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="sticky top-28">
              <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
                <MiniCreditCard card={card} />
                {/* Pricing */}
                <div className="my-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">
                      {t("originalPrice")}
                    </span>
                    <span className="text-lg text-gray-400 line-through">
                      {Number(
                        Number(activeCurrency?.exchange_rate) *
                          Number(card.price_before_discount)
                      ).toFixed(2)}{" "}
                      {activeCurrency?.symbol}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-600">
                      {t("currentPrice")}
                    </span>
                    <span className="text-3xl font-bold text-green-600">
                      {Number(
                        Number(activeCurrency?.exchange_rate) *
                          Number(card.price)
                      ).toFixed(2)}{" "}
                      {activeCurrency?.symbol}
                    </span>
                  </div>
                  <div className="bg-red-400 text-white lg:text-lg  px-6 py-1 rounded-full w-fit text-center">
                    {t("save")}{" "}
                    {Number(
                      Number(activeCurrency?.exchange_rate) * Number(savedPrice)
                    ).toFixed(2)}{" "}
                    {activeCurrency?.symbol}
                  </div>
                </div>

                {/* Duration */}
                <div className="mb-6">
                  <div className="flex items-center text-gray-700">
                    <FaClock className="mr-2 text-blue-500" />
                    <span className="font-medium">{t("duration")}:</span>
                    <span className="ml-2">{card.duration}</span>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <AddToCartButton
                  isInCart={isIncart}
                  handleAddToCart={handleAddToCart}
                />

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-primary hover:bg-orange-500 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center transition-colors duration-200 mt-3"
                  onClick={() => setCopunePopup(true)}
                >
                  <BiSolidOffer className="mr-2" />
                  <p>{locale == "en" ? "Have Copune ?" : "لديك كوبون ؟"}</p>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      <FreeCardPopup
        isOpen={copunePopup}
        onClose={() => setCopunePopup(false)}
      />
    </div>
  );
}
