import React from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const handlePageClick = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      onPageChange(newPage);
    }
  };

  const getPageNumbers = (
    currentPage: number,
    totalPages: number
  ): (number | string)[] => {
    const pages: (number | string)[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }

    if (currentPage <= 4) {
      pages.push(1, 2, 3, "...", totalPages - 1, totalPages);
    } else if (currentPage >= totalPages - 3) {
      pages.push(
        1,
        2,
        "...",
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages
      );
    } else {
      pages.push(
        1,
        2,
        "...",
        currentPage - 1,
        currentPage,
        currentPage + 1,
        "...",
        totalPages - 1,
        totalPages
      );
    }

    return pages;
  };

  return (
    totalPages > 1 && (
      <ol
        style={{ direction: "ltr" }}
        className="flex justify-center flex-wrap gap-1 text-xs font-medium pt-2 border-t border-gray-300  my-6"
      >
        {/* Previous Button */}
        <li>
          <button
            type="button"
            onClick={() => handlePageClick(currentPage - 1)}
            className="inline-flex w-8 h-8 items-center justify-center rounded border border-gray-100 bg-white text-gray-900 disabled:opacity-50"
            disabled={currentPage === 1}
          >
            <span className="sr-only">Prev Page</span>
            <FaChevronLeft className="w-3 h-3" />
          </button>
        </li>

        {/* Dynamic Page Numbers */}
        {getPageNumbers(currentPage, totalPages).map((page, index) => (
          <li key={index}>
            {page === "..." ? (
              <span className="inline-block w-8 h-8 text-center leading-8 text-gray-500">
                ...
              </span>
            ) : (
              <button
                type="button"
                onClick={() => handlePageClick(Number(page))}
                className={`block w-8 h-8 rounded border text-center leading-8 font-medium transition
                  ${
                    page === currentPage
                      ? "bg-primary text-white border-primary"
                      : "bg-white text-gray-900 border-gray-100 hover:bg-gray-200"
                  }`}
              >
                {page}
              </button>
            )}
          </li>
        ))}

        {/* Next Button */}
        <li>
          <button
            type="button"
            onClick={() => handlePageClick(currentPage + 1)}
            className="inline-flex w-8 h-8 items-center justify-center rounded border border-gray-100 bg-white text-gray-900 disabled:opacity-50"
            disabled={currentPage === totalPages}
          >
            <span className="sr-only">Next Page</span>
            <FaChevronRight className="w-3 h-3" />
          </button>
        </li>
      </ol>
    )
  );
}
