"use client";
import React from "react";
import { ServiceOrder } from "./serviceOrderTypes";
import { useLocale } from "next-intl";
import { FiMessageCircle, FiMessageSquare } from "react-icons/fi";
import { formatTitle } from "@/app/_helpers/helpers";

interface OrderHeaderProps {
  serviceOrder: ServiceOrder;
}

export default function OrderHeader({ serviceOrder }: OrderHeaderProps) {
  const locale = useLocale();

  const returnStatus = (status) => {
    switch (status) {
      case "completed":
        return locale === "ar" ? "تم الانتهاء" : "Completed";
      case "pending":
        return locale === "ar" ? "قيد الانتهاء" : "In Progress";
      case "in_progress":
        return locale === "ar" ? "قيد الانتهاء" : "In Progress";
      default:
        return locale === "ar" ? "قيد الانتهاء" : "In Progress";
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 items-start justify-between bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-2xl font-bold text-gray-900">
            {locale === "ar" ? "تفاصيل الطلب" : "Order Details"} #
            {serviceOrder.id}
          </h1>
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
              serviceOrder.status === "completed"
                ? "bg-green-100 text-green-700"
                : serviceOrder.status === "pending"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-blue-100 text-blue-700"
            }`}
          >
            {returnStatus(serviceOrder.status)}
          </span>
        </div>
        <p className="text-gray-500 text-sm">
          {locale === "ar" ? "تاريخ الطلب:" : "Ordered on:"}{" "}
          {new Date(serviceOrder.created_at).toLocaleDateString(
            locale === "ar" ? "ar-EG" : "en-US",
            {
              year: "numeric",
              month: "long",
              day: "numeric",
            }
          )}
        </p>
      </div>

      <div className="flex gap-3">
        <a
          href={`https://wa.me/${
            serviceOrder.service.whatsapp_number
          }?text=Order%20${formatTitle(serviceOrder.service.slug)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-5 py-2.5 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors font-medium"
        >
          <FiMessageCircle size={18} />
          <span>{locale === "ar" ? "واتساب" : "WhatsApp"}</span>
        </a>
        {/* <button className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors font-medium">
          <FiMessageSquare size={18} />
          <span>{locale === "ar" ? "بدء محادثة" : "Start Conversation"}</span>
        </button> */}
      </div>
    </div>
  );
}
