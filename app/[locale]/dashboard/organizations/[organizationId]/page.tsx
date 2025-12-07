"use client";
import React from "react";
import LoadingSpin from "@/app/_components/LoadingSpin";
import { useOrganizationForm } from "./_hooks/useOrganizationForm";
import ImagesSection from "./_components/sections/ImagesSection";
import BasicInfoSection from "./_components/sections/BasicInfoSection";
import LocationSection from "./_components/sections/LocationSection";
import SettingsSection from "./_components/sections/SettingsSection";
import CategoriesSection from "./_components/sections/CategoriesSection";
import ExtraDataSection from "./_components/sections/ExtraDataSection";
import MessagesSection from "./_components/sections/MessagesSection";

export default function OrganizationPage() {
  const {
    formData,
    setFormData,
    isLoading,
    isSubmitting,
    errors,
    allCategories,
    allSubCategories,
    logoPreview,
    coverPreview,
    handleLogoChange,
    handleCoverChange,
    showMap,
    setShowMap,
    handleChange,
    toggleCategory,
    toggleSubCategory,
    handleBenefitChange,
    addBenefit,
    removeBenefit,
    onSubmit,
  } = useOrganizationForm();

  if (isLoading) return <LoadingSpin />;

  return (
    <div className="p-4 md:p-8 w-[99%] lg:w-[90%] mx-auto" dir="rtl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            تعديل المركز : {formData.title || "بدون اسم"}
          </h1>
          <p className="text-gray-500 mt-2">
            قم بتحديث بيانات المركز والتحكم في إعداداته من هنا
          </p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-8">
        <ImagesSection
          logoPreview={logoPreview}
          coverPreview={coverPreview}
          handleLogoChange={handleLogoChange}
          handleCoverChange={handleCoverChange}
        />

        <BasicInfoSection
          formData={formData}
          errors={errors}
          handleChange={handleChange}
        />

        <LocationSection
          formData={formData}
          setFormData={setFormData}
          showMap={showMap}
          setShowMap={setShowMap}
        />

        <SettingsSection formData={formData} handleChange={handleChange} />

        <CategoriesSection
          formData={formData}
          allCategories={allCategories}
          allSubCategories={allSubCategories}
          toggleCategory={toggleCategory}
          toggleSubCategory={toggleSubCategory}
          errors={errors}
        />

        <ExtraDataSection
          formData={formData}
          setFormData={setFormData}
          handleBenefitChange={handleBenefitChange}
          addBenefit={addBenefit}
          removeBenefit={removeBenefit}
        />

        <MessagesSection formData={formData} handleChange={handleChange} />

        <div className="pt-4 border-t border-gray-100 flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full md:w-auto px-12 py-4 bg-sky-600 text-white font-bold rounded-xl shadow-lg hover:bg-sky-700 hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
          >
            {isSubmitting ? "جاري الحفظ..." : "حفظ التغييرات"}
          </button>
        </div>
      </form>
    </div>
  );
}
