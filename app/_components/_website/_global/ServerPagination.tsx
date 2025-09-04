"use client";
import { directionMap } from "@/app/constants/_website/global";
import { useAppSelector } from "@/app/Store/hooks";
import { useRouter, useSearchParams } from "next/navigation";
import { HiArrowLeft, HiArrowRight } from "react-icons/hi";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export default function ServerPagination({
  currentPage,
  totalPages,
}: PaginationProps) {
  const { locale } = useAppSelector((state) => state.variables);

  const router = useRouter();
  const searchParams = useSearchParams();

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`?${params.toString()}`);
  };

  const renderPages = () => {
    const pages: React.ReactNode[] = [];
    const maxPagesToShow = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = startPage + maxPagesToShow - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    if (startPage > 1) {
      pages.push(
        <button
          key={1}
          onClick={() => goToPage(1)}
          className={`px-4 py-2 rounded-lg border transition ${
            currentPage === 1
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-white text-gray-700 hover:bg-blue-50 border-gray-300"
          }`}
        >
          1
        </button>
      );
      if (startPage > 2) {
        pages.push(
          <span key="dots-start" className="px-2 text-gray-500">
            ...
          </span>
        );
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => goToPage(i)}
          className={`px-4 py-2 rounded-lg border transition ${
            i === currentPage
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-white text-gray-700 hover:bg-blue-50 border-gray-300"
          }`}
        >
          {i}
        </button>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(
          <span key="dots-end" className="px-2 text-gray-500">
            ...
          </span>
        );
      }
      pages.push(
        <button
          key={totalPages}
          onClick={() => goToPage(totalPages)}
          className={`px-4 py-2 rounded-lg border transition ${
            currentPage === totalPages
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-white text-gray-700 hover:bg-blue-50 border-gray-300"
          }`}
        >
          {totalPages}
        </button>
      );
    }

    return pages;
  };

  return (
    <div
      dir={directionMap[locale]}
      className="flex items-center justify-center gap-2 mt-8"
    >
      {/* Prev button */}
      <button
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
        className="h-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        <HiArrowRight />
      </button>

      {renderPages()}

      {/* Next button */}
      <button
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="h-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        <HiArrowLeft />
      </button>
    </div>
  );
}
