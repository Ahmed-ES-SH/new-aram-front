"use client";

import type React from "react";
import { Dispatch, SetStateAction, useState } from "react";
import { motion } from "framer-motion";
import { FaCopy, FaCheck, FaCalendarAlt, FaStar } from "react-icons/fa";
import Img from "../../_website/_global/Img";
import { Offer } from "./types";
import { formatTitle, getIconComponent } from "@/app/_helpers/helpers";
import LocaleLink from "../../_website/_global/LocaleLink";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import ConfirmDeletePopup from "../../_popups/ConfirmDeletePopup";
import { instance } from "@/app/_helpers/axios";
import { toast } from "sonner";

interface OfferDashCardProps {
  offer: Offer;
  setOffers: Dispatch<SetStateAction<Offer[]>>;
}

export default function OfferDashCard({
  offer,
  setOffers,
}: OfferDashCardProps) {
  const [copied, setCopied] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const onDelete = async () => {
    try {
      setDeleteLoading(true);
      const response = await instance.delete(
        `/dashboard/delete-offer/${offer.id}`
      );

      if (response.status === 200) {
        toast.success("تم حذف الكوبون بنجاح");

        setOffers((prev) => {
          return prev.filter((org) => org.id !== offer.id);
        });
      }
    } catch (error: any) {
      console.log(error);
      if (error?.response?.data?.message) {
        toast.error(error?.response?.data?.message);
      }
      toast.error("حدث خطأ أثناء حذف الكوبون");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(offer.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const Icon = getIconComponent(offer?.category?.icon_name);

  function getOfferStatus(status: string) {
    switch (status) {
      case "active":
        return (
          <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            نشط
          </span>
        );
      case "waiting":
        return (
          <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
            قيد الانتظار
          </span>
        );
      case "expired":
        return (
          <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
            منتهي
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
            غير معروف
          </span>
        );
    }
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white h-full rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:border-gray-200 duration-200 hover:-translate-y-3"
        dir="rtl"
      >
        {/* Offer Image */}
        <div className="relative h-60 overflow-hidden">
          <Img
            src={offer.image || "/placeholder.png"}
            alt={offer.title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />

          {/* Status Badge */}
          <div className="absolute top-4 right-4">
            {getOfferStatus(offer?.status)}
          </div>

          {/* Category Badge */}
          <div className="absolute top-4 left-4">
            <div
              className="flex items-center gap-2 px-3 py-1 rounded-full text-white text-sm font-medium"
              style={{ backgroundColor: offer.category.bg_color }}
            >
              {offer?.category?.icon_name && <Icon />}
              <span>{offer.category.title_ar}</span>
            </div>
          </div>
        </div>

        {/* Card Content */}
        <div className="p-6">
          {/* Title & Description */}
          <div className="mb-4">
            <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
              {offer.title}
            </h3>
            <p className="text-gray-600 text-sm line-clamp-2">
              {offer.description}
            </p>
          </div>

          {/* Discount Value */}
          <div className="mb-4">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg font-bold text-lg">
              <span>خصم</span>
              <span>
                {offer.discount_type === "percentage"
                  ? `${offer.discount_value}%`
                  : `${offer.discount_value} $`}
              </span>
            </div>
          </div>

          {/* Promo Code */}
          <div className="mb-4">
            <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3 border-2 border-dashed border-gray-300">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">كود الخصم:</span>
                <span className="font-mono font-bold text-gray-900">
                  {offer.code}
                </span>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCopyCode}
                className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                {copied ? <FaCheck className="text-green-600" /> : <FaCopy />}
              </motion.button>
            </div>
          </div>

          {/* Organization Info */}
          <div className="mb-4 flex items-center gap-3">
            <Img
              src={offer.organization.image || "/placeholder.png"}
              alt={offer.organization.title}
              className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
            />
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 text-sm">
                {offer.organization.title}
              </h4>
              <div className="flex items-center gap-1 text-yellow-500">
                <FaStar size={12} />
                <span className="text-xs text-gray-600">
                  {offer.organization.rating}
                </span>
              </div>
            </div>
          </div>

          {/* Usage Stats */}
          <div className="mb-4">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>عدد مرات الاستخدام</span>
              <span>{offer.usage_limit}</span>
            </div>
            {/* <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${Math.min(
                  (offer.number_of_uses / offer.usage_limit) * 100,
                  100
                )}%`,
              }}
            />
          </div> */}
          </div>

          {/* Dates */}
          <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-1">
              <FaCalendarAlt />
              <span>من: {formatDate(offer.start_date)}</span>
            </div>
            <div className="flex items-center gap-1">
              <FaCalendarAlt />
              <span>إلى: {formatDate(offer.end_date)}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end mt-4 p-2 w-fit mr-auto gap-2">
            <LocaleLink
              href={`/dashboard/offers/${offer.id}?title=${formatTitle(
                offer.title
              )}`}
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 text-muted-foreground hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                title="Edit Coupon"
              >
                <FiEdit className="w-4 h-4" />
              </motion.button>
            </LocaleLink>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 text-muted-foreground hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
              title="Delete Coupon"
              onClick={() => setConfirmDelete(true)}
            >
              <FiTrash2 className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </motion.div>
      {/*  ConfirmDeletePopup */}
      <ConfirmDeletePopup
        title={`الكوبون : ${offer.title}`}
        id={offer.id}
        loading={deleteLoading}
        showConfirm={confirmDelete}
        onDelete={() => onDelete()}
        onClose={() => setConfirmDelete(false)}
      />
    </>
  );
}
