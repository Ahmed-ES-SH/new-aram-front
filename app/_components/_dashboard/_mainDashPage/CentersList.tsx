"use client";
import { FaCalendarAlt, FaEye, FaEyeSlash, FaEdit } from "react-icons/fa";
import CenterCard from "./CenterCard";
import { useState } from "react";

// أنواع TypeScript
export interface Center {
  id: number;
  title: string;
  email: string;
  phone_number: string;
  logo: string;
  status: "published" | "not_published";
  number_of_reservations: number;
  created_at: string;
}

// مكون رئيسي لعرض قائمة المراكز
interface CentersListProps {
  organizations: Center[];
}

export default function OrganizationsList({
  organizations: data,
}: CentersListProps) {
  const [organizations, setOrganizations] = useState<Center[]>(data ?? []);

  const onStatusChange = (id: number, newStatus: Center["status"]) => {
    setOrganizations((prev) =>
      prev.map((org) => (org.id === id ? { ...org, status: newStatus } : org))
    );
  };
  const onDelete = (id: number) => {
    setOrganizations((prev) => prev.filter((org) => org.id !== id));
  };

  return (
    <div className="p-4 border-t border-gray-200 pt-12 mt-12">
      {/* عنوان القائمة */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">اخر المراكز</h1>
        <p className="text-gray-600 mt-1">
          إدارة وعرض اخر 50 من المراكز المسجلة في النظام
        </p>
      </div>

      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">إجمالي المراكز</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">
                {organizations.length}
              </p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <FaEdit className="text-blue-600 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">المراكز المنشورة</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">
                {organizations.filter((c) => c.status === "published").length}
              </p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <FaEye className="text-green-600 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">المراكز غير المنشورة</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">
                {
                  organizations.filter((c) => c.status === "not_published")
                    .length
                }
              </p>
            </div>
            <div className="bg-amber-50 p-3 rounded-lg">
              <FaEyeSlash className="text-amber-600 text-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* قائمة المراكز */}
      {organizations.length > 0 ? (
        <div className="grid grid-cols-1 xl:grid-cols-2  gap-6">
          {organizations.map((center, index) => (
            <CenterCard
              key={center.id}
              center={center}
              onStatusChange={onStatusChange}
              onDelete={onDelete}
              index={index}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl p-8 text-center shadow-sm border border-gray-200">
          <div className="text-gray-400 mb-4">
            <FaCalendarAlt className="text-5xl mx-auto" />
          </div>
          <h3 className="text-xl font-bold text-gray-700 mb-2">
            لا توجد مراكز
          </h3>
          <p className="text-gray-500">
            لم يتم العثور على مراكز طبية في النظام
          </p>
        </div>
      )}
    </div>
  );
}
