"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getIconComponent } from "@/app/_helpers/helpers";
import { category } from "@/app/types/_dashboard/GlobalTypes";
import { FaTimes } from "react-icons/fa";
import { useLocale } from "next-intl";
import { directionMap } from "@/app/constants/_website/global";
import { useRouter, useSearchParams } from "next/navigation";

interface Props {
  categories: category[];
}

export default function CategoriesButtons({ categories }: Props) {
  const [openSidebar, setOpenSidebar] = useState(false);
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();

  const visibleCategories = categories.slice(0, 6);
  const remaining = categories.length - visibleCategories.length;

  // helper: handle category select
  const handleSelectCategory = (catId: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("category_id", String(catId));
    router.push(`?${params.toString()}`);
    setOpenSidebar(false);
  };

  // helper: show all cards
  const handleShowAll = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("category_id"); // remove category filter
    router.push(`?${params.toString()}`);
    setOpenSidebar(false);
  };

  const activeCatgeory = searchParams.get("category_id") ?? null;

  return (
    <div dir={directionMap[locale]} className="w-fit mx-auto mb-6">
      {/* visible categories */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        {/* show all button */}
        <button
          onClick={handleShowAll}
          className="px-4 py-2 rounded-full text-sm font-medium bg-blue-500 text-white hover:bg-blue-600 duration-300"
        >
          {locale === "en" ? "Show All" : "عرض جميع البطاقات"}
        </button>
        {visibleCategories.map((cat) => {
          const Icon = getIconComponent(cat.icon_name);
          const isActive = cat.id == Number(activeCatgeory);
          return (
            <button
              key={cat.id}
              onClick={() => handleSelectCategory(cat.id)}
              className="flex items-center gap-2 px-4 py-2 rounded-full hover:scale-105  text-sm font-medium border  shadow-sm hover:shadow-md duration-300"
              style={{
                backgroundColor: isActive ? cat.bg_color : cat.bg_color + "10",
                color: isActive ? "white" : "black",
                borderColor: isActive ? "white" : cat.bg_color,
              }}
            >
              {Icon && (
                <Icon
                  className="text-lg"
                  style={{ color: isActive ? "white" : cat.bg_color }}
                />
              )}
              {locale === "en" ? cat.title_en : cat.title_ar}
            </button>
          );
        })}

        {/* show more button */}
        {remaining > 0 && (
          <button
            onClick={() => setOpenSidebar(true)}
            className="px-4 py-2 rounded-full text-sm font-medium bg-gray-200 hover:bg-gray-300 duration-300"
          >
            +{remaining}
          </button>
        )}
      </div>

      {/* Sidebar */}
      <AnimatePresence>
        {openSidebar && (
          <motion.div
            initial={{ x: locale === "ar" ? "100%" : "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: locale === "ar" ? "100%" : "-100%" }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 bottom-0 w-80 bg-white shadow-lg z-[9999] p-6 overflow-y-auto"
            style={{
              [locale === "ar" ? "right" : "left"]: 0,
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800">
                {locale === "en" ? "All Categories" : "جميع الأقسام"}
              </h3>
              <button
                onClick={() => setOpenSidebar(false)}
                className="p-2 text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            </div>

            {/* all categories */}
            <div className="grid gap-3">
              {categories.map((cat) => {
                const Icon = getIconComponent(cat.icon_name);
                return (
                  <button
                    key={cat.id}
                    onClick={() => handleSelectCategory(cat.id)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border border-gray-200 shadow-sm hover:shadow-md duration-300 text-left"
                    style={{ backgroundColor: cat.bg_color + "11" }}
                  >
                    {Icon && (
                      <Icon
                        className="text-lg"
                        style={{ color: cat.bg_color }}
                      />
                    )}
                    {locale === "en" ? cat.title_en : cat.title_ar}
                  </button>
                );
              })}

              {/* show all inside sidebar */}
              <button
                onClick={handleShowAll}
                className="mt-4 px-4 py-2 rounded-lg text-sm font-medium bg-blue-500 text-white hover:bg-blue-600 duration-300"
              >
                {locale === "en" ? "Show All Cards" : "عرض جميع البطاقات"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay */}
      {openSidebar && (
        <div
          onClick={() => setOpenSidebar(false)}
          className="fixed inset-0 bg-black/40 z-[9998]"
        />
      )}
    </div>
  );
}
