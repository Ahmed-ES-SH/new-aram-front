import Img from "@/app/_components/_website/_global/Img";
import { FiBox } from "react-icons/fi";
import { AdminServiceOrder } from "../types";

interface ServiceInfoProps {
  order: AdminServiceOrder;
}

export default function ServiceInfo({ order }: ServiceInfoProps) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
      <h2 className="text-lg font-bold text-gray-900">معلومات الخدمة</h2>
      <div className="flex gap-4">
        <div className="w-16 h-16 bg-gray-50 rounded-lg relative overflow-hidden shrink-0">
          {/* Gallery Image check */}
          {order.service.image ? (
            <Img
              src={order.service.image}
              errorSrc="/defaults/noImage.png"
              alt="الخدمة"
              className="object-cover w-full h-full"
            />
          ) : (
            <FiBox className="text-gray-300 w-full h-full p-4" />
          )}
        </div>
        <div>
          <h3 className="font-bold text-gray-900 line-clamp-1">
            {order.service.slug}
          </h3>
          <p className="text-sm text-gray-500 capitalize">
            {order.service.type}
          </p>
          <p className="text-primary font-bold mt-1">
            {order.service.price} ر.ع.
          </p>
        </div>
      </div>
      <div className="flex gap-2">
        <span
          className={`text-xs px-2 py-1 rounded ${
            order.service.type == "subscription"
              ? "bg-primary/20 text-primary"
              : "bg-indigo-50 text-indigo-600"
          }`}
        >
          {order.service.type == "subscription" ? "اشتراك" : "خدمة"}
        </span>
        <span
          className={`text-xs px-2 py-1 rounded ${
            order.service.is_active
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {order.service.is_active ? "نشط" : "غير نشط"}
        </span>
      </div>
    </div>
  );
}
