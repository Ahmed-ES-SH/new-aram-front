"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { VscLoading } from "react-icons/vsc";
import { toast } from "sonner";
import { instance } from "@/app/_helpers/axios";
import { FiSearch, FiX, FiUser, FiSend } from "react-icons/fi";
import Img from "../../../_global/Img";
import Pagination from "@/app/_components/PaginationComponent";

interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  image?: string;
}

interface DistributeCouponModalProps {
  isOpen: boolean;
  onClose: () => void;
  couponId: number;
  couponTitle: string;
}

export default function DistributeCouponModal({
  isOpen,
  onClose,
  couponId,
  couponTitle,
}: DistributeCouponModalProps) {
  const t = useTranslations("distributeCoupon");

  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [usage, setUsage] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);

    return () => clearTimeout(handler);
  }, [query]);

  // Fetch users when query changes
  useEffect(() => {
    if (!isOpen) return;

    if (!debouncedQuery) {
      setUsers([]);
      setLastPage(1);
      return;
    }

    const fetchUsers = async () => {
      setLoading(true);
      try {
        const endpoint = `/users-for-center?query=${debouncedQuery}&page=${currentPage}`;

        const response = await instance.get(endpoint);
        if (response.status === 200) {
          setUsers(response.data.data || []);
          setLastPage(response.data.pagination?.last_page || 1);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [debouncedQuery, currentPage, isOpen]);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setQuery("");
      setDebouncedQuery("");
      setSelectedUser(null);
      setUsage("");
      setCurrentPage(1);
    }
  }, [isOpen]);

  const handleDistribute = async () => {
    if (!selectedUser) {
      toast.error(t("selectUserFirst") || "يرجى تحديد مستخدم أولاً");
      return;
    }

    setSubmitting(true);
    try {
      const response = await instance.post("/distribute-coupon", {
        coupon_id: couponId,
        usage_limit: usage,
        user_id: selectedUser.id,
      });

      if (response.status === 200) {
        toast.success(
          response.data.message || t("success") || "تم توزيع الكوبون بنجاح"
        );
        onClose();
      }
    } catch (error: any) {
      console.error("Error distributing coupon:", error);
      const status = error?.response?.status;
      const message = error?.response?.data?.message;

      if (status === 403) {
        toast.error(
          message || t("forbidden") || "غير مصرح لك بتوزيع هذا الكوبون"
        );
      } else if (status === 422) {
        toast.error(
          message || t("validationError") || "خطأ في البيانات المدخلة"
        );
      } else {
        toast.error(message || t("error") || "حدث خطأ أثناء توزيع الكوبون");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= lastPage) {
      setCurrentPage(newPage);
    }
  };

  if (!isOpen) return null;

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9, y: -20 },
    visible: { opacity: 1, scale: 1, y: 0 },
  };

  return (
    <motion.div
      className="fixed inset-0 z-99999 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={backdropVariants}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden"
        variants={modalVariants}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <div className="bg-linear-to-r from-primary to-orange-500 text-white p-6 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
          >
            <FiX className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-3">
            <FiSend className="w-8 h-8" />
            <div>
              <h2 className="text-xl font-bold">
                {t("title") || "توزيع الكوبون"}
              </h2>
              <p className="text-white/80 text-sm mt-1">{couponTitle}</p>
            </div>
          </div>
        </div>

        {/* Search Input */}
        <div className="p-4 border-b shrink-0">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={
                t("searchPlaceholder") ||
                "ابحث بالاسم أو البريد أو رقم الهاتف..."
              }
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              dir="rtl"
            />
          </div>
        </div>

        {/* Users List */}
        <div className="p-4 overflow-y-auto min-h-[200px] bg-gray-50/50">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <VscLoading className="w-10 h-10 text-primary animate-spin" />
            </div>
          ) : users.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <FiUser className="w-16 h-16 mb-4 text-gray-300" />
              <p>
                {debouncedQuery
                  ? t("noUsersFound") || "لا يوجد مستخدمين مطابقين للبحث"
                  : t("startSearch") || "يرجى البحث لإظهار المستخدمين"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {users.map((user) => {
                const isSelected = selectedUser?.id === user.id;
                return (
                  <motion.div
                    key={user.id}
                    onClick={() => setSelectedUser(user)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`cursor-pointer border-2 rounded-xl p-4 flex items-center gap-3 transition-all ${
                      isSelected
                        ? "border-primary bg-primary/5 shadow-md"
                        : "border-gray-200 hover:border-primary/50"
                    }`}
                  >
                    <Img
                      src={user.image ?? "/defaults/male-noimage.jpg"}
                      errorSrc="/defaults/male-noimage.jpg"
                      alt={user.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p
                        className={`font-medium truncate ${
                          isSelected ? "text-primary" : "text-gray-800"
                        }`}
                      >
                        {user.name || t("noName") || "بدون اسم"}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {user.email ||
                          user.phone ||
                          t("noContact") ||
                          "لا يوجد بيانات تواصل"}
                      </p>
                    </div>
                    {isSelected && (
                      <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {!loading && users.length > 0 && lastPage > 1 && (
            <div className="mt-4">
              <Pagination
                currentPage={currentPage}
                totalPages={lastPage}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>

        {/* Selected User Usage Input */}
        {selectedUser && (
          <div className="p-4 border-t bg-white shrink-0">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("currentUsage") || "الاستخدام الحالي للكوبون"}
            </label>
            <input
              type="number"
              value={usage}
              onChange={(e) => setUsage(e.target.value)}
              placeholder={t("enterUsage") || "أدخل عدد مرات الاستخدام..."}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              dir="rtl"
              min="0"
            />
          </div>
        )}

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50 flex items-center justify-between gap-3 shrink-0">
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-gray-600 hover:text-gray-800 font-medium transition-colors"
          >
            {t("cancel") || "إلغاء"}
          </button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleDistribute}
            disabled={!selectedUser || submitting}
            className={`px-6 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-all ${
              selectedUser && !submitting
                ? "bg-primary text-white hover:bg-orange-600"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            {submitting ? (
              <VscLoading className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <FiSend className="w-5 h-5" />
                {t("distribute") || "توزيع"}
              </>
            )}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
