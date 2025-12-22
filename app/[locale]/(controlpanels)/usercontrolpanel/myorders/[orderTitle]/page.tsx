import NoServiceOrder from "@/app/_components/_website/_controlpanals/_accountOrders/NoServiceOrder";
import ServiceOrderBody from "@/app/_components/_website/_controlpanals/_accountOrders/ServiceOrderBody";
import FetchData from "@/app/_helpers/FetchData";
import React from "react";

export default async function OrderTracking({ searchParams }: any) {
  const { orderId } = await searchParams;
  const serviceOrder = await FetchData(
    `/user-service-orders/${orderId}`,
    false
  );

  if (!serviceOrder) return <NoServiceOrder />;

  return <ServiceOrderBody serviceOrder={serviceOrder} />;
}
