"use client";
import React from "react";
import { ServiceOrder } from "./serviceOrderTypes";
import { useLocale } from "next-intl";

interface InvoiceDetailsCardProps {
  serviceOrder: ServiceOrder;
}

export default function InvoiceDetailsCard({
  serviceOrder,
}: InvoiceDetailsCardProps) {
  const locale = useLocale();

  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
      <h3 className="font-bold text-gray-900 mb-4">
        {locale === "ar" ? "الفاتورة" : "Invoice"}
      </h3>
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">
            {locale === "ar" ? "رقم الفاتورة" : "Details"}
          </span>
          <span className="font-medium text-gray-900">
            {serviceOrder.invoice?.number}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">
            {locale === "ar" ? "المبلغ" : "Total"}
          </span>
          <span className="font-bold text-primary">
            {serviceOrder.invoice?.total} {serviceOrder.invoice?.currency}
          </span>
        </div>
        <div className="flex justify-between text-sm items-center">
          <span className="text-gray-500">
            {locale === "ar" ? "الحالة" : "Status"}
          </span>
          <span
            className={`px-2.5 py-0.5 rounded text-xs font-semibold capitalize
                      ${
                        serviceOrder.invoice?.status === "paid"
                          ? "bg-green-50 text-green-600"
                          : "bg-red-50 text-red-600"
                      }
                   `}
          >
            {serviceOrder.invoice?.status}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">
            {locale === "ar" ? "طريقة الدفع" : "Payment"}
          </span>
          <span className="font-medium text-gray-900">
            {serviceOrder.invoice?.payment_method}
          </span>
        </div>
      </div>
    </div>
  );
}
