"use client";
import useFetchItem from "@/app/_helpers/FetchItemData";
import React, { useEffect, useRef, useState } from "react";
import SuccessAlart from "../../_popups/SuccessAlart";
import { FaImage, FaPlus, FaStar, FaTrash } from "react-icons/fa";
import { InputField } from "@/app/types/_dashboard/GlobalTypes";
import { useRouter } from "next/navigation";
import { instance } from "@/app/_helpers/axios";
import { formatTitle, getIconComponent } from "@/app/_helpers/helpers";
import { Keyword } from "../_cards/types";
import KeywordSelector from "../../_website/_global/KeywordSelector";
import LoadingSpin from "../../LoadingSpin";
import { toast } from "sonner";
import Img from "../../_website/_global/Img";
import SubCategoryMultiSelect from "../_organizations/SubCategoryMultiSelect";
import Image from "next/image";
import MapSelector from "../../_maps/MapSelector";
import ServiceImages from "../_services/ServiceImages";
import OrganizationsSelector from "../_services/OrganizationsSelector";
import CouponDisplaySection from "../_coupons/CouponDisplaySection";
import LocaleLink from "../../_website/_global/LocaleLink";
import IconPicker from "../IconPicker";
import CustomSelect from "./CustomSelect";

interface props {
  api: string;
  updateEndPoint: string;
  id: number | string;
  inputsData: InputField[];
  direct: string;
}

export interface Location {
  address: string;
  coordinates: {
    lat: number;
    lng: number;
    lang?: number;
  };
}

export default function DynamicElementPage({
  api,
  updateEndPoint,
  id,
  inputsData,
  direct,
}: props) {
  const router = useRouter();
  const openImageinput = useRef<HTMLInputElement | null>(null);
  const openLogoinput = useRef<HTMLInputElement | null>(null);

  // Get The Data For The Item .

  const { data, loading } = useFetchItem<any>(api, id, false);
  console.log(data);

  // States Lines For This Component.
  const [form, setForm] = useState<any>({});
  const [updatedData, setUpdatedData] = useState<Record<string, string | File>>(
    {}
  );

  const [successMessage, setSuccessMessage] = useState("");
  const [successPopup, setSuccessPopup] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState("");
  const [showMap, setShowMap] = useState(false);
  const [location, setLocation] = useState<Location | null>(null);
  const [errors, setErrors] = useState<any>({});

  // Start Functions Lines

  // The Function For Update The Item Data .

  const handleSaveChanges = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form) return;

    try {
      setUpdateLoading(true);

      // Compare current form with original API data
      const isEqual = JSON.stringify(form) === JSON.stringify(data);

      if (isEqual) {
        toast.error(
          "لم يتم تحديث أى بيانات تخص هذا العنصر تأكد من إضافة بيانات جديدة وحاول مره اخرى"
        );
        setUpdateLoading(false);
        return;
      }

      const formData = new FormData();

      // Fill formData from updatedData
      for (const key in updatedData) {
        let value: any = updatedData[key];

        // If the value is a file → append مباشرة
        if (value instanceof File) {
          formData.append(key, value);
          continue; // skip باقي الشروط
        }

        // Convert arrays/objects (except File) to JSON string
        if (
          Array.isArray(value) ||
          (typeof value === "object" && value !== null)
        ) {
          value = JSON.stringify(value);
        }

        // Append final value
        formData.append(key, value ?? "");
      }

      if (form.images && form.images.length > 0) {
        form.images.forEach((image: any) => {
          if (image.file) {
            // New uploaded file
            formData.append("images[]", image.file);
          }
        });
      }

      if (form.deletedImages && form.deletedImages.length > 0) {
        formData.append("deleted_images", JSON.stringify(form.deletedImages));
      }

      // Helper function to compare two arrays of objects by selected keys
      const areEqual = (a: any[], b: any[]) => {
        if (!Array.isArray(a) || !Array.isArray(b)) return false;

        // Normalize the objects (مثلا نقارن فقط بالـ id)
        const normalize = (arr: any[]) =>
          arr.map((item) => ({ id: item.id })).sort((x, y) => x.id - y.id);

        return JSON.stringify(normalize(a)) === JSON.stringify(normalize(b));
      };

      // ...

      if (form.organizations && form.organizations.length > 0) {
        const isSame = areEqual(form.organizations, data?.organizations ?? []);

        if (!isSame) {
          formData.append(
            "organizations_supporters",
            JSON.stringify(form.organizations)
          );
        }
      }

      /*
       * Removed manual location appending.
       * Location changes are now handled via handleLocationChange
       * and stored in updatedData, so the main loop handles it.
       */

      const response = await instance.post(
        `${updateEndPoint}/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200 || response.status === 204) {
        setSuccessMessage("Updated successfully");
        setSuccessPopup(true);
        setUpdatedData({});
        if (direct) router.push(direct);
      } else {
        toast.error("فشل التحديث");
      }
    } catch (error: any) {
      console.log(error);
      toast.error(
        error?.response?.data?.message || "An unexpected error occurred"
      );

      if (error?.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;

    let newValue = value;

    // Special case: phone or number inputs => allow only digits
    if (
      name.toLowerCase().includes("phone") ||
      type === "tel" ||
      type === "number"
    ) {
      // allow digits, +, -, (), and spaces
      newValue = value.replace(/[^0-9+\-()\s]/g, "");
    }

    setForm((prevForm: any) => ({ ...prevForm, [name]: newValue }));

    if (data && newValue !== data[name]) {
      setUpdatedData((prevData) => ({ ...prevData, [name]: newValue }));
    } else {
      setUpdatedData((prevData) => {
        const newData = { ...prevData };
        delete newData[name];
        return newData;
      });
    }
  };

  // handle keywords change
  const handleKeywordsChange = (newKeywords: Keyword[]) => {
    setForm((prevForm: any) => ({
      ...prevForm,
      keywords: newKeywords,
    }));

    if (data && JSON.stringify(newKeywords) !== JSON.stringify(data.keywords)) {
      setUpdatedData((prevData: any) => ({
        ...prevData,
        keywords: newKeywords,
      }));
    } else {
      setUpdatedData((prevData: any) => {
        const newData = { ...prevData };
        delete newData.keywords;
        return newData;
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;

    if (files && files.length > 0) {
      const file = files[0];

      // Update main form state
      setForm((prevForm) => ({
        ...prevForm,
        [name]: file,
      }));

      // Update updatedData state
      setUpdatedData((prevData) => ({
        ...prevData,
        [name]: file,
      }));
    }
  };

  const handleChangeIcon = (iconName: string) => {
    setSelectedIcon(iconName);
    setUpdatedData({ ...updatedData, icon_name: iconName });
    setForm({ ...updatedData, icon_name: iconName });
    setShowIconPicker(false);
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

    if (
      data &&
      JSON.stringify(updatedArray) !== JSON.stringify(data[fieldName])
    ) {
      setUpdatedData((prevData: any) => ({
        ...prevData,
        [fieldName]: updatedArray,
      }));
    } else {
      setUpdatedData((prevData: any) => {
        const newData = { ...prevData };
        delete newData[fieldName];
        return newData;
      });
    }
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

    if (
      data &&
      JSON.stringify(updatedArray) !== JSON.stringify(data[fieldName])
    ) {
      setUpdatedData((prevData: any) => ({
        ...prevData,
        [fieldName]: updatedArray,
      }));
    }
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

    if (
      data &&
      JSON.stringify(updatedArray) !== JSON.stringify(data[fieldName])
    ) {
      setUpdatedData((prevData: any) => ({
        ...prevData,
        [fieldName]: updatedArray,
      }));
    } else {
      setUpdatedData((prevData: any) => {
        const newData = { ...prevData };
        delete newData[fieldName];
        return newData;
      });
    }
  };

  // Helper to get nested value by key like "user.name"
  const getNestedValue = (obj: any, path: string) => {
    return path.split(".").reduce((acc, key) => acc && acc[key], obj);
  };

  // Handle location change from MapSelector
  const handleLocationChange = (newLocation: Location | null) => {
    setLocation(newLocation);

    // Update main form state
    setForm((prevForm: any) => ({
      ...prevForm,
      location: newLocation,
    }));

    // Update updatedData state
    // Check if location actually changed from initial data
    let initialLocation = data?.location;
    if (typeof initialLocation === "string") {
      try {
        initialLocation = JSON.parse(initialLocation);
      } catch (e) {
        // ignore error
      }
    }

    // Simple comparison (can be improved if needed)
    if (JSON.stringify(newLocation) !== JSON.stringify(initialLocation)) {
      setUpdatedData((prevData) => ({
        ...prevData,
        location: newLocation ? JSON.stringify(newLocation) : "",
      }));
    } else {
      setUpdatedData((prevData) => {
        const newData = { ...prevData };
        delete newData.location;
        return newData;
      });
    }
  };

  //  End Functions Lines

  // Add The Data To The Form Object .

  useEffect(() => {
    if (data) {
      setForm(data);
    }

    if (data && data?.location) {
      const location =
        typeof data?.location == "string"
          ? JSON.parse(data?.location)
          : data?.location;

      setLocation({
        address: location?.address,
        coordinates: {
          lat: location?.coordinates?.lat, // تقريبًا وسط عمان
          lng: location?.coordinates?.lng,
        },
      });
    }
  }, [data]);

  console.log(data);

  if (loading || updateLoading) return <LoadingSpin />;

  return (
    <>
      <div className="w-full relative mt-4">
        <form
          onSubmit={handleSaveChanges}
          style={{ direction: "rtl" }}
          className="w-full lg:w-[90%] w-full mx-auto px-6 py-8 mb-8 mt-4 flex flex-col gap-6 bg-white rounded-2xl shadow-sm border border-gray-100"
        >
          {inputsData.map((input, index) => {
            //////////////////////
            //Normal input
            //////////////////////

            if (input.fildType == "short-text") {
              const value = getNestedValue(form, input.name);
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
                    value={(value as string) || ""}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/30 px-4 py-3 sm:py-3.5 text-gray-800 placeholder-gray-400 outline-none transition-all duration-300 hover:bg-gray-50 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 read-only:bg-gray-100 read-only:cursor-not-allowed"
                    readOnly={input.readOnly}
                  />
                  {errors[input.name] && (
                    <p className="text-red-500 text-sm mt-1.5 flex items-center gap-1">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500" />
                      {errors[input.name]?.ar ??
                        errors[input.name]?.[0]?.ar ??
                        (typeof errors[input.name] === "string"
                          ? errors[input.name]
                          : "خطأ فى هذا الحقل")}
                    </p>
                  )}
                </div>
              );
            }

            //////////////////////
            // email input (independent case)
            //////////////////////

            if (input.fildType == "email") {
              const value = getNestedValue(form, input.name);
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
                    value={(value as string) || ""}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/30 px-4 py-3 sm:py-3.5 text-gray-800 placeholder-gray-400 outline-none transition-all duration-300 hover:bg-gray-50 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 read-only:bg-gray-100 read-only:cursor-not-allowed"
                    readOnly={data?.email_verified_at !== null}
                  />
                  {errors[input.name] && (
                    <p className="text-red-500 text-sm mt-1.5 flex items-center gap-1">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500" />
                      {errors[input.name]?.ar ??
                        errors[input.name]?.[0]?.ar ??
                        (typeof errors[input.name] === "string"
                          ? errors[input.name]
                          : "خطأ فى هذا الحقل")}
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
                    value={form[input.name] || 0}
                    onChange={handleChange}
                    placeholder={input.placeholder || ""}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/30 px-4 py-3 text-gray-800 placeholder-gray-400 outline-none transition-all duration-300 hover:bg-gray-50 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10"
                    readOnly={input.readOnly}
                  />
                  {errors[input.name] && (
                    <p className="text-red-500 text-sm mt-1.5 flex items-center gap-1">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500" />
                      {errors[input.name]?.ar ??
                        errors[input.name]?.[0]?.ar ??
                        (typeof errors[input.name] === "string"
                          ? errors[input.name]
                          : "خطأ فى هذا الحقل")}
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
                    dir="ltr"
                    value={form[input.name] || ""}
                    onChange={handleChange}
                    placeholder={input.placeholder || "أدخل رقم الهاتف"}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/30 px-4 py-3 text-gray-800 placeholder-gray-400 outline-none transition-all duration-300 hover:bg-gray-50 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 text-right"
                    readOnly={input.readOnly}
                  />
                  {errors[input.name] && (
                    <p className="text-red-500 text-sm mt-1.5 flex items-center gap-1">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500" />
                      {errors[input.name]?.ar ??
                        errors[input.name]?.[0]?.ar ??
                        (typeof errors[input.name] === "string"
                          ? errors[input.name]
                          : "خطأ فى هذا الحقل")}
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
                      {errors[input.name]?.ar ??
                        errors[input.name]?.[0]?.ar ??
                        (typeof errors[input.name] === "string"
                          ? errors[input.name]
                          : "خطأ فى هذا الحقل")}
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
                    value={
                      form[input.name] ? form[input.name].split(" ")[0] : ""
                    }
                    onChange={handleChange}
                    placeholder={input.placeholder || ""}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/30 px-4 py-3 text-gray-800 placeholder-gray-400 outline-none transition-all duration-300 hover:bg-gray-50 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10"
                    readOnly={input.readOnly}
                  />
                  {errors[input.name] && (
                    <p className="text-red-500 text-sm mt-1.5 flex items-center gap-1">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500" />
                      {errors[input.name]?.ar ??
                        errors[input.name]?.[0]?.ar ??
                        (typeof errors[input.name] === "string"
                          ? errors[input.name]
                          : "خطأ فى هذا الحقل")}
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
                    readOnly={input.readOnly}
                  />
                  {errors[input.name] && (
                    <p className="text-red-500 text-sm mt-1.5 flex items-center gap-1">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500" />
                      {errors[input.name]?.ar ??
                        errors[input.name]?.[0]?.ar ??
                        (typeof errors[input.name] === "string"
                          ? errors[input.name]
                          : "خطأ فى هذا الحقل")}
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
                  code += chars.charAt(
                    Math.floor(Math.random() * chars.length)
                  );
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
                      {errors[input.name]?.ar ??
                        errors[input.name]?.[0]?.ar ??
                        (typeof errors[input.name] === "string"
                          ? errors[input.name]
                          : "خطأ فى هذا الحقل")}
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
                  className="flex flex-col items-center justify-center my-6 group"
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
                    ) : form[input.name] ? (
                      <Img
                        src={form[input.name] as string}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-gray-400 group-hover:text-primary transition-colors duration-300">
                        <FaImage className="w-12 h-12 mb-2" />
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
                      <span className="text-sm text-gray-500">
                        اللون المختار
                      </span>
                      <span className="font-mono text-gray-800 dir-ltr text-left uppercase">
                        {(form[input.name] as string) || "#000000"}
                      </span>
                    </div>
                  </div>
                  {errors[input.name] && (
                    <p className="text-red-500 text-sm mt-1.5 flex items-center gap-1">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500" />
                      {errors[input.name]?.ar ?? errors[input.name]}
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
                    {form?.image instanceof File ? (
                      <Img
                        src={URL.createObjectURL(form?.image)}
                        className="w-full h-full  object-cover"
                      />
                    ) : form["image"] ? (
                      <Img
                        src={
                          form["image"]
                            ? form["image"]
                            : "/defaults/noImage.png"
                        }
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
                      {errors[input.name]?.ar ??
                        errors[input.name]?.[0]?.ar ??
                        (typeof errors[input.name] === "string"
                          ? errors[input.name]
                          : "خطأ فى هذا الحقل")}
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
                        className="w-full h-full  object-contain p-2"
                      />
                    ) : form["logo"] ? (
                      <Img
                        src={
                          form["logo"] ? form["logo"] : "/defaults/noImage.png"
                        }
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
                      {errors[input.name]?.ar ??
                        errors[input.name]?.[0]?.ar ??
                        (typeof errors[input.name] === "string"
                          ? errors[input.name]
                          : "خطأ فى هذا الحقل")}
                    </p>
                  )}
                </div>
              );
            }

            //////////////////////
            //normal Image input
            //////////////////////

            if (input.fildType == "full-image") {
              return (
                <div key={index} className="w-full group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 group-focus-within:text-primary transition-colors duration-200">
                    {input.label.ar}
                  </label>
                  <div
                    onClick={() => openImageinput.current?.click()}
                    className="w-full h-64 sm:h-96 rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center cursor-pointer overflow-hidden hover:border-primary hover:bg-primary/5 transition-all duration-300 relative group-hover:shadow-md"
                  >
                    {form?.image instanceof File ? (
                      <Image
                        width={1024}
                        height={1280}
                        alt="local-image"
                        src={URL.createObjectURL(form?.image)}
                        className="w-full h-full  object-cover"
                      />
                    ) : form[input.name] ? (
                      <Img
                        src={form[input.name]}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-gray-400 group-hover:text-primary transition-colors duration-300">
                        <FaImage className="w-16 h-16 mb-4" />
                        <span className="text-lg font-medium">
                          اضغط لرفع الصورة الكاملة
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
                      {errors[input.name]?.ar ??
                        errors[input.name]?.[0]?.ar ??
                        (typeof errors[input.name] === "string"
                          ? errors[input.name]
                          : "خطأ فى هذا الحقل")}
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
                <div key={index} className="w-full group">
                  <label
                    htmlFor={input.name}
                    className="block text-sm font-semibold text-gray-700 mb-2 group-focus-within:text-primary transition-colors duration-200"
                  >
                    {input.label["ar"]}
                  </label>
                  <div className="flex justify-center my-4">
                    <div
                      onClick={() => setShowIconPicker(true)}
                      className="w-40 h-40 sm:w-48 sm:h-48 rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-primary/5 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 text-gray-400 hover:text-primary"
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
                    <p className="text-red-500 text-sm mt-1.5 flex items-center justify-center gap-1">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500" />
                      {errors[input.name]?.ar ??
                        errors[input.name]?.[0]?.ar ??
                        (typeof errors[input.name] === "string"
                          ? errors[input.name]
                          : "خطأ فى هذا الحقل")}
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
                  <div className="bg-gray-50/30 rounded-xl border border-gray-200 p-1 hover:bg-gray-50 transition-colors duration-200">
                    <OrganizationsSelector form={form} setForm={setForm} />
                  </div>
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
                </div>
              );
            }
            //////////////////////
            //Select Eelement
            //////////////////////

            if (input.fildType == "sub-category") {
              return (
                <div key={index} className="w-full group">
                  <div className="bg-gray-50/30 rounded-xl border border-gray-200 p-1 hover:bg-gray-50 transition-colors duration-200">
                    <SubCategoryMultiSelect
                      setUpdatedData={setUpdatedData}
                      currentSubCategories={
                        form.sub_categories ? form.sub_categories : []
                      }
                      mode="update"
                    />
                  </div>
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
                      className="w-full rounded-xl border border-gray-200 bg-gray-50/30 px-4 py-3 text-gray-800 placeholder-gray-400 outline-none transition-all duration-300 hover:bg-gray-50 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 pl-32"
                      readOnly={input.readOnly}
                    />
                    <div className="absolute left-2 top-1.5 bottom-1.5">
                      <button
                        type="button"
                        onClick={() => setShowMap(true)}
                        className="h-full px-4 rounded-lg bg-primary/10 text-primary text-sm font-medium hover:bg-primary hover:text-white transition-colors duration-200 flex items-center gap-2"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          ></path>
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          ></path>
                        </svg>
                        الخريطة
                      </button>
                    </div>
                  </div>
                  {errors[input.name] && (
                    <p className="text-red-500 text-sm mt-1.5 flex items-center gap-1">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500" />
                      {errors[input.name][0]["ar"] ??
                        errors[input.name][0] ??
                        ""}
                    </p>
                  )}
                </div>
              );
            }

            //////////////////////
            //Select Eelement
            //////////////////////

            if (input.fildType == "select-type") {
              return (
                <div key={index} className="w-full group">
                  <CustomSelect
                    name={input.name}
                    label={input.label["ar"]}
                    placeholder="حدد أحد الإختيارات التالية : -"
                    value={form[input.name] ?? form[input.name]?.title_ar ?? ""}
                    onChange={(e) => handleChange(e as any)}
                    options={input.selectItems || []}
                    error={
                      errors[input.name]?.ar ??
                      errors[input.name]?.[0]?.ar ??
                      (typeof errors[input.name] === "string"
                        ? errors[input.name]
                        : undefined)
                    }
                    readOnly={input.readOnly}
                  />
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
                              input.displayKey
                                ? item[input.displayKey] || ""
                                : ""
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
                      {errors[input.name]?.ar ??
                        errors[input.name]?.[0]?.ar ??
                        (typeof errors[input.name] === "string"
                          ? errors[input.name]
                          : "خطأ فى هذا الحقل")}
                    </p>
                  )}
                </div>
              );
            }

            //////////////////////
            //special-coupon-section
            //////////////////////

            if (input.fildType == "special-section") {
              return (
                <div key={index} className="w-full group mt-4">
                  <div className="bg-gray-50/30 rounded-xl border border-gray-200 p-4 hover:bg-gray-50 transition-colors duration-200">
                    <CouponDisplaySection key={index} form={form} />
                  </div>
                </div>
              );
            }

            //////////////////////
            //organization show
            //////////////////////

            if (input.fildType == "org-show") {
              return (
                form["organization"] && (
                  <div
                    key={index}
                    className="h-fit w-3xl group flex flex-col gap-3 mt-4 px-2 py-4"
                  >
                    <label className="input-label text-center">
                      {input.label.ar}
                    </label>
                    <div
                      key={index}
                      className="max-w-md w-full bg-white/30  border border-white/20 shadow-xl overflow-hidden"
                    >
                      {/* Image */}
                      <div className="h-40 w-full overflow-hidden">
                        <Img
                          src={form[input.name]?.image}
                          errorSrc="/defaults/noImage.png"
                          alt={form[input.name]?.title}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      {/* Content */}
                      <div className="p-4 flex flex-col gap-2">
                        <LocaleLink
                          href={`/dashboard/organizations/${
                            form[input.name]?.id
                          }?title=${formatTitle(form[input.name]?.title)}`}
                          className="text-lg group-hover:underline group-hover:text-sky-400 duration-150 font-bold text-gray-900"
                        >
                          {form[input.name]?.title}
                        </LocaleLink>
                        <p className="text-sm text-gray-700 line-clamp-2">
                          {form[input.name]?.description}
                        </p>

                        {/* Rating */}
                        <div className="flex items-center gap-1 text-yellow-500 mt-2">
                          <FaStar className="text-sm" />
                          <span className="text-sm font-medium text-gray-800">
                            {form[input.name]?.rating}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              );
            }

            return null;
          })}
          <div className="mt-8">
            <input
              type="submit"
              value={"حفظ"}
              className="w-full sm:w-auto px-10 py-3 bg-primary text-white font-bold rounded-xl shadow-md hover:bg-white hover:text-primary hover:shadow-lg hover:-translate-y-1 active:translate-y-0 border-2 border-transparent hover:border-primary transition-all duration-300 cursor-pointer text-lg"
            />
          </div>
        </form>
      </div>

      <SuccessAlart
        showAlart={successPopup}
        onClose={() => setSuccessPopup(false)}
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
        setLocation={handleLocationChange}
        initialLocation={location}
        showMap={showMap}
        onClose={() => setShowMap(false)}
      />
    </>
  );
}
