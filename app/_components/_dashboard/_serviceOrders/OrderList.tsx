import FetchData from "@/app/_helpers/FetchData";
import ServiceOrderCard from "./ServiceOrderCard";
import { FiInbox } from "react-icons/fi";
import { AdminServiceOrder } from "./types";

interface OrderListProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function OrderList({ searchParams }: OrderListProps) {
  // Construct query string
  const params = new URLSearchParams();
  Object.entries(searchParams).forEach(([key, value]) => {
    if (value) {
      if (Array.isArray(value)) {
        value.forEach((v) => params.append(key, v));
      } else {
        params.append(key, value);
      }
    }
  });

  const queryString = params.toString();
  const endpoint = queryString
    ? `/all-service-orders?${queryString}`
    : `/all-service-orders`;

  const response = await FetchData(endpoint, true);

  if (!response || !response.data || response.data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
          <FiInbox size={32} className="text-gray-400" />
        </div>
        <h3 className="text-lg font-bold text-gray-900">لا يوجد طلبات</h3>
        <p className="text-gray-500 text-sm mt-1">
          حاول تغيير الفلاتر للوصول إلى نتائج
        </p>
      </div>
    );
  }

  const orders: AdminServiceOrder[] = response.data;

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div className="text-sm text-gray-500">
          إجمالي النتائج:{" "}
          <span className="font-bold text-gray-900">{orders.length}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
        {orders.map((order) => (
          <ServiceOrderCard key={order.id} order={order} />
        ))}
      </div>
    </>
  );
}
