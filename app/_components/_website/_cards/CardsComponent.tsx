"use client";
import React, { useEffect, useState } from "react";
import { Card } from "../../_dashboard/_cards/types";
import { MembershipCard } from "../_global/_memberShipCard-v2/membership-card";
import CategoriesButtons from "./CategoriesButtons";
import { category } from "@/app/types/_dashboard/GlobalTypes";
import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { instance } from "@/app/_helpers/axios";
import { useSearchParams } from "next/navigation";
import { directionMap } from "@/app/constants/_website/global";
import { VscLoading } from "react-icons/vsc";
import { FaCreditCard, FaUsers, FaStar } from "react-icons/fa";

type pagination = {
  current_page: number;
  last_page: number;
};

interface props {
  response: {
    data: Card[];
    pagination: {
      current_page: number;
      last_page: number;
    };
  };
  categories: category[];
}

const AnimatedGradientOrb = ({
  delay = 0,
  color = "primary",
  className,
}: {
  delay?: number;
  color?: "primary" | "blue" | "purple";
  className?: string;
}) => {
  const colorClasses = {
    primary: "bg-linear-to-br from-primary/20 via-primary/10 to-transparent",
    blue: "bg-linear-to-br from-blue-400/15 via-blue-500/10 to-transparent",
    purple:
      "bg-linear-to-br from-purple-400/15 via-purple-500/10 to-transparent",
  };

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay, duration: 1.2, ease: "backOut" }}
      className={`absolute rounded-full ${colorClasses[color]} filter blur-3xl ${className}`}
    />
  );
};

export default function CardsComponent({ response, categories }: props) {
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("category_id");

  const t = useTranslations("cardsPage");
  const locale = useLocale();
  const isRTL = locale === "ar";

  const [cards, setCards] = useState<Card[]>([]);
  const [pagination, setPagination] = useState<pagination | null>(null);
  const [loading, setLoading] = useState(false);

  const handleShowMore = async (newPage: number) => {
    const api = categoryId
      ? `/public-cards?page=${newPage}&category_id=${categoryId}`
      : `/public-cards?page=${newPage}`;
    try {
      setLoading(true);
      const response = await instance.get(api);
      if (response.status == 200) {
        const data = response.data.data;
        const pagination = response.data.pagination;
        setCards((prev) => [...prev, ...data]);
        setPagination(pagination);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (response.data) setCards(response.data);
    if (response.pagination) setPagination(response.pagination);
  }, [response]);

  return (
    <div
      dir={directionMap[locale]}
      className="w-full min-h-screen bg-gray-50 pb-20"
    >
      {/* Hero Section */}
      <section className="relative min-h-[40vh] w-full bg-linear-to-b from-white via-gray-50/30 to-white overflow-hidden mb-12">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <AnimatedGradientOrb
            delay={0.2}
            color="primary"
            className="top-1/4 -left-[10%] w-[60vh] h-[60vh]"
          />
          <AnimatedGradientOrb
            delay={0.4}
            color="blue"
            className="top-1/2 -right-[5%] w-[50vh] h-[50vh]"
          />

          {/* Grid Pattern */}
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `linear-gradient(to right, #8882 1px, transparent 1px), linear-gradient(to bottom, #8882 1px, transparent 1px)`,
              backgroundSize: "50px 50px",
              transform: isRTL ? "scaleX(-1)" : "none",
            }}
          />
        </div>

        {/* Main Content */}
        <div className="container relative z-10 mx-auto px-4 h-full flex items-center ">
          <div className="max-w-4xl mx-auto w-full text-center">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full bg-linear-to-r from-primary/10 to-primary/5 border border-primary/20 backdrop-blur-sm mx-auto"
            >
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-primary font-semibold text-sm tracking-wide">
                {t("headerTitle")}
              </span>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight"
            >
              <span className="relative inline-block">
                {t("hero.title")}
                <motion.span
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ delay: 0.8, duration: 0.8, ease: "easeInOut" }}
                  className="absolute bottom-2 left-0 h-3 bg-primary/20 -z-10 rounded-lg"
                />
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-lg md:text-xl lg:text-2xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed"
            >
              {t("hero.subtitle")}
            </motion.p>
          </div>
        </div>

        {/* Bottom Gradient Fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-gray-50 via-gray-50/90 to-transparent pointer-events-none" />
      </section>

      {/* Categories */}
      <div className="px-4 mb-12">
        <CategoriesButtons categories={categories} />
      </div>

      {/* Cards Grid */}
      <div className="px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {cards.length > 0 ? (
            cards.map((card, index) => (
              <motion.div
                key={`${card.id}-${index}-card`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="h-full"
              >
                <MembershipCard data={card} />
              </motion.div>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <FaCreditCard className="text-4xl text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {t("noCards")}
              </h3>
              <p className="text-gray-500 max-w-md mx-auto">
                {t("hero.subtitle")}
              </p>
            </div>
          )}
        </div>

        {/* Load More Button */}
        {pagination && pagination.current_page < pagination.last_page && (
          <div className="mt-16 flex justify-center">
            <motion.button
              disabled={loading}
              onClick={() => handleShowMore(pagination.current_page + 1)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-full font-semibold shadow-lg hover:shadow-primary/30 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300"
            >
              {loading ? (
                <>
                  <VscLoading className="animate-spin text-xl" />
                  <span>{t("loading")}</span>
                </>
              ) : (
                <span>{t("showMore")}</span>
              )}
            </motion.button>
          </div>
        )}
      </div>
    </div>
  );
}
