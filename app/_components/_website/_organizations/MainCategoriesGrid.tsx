"use client";
import { category } from "@/app/types/_dashboard/GlobalTypes";
import React, { useEffect, useState } from "react";
import CategoryOrgCard from "./CategoryOrgCard";
import { instance } from "@/app/_helpers/axios";
import { VscLoading } from "react-icons/vsc";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { formatTitle } from "@/app/_helpers/helpers";
import { useLocale, useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { FaLayerGroup, FaTags, FaFolderOpen, FaChartPie } from "react-icons/fa";

type paginationType = {
  current_page: number;
  last_page: number;
};

interface props {
  response: {
    data: category[];
    pagination: {
      current_page: number;
      last_page: number;
    };
  };
}

const FloatingIcon = ({
  Icon,
  delay,
  className,
}: {
  Icon: React.ElementType;
  delay: number;
  className?: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.6, ease: "easeOut" }}
    className={`absolute text-primary/10 ${className}`}
  >
    <Icon className="w-8 h-8 md:w-12 md:h-12" />
  </motion.div>
);

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

export default function MainCategoriesGrid({ response }: props) {
  const locale = useLocale();
  const t = useTranslations("organizationPage");
  const router = useRouter();

  const isRTL = locale === "ar";

  const [categories, setCategories] = useState<category[]>([]);
  const [pagination, setPagination] = useState<paginationType | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLoadMore = async () => {
    if (!pagination || loading) return;
    const newPage = pagination.current_page + 1;

    try {
      setLoading(true);
      const response = await instance.get(`/public-categories?page=${newPage}`);
      if (response.status == 200) {
        const data = response.data.data;
        setCategories((prev) => [...prev, ...data]);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong while loading categories");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCategory = (cat: category) => {
    router.push(
      `/organizations?categories=${cat.id}&main_category=${formatTitle(
        cat.title_en
      )}&main_categoryId=${cat.id}&subCategoriesLength=${
        cat.sub_categories_count
      }&organizationsCount=${cat.organizations_count}&step=2`
    );
  };

  useEffect(() => {
    if (response?.data) setCategories(response.data);
    if (response?.pagination) setPagination(response.pagination);
  }, [response]);

  if (!response) return null;

  return (
    <div className="w-full min-h-screen bg-gray-50 pb-20">
      <section className="relative mt-12 text-center h-[50vh] w-full bg-linear-to-b from-white via-gray-50/30 to-white overflow-hidden">
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
          <AnimatedGradientOrb
            delay={0.6}
            color="purple"
            className="bottom-1/4 left-1/4 w-[40vh] h-[40vh]"
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

          {/* Floating Icons */}
          <FloatingIcon
            Icon={FaLayerGroup}
            delay={0.3}
            className="top-1/5 left-[15%]"
          />
          <FloatingIcon
            Icon={FaTags}
            delay={0.5}
            className="top-1/3 right-[20%]"
          />
          <FloatingIcon
            Icon={FaFolderOpen}
            delay={0.7}
            className="bottom-1/3 left-[10%]"
          />
          <FloatingIcon
            Icon={FaChartPie}
            delay={0.9}
            className="bottom-1/4 right-[15%]"
          />
        </div>

        {/* Main Content */}
        <div className="container relative z-10 mx-auto px-4 h-full flex items-center">
          <div className="max-w-4xl mx-auto w-full py-16">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full bg-linear-to-r from-primary/10 to-primary/5 border border-primary/20 backdrop-blur-sm"
            >
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-primary font-semibold text-sm tracking-wide">
                {t("categoriesStep.categories")}
              </span>
            </motion.div>

            <div className="w-fit mx-auto">
              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className={`
              text-4xl sm:text-5xl md:text-6xl lg:text-7xl 
              font-bold text-gray-900 mb-6 leading-tight
              text-center
            `}
              >
                <span className="relative  inline-block">
                  {t("categoriesStep.categories")}
                  <motion.span
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{
                      delay: 0.8,
                      duration: 0.8,
                      ease: "easeInOut",
                    }}
                    className="absolute bottom-2 left-0 h-3 bg-primary/20 -z-10 rounded-lg"
                  />
                </span>
                <span className="text-primary">.</span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className={`
              text-lg md:text-xl lg:text-2xl 
              text-gray-600 max-w-2xl mb-10 leading-relaxed
              text-center
            `}
              >
                {t("categoriesStep.categories_subtitle")}
              </motion.p>
            </div>
          </div>
        </div>

        {/* Bottom Gradient Fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-white via-white/90 to-transparent pointer-events-none" />
      </section>

      {/* Categories Grid */}
      <div className="container mx-auto mt-12 px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((cat, index) => (
            <motion.div
              key={`${cat.id}-${index}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <CategoryOrgCard
                category={cat}
                onClick={() => handleSelectCategory(cat)}
              />
            </motion.div>
          ))}
        </div>

        {/* Load More Button */}
        {pagination && pagination.current_page < pagination.last_page && (
          <div className="mt-12 flex justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLoadMore}
              disabled={loading}
              className="flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-full font-semibold shadow-lg hover:shadow-primary/30 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300"
            >
              {loading ? (
                <>
                  <VscLoading className="animate-spin text-xl" />
                  <span>{t("loadMore")}...</span>
                </>
              ) : (
                <span>{t("loadMore")}</span>
              )}
            </motion.button>
          </div>
        )}
      </div>
    </div>
  );
}
