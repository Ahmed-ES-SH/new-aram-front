"use client";

import { motion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { FiSearch, FiEye, FiCalendar } from "react-icons/fi";
import { Article, Category, tag } from "./types";
import Img from "../_global/Img";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { enUS, ar } from "date-fns/locale";
import SearchResultes from "./SearchResultes";
import { instance } from "@/app/_helpers/axios";
import LocaleLink from "../_global/LocaleLink";
import { formatTitle } from "@/app/_helpers/helpers";

interface SidebarProps {
  recentArticles: Article[];
  categories: Category[];
  tags: tag[];
}

export default function BlogSidebar({
  recentArticles,
  categories,
  tags,
}: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const t = useTranslations("articles.sidebar");
  const locale = useLocale();

  const [query, setQuery] = useState(searchParams.get("query") ?? "");
  const [searchResults, setSearchResults] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "d MMM", {
      locale: locale === "ar" ? ar : enUS,
    });
  };

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

  const onCategorySelect = (category: Category | null) => {
    if (category) {
      updateParam("category", category.id);
      setSelectedCategory(category);
    }

    if (!category) {
      removeSearchParam("category");
      setSelectedCategory(null);
    }
  };

  useEffect(() => {
    const fetchResultes = async () => {
      try {
        setLoading(true);
        setSearchOpen(true);
        const response = await instance.get(
          `/articles-by-status/published?query=${query}`
        );
        if (response.status === 200) {
          const data = response.data.data;
          if (data) setSearchResults(data);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    // Reset results if query is empty
    if (query.length === 0) {
      setSearchResults([]);
      setSearchOpen(false);
      return; // exit early
    }

    if (query.length >= 2) {
      const handler = setTimeout(() => {
        fetchResultes();
      }, 600);

      // Cleanup: cancel previous timeout if query changes before 600ms
      return () => {
        clearTimeout(handler);
      };
    }
  }, [query]);

  useEffect(() => {
    const categoryId = searchParams.get(`category`);
    if (categoryId) {
      const category: any = categories.find(
        (cat) => cat.id == Number(categoryId)
      );
      setSelectedCategory(category);
    }
  }, [categories, searchParams]);

  return (
    <aside className="lg:sticky lg:top-28 space-y-6">
      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-card relative rounded-lg p-6 shadow-md"
      >
        <h3 className="font-semibold text-card-foreground mb-4 flex items-center gap-2">
          <FiSearch className="w-4 h-4" />
          {t("search")}
        </h3>
        <input
          type="text"
          placeholder={t("search")}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-white outline-none pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-[12px]"
        />
        <SearchResultes
          isOpen={searchOpen}
          loading={loading}
          articles={searchResults}
        />
      </motion.div>

      {/* Categories */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="bg-card h-[320px] overflow-y-auto rounded-lg p-6 shadow-md"
      >
        <h3 className="font-semibold text-card-foreground mb-4">
          {t("categories")}
        </h3>
        <div className="space-y-2">
          <button
            onClick={() => onCategorySelect(null)}
            className={`w-full ltr:text-left rtl:text-right px-3 py-2 rounded-md transition-colors duration-200 ${
              selectedCategory == null
                ? "bg-primary text-primary-foreground"
                : "hover:text-white  hover:bg-foreground"
            }`}
          >
            {t("all")}
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategorySelect(category)}
              className={`w-full ltr:text-left rtl:text-right px-3 py-2 rounded-md transition-colors duration-200 ${
                selectedCategory?.id == category.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-white hover:bg-primary"
              }`}
            >
              {locale === "ar" ? category.title_ar : category.title_en}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Recent Articles */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="bg-card rounded-lg p-6 shadow-md"
      >
        <h3 className="font-semibold text-card-foreground mb-4">
          {t("recent")}
        </h3>
        <div className="space-y-4">
          {recentArticles &&
            recentArticles.map((article) => (
              <div key={article.id} className="flex gap-3 group cursor-pointer">
                <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                  <Img
                    src={article.image || "/placeholder.svg"}
                    errorSrc="/defaults/noImage.png"
                    alt={locale === "ar" ? article.title_ar : article.title_en}
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm text-card-foreground line-clamp-2 group-hover:text-primary transition-colors duration-200">
                    {locale === "ar" ? article.title_ar : article.title_en}
                  </h4>
                  <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <FiCalendar className="w-3 h-3" />
                      <span>{formatDate(article.created_at)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FiEye className="w-3 h-3" />
                      <span>{article.views}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </motion.div>

      {/* Popular Tags */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="bg-card rounded-lg p-6 shadow-md"
      >
        <h3 className="font-semibold text-card-foreground mb-4">
          {t("popular")}
        </h3>
        <div className="flex flex-wrap gap-2">
          {tags &&
            tags.map((tag, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm hover:bg-primary hover:text-primary-foreground transition-colors duration-200"
              >
                <LocaleLink
                  href={`/blog/tags/${formatTitle(tag.tag)}?tagId=${tag.id}`}
                >
                  {tag.tag}
                </LocaleLink>
              </motion.button>
            ))}
        </div>
      </motion.div>
    </aside>
  );
}
