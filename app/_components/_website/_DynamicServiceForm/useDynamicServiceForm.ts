"use client";
import { useState, useEffect, useCallback } from "react";
import { useLocale } from "next-intl";
import { instance } from "@/app/_helpers/axios";
import {
  DynamicServiceFormProps,
  FieldDefinition,
  FormSchemaResponse,
} from "./types";
import { mapFieldType, getLocalized } from "./utils";
import { useAppSelector } from "@/app/Store/hooks";

export const useDynamicServiceForm = ({
  serviceSlug,
  service,
  initialForm,
  onSuccess,
}: DynamicServiceFormProps) => {
  const locale = useLocale();
  const { user } = useAppSelector((state) => state.user);

  const [loading, setLoading] = useState(!initialForm);
  const [schema, setSchema] = useState<FormSchemaResponse["form"]>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);

  // 1. Fetch Schema or Use Initial
  useEffect(() => {
    let isMounted = true;

    const loadForm = async () => {
      if (initialForm) {
        try {
          const mappedFields: FieldDefinition[] = initialForm.fields.map(
            (f: any) => {
              return {
                key: f.name,
                type: mapFieldType(f.type),
                label: getLocalized(f.label, locale),
                placeholder: getLocalized(f.placeholder, locale),
                required: f.required,
                order: f.order,
                options: f.options
                  ? {
                      choices: f.options.map((opt: any) => ({
                        label: getLocalized(opt.label, locale),
                        value: opt.value,
                      })),
                    }
                  : undefined,
                validation: f.validation,
                visibility: f.visibility,
              };
            }
          );

          setSchema({
            id: initialForm.id,
            name: initialForm.title,
            description: "",
            fields: mappedFields,
          });
          setLoading(false);
        } catch (error) {
          setLoading(false);
          setGlobalError("Error loading form data");
        }
        return;
      }

      try {
        setLoading(true);
        const { data } = await instance.get<FormSchemaResponse>(
          `/service-forms/schema/${serviceSlug}`,
          {
            headers: {
              "Accept-Language": locale,
            },
          }
        );

        if (isMounted) {
          if (data.has_form && data.form) {
            setSchema(data.form);
            setFormData({});
          } else {
            setSchema(null);
          }
        }
      } catch (err) {
        console.error("Failed to fetch form schema:", err);
        setGlobalError("Failed to load form. Please try again later.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (serviceSlug || initialForm) loadForm();
    return () => {
      isMounted = false;
    };
  }, [serviceSlug, locale, initialForm]);

  // 2. Handle Input Change
  const handleChange = (key: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));

    if (errors[key]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[key];
        return newErrors;
      });
    }
  };

  // 3. Validation Logic
  const validateField = (
    field: FieldDefinition,
    value: any
  ): string[] | null => {
    const fieldErrors: string[] = [];

    if (field.required) {
      if (
        value === null ||
        value === undefined ||
        value === "" ||
        (Array.isArray(value) && value.length === 0)
      ) {
        fieldErrors.push(
          locale === "ar" ? "هذا الحقل مطلوب" : "This field is required"
        );
      }
    }

    if (!value && !field.required) return null;

    const config = field.validation;
    if (!config) return fieldErrors.length ? fieldErrors : null;

    if (config.pattern && typeof value === "string") {
      try {
        const regex = new RegExp(config.pattern);
        if (!regex.test(value)) {
          fieldErrors.push(
            locale === "ar" ? "تنسيق غير صحيح" : "Invalid format"
          );
        }
      } catch (e) {
        console.warn("Invalid regex pattern:", config.pattern);
      }
    }

    if (typeof value === "string") {
      if (config.min_length && value.length < config.min_length) {
        fieldErrors.push(
          locale === "ar"
            ? `يجب أن يحتوي على ${config.min_length} حروف على الأقل`
            : `Must be at least ${config.min_length} characters`
        );
      }
      if (config.max_length && value.length > config.max_length) {
        fieldErrors.push(
          locale === "ar"
            ? `يجب ألا يتجاوز ${config.max_length} حرف`
            : `Must not exceed ${config.max_length} characters`
        );
      }
    }

    if (typeof value === "number" || (!isNaN(Number(value)) && value !== "")) {
      const numVal = Number(value);
      if (config.min_value !== undefined && numVal < config.min_value) {
        fieldErrors.push(
          locale === "ar"
            ? `القيمة يجب أن تكون أكبر من ${config.min_value}`
            : `Value must be greater than ${config.min_value}`
        );
      }
      if (config.max_value !== undefined && numVal > config.max_value) {
        fieldErrors.push(
          locale === "ar"
            ? `القيمة يجب أن تكون أقل من ${config.max_value}`
            : `Value must be less than ${config.max_value}`
        );
      }
    }

    return fieldErrors.length ? fieldErrors : null;
  };

  const validateForm = (): boolean => {
    if (!schema) return false;
    const newErrors: Record<string, string[]> = {};
    let isValid = true;

    schema.fields.forEach((field) => {
      if (checkVisibility(field)) {
        const fieldErrors = validateField(field, formData[field.key]);
        if (fieldErrors) {
          newErrors[field.key] = fieldErrors;
          isValid = false;
        }
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  // 4. Visibility Logic
  const checkVisibility = useCallback(
    (field: FieldDefinition): boolean => {
      if (!field.visibility) return true;
      const { depends_on, condition, value } = field.visibility;
      const dependencyValue = formData[depends_on];

      switch (condition) {
        case "equals":
          return dependencyValue == value;
        case "not_equals":
          return dependencyValue != value;
        case "contains":
          return (
            Array.isArray(dependencyValue) && dependencyValue.includes(value)
          );
        case "not_empty":
          return (
            dependencyValue !== null &&
            dependencyValue !== undefined &&
            dependencyValue !== ""
          );
        case "empty":
          return (
            dependencyValue === null ||
            dependencyValue === undefined ||
            dependencyValue === ""
          );
        default:
          return true;
      }
    },
    [formData]
  );

  // 5. Submit
  const handleSubmit = async (e: React.FormEvent, summary, files?: File[]) => {
    e.preventDefault();
    if (!schema) return;

    setGlobalError(null);
    if (!validateForm()) {
      setGlobalError(
        locale === "ar"
          ? "يرجى التحقق من الحقول المطلوبة"
          : "Please check required fields"
      );
      return;
    }

    setSubmitting(true);

    try {
      const formData = new FormData();
      const metadata = JSON.stringify(summary);
      const serviceDetails = {
        service_id: service.id,
        slug: serviceSlug,
        price: service.price,
        metadata: metadata,
      };
      formData.append("serviceDetails", JSON.stringify(serviceDetails));
      formData.append("data_type", "service");
      formData.append("invoice_type", "service");
      formData.append("payment_method", "thawani");
      if (summary && Array.isArray(summary) && summary.length > 0) {
        summary.forEach((item) => {
          if (item.file) formData.append("files[]", item.file);
        });
      }
      if (user) formData.append("account_type", user.account_type);
      if (user) formData.append("user_id", user.id.toString());
      if (service.price)
        formData.append("total_invoice", service.price?.toString());

      const response = await instance.post(`/payment/create-session`, formData);

      if (response.status == 200) {
        const sessionId = response.data.data.session_id;
        const checkoutUrl = `https://uatcheckout.thawani.om/pay/${sessionId}?key=${process.env.NEXT_PUBLIC_THAWANI_PUBLISHABLE_KEY}`;
        window.location.href = checkoutUrl;
      }

      // setSubmitSuccess(true);
      // setFormData({});
      // if (onSuccess) onSuccess();
    } catch (err: any) {
      if (err.response?.status === 422) {
        const backendErrors = err.response.data.errors;
        const mappedErrors: Record<string, string[]> = {};
        Object.keys(backendErrors).forEach((errKey) => {
          const fieldKey = errKey.replace("fields.", "");
          mappedErrors[fieldKey] = backendErrors[errKey];
        });
        setErrors(mappedErrors);
        setGlobalError(
          locale === "ar" ? "فشل التحقق من البيانات" : "Validation failed"
        );
      } else {
        setGlobalError(
          locale === "ar" ? "حدث خطأ أثناء الإرسال" : "Error submitting form"
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  const [step, setStep] = useState(1);

  // ... (previous code)

  // 6. Navigation Logic
  const handleNext = () => {
    setGlobalError(null);
    if (!validateForm()) {
      setGlobalError(
        locale === "ar"
          ? "يرجى التحقق من الحقول المطلوبة"
          : "Please check required fields"
      );
      return;
    }
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
    setGlobalError(null);
  };

  return {
    locale,
    loading,
    schema,
    formData,
    errors,
    submitting,
    submitSuccess,
    globalError,
    step,
    handleChange,
    checkVisibility,
    handleSubmit,
    setSubmitSuccess,
    handleNext,
    handleBack,
  };
};
