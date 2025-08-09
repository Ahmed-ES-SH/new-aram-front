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

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => goToPage(i)}
          className={`px-3 py-1 border border-gray-300 rounded ${
            i === currentPage
              ? "bg-primary text-white"
              : "bg-white text-gray-700 hover:bg-mid-primary hover:text-white duration-200"
          }`}
        >
          {i}
        </button>
      );
    }

    return pages;
  };

  return (
    <div
      dir={directionMap[locale]}
      className="flex items-center justify-center gap-2 mt-6"
    >
      <button
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 border border-gray-300 rounded bg-white text-gray-700 hover:bg-blue-50 disabled:opacity-50"
      >
        <HiArrowLeft />
      </button>

      {renderPages()}

      <button
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 border border-gray-300 rounded bg-white text-gray-700 hover:bg-blue-50 disabled:opacity-50"
      >
        <HiArrowRight />
      </button>
    </div>
  );
}
