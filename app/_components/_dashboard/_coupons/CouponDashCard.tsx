"use client";

import { motion } from "framer-motion";
import { FiEdit, FiTrash2, FiCalendar, FiUsers, FiTag } from "react-icons/fi";
import { Coupon } from "./types";
import Img from "../../_website/_global/Img";
import { Dispatch, SetStateAction, useState } from "react";
import { toast } from "sonner";
import { instance } from "@/app/_helpers/axios";
import ConfirmDeletePopup from "../../_popups/ConfirmDeletePopup";
import LocaleLink from "../../_website/_global/LocaleLink";
import { formatTitle } from "@/app/_helpers/helpers";

interface CouponDashCardProps {
  coupon: Coupon;
  setCoupons: Dispatch<SetStateAction<Coupon[]>>;
}

export default function CouponDashCard({
  coupon,
  setCoupons,
}: CouponDashCardProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "inactive":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
      case "expired":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  const getBenefitTypeColor = (benefitType: string) => {
    switch (benefitType) {
      case "percentage":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      case "fixed":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400";
      case "free_card":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "user":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400";
      case "organization":
        return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400";
      case "general":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getDiscountDisplay = () => {
    if (coupon.benefit_type === "free_card") {
      return "Free Card";
    }
    if (coupon.discount_value) {
      return coupon.benefit_type === "percentage"
        ? `${coupon.discount_value}% OFF`
        : `$${coupon.discount_value} OFF`;
    }
    return "Special Offer";
  };

  const onDelete = async () => {
    try {
      setDeleteLoading(true);
      const response = await instance.delete(
        `/dashboard/delete-coupon/${coupon.id}`
      );

      if (response.status === 200) {
        toast.success("تم حذف الكوبون بنجاح");

        setCoupons((prev) => {
          return prev.filter((org) => org.id !== coupon.id);
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

  return (
    <>
      <motion.div
        dir="rtl"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{
          scale: 1.02,
          boxShadow:
            "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        }}
        transition={{ duration: 0.2 }}
        className="bg-card relative border border-gray-300 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
      >
        {/* Coupon Image */}
        <div className="relative h-48 overflow-hidden">
          <Img
            src={coupon.image || "/placeholder.png"}
            alt={coupon.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-3 right-3">
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                coupon.status
              )}`}
            >
              {coupon.status.charAt(0).toUpperCase() + coupon.status.slice(1)}
            </span>
          </div>
          <div className="absolute bottom-3 left-3">
            <div className="bg-black/70 text-white px-3 py-1 rounded-lg text-sm font-bold">
              {getDiscountDisplay()}
            </div>
          </div>
        </div>

        {/* Card Content */}
        <div className="p-4 relative">
          {/* category */}
          <div
            style={{
              background: `${coupon.category.bg_color}50`,
              color: `${coupon.category.bg_color}`,
            }}
            className="w-fit py-1 px-2  text-[12px] rounded-xl absolute top-4 left-4 roudned-lg text-center"
          >
            {coupon.category.title_ar}
          </div>
          {/* Title and Code */}
          <div className="mb-3">
            <h3 className="text-lg font-semibold text-foreground mb-1 line-clamp-2">
              {coupon.title}
            </h3>
            <div className="flex items-center gap-2">
              <FiTag className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-mono bg-muted px-2 py-1 rounded text-muted-foreground">
                {coupon.code}
              </span>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {coupon.description.length > 80
              ? coupon.description.slice(0, 80) + "..."
              : coupon.description}
          </p>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(
                coupon.type
              )}`}
            >
              {coupon.type.charAt(0).toUpperCase() + coupon.type.slice(1)}
            </span>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${getBenefitTypeColor(
                coupon.benefit_type
              )}`}
            >
              {coupon.benefit_type
                .replace("_", " ")
                .replace(/\b\w/g, (l) => l.toUpperCase())}
            </span>
          </div>

          {/* Validity Period */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <FiCalendar className="w-4 h-4" />
            <span>
              {formatDate(coupon.start_date)} - {formatDate(coupon.end_date)}
            </span>
          </div>

          {/* Usage Limit and Sub Categories */}
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
            <div className="flex items-center gap-2">
              <FiUsers className="w-4 h-4" />
              <span>
                {coupon.usage_limit
                  ? `${coupon.usage_limit} uses`
                  : "Unlimited"}
              </span>
            </div>
            <span>{coupon.sub_categories_count} subcategories</span>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2">
            <LocaleLink
              href={`/dashboard/coupons/${coupon.id}?title=${formatTitle(
                coupon.title
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
        title={`الكوبون : ${coupon.title}`}
        id={coupon.id}
        loading={deleteLoading}
        showConfirm={confirmDelete}
        onDelete={() => onDelete()}
        onClose={() => setConfirmDelete(false)}
      />
    </>
  );
}
