import { useState } from "react";
import { instance } from "@/app/_helpers/axios";
import { ParamValue } from "next/dist/server/request/params";
import { normalizeAvatarValue } from "./normalizeAvatarValue";
import { ServicePageData } from "./types";
import { formatTitle } from "@/app/_helpers/helpers";
import { FormSchema } from "@/app/_components/_dynamicForm";

export function useServicePageApi() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const fetchServicePage = async (serviceId: ParamValue) => {
    setIsLoading(true);
    try {
      const { data } = await instance.get(
        `/dashboard/service-pages/${serviceId}`
      );
      return data.data as ServicePageData;
    } finally {
      setIsLoading(false);
    }
  };

  const saveServicePage = async (
    mode: "create" | "edit",
    serviceId: ParamValue,
    serviceData: ServicePageData,
    formSchema: ServicePageData["form"]
  ) => {
    setIsSaving(true);

    try {
      const formData = buildServiceFormData(serviceData, formSchema);
      const url = buildApiUrl(mode, serviceId);
      return await instance.post(url, formData);
    } finally {
      setIsSaving(false);
    }
  };

  // ============ Helper Functions ============

  const buildServiceFormData = (
    serviceData: ServicePageData,
    formSchema: ServicePageData["form"]
  ): FormData => {
    const formData = new FormData();

    appendBasicFields(formData, serviceData);
    appendGalleryImages(formData, serviceData.gallery_images as any);
    appendTestimonials(formData, serviceData.testimonials as any);
    appendSolutionSection(formData, serviceData.solution_section as any);
    appendHeroImage(formData, serviceData.hero_section?.hero_image as any);
    appendStatus(formData, serviceData.is_active as any);
    appendFormSchema(formData, formSchema, serviceData.slug);

    return formData;
  };

  const appendFormSchema = (
    formData: FormData,
    formSchema: ServicePageData["form"],
    slug: string
  ): void => {
    if (!formSchema) return;

    // Set Form ID as formatTitle(slug)
    formData.append("form[id]", formatTitle(slug));

    // Append other form metadata if needed (name, title, etc)
    if (formSchema.title)
      formData.append("form[title]", JSON.stringify(formSchema.title));

    // Append Fields
    if (formSchema.fields && formSchema.fields.length > 0) {
      formSchema.fields.forEach((field, index) => {
        Object.entries(field).forEach(([key, value]) => {
          if (value === undefined || value === null) return;

          if (typeof value === "object") {
            formData.append(
              `form[fields][${index}][${key}]`,
              JSON.stringify(value)
            );
          } else {
            formData.append(`form[fields][${index}][${key}]`, String(value));
          }
        });
      });
    }
  };

  const appendBasicFields = (
    formData: FormData,
    serviceData: ServicePageData
  ): void => {
    const excludedFields = [
      "gallery_images",
      "hero_image",
      "testimonials",
      "solution_section",
    ];

    Object.entries(serviceData).forEach(([key, value]) => {
      if (excludedFields.includes(key)) return;

      if (isComplexValue(value)) {
        formData.append(key, JSON.stringify(value));
      } else if (typeof value === "boolean") {
        formData.append(key, value ? "1" : "0");
      } else if (key == "slug") {
        formData.append(key, formatTitle(value));
      } else {
        formData.append(key, String(value));
      }
    });
  };

  const appendGalleryImages = (
    formData: FormData,
    images?: GalleryImage[]
  ): void => {
    if (!images) return;

    images.forEach((image, index) => {
      if (!image) return;

      appendGalleryImageId(formData, image, index);
      appendGalleryImageAltTexts(formData, image, index);
      appendGalleryImageOrder(formData, image, index);
      appendGalleryImageFile(formData, image, index);
    });
  };

  const appendGalleryImageId = (
    formData: FormData,
    image: GalleryImage,
    index: number
  ): void => {
    if (image.id) {
      formData.append(`gallery_images[${index}][id]`, String(image.id));
    }
  };

  const appendGalleryImageAltTexts = (
    formData: FormData,
    image: GalleryImage,
    index: number
  ): void => {
    formData.append(`gallery_images[${index}][alt_ar]`, image.alt_ar || "");
    formData.append(`gallery_images[${index}][alt_en]`, image.alt_en || "");
  };

  const appendGalleryImageOrder = (
    formData: FormData,
    image: GalleryImage,
    index: number
  ): void => {
    if (image.order !== undefined) {
      formData.append(`gallery_images[${index}][order]`, String(image.order));
    }
  };

  const appendGalleryImageFile = (
    formData: FormData,
    image: GalleryImage,
    index: number
  ): void => {
    const fieldName = image.path instanceof File ? "file" : "path";
    formData.append(
      `gallery_images[${index}][${fieldName}]`,
      image.path as any
    );
  };

  const appendTestimonials = (
    formData: FormData,
    testimonials?: Testimonial[]
  ): void => {
    if (!testimonials) return;

    testimonials.forEach((testimonial, index) => {
      if (!testimonial) return;

      appendTestimonialFields(formData, testimonial, index);
      appendTestimonialAvatar(formData, testimonial, index);
    });
  };

  const appendTestimonialFields = (
    formData: FormData,
    testimonial: Testimonial,
    index: number
  ): void => {
    Object.entries(testimonial).forEach(([key, value]) => {
      if (key === "avatar") return;

      const formattedValue =
        typeof value === "object" && value !== null
          ? JSON.stringify(value)
          : String(value ?? "");

      formData.append(`testimonials[${index}][${key}]`, formattedValue);
    });
  };

  const appendTestimonialAvatar = (
    formData: FormData,
    testimonial: Testimonial,
    index: number
  ): void => {
    const avatar = normalizeAvatarValue((testimonial as any).avatar);
    const avatarValue = getAvatarValue(avatar);
    formData.append(`testimonials[${index}][avatar]`, avatarValue);
  };

  const getAvatarValue = (
    avatar: File | string | null | undefined
  ): string | File => {
    if (avatar instanceof File) return avatar;
    if (typeof avatar === "string") return avatar;
    return "";
  };

  const appendSolutionSection = (
    formData: FormData,
    solutionSection?: SolutionSection
  ): void => {
    if (!solutionSection) return;

    appendSolutionFields(formData, solutionSection);
    appendSolutionFeatures(formData, solutionSection.features);
  };

  const appendSolutionFields = (
    formData: FormData,
    solutionSection: SolutionSection
  ): void => {
    Object.entries(solutionSection).forEach(([key, value]) => {
      if (key === "features") return;
      if (value !== null && value !== undefined) {
        formData.append(`solution_section[${key}]`, String(value));
      }
    });
  };

  const appendSolutionFeatures = (
    formData: FormData,
    features?: Feature[]
  ): void => {
    if (!features) return;

    features.forEach((feature, index) => {
      appendFeatureFields(formData, feature, index);
      appendFeaturePreviewImage(formData, feature, index);
    });
  };

  const appendFeatureFields = (
    formData: FormData,
    feature: Feature,
    index: number
  ): void => {
    Object.entries(feature).forEach(([key, value]) => {
      if (key === "preview_image") return;
      if (value !== null && value !== undefined) {
        formData.append(
          `solution_section[features][${index}][${key}]`,
          String(value)
        );
      }
    });
  };

  const appendFeaturePreviewImage = (
    formData: FormData,
    feature: Feature,
    index: number
  ): void => {
    const imageValue = getImageValue(feature.preview_image);
    formData.append(
      `solution_section[features][${index}][preview_image]`,
      imageValue
    );
  };

  const getImageValue = (image: File | string | undefined): string | File => {
    if (image instanceof File) return image;
    if (typeof image === "string") return image;
    return "";
  };

  const appendHeroImage = (
    formData: FormData,
    heroImage?: File | string
  ): void => {
    if (heroImage instanceof File) {
      formData.append("hero_image", heroImage);
    }
  };

  const appendStatus = (formData: FormData, isActive?: boolean): void => {
    formData.append("status", isActive ? "active" : "inactive");
  };

  const buildApiUrl = (
    mode: "create" | "edit",
    serviceId: ParamValue
  ): string => {
    return mode === "create"
      ? "/dashboard/service-pages"
      : `/dashboard/service-pages/${serviceId}`;
  };

  const isComplexValue = (value: any): boolean => {
    return (
      (typeof value === "object" || Array.isArray(value)) && value !== null
    );
  };

  // ============ Type Definitions (if not already defined) ============

  type GalleryImage = {
    id?: number;
    path: File | string;
    alt_ar?: string;
    alt_en?: string;
    order?: number;
  };

  type Testimonial = {
    avatar?: File | string | null;
    [key: string]: any;
  };

  type Feature = {
    preview_image?: File | string;
    [key: string]: any;
  };

  type SolutionSection = {
    features?: Feature[];
    [key: string]: any;
  };

  return { fetchServicePage, saveServicePage, isLoading, isSaving };
}
