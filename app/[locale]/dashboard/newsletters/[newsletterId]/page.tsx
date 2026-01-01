"use client";
import React, { useEffect, useState } from "react";
import { instance } from "@/app/_helpers/axios";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { useLocale } from "next-intl";
import { FaSave, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import LoadingSpin from "@/app/_components/LoadingSpin";
import ImageUpload from "@/app/_components/ImageUpload";

// Define form data structure based on requirements
interface NewsletterFormValues {
  subject: string;
  content: string;
  section_1_title: string;
  section_1_description: string;
  section_1_image: string;
  section_2_title: string;
  section_2_description: string;
  section_2_image: string;
  section_3_title: string;
  section_3_description: string;
  section_3_image: string;
}

const initialFormValues: NewsletterFormValues = {
  subject: "",
  content: "",
  section_1_title: "",
  section_1_description: "",
  section_1_image: "",
  section_2_title: "",
  section_2_description: "",
  section_2_image: "",
  section_3_title: "",
  section_3_description: "",
  section_3_image: "",
};

export default function NewsletterFormPage() {
  const params = useParams();
  const { newsletterId } = params;
  const isEditMode = newsletterId !== "new";
  const locale = useLocale();
  const router = useRouter();
  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("main"); // main, section1, section2, section3
  const [formData, setFormData] =
    useState<NewsletterFormValues>(initialFormValues);

  // Separate state for files
  const [files, setFiles] = useState<{ [key: string]: File | null }>({
    section_1_image: null,
    section_2_image: null,
    section_3_image: null,
  });

  useEffect(() => {
    if (isEditMode) {
      const fetchNewsletter = async () => {
        try {
          const response = await instance.get(`/newsletters/${newsletterId}`);
          if (response.status === 200) {
            // Merge response data with initial values to ensure all fields exist
            setFormData((prev) => ({
              ...prev,
              ...response.data.data,
            }));
          }
        } catch (error) {
          console.error(error);
          toast.error("Failed to load newsletter data");
          router.push(`/${locale}/dashboard/newsletters`);
        } finally {
          setLoading(false);
        }
      };
      fetchNewsletter();
    }
  }, [isEditMode, newsletterId, locale, router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (key: string, file: File | null) => {
    setFiles((prev) => ({ ...prev, [key]: file }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.subject.trim()) {
      toast.error("Subject is required");
      return;
    }

    setSubmitting(true);
    try {
      // Use FormData for file upload
      const data = new FormData();

      // Append text fields
      Object.keys(formData).forEach((key) => {
        const value = formData[key as keyof NewsletterFormValues];
        // Don't send null/undefined as string "null", send empty string or skip
        // But for update we usually want to send everything.
        if (value !== null && value !== undefined) {
          data.append(key, value);
        }
      });

      // Append files if they exist
      Object.keys(files).forEach((key) => {
        if (files[key]) {
          data.append(key, files[key]!);
        }
      });

      // For Laravel PUT requests with files, we often need _method: PUT inside POST
      if (isEditMode) {
        data.append("_method", "PUT");
        await instance.post(`/newsletters/${newsletterId}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Newsletter updated successfully");
      } else {
        await instance.post("/newsletters", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Newsletter created successfully");
      }
      router.push(`/${locale}/dashboard/newsletters`);
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Operation failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpin />;

  const tabs = [
    { id: "main", label: "المعلومات الأساسية" },
    { id: "section1", label: "القسم الأول" },
    { id: "section2", label: "القسم الثاني" },
    { id: "section3", label: "القسم الثالث" },
  ];

  return (
    <div dir="rtl" className="p-6 min-h-screen bg-gray-50/50 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-full hover:bg-gray-200 transition-colors"
          >
            <FaArrowRight className="text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">
            {isEditMode ? "تعديل النشرة البريدية" : "إنشاء نشرة بريدية جديدة"}
          </h1>
        </div>

        <button
          onClick={onSubmit}
          disabled={submitting}
          className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 font-medium disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {submitting ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <FaSave />
          )}
          <span>حفظ النشرة البريدية</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Tabs Sidebar */}
        <div className="lg:col-span-3 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              type="button"
              className={`w-full text-right px-4 py-3 rounded-xl font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-white text-primary shadow-sm ring-1 ring-primary/10 border-r-4 border-primary"
                  : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Form Content */}
        <div className="lg:col-span-9">
          <form
            onSubmit={onSubmit}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 min-h-[500px]"
          >
            {/* Main Info Tab */}
            {activeTab === "main" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <h2 className="text-lg font-bold text-gray-800 border-b pb-2">
                  المعلومات الأساسية
                </h2>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    عنوان الرسالة <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    type="text"
                    required
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all"
                    placeholder="أدخل عنوان النشرة البريدية"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    المحتوى التمهيدي
                  </label>
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    rows={8}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all resize-y"
                    placeholder="أدخل المحتوى الرئيسي..."
                  />
                </div>
              </div>
            )}

            {/* Sections Tabs */}
            {["section1", "section2", "section3"].map((sectionKey, index) => {
              if (activeTab !== sectionKey) return null;

              const prefix = `section_${index + 1}_`;
              const titleKey = `${prefix}title` as keyof NewsletterFormValues;
              const descKey =
                `${prefix}description` as keyof NewsletterFormValues;
              const imageKey = `${prefix}image` as string;

              return (
                <div
                  key={sectionKey}
                  className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300"
                >
                  <h2 className="text-lg font-bold text-gray-800 border-b pb-2">
                    محتوى القسم {index + 1}
                  </h2>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      عنوان القسم
                    </label>
                    <input
                      name={titleKey}
                      value={formData[titleKey]}
                      onChange={handleChange}
                      type="text"
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all"
                      placeholder={`أدخل عنوان القسم ${index + 1}`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      الوصف
                    </label>
                    <textarea
                      name={descKey}
                      value={formData[descKey]}
                      onChange={handleChange}
                      rows={6}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all resize-y"
                      placeholder={`أدخل وصف القسم ${index + 1}`}
                    />
                  </div>

                  <div>
                    <ImageUpload
                      label="صورة القسم"
                      defaultImage={
                        formData[imageKey as keyof NewsletterFormValues]
                      }
                      onImageChange={(file) => handleFileChange(imageKey, file)}
                    />
                  </div>
                </div>
              );
            })}
          </form>
        </div>
      </div>
    </div>
  );
}
