"use client";
import Img from "@/app/_components/_website/_global/Img";
import { AdminServiceOrder, OrderStatus } from "../types";
import { FiCalendar } from "react-icons/fi";
import CustomSelect from "../CustomSelect";
import { toast } from "sonner";
import { instance } from "@/app/_helpers/axios";
import { Dispatch, SetStateAction, useState } from "react";
import { VscLoading } from "react-icons/vsc";

interface OrderInfoProps {
  order: AdminServiceOrder;
  setOrder: Dispatch<SetStateAction<AdminServiceOrder>>;
}

export default function OrderInfo({ order, setOrder }: OrderInfoProps) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(order?.status ?? "pending");

  const handleUpdateStatus = async () => {
    try {
      setLoading(true);
      const response = await instance.post(
        `/service-orders/${order?.id}/update-status`,
        {
          status,
        }
      );

      if (response.status === 200) {
        toast.success("تم تحديث حالة الطلب");
        setOrder({ ...order, status });
      }
    } catch (error: any) {
      console.log(error);
      const message = error?.response?.data?.message ?? "حدث خطأ ما";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const disabled = status === order.status;

  return (
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

        <div className="flex items-center gap-2 w-full">
          <CustomSelect
            options={[
              { value: "pending", label: "قيد الانتظار" },
              { value: "in_progress", label: "قيد التنفيذ" },
              { value: "completed", label: "تم الانتهاء" },
              { value: "cancelled", label: "تم الالغاء" },
            ]}
            value={status}
            onChange={(value: any) => setStatus(value)}
            placeholder="حالة الطلب"
          />
          <button
            onClick={handleUpdateStatus}
            disabled={disabled || loading}
            className="px-3 py-2 w-fit flex items-center justify-center bg-primary text-white rounded-sm hover:bg-primary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <VscLoading className="size-5 animate-spin" /> : "تحديث"}
          </button>
        </div>
      </div>
    </div>
  );
}
