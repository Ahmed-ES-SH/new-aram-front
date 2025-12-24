"use client";
import React, { useState, useEffect } from "react";
import { HiFilter, HiPlus } from "react-icons/hi";
import Link from "next/link";
import { motion } from "framer-motion";
import ArticleDashCard from "@/app/_components/_dashboard/_articles/ArticleDashCard";
import ArticlesFilterSidebar from "@/app/_components/_dashboard/_articles/ArticlesFilterSidebar";
import NoDataFounded from "@/app/_components/_dashboard/NoDataFounded";
import NoSearchResults from "@/app/_components/_dashboard/NoSearchResults";
import LoadingSpin from "@/app/_components/LoadingSpin";
import Pagination from "@/app/_components/PaginationComponent";
import useFetchData from "@/app/_helpers/FetchDataWithAxios";
import { ArticleType } from "@/app/types/_dashboard/GlobalTypes";
import { useAppSelector } from "@/app/Store/hooks";

export default function Articles() {
  const { width } = useAppSelector((state) => state.variables);

  // Filter States
  const [query, setQuery] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [authorId, setAuthorId] = useState("");
  const [status, setStatus] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // UI States
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 800);
    return () => clearTimeout(handler);
  }, [query]);

  // Construct URL params
  const getQueryParams = () => {
    const params = new URLSearchParams();
    if (debouncedQuery) params.append("search", debouncedQuery);
    if (categoryId) params.append("category_id", categoryId);
    if (authorId) params.append("author_id", authorId);
    if (status) params.append("status", status);
    if (fromDate) params.append("from_date", fromDate);
    if (toDate) params.append("to_date", toDate);
    return params.toString();
  };

  // Fetch Data
  const { data, setData, loading, currentPage, lastPage, setCurrentPage } =
    useFetchData<ArticleType[]>(
      `/articles?${getQueryParams()}`,
      true, // Pagination enabled
      true // Use cache/revalidate
    );

  const resetFilters = () => {
    setQuery("");
    setCategoryId("");
    setAuthorId("");
    setStatus("");
    setFromDate("");
    setToDate("");
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= lastPage) {
      setCurrentPage(newPage);
    }
  };

  useEffect(() => {
    if (width >= 1024) {
      setIsSidebarOpen(true);
    }
  }, [width]);

  return (
    <div className="flex min-h-screen" style={{ direction: "rtl" }}>
      {/* Sidebar - Desktop: Sticky, Mobile: Modal */}
      <ArticlesFilterSidebar
        query={query}
        setQuery={setQuery}
        categoryId={categoryId}
        setCategoryId={setCategoryId}
        authorId={authorId}
        setAuthorId={setAuthorId}
        status={status}
        setStatus={setStatus}
        fromDate={fromDate}
        setFromDate={setFromDate}
        toDate={toDate}
        setToDate={setToDate}
        resetFilters={resetFilters}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      {/* Main Content */}
      <div className="flex-1 w-full lg:w-[calc(100%-280px)] transition-all">
        <div className="p-4 lg:p-8 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                إدارة المقالات
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                قم بإدارة وتنظيم المحتوى الخاص بك
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden p-2.5 bg-white border border-gray-200 rounded-xl text-gray-600 shadow-sm hover:shadow-md transition-all"
              >
                <HiFilter className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Results Info */}
          {!loading && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>تم العثور على</span>
              <span className="font-bold text-gray-800">
                {data?.length || 0}
              </span>
              <span>مقال</span>
            </div>
          )}

          {/* Content Grid */}
          {loading ? (
            <LoadingSpin />
          ) : data && data.length > 0 ? (
            <>
              <motion.div
                layout
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
              >
                {data.map((article, index) => (
                  <ArticleDashCard
                    key={article.id || index}
                    article={article}
                    setArticels={setData as any}
                  />
                ))}
              </motion.div>

              <div className="mt-8">
                <Pagination
                  currentPage={currentPage}
                  totalPages={lastPage}
                  onPageChange={handlePageChange}
                />
              </div>
            </>
          ) : (
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-12">
              <NoSearchResults />
              <div className="text-center mt-4">
                <button
                  onClick={resetFilters}
                  className="text-blue-600 hover:underline text-sm"
                >
                  إعادة تعيين الفلاتر
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
