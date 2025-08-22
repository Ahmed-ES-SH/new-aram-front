import React from "react";
import OrganizationsBody from "@/app/_components/_dashboard/_organizations/OrganizationsBody";
import { FilterSidebar } from "@/app/_components/_dashboard/_organizations/FilterSidebar";
import ServerPagination from "@/app/_components/_website/_global/ServerPagination";
import FetchOrganizations from "@/app/_components/_dashboard/_organizations/fetchOrgamizations";

export default async function OrganizationsDashPage({ searchParams }: any) {
  const category_id = searchParams.category_id
    ? searchParams.category_id.split(",").map(Number)
    : undefined;

  const { page, query, status, rating, active, number_of_reservations } =
    await searchParams;

  const { data, pagination } = await FetchOrganizations({
    page,
    query,
    category_id,
    status,
    rating,
    active,
    number_of_reservations,
  });

  return (
    <div dir="rtl" className="min-h-screen w-[90%] mx-auto bg-gray-50">
      <div className="flex items-start gap-3 min-h-screen relative w-full">
        {/* Sidebar */}
        <FilterSidebar />

        {/* Main content */}
        <OrganizationsBody data={data} />
      </div>
      {pagination.last_page > 1 && (
        <ServerPagination
          currentPage={pagination.current_page || 1}
          totalPages={pagination.last_page}
        />
      )}
    </div>
  );
}
