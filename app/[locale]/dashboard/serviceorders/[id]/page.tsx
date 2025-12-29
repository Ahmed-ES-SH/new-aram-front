import FetchData from "@/app/_helpers/FetchData";
import SingleServiceOrderView from "@/app/_components/_dashboard/_serviceOrders/SingleServiceOrderView";
import OrderNotFound from "@/app/_components/_dashboard/_serviceOrders/OrderNotFound";

export default async function SingleOrderPage({ params }: any) {
  const { id } = await params;
  const order = await FetchData(`/service-orders/${id}`, false);

  if (!order) return <OrderNotFound />;

  return (
    <div className="space-y-6">
      <SingleServiceOrderView order={order} />
    </div>
  );
}
