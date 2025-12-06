"use client";
import Pagination from "@/app/_components/PaginationComponent";
import { instance } from "@/app/_helpers/axios";
import { easeOut, motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import LoadingSpinner from "../../_usercontrol/_wallet/_withdrawForm/LoadingSpinner";
import { directionMap } from "@/app/constants/_website/global";
import PromoterActivitiesBody from "./PromoterActivitiesBody";

export interface ActivityData {
  id: number;
  promoter_type: string;
  promoter_id: number;
  activity_type: string;
  ip_address: string;
  country: string;
  device_type: string;
  ref_code: string;
  commission_amount: number | null;
  activity_at: string;
  created_at: string;
}

interface PromoterActivitiesTableProps {
  data: ActivityData[];
  accountType: "user" | "organization";
  userId: number | string;
  pagination: {
    current_page: number;
    last_page: number;
  };
}

/**
 * PromoterActivitiesTable Component
 * Displays promoter activity data in a clean, animated table with localization support
 * Supports both LTR (English) and RTL (Arabic) layouts
 */
export default function PromoterActivitiesTable({
  data,
  pagination,
  accountType,
  userId,
}: PromoterActivitiesTableProps) {
  const locale = useLocale();
  const t = useTranslations("promoterTable");

  const [currentPage, setCurrentPage] = useState(pagination?.current_page ?? 1);
  const [lastPage, setLastPage] = useState(pagination?.last_page ?? 1);
  const [hydrated, setHydrated] = useState(false);
  const [currentData, setCurrentData] = useState<ActivityData[]>(data || []);
  const [loading, setLoading] = useState(false);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= lastPage) {
      setHydrated(true);
      setCurrentPage(newPage);
    }
  };

  // Container animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  };

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        setLoading(true);
        const response = await instance.get(
          `/promoter-activities?page=${currentPage}`
        );
        if (response.status == 200) {
          const data = response.data.data;
          const pagination = response.data.pagination;
          setCurrentData(data);
          setCurrentPage(pagination.current_page);
          setLastPage(pagination.last_page);
        }
      } catch (error: any) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    if (hydrated) fetchClientData();
  }, [currentPage, hydrated]);

  useEffect(() => {
    if (data) {
      setCurrentData(data);
    }
  }, [data]);

  if (loading) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className={`overflow-x-auto  rounded-lg border border-border`}
      dir={directionMap[locale]}
    >
      <table className="w-full">
        {/* Table Header */}
        <thead>
          <tr className="bg-muted border-b border-border">
            <th className="px-6 py-4 ltr:text-left rtl:text-right text-sm font-semibold text-foreground">
              {t("id")}
            </th>
            <th className="px-6 py-4 ltr:text-left rtl:text-right text-sm font-semibold text-foreground">
              {t("activityType")}
            </th>
            <th className="px-6 py-4 ltr:text-left rtl:text-right text-sm font-semibold text-foreground">
              {t("referralCode")}
            </th>
            <th className="px-6 py-4 ltr:text-left rtl:text-right text-sm font-semibold text-foreground">
              {t("commission")}
            </th>
            <th className="px-6 py-4 ltr:text-left rtl:text-right text-sm font-semibold text-foreground">
              {t("deviceType")}
            </th>
            <th className="px-6 py-4 ltr:text-left rtl:text-right text-sm font-semibold text-foreground">
              {t("createdDate")}
            </th>
          </tr>
        </thead>

        {/* Table Body */}
        <PromoterActivitiesBody data={currentData} t={t} />
      </table>

      {pagination && pagination.last_page > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={lastPage}
          onPageChange={handlePageChange}
        />
      )}
    </motion.div>
  );
}
