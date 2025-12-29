"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiAlertCircle, FiChevronRight, FiChevronLeft } from "react-icons/fi";
import { FaReceipt } from "react-icons/fa";
import { useLocale } from "next-intl";
import { ServiceOrder } from "./orderTypes";
import { formatTitle } from "@/app/_helpers/helpers";
import LocaleLink from "../_global/LocaleLink";
import ServiceTimeLine from "./_serviceOrderView/ServiceTimeLine";
import SummaryPopup from "./_serviceOrderView/SummaryPopup";
import ServiceOrderCardHeader from "./_serviceOrderView/ServiceOrderCardHeader";

export default function ModernServiceOrderCard({
  order,
}: {
  order: ServiceOrder;
}) {
  const locale = useLocale();
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Helper to safely get metadata
  const getMetadata = () => {
    if (Array.isArray(order.metadata)) return order.metadata;
    return (order.metadata as any)?.items?.metadata || [];
  };

  const metadataList = getMetadata();
  const hasMetadata = metadataList && metadataList.length > 0;

  // FIX: Prioritize order.status for timeline logic, fallback to pending if null.
  const currentStatus = order.status || "pending";

  const isCanceledOrRefunded = ["canceled", "refunded", "failed"].includes(
    currentStatus
  );

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className="relative w-full"
      >
        {/* Glow effect on hover: using primary color opacity */}
        <motion.div
          animate={{
            opacity: isHovered ? 0.4 : 0,
            scale: isHovered ? 1 : 0.95,
          }}
          className="absolute -inset-0.5 bg-primary rounded-3xl blur-lg transition-colors"
        />

        <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-gray-200/50 border border-white/20 overflow-hidden">
          {/* Decorative bar: using primary color */}
          <div className="h-1.5 bg-primary" />

          <div className="p-6 space-y-5">
            {/* Header Section */}
            <ServiceOrderCardHeader order={order} />

            {/* Timeline Section */}
            <div className="pt-4">
              {isCanceledOrRefunded ? (
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="w-full py-3 bg-red-50 rounded-xl flex items-center justify-center gap-2 text-red-600 border border-red-100"
                >
                  <FiAlertCircle className="animate-pulse" />
                  <span className="font-semibold capitalize text-sm">
                    {currentStatus.replace(/_/g, " ")}
                  </span>
                </motion.div>
              ) : (
                <div className="space-y-3">
                  {/* Status label */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-500">
                      {locale == "ar" ? "الحالة" : "Status"}
                    </span>
                    <span className="text-xs font-bold text-primary capitalize">
                      {currentStatus.replace(/_/g, " ")}
                    </span>
                  </div>

                  {/* Timeline */}
                  <ServiceTimeLine currentStatus={currentStatus} />
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center max-md:flex-col max-md:w-full max-md:items-start w-fit ltr:ml-auto rtl:mr-auto gap-3 pt-2">
              {hasMetadata && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsSummaryOpen(true)}
                  className="flex-1 max-md:w-full flex items-center justify-center gap-2 lg:px-8 px-4 lg:py-3 py-2.5 rounded-xl text-sm font-semibold text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 transition-all"
                >
                  <FaReceipt className="text-gray-500" size={14} />
                  {locale === "ar" ? "تفاصيل" : "Details"}
                </motion.button>
              )}

              <LocaleLink
                href={`/usercontrolpanel/myorders/${formatTitle(
                  order.service.slug
                )}?orderId=${order.id}`}
                className="flex-1 max-md:w-full"
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full whitespace-nowrap flex items-center justify-center gap-2 lg:px-8 px-4 lg:py-3 py-2.5 rounded-xl text-sm font-bold text-white bg-primary hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/30 transition-all"
                >
                  {locale === "ar" ? "تتبع" : "Track Order"}
                  {locale == "ar" ? (
                    <FiChevronLeft className="size-6" />
                  ) : (
                    <FiChevronRight className="size-6" />
                  )}
                </motion.button>
              </LocaleLink>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Modern Summary Modal */}
      <AnimatePresence>
        {isSummaryOpen && (
          <SummaryPopup setIsSummaryOpen={setIsSummaryOpen} order={order} />
        )}
      </AnimatePresence>
    </>
  );
}
