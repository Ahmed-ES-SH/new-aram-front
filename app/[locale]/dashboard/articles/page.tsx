"use client";
import ArticleCard from "@/app/_components/_dashboard/_articles/ArticleCard";
import NoDataFounded from "@/app/_components/_dashboard/NoDataFounded";
import SearchInput from "@/app/_components/_dashboard/SearchInput";
import LoadingSpin from "@/app/_components/LoadingSpin";
import Pagination from "@/app/_components/PaginationComponent";
import useSearchData from "@/app/_helpers/FetchDataBySearch";
import useFetchData from "@/app/_helpers/FetchDataWithAxios";
import { ArticleType } from "@/app/types/_dashboard/GlobalTypes";
import React, { useEffect, useState } from "react";

export default function Articles() {
  const [articles, setArticles] = useState<ArticleType[]>([]);
  const [currentData, setCurrentData] = useState("DefaultData");

  // البيانات الافتراضية (جميع المقالات)
  const { data, currentPage, setCurrentPage, lastPage, loading } = useFetchData(
    "/articles",
    true
  );

  console.log(data);

  // بيانات البحث
  const {
    searchData,
    searchCurrentPage,
    searchLastPage,
    loading: searchLoading,
    setSearchCurrentPage,
    handleSearch,
    setQuery,
  } = useSearchData(`/get-articles-by-search`);

  useEffect(() => {
    if (data || searchData) {
      switch (currentData) {
        case "DeafultData":
          setArticles(data as any);
          break;
        case "searchData":
          setArticles(searchData);
          break;
        default:
          setArticles(data as any);
      }
    }
  }, [currentData, data, searchData]);

  // إعادة تعيين البحث والعودة إلى الوضع الافتراضي
  const resetToDefaultView = () => {
    setCurrentData("DefaultData");
    setCurrentPage(1); // إعادة الصفحة إلى الأولى
  };

  const handlesearchwrapper = () => {
    setCurrentData("searchData");
    handleSearch();
  };

  const getPaginationData = () => {
    switch (currentData) {
      case "DefaultData":
        return {
          currentPage,
          lastPage,
          handlePageChange: (newPage: number) => {
            if (newPage > 0 && newPage <= lastPage) {
              setCurrentPage(newPage);
            }
          },
        };
      case "searchData":
        return {
          currentPage: searchCurrentPage,
          lastPage: searchLastPage,
          handlePageChange: (newPage: number) => {
            if (newPage > 0 && newPage <= searchLastPage) {
              setSearchCurrentPage(newPage);
            }
          },
        };
      default:
        return {
          currentPage,
          lastPage,
          handlePageChange: (newPage: number) => {
            if (newPage > 0 && newPage <= lastPage) {
              setCurrentPage(newPage);
            }
          },
        };
    }
  };

  // تفكيك القيم بعد التأكد من أن الدالة ترجع كائنًا دائمًا
  const {
    currentPage: activeCurrentPage,
    lastPage: activeLastPage,
    handlePageChange,
  } = getPaginationData();

  if (loading || searchLoading) return <LoadingSpin />;

  return (
    <>
      {/* زر العودة إلى الوضع الافتراضي يظهر فقط عند البحث */}
      {currentData != "DefaultData" && (
        <div className="text-center my-4">
          <span
            onClick={resetToDefaultView}
            className="my-6 underline underline-primary text-primary cursor-pointer"
          >
            عرض كل المقالات
          </span>
        </div>
      )}
      <SearchInput
        handleSearch={handlesearchwrapper}
        setSearchContent={setQuery}
        placeHolder="ابحث عن المقال الذى تريدة عن طريق العنوان او كلمات مفتاحية فى محتوى المقال ...."
      />
      {articles && articles.length > 0 ? (
        <div className="w-full grid grid-cols-2 max-md:grid-cols-1 max-md:p-2 gap-x-6 gap-y-2 h-fit p-6 overflow-y-auto overflow-x-hidden justify-items-center">
          {articles.map((article, index) => (
            <ArticleCard
              direct="/dashboard/articles"
              Article={article}
              key={index}
            />
          ))}
        </div>
      ) : (
        <NoDataFounded />
      )}
      {/* عرض Pagination بناءً على البحث أو الوضع الافتراضي */}
      <Pagination
        currentPage={activeCurrentPage}
        totalPages={activeLastPage}
        onPageChange={handlePageChange}
      />
    </>
  );
}
