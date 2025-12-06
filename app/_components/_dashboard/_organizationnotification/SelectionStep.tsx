"use client";
import { useEffect, useState } from "react";
import { Organization, OrganizationSelection } from "./types";
import { AnimatePresence, motion } from "framer-motion";
import {
  FiAlertCircle,
  FiCheckCircle,
  FiSearch,
  FiSend,
  FiUserCheck,
  FiX,
  FiXCircle,
} from "react-icons/fi";
import OrganizationSelectionCard from "./OrganizationSelectionCard";
import Pagination from "../../PaginationComponent";
import { instance } from "@/app/_helpers/axios";

// مكون خطوة الاختيار
interface SelectionStepProps {
  organizations: Organization[];
  selectedIds: number[];
  last_page: number;
  onSelectionChange: (ids: number[]) => void;
  onNextStep: () => void;
}

export default function SelectionStep({
  organizations: data,
  selectedIds,
  last_page,
  onSelectionChange,
  onNextStep,
}: SelectionStepProps) {
  const [organizations, setOrganizations] = useState<Organization[]>(
    data ?? []
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOrgs, setFilteredOrgs] = useState<OrganizationSelection[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(last_page ?? 1);
  const [hyprid, setHyprid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= lastPage) {
      if (!hyprid) setHyprid(true);
      setCurrentPage(newPage);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await instance.get(`/dashboard/organizations-table`, {
        params: {
          page: currentPage,
          query: debouncedQuery,
        },
      });
      if (response.status == 200) {
        setOrganizations(response.data.data);
        setLastPage(response.data.pagination.last_page);
      }
    } catch (error: any) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (hyprid) fetchData();
  }, [currentPage]);

  useEffect(() => {
    if (query.length > 2) {
      setHyprid(true);
    }

    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);
    return () => clearTimeout(timer);
  }, [query]);

  // تحويل البيانات إلى صيغة الاختيار
  useEffect(() => {
    const orgsList = organizations.map((org) => ({
      ...org,
      selected: selectedIds.includes(org.id),
    }));

    const filtered =
      searchTerm.trim() === ""
        ? orgsList
        : orgsList.filter(
            (org) =>
              org.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
              org.email.toLowerCase().includes(searchTerm.toLowerCase())
          );

    setFilteredOrgs(filtered);
  }, [organizations, selectedIds, searchTerm]);

  const toggleOrganization = (id: number) => {
    const newSelected = selectedIds.includes(id)
      ? selectedIds.filter((selectedId) => selectedId !== id)
      : [...selectedIds, id];

    onSelectionChange(newSelected);
  };

  const selectAll = () => {
    const allIds = organizations.map((org) => org.id);
    onSelectionChange(allIds);
  };

  const clearAll = () => {
    onSelectionChange([]);
  };

  return (
    <div className="space-y-6">
      {/* رأس الخطوة */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mb-3">
          <FiUserCheck className="w-6 h-6 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">اختر المراكز</h2>
        <p className="text-gray-600 mt-2">
          حدد المراكز التي تريد إرسال الإشعار إليها
        </p>
      </div>

      {/* إحصائيات */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
          <p className="text-sm text-blue-700">الكل</p>
          <p className="text-2xl font-bold text-blue-900 mt-1">
            {organizations.length}
          </p>
        </div>

        <div className="bg-green-50 rounded-xl p-4 border border-green-100">
          <p className="text-sm text-green-700">المحددة</p>
          <p className="text-2xl font-bold text-green-900 mt-1">
            {selectedIds.length}
          </p>
        </div>

        <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
          <p className="text-sm text-amber-700">نشطة</p>
          <p className="text-2xl font-bold text-amber-900 mt-1">
            {organizations.filter((o) => o.status === "published").length}
          </p>
        </div>

        <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
          <p className="text-sm text-purple-700">قيد المراجعة</p>
          <p className="text-2xl font-bold text-purple-900 mt-1">
            {organizations.filter((o) => o.status === "under_review").length}
          </p>
        </div>
      </motion.div>

      {/* شريط البحث */}
      <div className="relative">
        <FiSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="ابحث عن مركز بالاسم أو البريد الإلكتروني..."
          className="w-full pl-4 pr-10 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm("")}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <FiX className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* أزرار الاختيار الجماعي */}
      <div className="flex gap-3">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={selectAll}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors duration-200"
        >
          <FiCheckCircle className="w-5 h-5" />
          تحديد الكل
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={clearAll}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors duration-200"
        >
          <FiXCircle className="w-5 h-5" />
          إلغاء الكل
        </motion.button>
      </div>

      {/* قائمة المراكز */}
      <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-2">
        <AnimatePresence>
          {filteredOrgs.length > 0 ? (
            filteredOrgs.map((org) => (
              <OrganizationSelectionCard
                key={org.id}
                organization={org}
                onToggle={toggleOrganization}
              />
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <FiAlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">
                لم يتم العثور على مراكز مطابقة للبحث
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={lastPage}
        onPageChange={handlePageChange}
      />

      {/* زر التالي */}
      <div className="pt-4 border-t border-gray-200">
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: selectedIds.length > 0 ? 1 : 0.5 }}
          whileHover={selectedIds.length > 0 ? { scale: 1.02 } : {}}
          whileTap={selectedIds.length > 0 ? { scale: 0.98 } : {}}
          onClick={selectedIds.length > 0 ? onNextStep : undefined}
          disabled={selectedIds.length === 0}
          className={`w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-semibold text-lg transition-all duration-200 ${
            selectedIds.length > 0
              ? "bg-linear-to-r from-blue-600 to-blue-700 text-white hover:shadow-lg"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
        >
          <span>متابعة لإرسال الإشعار ({selectedIds.length})</span>
          <FiSend className="w-5 h-5" />
        </motion.button>

        {selectedIds.length === 0 && (
          <p className="text-center text-sm text-gray-500 mt-2">
            يجب تحديد مركز واحد على الأقل للمتابعة
          </p>
        )}
      </div>
    </div>
  );
}
