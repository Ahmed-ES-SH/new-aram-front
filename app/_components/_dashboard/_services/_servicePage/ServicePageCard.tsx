"use client";

import { motion } from "framer-motion";
import { Dispatch, SetStateAction, useState } from "react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { LiaToggleOffSolid, LiaToggleOnSolid } from "react-icons/lia";
import { VscLoading } from "react-icons/vsc";
import { toast } from "sonner";

import Img from "@/app/_components/_website/_global/Img";
import LocaleLink from "@/app/_components/_website/_global/LocaleLink";
import ConfirmDeletePopup from "@/app/_components/_popups/ConfirmDeletePopup";
import { instance } from "@/app/_helpers/axios";
import { formatDate } from "@/app/_helpers/dateHelper";
import { ServicePageMiniature } from "./types";

interface ServicePageCardProps {
  servicePage: ServicePageMiniature;
  setServicePages: Dispatch<SetStateAction<ServicePageMiniature[]>>;
}

export default function ServicePageCard({
  servicePage,
  setServicePages,
}: ServicePageCardProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [toggleLoading, setToggleLoading] = useState(false);

  // Calculate discount percentage
  const hasDiscount =
    servicePage.price_before_discount &&
    parseFloat(servicePage.price_before_discount) >
      parseFloat(servicePage.price);

  const discountPercentage = hasDiscount
    ? Math.round(
        ((parseFloat(servicePage.price_before_discount!) -
          parseFloat(servicePage.price)) /
          parseFloat(servicePage.price_before_discount!)) *
          100
      )
    : 0;

  // Toggle active status
  const handleToggleActive = async () => {
    try {
      setToggleLoading(true);
      const newStatus = !servicePage.is_active;

      await instance.patch(`/dashboard/service-pages/${servicePage.id}`, {
        is_active: newStatus,
      });

      setServicePages((prev) =>
        prev.map((sp) =>
          sp.id === servicePage.id ? { ...sp, is_active: newStatus } : sp
        )
      );

      toast.success(
        newStatus ? "تم تفعيل صفحة الخدمة" : "تم إيقاف صفحة الخدمة"
      );
    } catch (error) {
      console.error(error);
      toast.error("حدث خطأ أثناء تحديث الحالة");
    } finally {
      setToggleLoading(false);
    }
  };

  // Delete service page
  const handleDelete = async () => {
    try {
      setDeleteLoading(true);
      await instance.delete(`/dashboard/service-pages/${servicePage.id}`);

      setServicePages((prev) => prev.filter((sp) => sp.id !== servicePage.id));
      toast.success("تم حذف صفحة الخدمة بنجاح");
    } catch (error) {
      console.error(error);
      toast.error("حدث خطأ أثناء حذف صفحة الخدمة");
    } finally {
      setDeleteLoading(false);
      setConfirmDelete(false);
    }
  };

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
      >
        {/* Image Section */}
        <div className="relative aspect-video overflow-hidden">
          <Img
            src={servicePage.image || "/placeholder.png"}
            alt={servicePage.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Overlay Actions */}
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Action Buttons */}
          <div className="absolute top-3 left-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
            <LocaleLink
              href={`/dashboard/services/${servicePage.id}`}
              className="p-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg hover:bg-sky-500 text-gray-600 hover:text-white transition-all duration-200"
            >
              <FiEdit2 className="w-4 h-4" />
            </LocaleLink>
            <button
              onClick={() => setConfirmDelete(true)}
              className="p-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg hover:bg-red-500 text-red-500 hover:text-white transition-all duration-200"
              title="حذف"
            >
              <FiTrash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Discount Badge */}
          {hasDiscount && (
            <div className="absolute top-3 right-3 bg-linear-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
              {discountPercentage}% خصم
            </div>
          )}

          {/* Type Badge */}
          <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="bg-white/90 backdrop-blur-sm text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
              {servicePage.type === "service" ? "خدمة" : "منتج"}
            </span>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-5">
          {/* Title */}
          <h3 className="font-bold text-gray-900 mb-3 line-clamp-2 text-lg leading-tight">
            {servicePage.title}
          </h3>

          {/* Category Badge */}
          <div className="mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-linear-to-r from-blue-50 to-indigo-50 text-blue-700 rounded-lg text-sm font-medium border border-blue-100">
              {servicePage.category.title_ar}
            </span>
          </div>

          {/* Price Section */}
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl font-bold text-gray-900">
              {servicePage.price}
              <span className="text-sm font-normal text-gray-500 mr-1">
                ر.ع
              </span>
            </span>
            {hasDiscount && (
              <span className="text-sm text-gray-400 line-through">
                {servicePage.price_before_discount} ر.ع
              </span>
            )}
          </div>

          {/* Status & Toggle */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            {/* Status Badge */}
            <span
              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                servicePage.is_active
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                  servicePage.is_active ? "bg-green-500" : "bg-gray-400"
                }`}
              />
              {servicePage.is_active ? "مفعّل" : "غير مفعّل"}
            </span>

            {/* Toggle Button */}
            {toggleLoading ? (
              <VscLoading className="text-sky-500 animate-spin w-6 h-6" />
            ) : servicePage.is_active ? (
              <LiaToggleOnSolid
                className="text-green-500 w-9 h-9 cursor-pointer hover:scale-110 transition-transform"
                onClick={handleToggleActive}
              />
            ) : (
              <LiaToggleOffSolid
                className="text-gray-400 w-9 h-9 cursor-pointer hover:scale-110 transition-transform"
                onClick={handleToggleActive}
              />
            )}
          </div>

          {/* Footer - Date */}
          <div className="text-xs text-gray-400 mt-4 pt-3 border-t border-gray-50">
            {formatDate(servicePage.created_at)}
          </div>
        </div>
      </motion.div>

      {/* Delete Confirmation Popup */}
      <ConfirmDeletePopup
        title={`صفحة الخدمة: ${servicePage.title}`}
        id={servicePage.id}
        loading={deleteLoading}
        showConfirm={confirmDelete}
        onDelete={handleDelete}
        onClose={() => setConfirmDelete(false)}
      />
    </>
  );
}
