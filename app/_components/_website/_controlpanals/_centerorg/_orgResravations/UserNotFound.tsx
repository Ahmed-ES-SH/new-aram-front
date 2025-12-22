"use client";
import { useLocale } from "next-intl";
import React from "react";
import Img from "../../../_global/Img";

export default function UserNotFound() {
  const locale = useLocale();
  return (
    <td className="py-4 px-4 whitespace-nowrap">
      <div className="flex items-center gap-3">
        <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
          <Img
            src={"/defaults/male-noimage.jpg"}
            errorSrc="/defaults/male-noimage.jpg"
            className="object-cover w-full h-full rounded-full"
          />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-slate-800">----</p>
          </div>
          <p className="text-xs text-slate-500">
            {locale == "en" ? "" : "تم تعليق الموعد"}
          </p>
        </div>
      </div>
    </td>
  );
}
