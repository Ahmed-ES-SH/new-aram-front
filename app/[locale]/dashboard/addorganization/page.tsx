"use client";
import { useRouter } from "next/navigation";
import { useAddOrganizationForm } from "./_hooks/useAddOrganizationForm";
import LoadingSpin from "@/app/_components/LoadingSpin";

// Reusing components from the Edit Organization feature
import OrganizationSidebar from "../organizations/[organizationId]/_components/OrganizationSidebar";
import ImagesSection from "../organizations/[organizationId]/_components/sections/ImagesSection";
import BasicInfoSection from "../organizations/[organizationId]/_components/sections/BasicInfoSection";
import LocationSection from "../organizations/[organizationId]/_components/sections/LocationSection";
import SettingsSection from "../organizations/[organizationId]/_components/sections/SettingsSection";
import CategoriesSection from "../organizations/[organizationId]/_components/sections/CategoriesSection";
import ExtraDataSection from "../organizations/[organizationId]/_components/sections/ExtraDataSection";
import MessagesSection from "../organizations/[organizationId]/_components/sections/MessagesSection";

export default function AddOrganizationPage() {
  const router = useRouter();

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
    activeStep,
    setActiveStep,
  } = useAddOrganizationForm();

  if (isLoading) return <LoadingSpin />;

  return (
    <div className="p-4 md:p-8 w-[99%] lg:w-[90%] mx-auto" dir="rtl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="lg:text-3xl text-lg font-bold text-gray-900">
            إضافة مركز جديد
          </h1>
          <p className="text-gray-500 mt-2">
            قم بملء البيانات التالية لإنشاء مركز جديد في النظام
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-3">
          <OrganizationSidebar
            activeStep={activeStep}
            onStepChange={setActiveStep}
            errors={errors}
            isSubmitting={isSubmitting}
          />
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-9 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <form onSubmit={onSubmit}>
            {activeStep === "images" && (
              <ImagesSection
                logoPreview={logoPreview}
                coverPreview={coverPreview}
                handleLogoChange={handleLogoChange}
                handleCoverChange={handleCoverChange}
              />
            )}

            {activeStep === "basic" && (
              <BasicInfoSection
                formData={formData}
                errors={errors}
                handleChange={handleChange}
                showPassword={true}
              />
            )}

            {activeStep === "location" && (
              <LocationSection
                formData={formData}
                setFormData={setFormData}
                showMap={showMap}
                setShowMap={setShowMap}
                errors={errors}
              />
            )}

            {activeStep === "settings" && (
              <SettingsSection
                formData={formData}
                handleChange={handleChange}
                errors={errors}
              />
            )}

            {activeStep === "categories" && (
              <CategoriesSection
                formData={formData}
                allCategories={allCategories as any}
                allSubCategories={allSubCategories}
                toggleCategory={toggleCategory}
                toggleSubCategory={toggleSubCategory}
                errors={errors}
              />
            )}

            {activeStep === "extra" && (
              <ExtraDataSection
                formData={formData}
                setFormData={setFormData}
                handleBenefitChange={handleBenefitChange}
                addBenefit={addBenefit}
                removeBenefit={removeBenefit}
              />
            )}

            {activeStep === "messages" && (
              <MessagesSection
                formData={formData}
                handleChange={handleChange}
              />
            )}

            {/* Global Actions */}
            <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-3 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors"
              >
                إلغاء
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full md:w-auto px-12 py-3 bg-sky-600 text-white font-bold rounded-xl shadow-lg hover:bg-sky-700 hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
              >
                {isSubmitting ? "جاري الإنشاء..." : "إنشاء المركز"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
