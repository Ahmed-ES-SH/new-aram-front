"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FaSearch,
  FaFilter,
  FaTimes,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import { useAppDispatch, useAppSelector } from "@/app/Store/hooks";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { setOrgsSidebar } from "@/app/Store/variablesSlice";
import SearchBox from "@/app/_components/_dashboard/_organizations/ui/SearchBox";
import RenderStars from "../../_global/RenderStars";
import { useLocale, useTranslations } from "next-intl";
import { directionMap } from "@/app/constants/_website/global";

export default function FilterSidebar() {
  const t = useTranslations("organizationPage");
  const locale = useLocale();

  const { categories } = useAppSelector((state) => state.categories);
  const { orgsSidebar, width } = useAppSelector((state) => state.variables);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [expandedSections, setExpandedSections] = useState({
    category: true,
    rating: true,
    location: true,
  });

  // Store expanded state for each category by id
  const [expandedCategories, setExpandedCategories] = useState<
    Record<number, boolean>
  >({});

  const onToggle = () => {
    dispatch(setOrgsSidebar(!orgsSidebar));
  };

  const filters = {
    categories: searchParams.get("categories")?.split(",").map(Number) ?? [],
    sub_categories:
      searchParams.get("sub_categories")?.split(",").map(Number) ?? [],
    rating: Number(searchParams.get("rating") ?? 0),
    locations: searchParams.get("locations")?.split(",").map(Number) ?? [],
  };

  // Handle main category or subcategory selection
  const handleCategoryChange = (category: any, level: number) => {
    const key = level === 0 ? "categories" : "sub_categories"; // main vs sub
    const currentValue = searchParams.get(key) ?? "";
    const currentIds = currentValue.split(",").filter(Boolean).map(Number);

    // Add or remove the selected ID
    const newIds = currentIds.includes(category.id)
      ? currentIds.filter((id) => id !== category.id)
      : [...currentIds, category.id];

    // Update the URL
    updateParam(key, newIds.join(","));
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

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const toggleCategory = (id: number) => {
    setExpandedCategories((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const sidebarVariants = {
    open: { x: 0, opacity: 1 },
    closed: { x: "-100%", opacity: 0 },
  };

  // Recursive render
  const RenderCategory = (category: any, level: number = 0) => {
    const hasSub =
      category.sub_categories && category.sub_categories.length > 0;
    const isExpanded = expandedCategories[category.id] ?? false;

    // Determine if this category is selected
    const isChecked =
      (level === 0 && filters.categories.includes(category.id)) ||
      (level > 0 && filters.sub_categories?.includes(category.id));

    return (
      <div
        key={category.id}
        className="space-y-1 border-b border-gray-100 pb-1"
      >
        <div
          className={`flex items-center justify-between cursor-pointer hover:bg-gray-50 rounded px-2 py-1`}
          style={{ paddingLeft: `${level * 16}px` }}
        >
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isChecked}
              onChange={(e) => {
                e.stopPropagation();
                handleCategoryChange(category, level);
              }}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">
              {locale == "en" ? category.title_en : category.title_ar}
            </span>
          </div>

          {hasSub && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleCategory(category.id);
              }}
              className="text-gray-400 hover:text-gray-600 p-1"
            >
              {isExpanded ? (
                <FaChevronUp size={12} />
              ) : (
                <FaChevronDown size={12} />
              )}
            </button>
          )}
        </div>

        {hasSub && isExpanded && (
          <div className="mt-1 rtl:mr-4 ltr:ml-4 bg-gray-50 space-y-1">
            {category.sub_categories.map((sub: any) =>
              RenderCategory(sub, level + 1)
            )}
          </div>
        )}
      </div>
    );
  };

  // Locations example
  const locations = [
    {
      id: 1,
      address: "Downtown Dubai",
      coordinates: { lat: 25.2048, lang: 55.2708 },
    },
    { id: 2, address: "Marina", coordinates: { lat: 25.08, lang: 55.14 } },
  ];

  const updateLocationParam = (locationId: number) => {
    const params = new URLSearchParams(searchParams.toString());
    const current = filters.locations.includes(locationId)
      ? filters.locations.filter((id) => id !== locationId)
      : [...filters.locations, locationId];

    params.set("locations", current.join(","));
    router.replace(`${pathname}?${params.toString()}`);
  };

  const renderLocations = () => (
    <div className="space-y-1">
      {locations.map((loc) => (
        <label key={loc.id} className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.locations.includes(loc.id)}
            onChange={() => updateLocationParam(loc.id)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700">{loc.address}</span>
        </label>
      ))}
    </div>
  );

  const clearFilters = () => {
    router.push(`/${locale}/organizations`); // reset URL
    setExpandedCategories({}); // reset all expanded subcategories
  };

  useEffect(() => {
    if (width >= 1024) {
      dispatch(setOrgsSidebar(true));
    }
  }, [dispatch, width]);

  return (
    <motion.div
      dir={directionMap[locale]}
      variants={sidebarVariants}
      initial="closed"
      animate={orgsSidebar ? "open" : "closed"}
      className="fixed top-0 max-lg:w-96 lg:max-w-[340px] lg:flex-1 lg:sticky lg:top-28 left-0 h-screen lg:h-fit  bg-white shadow-lg lg:shadow-none z-50 overflow-y-auto max-lg:z-[99999]"
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <FaFilter className="text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">
              {t("filters")}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={clearFilters}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              {t("clear_filters")}
            </button>
            <button
              onClick={onToggle}
              className="lg:hidden p-1 text-gray-400 hover:text-gray-600"
            >
              <FaTimes />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <SearchBox placeholder={t("searchPlaceHoloder")} />
          </div>
        </div>

        {/* Categories */}
        <div className="mb-6">
          <button
            onClick={() => toggleSection("category")}
            className="flex items-center justify-between w-full text-left mb-2"
          >
            <span className="font-medium text-gray-800">{t("categories")}</span>
            {expandedSections.category ? <FaChevronUp /> : <FaChevronDown />}
          </button>
          {expandedSections.category && (
            <div className="space-y-2">
              {categories.map((cat) => RenderCategory(cat))}
            </div>
          )}
        </div>

        {/* Rating */}
        <div className="mb-6">
          <button
            onClick={() => toggleSection("rating")}
            className="flex items-center justify-between w-full text-left mb-2"
          >
            <span className="font-medium text-gray-800">{t("rating")}</span>
            {expandedSections.rating ? <FaChevronUp /> : <FaChevronDown />}
          </button>
          {expandedSections.rating && (
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((star) => (
                <label
                  key={star}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="rating"
                    checked={filters.rating === star}
                    onChange={() => updateParam("rating", String(star))}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <RenderStars rating={star} />
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Locations */}
        <div className="mb-6">
          <button
            onClick={() => toggleSection("location")}
            className="flex items-center justify-between w-full text-left mb-2"
          >
            <span className="font-medium text-gray-800">{t("locations")}</span>
            {expandedSections.location ? <FaChevronUp /> : <FaChevronDown />}
          </button>
          {expandedSections.location && renderLocations()}
        </div>
      </div>
    </motion.div>
  );
}
