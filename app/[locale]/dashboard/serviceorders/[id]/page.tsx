import FetchData from "@/app/_helpers/FetchData";
import { FiArrowLeft } from "react-icons/fi";
import LocaleLink from "@/app/_components/_website/_global/LocaleLink";
import SingleServiceOrderView from "@/app/_components/_dashboard/_serviceOrders/SingleServiceOrderView";

export default async function SingleOrderPage({ params }: any) {
  const { id } = await params;
  const order = await FetchData(`/service-orders/${id}`, false);

  return (
    <div className="space-y-6">
      <SingleServiceOrderView order={order} />
    </div>
  );
}
