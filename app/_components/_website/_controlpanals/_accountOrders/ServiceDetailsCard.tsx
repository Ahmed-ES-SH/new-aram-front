"use client";
import { ServiceOrder } from "./serviceOrderTypes";
import { useLocale } from "next-intl";
import { FiBox } from "react-icons/fi";
import Img from "../../_global/Img";
import LocaleLink from "../../_global/LocaleLink";
import { formatTitle } from "@/app/_helpers/helpers";

interface ServiceDetailsCardProps {
  serviceOrder: ServiceOrder;
}

export default function ServiceDetailsCard({
  serviceOrder,
}: ServiceDetailsCardProps) {
  const locale = useLocale();

  const oneTime = locale === "ar" ? "خدمة مباشرة" : "Direct service";
  const subscription = locale === "ar" ? "اشتراك" : "Subscription";

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
              <Img
                src={serviceOrder.service.image ?? "/defaults/noImage.png"}
                errorSrc="/defaults/noImage.png"
                alt="Service"
                className="object-cover w-full h-full"
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
          <LocaleLink
            href={`/services/${formatTitle(
              serviceOrder.service?.slug
            )}?serviceId=${serviceOrder.service?.id}`}
            className="font-semibold hover:text-primary hover:underline duration-300 text-gray-800 line-clamp-2"
          >
            {serviceOrder.service?.slug}
          </LocaleLink>
          <div className="text-sm text-gray-500 underline capitalize mt-1">
            {serviceOrder.service?.type == "one_time" ? oneTime : subscription}
          </div>
          <div className="text-primary font-bold mt-1">
            {serviceOrder.service?.price} {locale == "ar" ? "ر.ع" : "OMR"}
          </div>
        </div>
      </div>
    </div>
  );
}
