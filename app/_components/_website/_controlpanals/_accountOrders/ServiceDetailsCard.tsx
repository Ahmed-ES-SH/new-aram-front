"use client";
import React from "react";
import { ServiceOrder } from "./serviceOrderTypes";
import { useLocale } from "next-intl";
import Image from "next/image";
import { FiBox } from "react-icons/fi";

interface ServiceDetailsCardProps {
  serviceOrder: ServiceOrder;
}

export default function ServiceDetailsCard({
  serviceOrder,
}: ServiceDetailsCardProps) {
  const locale = useLocale();

  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
      <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
        <FiBox className="text-primary" />
        {locale === "ar" ? "الخدمة" : "Service"}
      </h3>
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 bg-gray-50 rounded-lg relative overflow-hidden shrink-0">
          {serviceOrder.service?.image ? (
            <div className="relative w-full h-full">
              <Image
                src={`${process.env.NEXT_PUBLIC_IMAGE_URL || ""}${
                  serviceOrder.service.image
                }`}
                alt="Service"
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <FiBox
              size={24}
              className="text-gray-300 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            />
          )}
        </div>
        <div>
          <h4 className="font-semibold text-gray-800 line-clamp-2">
            {serviceOrder.service?.slug}
          </h4>
          <div className="text-sm text-gray-500 capitalize mt-1">
            {serviceOrder.service?.type}
          </div>
          <div className="text-primary font-bold mt-1">
            {serviceOrder.service?.price} {serviceOrder.invoice?.currency}
          </div>
        </div>
      </div>
    </div>
  );
}
