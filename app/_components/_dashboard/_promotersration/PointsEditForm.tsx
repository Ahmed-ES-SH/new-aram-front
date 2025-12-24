"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaEdit, FaSave, FaUndo } from "react-icons/fa";
import { toast } from "sonner";
import { instance } from "@/app/_helpers/axios";
import InputField from "./InputField";

interface PointsData {
  id: number;
  visit_ratio: number;
  signup_ratio: number;
  purchase_ratio: number;
  service_ratio: number;
  created_at?: string;
  updated_at?: string;
}

const PointsEditForm = ({ initialData }: { initialData?: PointsData }) => {
  const [formData, setFormData] = useState<PointsData>(
    initialData || {
      id: 1,
      visit_ratio: 1,
      signup_ratio: 1,
      purchase_ratio: 1,
      service_ratio: 1,
    }
  );

  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) setFormData(initialData);
  }, [initialData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value || 0, // ← أهم إصلاح يمنع فقدان التركيز
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    ["visit_points", "signup_points", "purchase_points"].forEach((key) => {
      if (formData[key] < 0) newErrors[key] = "يجب أن تكون النقاط عدداً موجباً";
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      setIsLoading(true);

      const res = await instance.put(`/update-ratios`, formData);

      if (res.status === 200) toast.success("تم التحديث بنجاح");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "حدث خطأ ما");
    } finally {
      setIsLoading(false);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setFormData(initialData!);
    setErrors({});
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center w-full p-4 md:p-6">
      <div className="xl:w-[600px] lg:w-3/4 md:w-[90%] w-[98%] border border-gray-200 rounded-lg shadow-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 md:p-8"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl pb-2 border-b border-primary w-fit mx-auto font-bold text-gray-800 mb-2">
              نظام إدارة نقاط المروجين
            </h1>
            <p className="text-gray-600">
              قم بتعديل عدد النقاط لكل عملية حسب الحاجة
            </p>
          </div>

          {/* Inputs */}
          <InputField
            label="نقاط الزيارة"
            name="visit_ratio"
            value={formData.visit_ratio}
            disabled={!isEditing || isLoading}
            error={errors.visit_ratio}
            onChange={handleInputChange}
          />

          <InputField
            label="نقاط التسجيل"
            name="signup_ratio"
            value={formData.signup_ratio}
            disabled={!isEditing || isLoading}
            error={errors.signup_ratio}
            onChange={handleInputChange}
          />

          <InputField
            label="النسبة من عملية الشراء"
            name="purchase_ratio"
            value={formData.purchase_ratio}
            disabled={!isEditing || isLoading}
            error={errors.purchase_ratio}
            onChange={handleInputChange}
          />

          <InputField
            label="النسبة من عملية شراء الخدمه"
            name="service_ratio"
            value={formData.service_ratio}
            disabled={!isEditing || isLoading}
            error={errors.service_ratio}
            onChange={handleInputChange}
          />

          {/* Timestamps */}
          {!isEditing && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100 text-right text-sm text-blue-700">
              آخر تحديث:
              {" " +
                new Date(formData.updated_at ?? "").toLocaleDateString("ar-SA")}
            </div>
          )}

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            {!isEditing ? (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow"
              >
                <FaEdit /> تعديل النقاط
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isLoading}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow"
                >
                  {isLoading ? (
                    "جاري الحفظ..."
                  ) : (
                    <>
                      {" "}
                      <FaSave /> حفظ{" "}
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={isLoading}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg shadow"
                >
                  <FaUndo /> إلغاء
                </button>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PointsEditForm;
