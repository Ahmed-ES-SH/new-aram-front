"use client";

import { motion } from "framer-motion";
import {
  FiEye,
  FiUserPlus,
  FiShoppingCart,
  FiDollarSign,
  FiTag,
  FiPercent,
  FiCheckCircle,
  FiXCircle,
} from "react-icons/fi";
import { Promoter, PromotionActivity } from "./types";
import useFetchData from "@/app/_helpers/FetchDataWithAxios";
import { useEffect, useState } from "react";
import ActivityDetailsPopup from "./_activityPopup/ActivityDetailsPopup";

interface SummaryKPIsProps {
  promoter: Partial<Promoter>;
}

type activeType = "visit" | "signup" | "purchase" | "";

interface KPI {
  title: string;
  type?: activeType;
  value: number | string | undefined;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
  handleClick?: (type: activeType) => void;
}

interface dataType {
  visit: PromotionActivity[] | null;
  signup: PromotionActivity[] | null;
  purchase: PromotionActivity[] | null;
}

interface paginationItem {
  currentPage: number;
  lastPage: number;
  total: number;
}

interface paginationType {
  visit: paginationItem;
  signup: paginationItem;
  purchase: paginationItem;
}

export default function SummaryKPIs({ promoter }: SummaryKPIsProps) {
  // stats
  const [openPopup, setOpenPopup] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<activeType>("");
  const [data, setData] = useState<Partial<dataType>>({
    visit: [],
    signup: [],
    purchase: [],
  });
  const [pagination, setPagination] = useState<paginationType>({
    visit: {
      currentPage: 1,
      lastPage: 1,
      total: 0,
    },
    signup: {
      currentPage: 1,
      lastPage: 1,
      total: 0,
    },
    purchase: {
      currentPage: 1,
      lastPage: 1,
      total: 0,
    },
  });

  // Corrected API calls
  const visitsResponse = useFetchData<PromotionActivity[]>(
    `/promoter-activities-by-type?promoter_id=${promoter.promoter_id}&promoter_type=${promoter.promoter_type}&activity_type=visit&page=${pagination?.visit?.currentPage}`,
    true
  );
  const signupsResponse = useFetchData<PromotionActivity[]>(
    `/promoter-activities-by-type?promoter_id=${promoter.promoter_id}&promoter_type=${promoter.promoter_type}&activity_type=signup&page=${pagination?.signup?.currentPage}`,
    true
  );
  const purchasesResponse = useFetchData<PromotionActivity[]>(
    `/promoter-activities-by-type?promoter_id=${promoter.promoter_id}&promoter_type=${promoter.promoter_type}&activity_type=purchase&page=${pagination?.purchase?.currentPage}`,
    true
  );
  const handleActiveTab = (type: activeType) => {
    setSelectedActivity(type);
    setOpenPopup(true);
  };

  const handlePageChange = (type: activeType, page: number) => {
    setSelectedActivity(type);
    setPagination((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        currentPage: page,
      },
    }));
    setOpenPopup(true);
  };

  const kpis: KPI[] = [
    {
      title: "إجمالي الزيارات",
      type: "visit",
      value: promoter?.total_visits,
      icon: FiEye,
      color: "bg-blue-500",
      bgColor:
        "bg-blue-50 group hover:bg-blue-400 hover:text-white hover:scale-105 cursor-pointer duration-300",
      handleClick: () => handleActiveTab("visit"),
    },
    {
      title: "إجمالي التسجيلات",
      type: "signup",
      value: promoter?.total_signups,
      icon: FiUserPlus,
      color: "bg-green-500",
      bgColor:
        "bg-green-50 group hover:bg-green-400 hover:text-white hover:scale-105 cursor-pointer duration-300",
      handleClick: () => handleActiveTab("signup"),
    },
    {
      title: "إجمالي المشتريات",
      type: "purchase",
      value: promoter?.total_purchases,
      icon: FiShoppingCart,
      color: "bg-purple-500",
      bgColor:
        "bg-purple-50 group hover:bg-purple-400 hover:text-white hover:scale-105 cursor-pointer duration-300",
      handleClick: () => handleActiveTab("purchase"),
    },
    {
      title: "إجمالي الأرباح",
      value: `${promoter?.total_earnings} ر.ع`,
      icon: FiDollarSign,
      color: "bg-amber-500",
      bgColor: "bg-amber-50",
    },
    {
      title: "كود المروج",
      value: promoter.referral_code,
      icon: FiTag,
      color: "bg-cyan-500",
      bgColor: "bg-cyan-50",
    },
    {
      title: "نسبة الخصم",
      value: `${promoter.discount_percentage}%`,
      icon: FiPercent,
      color: "bg-pink-500",
      bgColor: "bg-pink-50",
    },

    {
      title: "حالة المروج",
      value: promoter.status == "active" ? "نشط" : "معطل",
      icon: promoter.status == "active" ? FiCheckCircle : FiXCircle,
      color: promoter.status == "active" ? "bg-green-500" : "bg-red-500",
      bgColor: promoter.status == "active" ? "bg-green-50" : "bg-red-50",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  // Set collected data
  useEffect(() => {
    setData({
      visit: visitsResponse.data,
      signup: signupsResponse.data,
      purchase: purchasesResponse.data,
    });

    setPagination({
      visit: {
        currentPage: visitsResponse.currentPage,
        lastPage: visitsResponse.lastPage,
        total: visitsResponse.total,
      },
      signup: {
        currentPage: signupsResponse.currentPage,
        lastPage: signupsResponse.lastPage,
        total: signupsResponse.total,
      },
      purchase: {
        currentPage: purchasesResponse.currentPage,
        lastPage: purchasesResponse.lastPage,
        total: purchasesResponse.total,
      },
    });
  }, [visitsResponse.data, signupsResponse.data, purchasesResponse.data]);

  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4"
    >
      <h2 className="text-xl font-bold text-foreground">
        لوحة المؤشرات العامة
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            onClick={() =>
              kpi.handleClick && kpi.type && kpi.handleClick(kpi.type)
            }
            className={`${kpi.bgColor} rounded-xl p-5 border border-border/50`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground group-hover:text-white duration-300 mb-1">
                  {kpi.title}
                </p>
                <p className="text-2xl font-bold text-foreground group-hover:text-white duration-300">
                  {kpi.value}
                </p>
              </div>

              <div className={`${kpi.color} p-2.5 rounded-lg`}>
                <kpi.icon className="w-5 h-5 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {openPopup && selectedActivity && (
        <ActivityDetailsPopup
          data={data[selectedActivity] as any}
          pagination={pagination && (pagination[selectedActivity] as any)}
          handlePageChange={(page) => handlePageChange(selectedActivity, page)}
          activityType={selectedActivity}
          onClose={() => setOpenPopup(false)}
        />
      )}
    </motion.section>
  );
}
