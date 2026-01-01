"use client";
import { Offer } from "../../_dashboard/_offers/types";
import OfferCard from "./OfferCard";
import ServerPagination from "../_global/ServerPagination";
import NoOffers from "./NoOffers";
import LoadingOffers from "@/app/[locale]/(routes)/offers/loading";
import { Suspense } from "react";

interface props {
  offers: Offer[];
  pagination: {
    current_page: number;
    last_page: number;
  };
}

export default function OffersGrid({ offers, pagination }: props) {
  if (!offers || (Array.isArray(offers) && offers.length === 0)) {
    return <NoOffers />;
  }

  return (
    <Suspense fallback={<LoadingOffers />}>
      <div className="w-full min-h-screen pb-4 border-b border-gray-300">
        {/* offers grid */}
        <div className="w-full grid 2xl:grid-cols-4 xl:grid-cols-3 lg:grid-cols-3 md:grid-cols-2 max-sm:grid-cols-1 grid-cols-2  justify-items-center gap-5 py-2 lg:p-6">
          {offers &&
            offers.map((offer, index) => {
              return (
                <OfferCard
                  index={index}
                  offer={offer}
                  key={`${offer.id}+offerKey`}
                />
              );
            })}
        </div>
        {pagination && pagination.last_page > 1 && (
          <ServerPagination
            currentPage={pagination.current_page}
            totalPages={pagination.last_page}
          />
        )}
      </div>
    </Suspense>
  );
}
