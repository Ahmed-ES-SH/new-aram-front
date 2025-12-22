import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";
import { instance } from "@/app/_helpers/axios";
import { useAppSelector } from "@/app/Store/hooks";
import { formSchema, FormValues } from "../_components/schema";

export const useOrganizationForm = () => {
  const params = useParams();
  const router = useRouter();
  const organizationId = params.organizationId as string;

  // Redux & Local State
  const { categories: allCategories } = useAppSelector(
    (state) => state.categories
  );
  const [allSubCategories, setAllSubCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

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
  });

  // File states
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  // Map State
  const [showMap, setShowMap] = useState(false);

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
          phone_number: orgData.phone_number,
          status: orgData.status,
          active: orgData.active,
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
      const exists = prev.sub_categories.includes(id);
      return {
        ...prev,
        sub_categories: exists
          ? prev.sub_categories.filter((c) => c !== id)
          : [...prev.sub_categories, id],
      };
    });
  };

  const handleBenefitChange = (index: number, value: string) => {
    const updatedBenefits = [...formData.benefits];
    updatedBenefits[index] = { title: value };
    setFormData({ ...formData, benefits: updatedBenefits });
  };

  const addBenefit = () => {
    setFormData({
      ...formData,
      benefits: [...formData.benefits, { title: "" }],
    });
  };

  const removeBenefit = (index: number) => {
    setFormData({
      ...formData,
      benefits: formData.benefits.filter((_, i) => i !== index),
    });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    try {
      // Validate
      const validatedData = formSchema.parse(formData);

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

        // Fix for "The confirmation status field must be true or false" error
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
        toast.success("Organization updated successfully");
        router.refresh();
      }
    } catch (error: any) {
      console.error(error);
      if ((error instanceof z.ZodError) as any) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path) {
            fieldErrors[err.path[0]] = err.message;
          }
        });
        setErrors(fieldErrors);
        toast.error("Please check the form for errors");
      } else {
        toast.error(
          error?.response?.data?.message || "Failed to update organization"
        );
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
  };
};
