"use client";
import { category } from "@/app/types/_dashboard/GlobalTypes";
import React, { useEffect, useState } from "react";
import CategoryOrgCard from "./CategoryOrgCard";
import { toast } from "sonner";
import { instance } from "@/app/_helpers/axios";
import { formatTitle } from "@/app/_helpers/helpers";
import { useRouter, useSearchParams } from "next/navigation";
import { VscLoading } from "react-icons/vsc";
import { useLocale, useTranslations } from "next-intl";
import { directionMap } from "@/app/constants/_website/global";
import { FaFolderTree } from "react-icons/fa6";

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

export default function SubCategoriesGrid({ response }: props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const locale = useLocale();
  const t = useTranslations("organizationPage");

  const main_categoryId = searchParams.get("main_categoryId");

  const [subcategories, setSubcategories] = useState<category[]>([]);
  const [pagination, setPagination] = useState<paginationType | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLoadMore = async (newPage: number) => {
    try {
      setLoading(true);
      const response = await instance.get(
        `/sub-categories-by-parent?page=${newPage}&parent_id=${main_categoryId}&is_active=1`
      );
      if (response.status == 200) {
        const data = response.data.data;
        setSubcategories((prev) => [...prev, ...data]);
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
      `/organizations?categories=${main_categoryId}&sub_categories=${
        cat.id
      }&sub_category=${formatTitle(cat.title_en)}&main_categoryId=${
        cat.id
      }&step=3`
    );
  };

  useEffect(() => {
    if (response?.data) setSubcategories(response.data);
    if (response?.pagination) setPagination(response.pagination);
  }, [response]);

  if (!response) return null;
  return (
    <div
      dir={directionMap[locale]}
      className="c-container min-h-screen lg:mt-32 mt-20 py-12"
    >
      {/* header  */}
      <div className="text-center mb-10">
        <div className="flex items-center justify-center gap-3 mb-3">
          <FaFolderTree className="text-primary text-3xl" />
          <h2 className="text-2xl font-bold text-gray-800">
            {t("subcategoriesStep.subcategoriesTitle")}
          </h2>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto text-sm">
          {t("subcategoriesStep.subcategoriesDescription")}
        </p>
      </div>

      {/* subcategories data grid */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {subcategories.map((cat) => (
          <div
            onClick={() => handleSelectCategory(cat)}
            key={`${cat.id}+subcategory`}
          >
            <CategoryOrgCard category={cat} />
          </div>
        ))}
      </div>
      {pagination && pagination.current_page < pagination.last_page && (
        <button
          disabled={loading}
          onClick={() => handleLoadMore(pagination.current_page + 1)}
          className=" disabled:bg-orange-100 px-4 py-2 rounded-lg bg-primary text-white text-center mt-4 hover:bg-white hover:scale-105 hover:border-primary border border-transparent hover:text-black duration-300 text-lg flex items-center justify-center mx-auto"
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
