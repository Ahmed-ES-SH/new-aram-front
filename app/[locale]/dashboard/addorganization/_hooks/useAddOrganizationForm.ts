import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";
import { instance } from "@/app/_helpers/axios";
import { useAppSelector } from "@/app/Store/hooks";
// Reuse schema and config from the Edit page components to ensure consistency
import {
  formSchema,
  FormValues,
} from "../../organizations/[organizationId]/_components/schema";
import { STEPS } from "../../organizations/[organizationId]/_components/stepsConfig";
import useFetchData from "@/app/_helpers/FetchDataWithAxios";

export const useAddOrganizationForm = () => {
  const router = useRouter();

  // Redux & Local State
  const { data: allCategories, loading: isLoading } = useFetchData(
    `/categories-with-subcategories`,
    false
  );
  const [allSubCategories, setAllSubCategories] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Navigation State
  const [activeStep, setActiveStep] = useState(STEPS[0].id);

  // Form State - Initialized Empty
  const [formData, setFormData] = useState<FormValues>({
    active: 1, // Default to active
    booking_status: 1, // Default to available
    confirmation_status: 0,
    confirmation_price: 0,
    categories: [],
    sub_categories: [],
    keywords: [],
    benefits: [],
    location: {
      address: "",
      coordinates: { lat: 23.588, lng: 58.3829 }, // Default coordinates (Oman roughly)
    },
    title: "",
    description: "",
    email: "",
    password: "",
    phone_number: "",
    status: "published",
    open_at: "",
    close_at: "",
    url: "",
    accaptable_message: "",
    unaccaptable_message: "",
  });

  // File states
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  // Map State
  const [showMap, setShowMap] = useState(false);

  // Handle generic inputs
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  // Handlers for specific fields
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCoverFile(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const toggleCategory = (id: number) => {
    setFormData((prev) => {
      const currentCats = prev.categories || [];
      const exists = currentCats.includes(id);
      return {
        ...prev,
        categories: exists
          ? currentCats.filter((c) => c !== id)
          : [...currentCats, id],
      };
    });
  };

  const toggleSubCategory = (id: number) => {
    setFormData((prev) => {
      const currentSubCats = prev.sub_categories || [];
      const exists = currentSubCats.includes(id);
      return {
        ...prev,
        sub_categories: exists
          ? currentSubCats.filter((c) => c !== id)
          : [...currentSubCats, id],
      };
    });
  };

  const handleBenefitChange = (index: number, value: string) => {
    const updatedBenefits = [...(formData.benefits || [])];
    updatedBenefits[index] = { title: value };
    setFormData({ ...formData, benefits: updatedBenefits });
  };

  const addBenefit = () => {
    setFormData({
      ...formData,
      benefits: [...(formData.benefits || []), { title: "" }],
    });
  };

  const removeBenefit = (index: number) => {
    setFormData({
      ...formData,
      benefits: (formData.benefits || []).filter((_, i) => i !== index),
    });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    // 1. Validate Form Data locally with EXTENDED schema for Password
    const addOrgSchema = formSchema.extend({
      password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
    });

    const result = addOrgSchema.safeParse(formData);

    if (!result.success) {
      // Handle Validation Errors
      const fieldErrors: Record<string, string> = {};

      result.error.issues.forEach((issue) => {
        const path = issue.path.join(".");
        fieldErrors[path] = issue.message;
      });

      setErrors(fieldErrors);

      // Auto-navigate to first error
      const firstErrorPath = Object.keys(fieldErrors)[0];
      if (firstErrorPath) {
        const step = STEPS.find((s) =>
          s.fields.some(
            (field) =>
              field === firstErrorPath || firstErrorPath.startsWith(field + ".")
          )
        );

        if (step) {
          setActiveStep(step.id);
          toast.error(`يرجى مراجعة الأخطاء في: ${step.label}`);
        } else {
          toast.error("يرجى التأكد من صحة البيانات المدخلة");
        }
      }

      setIsSubmitting(false);
      return;
    }

    // 2. Submit Data if Valid
    try {
      const validatedData = result.data;
      const requestData = new FormData();

      // Append basic fields
      Object.entries(validatedData).forEach(([key, value]) => {
        if (
          key === "categories" ||
          key === "sub_categories" ||
          key === "keywords" ||
          key === "benefits" ||
          key === "location"
        ) {
          return; // Handle separately
        }

        if (key === "confirmation_status") {
          requestData.append(key, value ? "1" : "0");
          return;
        }

        requestData.append(key, String(value));
      });

      if (logoFile) requestData.append("logo", logoFile);
      if (coverFile) requestData.append("image", coverFile);

      requestData.append("location", JSON.stringify(validatedData.location));
      requestData.append(
        "categories",
        JSON.stringify(validatedData.categories)
      );
      requestData.append(
        "sub_categories",
        JSON.stringify(validatedData.sub_categories)
      );
      requestData.append("keywords", JSON.stringify(validatedData.keywords));
      requestData.append("benefits", JSON.stringify(validatedData.benefits));

      const response = await instance.post(`/add-organization`, requestData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (
        response.status === 200 ||
        response.status === 201 ||
        response.status === 204
      ) {
        toast.success("تم إنشاء المركز بنجاح");
        // Redirect to organizations list
        router.push("/ar/dashboard/organizations");
      }
    } catch (error: any) {
      console.error(error);
      const apiMessage = error?.response?.data?.message || "فشل إنشاء المركز";
      toast.error(apiMessage);

      if (error?.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    // State
    formData,
    setFormData,
    isLoading,
    isSubmitting,
    errors,
    allCategories,
    allSubCategories,

    // Images
    logoPreview,
    coverPreview,
    handleLogoChange,
    handleCoverChange,

    // Map
    showMap,
    setShowMap,

    // Handlers
    handleChange,
    toggleCategory,
    toggleSubCategory,
    handleBenefitChange,
    addBenefit,
    removeBenefit,
    onSubmit,

    // Navigation
    activeStep,
    setActiveStep,
  };
};
