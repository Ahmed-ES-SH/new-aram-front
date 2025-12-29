import React from "react";
import { AdminServiceOrder } from "../types";

export default function InvoiceInfo({ order }: { order: AdminServiceOrder }) {
  console.log(order.invoice);
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
      <h2 className="text-lg font-bold text-gray-900">معلومات الفاتورة</h2>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">رقم الفاتورة</span>
          <span className="font-medium">
            {order.invoice?.invoice_number ?? order.invoice?.number}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">الإجمالي</span>
          <span className="font-bold text-primary">
            {order.invoice.total_invoice} {order.invoice.currency}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-500">الحالة</span>
          <span
            className={`px-2 py-0.5 rounded text-xs font-bold capitalize ${
              order.invoice.status === "paid"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {order.invoice.status}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">طريقة الدفع</span>
          <span className="font-medium capitalize">
            {order.invoice.payment_method}
          </span>
        </div>
      </div>
    </div>
  );
}
