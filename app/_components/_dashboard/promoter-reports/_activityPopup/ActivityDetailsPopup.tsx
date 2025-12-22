"use client";

import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiEye, FiUser, FiShoppingCart } from "react-icons/fi";
import { useState, useEffect } from "react";
import { ActivityItem, PurchaseItem } from "./types";
import ItemsPopup from "./ItemsPopup";
import VisitTable from "./VisitTable";
import SignupTable from "./SignupTable";
import PurchaseTable from "./PurchaseTable";

interface ActivityDetailsPopupProps {
  data: ActivityItem[];
  pagination: {
    currentPage: number;
    lastPage: number;
    total: number;
  };
  handlePageChange: (page: number) => void;
  activityType: "visit" | "signup" | "purchase" | string;
  onClose: () => void;
}

export default function ActivityDetailsPopup({
  data,
  pagination,
  handlePageChange,
  activityType,
  onClose,
}: ActivityDetailsPopupProps) {
  const [selectedItems, setSelectedItems] = useState<PurchaseItem[] | null>(
    null
  );

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const getTitle = () => {
    switch (activityType) {
      case "visit":
        return "تفاصيل الزيارات";
      case "signup":
        return "تفاصيل التسجيلات";
      case "purchase":
        return "تفاصيل المشتريات";
      default:
        return "تفاصيل النشاط";
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-99999 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-xl shadow-2xl lg:max-w-[90%] w-[98%] max-h-[90vh] flex flex-col overflow-hidden"
          dir="rtl"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b bg-gray-50">
            <div>
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                {activityType === "visit" && (
                  <FiEye className="text-blue-500" />
                )}
                {activityType === "signup" && (
                  <FiUser className="text-green-500" />
                )}
                {activityType === "purchase" && (
                  <FiShoppingCart className="text-purple-500" />
                )}
                {getTitle()}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                عدد السجلات: {data?.length || 0}
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-600"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-auto p-0">
            {activityType === "visit" && (
              <VisitTable
                handlePageChange={handlePageChange}
                currentPage={pagination.currentPage}
                lastPage={pagination.lastPage}
                data={data}
              />
            )}
            {activityType === "signup" && (
              <SignupTable
                handlePageChange={handlePageChange}
                currentPage={pagination.currentPage}
                lastPage={pagination.lastPage}
                data={data}
              />
            )}
            {activityType === "purchase" && (
              <PurchaseTable
                handlePageChange={handlePageChange}
                currentPage={pagination.currentPage}
                lastPage={pagination.lastPage}
                data={data}
                setSelectedItems={setSelectedItems}
              />
            )}
          </div>
        </motion.div>

        {/* Items Popup */}
        {selectedItems && (
          <ItemsPopup
            items={selectedItems}
            onClose={() => setSelectedItems(null)}
          />
        )}
      </div>
    </AnimatePresence>
  );
}
