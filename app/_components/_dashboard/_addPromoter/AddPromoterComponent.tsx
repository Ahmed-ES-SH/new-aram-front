"use client";
import React, { ChangeEvent, useEffect, useState } from "react";
import { instance } from "@/app/_helpers/axios";
import { CiNoWaitingSign, CiSettings, CiSearch } from "react-icons/ci";
import { motion, AnimatePresence } from "framer-motion";
import { LuCheck, LuUserPlus, LuUsers } from "react-icons/lu";
import { FiPercent, FiCode, FiUser } from "react-icons/fi";
import { MdOutlineDisabledByDefault } from "react-icons/md";
import Img from "../../_website/_global/Img";
import Pagination from "../../PaginationComponent";
import { toast } from "sonner";
import { VscLoading } from "react-icons/vsc";
import { useRouter } from "next/navigation";
import { FaUsersSlash } from "react-icons/fa";

interface promoter {
  promoter_type: "user" | "organization";
  promoter_id: number;
  referral_code: string;
  discount_percentage: number;
  status: "active" | "disabled";
  total_visits: number;
  total_signups: number;
  total_purchases: number;
  total_earnings: number;
}

interface MiniUser {
  id: number;
  name: string;
  email: string;
  phone: string;
  image: string;
}

interface props {
  data: MiniUser[];
  last_page: number;
}

export default function AddPromoterComponent({ data, last_page }: props) {
  const router = useRouter();

  const [users, setUsers] = useState<MiniUser[]>(data ?? []);
  const [selectedUser, setSelectedUser] = useState<MiniUser | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [lastPage, setLastPage] = useState<number>(last_page ?? 1);
  const [query, setQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const [hybride, setHybride] = useState<boolean>(false);
  const [formData, setFormData] = useState<Partial<promoter>>({
    promoter_type: "user",
    status: "active",
    discount_percentage: 1,
    referral_code: "",
  });

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= lastPage) {
      setHybride(true);
      setCurrentPage(newPage);
    }
  };

  const handleSelectUser = (user: MiniUser) => {
    setSelectedUser(user);
    setFormData((prev) => ({
      ...prev,
      promoter_id: user.id,
      referral_code: Math.random().toString(36).substring(2, 10).toUpperCase(),
    }));
  };

  const handleInputChange = (field: keyof promoter, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddPromoter = async () => {
    if (!selectedUser) {
      toast.error("يرجى اختيار مستخدم أولاً");
      return;
    }

    if (!formData.discount_percentage || formData.discount_percentage <= 0) {
      toast.error("يرجى إدخال نسبة خصم صحيحة");
      return;
    }

    try {
      setLoading(true);
      const response = await instance.post("/add-promoter", formData);
      if (response.status == 201) {
        setSelectedUser(null);
        setFormData({
          promoter_type: "user",
          status: "active",
          discount_percentage: 1,
          referral_code: "",
        });
        toast.success("تم اضافة المروج الى قائمة المروجين بنجاح");
        setTimeout(() => {
          router.push(`/dashboard/promoters`);
        }, 400);
      }
    } catch (error: any) {
      console.log(error);
      const message =
        error?.response?.data?.message ?? "حدث خطأ أثناء إضافة المروج";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleFetchData = async () => {
      try {
        setLoading(true);
        // لاحظ أننا نستخدم debouncedQuery هنا بدلاً من query
        // ونقوم بإرسال طلب حتى لو كان البحث فارغاً (حسب منطق تطبيقك)
        // يمكنك إضافة شرط هنا إذا كنت لا تريد البحث بأقل من حرفين
        if (
          debouncedQuery &&
          debouncedQuery.length > 0 &&
          debouncedQuery.length <= 2
        ) {
          setLoading(false);
          return;
        }

        const response = await instance.get(
          `/users-with-selected-data?for_promoters=1&page=${currentPage}&query=${debouncedQuery}`
        );
        setUsers(response.data.data);
        setLastPage(response.data.pagination.last_page);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    if (hybride) {
      handleFetchData();
    }
  }, [currentPage, debouncedQuery, hybride]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
      setCurrentPage(1);
      if (!hybride && query.length > 2) setHybride(true);
    }, 600);

    return () => {
      clearTimeout(handler);
    };
  }, [query]); // يعمل فقط عندما يتغير النص المكتوب

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 p-6">
      <div className="lg:max-w-[90%] w-full mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <LuUserPlus className="text-2xl text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              إضافة مروج جديد
            </h1>
          </div>
          <p className="text-gray-600">
            اختر مستخدمًا من القائمة وأضف بيانات الترويج الخاصة به
          </p>
        </motion.div>

        <div className="flex items-start gap-2 justify-between max-lg:flex-col lg:gap-8 w-full">
          {/* Users List Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex-1/2 max-lg:w-full"
          >
            <div className="flex items-center justify-between gap-4 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <LuUsers className="text-primary" />
                قائمة المستخدمين
              </h2>
              <div className="relative flex-1 max-w-md">
                <CiSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
                <input
                  type="text"
                  placeholder="ابحث عن مستخدم بالاسم أو البريد الإلكتروني..."
                  value={query}
                  disabled={loading}
                  onChange={(e) => setQuery(e.target.value)}
                  className="disabled:opacity-50 w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                />
              </div>
            </div>

            {loading ? (
              <div className="w-full min-h-96 flex items-center justify-center">
                <VscLoading className="size-24 animate-spin text-primary" />
              </div>
            ) : (
              <div className="">
                {/* Users Grid */}
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  <AnimatePresence>
                    {users.length == 0 ? (
                      <div className="min-h-[40vh] flex items-center justify-center">
                        <div className="flex flex-col items-center gap-4">
                          <FaUsersSlash className="lg:size-24 size-12 text-primary" />
                          <p className="text-gray-500">
                            جميع المستخدمين اصبحوا مروجين بالفعل
                          </p>
                        </div>
                      </div>
                    ) : (
                      users.map((user, index) => (
                        <motion.div
                          key={user.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ delay: index * 0.1 }}
                          className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                            selectedUser?.id === user.id
                              ? "border-primary bg-primary/5"
                              : "border-gray-200 hover:border-primary/50 hover:bg-gray-50"
                          }`}
                          onClick={() => handleSelectUser(user)}
                        >
                          <div className="flex items-center gap-4">
                            <div className="relative">
                              <Img
                                src={user.image}
                                alt={user.name}
                                className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                              />
                              {selectedUser?.id === user.id && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="absolute -bottom-1 -right-1 bg-primary text-white p-1 rounded-full"
                                >
                                  <LuCheck className="text-xs" />
                                </motion.div>
                              )}
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900">
                                {user.name}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {user.email}
                              </p>
                              <p className="text-sm text-gray-500">
                                {user.phone}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </AnimatePresence>
                </div>

                {/* Pagination */}
                {lastPage > 1 && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={lastPage}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}
              </div>
            )}
          </motion.div>

          {/* Promoter Form Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex-1 max-lg:w-full"
          >
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2 mb-6">
              <CiSettings className="text-primary" />
              بيانات المروج
            </h2>

            {selectedUser ? (
              <div className="space-y-6">
                {/* Selected User Info */}
                <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <Img
                      src={selectedUser.image}
                      alt={selectedUser.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-white"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {selectedUser.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {selectedUser.email}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="space-y-4">
                  {/* Referral Code */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <FiCode className="text-primary" />
                      كود الإحالة
                    </label>
                    <input
                      type="text"
                      value={formData.referral_code}
                      onChange={(e) =>
                        handleInputChange("referral_code", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                      placeholder="أدخل كود الإحالة..."
                    />
                  </div>

                  {/* Discount Percentage */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <FiPercent className="text-primary" />
                      نسبة الخصم (%)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={formData.discount_percentage}
                      onChange={(e) =>
                        handleInputChange("discount_percentage", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                    />
                  </div>

                  {/* Status */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <FiUser className="text-primary" />
                      الحالة
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => handleInputChange("status", "active")}
                        className={`p-3 rounded-lg border-2 transition-all flex items-center justify-center gap-2 ${
                          formData.status === "active"
                            ? "border-primary bg-primary text-white"
                            : "border-gray-300 text-gray-700 hover:border-primary/50"
                        }`}
                      >
                        <LuCheck className="text-lg" />
                        نشط
                      </button>
                      <button
                        type="button"
                        onClick={() => handleInputChange("status", "disabled")}
                        className={`p-3 rounded-lg border-2 transition-all flex items-center justify-center gap-2 ${
                          formData.status === "disabled"
                            ? "border-red-500 bg-red-500 text-white"
                            : "border-gray-300 text-gray-700 hover:border-red-300"
                        }`}
                      >
                        <MdOutlineDisabledByDefault className="text-lg" />
                        غير نشط
                      </button>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddPromoter}
                  disabled={loading}
                  className="w-full bg-primary text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      جاري الإضافة...
                    </>
                  ) : (
                    <>
                      <LuUserPlus className="text-lg" />
                      إضافة المروج
                    </>
                  )}
                </motion.button>
              </div>
            ) : (
              /* Empty State */
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CiNoWaitingSign className="text-4xl text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  لم يتم اختيار مستخدم
                </h3>
                <p className="text-gray-600">
                  يرجى اختيار مستخدم من القائمة على اليسار لبدء إضافته كمروج
                </p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
