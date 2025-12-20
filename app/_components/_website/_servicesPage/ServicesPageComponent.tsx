"use client";

import { useState, useEffect, useRef } from "react";
import { directionMap } from "@/app/constants/_website/global";
import HeroSection from "@/app/_components/_website/_servicesPage/hero-section";
import SearchBar from "@/app/_components/_website/_servicesPage/search-bar";
import CategoryFilter from "@/app/_components/_website/_servicesPage/category-filter";
import ServicesList from "@/app/_components/_website/_servicesPage/services-list";
import WhyChooseUs from "@/app/_components/_website/_servicesPage/why-choose-us";
import { useLocale } from "next-intl";
import { Service } from "./service";
import { category } from "@/app/types/_dashboard/GlobalTypes";
import { instance } from "@/app/_helpers/axios";

interface props {
  servicesData: Service[];
  categories: category[];
  last_page: number;
}

// Main services listing page with all sections
export default function ServicesPageComponent({
  servicesData,
  last_page,
  categories,
}: props) {
  const locale = useLocale();

  // 1. State Management
  const [searchQuery, setSearchQuery] = useState(""); // ما يكتبه المستخدم في الحقل
  const [debouncedSearch, setDebouncedSearch] = useState(""); // القيمة التي نرسلها للـ API
  const [selectedCategory, setSelectedCategory] = useState<category | null>(
    null
  );

  const [services, setServices] = useState<Service[]>(servicesData ?? []);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [lastPage, setLastPage] = useState<number>(last_page ?? 1);
  const [loading, setLoading] = useState<boolean>(false);

  const isInitialMount = useRef(true);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= lastPage) {
      setCurrentPage(newPage);
    }
  };

  const handleQueryChange = (query: string) => {
    setSearchQuery(query);
  };

  const fetchData = async () => {
    try {
      setLoading(true);

      const response = await instance.get("/public-services", {
        params: {
          page: currentPage,
          ...(searchQuery ? { query: searchQuery } : {}),
          ...(selectedCategory?.id ? { category: selectedCategory.id } : {}),
        },
      });

      if (response.status === 200) {
        setServices(response.data.data);
        setLastPage(response.data.pagination.last_page);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------
  // 3. Effects
  // --------------------------------------

  // Effect A: Debounce Logic
  // مسؤول فقط عن تأخير تحديث قيمة البحث والعودة للصفحة الأولى عند البحث
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);

      // إذا تغير البحث، نعود للصفحة 1 (اختياري حسب منطق العمل)
      // لكن يجب التأكد من عدم تكرار التعيين إذا كانت القيمة لم تتغير فعلياً
      if (searchQuery !== debouncedSearch) {
        setCurrentPage(1);
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Effect B: Fetching Data
  // هذا هو المكان الوحيد الذي يستدعي البيانات
  useEffect(() => {
    // تخطي الجلب في أول مرة لأن البيانات قادمة من السيرفر (SSR)
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    fetchData();
    // يتم الاستدعاء عند تغير الصفحة، القسم، أو النص المعتمد للبحث
  }, [currentPage, selectedCategory, debouncedSearch]);

  return (
    <main
      className="min-h-screen mt-24 w-full bg-white"
      dir={directionMap[locale]}
    >
      {/* Hero section */}
      <HeroSection />

      {/* Search bar */}
      <SearchBar value={searchQuery} onChange={handleQueryChange} />

      {/* Category filter */}
      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        locale={locale}
      />

      {/* Services list */}
      <ServicesList
        services={services}
        lastPage={lastPage}
        loading={loading}
        locale={locale}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />

      {/* Why choose us section */}
      <WhyChooseUs />
    </main>
  );
}
