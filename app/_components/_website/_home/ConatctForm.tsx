"use client";
import { instance } from "@/app/_helpers/axios";
import { directionMap } from "@/app/constants/_website/global";
import { useLocale, useTranslations } from "next-intl";
import React, { useState } from "react";
import { VscLoading } from "react-icons/vsc";
import { toast } from "sonner";

interface formType {
  name: string;
  email: string;
  phone: string;
  message: string;
}

interface errorType {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
}

export default function ContactForm() {
  const locale = useLocale();
  const t = useTranslations();

  const [form, setform] = useState<formType>({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [errors, setErrors] = useState<errorType>({});
  const [loading, setloading] = useState<boolean>(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setform((prev) => ({ ...prev, [name]: value }));
  };

  // Validation function
  const validateForm = () => {
    const newErrors: errorType = {};

    if (!form.name.trim()) {
      newErrors.name = t("contactErrors.name_required");
    }
    if (!form.email.trim()) {
      newErrors.email = t("contactErrors.email_required");
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = t("contactErrors.email_invalid");
    }
    if (!form.phone.trim()) {
      newErrors.phone = t("contactErrors.phone_required");
    }
    if (!form.message.trim()) {
      newErrors.message = t("contactErrors.message_required");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error(t("contactErrors.form_invalid")); // general error toast
      return;
    }

    try {
      setloading(true);
      const formdata = new FormData();
      formdata.append("name", form.name);
      formdata.append("email", form.email);
      formdata.append("phone_number", form.phone);
      formdata.append("message", form.message);
      const response = await instance.post("/add-contact-message", formdata);
      if (response.status == 201) {
        toast.success(t("success_message"));
        setform({
          name: "",
          email: "",
          phone: "",
          message: "",
        });
      }
    } catch (error: any) {
      console.log(error);
      toast.error(t("contactErrors.server_error"));
    } finally {
      setloading(false);
    }
  };

  return (
    <>
      <section className="bg-gray-50" dir={directionMap[locale]}>
        <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-x-16 gap-y-8 lg:grid-cols-5">
            {/* الجانب النصي */}
            <div className="lg:col-span-2 lg:py-12 ">
              <h2 className="text-2xl font-bold text-gray-800  pb-2 border-b border-b-main_red">
                {t("contact.title")}
              </h2>
              <p className="mt-4 text-gray-600">{t("contact.description")}</p>
            </div>

            {/* نموذج الاتصال */}
            <div className="rounded-lg bg-white  p-8 shadow-lg lg:col-span-3 lg:p-12">
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label className="sr-only" htmlFor="name">
                    {t("contact.form.name")}
                  </label>
                  <input
                    className="w-full rounded-lg border-gray-400 border outline-none p-3 text-sm"
                    placeholder={t("contact.form.name")}
                    type="text"
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="sr-only" htmlFor="email">
                      {t("contact.form.email")}
                    </label>
                    <input
                      className="w-full rounded-lg border-gray-400 border outline-none p-3 text-sm"
                      placeholder={t("contact.form.email_placeholder")}
                      type="email"
                      id="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="sr-only" htmlFor="phone">
                      {t("contact.form.phone")}
                    </label>
                    <input
                      className="w-full rounded-lg border-gray-400 border outline-none p-3 text-sm"
                      placeholder={t("contact.form.phone_placeholder")}
                      type="tel"
                      id="phone"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.phone}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="sr-only" htmlFor="message">
                    {t("contact.form.message")}
                  </label>
                  <textarea
                    className="w-full rounded-lg border-gray-400 border outline-none p-3 h-[20vh] text-sm"
                    placeholder={t("contact.form.message")}
                    id="message"
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                  ></textarea>
                  {errors.message && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.message}
                    </p>
                  )}
                </div>

                <div className="mt-4">
                  <button
                    type="submit"
                    className=" flex items-center justify-center w-full rounded-lg bg-black px-5 py-3 font-medium text-white sm:w-auto"
                  >
                    {loading ? (
                      <VscLoading className="animate-spin" />
                    ) : (
                      t("contact.form.submit")
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
