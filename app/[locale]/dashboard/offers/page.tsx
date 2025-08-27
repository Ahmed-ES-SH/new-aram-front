"use client";
import OfferFilterSidebar from "@/app/_components/_dashboard/_offers/OfferFilterSidebar";
import OffersDashboard from "@/app/_components/_dashboard/_offers/OffersDashboard";
import { Offer } from "@/app/_components/_dashboard/_offers/types";
import Pagination from "@/app/_components/PaginationComponent";
import { instance } from "@/app/_helpers/axios";
import React, { useEffect, useState } from "react";

interface OfferFilters {
  query: string;
  status: string;
  category_id: string;
  discount_type: string;
  start_date: string;
  end_date: string;
}

export default function OffersPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [filters, setFilters] = useState<OfferFilters>({
    category_id: "",
    status: "",
    discount_type: "",
    start_date: "",
    end_date: "",
    query: "",
  });

  useEffect(() => {
    const handler = setTimeout(async () => {
      setLoading(true);
      try {
        // build query string
        const queryParams = new URLSearchParams();

        Object.entries(filters).forEach(([key, value]) => {
          if (value) {
            if (key === "category") {
              queryParams.set("category_id", value); // special case
            } else {
              queryParams.set(key, value.toString());
            }
          }
        });

        // ✅ add current page
        queryParams.set("page", currentPage.toString());

        const endpoint = `/dashboard/offers?${queryParams.toString()}`;
        const response = await instance.get(endpoint);

        setOffers(response.data.data);
        setLastPage(response.data.pagination.last_page);
        setCurrentPage(response.data.pagination.current_page);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 600); // debounce

    return () => clearTimeout(handler);
  }, [filters, currentPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= lastPage) {
      setCurrentPage(newPage);
    }
  };

  return (
    <>
      <div className="w-full flex items-start gap-2">
        <div className="flex-1">
          <OffersDashboard
            setOffers={setOffers}
            loading={loading}
            offers={offers}
          />
          <Pagination
            currentPage={currentPage}
            totalPages={lastPage}
            onPageChange={handlePageChange}
          />
        </div>

        <OfferFilterSidebar filters={filters} setFilters={setFilters} />
      </div>
    </>
  );
}
