"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { FiLoader } from "react-icons/fi";
import ServiceSidebarNavigation from "./ServiceSidebarNavigation";
import BottomPopup from "./BottomPopup";
import ServicePageEditoBody from "./ServicePageEditoBody";
import ServiceEditorHeader from "./ServiceEditorHeader";
import { DEFAULT_FORM_SCHEMA } from "@/app/_components/_dynamicForm";
import { DEFAULT_SERVICE_DATA } from "./constants";
import { useServicePageApi } from "./useServicePageApi";
import {
  ServicePageData,
  ServicePageEditorProps,
  activeSectionType,
} from "./types";

export default function ServicePageEditor({ mode }: ServicePageEditorProps) {
  const router = useRouter();
  const params = useParams();
  const serviceId = params.serviceId;

  const { fetchServicePage, saveServicePage, isLoading, isSaving } =
    useServicePageApi();

  const [activeSection, setActiveSection] = useState<activeSectionType>(
    mode === "create" ? "settings" : "hero_section"
  );
  const [hasChanges, setHasChanges] = useState(false);
  const [serviceData, setServiceData] =
    useState<ServicePageData>(DEFAULT_SERVICE_DATA);
  const [formSchema, setFormSchema] = useState<ServicePageData["form"]>(
    serviceData.form ?? DEFAULT_FORM_SCHEMA
  );

  // Save/Create handler
  const handleSave = async () => {
    if (mode === "create" && !serviceData.slug) {
      toast.error("يرجى إدخال الرابط");
      setActiveSection("settings");
      return;
    }

    try {
      const res = await saveServicePage(
        mode,
        serviceId,
        serviceData,
        formSchema
      );

      if (res.status === 200 || res.status === 201) {
        toast.success(
          mode === "create" ? "تم إنشاء صفحة الخدمة" : "تم حفظ التغييرات"
        );
        setHasChanges(false);
        setServiceData({
          ...serviceData,
          deleted_images: [],
          testimonials_images: [],
        });

        if (mode === "create") {
          router.push(`/dashboard/services/${res.data.data.id}`);
        }
      }
    } catch (error: any) {
      const errorMessages =
        error?.response?.data?.message ?? "فشل حفظ البيانات";
      toast.error(errorMessages);
    }
  };

  useEffect(() => {
    if (mode !== "edit" || !serviceId) return;

    fetchServicePage(serviceId)
      .then((data: any) => {
        setServiceData({
          ...data,
          deleted_images: [],
          testimonials_images: [],
        });
        if (data.form) {
          setFormSchema(mapBackendFormToFrontendSchema(data.form));
        }
      })
      .catch((err) => {
        console.error(err);
        toast.error("حدث خطأ أثناء تحميل البيانات");
      });
  }, [mode, serviceId]);

  // View Mapper
  const mapBackendFormToFrontendSchema = (backendForm: any): any => {
    if (!backendForm) return DEFAULT_FORM_SCHEMA;

    return {
      id: backendForm.id,
      title: backendForm.name_en || backendForm.title || "Form",
      fields: Array.isArray(backendForm.fields)
        ? backendForm.fields.map((f: any) => ({
            id: String(f.id || Math.random()),
            name: f.field_key,
            type: mapBackendTypeToFrontend(f.field_type),
            label: { ar: f.label_ar || "", en: f.label_en || "" },
            placeholder: {
              ar: f.placeholder_ar || "",
              en: f.placeholder_en || "",
            },
            required: f.is_required ? true : false,
            order: f.order || 0,
            options: f.options?.choices
              ? f.options.choices.map((c: any) => ({
                  label: {
                    ar: c.label_ar || c.label || "",
                    en: c.label_en || c.label || "",
                  },
                  value: c.value,
                }))
              : [],
          }))
        : [],
    };
  };

  const mapBackendTypeToFrontend = (type: string): string => {
    const mapping: Record<string, string> = {
      short_text: "text",
      long_text: "textarea",
      email: "email",
      number: "number",
      phone: "phone",
      date: "date",
      time: "time",
      dropdown: "select",
      radio: "radio",
      checkbox: "checkbox",
      image_upload: "image",
      file_upload: "file",
      url: "url",
    };
    return mapping[type] || type;
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <FiLoader className="animate-spin text-primary mx-auto" size={48} />
          <p className="mt-4 text-gray-600">جاري تحميل البيانات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  bg-gray-50 pb-24" dir="rtl">
      {/* Header */}
      <ServiceEditorHeader
        mode={mode}
        serviceId={serviceId as string}
        handleSave={handleSave}
        isSaving={isSaving}
        hasChanges={hasChanges}
      />

      <div className="lg:w-[92%] w-[99%] mx-auto px-6 py-6">
        <div className="flex gap-6">
          {/* Sidebar Navigation */}
          <ServiceSidebarNavigation
            mode={mode}
            activeSection={activeSection}
            setActiveSection={setActiveSection}
          />

          {/* Content Area */}
          <div className="flex-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <ServicePageEditoBody
                activeSection={activeSection}
                serviceData={serviceData}
                serServiceData={setServiceData}
                setHasChanges={setHasChanges}
                mode={mode}
                formSchema={formSchema}
                onFormSchemaChange={setFormSchema}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Unsaved Changes Banner */}
      <BottomPopup
        hasChanges={hasChanges}
        mode={mode}
        setServiceData={setServiceData}
        setHasChanges={setHasChanges}
        handleSave={handleSave}
        isSaving={isSaving}
      />
    </div>
  );
}
