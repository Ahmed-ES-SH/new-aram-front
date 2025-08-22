"use client";
import { instance } from "@/app/_helpers/axios";
import React, { useEffect, useRef, useState } from "react";
import { LuUserPen } from "react-icons/lu";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import SuccessAlart from "../../_popups/SuccessAlart";
import LoadingSpin from "../../LoadingSpin";
import { FaEye, FaEyeSlash, FaImage, FaPlus, FaTrash } from "react-icons/fa";
import { errorType, InputField } from "@/app/types/_dashboard/GlobalTypes";
import { getIconComponent } from "@/app/_helpers/helpers";
import Img from "../../_website/_global/Img";
import IconPicker from "../../_website/_global/IconPicker";
import { toast } from "sonner";
import KeywordSelector, {
  Keyword,
} from "../../_website/_global/KeywordSelector";
import MapSelector from "../../_maps/MapSelector";
import { Location } from "./DynamicElementPage";
import SubCategoryMultiSelect from "../_organizations/SubCategoryMultiSelect";

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
        acc[input.name] = "";
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

    setForm((prevForm) => ({
      ...prevForm,
      [name]: newValue,
    }));
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
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    scrollTo(0, 0);
    try {
      setLoading(true);
      const formData = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          const formattedValue = Array.isArray(value)
            ? JSON.stringify(value)
            : value;
          formData.append(key, formattedValue as string | Blob);
        }
      });
      if (location) formData.append("location", JSON.stringify(location));
      formData.append("user_id", "4");
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
          acc[key] = Array.isArray(value) ? value[0] : value;
          return acc;
        }, {} as errorType);

        setErrors(formattedErrors);
      }

      if (error?.response?.data?.message) {
        toast.error(error?.response?.data?.message);
      }
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

  ///////////////////////////////////
  // End Functions Lines
  ///////////////////////////////////

  if (loading) return <LoadingSpin />;

  return (
    <>
      <form
        onSubmit={handleSubmit}
        style={{ direction: "rtl" }}
        className="w-[90%] border border-gray-300 shadow-lg rounded-xl px-4 py-12 mb-4 mt-12 h-fit overflow-y-auto mx-auto max-md:w-[96%]  flex flex-col gap-3"
      >
        <div className="text-center mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-primary tracking-tight drop-shadow-md">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-2 text-sm sm:text-base text-gray-600 italic">
              {subtitle}
            </p>
          )}
          <div className="mt-3 w-24 h-1 mx-auto bg-gradient-to-r from-primary via-blue-500 to-primary rounded-full animate-pulse" />
        </div>
        {inputs.map((input, index) => {
          //////////////////////
          //Normal input
          //////////////////////

          if (input.fildType == "short-text") {
            return (
              <div
                className="flex flex-col gap-3 px-2 py-4 shadow-lg rounded-lg border border-gray-300"
                key={index}
              >
                <label htmlFor={input.name} className="input-label">
                  {input.label["ar"]}
                </label>
                <input
                  name={input.name}
                  placeholder={input.placeholder}
                  type={input.type}
                  value={(form[input.name] as string) || ""}
                  onChange={handleChange}
                  className="input-style"
                />
                {errors[input.name] && (
                  <p className="text-red-500 text-sm mt-1">
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
          //password input
          //////////////////////

          if (input.fildType == "fild-password") {
            return (
              <div
                className="flex flex-col gap-3 px-2 py-4 shadow-lg rounded-lg border border-gray-300 relative"
                key={index}
              >
                <label htmlFor={input.name} className="input-label">
                  {input.label["ar"]}
                </label>

                <div className="relative w-full">
                  <input
                    name={input.name}
                    placeholder={input.placeholder}
                    type={showPassword ? "text" : "password"}
                    value={(form[input.name] as string) || ""}
                    onChange={handleChange}
                    className="input-style pr-10" // padding-right عشان مكان الأيقونة
                  />

                  {/* Eye Icon */}
                  <span
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>

                {errors[input.name] && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors[input.name] ??
                      errors[input.name]["ar"] ??
                      errors[input.name][0]["ar"] ??
                      "خطأ فى هذا الحقل"}
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
              <div
                key={index}
                className="h-fit w-full flex flex-col gap-3 px-2 py-4 shadow-lg rounded-lg border border-gray-300"
              >
                <label className="input-label">{input.label.ar}</label>
                <input
                  name={input.name || ""}
                  type="tel"
                  inputMode="numeric" // يظهر لوحة أرقام على الموبايل
                  value={form[input.name] || ""}
                  onChange={handleChange}
                  placeholder={input.placeholder || "أدخل رقم الهاتف"}
                  className="border-2 border-gray-300 rounded-lg focus:border-sky-300 duration-300 p-2 outline-none"
                  readOnly={input.readOnly}
                />
                {errors[input.name] && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors[input.name][0]["ar"]}
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
              <div
                key={index}
                className="h-fit w-full flex flex-col gap-3 px-2 py-4 shadow-lg rounded-lg border border-gray-300"
              >
                <label className="input-label">{input.label.ar}</label>
                <input
                  name={input.name || ""}
                  type="number"
                  value={form[input.name] || ""}
                  onChange={handleChange}
                  placeholder={input.placeholder || ""}
                  className="border-2 border-gray-300 rounded-lg focus:border-sky-300 duration-300  p-2 outline-none"
                  readOnly={input.readOnly}
                />
                {errors[input.name] && (
                  <p className="text-red-500 text-sm mt-1">
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
          // Time input
          //////////////////////
          if (input.fildType === "time-input") {
            return (
              <div
                key={index}
                className="h-fit w-full flex flex-col gap-3 px-2 py-4 shadow-lg rounded-lg border border-gray-300"
              >
                <label className="input-label">{input.label.ar}</label>
                <input
                  name={input.name || ""}
                  type="time"
                  value={form[input.name] || ""}
                  onChange={handleChange}
                  placeholder={input.placeholder || ""}
                  className="border-2 border-gray-300 rounded-lg focus:border-sky-300 duration-300 p-2 outline-none"
                  readOnly={input.readOnly}
                />
                {errors[input.name] && (
                  <p className="text-red-500 text-sm mt-1">
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
          //Select Eelement
          //////////////////////

          if (input.fildType == "location") {
            return (
              <div
                className="flex flex-col gap-3 w-full relative px-2 py-4 shadow-lg rounded-lg border border-gray-300"
                key={index}
              >
                <label htmlFor={input.name} className="input-label">
                  {input.label["ar"]}
                </label>
                <div className="relative">
                  <input
                    name={input.name}
                    placeholder={input.placeholder}
                    type={input.type}
                    value={(location && (location.address as string)) || ""}
                    onChange={handleChange}
                    className="input-style read-only:bg-gray-100 read-only:focus:outline-gray-100"
                    readOnly={input.readOnly}
                  />
                  <span
                    onClick={() => setShowMap(true)}
                    className="underline text-red-400 mt-2 w-fit mr-auto block cursor-pointer hover:text-red-600 duration-150"
                  >
                    حدد العنوان على الخريطة
                  </span>
                </div>
                {errors[input.name] && (
                  <p className="text-red-500 text-sm mt-1">
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
          //Select Eelement
          //////////////////////

          if (input.fildType == "sub-category") {
            return (
              <div
                className="w-full border border-gray-300 shadow-lg rounded-lg px-2 py-4"
                key={index}
              >
                <SubCategoryMultiSelect
                  setUpdatedData={setForm}
                  currentSubCategories={[]}
                  mode="add"
                />
              </div>
            );
          }

          //////////////////////
          //Color  Fild
          //////////////////////

          if (input.fildType === "color-fild") {
            return (
              <div
                className="flex flex-col gap-3 px-2 py-4 shadow-lg rounded-lg border border-gray-300"
                key={index}
              >
                <label htmlFor={input.name} className="input-label">
                  {input.label["ar"]}
                </label>
                <input
                  name={input.name}
                  type="color"
                  value={(form[input.name] as string) || "#000000"}
                  onChange={handleChange}
                  className="w-32 h-32  select-effect p-0 border-0 cursor-pointer"
                />
                {errors[input.name] && (
                  <p className="text-red-500 text-sm mt-1">
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
          //text area Element
          //////////////////////
          if (input.fildType == "long-text") {
            return (
              <div
                className="flex flex-col gap-3 px-2 py-4 shadow-lg rounded-lg border border-gray-300"
                key={index}
              >
                <label htmlFor={input.name} className="input-label">
                  {input.label["ar"]}
                </label>
                <textarea
                  name={input.name}
                  placeholder={input.placeholder}
                  value={(form[input.name] as string) || ""}
                  onChange={handleChange}
                  className="input-style h-24"
                />
                {errors[input.name] && (
                  <p className="text-red-500 text-sm mt-1">
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
          //user Image input
          //////////////////////

          if (input.fildType == "user-image") {
            return (
              <div key={index} className="h-80">
                <div
                  onClick={() => openImageinput.current?.click()}
                  className="w-60 h-60 rounded-full  hover:-translate-y-2 hover:bg-primary text-second_text hover:text-white hover:border-white duration-200 cursor-pointer  mx-auto border-2  border-second_text flex items-center justify-center "
                >
                  {form[input.name] instanceof File ? (
                    <img
                      src={URL.createObjectURL(form[input.name] as Blob)}
                      className="w-60 h-60  rounded-full"
                    />
                  ) : (
                    <LuUserPen className="size-24 " />
                  )}
                  <input
                    type="file"
                    name="image"
                    hidden
                    onChange={handleFileChange}
                    ref={openImageinput}
                  />
                  {errors[input.name] && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors[input.name] ??
                        errors[input.name]["ar"] ??
                        errors[input.name][0]["ar"] ??
                        "خطأ فى هذا الحقل"}
                    </p>
                  )}
                </div>
              </div>
            );
          }

          //////////////////////
          //normal Image input
          //////////////////////

          if (input.fildType == "normal-image") {
            return (
              <div key={index} className="my-4 flex flex-col gap-4">
                <label htmlFor={input.name} className="input-label">
                  {input.label["ar"]}
                </label>
                <div
                  onClick={() => openImageinput.current?.click()}
                  className="lg:w-96 w-[90%] hover:shadow-sky-400 hover:shadow-2xl h-60 overflow-hidden rounded-lg border border-gray-300 shadow-md hover:-translate-y-2 hover:bg-primary text-second_text hover:text-white hover:border-white duration-200 cursor-pointer  mx-auto  flex items-center justify-center "
                >
                  {form[input.name] instanceof File ? (
                    <img
                      src={URL.createObjectURL(form[input.name] as Blob)}
                      className="w-full h-full  rounded-lg object-cover"
                    />
                  ) : (
                    <FaImage className="size-24 " />
                  )}
                  <input
                    type="file"
                    name="image"
                    hidden
                    onChange={handleFileChange}
                    ref={openImageinput}
                  />
                </div>
                {errors[input.name] && (
                  <p className="text-red-500 text-sm mt-1">
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
          //select Icon
          //////////////////////

          if (input.fildType == "icon-fild") {
            const Icon = getIconComponent(form[input.name]);
            return (
              <div className="flex flex-col gap-3 " key={index}>
                <label htmlFor={input.name} className="input-label">
                  {input.label["ar"]}
                </label>
                <div
                  onClick={() => setShowIconPicker(true)}
                  className="shadow  w-72 flex items-center justify-center h-52 rounded-xl mx-auto border border-gray-300 cursor-pointer duration-300 hover:bg-primary hover:text-white text-primary hover:border-primary"
                >
                  <Icon className="size-32  cursor-pointer select-effect" />
                </div>
                {errors[input.name] && (
                  <p className="text-red-500 text-sm mt-1">
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
              <div
                key={index}
                className="flex flex-col gap-2 items-start w-fit ml-auto"
              >
                <label htmlFor={input.name} className="input-label">
                  {input.label["ar"]}
                </label>
                <div
                  onClick={() => openLogoinput.current?.click()}
                  className="w-72 h-60 p-4 overflow-hidden rounded-lg shadow  border-gray-300  hover:-translate-y-2 hover:bg-primary text-second_text hover:text-white hover:border-white duration-200 cursor-pointer  mx-auto border  border-second_text flex items-center justify-center "
                >
                  {form?.logo instanceof File ? (
                    <img
                      src={URL.createObjectURL(form?.logo)}
                      className="w-full h-full  object-cover"
                    />
                  ) : form["logo"] ? (
                    <Img
                      src={
                        form["logo"] ? form["logo"] : "/defaults/noImage.png"
                      }
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FaImage className="size-24 " />
                  )}
                  <input
                    type="file"
                    name="logo"
                    hidden
                    onChange={handleFileChange}
                    ref={openLogoinput}
                  />
                </div>
                {errors[input.name] && (
                  <p className="text-red-500 text-sm mt-1">
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
              <div key={index} className="h-fit w-full flex flex-col gap-3">
                <label className="input-label">{input.label.ar}</label>
                <div
                  onClick={() => openImageinput.current?.click()}
                  className="w-full h-96  shadow-md border-dashed overflow-hidden rounded-sm  hover:-translate-y-2 hover:bg-primary text-second_text hover:text-white hover:border-white duration-200 cursor-pointer  mx-auto border  border-second_text flex items-center justify-center "
                >
                  {form.image && form.image instanceof File ? (
                    <Img
                      src={URL.createObjectURL(form.image) || "/public"}
                      className="w-full h-full  object-cover"
                    />
                  ) : (
                    <FaImage className="size-24 " />
                  )}
                  <input
                    type="file"
                    name="image"
                    hidden
                    onChange={handleFileChange}
                    ref={openImageinput}
                  />
                </div>
                {errors[input.name] && (
                  <p className="text-red-500 text-sm mt-1">
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
          //Select Eelement
          //////////////////////

          if (input.fildType == "select-type") {
            return (
              <div
                key={index}
                className="w-full flex flex-col gap-3 px-2 py-4 shadow-lg rounded-lg border border-gray-300"
              >
                <label htmlFor={input.name} className="input-label">
                  {input.label["ar"]}
                </label>
                <select
                  onChange={handleChange}
                  name={input.name}
                  className="select-style"
                  value={
                    form[input.name] ??
                    (form[input.name] as string) ??
                    form[input.name]?.title_en ??
                    ""
                  }
                >
                  <option value="" disabled>
                    {"حدد أحد الإختيارات التالية : -"}
                  </option>
                  {input.selectItems &&
                    input.selectItems.map((item) => (
                      <option
                        key={item.value ?? item.name ?? item.id}
                        value={item.value ?? item.name ?? item.id}
                      >
                        {item.name ? item.name : item?.title_ar}
                      </option>
                    ))}
                </select>
                {errors[input.name] && (
                  <p className="text-red-500 text-sm mt-1">
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
          //select keywords
          //////////////////////
          if (input.fildType === "keywords") {
            return (
              <div
                key={index}
                className="h-fit w-full flex flex-col gap-3 mt-4 px-2 py-4 shadow-lg rounded-lg border border-gray-300"
              >
                <KeywordSelector
                  selectedKeywords={form.keywords || []}
                  setSelectedKeywords={handleKeywordsChange}
                />
              </div>
            );
          }

          //////////////////////
          // Generic Dynamic Array input
          //////////////////////

          if (input.fildType === "array") {
            return (
              <div
                key={index}
                className="h-fit w-full border border-gray-300 shadow px-2 py-4 rounded-lg flex flex-col gap-3"
              >
                <label className="input-label">{input.label.ar}</label>

                <div className="flex flex-col gap-2">
                  {Array.isArray(form[input.name]) &&
                  form[input.name].length > 0 ? (
                    form[input.name].map((item: any, idx: number) => (
                      <div
                        key={item.id || idx}
                        className="flex items-center shadow gap-2 p-2 rounded-md"
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
                          className="flex-1 border border-gray-300 focus:border-sky-300 duration-300 rounded p-2 outline-none"
                          placeholder={input.placeholder || ""}
                        />

                        {/* Remove button */}
                        <button
                          type="button"
                          onClick={() =>
                            handleArrayRemove(input.name, idx, form, setForm)
                          }
                          className="text-red-500 hover:text-red-700"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm mt-2">
                      ⚠️ القائمة لا تحتوي على بيانات
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
                    className="flex items-center gap-2 w-fit hover:scale-105 duration-300 hover:underline mt-3 p-2 rounded-2xl bg-primary text-white"
                  >
                    <FaPlus /> إضافة عنصر جديد
                  </button>
                </div>

                {/* Error message */}
                {errors[input.name] && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors[input.name][0]["ar"]}
                  </p>
                )}
              </div>
            );
          }

          return null;
        })}
        <input type="submit" value={submitValue} className="submit-btn" />
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
