"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  FiToggleLeft,
  FiToggleRight,
  FiPercent,
  FiRefreshCw,
  FiSave,
  FiAlertCircle,
} from "react-icons/fi";
import { Promoter } from "./types";
import { instance } from "@/app/_helpers/axios";
import { toast } from "sonner";
import { RiFileWarningFill } from "react-icons/ri";

interface SettingsSectionProps {
  promoter: Partial<Promoter>;
  onUpdate: (updates: Partial<Promoter>) => void;
}

export default function SettingsSection({
  promoter,
  onUpdate,
}: SettingsSectionProps) {
  const [discountPercent, setDiscountPercent] = useState(
    promoter.discount_percentage
  );
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [loading, setLoading] = useState<"status" | "code" | "percentage" | "">(
    ""
  );

  const handleSaveDiscount = async () => {
    try {
      setLoading("percentage");
      const response = await instance.post(
        `/update-promoter/${promoter.promoter_id}?discount_percentage=${discountPercent}`
      );
      if (response.status == 200) {
        toast.success("تم تحديث نسبة الخصم بنجاح");
        onUpdate({ discount_percentage: discountPercent });
      }
    } catch (error: any) {
      const message =
        error?.response?.data?.message ??
        "حدث خطأ غير متوقع اثناء اجراء العملية";
      toast.error(message);
    } finally {
      setLoading("");
    }
  };

  const handleToggleActive = async () => {
    try {
      setLoading("status");
      const newStatus = promoter.status == "active" ? "disabled" : "active";
      const response = await instance.post(
        `/update-promoter/${promoter.promoter_id}?status=${newStatus}`
      );
      if (response.status == 200) {
        toast.success("تم تحديث حالة المروج بنجاح");
        onUpdate({ status: newStatus });
      }
    } catch (error: any) {
      const message =
        error?.response?.data?.message ??
        "حدث خطأ غير متوقع اثناء اجراء العملية";
      toast.error(message);
    } finally {
      setLoading("");
    }
  };

  const handleResetReferralCode = async () => {
    try {
      setLoading("code");
      const response = await instance.post(
        `/update-promoter/${promoter.promoter_id}?referral_code=${promoter.referral_code}`
      );
      if (response.status == 200) {
        toast.success("تم تحديث كود الإحالة بنجاح");
        onUpdate({ referral_code: promoter.referral_code });
      }
    } catch (error: any) {
      const message =
        error?.response?.data?.message ??
        "حدث خطأ غير متوقع اثناء اجراء العملية";
      toast.error(message);
    } finally {
      setLoading("");
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto space-y-6"
    >
      <h2 className="text-2xl font-bold text-foreground">الإعدادات</h2>

      {/* Toggle Active Status */}
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-foreground mb-1">
              تفعيل/تعطيل المروج
            </h3>
            <p className="text-sm text-muted-foreground">
              عند التعطيل، لن يعمل رابط الإحالة ولن يتم تسجيل أي نشاطات جديدة
            </p>
          </div>
          <button
            onClick={handleToggleActive}
            disabled={loading == "status"}
            className={`p-2 rounded-lg transition-colors ${
              promoter.status == "active" ? "text-green-600" : "text-gray-400"
            }`}
          >
            {loading == "status" ? (
              <FiRefreshCw className="w-10 h-10 animate-spin" />
            ) : promoter.status == "active" ? (
              <FiToggleRight className="w-10 h-10" />
            ) : (
              <FiToggleLeft className="w-10 h-10" />
            )}
          </button>
        </div>
        <div
          className={`mt-4 px-4 py-2 rounded-lg text-sm font-medium ${
            promoter.status == "active"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          الحالة الحالية: {promoter.status == "active" ? "نشط" : "معطل"}
        </div>
      </div>

      {/* Discount Percent */}
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex items-center gap-2 mb-4">
          <FiPercent className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">تعديل نسبة الخصم</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          نسبة الخصم التي يحصل عليها العملاء عند استخدام كود الإحالة
        </p>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="relative">
              <input
                type="number"
                min="0"
                max="100"
                value={discountPercent}
                onChange={(e) => setDiscountPercent(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary text-lg"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                %
              </span>
            </div>
          </div>
          <button
            onClick={handleSaveDiscount}
            disabled={
              loading == "percentage" ||
              discountPercent === promoter.discount_percentage
            }
            className="flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiSave className="w-4 h-4" />
            {loading == "percentage" ? "جاري الحفظ..." : "حفظ"}
          </button>
        </div>
      </div>

      {/* Reset Referral Code */}
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex items-center gap-2 mb-4">
          <RiFileWarningFill className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">
            إعادة تعيين كود الإحالة
          </h3>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          كود الإحالة الحالي:{" "}
          <span className="font-mono font-semibold">
            {promoter.referral_code}
          </span>
        </p>

        {/* {!showResetConfirm ? (
          <button
            onClick={() => setShowResetConfirm(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-amber-300 bg-amber-50 text-amber-700 font-medium hover:bg-amber-100 transition-colors"
          >
            <FiRefreshCw className="w-4 h-4" />
            إعادة تعيين الكود
          </button>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-lg bg-red-50 border border-red-200"
          >
            <div className="flex items-start gap-3 mb-4">
              <FiAlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-700">تحذير</p>
                <p className="text-sm text-red-600">
                  سيتم إنشاء كود إحالة جديد. الكود القديم لن يعمل بعد الآن.
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleResetReferralCode}
                className="px-4 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-colors"
              >
                تأكيد الإعادة
              </button>
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 rounded-lg bg-white border border-border text-foreground font-medium hover:bg-secondary transition-colors"
              >
                إلغاء
              </button>
            </div>
          </motion.div>
        )} */}
      </div>
    </motion.section>
  );
}
