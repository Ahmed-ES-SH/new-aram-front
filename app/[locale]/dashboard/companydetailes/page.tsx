"use client";
import React, { useRef, useState, useEffect } from "react";
import { FaPlusCircle } from "react-icons/fa";
import { instance } from "@/app/_helpers/axios";
import LoadingSpin from "@/app/_components/LoadingSpin";
import Img from "@/app/_components/_website/_global/Img";
import EditVideo from "@/app/_components/_dashboard/_editherovideosection/EditVideo";
import { VscLoading } from "react-icons/vsc";
import { toast } from "sonner";

interface SectionData {
  id: string;
  title: string;
  placeholder: string;
  contentEn: string;
  contentAr: string;
  titleEn: string;
  titleAr: string;
  image: File | string | null;
  ref: React.RefObject<HTMLInputElement | null>;
}

export default function CompanyDetails() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(true);
  const [generalError, setGeneralError] = useState<string>("");
  const [mainVideo, setMainVideo] = useState<any>(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const initialSections: SectionData[] = [
    {
      id: "first_section",
      title: "القسم الأول",
      placeholder: "القسم الأول",
      titleEn: "",
      titleAr: "",
      contentEn: "",
      contentAr: "",
      image: null,
      ref: useRef<HTMLInputElement>(null),
    },
    {
      id: "second_section",
      title: "القسم الثانى",
      placeholder: "القسم الثانى",
      titleEn: "",
      titleAr: "",
      contentEn: "",
      contentAr: "",
      image: null,
      ref: useRef<HTMLInputElement>(null),
    },
    {
      id: "thired_section",
      title: "القسم الثالث",
      placeholder: "القسم الثالث",
      titleEn: "",
      titleAr: "",
      contentEn: "",
      contentAr: "",
      image: null,
      ref: useRef<HTMLInputElement>(null),
    },
    {
      id: "fourth_section",
      title: "القسم الرابع",
      placeholder: "القسم الرابع",
      titleEn: "",
      titleAr: "",
      contentEn: "",
      contentAr: "",
      image: null,
      ref: useRef<HTMLInputElement>(null),
    },
  ];

  const [sections, setSections] = useState(initialSections);
  const [cooperationPdf, setCooperationPdf] = useState<string | null | File>(
    null
  );

  // Fetch data from the server
  const fetchData = async () => {
    try {
      const response = await instance.get("/details");
      const data = response.data.data;

      const updatedSections = sections.map((section) => ({
        ...section,
        contentEn: data[`${section.id}_contnet_en`] || "",
        contentAr: data[`${section.id}_contnet_ar`] || "",
        titleAr: data[`${section.id}_title_ar`] || "",
        titleEn: data[`${section.id}_title_en`] || "",
        image: data[`${section.id}_image`] || null,
      }));
      setCooperationPdf(data.cooperation_pdf);
      setSections(updatedSections);
      setMainVideo(data.main_video);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle input changes
  const handleTextChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
    sectionId: string
  ) => {
    const { name, value } = e.target;
    setSections((prevSections) =>
      prevSections.map((section: any) =>
        section.id === sectionId && section[name] !== value
          ? { ...section, [name]: value }
          : section
      )
    );
  };

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    sectionId: string
  ) => {
    const files = e.target.files;
    if (files && files[0]) {
      setSections((prevSections) =>
        prevSections.map((section) =>
          section.id === sectionId ? { ...section, image: files[0] } : section
        )
      );
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const fileURL = e.target.files[0];
      setCooperationPdf(fileURL);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setUpdateLoading(true);
      const formData = new FormData();
      if (Array.isArray(sections)) {
        sections.forEach((section) => {
          formData.append(`${section.id}_content_en`, section.contentEn);
          formData.append(`${section.id}_content_ar`, section.contentAr);
          formData.append(`${section.id}_title_en`, section.titleEn);
          formData.append(`${section.id}_title_ar`, section.titleAr);
          if (section.image instanceof File) {
            formData.append(`${section.id}_image`, section.image);
          }
        });
      }
      if (mainVideo) formData.append("main_video", mainVideo);
      if (cooperationPdf) {
        formData.append("cooperation_pdf", cooperationPdf);
      }
      const response = await instance.post(`/update-details`, formData);
      if (response.status === 200) {
        toast.success("تم تحديث بيانات صفحة عن المنصة بنجاح .");
      }
    } catch (error: any) {
      console.log(error);
      const message =
        error?.response?.data?.message || "حدث خطأ أثناء تحديث بيانات الصفحة";
      toast.error(message);
      setGeneralError("حدث خطأ أثناء حفظ البيانات");
    } finally {
      setUpdateLoading(false);
    }
  };

  if (loading) return <LoadingSpin />;

  return (
    <>
      <div style={{ direction: "rtl" }} className="w-full  pb-6">
        <h1 className="text-xl w-fit mx-auto font-semibold text-center pb-4 border-b-2 border-sky-400 ">
          المحتوى الخاص بصفحة عن الشركة
        </h1>
        <form onSubmit={handleSubmit} className="w-[90%] mx-auto">
          {/* video section */}

          <div className="pb-4 border-b-2 border-sky-500 my-2 w-full">
            <div className="w-full">
              <label className="block text-gray-600 font-medium mb-2">
                {mainVideo instanceof File
                  ? `اسم الملف الخاص بالفديو :`
                  : " رابط الفيديو الحالى"}
              </label>{" "}
              <div className="flex flex-col gap-3 w-full">
                <input
                  type="text"
                  value={
                    mainVideo instanceof File
                      ? mainVideo.name
                      : (mainVideo as string)
                  }
                  readOnly={true}
                  className="p-2 bg-gray-100 w-full rounded-md"
                />
              </div>
            </div>
            <EditVideo mainVideo={mainVideo} setMainVideo={setMainVideo} />
          </div>

          <div className="w-full my-4 pb-3 border-b-2 border-sky-500">
            <h1 className="text-xl w-fit mx-auto font-semibold text-center pb-4">
              التحكم فى ملف اتفاقية التعاون للمنصة
            </h1>

            {/* Container */}
            <div className="flex justify-center">
              {cooperationPdf ? (
                // Show existing PDF
                <div
                  className="relative w-64 h-80 border border-gray-300 rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition"
                  onClick={handleUploadClick}
                >
                  <iframe
                    src={URL.createObjectURL(cooperationPdf as File)}
                    className="w-full h-full"
                    title="Cooperation PDF"
                  />
                  <div className="absolute bottom-2 left-2 right-2 bg-white bg-opacity-80 p-1 text-center text-sm rounded">
                    اضغط لتغيير الملف
                  </div>
                </div>
              ) : (
                // Show placeholder if no file
                <div
                  onClick={handleUploadClick}
                  className="w-64 h-80 border-2 border-dashed border-sky-500 flex flex-col justify-center items-center rounded-lg cursor-pointer hover:bg-sky-50 transition"
                >
                  <p className="text-sky-500 font-medium text-center">
                    اضغط لإضافة ملف PDF
                  </p>
                </div>
              )}
            </div>

            {/* Hidden File Input */}
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="application/pdf"
              onChange={handleFileChange}
            />
          </div>

          {sections.map((section) => (
            <div
              key={section.id}
              className="w-full pb-4 border-b-2 border-sky-500 my-2 flex items-center justify-between max-lg:flex-col gap-4"
            >
              <div className="w-1/2 max-lg:w-full max-lg:px-2 space-y-4">
                <div className="flex flex-col items-start gap-1">
                  <label className="text-[18px] py-2  pb-2 border-b border-b-primary w-fit mb-1">
                    {section.title}
                  </label>
                  <input
                    type="text"
                    value={section.titleEn}
                    name="titleEn"
                    onChange={(e) => handleTextChange(e, section.id)}
                    className="w-full  px-4 outline-none  py-2 border border-gray-200 focus:border-primary duration-300 rounded-md"
                  />
                  <textarea
                    name="contentEn"
                    value={section.contentEn}
                    onChange={(e) => handleTextChange(e, section.id)}
                    className="w-full h-32 px-4 outline-none  border-gray-200 focus:border-primary duration-300 mt-2  py-2 border rounded-md"
                  />
                </div>
                <div className="flex flex-col items-start gap-1">
                  <label className="text-[18px] py-2  pb-2 border-b border-b-primary w-fit mb-1">
                    {section.title} (عربى)
                  </label>
                  <input
                    type="text"
                    value={section.titleAr}
                    name="titleAr"
                    onChange={(e) => handleTextChange(e, section.id)}
                    className="w-full  px-4 outline-none  py-2 border border-gray-200 focus:border-primary duration-300 rounded-md"
                  />
                  <textarea
                    name="contentAr"
                    value={section.contentAr}
                    onChange={(e) => handleTextChange(e, section.id)}
                    className="w-full h-32 px-4 outline-none  border-gray-200 focus:border-primary duration-300  py-2 border rounded-md mt-2"
                  />
                </div>
              </div>
              <div
                className="cursor-pointer flex justify-center w-1/2 "
                onClick={() => section.ref.current?.click()}
              >
                {section.image ? (
                  <Img
                    src={
                      typeof section.image === "string"
                        ? section.image
                        : URL.createObjectURL(section.image)
                    }
                    className="w-96 object-cover"
                  />
                ) : (
                  <FaPlusCircle className="text-sky-400 text-4xl" />
                )}
              </div>
              <input
                type="file"
                ref={section.ref}
                className="hidden"
                onChange={(e) => handleImageChange(e, section.id)}
                accept="image/*"
              />
            </div>
          ))}
          <button
            type="submit"
            className="bg-blue-500 text-white flex items-center justify-center py-2 px-4 w-full rounded mt-4"
          >
            {updateLoading ? (
              <VscLoading className="size-6 animate-spin" />
            ) : (
              " حفظ"
            )}
          </button>

          {generalError && <p className="text-red-500">{generalError}</p>}
        </form>
      </div>
    </>
  );
}
