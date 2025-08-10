"use client";
import useFetchItem from "@/app/_helpers/FetchItemData";
import React, { useEffect, useRef, useState } from "react";
import LoadingSpin from "../../LoadingSpin";
import SuccessAlart from "../../_popups/SuccessAlart";
import ErrorAlart from "../../_popups/ErrorAlart";
import { FaImage } from "react-icons/fa";
import { errorType, InputField } from "@/app/types/_dashboard/GlobalTypes";
import { useRouter } from "next/navigation";
import { instance } from "@/app/_helpers/axios";
import { getIconComponent } from "@/app/_helpers/helpers";
import Img from "../../_website/_global/Img";
import IconPicker from "../../_website/_global/IconPicker";

interface props {
  api: string;
  updateEndPoint: string;
  id: number | string;
  inputsData: InputField[];
  direct: string;
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

  // Get The Data For The Item .

  const { data, loading } = useFetchItem(api, id, false);

  // States Lines For This Component.
  const [form, setForm] = useState<any>({});
  const [updatedData, setUpdatedData] = useState<Record<string, string | File>>(
    {}
  );
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [successPopup, setSuccessPopup] = useState(false);
  const [errorPopup, setErrorPopup] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState("");
  const [errors, setErrors] = useState<errorType>({});

  // Start Functions Lines

  // The Function For Update The Item Data .

  const handleSaveChanges = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form) return;

    try {
      setUpdateLoading(true);

      const formData = new FormData();

      // تعبئة formData من updatedData
      for (const key in updatedData) {
        const value = updatedData[key];

        // إذا كانت القيمة عبارة عن ملف
        if (value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, value ?? ""); // null/undefined safe
        }
      }

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
        setErrorMessage("Update failed");
        setErrorPopup(true);
      }
    } catch (error: any) {
      console.log(error);
      setErrorPopup(true);
      setErrorMessage(
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
    const { name, value } = e.target;

    setForm((prevForm: any) => ({
      ...prevForm,
      [name]: value,
    }));

    if (data && value !== data[name]) {
      setUpdatedData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    } else {
      setUpdatedData((prevData) => {
        const newData = { ...prevData };
        delete newData[name];
        return newData;
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setForm({ ...form, image: file });

      setUpdatedData((prevData) => ({
        ...prevData,
        image: file,
      }));
    }
  };

  const handleChangeIcon = (iconName: string) => {
    setSelectedIcon(iconName);
    setUpdatedData({ ...updatedData, icon_name: iconName });
    setForm({ ...updatedData, icon_name: iconName });
    setShowIconPicker(false);
  };

  //  End Functions Lines

  // Add The Data To The Form Object .

  useEffect(() => {
    if (data) {
      setForm(data);
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
                <div className="flex flex-col gap-3 " key={index}>
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
                <div className="flex flex-col gap-3 " key={index}>
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
                      <Img
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
            //Select Eelement
            //////////////////////

            if (input.fildType == "select-type") {
              return (
                <div key={index} className="w-full flex flex-col gap-2">
                  <label htmlFor={input.name} className="input-label">
                    {input.label["ar"]}
                  </label>
                  <select
                    onChange={handleChange}
                    name={input.name}
                    className="select-style"
                    value={
                      form[input.name]
                        ? (form[input.name] as string)
                        : form[input.name]?.title_en || ""
                    }
                  >
                    <option value="" disabled>
                      {"حدد أحد الإختيارات التالية : -"}
                    </option>
                    {input.selectItems &&
                      input.selectItems.map((item) => (
                        <option
                          key={item.name ? item.name : item.id}
                          value={item.name ? item.name : item.id}
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
      <ErrorAlart
        showAlart={errorPopup}
        onClose={() => setErrorPopup(false)}
        Message={errorMessage}
      />

      <IconPicker
        show={showIconPicker}
        onClose={() => setShowIconPicker(false)}
        selectedIcon={selectedIcon}
        onChange={handleChangeIcon}
      />
    </>
  );
}
