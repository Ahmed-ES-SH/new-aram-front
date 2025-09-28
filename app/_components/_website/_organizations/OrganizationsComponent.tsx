"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Organization } from "@/app/_components/_dashboard/_organizations/types/organization";
import OrganizationGrid from "@/app/_components/_website/_organizations/OrganizationGrid";
import FilterSidebar from "./filters/FilterSidebar";
import { directionMap } from "@/app/constants/_website/global";
import ServerPagination from "../_global/ServerPagination";
import { FaFilter } from "react-icons/fa";
import { useAppDispatch, useAppSelector } from "@/app/Store/hooks";
import { setOrgsSidebar } from "@/app/Store/variablesSlice";

interface props {
  organizations: Organization[];
  pagination: {
    current_page: number;
    last_page: number;
  };
}

export default function OrganizationsComponent({
  organizations,
  pagination,
}: props) {
  const { orgsSidebar } = useAppSelector((state) => state.variables);
  const dispatch = useAppDispatch();

  const t = useTranslations("organizationPage");
  const locale = useLocale();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 250);
  }, []);

  return (
    <>
      <div
        dir={directionMap[locale]}
        className="min-h-screen lg:mt-32 mt-20 bg-gray-50 "
      >
        <div className="flex">
          <FilterSidebar />

          <div className="flex-1/2 lg:ml-0">
            {/* Main content */}
            <div className="lg:p-6 p-2">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold  pb-2 border-b border-primary text-gray-900 ">
                  {t("title")}
                </h2>
                <div
                  onClick={() => dispatch(setOrgsSidebar(!orgsSidebar))}
                  className="w-9 h-9 cursor-pointer bg-primary text-white rounded-lg flex items-center justify-center lg:hidden"
                >
                  <FaFilter className=" size-5" />
                </div>
              </div>
              <OrganizationGrid
                organizations={organizations}
                loading={loading}
              />
              {pagination && pagination.last_page > 1 && (
                <ServerPagination
                  currentPage={pagination.current_page ?? 1}
                  totalPages={pagination.last_page ?? 0}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
