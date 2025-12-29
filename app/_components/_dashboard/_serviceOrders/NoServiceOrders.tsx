import React from "react";
import { FiAlertCircle } from "react-icons/fi";

export default function NoServiceOrders({ error }: { error?: string }) {
  return (
    <div className="flex items-center justify-center h-[80vh] w-full">
      <div className="flex flex-col  items-center justify-center py-24 bg-red-50 rounded-3xl border border-red-100 text-center">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6 text-red-500">
          <FiAlertCircle size={36} />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">حدث خطأ</h3>
        <p className="text-gray-500 max-w-xs mx-auto mb-6">{error}</p>
      </div>
    </div>
  );
}
