"use client";
import { ServiceOrder } from "./serviceOrderTypes";
import OrderHeader from "./OrderHeader";
import ServiceDetailsCard from "./ServiceDetailsCard";
import InvoiceDetailsCard from "./InvoiceDetailsCard";
import TrackingTimeline from "./TrackingTimeline";

interface ServiceOrderBodyProps {
  serviceOrder: ServiceOrder;
}

export default function ServiceOrderBody({
  serviceOrder,
}: ServiceOrderBodyProps) {
  return (
    <div className="w-full px-4 py-8 space-y-8">
      {/* 1. Order Info Header */}
      <OrderHeader serviceOrder={serviceOrder} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 2. Left Column: Service & Invoice */}
        <div className="space-y-6 lg:col-span-1">
          <ServiceDetailsCard serviceOrder={serviceOrder} />
          <InvoiceDetailsCard serviceOrder={serviceOrder} />
        </div>

        {/* 3. Right Column: Timeline & Progress */}
        <div className="lg:col-span-2 space-y-6">
          <TrackingTimeline serviceOrder={serviceOrder} />
        </div>
      </div>
    </div>
  );
}
