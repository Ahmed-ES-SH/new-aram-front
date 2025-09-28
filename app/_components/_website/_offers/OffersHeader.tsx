"use client";
import React, { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { FiSearch, FiFilter, FiChevronDown, FiGrid } from "react-icons/fi";
import { useAppSelector } from "@/app/Store/hooks";
import { category } from "@/app/types/_dashboard/GlobalTypes";
import { directionMap } from "@/app/constants/_website/global";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { getIconComponent } from "@/app/_helpers/helpers";
import { useClickOutside } from "@/app/_helpers/useClickOutside";

type option = {
  label: { en: string; ar: string };
  value: string;
};

export default function OffersHeader() {
  const locale = useLocale();
  const t = useTranslations("offers.header");

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const categoryId = searchParams.get("category") ?? null;
  const sortByParam = searchParams.get("sort_by") ?? null;

  const { categories } = useAppSelector((state) => state.categories);

  const [searchQuery, setSearchQuery] = useState("");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [sortBy, setSortBy] = useState<option | null>(null);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<category | null>(
    null
  );

  // Create a ref for the dropdown container
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownCategoryRef = useRef<HTMLDivElement>(null);

  // Use the click outside hook
  useClickOutside(dropdownRef, () => {
    setIsSortOpen(false);
  });

  // Use the click outside hook
  useClickOutside(dropdownCategoryRef, () => {
    setIsCategoryOpen(false);
  });

  const sortOptions = [
    {
      value: "newest",
      label: {
        en: "Newest",
        ar: "الأحدث",
      },
    },
    {
      value: "popular",
      label: {
        en: "Most Popular",
        ar: "الأكثر شيوعاً",
      },
    },
    {
      value: "expiring",
      label: {
        en: "Expiring Soon",
        ar: "تنتهي قريباً",
      },
    },
    {
      value: "discount",
      label: {
        en: "Highest Discount",
        ar: "أعلى خصم",
      },
    },
  ];

  const updateParam = (key: string, value: string | number | null) => {
    const params = new URLSearchParams(searchParams.toString());
    const stringValue = value !== null ? String(value) : null;

    if (stringValue && params.get(key) === stringValue) {
      params.delete(key);
    } else if (stringValue && stringValue !== "" && stringValue !== "null") {
      params.set(key, stringValue);
    } else {
      params.delete(key);
    }

    router.replace(`${pathname}?${params.toString()}`);
  };

  // Function to remove a parameter
  const removeSearchParam = (key: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(key);

    // Get the new query string
    const newQueryString = params.toString();

    // Update the URL (with or without query string)
    router.push(newQueryString ? `${pathname}?${newQueryString}` : pathname);
  };

  const handleSelectCategory = (category: category | null) => {
    if (category) {
      setSelectedCategory(category);
      updateParam("category", category.id);
    }

    if (!category) {
      removeSearchParam("category");
      setSelectedCategory(null);
    }

    setIsCategoryOpen(false);
  };

  const handleSortData = (option: option | null) => {
    if (option) {
      setSortBy(option);
      updateParam("sort_by", option.value);
    }

    if (!option) {
      removeSearchParam("sort_by");
      setSortBy(null);
    }

    setIsSortOpen(false);
  };

  // ✅ keep input in sync with URL changes
  useEffect(() => {
    const queryParam = searchParams.get("query") ?? "";
    setSearchQuery(queryParam);

    if (sortByParam) {
      // Use find() instead of map() to get the matching option
      const activeSort = sortOptions.find(
        (option) => option.value === sortByParam
      );

      // Only set if we found a matching option
      if (activeSort) {
        setSortBy(activeSort);
      }
    }

    if (categoryId) {
      const activeCategory = categories.find((cat) => cat.id == categoryId);

      if (activeCategory) {
        setSelectedCategory(activeCategory);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, sortByParam, categoryId, categories]);

  // Debounce logic
  useEffect(() => {
    const handler = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());

      if (searchQuery.trim()) {
        params.set("query", searchQuery.trim());
      } else {
        params.delete("query");
      }

      params.set("page", "1"); // reset page
      router.replace(`${pathname}?${params.toString()}`);
    }, 600);

    return () => clearTimeout(handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  const SelectedIcon: any =
    selectedCategory && getIconComponent(selectedCategory.icon_name);

  return (
    <header
      dir={directionMap[locale]}
      className="bg-gray-50 mt-24 w-full shadow-sm border-b border-gray-200"
    >
      <div className="c-container px-4 sm:px-6 lg:px-8">
        {/* Main header content */}
        <div className="py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex-1 min-w-0">
              <motion.h1
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl font-bold text-gray-900"
              >
                {t("title")}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mt-2 text-sm text-gray-600"
              >
                {t("subtitle")}
              </motion.p>
            </div>
          </div>

          {/* Search and filter section */}
          <div className="mt-6 flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            {/* Search input */}
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder={t("searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary focus:border-primary"
              />
            </div>

            {/* Filter buttons */}
            <div className="flex gap-3">
              {/* Category filter */}
              <div ref={dropdownCategoryRef} className="relative">
                <button
                  onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                  className="inline-flex gap-2 items-center px-4 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  {selectedCategory ? (
                    <SelectedIcon className="mr-2 h-5 w-5" />
                  ) : (
                    <FiGrid className="mr-2 h-5 w-5" />
                  )}
                  {locale == "en"
                    ? selectedCategory?.title_en
                    : selectedCategory?.title_ar || t("categoriesTitle")}
                  <FiChevronDown className="ml-2 h-5 w-5" />
                </button>

                <AnimatePresence>
                  {isCategoryOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="origin-top-right overflow-y-auto absolute right-0 mt-2 max-h-72 w-56 rounded-md shadow-lg bg-white border border-gray-300  z-50"
                    >
                      <div className="py-1">
                        <button
                          onClick={() => handleSelectCategory(null)}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                        >
                          {t("all")}
                        </button>
                        {categories.map((category) => {
                          const Icon = getIconComponent(category.icon_name);
                          return (
                            <button
                              key={category.id}
                              onClick={() => handleSelectCategory(category)}
                              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                            >
                              <Icon style={{ color: `${category.bg_color}` }} />
                              <p>
                                {locale == "en"
                                  ? category.title_en
                                  : category.title_ar}
                              </p>
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Sort filter */}
              <div ref={dropdownRef} className="relative">
                <button
                  onClick={() => setIsSortOpen(!isSortOpen)}
                  className="inline-flex bg-primary text-white duration-300 gap-2 items-center px-4 py-3 border border-gray-300 rounded-lg text-sm font-medium hover:bg-white hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  <FiFilter className="mr-2 h-5 w-5" />
                  {sortBy ? sortBy.label[locale] : t("sort")}
                  <FiChevronDown className="ml-2 h-5 w-5" />
                </button>

                <AnimatePresence>
                  {isSortOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="origin-top-right absolute right-0 mt-2 max-h-56 overflow-y-auto w-48 rounded-md shadow-lg border border-gray-300 bg-white z-50"
                    >
                      <div className="py-1">
                        <button
                          onClick={() => handleSortData(null)}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                        >
                          {t("all")}
                        </button>
                        {sortOptions.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => handleSortData(option)}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                          >
                            {option.label[locale]}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
