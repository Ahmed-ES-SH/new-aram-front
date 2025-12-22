"use client";
import { AdminServiceOrder } from "./types";
import { useLocale } from "next-intl";
import Image from "next/image";
import { FiBox, FiCalendar, FiArrowRight } from "react-icons/fi";
import AddTrackingForm from "./AddTrackingForm";
import FileRenderer from "./FileRenderer";
import LocaleLink from "../../_website/_global/LocaleLink";
import Img from "../../_website/_global/Img";

interface SingleServiceOrderViewProps {
  order: AdminServiceOrder;
}

export default function SingleServiceOrderView({
  order,
}: SingleServiceOrderViewProps) {
  const locale = useLocale();

  return (
    <div dir="rtl" className="space-y-6 lg:w-[90%] w-full mx-auto px-4 my-3">
      <LocaleLink
        href="/dashboard/serviceorders"
        className="flex items-center bg-primary  p-2 rounded-lg text-white  gap-2  hover:text-primary hover:bg-white border border-transparent hover:border-primary  transition-colors w-fit"
      >
        <FiArrowRight />
        <span>العودة للطلبات</span>
      </LocaleLink>
      {/* Top Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 1. Order & User Info */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-900">معلومات الطلب</h2>
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-semibold">
              #{order.id}
            </span>
          </div>
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3 text-sm">
              <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-500">
                <Img
                  src={order?.user?.image ?? "/defaults/male-noimage.jpg"}
                  errorSrc="/defaults/male-noimage.jpg"
                  className="w-12 h-12 rounded-full"
                />
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  المستخدم : {order.user.name}
                </p>
                <p className="text-gray-500 text-xs uppercase">
                  {order.user_type == "user" ? "مستخدم" : "مركز"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-500">
                <FiCalendar />
              </div>
              <div>
                <p className="font-medium text-gray-900">تاريخ الإنشاء</p>
                <p className="text-gray-500 text-xs">
                  {new Date(order.created_at).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Service Info */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
          <h2 className="text-lg font-bold text-gray-900">معلومات الخدمة</h2>
          <div className="flex gap-4">
            <div className="w-16 h-16 bg-gray-50 rounded-lg relative overflow-hidden shrink-0">
              {/* Gallery Image check */}
              {order.service.gallery_images?.[0] ? (
                <Image
                  src={`${process.env.NEXT_PUBLIC_IMAGE_URL || ""}${
                    order.service.gallery_images[0].path
                  }`}
                  alt="الخدمة"
                  fill
                  className="object-cover"
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
              className={`text-xs px-2 py-1 rounded bg-gray-100 text-gray-600`}
            >
              {order.service.status}
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

        {/* 3. Invoice Info */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
          <h2 className="text-lg font-bold text-gray-900">معلومات الفاتورة</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">رقم الفاتورة</span>
              <span className="font-medium">{order.invoice.number}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">الإجمالي</span>
              <span className="font-bold text-primary">
                {order.invoice.total} {order.invoice.currency}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">الحالة</span>
              <span
                className={`px-2 py-0.5 rounded text-xs font-bold capitalize ${
                  order.invoice.status === "paid"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {order.invoice.status}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">طريقة الدفع</span>
              <span className="font-medium capitalize">
                {order.invoice.payment_method}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tracking Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Existing Tracking Timeline */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-6">سجل التتبع</h2>
          {order.trackings && order.trackings.length > 0 ? (
            <div className="space-y-8 relative pl-6 before:absolute before:left-[11px] before:top-2 before:bottom-0 before:w-0.5 before:bg-gray-100">
              {order.trackings.map((tracking) => (
                <div key={tracking.id} className="relative">
                  <div
                    className={`absolute -left-[29px] w-6 h-6 rounded-full border-2 border-white shadow-sm flex items-center justify-center
                           ${
                             tracking.status === "completed"
                               ? "bg-green-500 text-white"
                               : tracking.status === "in_progress"
                               ? "bg-primary text-white"
                               : "bg-gray-200 text-gray-500"
                           }
                        `}
                  >
                    <div className="w-2 h-2 rounded-full bg-current" />
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-gray-900 capitalize">
                        {tracking.current_phase}
                      </h4>
                      <span className="text-xs text-gray-400">
                        {new Date(
                          tracking.start_time as string
                        ).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={`text-xs px-2 py-0.5 rounded capitalize ${
                          tracking.status === "completed"
                            ? "bg-green-100 text-green-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {tracking.status}
                      </span>
                    </div>
                    {tracking.metadata?.notes && (
                      <p className="text-sm text-gray-600 bg-white p-2 rounded border border-gray-100 mb-3">
                        {tracking.metadata.notes}
                      </p>
                    )}

                    {tracking.files && tracking.files.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                        {tracking.files.map((file) => (
                          <FileRenderer key={file.id} file={file} />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-gray-400">
              لا يوجد سجل تتبع حتى الان
            </div>
          )}
        </div>

        {/* Add New Tracking */}
        <div className="lg:col-span-1">
          <AddTrackingForm order={order} />
        </div>
      </div>
    </div>
  );
}
