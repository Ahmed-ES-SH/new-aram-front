"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { instance } from "@/app/_helpers/axios";
import { formSchema, FormValues } from "../_components/schema";
import { STEPS } from "../_components/stepsConfig";
import useFetchData from "@/app/_helpers/FetchDataWithAxios";

export const useOrganizationForm = () => {
  const params = useParams();
  const router = useRouter();
  const organizationId = params.organizationId as string;

  // Redux & Local State
  const { data: allCategories } = useFetchData(`/all-public-categories`, false);
  const [allSubCategories, setAllSubCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Navigation State
  const [activeStep, setActiveStep] = useState(STEPS[0].id);

  // Form State
  const [formData, setFormData] = useState<FormValues>({
    active: 0,
    booking_status: 0,
    confirmation_status: 0,
    confirmation_price: 0,
    categories: [],
    sub_categories: [],
    keywords: [],
    benefits: [],
    location: {
      address: "",
      coordinates: { lat: 23.588, lng: 58.3829 },
    },
    title: "",
    description: "",
    email: "",
    phone_number: "",
    status: "published",
    open_at: "",
    close_at: "",
    url: "",
    accaptable_message: "",
    unaccaptable_message: "",
    email_verified: false,
  });

  // File states
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  // Map State
  const [showMap, setShowMap] = useState(false);

  // State for email verification
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  // Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [orgRes, subCatRes] = await Promise.all([
          instance.get(`/organizations/${organizationId}`),
          instance.get(`/all-public-sub-categories`),
        ]);

        const orgData = orgRes.data.data;

        // Set email verified status
        setIsEmailVerified(
          !!orgData.email_verified_at || !!orgData.email_verified
        );

        // Prepare initial form data
        const initialLocation =
          typeof orgData.location === "string"
            ? JSON.parse(orgData.location)
            : orgData.location;

        setFormData({
          id: orgData.id,
          title: orgData.title,
          description: orgData.description,
          email: orgData.email,
          phone_number: orgData.phone_number || "",
          status: orgData.status,
          active: orgData.active,
          email_verified: orgData.email_verified,
          booking_status: orgData.booking_status,
          confirmation_status: orgData.confirmation_status,
          confirmation_price: Number(orgData.confirmation_price),
          open_at: orgData.open_at,
          close_at: orgData.close_at,
          url: orgData.url || "",
          accaptable_message: orgData.accaptable_message || "",
          unaccaptable_message: orgData.unaccaptable_message || "",
          location: initialLocation || {
            address: "",
            coordinates: { lat: 0, lng: 0 },
          },
          categories: orgData.categories?.map((c: any) => c.id) || [],
          sub_categories: orgData.sub_categories?.map((c: any) => c.id) || [],
          keywords: orgData.keywords || [],
          benefits:
            orgData.benefits?.map((b: any) => ({ title: b.title })) || [],
        });

        // Set images
        setLogoPreview(orgData.logo);
        setCoverPreview(orgData.image);

        setAllSubCategories(subCatRes.data.data);
      } catch (error) {
        console.error("Error fetching data", error);
        toast.error("Failed to load organization data");
      } finally {
        setIsLoading(false);
      }
    };

    if (organizationId) {
      fetchData();
    }
  }, [organizationId]);

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
      const exists = prev.categories.includes(id);
      return {
        ...prev,
        categories: exists
          ? prev.categories.filter((c) => c !== id)
          : [...prev.categories, id],
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

    // 1. Validate Form Data locally
    const result = formSchema.safeParse(formData);

    if (!result.success) {
      // Handle Validation Errors
      const fieldErrors: Record<string, string> = {};

      result.error.issues.forEach((issue) => {
        // Map path array to dotted string (e.g., ['location', 'address'] -> 'location.address')
        const path = issue.path.join(".");
        fieldErrors[path] = issue.message;
      });

      setErrors(fieldErrors);

      // Auto-navigate to first error
      const firstErrorPath = Object.keys(fieldErrors)[0];
      if (firstErrorPath) {
        // Find which step contains this field
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

        // Logic for confirmation_status boolean to 0/1 (if needed by backend)
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

      const response = await instance.post(
        `/update-organization/${organizationId}`,
        requestData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.status === 200 || response.status === 204) {
        toast.success("تم تحديث بيانات المركز بنجاح");
        router.refresh();
      }
    } catch (error: any) {
      console.error(error);
      const apiMessage =
        error?.response?.data?.message || "فشل تحديث بيانات المركز";
      toast.error(apiMessage);

      // If API returns field-specific errors (example structure)
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
    isEmailVerified, // Return this new state

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
