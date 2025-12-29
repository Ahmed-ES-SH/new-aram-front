"use client";
import { ServiceOrder } from "../orderTypes";
import { motion } from "framer-motion";
import { useLocale } from "next-intl";
import { formatTitle } from "@/app/_helpers/helpers";
import { FiBox } from "react-icons/fi";
import Img from "../../_global/Img";

interface props {
  order: ServiceOrder;
}

export default function ServiceOrderCardHeader({ order }: props) {
  const locale = useLocale();

  const labels = {
    active: locale === "ar" ? "نشط" : "Active",
    expired: locale === "ar" ? "انتهت" : "Expired",
  };

  const statusStyles = {
    active: "bg-green-500/10 text-green-500",
    expired: "bg-red-500/10 text-red-500",
  };

  return (
    <div className="flex max-md:flex-col gap-4 items-start">
      {/* status patch */}
      <span
        className={`${
          statusStyles[order.subscription_status]
        } px-2.5 py-1 rounded-lg border border-primary/10 absolute top-4 right-4`}
      >
        {" "}
        {labels[order.subscription_status]}
      </span>

      {/* Image with glassmorphic overlay */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="relative md:w-20 w-full md:h-20 h-40 shrink-0 rounded-2xl overflow-hidden group border border-gray-100"
      >
        <div className="md:absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity z-10" />
        {order.service?.gallery_images?.[0]?.path ? (
          <Img
            src={
              order.service.gallery_images[0].path ?? "/defaults/noImage.png"
            }
            errorSrc="/defaults/noImage.png"
            alt="Service"
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-300">
            <FiBox size={24} />
          </div>
        )}
      </motion.div>

      <div className="flex-1 min-w-0 space-y-2">
        {/* Order ID & Date */}
        <div className="flex items-center max-md:flex-col max-md:items-start gap-2 text-xs">
          <span className="font-bold text-primary px-2.5 py-1 bg-primary/5 rounded-lg border border-primary/10">
            #{order.invoice?.invoice_number || order.id}
          </span>
          <span className="text-gray-400 md:block hidden">•</span>
          <span className="text-gray-500">
            {new Date(order.subscription_start_time).toLocaleDateString(
              "en-GB",
              {
                day: "numeric",
                month: "short",
                year: "numeric",
              }
            )}
          </span>
          {order.service &&
            order.service.type == "subscription" &&
            order.subscription_end_time && (
              <>
                <span className="text-gray-400 md:block hidden">•</span>
                <span className="text-red-500">
                  {new Date(order.subscription_end_time).toLocaleDateString(
                    "en-GB",
                    {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    }
                  )}
                </span>
              </>
            )}
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 leading-tight truncate">
          {formatTitle(order.service?.slug)}
        </h3>

        {/* Price */}
        <div className="inline-flex items-baseline gap-1 px-3 py-1.5 bg-primary/5 rounded-xl border border-primary/10">
          <span className="text-xl font-bold text-primary">
            {order.invoice?.total_invoice ?? order.service?.price}
          </span>
          <span className="text-xs font-medium text-primary/80">
            {locale === "ar" ? "ر.ع" : "OMR"}
          </span>
        </div>
      </div>
    </div>
  );
}
