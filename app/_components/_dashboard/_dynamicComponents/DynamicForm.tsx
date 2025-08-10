"use client";
import { instance } from "@/app/_helpers/axios";
import React, { useEffect, useRef, useState } from "react";
import { LuUserPen } from "react-icons/lu";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import SuccessAlart from "../../_popups/SuccessAlart";
import LoadingSpin from "../../LoadingSpin";
import { FaImage } from "react-icons/fa";
import { errorType, InputField } from "@/app/types/_dashboard/GlobalTypes";
import { getIconComponent } from "@/app/_helpers/helpers";
import Img from "../../_website/_global/Img";
import IconPicker from "../../_website/_global/IconPicker";

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

  const [form, setForm] = useState<any>({});
  const [errors, setErrors] = useState<errorType>({});
  const [successPopup, setSuccessPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState("");

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
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setForm({ ...form, image: files[0] });
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
      formData.append("author_id", "4");
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
    } catch (error) {
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
    } finally {
      setLoading(false);
    }
  };

  const handleCloseAlart = () => {
    setSuccessPopup(false);
  };

  const handleChangeIcon = (iconName: string) => {
    setSelectedIcon(iconName);
    setForm({ ...form, icon_name: iconName });
    setShowIconPicker(false);
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
          //Color  Fild
          //////////////////////

          if (input.fildType === "color-fild") {
            return (
              <div className="flex flex-col gap-3 " key={index}>
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
                    {errors[input.name]["ar"]}
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
                  className="input-style h-24"
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
                      className="w-60 h-60  rounded-full"
                    />
                  ) : (
                    <LuUserPen className="size-24 " />
                  )}
                  <input
                    type="file"
                    hidden
                    onChange={handleFileChange}
                    ref={openImageinput}
                  />
                  {errors[input.name] && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors[input.name]["ar"]}
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
                  className="w-72 min-h-60 overflow-hidden rounded-lg border border-gray-300 shadow-md hover:-translate-y-2 hover:bg-primary text-second_text hover:text-white hover:border-white duration-200 cursor-pointer  mx-auto  flex items-center justify-center "
                >
                  {form[input.name] instanceof File ? (
                    <Img
                      src={URL.createObjectURL(form[input.name] as Blob)}
                      className="w-full h-full  rounded-lg object-cover"
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
                    {errors[input.name]["ar"]}
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
                    {errors[input.name][0]["ar"]}
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
                  {form?.image instanceof File ? (
                    <Img
                      src={URL.createObjectURL(form?.image)}
                      className="w-full h-full  object-cover"
                    />
                  ) : form[input.name] ? (
                    <Img
                      src={form[input.name] ? form[input.name] : "/public"}
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
                    {errors[input.name]["ar"]}
                  </p>
                )}
              </div>
            );
          }

          //    if (input.fildType == "select-category") {
          //   return (
          //     <div key={index} className="w-full flex flex-col gap-2">
          //       <label htmlFor={input.name} className="input-label">
          //         {input.label["ar"]}
          //       </label>
          //       <select
          //         onChange={handleChange}
          //         name={input.name}
          //         className="select-style"
          //         value={
          //           form[input.name]
          //             ? (form[input.name] as string)
          //             : form[input.name]?.title_en || ""
          //         }
          //       >
          //         <option value="" disabled>
          //           {"حدد أحد الإختيارات التالية : -"}
          //         </option>
          //         {input.selectItems &&
          //           input.selectItems.map((item) => (
          //             <option
          //               key={item.name ? item.name : item.id}
          //               value={item.id}
          //             >
          //               {item.name ? item.name : item?.title_en}
          //             </option>
          //           ))}
          //       </select>
          //       {errors[input.name] && (
          //         <p className="text-red-500 text-sm mt-1">
          //           {errors[input.name]["ar"]}
          //         </p>
          //       )}
          //     </div>
          //   );
          // }

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
                        {item.name ? item.name : item?.title_ar}
                      </option>
                    ))}
                </select>
                {errors[input.name] && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors[input.name]["ar"]}
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
    </>
  );
}
