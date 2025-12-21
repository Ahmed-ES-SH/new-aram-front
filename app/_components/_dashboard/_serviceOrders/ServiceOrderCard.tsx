"use client";
import React from "react";
import { AdminServiceOrder } from "./types";
import { useLocale } from "next-intl";
import Link from "next/link";
import { FiBox, FiCalendar, FiUser, FiArrowRight } from "react-icons/fi";

interface ServiceOrderCardProps {
  order: AdminServiceOrder;
}

export default function ServiceOrderCard({ order }: ServiceOrderCardProps) {
  const locale = useLocale();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "in_progress":
        return "bg-blue-100 text-blue-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all group">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
            #{order.id}
          </div>
          <div>
            <h3 className="font-bold text-gray-900 line-clamp-1">
              {order.service.slug}
            </h3>
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-medium ${getStatusColor(
                order.status
              )}`}
            >
              {order.status}
            </span>
          </div>
        </div>
        <div className="text-right">
          <div className="font-bold text-gray-900">
            {order.invoice.total} {order.invoice.currency}
          </div>
          <div className="text-xs text-gray-400 capitalize">
            {order.invoice.payment_method}
          </div>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <FiUser size={16} />
          <span>
            User ID: {order.user_id} ({order.user_type})
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <FiBox size={16} />
          <span>Invoice: {order.invoice.number}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <FiCalendar size={16} />
          <span>
            {new Date(order.created_at).toLocaleDateString(
              locale === "ar" ? "ar-EG" : "en-US"
            )}
          </span>
        </div>
      </div>

      <Link
        href={`/en/dashboard/serviceorders/${order.id}`}
        className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-gray-50 text-gray-700 font-medium group-hover:bg-primary group-hover:text-white transition-colors"
      >
        <span>{locale === "ar" ? "عرض التفاصيل" : "View Details"}</span>
        <FiArrowRight />
      </Link>
    </div>
  );
}
