"use client";

import { useLocale } from "next-intl";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FiBox,
  FiClock,
  FiUser,
  FiArrowRight,
  FiArrowLeft,
  FiFileText,
  FiTag,
} from "react-icons/fi";
import { AdminServiceOrder } from "./types";
import Img from "../../_website/_global/Img";

interface ServiceOrderCardProps {
  order: AdminServiceOrder;
  index?: number;
}

export default function ServiceOrderCard({
  order,
  index = 0,
}: ServiceOrderCardProps) {
  const locale = useLocale();
  const isAr = locale === "ar";

  // Format Date
  const date = new Date(order.created_at);
  const formattedDate = date.toLocaleDateString(isAr ? "ar-EG" : "en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const formattedTime = date.toLocaleTimeString(isAr ? "ar-EG" : "en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  // Status Styles
  const getStatusStyles = (status: string) => {
    switch (status) {
      case "completed":
        return { bg: "bg-emerald-500", text: "text-white", label: "مكتمل" };
      case "in_progress":
        return { bg: "bg-blue-500", text: "text-white", label: "جاري التنفيذ" };
      case "cancelled":
        return { bg: "bg-red-500", text: "text-white", label: "ملغى" };
      case "pending":
        return {
          bg: "bg-amber-500",
          text: "text-white",
          label: "قيد الانتظار",
        };
      default:
        return { bg: "bg-gray-500", text: "text-white", label: status };
    }
  };

  const statusStyle = getStatusStyles(order.status);
  const invoiceInfo = order.invoice;
  const serviceInfo = order.service;
  const userInfo = order.user;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: "easeOut" }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className="group relative bg-white rounded-[1.75rem] p-5 border border-gray-100 shadow-[0_4px_16px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] transition-shadow duration-300"
    >
      {/* Status Badge - Floating */}
      <div
        className={`absolute -top-3 ${
          isAr ? "left-4" : "right-4"
        } px-4 py-1.5 rounded-full ${statusStyle.bg} ${
          statusStyle.text
        } text-xs font-bold shadow-lg`}
      >
        {statusStyle.label}
      </div>

      {/* Top Row: ID & Date */}
      <div className="flex items-center justify-between mb-4 pt-2">
        <span className="font-mono text-sm font-bold text-gray-400">
          #{order.id}
        </span>
        <span className="text-xs text-gray-400 flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-lg">
          <FiClock size={11} />
          {formattedDate}
        </span>
      </div>

      {/* Main Content */}
      <div className="flex items-start gap-4 mb-4">
        {/* Image */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="w-20 h-20 shrink-0 rounded-2xl bg-linear-to-br from-gray-100 to-gray-50 overflow-hidden relative shadow-inner"
        >
          {serviceInfo?.gallery_images?.[0]?.path || serviceInfo?.image ? (
            <Img
              src={serviceInfo?.gallery_images?.[0]?.path || serviceInfo?.image}
              className="w-full h-full object-cover"
              alt={serviceInfo?.slug || "Service"}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300">
              <FiBox size={28} />
            </div>
          )}
        </motion.div>

        {/* Text Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-900 text-base leading-snug mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {serviceInfo?.slug?.replace(/-/g, " ") || "طلب خدمة"}
          </h3>

          {/* User Row */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-linear-to-br from-primary/20 to-primary/5 border-2 border-white shadow overflow-hidden shrink-0">
              {userInfo?.image ? (
                <Img
                  src={userInfo.image}
                  className="w-full h-full object-cover"
                  alt="User"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-primary/50">
                  <FiUser size={12} />
                </div>
              )}
            </div>
            <span className="text-xs font-medium text-gray-600 truncate max-w-[100px]">
              {userInfo?.name || "عميل"}
            </span>
            {order.user_type === "company" && (
              <span className="bg-purple-100 text-purple-600 text-[9px] font-bold px-2 py-0.5 rounded-full">
                شركة
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Metadata Section */}
      {Array.isArray(order.metadata) && order.metadata.length > 0 && (
        <div className="mb-4 p-3 bg-gray-50/80 rounded-xl border border-gray-100">
          <div className="flex items-center gap-1.5 text-xs text-gray-400 font-bold mb-2.5">
            <FiFileText size={11} />
            <span>تفاصيل إضافية</span>
          </div>
          <div className="space-y-2">
            {order.metadata
              .slice(0, 3)
              .map((item: { label: string; value: string }, idx: number) => (
                <div
                  key={idx}
                  className="flex items-center justify-between text-xs bg-white px-2.5 py-2 rounded-lg border border-gray-50"
                >
                  <span className="text-gray-500 flex items-center gap-1.5 font-medium">
                    <FiTag size={10} className="text-primary/40" />
                    {item.label}
                  </span>
                  <span className="font-bold text-gray-800 truncate max-w-[140px]">
                    {item.value}
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Footer: Price & Action */}
      <div className="pt-4 border-t border-dashed border-gray-100 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[10px] text-gray-400 font-medium mb-0.5">
            الإجمالي
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-black text-primary tracking-tight">
              {invoiceInfo?.total_invoice || "0"}
            </span>
            <span className="text-xs font-bold text-gray-400">
              {invoiceInfo?.currency || "OMR"}
            </span>
          </div>
        </div>

        <Link href={`/dashboard/serviceorders/${order.id}`}>
          <motion.div
            whileHover={{ scale: 1.1, rotate: isAr ? 45 : -45 }}
            whileTap={{ scale: 0.9 }}
            className="w-11 h-11 rounded-full bg-gray-900 text-white flex items-center justify-center shadow-lg shadow-gray-900/20"
          >
            {isAr ? <FiArrowLeft size={18} /> : <FiArrowRight size={18} />}
          </motion.div>
        </Link>
      </div>

      {/* Payment Status Indicator */}
      {invoiceInfo?.status && (
        <div
          className={`absolute top-1/2 -translate-y-1/2 ${
            isAr ? "-left-1" : "-right-1"
          } w-2 h-16 rounded-full ${
            invoiceInfo.status === "paid"
              ? "bg-emerald-400"
              : invoiceInfo.status === "unpaid"
              ? "bg-red-400"
              : "bg-amber-400"
          } shadow-lg`}
        />
      )}
    </motion.div>
  );
}
