import FetchData from "@/app/_helpers/FetchData";
import ServiceOrdersSidebar from "@/app/_components/_dashboard/_serviceOrders/ServiceOrdersSidebar";
import ServiceOrderCard from "@/app/_components/_dashboard/_serviceOrders/ServiceOrderCard";
import { FiInbox } from "react-icons/fi";

export default async function ServiceOrders() {
  const response = await FetchData(`/all-service-orders`, true);

  if (!response) return <div>no Data Found</div>;

  const { data: orders, pagination } = await response;

  return (
    <div className="flex flex-col lg:flex-row gap-8 min-h-[calc(100vh-120px)]">
      {/* Sidebar Filter */}
      <ServiceOrdersSidebar />

      {/* Main Content */}
      <div className="flex-1">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FiInbox className="text-primary" />
            Service Orders
          </h1>
          <div className="text-sm text-gray-500">
            Total Orders: {orders?.length || 0}
          </div>
        </div>

        {orders && orders.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {orders.map((order) => (
              <ServiceOrderCard key={order.id} order={order} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <FiInbox size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">No Orders Found</h3>
            <p className="text-gray-500 text-sm mt-1">
              Try adjusting your filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
