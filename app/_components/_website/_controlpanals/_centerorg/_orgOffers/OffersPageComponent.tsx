"use client";
import React, { useEffect, useState } from "react";
import { Offer } from "@/app/_components/_dashboard/_offers/types";
import Pagination from "@/app/_components/PaginationComponent";
import { instance } from "@/app/_helpers/axios";
import OffersHeader from "./OffersHeader";
import OfferCard from "../../../_offers/OfferCard";
import { useAppSelector } from "@/app/Store/hooks";
import SpinLoading from "../../../_global/SpinLoading";

interface props {
  data: Offer[];
  pagination: {
    current_page: number;
    last_page: number;
  };
}

export default function OffersPageComponent({ data, pagination }: props) {
  const { user } = useAppSelector((state) => state.user);

  const [currentPage, setCurrentPage] = useState(pagination.current_page ?? 1);
  const [lastPage, setLastPage] = useState(pagination.current_page ?? 1);
  const [loading, setLoading] = useState(true);
  const [isServerData, setIsServerData] = useState(false);
  const [offers, setOffers] = useState<Offer[]>([]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= lastPage) {
      setCurrentPage(newPage);
    }
  };

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        scrollTo(80, 80);
        setLoading(true);
        const response = await instance.get(
          `/account-offers?id=${user?.id}&page=${currentPage}`
        );
        if (response.status == 200) {
          const data = response.data.data;
          const pagination = response.data.pagination;
          setOffers(data);
          setCurrentPage(pagination.current_page);
          setLastPage(pagination.last_page);
        }
      } catch (error: any) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    if (isServerData) fetchClientData();
  }, [isServerData, user, currentPage]);

  useEffect(() => {
    if (data) {
      setOffers(data);
      setLoading(false);
      setIsServerData(true);
    }
  }, [data]);

  if (loading)
    return (
      <div className="w-full h-[90vh] flex items-center justify-center">
        <SpinLoading />
      </div>
    );

  return (
    <div className="w-full  mt-4">
      {/* header */}
      <OffersHeader />

      {/* offers grid */}
      <div className="w-full min-h-[80vh] grid 2xl:grid-cols-4 md:grid-cols-2 lg:grid-cols-3 max-md:grid-cols-1 gap-3 items-start justify-items-center">
        {offers &&
          offers.length > 0 &&
          offers.map((offer, index) => (
            <OfferCard offer={offer} index={index} key={`offer+${offer.id}`} />
          ))}
      </div>

      {/* pagination */}
      {lastPage > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={lastPage}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}
