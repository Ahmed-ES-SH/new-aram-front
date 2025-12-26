"use client";
import Img from "../../_website/_global/Img";
import { motion } from "framer-motion";
import { FiEdit2, FiStar, FiToggleLeft, FiTrash2 } from "react-icons/fi";
import { formatDate } from "@/app/_helpers/dateHelper";
import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import ConfirmDeletePopup from "../../_popups/ConfirmDeletePopup";
import { toast } from "sonner";
import { instance } from "@/app/_helpers/axios";
import LocaleLink from "../../_website/_global/LocaleLink";
import { formatTitle } from "@/app/_helpers/helpers";
import { VscLoading } from "react-icons/vsc";
import { LiaToggleOffSolid, LiaToggleOnSolid } from "react-icons/lia";
import { FaCheck, FaPen, FaTimes } from "react-icons/fa";
import { Service } from "../../_website/_servicesPage/service";

interface props {
  setServices: Dispatch<SetStateAction<Service[]>>;
  service: Service;
}

export default function ServiceDashCard({ service, setServices }: props) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [updateStatusLoading, setUpdateStatusLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateOrder, setUpdateOrder] = useState(false);
  const [order, setOrder] = useState<string | number>(service?.order ?? 1);
  const [editOrder, setEditOrder] = useState(false);

  const getStatusBadge = (status: string) => {
    const badges = {
      approved: { text: "مفعّل", color: "bg-green-100 text-green-800" },
      pending: { text: "قيد المراجعة", color: "bg-amber-100 text-amber-800" },
      rejected: { text: "مرفوض", color: "bg-red-100 text-red-800" },
      suspended: { text: "معلقة", color: "bg-yellow-100 text-yellow-800" },
    };
    return badges[status as keyof typeof badges];
  };

  const statusBadge = getStatusBadge(service.status);

  const onToggleStatus = async () => {
    try {
      setUpdateStatusLoading(true);
      const response = await instance.post(
        `/dashboard/update-service-status/${service.id}?status=approved`
      );

      if (response.status === 200) {
        toast.success("تم نشر الخدمه بنجاح");

        setServices((prev) =>
          prev.map((serv) =>
            serv.id === service.id ? { ...serv, status: "approved" } : serv
          )
        );
      }
    } catch (error) {
      console.log(error);
      toast.error("حدث خطأ أثناء نشر الخدمه");
    } finally {
      setUpdateStatusLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setDeleteLoading(true);
      const response = await instance.delete(
        `/dashboard/delete-service/${service.id}`
      );

      if (response.status === 200) {
        toast.success("تم حذف الخدمه بنجاح");

        setServices((prev) => {
          return prev.filter((org) => org.id !== service.id);
        });
      }
    } catch (error) {
      console.log(error);
      toast.error("حدث خطأ أثناء حذف الخدمه");
    } finally {
      setDeleteLoading(false);
    }
  };

  const toggleActive = async () => {
    try {
      setUpdateLoading(true);
      const newState = !service.active;
      const response = await instance.post(
        `/dashboard/update-service/${service.id}`,
        {
          active: newState ? "1" : "0",
        }
      );
      setServices((prev) =>
        prev.map((serv) =>
          serv.id === service.id ? { ...serv, active: newState ? 1 : 0 } : serv
        )
      );
      if (response.status == 200) {
        toast.success("تم تحديث حالة الخدمه بنجاح .");
      }
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        "حدث خطا أثناء محاولة تحديث حالة الخدمه";
      toast.error(message);
    } finally {
      setUpdateLoading(false);
    }
  };

  const updateServiceOrder = async () => {
    try {
      setUpdateOrder(true);
      const response = await instance.post(
        `/dashboard/update-service/${service.id}`,
        {
          order: order.toString(),
        }
      );
      if (response.status == 200) {
        toast.success("تم تحديث ترتيب الخدمه  بنجاح .");
        setEditOrder(false);
      }
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        "حدث خطا أثناء محاولة تحديث حالة الخدمه";
      toast.error(message);
    } finally {
      setUpdateOrder(false);
    }
  };

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-white h-full rounded-2xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-lg transition-all duration-300 hover:-translate-y-4"
      >
        {/* Image */}
        <div className="relative aspect-video">
          <Img
            src={service.image ?? "/defaults/noImage.png"}
            errorSrc="/defaults/noImage.png"
            alt={service.title}
            className="w-full h-full object-cover"
          />

          {/* Actions */}
          <div className="absolute top-3 left-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <LocaleLink
              href={`/dashboard/services/${
                service.id
              }?serviceTitle=${formatTitle(service.title)}`}
              className="p-2 bg-white rounded-lg shadow-sm hover:bg-sky-400 text-gray-600 hover:text-white hover:-translate-y-1 duration-200   tooltip"
              data-tip="تعديل"
            >
              <FiEdit2 className="w-4 h-4 " />
            </LocaleLink>
            <button
              onClick={() => setConfirmDelete(true)}
              className="p-2 bg-white rounded-lg shadow-sm hover:bg-red-400 text-red-500 hover:text-white hover:-translate-y-1 duration-200 tooltip"
              data-tip="حذف"
              title="حذف"
            >
              <FiTrash2 className="w-4 h-4 " />
            </button>
            {service.status != "approved" && (
              <button
                disabled={updateStatusLoading}
                onClick={() => onToggleStatus()}
                className="p-2 bg-white rounded-lg shadow-sm hover:bg-green-400 text-gray-400 hover:text-white hover:-translate-y-1 duration-200 tooltip flex items-center justify-center"
                data-tip="تفعيل"
              >
                {updateStatusLoading ? (
                  <VscLoading className="animate-spin text-red-600" />
                ) : (
                  <FiToggleLeft className="w-4 h-4 " />
                )}
              </button>
            )}
          </div>

          {/* Exclusive Badge */}
          {service.is_exclusive === 1 && (
            <div className="absolute top-3 right-3 bg-purple-500 text-white px-2 py-1 rounded-lg text-xs font-medium">
              حصري
            </div>
          )}

          {/* Discount Badge */}
          {(service.discount_percentage || service.discount_price) && (
            <div className="absolute bottom-3 right-3 bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-medium">
              {service.discount_percentage
                ? `${service.discount_percentage}% خصم`
                : `${service.discount_price} ر.س خصم`}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Title & Category */}
          <div className="mb-3">
            <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
              {service.title}
            </h3>

            <p className="block my-4 text-gray-500 trancate">
              {service.description.length > 80
                ? service.description.slice(0, 80) + "..."
                : service.description}
            </p>

            {service.category && (
              <div
                style={{
                  background: `${service.category.bg_color}20`,
                  color: `${service.category.bg_color}`,
                }}
                className="p-2 rounded-md flex items-center justify-center w-fit ml-auto"
              >
                <p className="text-sm text-gray-500">
                  {service.category.title_ar}
                </p>
              </div>
            )}
          </div>

          {/* Creator */}
          <div className="flex items-center gap-2 mb-3">
            <Img
              src={service.creater.image ?? "/defaults/noImage.png"}
              errorSrc="/defaults/noImage.png"
              alt={service.creater.name}
              className="w-6 h-6 rounded-full"
            />
            <span className="text-sm text-gray-600">
              {service.creater.name}
            </span>
          </div>

          {/* Rating & Orders */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1">
              <FiStar className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm font-medium">{service.rating}</span>
            </div>
            <div className="text-sm text-gray-500">
              {service.orders_count} طلب
            </div>
          </div>

          {/* Status Badge */}
          <div className="mb-3">
            <span
              className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${statusBadge?.color}`}
            >
              {statusBadge?.text}
            </span>
          </div>

          {/* Keywords */}
          <div className="flex flex-wrap gap-1 mb-3">
            {service.keywords.slice(0, 5).map((keyword) => (
              <span
                key={keyword.id}
                className="inline-block px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs"
              >
                {keyword.title}
              </span>
            ))}
            {service.keywords.length > 5 && (
              <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs">
                +{service.keywords.length - 5}
              </span>
            )}
          </div>

          {/* order control */}
          <div className="flex items-center justify-between gap-2 py-4 border-t border-gray-300">
            {/* Input with confirm & cancel */}
            {updateOrder ? (
              <VscLoading className="text-sky-400 animate-spin" />
            ) : (
              <div className="flex items-center gap-2">
                <div className="flex rounded-md shadow-sm border border-gray-300 overflow-hidden">
                  <input
                    disabled={!editOrder}
                    type="number"
                    name="order"
                    value={order}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setOrder(e.target.value)
                    }
                    className="px-2 py-1 w-20 disabled:bg-gray-100 outline-none border-0 focus:ring-0"
                  />
                  <button
                    type="button"
                    disabled={!editOrder}
                    className="px-2 bg-sky-500 text-white disabled:bg-gray-300"
                    onClick={() => updateServiceOrder()}
                  >
                    <FaCheck />
                  </button>
                  {editOrder && (
                    <button
                      type="button"
                      className="px-2 bg-red-500 text-white"
                      onClick={() => setEditOrder(false)}
                    >
                      <FaTimes />
                    </button>
                  )}
                </div>

                {!editOrder && (
                  <FaPen
                    onClick={() => setEditOrder(true)}
                    className="text-sky-500 cursor-pointer"
                  />
                )}
              </div>
            )}

            {/* Toggle */}
            {updateLoading ? (
              <VscLoading className="text-sky-400 animate-spin" />
            ) : service.active ? (
              <LiaToggleOnSolid
                className="text-green-500 size-8 cursor-pointer"
                onClick={() => toggleActive()}
              />
            ) : (
              <LiaToggleOffSolid
                className="text-gray-400 size-8 cursor-pointer"
                onClick={() => toggleActive()}
              />
            )}
          </div>

          {/* Footer */}
          <div className="text-xs text-gray-400 border-gray-300 border-t pt-2">
            {formatDate(service.created_at)}
          </div>
        </div>
      </motion.div>
      <ConfirmDeletePopup
        title={`الخدمه : ${service.title}`}
        id={service.id}
        loading={deleteLoading}
        showConfirm={confirmDelete}
        onDelete={() => onDelete()}
        onClose={() => setConfirmDelete(false)}
      />
    </>
  );
}
