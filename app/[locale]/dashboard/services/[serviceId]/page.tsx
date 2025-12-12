"use client";

import { useParams } from "next/navigation";
import ServicePageEditor from "@/app/_components/_dashboard/_serviceEditor/ServicePageEditor";

export default function EditServicePage() {
  const params = useParams();
  const serviceId = params.serviceId as string;

  return <ServicePageEditor mode="edit" serviceId={serviceId} />;
}
