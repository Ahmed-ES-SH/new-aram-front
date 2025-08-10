"use client";
import React, { useRef, useState, useEffect } from "react";
import {
  FaFileVideo,
  FaPlusCircle,
  FaTimes,
  FaTrash,
  FaVideo,
  FaYoutube,
} from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";
import { instance } from "@/app/_helpers/axios";
import LoadingSpin from "@/app/_components/LoadingSpin";
import SuccessAlart from "@/app/_components/_popups/SuccessAlart";
import Img from "@/app/_components/_website/_global/Img";

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
  const chossevideoref = useRef<any>(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [typevideopopup, settypevideopopup] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [linkpopup, setlinkpopup] = useState(false);
  const [generalError, setGeneralError] = useState<string>("");
  const [linkVideo, setLinkVideo] = useState<string>("");
  const [video, setVideo] = useState<any>(null);
  const [filePopup, setFilePopup] = useState<boolean>(false);

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

      setSections(updatedSections);
      setVideo(data.main_video);
      setLinkVideo(data.link_video);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const onchangevideo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setVideo(files[0]);
      setLinkVideo("");
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
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
      const response = await instance.post(`/update-details`, formData);
      if (response.status === 200) {
        setIsPopupVisible(true);
      }
    } catch (error: unknown) {
      setGeneralError("حدث خطأ أثناء حفظ البيانات");
      console.log(error);
    }
  };

  const handleadddfile = () => {
    setFilePopup(true);
    settypevideopopup(false);
  };
  const handleaddlink = () => {
    setlinkpopup(true);
    settypevideopopup(false);
  };

  const handleUpdateLinkVideo = async () => {
    try {
      setGeneralError("");
      if (linkVideo.length <= 0) {
        setGeneralError(
          "لا يمكن استخدام محوى فارغ تأكد من وضع رابط يوتيوب صالح ."
        );
        return;
      }
      const videoIdMatch = linkVideo.match(
        /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
      );
      if (!videoIdMatch) {
        setGeneralError("رابط يوتيوب غير صالح");
        return;
      }
      const videoId = videoIdMatch[1];
      const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&playsinline=1&loop=1&playlist=${videoId}&fs=0`;
      const response = await instance.post(`/update-details`, {
        link_video: embedUrl,
        main_video: "",
      });
      if (response.status === 200) {
        const data = response.data.data;
        setVideo(null);
        setLinkVideo(data.link_video);
        setlinkpopup(false);
        setIsPopupVisible(true);
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  const handleUpdateMainVideo = async () => {
    try {
      setGeneralError("");
      if (!video) {
        setGeneralError("قم بتحديد ملف فيديو صالح للاستخدام");
        return;
      }
      setLoading(true);
      const formData = new FormData();
      formData.append("main_video", video);
      formData.append("link_video", "");
      const response = await instance.post(`/update-details`, formData);
      if (response.status === 200) {
        const data = response.data.data;
        setVideo(data.main_video);
        setLinkVideo("");
        setFilePopup(false);
        setIsPopupVisible(true);
      }
    } catch (error: any) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handlecloseFilePopup = () => {
    setFilePopup(false);
    settypevideopopup(false);
    setVideo(null);
  };

  if (loading) return <LoadingSpin />;

  return (
    <>
      <div style={{ direction: "rtl" }} className="w-full  pb-6">
        <h1 className="text-xl w-fit mx-auto font-semibold text-center pb-4 border-b-2 border-sky-400 ">
          المحتوى الخاص بصفحة عن الشركة
        </h1>
        <form onSubmit={handleSubmit} className="w-[90%] mx-auto">
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
          {/* قسم الفيديو الرئيسي */}
          <div className="w-full my-4">
            <h2 className="text-lg font-semibold  pb-2 ">الفيديو الرئيسي</h2>
            <div className="flex flex-col gap-2 w-full">
              <input
                type="file"
                onChange={onchangevideo}
                ref={chossevideoref}
                className="peer hidden border-none px-4 h-[40px] bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0"
                placeholder="Username"
              />
            </div>
          </div>
          <div
            onClick={() => settypevideopopup(true)}
            className="w-full h-[10vh] flex hover:bg-black/70 hover:text-white items-center border border-gray-300 group cursor-pointer rounded-md shadow-md hover:shadow-main_orange duration-150  my-2 justify-center "
          >
            <div className="flex flex-col items-center gap-2 group-hover:scale-110 duration-150   ">
              <FaVideo />
              <p>تغيير الفيديو الرئيسي</p>
            </div>
          </div>
          <div className="w-full min-h-screen rounded-md shadow-md relative overflow-hidden">
            {linkVideo && (
              <iframe
                src={linkVideo}
                allow="autoplay; encrypted-media"
                frameBorder="0"
                allowFullScreen
                className="w-full h-screen overflow-hidden"
              ></iframe>
            )}
            {video && (
              <video
                className="absolute top-0 left-0 w-full h-full object-cover"
                src={video instanceof File ? URL.createObjectURL(video) : video}
                autoPlay
                loop
                muted
                playsInline
              ></video>
            )}
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 w-full rounded mt-4"
          >
            حفظ
          </button>
          <SuccessAlart
            showAlart={isPopupVisible}
            Message="تمت العملية بنجاح!"
            onClose={() => setIsPopupVisible(false)}
          />
          {generalError && <p className="text-red-500">{generalError}</p>}
        </form>
      </div>
      <AnimatePresence>
        {typevideopopup && (
          <motion.div
            initial={{ opacity: 0, y: -200 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ y: -200, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[999999999999999999] flex items-center justify-center bg-black/50 backdrop-blur-lg bg-opacity-50"
          >
            <div className="bg-white dark:bg-secend_dash rounded-lg shadow-lg w-[90%] max-w-md p-6">
              <h2 className="text-xl font-semibold text-center mb-4 ">
                إختر نوع البيانات
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {/* خيار رفع ملف */}
                <div
                  onClick={handleadddfile}
                  className="flex flex-col items-center justify-center border border-gray-400 p-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-secend_text dark:bg-main_dash dark:border-gray-700 cursor-pointer transition"
                >
                  <FaVideo className="size-12 text-primary" />
                  <p className="text-gray-700 dark:text-secend_text font-medium">
                    ملف فيديو
                  </p>
                </div>
                {/* خيار إضافة رابط */}
                <div
                  onClick={handleaddlink}
                  className="flex flex-col items-center justify-center border border-gray-400 p-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-secend_text dark:bg-main_dash dark:border-gray-700 cursor-pointer transition"
                >
                  <FaYoutube className="size-12 text-red-400" />
                  <p className="text-gray-700 dark:text-secend_text font-medium">
                    رابط فيديو
                  </p>
                </div>
              </div>
              <button
                onClick={() => settypevideopopup(false)}
                className="mt-6 w-full bg-primary text-white py-2 rounded-lg hover:bg-sky-600 transition"
              >
                إغلاق
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {linkpopup && (
        <motion.div
          initial={{ opacity: 0, y: -200 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ y: -200, opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed w-full min-h-screen inset-0 z-[999999999] flex items-center justify-center bg-black/50  backdrop-blur-lg"
        >
          <div className="bg-white relative overflow-hidden dark:bg-main_dash rounded-lg shadow-lg w-1/2 max-md:w-[90%] max-lg:w-3/4  p-6">
            <h2 className="text-xl font-semibold text-center mb-4 ">
              أضف الرابط
            </h2>
            <form className="w-full flex flex-col items-center justify-center">
              <input
                name="link_video"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setLinkVideo(e.target.value)
                }
                type="text"
                className="input-style"
              />
              <div
                onClick={handleUpdateLinkVideo}
                className="w-1/2 cursor-pointer mt-6 max-lg:w-[95%] p-2 text-white rounded-md text-center bg-primary"
              >
                حفظ
              </div>
            </form>
            {generalError && (
              <p className="text-red-500 block pt-2 text-center">
                {generalError}
              </p>
            )}
            <button
              onClick={() => setlinkpopup(false)}
              className="px-2 absolute top-2 left-4 w-fit bg-red-400 text-white py-2 rounded-lg hover:bg-orange-600 transition"
            >
              <FaTimes />
            </button>
          </div>
        </motion.div>
      )}
      {filePopup && (
        <motion.div
          initial={{ opacity: 0, y: -200 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ y: -200, opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed w-full min-h-screen inset-0 z-[999999999] flex items-center justify-center bg-black bg-opacity-50"
        >
          <div className="bg-white relative overflow-hidden dark:bg-main_dash rounded-lg shadow-lgw-[90%] w-3/4  p-6">
            <h2 className="text-xl pb-2 border-b border-main_orange w-fit mx-auto font-semibold text-center mb-4 ">
              حدد ملف الفيديو
            </h2>
            <div className="w-full min-h-[70vh] relative flex items-center justify-center rounded-md">
              {video instanceof File ? (
                <video
                  autoPlay
                  loop
                  controls
                  src={URL.createObjectURL(video)}
                  className="w-full h-full absolute inset-0"
                />
              ) : (
                <div
                  onClick={() => chossevideoref.current.click()}
                  className="w-full h-[70vh] flex items-center justify-center cursor-pointer hover:bg-orange-50 duration-150"
                >
                  <FaFileVideo className="size-32 text-main_orange" />
                </div>
              )}
            </div>
            <div className="flex items-center mt-6 gap-2 w-fit mx-auto">
              <div
                onClick={handleUpdateMainVideo}
                className="w-[250px] cursor-pointer  max-lg:w-[95%] p-2 text-white rounded-md text-center bg-primary"
              >
                حفظ
              </div>
              {video instanceof File && (
                <button
                  onClick={() => setVideo("")}
                  className="flex p-2 rounded-md shadow-md hover:scale-105 hover:bg-white hover:border-red-400 borer border-transparent hover:text-black text-white duration-150   bg-red-400 items-center justify-center"
                >
                  <FaTrash className=" text-lg " />
                </button>
              )}
            </div>
            {generalError && (
              <p className="text-red-500 block pt-2 text-center">
                {generalError}
              </p>
            )}
            <button
              onClick={handlecloseFilePopup}
              className="px-2 absolute top-2 left-4 w-fit bg-primary duration-200 text-white py-2 rounded-lg hover:bg-orange-600 hover:scale-105 transition"
            >
              <FaTimes />
            </button>
          </div>
        </motion.div>
      )}
    </>
  );
}
