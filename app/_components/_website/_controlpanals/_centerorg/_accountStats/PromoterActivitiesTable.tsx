"use client";
import Pagination from "@/app/_components/PaginationComponent";
import { instance } from "@/app/_helpers/axios";
import { easeOut, motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import {
  FaShoppingCart,
  FaEye,
  FaLink,
  FaUser,
  FaMobile,
  FaTabletAlt,
  FaDesktop,
} from "react-icons/fa";
import LoadingSpinner from "../../_usercontrol/_wallet/_withdrawForm/LoadingSpinner";

interface ActivityData {
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
  const isRTL = locale === "ar";

  // Get activity type icon
  const getActivityIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "purchase":
        return <FaShoppingCart className="w-4 h-4" />;
      case "visit":
        return <FaEye className="w-4 h-4" />;
      case "referral":
        return <FaLink className="w-4 h-4" />;
      default:
        return <FaUser className="w-4 h-4" />;
    }
  };

  // Get device type icon
  const getDeviceIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "mobile":
        return <FaMobile className="w-4 h-4" />;
      case "tablet":
        return <FaTabletAlt className="w-4 h-4" />;
      case "desktop":
        return <FaDesktop className="w-4 h-4" />;
      default:
        return <FaDesktop className="w-4 h-4" />;
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale === "en" ? "en-US" : "ar-SA", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Format commission
  const formatCommission = (amount: number | null) => {
    if (amount === null) return "—";
    return `$${amount.toFixed(2)}`;
  };

  const [currentPage, setCurrentPage] = useState(pagination.current_page ?? 1);
  const [lastPage, setLastPage] = useState(pagination.last_page ?? 1);
  const [hydrated, setHydrated] = useState(false);
  const [currentData, setCurrentData] = useState<ActivityData[]>([]);
  const [loading, setLoading] = useState(false);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= lastPage) {
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

  // Row animation variants
  const rowVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: easeOut },
    },
  };

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        setLoading(true);
        const response = await instance.get(
          `/user-activites?user_id=${userId}&user_type=${accountType}&page=${currentPage}`
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

    if (hydrated && currentPage !== 1) fetchClientData();
  }, [accountType, currentPage, hydrated, userId]);

  useEffect(() => {
    if (data) {
      setCurrentData(data);
      setHydrated(false);
    }
  }, [data]);

  if (currentData.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12"
      >
        <p className="text-muted-foreground text-lg">{t("noData")}</p>
      </motion.div>
    );
  }

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
      className={`overflow-x-auto min-h-screen rounded-lg border border-border ${
        isRTL ? "rtl" : "ltr"
      }`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <table className="w-full">
        {/* Table Header */}
        <thead>
          <tr className="bg-muted border-b border-border">
            <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
              {t("id")}
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
              {t("activityType")}
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
              {t("country")}
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
              {t("deviceType")}
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
              {t("ipAddress")}
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
              {t("referralCode")}
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
              {t("commission")}
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
              {t("createdDate")}
            </th>
          </tr>
        </thead>

        {/* Table Body */}
        <tbody>
          {data.map((row, index) => (
            <motion.tr
              key={row.id}
              variants={rowVariants}
              whileHover="hover"
              custom={index}
              className="border-b border-border hover:bg-muted/50 transition-colors cursor-pointer"
            >
              {/* ID Column */}
              <td className="px-6 py-4 text-sm text-foreground font-medium">
                #{row.id}
              </td>

              {/* Activity Type Column */}
              <td className="px-6 py-4 text-sm text-foreground">
                <div className="flex items-center gap-2">
                  <span className="text-primary">
                    {getActivityIcon(row.activity_type)}
                  </span>
                  <span className="capitalize">{row.activity_type}</span>
                </div>
              </td>

              {/* Country Column */}
              <td className="px-6 py-4 text-sm text-foreground">
                {row.country}
              </td>

              {/* Device Type Column */}
              <td className="px-6 py-4 text-sm text-foreground">
                <div className="flex items-center gap-2">
                  <span className="text-primary">
                    {getDeviceIcon(row.device_type)}
                  </span>
                  <span className="capitalize">{row.device_type}</span>
                </div>
              </td>

              {/* IP Address Column */}
              <td className="px-6 py-4 text-sm text-muted-foreground font-mono">
                {row.ip_address}
              </td>

              {/* Referral Code Column */}
              <td className="px-6 py-4 text-sm text-foreground font-mono font-semibold">
                {row.ref_code}
              </td>

              {/* Commission Column */}
              <td className="px-6 py-4 text-sm text-foreground font-semibold">
                {formatCommission(row.commission_amount)}
              </td>

              {/* Created Date Column */}
              <td className="px-6 py-4 text-sm text-muted-foreground">
                {formatDate(row.created_at)}
              </td>
            </motion.tr>
          ))}
        </tbody>
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
