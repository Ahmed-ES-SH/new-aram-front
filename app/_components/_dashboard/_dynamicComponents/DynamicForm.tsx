"use client";
import { instance } from "@/app/_helpers/axios";
import React, { useEffect, useRef, useState } from "react";
import { LuUserPen } from "react-icons/lu";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import SuccessAlart from "../../_popups/SuccessAlart";
import LoadingSpin from "../../LoadingSpin";
import {
  FaEye,
  FaEyeSlash,
  FaImage,
  FaMapMarkerAlt,
  FaPlus,
  FaTrash,
} from "react-icons/fa";
import { errorType, InputField } from "@/app/types/_dashboard/GlobalTypes";
import { getIconComponent } from "@/app/_helpers/helpers";
import Img from "../../_website/_global/Img";
import { toast } from "sonner";
import KeywordSelector, {
  Keyword,
} from "../../_website/_global/KeywordSelector";
import { Location } from "./DynamicElementPage";
import SubCategoryMultiSelect from "../_organizations/SubCategoryMultiSelect";
import OrganizationsSelector from "../_services/OrganizationsSelector";
import ServiceImages from "../_services/ServiceImages";
import SpecialCouponSection from "../_coupons/SpecialCouponSection";
import SelectOrg from "../_offers/SelectOrg";
import IconPicker from "../IconPicker";
import { useAppSelector } from "@/app/Store/hooks";
import dynamic from "next/dynamic";

import { generateZodSchema } from "@/app/_helpers/zodValidation"; // Import validation helper

const MapSelector = dynamic(() => import("../../_maps/MapSelector"), {
  ssr: false,
});
import CustomSelect from "./CustomSelect";

interface Props {
  inputs: InputField[];
  api: string;
  direct: string;
  submitValue: string;
  successMessage: string;
  title: string;

  subtitle?: string;
}

export default function DynamicForm({
  inputs,
  api,
  direct,
  submitValue,
  successMessage,
  title,
  subtitle,
}: Props) {
  const { user } = useAppSelector((state) => state.user);

  const router = useRouter();
  const openImageinput = useRef<HTMLInputElement | null>(null);
  const openLogoinput = useRef<HTMLInputElement | null>(null);

  const [form, setForm] = useState<any>({});
  const [errors, setErrors] = useState<any>({});
  const [successPopup, setSuccessPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState("");
  const [showMap, setShowMap] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [location, setLocation] = useState<Location | null>(null);

  ///////////////////////////////////
  // start Fetch The Form Detailes
  ///////////////////////////////////

  useEffect(() => {
    const initialFormState = inputs.reduce<Record<string, string>>(
      (acc, input) => {
        acc[input.name] = (input.value || "") as string;
        return acc;
      },
      {}
    );

    setForm(initialFormState);
  }, [inputs]);

  ///////////////////////////////////
  // End Fetch The Form Detailes
  ///////////////////////////////////

  ///////////////////////////////////
  // start Functions Lines
  ///////////////////////////////////

  const getErrorMessage = (error: any) => {
    if (!error) return null;
    if (typeof error === "string") return error;
    if (Array.isArray(error) && error.length > 0)
      return getErrorMessage(error[0]);
    // Fallback if object still appears (e.g. from backend before full refactor)
    if (typeof error === "object") {
      if (error.ar) return error.ar; // Legacy support
      const values = Object.values(error);
      if (values.length > 0) return getErrorMessage(values[0]);
    }
    return "خطأ غير معروف";
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;

    let newValue = value;

    // 📞 Phone input: digits only
    if (name.toLowerCase().includes("phone") || type === "tel") {
      newValue = value.replace(/[^0-9+\-()\s]/g, "");
    }

    // 🔢 Number input: allow decimals
    else if (type === "number") {
      newValue = value.replace(/[^0-9.]/g, "");
    }

    setForm((prevForm) => ({
      ...prevForm,
      [name]: newValue,
    }));
  };

  console.log(errors);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;

    if (files && files.length > 0) {
      const file = files[0];

      // Update main form state
      setForm((prevForm) => ({
        ...prevForm,
        [name]: file,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    scrollTo(0, 0);
    try {
      setLoading(true);

      // --- Zod Validation Start ---
      const schema = generateZodSchema(inputs);
      const validationResult = schema.safeParse(form);

      if (!validationResult.success) {
        const fieldErrors = validationResult.error.flatten().fieldErrors;
        // Map Zod errors to your errorType structure
        const formattedErrors: errorType = {};
        Object.entries(fieldErrors).forEach(([key, messages]) => {
          // Assuming we want the first message if multiple
          if (messages && messages.length > 0) {
            formattedErrors[key] = messages[0];
          }
        });

        setErrors(formattedErrors);
        toast.error("يرجى التأكد من البيانات المدخلة");
        setLoading(false);
        return;
      }
      // --- Zod Validation End ---

      const formData = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        // allow 0 (number) explicitly
        if (value === 0 || value === "0") {
          formData.append(key, value as string | Blob);
          return;
        }

        // skip null or undefined
        if (value === null || value === undefined) return;

        // skip empty string
        if (typeof value === "string" && value.trim() === "") return;

        // skip empty array
        if (Array.isArray(value) && value.length === 0) return;

        // skip empty object
        if (
          typeof value === "object" &&
          !Array.isArray(value) &&
          Object.keys(value).length === 0
        ) {
          return;
        }

        const formattedValue = Array.isArray(value)
          ? JSON.stringify(value)
          : value;

        formData.append(key, formattedValue as string | Blob);
      });

      // Check if inputsData has a field with fildType = "location"
      const hasLocationField = inputs?.some(
        (input: InputField) => input.fildType === "location"
      );

      // Append location only if the field exists
      if (hasLocationField && location) {
        formData.append("location", JSON.stringify(location));
      }

      if (form.image && form.image instanceof File) {
        formData.append("image", form.image);
      }

      if (form.images && form.images.length > 0) {
        form.images.forEach((image: any) => {
          if (image.file) {
            formData.append("images[]", image.file);
          }
        });
      }

      if (form.benefits && form.benefits.length > 0) {
        formData.append("benefits", JSON.stringify(form.benefits));
      }

      if (form.organizations && form.organizations.length > 0) {
        formData.append(
          "organizations_supporters",
          JSON.stringify(form.organizations)
        );
      }

      if (user) formData.append("user_id", user?.id.toString());
      if (user) formData.append("author_id", user?.id.toString());
      const response = await instance.post(api, formData);

      if (response.status === 201) {
        setSuccessPopup(true);

        setForm((prevForm) =>
          Object.keys(prevForm).reduce((acc, key) => {
            acc[key] = "";
            return acc;
          }, {} as typeof prevForm)
        );

        setTimeout(() => {
          router.push(direct);
        }, 3000);
      }
    } catch (error: any) {
      console.error(error);

      if (error instanceof AxiosError && error.response?.data?.errors) {
        const formattedErrors: errorType = Object.entries(
          error.response.data.errors
        ).reduce((acc, [key, value]) => {
          const message = Array.isArray(value) ? value[0] : value;
          acc[key] = message; // Standardize to errorType structure (simple string)
          return acc;
        }, {} as errorType);

        setErrors(formattedErrors);
      }

      const message =
        error?.response?.data?.message ?? "حدث خطأ أثناء إحراء العملية";
      if (typeof message === "string") toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  console.log(form);

  const handleCloseAlart = () => {
    setSuccessPopup(false);
  };

  const handleChangeIcon = (iconName: string) => {
    setSelectedIcon(iconName);
    setForm({ ...form, icon_name: iconName });
    setShowIconPicker(false);
  };

  // handle keywords change (only for add mode)
  const handleKeywordsChange = (newKeywords: Keyword[]) => {
    setForm((prevForm: any) => ({
      ...prevForm,
      keywords: newKeywords,
    }));
  };

  // Change item inside array
  const handleArrayChange = (
    fieldName: string,
    index: number,
    key: string,
    value: any,
    form: any,
    setForm: any
  ) => {
    const updatedArray = [...(form[fieldName] || [])];
    updatedArray[index] = {
      ...updatedArray[index],
      [key]: value,
    };

    setForm((prevForm: any) => ({
      ...prevForm,
      [fieldName]: updatedArray,
    }));
  };

  // Add new item to array
  const handleArrayAdd = (
    fieldName: string,
    displayKey: string,
    form: any,
    setForm: any
  ) => {
    const updatedArray = [...(form[fieldName] || []), { [displayKey]: "" }];

    setForm((prevForm: any) => ({
      ...prevForm,
      [fieldName]: updatedArray,
    }));
  };

  // Remove item from array
  const handleArrayRemove = (
    fieldName: string,
    index: number,
    form: any,
    setForm: any
  ) => {
    const updatedArray = (form[fieldName] || []).filter(
      (_: any, idx: number) => idx !== index
    );

    setForm((prevForm: any) => ({
      ...prevForm,
      [fieldName]: updatedArray,
    }));
  };

  const handleShowMap = () => {
    console.log("show map");
    setShowMap(!showMap);
  };

  ///////////////////////////////////
  // End Functions Lines
  ///////////////////////////////////

  if (loading) return <LoadingSpin />;

  return (
    <>
      <form
        onSubmit={handleSubmit}
        style={{ direction: "rtl" }}
        className="w-full lg:w-[90%] mx-auto border border-gray-200 shadow-lg rounded-lg px-6 py-8 mb-8 mt-4 flex flex-col gap-6"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-3 text-base text-gray-500 max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
          <div className="mt-4 w-20 h-1.5 mx-auto bg-primary rounded-full" />
        </div>
        {inputs.map((input, index) => {
          //////////////////////
          //Normal input
          //////////////////////

          if (input.fildType == "short-text") {
            return (
              <div key={index} className="w-full group">
                <label
                  htmlFor={input.name}
                  className="block text-sm font-semibold text-gray-700 mb-2 group-focus-within:text-primary transition-colors duration-200"
                >
                  {input.label["ar"]}
                </label>
                <input
                  name={input.name}
                  placeholder={input.placeholder}
                  type={input.type}
                  value={(form[input.name] as string) || ""}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/30 px-4 py-3 sm:py-3.5 text-gray-800 placeholder-gray-400 outline-none transition-all duration-300 hover:bg-gray-50 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10"
                />
                {errors[input.name] && (
                  <p className="text-red-500 text-sm mt-1.5 flex items-center gap-1">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500" />
                    {getErrorMessage(errors[input.name])}
                  </p>
                )}
              </div>
            );
          }

          //////////////////////
          //text area Element
          //////////////////////
          if (input.fildType == "long-text") {
            return (
              <div key={index} className="w-full group">
                <label
                  htmlFor={input.name}
                  className="block text-sm font-semibold text-gray-700 mb-2 group-focus-within:text-primary transition-colors duration-200"
                >
                  {input.label["ar"]}
                </label>
                <textarea
                  name={input.name}
                  placeholder={input.placeholder}
                  value={(form[input.name] as string) || ""}
                  onChange={handleChange}
                  className="w-full min-h-[160px] rounded-xl border border-gray-200 bg-gray-50/30 px-4 py-3 text-gray-800 placeholder-gray-400 outline-none transition-all duration-300 hover:bg-gray-50 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 resize-y"
                />
                {errors[input.name] && (
                  <p className="text-red-500 text-sm mt-1.5 flex items-center gap-1">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500" />
                    {getErrorMessage(errors[input.name])}
                  </p>
                )}
              </div>
            );
          }

          //////////////////////
          //password input
          //////////////////////

          if (input.fildType == "fild-password") {
            return (
              <div key={index} className="w-full group">
                <label
                  htmlFor={input.name}
                  className="block text-sm font-semibold text-gray-700 mb-2 group-focus-within:text-primary transition-colors duration-200"
                >
                  {input.label["ar"]}
                </label>

                <div className="relative w-full">
                  <input
                    name={input.name}
                    placeholder={input.placeholder}
                    type={showPassword ? "text" : "password"}
                    value={(form[input.name] as string) || ""}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/30 px-4 py-3 sm:py-3.5 pr-12 text-gray-800 placeholder-gray-400 outline-none transition-all duration-300 hover:bg-gray-50 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10"
                  />

                  {/* Eye Icon */}
                  <span
                    className="absolute inset-y-0 right-0 flex items-center pr-4 cursor-pointer text-gray-400 hover:text-primary transition-colors"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? (
                      <FaEyeSlash className="w-5 h-5" />
                    ) : (
                      <FaEye className="w-5 h-5" />
                    )}
                  </span>
                </div>

                {errors[input.name] && (
                  <p className="text-red-500 text-sm mt-1.5 flex items-center gap-1">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500" />
                    {getErrorMessage(errors[input.name])}
                  </p>
                )}
              </div>
            );
          }

          //////////////////////
          //select organizations
          //////////////////////

          if (input.fildType === "select-organizations") {
            return (
              <div key={index} className="w-full group">
                <label
                  htmlFor={input.name}
                  className="block text-sm font-semibold text-gray-700 mb-2 group-focus-within:text-primary transition-colors duration-200"
                >
                  {input.label["ar"]}
                </label>
                <div className="rounded-xl border border-gray-200 p-1 hover:bg-gray-50 transition-colors duration-200">
                  <OrganizationsSelector form={form} setForm={setForm} />
                </div>
                {errors[input.name] && (
                  <p className="text-red-500 text-sm mt-1.5 flex items-center gap-1">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500" />
                    {getErrorMessage(errors[input.name])}
                  </p>
                )}
              </div>
            );
          }

          //////////////////////
          //images section
          //////////////////////

          if (input.fildType == "images-section") {
            return (
              <div key={index} className="w-full group">
                <label className="block text-sm font-semibold text-gray-700 mb-2 group-focus-within:text-primary transition-colors duration-200">
                  {input.label["ar"]}
                </label>
                <div className="bg-gray-50/30 rounded-xl border border-gray-200 p-4 hover:bg-gray-50 transition-colors duration-200">
                  <ServiceImages
                    form={form}
                    setForm={setForm}
                    images={form?.images ? form?.images : null}
                    errors={errors}
                  />
                </div>
                {errors[input.name] && (
                  <p className="text-red-500 text-sm mt-1.5 flex items-center gap-1">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500" />
                    {getErrorMessage(errors[input.name])}
                  </p>
                )}
              </div>
            );
          }

          ////////////////////////
          // Phone input
          ////////////////////////

          if (input.fildType === "phone-input") {
            return (
              <div key={index} className="w-full group">
                <label className="block text-sm font-semibold text-gray-700 mb-2 group-focus-within:text-primary transition-colors duration-200">
                  {input.label.ar}
                </label>
                <input
                  name={input.name || ""}
                  type="tel"
                  inputMode="numeric"
                  value={form[input.name] || ""}
                  onChange={handleChange}
                  placeholder={input.placeholder || "أدخل رقم الهاتف"}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/30 px-4 py-3 text-gray-800 placeholder-gray-400 outline-none transition-all duration-300 hover:bg-gray-50 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 text-left"
                  style={{ direction: "ltr" }} // Phone numbers usually look better LTR
                  readOnly={input.readOnly}
                />
                {errors[input.name] && (
                  <p className="text-red-500 text-sm mt-1.5 flex items-center gap-1">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500" />
                    {getErrorMessage(errors[input.name])}
                  </p>
                )}
              </div>
            );
          }

          //////////////////////
          // Number input (independent case)
          //////////////////////

          if (input.fildType === "number-input") {
            return (
              <div key={index} className="w-full group">
                <label className="block text-sm font-semibold text-gray-700 mb-2 group-focus-within:text-primary transition-colors duration-200">
                  {input.label.ar}
                </label>
                <input
                  name={input.name || ""}
                  type="number"
                  step="any"
                  value={form[input.name] || ""}
                  onChange={handleChange}
                  placeholder={input.placeholder || ""}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/30 px-4 py-3 text-gray-800 placeholder-gray-400 outline-none transition-all duration-300 hover:bg-gray-50 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10"
                  readOnly={input.readOnly}
                />
                {errors[input.name] && (
                  <p className="text-red-500 text-sm mt-1.5 flex items-center gap-1">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500" />
                    {getErrorMessage(errors[input.name])}
                  </p>
                )}
              </div>
            );
          }

          //////////////////////
          // Date input
          //////////////////////
          if (input.fildType === "date-input") {
            return (
              <div key={index} className="w-full group">
                <label className="block text-sm font-semibold text-gray-700 mb-2 group-focus-within:text-primary transition-colors duration-200">
                  {input.label.ar}
                </label>
                <input
                  name={input.name || ""}
                  type="date"
                  value={form[input.name] ? form[input.name].split(" ")[0] : ""}
                  onChange={handleChange}
                  placeholder={input.placeholder || ""}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/30 px-4 py-3 text-gray-800 placeholder-gray-400 outline-none transition-all duration-300 hover:bg-gray-50 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10"
                  readOnly={input.readOnly}
                />
                {errors[input.name] && (
                  <p className="text-red-500 text-sm mt-1.5 flex items-center gap-1">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500" />
                    {getErrorMessage(errors[input.name])}
                  </p>
                )}
              </div>
            );
          }

          //////////////////////
          // Coupon Code Input
          //////////////////////

          if (input.fildType === "coupon-code") {
            const generateCode = () => {
              const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
              let code = "";
              for (let i = 0; i < 8; i++) {
                code += chars.charAt(Math.floor(Math.random() * chars.length));
              }
              handleChange({
                target: { name: input.name, value: code },
              } as React.ChangeEvent<HTMLInputElement>);
            };

            return (
              <div key={index} className="w-full group">
                <label
                  htmlFor={input.name}
                  className="block text-sm font-semibold text-gray-700 mb-2 group-focus-within:text-primary transition-colors duration-200"
                >
                  {input.label["ar"]}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    name={input.name}
                    placeholder={input.placeholder}
                    type="text"
                    value={(form[input.name] as string) || ""}
                    onChange={handleChange}
                    className="flex-1 rounded-xl border border-gray-200 bg-gray-50/30 px-4 py-3 text-gray-800 placeholder-gray-400 outline-none transition-all duration-300 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 read-only:bg-gray-100/50"
                    readOnly={input.readOnly}
                  />
                  <button
                    type="button"
                    onClick={generateCode}
                    className="px-6 py-3 bg-primary text-white rounded-xl shadow-sm hover:bg-primary/90 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 font-medium whitespace-nowrap"
                  >
                    توليد كود
                  </button>
                </div>
                {errors[input.name] && (
                  <p className="text-red-500 text-sm mt-1.5 flex items-center gap-1">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500" />
                    {getErrorMessage(errors[input.name])}
                  </p>
                )}
              </div>
            );
          }

          //////////////////////
          // Time input
          //////////////////////
          if (input.fildType === "time-input") {
            return (
              <div key={index} className="w-full group">
                <label className="block text-sm font-semibold text-gray-700 mb-2 group-focus-within:text-primary transition-colors duration-200">
                  {input.label.ar}
                </label>
                <input
                  name={input.name || ""}
                  type="time"
                  value={form[input.name] || ""}
                  onChange={handleChange}
                  placeholder={input.placeholder || ""}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/30 px-4 py-3 text-gray-800 placeholder-gray-400 outline-none transition-all duration-300 hover:bg-gray-50 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10"
                  readOnly={input.readOnly}
                />
                {errors[input.name] && (
                  <p className="text-red-500 text-sm mt-1.5 flex items-center gap-1">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500" />
                    {getErrorMessage(errors[input.name])}
                  </p>
                )}
              </div>
            );
          }

          //////////////////////
          //Select Eelement
          //////////////////////

          if (input.fildType == "location") {
            return (
              <div key={index} className="w-full group relative">
                <label
                  htmlFor={input.name}
                  className="block text-sm font-semibold text-gray-700 mb-2 group-focus-within:text-primary transition-colors duration-200"
                >
                  {input.label["ar"]}
                </label>
                <div className="relative">
                  <input
                    name={input.name}
                    placeholder={input.placeholder}
                    type={input.type}
                    value={(location && (location.address as string)) || ""}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/30 px-4 py-3 text-gray-800 placeholder-gray-400 outline-none transition-all duration-300 hover:bg-gray-50 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 pl-32" // Added padding-left for the button
                    readOnly={input.readOnly}
                  />
                  <div className="absolute left-2 top-1.5 bottom-1.5">
                    <button
                      type="button"
                      onClick={handleShowMap}
                      className="h-full px-4 rounded-lg bg-primary/10 text-primary text-sm font-medium hover:bg-primary hover:text-white transition-colors duration-200 flex items-center gap-2"
                    >
                      <FaMapMarkerAlt />
                      الخريطة
                    </button>
                  </div>
                </div>
                {errors[input.name] && (
                  <p className="text-red-500 text-sm mt-1.5 flex items-center gap-1">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500" />
                    {getErrorMessage(errors[input.name])}
                  </p>
                )}
              </div>
            );
          }

          //////////////////////
          //Select Eelement
          //////////////////////

          if (input.fildType == "sub-category") {
            return (
              <div key={index} className="w-full group">
                <div className="bg-gray-50/30 rounded-xl border border-gray-200 p-4 hover:bg-gray-50 transition-colors duration-200">
                  <SubCategoryMultiSelect
                    setUpdatedData={setForm}
                    currentSubCategories={[]}
                    mode="add"
                  />
                </div>
                {errors[input.name] && (
                  <p className="text-red-500 text-sm mt-1.5 flex items-center gap-1">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500" />
                    {getErrorMessage(errors[input.name])}
                  </p>
                )}
              </div>
            );
          }

          //////////////////////
          //Color  Fild
          //////////////////////

          if (input.fildType === "color-fild") {
            return (
              <div key={index} className="w-full group">
                <label
                  htmlFor={input.name}
                  className="block text-sm font-semibold text-gray-700 mb-2 group-focus-within:text-primary transition-colors duration-200"
                >
                  {input.label["ar"]}
                </label>
                <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl bg-gray-50/50">
                  <input
                    name={input.name}
                    type="color"
                    value={(form[input.name] as string) || "#000000"}
                    onChange={handleChange}
                    className="w-16 h-16 rounded-full border-4 border-white shadow-md cursor-pointer hover:scale-105 transition-transform duration-200 p-0 overflow-hidden"
                  />
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">اللون المختار</span>
                    <span className="font-mono text-gray-800 dir-ltr text-left uppercase">
                      {(form[input.name] as string) || "#000000"}
                    </span>
                  </div>
                </div>
                {errors[input.name] && (
                  <p className="text-red-500 text-sm mt-1.5 flex items-center gap-1">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500" />
                    {getErrorMessage(errors[input.name])}
                  </p>
                )}
              </div>
            );
          }

          //////////////////////
          //user Image input
          //////////////////////

          if (input.fildType == "user-image") {
            return (
              <div
                key={index}
                className="flex flex-col items-center justify-center my-6 group w-fit ml-auto"
              >
                <div
                  onClick={() => openImageinput.current?.click()}
                  className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-full border-4 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center cursor-pointer overflow-hidden hover:border-primary hover:bg-primary/5 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-primary/10"
                >
                  {form[input.name] instanceof File ? (
                    <Img
                      src={URL.createObjectURL(form[input.name] as Blob)}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-gray-400 group-hover:text-primary transition-colors duration-300">
                      <LuUserPen className="w-12 h-12 mb-2" />
                      <span className="text-xs font-medium px-2 text-center">
                        {input.label["ar"]}
                      </span>
                    </div>
                  )}

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <FaImage className="text-white w-8 h-8 drop-shadow-md" />
                  </div>

                  <input
                    type="file"
                    name="image"
                    hidden
                    onChange={handleFileChange}
                    ref={openImageinput}
                  />
                </div>
                {errors[input.name] && (
                  <p className="text-red-500 text-sm mt-2 text-center">
                    {errors[input.name] ??
                      errors[input.name]["ar"] ??
                      errors[input.name][0]["ar"] ??
                      "خطأ فى هذا الحقل"}
                  </p>
                )}
              </div>
            );
          }

          //////////////////////
          //normal Image input
          //////////////////////

          if (input.fildType == "normal-image") {
            return (
              <div key={index} className="w-full group">
                <label className="block text-sm font-semibold text-gray-700 mb-2 group-focus-within:text-primary transition-colors duration-200">
                  {input.label["ar"]}
                </label>
                <div
                  onClick={() => openImageinput.current?.click()}
                  className="w-full h-64 rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center cursor-pointer overflow-hidden hover:border-primary hover:bg-primary/5 transition-all duration-300 relative group-hover:shadow-md"
                >
                  {form[input.name] instanceof File ? (
                    <Img
                      src={URL.createObjectURL(form[input.name] as Blob)}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-gray-400 group-hover:text-primary transition-colors duration-300">
                      <FaImage className="w-12 h-12 mb-3" />
                      <span className="text-sm font-medium">
                        اضغط لرفع الصورة
                      </span>
                    </div>
                  )}

                  {/* Overlay for feedback */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />

                  <input
                    type="file"
                    name="image"
                    hidden
                    onChange={handleFileChange}
                    ref={openImageinput}
                  />
                </div>
                {errors[input.name] && (
                  <p className="text-red-500 text-sm mt-1.5 flex items-center gap-1">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500" />
                    {getErrorMessage(errors[input.name])}
                  </p>
                )}
              </div>
            );
          }

          //////////////////////
          //select Icon
          //////////////////////

          if (input.fildType == "icon-fild") {
            const Icon = getIconComponent(form[input.name]);
            return (
              <div
                key={index}
                className="w-full flex flex-col items-start group"
              >
                <label
                  htmlFor={input.name}
                  className="block text-sm font-semibold text-gray-700 mb-2 group-focus-within:text-primary transition-colors duration-200"
                >
                  {input.label["ar"]}
                </label>
                <div className="flex justify-center my-4">
                  <div
                    onClick={() => setShowIconPicker(true)}
                    className="w-40 h-40 sm:w-48 sm:h-48 ml-auto rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-primary/5 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 text-gray-400 hover:text-primary"
                  >
                    {Icon ? (
                      <Icon className="w-20 h-20" />
                    ) : (
                      <div className="flex flex-col items-center">
                        <span className="text-4xl mb-2">+</span>
                        <span className="text-sm">اختر أيقونة</span>
                      </div>
                    )}
                  </div>
                </div>
                {errors[input.name] && (
                  <p className="text-red-500  text-sm mt-1.5 flex items-center justify-center gap-1">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500" />
                    {errors[input.name] ??
                      errors[input.name]["ar"] ??
                      errors[input.name][0]["ar"] ??
                      "خطأ فى هذا الحقل"}
                  </p>
                )}
              </div>
            );
          }

          //////////////////////
          //normal logo  input
          //////////////////////

          if (input.fildType == "logo-image") {
            return (
              <div key={index} className="w-full group">
                <label
                  htmlFor={input.name}
                  className="block text-sm font-semibold text-gray-700 mb-2 group-focus-within:text-primary transition-colors duration-200"
                >
                  {input.label["ar"]}
                </label>
                <div
                  onClick={() => openLogoinput.current?.click()}
                  className="w-40 h-40 sm:w-56 sm:h-56 mx-auto rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center cursor-pointer overflow-hidden hover:border-primary hover:bg-primary/5 transition-all duration-300 relative group-hover:shadow-md"
                >
                  {form?.logo instanceof File ? (
                    <Img
                      src={URL.createObjectURL(form?.logo)}
                      className="w-full h-full object-contain p-2"
                    />
                  ) : form["logo"] ? (
                    <Img
                      src={form["logo"]}
                      className="w-full h-full object-contain p-2"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-gray-400 group-hover:text-primary transition-colors duration-300">
                      <FaImage className="w-10 h-10 mb-2" />
                      <span className="text-xs font-medium text-center px-2">
                        رفع الشعار
                      </span>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />

                  <input
                    type="file"
                    name="logo"
                    hidden
                    onChange={handleFileChange}
                    ref={openLogoinput}
                  />
                </div>
                {errors[input.name] && (
                  <p className="text-red-500 text-sm mt-1.5 flex items-center justify-center gap-1">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500" />
                    {errors[input.name] ??
                      errors[input.name]["ar"] ??
                      errors[input.name][0]["ar"] ??
                      "خطأ فى هذا الحقل"}
                  </p>
                )}
              </div>
            );
          }

          if (input.fildType == "full-image") {
            return (
              <div key={index} className="w-full group my-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2 group-focus-within:text-primary transition-colors duration-200">
                  {input.label.ar}
                </label>
                <div
                  onClick={() => openImageinput.current?.click()}
                  className="w-full h-80 sm:h-96 rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center cursor-pointer overflow-hidden hover:border-primary hover:bg-primary/5 transition-all duration-300 relative group-hover:shadow-md"
                >
                  {form.image && form.image instanceof File ? (
                    <Img
                      src={URL.createObjectURL(form.image) || "/public"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-gray-400 group-hover:text-primary transition-colors duration-300">
                      <FaImage className="w-16 h-16 mb-4" />
                      <span className="text-base font-medium">
                        اضغط لرفع الصورة (كاملة)
                      </span>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />

                  <input
                    type="file"
                    name="image"
                    hidden
                    onChange={handleFileChange}
                    ref={openImageinput}
                  />
                </div>
                {errors[input.name] && (
                  <p className="text-red-500 text-sm mt-1.5 flex items-center gap-1">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500" />
                    {getErrorMessage(errors[input.name])}
                  </p>
                )}
              </div>
            );
          }

          //////////////////////
          //Select Eelement
          //////////////////////

          // Replace the entire select block with CustomSelect
          if (input.fildType == "select-type") {
            return (
              <div key={index} className="w-full">
                <CustomSelect
                  name={input.name}
                  label={input.label["ar"]}
                  placeholder="حدد أحد الإختيارات التالية : -"
                  value={form[input.name] ?? form[input.name]?.title_en ?? ""}
                  onChange={(e) => handleChange(e as any)}
                  options={input.selectItems || []}
                  error={
                    errors[input.name] && getErrorMessage(errors[input.name])
                  }
                  readOnly={input.readOnly}
                />
              </div>
            );
          }

          //////////////////////
          //select keywords
          //////////////////////
          if (input.fildType === "keywords") {
            return (
              <div key={index} className="w-full group mt-4">
                <div className="bg-gray-50/30 rounded-xl border border-gray-200 p-4 hover:bg-gray-50 transition-colors duration-200">
                  <KeywordSelector
                    selectedKeywords={form.keywords || []}
                    setSelectedKeywords={handleKeywordsChange}
                  />
                </div>
                {errors[input.name] && (
                  <p className="text-red-500 text-sm mt-1.5 flex items-center gap-1">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500" />
                    {getErrorMessage(errors[input.name])}
                  </p>
                )}
              </div>
            );
          }

          //////////////////////
          // Generic Dynamic Array input
          //////////////////////

          if (input.fildType === "array") {
            return (
              <div key={index} className="w-full group">
                <label className="block text-sm font-semibold text-gray-700 mb-2 group-focus-within:text-primary transition-colors duration-200">
                  {input.label.ar}
                </label>

                <div className="flex flex-col gap-3 p-4 bg-gray-50/50 rounded-xl border border-gray-200">
                  {Array.isArray(form[input.name]) &&
                  form[input.name].length > 0 ? (
                    form[input.name].map((item: any, idx: number) => (
                      <div
                        key={item.id || idx}
                        className="flex items-center gap-3 p-2 bg-white rounded-lg shadow-sm border border-gray-100"
                      >
                        {/* Dynamic input field based on displayKey */}
                        <input
                          type="text"
                          value={
                            input.displayKey ? item[input.displayKey] || "" : ""
                          }
                          onChange={(e) =>
                            handleArrayChange(
                              input.name,
                              idx,
                              input.displayKey!,
                              e.target.value,
                              form,
                              setForm
                            )
                          }
                          className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-gray-800 placeholder-gray-400 outline-none transition-all duration-300 focus:border-primary focus:ring-2 focus:ring-primary/10"
                          placeholder={input.placeholder || ""}
                        />

                        {/* Remove button */}
                        <button
                          type="button"
                          onClick={() =>
                            handleArrayRemove(input.name, idx, form, setForm)
                          }
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
                          title="حذف"
                        >
                          <FaTrash className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm italic text-center py-2">
                      لا توجد بيانات مضافة حالياً
                    </p>
                  )}

                  {/* Add new item button */}
                  <button
                    type="button"
                    onClick={() =>
                      handleArrayAdd(
                        input.name,
                        input.displayKey!,
                        form,
                        setForm
                      )
                    }
                    className="flex items-center justify-center gap-2 w-full py-2.5 mt-2 rounded-xl border-2 border-dashed border-primary/30 text-primary hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 font-medium"
                  >
                    <FaPlus className="w-4 h-4" /> إضافة عنصر جديد
                  </button>
                </div>

                {/* Error message */}
                {errors[input.name] && (
                  <p className="text-red-500 text-sm mt-1.5 flex items-center gap-1">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500" />
                    {getErrorMessage(errors[input.name])}
                  </p>
                )}
              </div>
            );
          }

          if (input.fildType == "select-org") {
            return (
              <div key={index} className="w-full group">
                <label className="block text-sm font-semibold text-gray-700 mb-2 group-focus-within:text-primary transition-colors duration-200">
                  {input.label.ar}
                </label>
                <div className="bg-gray-50/30 rounded-xl border border-gray-200 p-1 hover:bg-gray-50 transition-colors duration-200">
                  <SelectOrg form={form} setForm={setForm} key={index} />
                </div>
                {errors[input.name] && (
                  <p className="text-red-500 text-sm mt-1.5 flex items-center gap-1">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500" />
                    {getErrorMessage(errors[input.name])}
                  </p>
                )}
              </div>
            );
          }

          //////////////////////
          // spicail-coupons-section
          //////////////////////

          if (input.fildType == "special-section") {
            return (
              <div key={index} className="w-full group mt-4">
                <div className="bg-gray-50/30 rounded-xl border border-gray-200 p-4 hover:bg-gray-50 transition-colors duration-200">
                  <SpecialCouponSection form={form} setForm={setForm} />
                </div>
                {errors[input.name] && (
                  <p className="text-red-500 text-sm mt-1.5 flex items-center gap-1">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500" />
                    {errors[input.name] ??
                      errors[input.name]["ar"] ??
                      errors[input.name][0]["ar"] ??
                      "خطأ فى هذا الحقل"}
                  </p>
                )}
              </div>
            );
          }

          return null;
        })}
        <div className="mt-8">
          <input
            type="submit"
            value={submitValue}
            className="w-full sm:w-auto px-10 py-3 bg-primary text-white font-bold rounded-xl shadow-md hover:bg-white hover:text-primary hover:shadow-lg hover:-translate-y-1 active:translate-y-0 border-2 border-transparent hover:border-primary transition-all duration-300 cursor-pointer text-lg"
          />
        </div>
      </form>

      <SuccessAlart
        showAlart={successPopup}
        onClose={handleCloseAlart}
        Message={successMessage}
      />

      <IconPicker
        show={showIconPicker}
        onClose={() => setShowIconPicker(false)}
        selectedIcon={selectedIcon}
        onChange={handleChangeIcon}
      />

      <MapSelector
        locale="ar"
        setLocation={setLocation}
        initialLocation={location}
        showMap={showMap}
        onClose={() => setShowMap(false)}
      />
    </>
  );
}
