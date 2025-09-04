"use client";
import { Slide } from "@/app/_components/_dashboard/_slides/SlideDashCard";
import Img from "@/app/_components/_website/_global/Img";
import LocaleLink from "@/app/_components/_website/_global/LocaleLink";
import LoadingSpin from "@/app/_components/LoadingSpin";
import { instance } from "@/app/_helpers/axios";
import useFetchData from "@/app/_helpers/FetchDataWithAxios";
import { useParams, useRouter } from "next/navigation";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { VscLoading } from "react-icons/vsc";
import { toast } from "sonner";

export default function EditSlidePage() {
  const imageRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const params = useParams();

  const slideId = params.slideId;

  const { data, loading } = useFetchData<Slide>(`/get-slide/${slideId}`, false);

  const [form, setForm] = useState<Omit<Slide, "created_at" | "updated_at">>({
    id: 0,
    image: "",
    title: { ar: "", en: "" },
    description: { ar: "", en: "" },
    circle_1_color: "",
    circle_2_color: "",
    status: "",
  });
  const [image, setImage] = useState<File | string>("");
  const [updateLoading, setUpdateLoading] = useState(false);

  // handle input change
  const handleChange = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleNestedChange = (
    field: "title" | "description",
    lang: "ar" | "en",
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: { ...prev[field], [lang]: value },
    }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setImage(files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setUpdateLoading(true);
      const formData = new FormData();
      formData.append("title", JSON.stringify(form.title));
      formData.append("description", JSON.stringify(form.description));
      formData.append("circle_1_color", form.circle_1_color);
      formData.append("circle_2_color", form.circle_2_color);
      formData.append("status", form.status);
      if (image instanceof File) formData.append("image", image);
      const response = await instance.post(
        `/update-slide/${form.id}`,
        formData
      );
      if (response.status == 200) {
        toast.success("تم تحديث بيانات الشريحة بنجاح .");
        setTimeout(() => {
          router.push(`/dashboard/slidescontrol`);
        }, 300);
      }
    } catch (error: any) {
      console.log(error);
      const message =
        error?.response?.data?.message || "حدث خطا أثناء تحديث بيانات الشريحة";
      toast.error(message);
    } finally {
      setUpdateLoading(false);
    }
  };

  useEffect(() => {
    if (data) {
      setForm({
        id: data.id,
        image: data.image,
        title: { ...data.title },
        description: { ...data.description },
        circle_1_color: data.circle_1_color,
        circle_2_color: data.circle_2_color,
        status: data.status,
      });
      setImage(data.image);
    }
  }, [data]);

  if (loading) return <LoadingSpin />;

  return (
    <div
      dir="rtl"
      className="w-full lg:w-[95%] xl:w-[90%] mx-auto min-h-screen flex items-center justify-center"
    >
      <form
        onSubmit={handleSubmit}
        className="space-y-4 p-4 border border-gray-300 rounded-lg shadow bg-white w-full"
      >
        <h1 className="my-4 pb-3 w-fit mx-auto border-b border-primary">
          تعديل بيانات الشريحة
        </h1>
        {/* Image */}
        <div>
          <label className="block mb-2 font-medium">صورة الشريحة</label>
          <input
            ref={imageRef}
            type="file"
            hidden
            onChange={handleImageChange}
            className="w-full border border-gray-300 p-2 rounded"
          />

          <div
            onClick={() => imageRef.current?.click()}
            className="xl:w-1/2 lg:w-3/4 cursor-pointer duration-200 min-h-72 border border-gray-300 hover:bg-primary rounded-md relative my-3"
          >
            <Img
              src={image instanceof File ? URL.createObjectURL(image) : image}
              className="w-full h-full rounded-md object-cover absolute top-0 left-0"
            />
          </div>
        </div>

        {/* Titles */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 font-medium">العنوان بالعربية</label>
            <input
              type="text"
              value={form.title.ar}
              onChange={(e) =>
                handleNestedChange("title", "ar", e.target.value)
              }
              className="w-full border border-gray-300 p-2 rounded"
            />
          </div>
          <div>
            <label className="block mb-2 font-medium">العنوان بالانجلزية</label>
            <input
              type="text"
              value={form.title.en}
              onChange={(e) =>
                handleNestedChange("title", "en", e.target.value)
              }
              className="w-full border border-gray-300 p-2 rounded"
            />
          </div>
        </div>

        {/* Descriptions */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 font-medium">الوصف بالعربية</label>
            <textarea
              value={form.description.ar}
              onChange={(e) =>
                handleNestedChange("description", "ar", e.target.value)
              }
              className="w-full border border-gray-300 p-2 rounded"
            />
          </div>
          <div>
            <label className="block mb-2 font-medium">الوصف بالعربية</label>
            <textarea
              value={form.description.en}
              onChange={(e) =>
                handleNestedChange("description", "en", e.target.value)
              }
              className="w-full border border-gray-300 p-2 rounded"
            />
          </div>
        </div>

        {/* Colors */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 font-medium">
              اللون الخاص بالدائرة 1
            </label>
            <input
              type="color"
              value={form.circle_1_color}
              onChange={(e) => handleChange("circle_1_color", e.target.value)}
              className="w-full h-10 border border-gray-300 p-1 rounded"
            />
          </div>
          <div>
            <label className="block mb-2 font-medium">
              اللون الخاص بالدائرة 2
            </label>
            <input
              type="color"
              value={form.circle_2_color}
              onChange={(e) => handleChange("circle_2_color", e.target.value)}
              className="w-full h-10 border border-gray-300 p-1 rounded"
            />
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="block mb-2 font-medium">الحالة</label>
          <select
            value={form.status}
            onChange={(e) =>
              handleChange("status", e.target.value as "active" | "inactive")
            }
            className="w-full border outline-none border-gray-300 p-2 rounded"
          >
            <option value="active">فعال</option>
            <option value="inactive">غير فعال</option>
          </select>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2">
          {
            <LocaleLink href={`/dashboard/slidescontrol`}>
              <button
                type="button"
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                إلغاء
              </button>
            </LocaleLink>
          }
          <button
            type="submit"
            className="px-4 py-2 flex items-center justify-center bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {updateLoading ? <VscLoading className=" animate-spin" /> : "حفظ"}
          </button>
        </div>
      </form>
    </div>
  );
}
