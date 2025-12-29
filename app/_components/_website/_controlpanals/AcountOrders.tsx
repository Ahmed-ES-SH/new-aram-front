"use client";
import { ServiceOrder } from "./orderTypes";
import { motion } from "framer-motion";
import { useLocale } from "next-intl";
import { useEffect, useState } from "react";
import { instance } from "@/app/_helpers/axios";
import Pagination from "../../PaginationComponent";
import ServiceOrderViewCard from "./ServiceOrderViewCard";
import { RiLoader2Fill } from "react-icons/ri";

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

  if (loading)
    return (
      <div className="w-full h-[80vh] flex items-center justify-center">
        <RiLoader2Fill className="lg:size-32 size-20 text-primary animate-spin" />
      </div>
    );

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-4"
    >
      <div className="min-h-screen flex flex-col gap-4 items-start">
        {data &&
          Array.isArray(data) &&
          data.length > 0 &&
          data.map((order) => (
            <ServiceOrderViewCard
              key={`service-order-${order.id}`}
              order={order}
            />
          ))}
      </div>

      {/* pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={lastPage}
        onPageChange={handlePageChange}
      />
    </motion.div>
  );
}
