"use client";
import { ServiceOrder } from "./orderTypes";
import { motion } from "framer-motion";
import { useLocale } from "next-intl";
import Image from "next/image";
import { FiCalendar, FiBox, FiClock } from "react-icons/fi";
import LocaleLink from "../_global/LocaleLink";
import { formatTitle } from "@/app/_helpers/helpers";
import Pagination from "../../PaginationComponent";
import { useEffect, useState } from "react";
import { instance } from "@/app/_helpers/axios";

interface AcountOrdersProps {
  data: ServiceOrder[];
  last_page: number;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const getStatusStyles = (status: string) => {
  switch (status?.toLowerCase()) {
    case "paid":
    case "completed":
      return "bg-green-100 text-green-700 border-green-200";
    case "pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "cancelled":
    case "failed":
      return "bg-red-100 text-red-700 border-red-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
};

export default function AcountOrders({
  data: serverData,
  last_page,
}: AcountOrdersProps) {
  const locale = useLocale();

  const [currentPage, setCurerentPage] = useState<number>(1);
  const [lastPage, setLastPage] = useState<number>(last_page ?? 1);
  const [data, setData] = useState(serverData ?? []);
  const [loading, setLoading] = useState(false);
  const [clientFire, setClientFire] = useState(false);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= lastPage) {
      if (!clientFire) {
        setClientFire(true);
      }
      setCurerentPage(page);
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await instance.get(
          `/user-service-orders?page=${currentPage}`
        );
        if (response.status == 200) {
          setData(response.data.data);
          setLastPage(response.data.pagination.last_page);
        }
      } catch (error: any) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    if (clientFire) fetchOrders();
  }, [currentPage, clientFire]);

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-4"
    >
      <div className="min-h-screen">
        {data.map((order) => (
          <motion.div
            variants={item}
            className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow group"
          >
            <div className="flex flex-col md:flex-row gap-6">
              {/* Service Image */}
              <div className="w-full md:w-32 h-32 rounded-xl overflow-hidden bg-gray-50 shrink-0 relative">
                {order.service?.gallery_images?.[0]?.path ? (
                  <Image
                    src={order.service.gallery_images[0].path}
                    alt="Service"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <FiBox size={32} />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="grow flex flex-col justify-between py-1">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium text-gray-500">
                        Order #{order.invoice?.invoice_number || order.id}
                      </span>
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full border font-medium ${getStatusStyles(
                          order.invoice?.status || order.status
                        )}`}
                      >
                        {order.invoice?.status || order.status}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 capitalize">
                      {order.metadata?.items?.slug?.replace(/-/g, " ") ||
                        "Service Order"}
                    </h3>

                    {/* Metadata Fields Preview */}
                    {order.metadata?.items?.metadata?.length > 0 && (
                      <div className="flex flex-wrap gap-2 text-sm text-gray-500 mb-3">
                        {order.metadata.items.metadata
                          .slice(0, 2)
                          .map((field, idx) => (
                            <span
                              key={idx}
                              className="bg-gray-50 px-2 py-1 rounded-md border border-gray-100"
                            >
                              {field.value}
                            </span>
                          ))}
                      </div>
                    )}
                  </div>

                  <div className="text-right">
                    <div className="text-xl font-bold text-primary">
                      {order.invoice?.total_invoice}{" "}
                      {locale == "ar" ? "ر.ع" : "OMR"}
                    </div>
                    <div className="text-sm text-gray-400 mt-1">
                      {order.invoice?.payment_method}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between max-lg:flex-col gap-4 max-md:items-start">
                  <div className="flex items-center gap-6 mt-4 pt-4 border-t border-gray-50 text-sm text-gray-500 max-md:self-end">
                    <div className="flex items-center gap-2 ">
                      <FiCalendar className="text-gray-400" />
                      <span>
                        {new Date(order.created_at).toLocaleDateString(
                          "en-GB",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiClock className="text-gray-400" />
                      <span>
                        {new Date(order.created_at).toLocaleTimeString(
                          "en-US",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <LocaleLink
                      href={`/usercontrolpanel/myorders/${formatTitle(
                        order.service.slug
                      )}?orderId=${order.id}`}
                      key={`service-order-${order.id}`}
                    >
                      <button className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/80 transition-colors">
                        {locale == "ar" ? "تتبع الطلب" : "View Order"}
                      </button>
                    </LocaleLink>
                    {/* <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors">
                    {locale == "ar" ? "ملخص الطلب" : "Order Summary"}
                  </button> */}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={4}
        onPageChange={handlePageChange}
      />
    </motion.div>
  );
}
