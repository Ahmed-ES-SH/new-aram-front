"use client";
import { AdminServiceOrder } from "./types";
import { useState } from "react";
import { FiArrowLeft } from "react-icons/fi";
import AddTrackingForm from "./AddTrackingForm";
import LocaleLink from "../../_website/_global/LocaleLink";
import OrderNotFound from "./OrderNotFound";
import OrderInfo from "./_singleServiceOrder/OrderInfo";
import ServiceInfo from "./_singleServiceOrder/ServiceInfo";
import InvoiceInfo from "./_singleServiceOrder/InvoiceInfo";
import TrackingOrderSection from "./_singleServiceOrder/TrackingOrderSection";

interface SingleServiceOrderViewProps {
  order: AdminServiceOrder;
}

export default function SingleServiceOrderView({
  order: orderData,
}: SingleServiceOrderViewProps) {
  const [order, setOrder] = useState(orderData ?? null);

  if (!order) return <OrderNotFound />;

  return (
    <div dir="rtl" className="space-y-6 lg:w-[90%] w-full mx-auto px-4 my-3">
      <LocaleLink
        href="/dashboard/serviceorders"
        className="flex items-center bg-primary mr-auto p-2 rounded-lg text-white  gap-2  hover:text-primary hover:bg-white border border-transparent hover:border-primary  transition-colors w-fit"
      >
        <span>العودة للطلبات</span>
        <FiArrowLeft />
      </LocaleLink>
      {/* Top Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 1. Order & User Info */}
        <OrderInfo order={order} setOrder={setOrder} />

        {/* 2. Service Info */}
        <ServiceInfo order={order} />

        {/* 3. Invoice Info */}
        <InvoiceInfo order={order} />
      </div>

      {/* Tracking Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Existing Tracking Timeline */}
        <TrackingOrderSection order={order} />

        {/* Add New Tracking */}
        <div className="lg:col-span-1">
          <AddTrackingForm order={order} setOrder={setOrder} />
        </div>
      </div>
    </div>
  );
}
