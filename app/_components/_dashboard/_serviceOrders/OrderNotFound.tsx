import React from "react";
import { FaExclamationCircle } from "react-icons/fa";
import LocaleLink from "../../_website/_global/LocaleLink";
import { FiArrowLeft } from "react-icons/fi";

export default function OrderNotFound() {
  return (
    <div className="flex items-center justify-center h-screen w-full">
      <div className="flex flex-col items-center gap-4">
        <div className="p-3 bg-red-100 rounded-full">
          <FaExclamationCircle className="size-28 text-red-400" />
        </div>
        <h1 className="text-2xl font-bold text-red-400">الطلب غير موجود</h1>
        <LocaleLink
          href="/dashboard/serviceorders"
          className="flex items-center bg-primary p-2 rounded-lg text-white  gap-2  hover:text-primary hover:bg-white border border-transparent hover:border-primary  transition-colors w-fit"
        >
          <FiArrowLeft />
          <span>العودة للطلبات</span>
        </LocaleLink>
      </div>
    </div>
  );
}
