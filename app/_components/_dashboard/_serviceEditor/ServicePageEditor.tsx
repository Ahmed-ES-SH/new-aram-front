"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  FiLayout,
  FiImage,
  FiAlertCircle,
  FiCheckCircle,
  FiBarChart2,
  FiMessageSquare,
  FiZap,
  FiSave,
  FiArrowRight,
  FiLoader,
  FiPlus,
  FiSettings,
} from "react-icons/fi";
import {
  ServicePageData,
  SectionType,
  SECTION_LABELS,
  HeroSection,
  GallerySection,
  ProblemSection,
  SolutionSection,
  StatItem,
  TestimonialsSection,
  CTASection,
} from "./types";
import HeroSectionEditor from "./HeroSectionEditor";
import GallerySectionEditor from "./GallerySectionEditor";
import ProblemSectionEditor from "./ProblemSectionEditor";
import SolutionSectionEditor from "./SolutionSectionEditor";
import StatsSectionEditor from "./StatsSectionEditor";
import TestimonialsSectionEditor from "./TestimonialsSectionEditor";
import CTASectionEditor from "./CTASectionEditor";
import FormSchemaEditor from "./FormSchemaEditor";
import { instance } from "@/app/_helpers/axios";
import { useAppSelector } from "@/app/Store/hooks";
import {
  FormSchema,
  DEFAULT_FORM_SCHEMA,
} from "@/app/_components/_dynamicForm/types";

// Section icons mapping
const SECTION_ICONS: Record<
  SectionType | "settings" | "form",
  React.ComponentType<{ className?: string; size?: number }>
> = {
  hero: FiLayout,
  gallery: FiImage,
  problem: FiAlertCircle,
  solution: FiCheckCircle,
  stats: FiBarChart2,
  testimonials: FiMessageSquare,
  cta: FiZap,
  settings: FiSettings,
  form: FiPlus,
};

// Section colors mapping
const SECTION_COLORS: Record<SectionType | "settings" | "form", string> = {
  hero: "bg-primary/10 text-primary",
  gallery: "bg-green-100 text-green-600",
  problem: "bg-red-100 text-red-600",
  solution: "bg-emerald-100 text-emerald-600",
  stats: "bg-purple-100 text-purple-600",
  testimonials: "bg-yellow-100 text-yellow-600",
  cta: "bg-orange-100 text-orange-600",
  settings: "bg-gray-100 text-gray-600",
  form: "bg-blue-100 text-blue-600",
};

// Default data for new services
export const DEFAULT_SERVICE_DATA: ServicePageData = {
  id: 0,
  slug: "",
  hero: {
    badge: "",
    title: "",
    subtitle: "",
    description: "",
    watchBtn: "",
    exploreBtn: "",
    heroImage: "",
    backgroundImage: "",
  },
  gallery: {
    translations: {
      galleryTitle: "معرض صور الخدمة",
      viewDetails: "عرض الصورة",
      close: "إغلاق",
      next: "التالي",
      prev: "السابق",
    },
    images: [],
  },
  problemSection: {
    title: "",
    subtitle: "",
    items: [],
  },
  solutionSection: {
    title: "",
    subtitle: "",
    cta: "",
    previewImage: "",
    features: [],
  },
  stats: [],
  testimonials: {
    title: "",
    items: [],
  },
  cta: {
    ctaTitle: "",
    ctaSubtitle: "",
    ctaButton1: "",
    ctaButton2: "",
  },
};

// Basic settings for service page creation
interface ServicePageSettings {
  slug: string;
  title: string;
  type: "service" | "product";
  category_id: string;
  price: string;
  price_before_discount: string;
  is_active: boolean;
}

const DEFAULT_SETTINGS: ServicePageSettings = {
  slug: "",
  title: "",
  type: "service",
  category_id: "",
  price: "",
  price_before_discount: "",
  is_active: true,
};

interface ServicePageEditorProps {
  mode: "create" | "edit";
  serviceId?: string;
}

export default function ServicePageEditor({
  mode,
  serviceId,
}: ServicePageEditorProps) {
  const router = useRouter();
  const { categories } = useAppSelector((state) => state.categories);

  const [activeSection, setActiveSection] = useState<
    SectionType | "settings" | "form"
  >(mode === "create" ? "settings" : "hero");
  const [serviceData, setServiceData] =
    useState<ServicePageData>(DEFAULT_SERVICE_DATA);
  const [settings, setSettings] =
    useState<ServicePageSettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(mode === "edit");
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [formSchema, setFormSchema] = useState<FormSchema>(DEFAULT_FORM_SCHEMA);

  // Sections list - include settings only for create mode
  const sections: (SectionType | "settings" | "form")[] =
    mode === "create"
      ? [
          "settings",
          "hero",
          "gallery",
          "problem",
          "solution",
          "stats",
          "testimonials",
          "cta",
          "form",
        ]
      : [
          "hero",
          "gallery",
          "problem",
          "solution",
          "stats",
          "testimonials",
          "cta",
          "form",
        ];

  // Fetch service data (edit mode only)
  useEffect(() => {
    const fetchServiceData = async () => {
      if (mode !== "edit" || !serviceId) return;

      setIsLoading(true);
      try {
        const response = await instance.get(`/get-service-page/${serviceId}`);
        if (response.status === 200 && response.data.data) {
          const data = response.data.data;
          setServiceData({ ...DEFAULT_SERVICE_DATA, ...data });
          // Extract settings from fetched data
          setSettings({
            slug: data.slug || "",
            title: data.hero?.title || "",
            type: data.type || "service",
            category_id: data.category_id?.toString() || "",
            price: data.price || "",
            price_before_discount: data.price_before_discount || "",
            is_active: data.is_active ?? true,
          });
        }
      } catch (error) {
        console.error("Error fetching service data:", error);
        toast.error("حدث خطأ أثناء تحميل بيانات الخدمة");
      } finally {
        setIsLoading(false);
      }
    };

    fetchServiceData();
  }, [mode, serviceId]);

  // Update handlers
  const updateHero = (data: HeroSection) => {
    setServiceData((prev) => ({ ...prev, hero: data }));
    setHasChanges(true);
  };

  const updateGallery = (data: GallerySection) => {
    setServiceData((prev) => ({ ...prev, gallery: data }));
    setHasChanges(true);
  };

  const updateProblem = (data: ProblemSection) => {
    setServiceData((prev) => ({ ...prev, problemSection: data }));
    setHasChanges(true);
  };

  const updateSolution = (data: SolutionSection) => {
    setServiceData((prev) => ({ ...prev, solutionSection: data }));
    setHasChanges(true);
  };

  const updateStats = (data: StatItem[]) => {
    setServiceData((prev) => ({ ...prev, stats: data }));
    setHasChanges(true);
  };

  const updateTestimonials = (data: TestimonialsSection) => {
    setServiceData((prev) => ({ ...prev, testimonials: data }));
    setHasChanges(true);
  };

  const updateCTA = (data: CTASection) => {
    setServiceData((prev) => ({ ...prev, cta: data }));
    setHasChanges(true);
  };

  const updateSettings = (key: keyof ServicePageSettings, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const updateFormSchema = (schema: FormSchema) => {
    setFormSchema(schema);
    setHasChanges(true);
  };

  // Save/Create handler
  const handleSave = async () => {
    // Validation for create mode
    if (mode === "create") {
      if (!settings.slug.trim()) {
        toast.error("يرجى إدخال رابط الصفحة (Slug)");
        setActiveSection("settings");
        return;
      }
      if (!settings.category_id) {
        toast.error("يرجى اختيار التصنيف");
        setActiveSection("settings");
        return;
      }
    }

    setIsSaving(true);
    try {
      const payload = {
        ...serviceData,
        ...settings,
        slug: settings.slug,
      };

      let response;
      if (mode === "create") {
        response = await instance.post("/dashboard/service-pages", payload);
      } else {
        response = await instance.put(
          `/dashboard/service-pages/${serviceId}`,
          payload
        );
      }

      if (response.status === 200 || response.status === 201) {
        setHasChanges(false);
        toast.success(
          mode === "create"
            ? "تم إنشاء صفحة الخدمة بنجاح"
            : "تم حفظ التغييرات بنجاح"
        );

        if (mode === "create" && response.data.data?.id) {
          // Redirect to edit page after creation
          router.push(`/dashboard/services/${response.data.data.id}`);
        }
      }
    } catch (error: any) {
      console.error("Error saving service data:", error);
      const message =
        error?.response?.data?.message || "حدث خطأ أثناء حفظ البيانات";
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
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
    <div className="min-h-screen bg-gray-50 pb-24" dir="rtl">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FiArrowRight size={20} />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {mode === "create"
                    ? "إنشاء صفحة خدمة جديدة"
                    : "تحرير صفحة الخدمة"}
                </h1>
                {mode === "edit" && (
                  <p className="text-sm text-gray-500">ID: {serviceId}</p>
                )}
                {mode === "create" && (
                  <p className="text-sm text-gray-500">
                    أكمل جميع الأقسام لإنشاء صفحة مميزة
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={handleSave}
              disabled={isSaving || (!hasChanges && mode === "edit")}
              className={`
                flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all
                ${
                  hasChanges || mode === "create"
                    ? "bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/25"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }
              `}
            >
              {isSaving ? (
                <FiLoader className="animate-spin" size={18} />
              ) : mode === "create" ? (
                <FiPlus size={18} />
              ) : (
                <FiSave size={18} />
              )}
              {isSaving
                ? "جاري الحفظ..."
                : mode === "create"
                ? "إنشاء الصفحة"
                : "حفظ التغييرات"}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex gap-6">
          {/* Sidebar Navigation */}
          <div className="w-64 shrink-0">
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 sticky top-24">
              <h3 className="text-sm font-medium text-gray-500 mb-4 px-2">
                أقسام الصفحة
              </h3>
              <nav className="space-y-1">
                {sections.map((section) => {
                  const Icon = SECTION_ICONS[section];
                  const isActive = activeSection === section;
                  const label =
                    section === "settings"
                      ? { ar: "الإعدادات الأساسية", en: "Basic Settings" }
                      : section === "form"
                      ? { ar: "نموذج الطلب", en: "Order Form" }
                      : SECTION_LABELS[section as SectionType];

                  return (
                    <button
                      key={section}
                      onClick={() => setActiveSection(section)}
                      className={`
                        w-full flex items-center gap-3 px-4 py-3 rounded-xl text-right transition-all
                        ${
                          isActive
                            ? "bg-primary text-white shadow-lg shadow-primary/25"
                            : "hover:bg-gray-50 text-gray-700"
                        }
                      `}
                    >
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          isActive ? "bg-white/20" : SECTION_COLORS[section]
                        }`}
                      >
                        <Icon size={16} />
                      </div>
                      <span className="font-medium">{label.ar}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSection}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Settings Section (Create mode) */}
                  {activeSection === "settings" && (
                    <SettingsSection
                      settings={settings}
                      categories={categories}
                      onChange={updateSettings}
                    />
                  )}

                  {activeSection === "hero" && (
                    <HeroSectionEditor
                      data={serviceData.hero}
                      onChange={updateHero}
                    />
                  )}
                  {activeSection === "gallery" && (
                    <GallerySectionEditor
                      data={serviceData.gallery}
                      onChange={updateGallery}
                    />
                  )}
                  {activeSection === "problem" && (
                    <ProblemSectionEditor
                      data={serviceData.problemSection}
                      onChange={updateProblem}
                    />
                  )}
                  {activeSection === "solution" && (
                    <SolutionSectionEditor
                      data={serviceData.solutionSection}
                      onChange={updateSolution}
                    />
                  )}
                  {activeSection === "stats" && (
                    <StatsSectionEditor
                      data={serviceData.stats}
                      onChange={updateStats}
                    />
                  )}
                  {activeSection === "testimonials" && (
                    <TestimonialsSectionEditor
                      data={serviceData.testimonials}
                      onChange={updateTestimonials}
                    />
                  )}
                  {activeSection === "cta" && (
                    <CTASectionEditor
                      data={serviceData.cta}
                      onChange={updateCTA}
                    />
                  )}
                  {activeSection === "form" && (
                    <FormSchemaEditor
                      schema={formSchema}
                      onChange={updateFormSchema}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Unsaved Changes Banner */}
      <AnimatePresence>
        {hasChanges && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl p-4 z-50"
          >
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <p className="text-gray-600">
                {mode === "create"
                  ? "لديك بيانات غير محفوظة"
                  : "لديك تغييرات غير محفوظة"}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    if (mode === "create") {
                      setServiceData(DEFAULT_SERVICE_DATA);
                      setSettings(DEFAULT_SETTINGS);
                      setHasChanges(false);
                    } else {
                      window.location.reload();
                    }
                  }}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  {mode === "create" ? "إعادة تعيين" : "إلغاء التغييرات"}
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  {isSaving ? (
                    <FiLoader className="animate-spin" size={16} />
                  ) : mode === "create" ? (
                    <FiPlus size={16} />
                  ) : (
                    <FiSave size={16} />
                  )}
                  {mode === "create" ? "إنشاء الصفحة" : "حفظ التغييرات"}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Settings Section Component
interface SettingsSectionProps {
  settings: ServicePageSettings;
  categories: any[];
  onChange: (key: keyof ServicePageSettings, value: any) => void;
}

function SettingsSection({
  settings,
  categories,
  onChange,
}: SettingsSectionProps) {
  return (
    <div className="space-y-6">
      <div className="border-b border-gray-100 pb-4">
        <h2 className="text-xl font-bold text-gray-900">الإعدادات الأساسية</h2>
        <p className="text-sm text-gray-500 mt-1">
          أدخل المعلومات الأساسية لصفحة الخدمة
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Slug */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            رابط الصفحة (Slug) <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={settings.slug}
            onChange={(e) =>
              onChange(
                "slug",
                e.target.value.toLowerCase().replace(/\s+/g, "-")
              )
            }
            placeholder="مثال: nfc-cards"
            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            dir="ltr"
          />
          <p className="text-xs text-gray-400 mt-1">
            سيظهر في الرابط: /services/{settings.slug || "your-slug"}
          </p>
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            عنوان الصفحة
          </label>
          <input
            type="text"
            value={settings.title}
            onChange={(e) => onChange("title", e.target.value)}
            placeholder="عنوان صفحة الخدمة"
            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            التصنيف <span className="text-red-500">*</span>
          </label>
          <select
            value={settings.category_id}
            onChange={(e) => onChange("category_id", e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none appearance-none bg-white cursor-pointer"
          >
            <option value="">اختر التصنيف</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.title_ar}
              </option>
            ))}
          </select>
        </div>

        {/* Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            النوع
          </label>
          <div className="flex gap-3">
            {[
              { value: "service", label: "خدمة" },
              { value: "product", label: "منتج" },
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => onChange("type", option.value)}
                className={`flex-1 p-3 rounded-xl font-medium transition-all ${
                  settings.type === option.value
                    ? "bg-primary text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            السعر
          </label>
          <div className="relative">
            <input
              type="number"
              value={settings.price}
              onChange={(e) => onChange("price", e.target.value)}
              placeholder="0.00"
              min="0"
              step="0.01"
              className="w-full p-3 pl-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
              ر.ع
            </span>
          </div>
        </div>

        {/* Price Before Discount */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            السعر قبل الخصم
          </label>
          <div className="relative">
            <input
              type="number"
              value={settings.price_before_discount}
              onChange={(e) =>
                onChange("price_before_discount", e.target.value)
              }
              placeholder="0.00"
              min="0"
              step="0.01"
              className="w-full p-3 pl-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
              ر.ع
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            اتركه فارغاً إذا لم يكن هناك خصم
          </p>
        </div>

        {/* Is Active */}
        <div className="md:col-span-2">
          <label className="flex items-center gap-3 cursor-pointer">
            <div
              onClick={() => onChange("is_active", !settings.is_active)}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                settings.is_active ? "bg-green-500" : "bg-gray-300"
              }`}
            >
              <div
                className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${
                  settings.is_active ? "right-1" : "left-1"
                }`}
              />
            </div>
            <span className="text-sm font-medium text-gray-700">
              تفعيل الصفحة فور الإنشاء
            </span>
          </label>
        </div>
      </div>
    </div>
  );
}
