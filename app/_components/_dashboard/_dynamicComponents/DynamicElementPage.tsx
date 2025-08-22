"use client";
import useFetchItem from "@/app/_helpers/FetchItemData";
import React, { useEffect, useRef, useState } from "react";
import SuccessAlart from "../../_popups/SuccessAlart";
import { FaImage, FaPlus, FaTrash } from "react-icons/fa";
import { errorType, InputField } from "@/app/types/_dashboard/GlobalTypes";
import { useRouter } from "next/navigation";
import { instance } from "@/app/_helpers/axios";
import { getIconComponent } from "@/app/_helpers/helpers";
import IconPicker from "../../_website/_global/IconPicker";
import { Keyword } from "../_cards/types";
import KeywordSelector from "../../_website/_global/KeywordSelector";
import LoadingSpin from "../../LoadingSpin";
import { toast } from "sonner";
import Img from "../../_website/_global/Img";
import SubCategoryMultiSelect from "../_organizations/SubCategoryMultiSelect";
import Image from "next/image";
import MapSelector from "../../_maps/MapSelector";
import ServiceImages from "../_services/ServiceImages";

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
  const [location, setLocation] = useState<Location>({
    address: "",
    coordinates: {
      lat: 0,
      lng: 0,
    },
  });
  const [errors, setErrors] = useState<errorType>({});

  // Start Functions Lines

  // The Function For Update The Item Data .

  const handleSaveChanges = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form) return;

    try {
      setUpdateLoading(true);

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

      if (location) formData.append("location", JSON.stringify(location));
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

  if (loading || updateLoading) return <LoadingSpin />;

  return (
    <>
      <div className="w-full mt-10">
        <form
          onSubmit={handleSaveChanges}
          style={{ direction: "rtl" }}
          className="w-[98%] h-fit  mx-auto max-md:w-[96%] mt-2 flex flex-col gap-3"
        >
          {inputsData.map((input, index) => {
            //////////////////////
            //Normal input
            //////////////////////

            if (input.fildType == "short-text") {
              return (
                <div
                  className="flex flex-col gap-3 border border-gray-300 rounded-lg shadow-lg py-4 px-2"
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
                    className="input-style read-only:bg-gray-100 read-only:focus:outline-gray-100"
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
                      {errors[input.name][0]["ar"]}
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
                      {errors[input.name][0]["ar"]}
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
                <div
                  key={index}
                  className="h-fit w-full flex flex-col gap-3 px-2 py-4 shadow-lg rounded-lg border border-gray-300"
                >
                  <label className="input-label">{input.label.ar}</label>
                  <input
                    name={input.name || ""}
                    type="date"
                    value={form[input.name] || ""}
                    onChange={handleChange}
                    placeholder={input.placeholder || ""}
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
                    className="input-style h-52"
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
                      <Img
                        src={URL.createObjectURL(form[input.name] as Blob)}
                        className="w-full h-full object-cover  rounded-full"
                      />
                    ) : form[input.name] ? (
                      <Img
                        src={form[input.name] as string}
                        className="w-full h-full object-cover rounded-full"
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
                    {errors[input.name] && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors[input.name][0]["ar"]}
                      </p>
                    )}
                  </div>
                </div>
              );
            }

            //////////////////////
            //Color  Fild
            //////////////////////

            if (input.fildType === "color-fild") {
              return (
                <div className="flex flex-col gap-3" key={index}>
                  <label htmlFor={input.name} className="input-label">
                    {input.label["ar"]}
                  </label>
                  <input
                    name={input.name}
                    type="color"
                    value={(form[input.name] as string) || "#000000"}
                    onChange={handleChange}
                    className="w-16 h-10 p-0 border-0 cursor-pointer"
                  />
                  {errors[input.name] && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors[input.name]["ar"]}
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
                <div
                  key={index}
                  className="flex flex-col gap-2 items-start w-fit ml-auto"
                >
                  <label htmlFor={input.name} className="input-label">
                    {input.label["ar"]}
                  </label>
                  <div
                    onClick={() => openImageinput.current?.click()}
                    className="w-72 h-60 p-4 overflow-hidden rounded-lg shadow  border-gray-300  hover:-translate-y-2 hover:bg-primary text-second_text hover:text-white hover:border-white duration-200 cursor-pointer  mx-auto border  border-second_text flex items-center justify-center "
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
                      {errors[input.name][0]["ar"]}
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
                      <Img
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
                      {errors[input.name][0]["ar"]}
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
                <div key={index} className="h-fit w-full flex flex-col gap-3">
                  <label className="input-label">{input.label.ar}</label>
                  <div
                    onClick={() => openImageinput.current?.click()}
                    className="w-full h-96  shadow-md border-dashed overflow-hidden rounded-sm  hover:-translate-y-2 hover:bg-primary text-second_text hover:text-white hover:border-white duration-200 cursor-pointer  mx-auto border  border-second_text flex items-center justify-center "
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
                      {errors[input.name][0]["ar"]}
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
                <div className="flex flex-col gap-3 w-fit ml-auto" key={index}>
                  <label htmlFor={input.name} className="input-label">
                    {input.label["ar"]}
                  </label>
                  <div
                    onClick={() => setShowIconPicker(true)}
                    className="shadow w-72 h-60 flex items-center justify-center rounded-lg border border-gray-300 p-2 text-primary hover:bg-primary hover:text-white duration-300"
                  >
                    <Icon className="size-32 cursor-pointer select-effect" />
                  </div>
                  {errors[input.name] && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors[input.name][0]["ar"]}
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
                  className="w-full px-2 py-4 shadow-lg rounded-lg border border-gray-300"
                >
                  <KeywordSelector
                    selectedKeywords={form.keywords || []}
                    setSelectedKeywords={handleKeywordsChange}
                  />
                </div>
              );
            }

            //////////////////////
            //images section
            //////////////////////

            if (input.fildType == "images-section") {
              return (
                <div
                  className="w-full border border-gray-300 shadow-lg rounded-lg px-2 py-4"
                  key={index}
                >
                  <ServiceImages
                    images={form?.images ? form?.images : null}
                    errors={errors}
                  />
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
                    setUpdatedData={setUpdatedData}
                    currentSubCategories={
                      form.sub_categories ? form.sub_categories : []
                    }
                    mode="update"
                  />
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
                      value={(location.address as string) || ""}
                      onChange={handleChange}
                      className="input-style read-only:bg-gray-100 read-only:focus:outline-gray-100"
                      readOnly={input.readOnly}
                    />
                    <span
                      onClick={() => setShowMap(true)}
                      className="underline text-red-400 mt-2 w-fit mr-auto block cursor-pointer hover:text-red-600 duration-150"
                    >
                      إستعراض العنوان على الخريطة
                    </span>
                  </div>
                  {errors[input.name] && (
                    <p className="text-red-500 text-sm mt-1">
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
                          {item.name ? item.name : item?.title_en}
                        </option>
                      ))}
                  </select>
                  {errors[input.name] && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors[input.name][0]["ar"]}
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
                <div
                  key={index}
                  className="h-fit w-full flex flex-col gap-3 mt-4 px-2 py-4 shadow-lg rounded-lg border border-gray-300"
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
          <input type="submit" value={"حفظ"} className="submit-btn" />
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
        setLocation={setLocation}
        initialLocation={location}
        showMap={showMap}
        onClose={() => setShowMap(false)}
      />
    </>
  );
}
