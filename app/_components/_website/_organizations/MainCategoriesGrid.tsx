"use client";
import { category } from "@/app/types/_dashboard/GlobalTypes";
import React, { useEffect, useState } from "react";
import CategoryOrgCard from "./CategoryOrgCard";
import { instance } from "@/app/_helpers/axios";
import { VscLoading } from "react-icons/vsc";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { formatTitle } from "@/app/_helpers/helpers";
import { FaFilter } from "react-icons/fa";
import { useLocale, useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { directionMap } from "@/app/constants/_website/global";

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

export default function MainCategoriesGrid({ response }: props) {
  const locale = useLocale();
  const t = useTranslations("organizationPage");
  const router = useRouter();

  const [categories, setCategories] = useState<category[]>([]);
  const [pagination, setPagination] = useState<paginationType | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLoadMore = async (newPage: number) => {
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
      )}&main_categoryId=${cat.id}&step=2`
    );
  };

  useEffect(() => {
    if (response?.data) setCategories(response.data);
    if (response?.pagination) setPagination(response.pagination);
  }, [response]);

  if (!response) return null;
  return (
    <div
      dir={directionMap[locale]}
      className="c-container min-h-screen mt-20 py-12"
    >
      {/* header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-3xl mx-auto mb-12"
      >
        {/* Icon + Title */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 bg-primary/10 rounded-full">
            <FaFilter className="text-primary text-2xl" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            {t("categoriesStep.categories")}
          </h1>
        </div>

        {/* Subtitle */}
        <p className="text-gray-600 text-base leading-relaxed">
          {t("categoriesStep.categories_subtitle")}
        </p>
      </motion.div>

      {/* categories Data grid */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {categories.map((cat) => (
          <div
            onClick={() => handleSelectCategory(cat)}
            key={`${cat.id}+category`}
          >
            <CategoryOrgCard category={cat} />
          </div>
        ))}
      </div>
      {pagination && pagination.current_page < pagination.last_page && (
        <button
          disabled={loading}
          onClick={() => handleLoadMore(pagination.current_page + 1)}
          className=" disabled:bg-orange-100 px-4 py-2 rounded-lg bg-primary text-white text-center mt-8 hover:bg-white hover:scale-105 hover:border-primary border border-transparent hover:text-black duration-300 text-lg flex items-center justify-center mx-auto"
        >
          {loading ? (
            <VscLoading className="size-6 animate-spin" />
          ) : (
            t("loadMore")
          )}
        </button>
      )}
    </div>
  );
}
