"use client";
import React, { useState } from "react";
import { useLocale } from "next-intl";
import { FiPlus, FiSave, FiUpload } from "react-icons/fi";
import { AdminServiceOrder, TrackingPhase, OrderStatus } from "./types";
import { toast } from "sonner";
import { instance } from "@/app/_helpers/axios";
import { useAppSelector } from "@/app/Store/hooks";
import { VscLoading } from "react-icons/vsc";

interface AddTrackingFormProps {
  order: AdminServiceOrder;
}

export default function AddTrackingForm({ order }: AddTrackingFormProps) {
  const { user } = useAppSelector((state) => state.user);

  const [phase, setPhase] = useState<TrackingPhase>("initiation");
  const [status, setStatus] = useState<OrderStatus>("in_progress");
  const [notes, setNotes] = useState("");
  const [files, setFiles] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);

  console.log(order);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);

      const metadata = {
        notes,
        priority: "high",
      };

      const formData = new FormData();
      formData.append("service_id", order.service.id.toString());
      formData.append("service_order_id", order.id.toString());
      if (user) formData.append("user_id", user?.id.toString());
      if (user) formData.append("user_type", user.account_type);
      formData.append("current_phase", phase);
      formData.append("status", status);
      formData.append("metadata", JSON.stringify(metadata));
      if (files) {
        for (let i = 0; i < files.length; i++) {
          formData.append("files[]", files[i]);
        }
      }
      const response = await instance.post(`/add-service-tracking`, formData);
      toast.success("تم اضافة التحديث بنجاح");
    } catch (error: any) {
      console.log(error);
      const message =
        error?.response?.data?.message ?? "حدث خطا اثناء اجراء العملية";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
        <FiPlus className="text-primary" />
        إضافة تحديث تتبع
      </h3>

      <form className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Phase */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              المرحلة
            </label>
            <select
              value={phase}
              onChange={(e) => setPhase(e.target.value as TrackingPhase)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-primary transition-all text-sm bg-white"
            >
              <option value="initiation">البدء</option>
              <option value="planning">التخطيط</option>
              <option value="execution">التنفيذ</option>
              <option value="delivery">التسليم</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              الحالة بعد التحديث
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as OrderStatus)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-primary transition-all text-sm bg-white"
            >
              <option value="pending">قيد الانتظار</option>
              <option value="in_progress">جاري العمل</option>
              <option value="completed">مكتمل</option>
            </select>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ملاحظات / بيانات إضافية
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-primary transition-all text-sm resize-none"
            placeholder="أدخل ملاحظات حول هذا التحديث..."
          />
        </div>

        {/* Files */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            المرفقات
          </label>
          <label className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-gray-200 rounded-xl hover:border-primary hover:bg-primary/5 cursor-pointer transition-all group">
            <div className="flex flex-col items-center">
              <FiUpload
                className="text-gray-400 group-hover:text-primary mb-2"
                size={24}
              />
              <span className="text-sm text-gray-500">اضغط لرفع الملفات</span>
            </div>
            <input
              type="file"
              multiple
              className="hidden"
              onChange={(e) => setFiles(e.target.files)}
            />
          </label>
          {files && files.length > 0 && (
            <div className="text-xs text-primary mt-2">
              {files.length} ملفات تم تحديدها
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          className="w-full  bg-primary text-white py-3 rounded-xl font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
        >
          {loading ? (
            <VscLoading className="animate-spin" />
          ) : (
            <div className="flex items-center gap-2">
              <FiSave />
              <span>حفظ التحديث</span>
            </div>
          )}
        </button>
      </form>
    </div>
  );
}
