"use client";
import LoadingSpin from "@/app/_components/LoadingSpin";
import useFetchData from "@/app/_helpers/FetchDataWithAxios";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import { FaPen } from "react-icons/fa";
import EditTextPopup from "@/app/_components/_popups/EditTextPopup";
import { VscLoading } from "react-icons/vsc";
import { toast } from "sonner";
import { instance } from "@/app/_helpers/axios";
import EditVideoPopup from "@/app/_components/_dashboard/_editherovideosection/EditVideoPopup";

interface state {
  en: string;
  ar: string;
  number: string;
}

export default function Editherovideosection() {
  const { data, loading } = useFetchData<any>(`/get-section/1`, false);
  const { data: videoResponse } = useFetchData<any>(
    `/get-main-page-videos`,
    false
  );

  const [updateloading, setUpdateLoading] = useState(false);
  const [mainVideoData, setMainVideoData] = useState<any>(null);
  const [demoVideoData, setDemoVideoData] = useState<any>(null);
  const [mainVideo, setMainVideo] = useState<File | string | null>(null);
  const [videoPopupOpen, setVideoPopupOpen] = useState<"main" | "demo" | null>(
    null
  );

  const [selectedText, setSelectedText] = useState({ en: "", ar: "" });
  const [form, setForm] = useState({
    title: { en: "", ar: "" },
    description: { en: "", ar: "" },
  });

  const [stats, setStats] = useState<state[]>([]);
  const [filedType, setFiledType] = useState<"title" | "description" | "">("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // handle stats change
  const handleStatChange = (
    index: number,
    field: keyof state,
    value: string
  ) => {
    setStats((prev) =>
      prev.map((stat, i) => (i === index ? { ...stat, [field]: value } : stat))
    );
  };

  // add new stat
  const addStat = () => {
    setStats((prev) => [...prev, { en: "", ar: "", number: "" }]);
  };

  // remove stat
  const removeStat = (index: number) => {
    setStats((prev) => prev.filter((_, i) => i !== index));
  };

  // Save changes to local state
  const handleSaveChanges = () => {
    if (!filedType) return;

    setForm((prev) => ({
      ...prev,
      [filedType]: {
        en: selectedText.en,
        ar: selectedText.ar,
      },
    }));

    setIsPopupOpen(false);
  };

  // Generate inputs dynamically for EditTextPopup
  const inputs = useMemo(() => {
    const fieldConfig: Record<
      string,
      { label: string; type: "short-text" | "long-text" }
    > = {
      title: { label: "العنوان", type: "short-text" },
      description: { label: "الوصف", type: "long-text" },
    };

    const config = fieldConfig[filedType];
    if (!config) return [];

    return ["en", "ar"].map((lang) => ({
      name: `${filedType}_${lang}`,
      value: selectedText[lang as "en" | "ar"],
      type: config.type,
      label: `${config.label} (${lang.toUpperCase()})`,
    }));
  }, [filedType, selectedText]);

  // Handle text input change inside popup
  const handleInputChange = (name: string, value: string | number) => {
    const lang = name.endsWith("_en") ? "en" : "ar";
    setSelectedText((prev) => ({
      ...prev,
      [lang]: value,
    }));
  };

  // When user clicks on a text
  const handleSelectText = (
    type: "title" | "description",
    text: { en: string; ar: string }
  ) => {
    setSelectedText(text);
    setFiledType(type);
    setIsPopupOpen(true);
  };

  // handleSubmit
  const handleSubmit = async () => {
    try {
      // Check if required fields are empty
      if (
        !form.title?.en?.trim() ||
        !form.title?.ar?.trim() ||
        !form.description?.en?.trim() ||
        !form.description?.ar?.trim() ||
        !Array.isArray(stats) ||
        stats.length === 0
      ) {
        toast.error("الرجاء ملء جميع الحقول المطلوبة قبل الحفظ");
        return; // stop submit
      }

      // ✅ Check video size before sending
      if (mainVideo instanceof File && mainVideo.size > 30 * 1024 * 1024) {
        toast.error("حجم الفيديو يجب ألا يتجاوز 30MB");
        return; // stop submit
      }

      setUpdateLoading(true);
      const formData = new FormData();
      formData.append("column_1", JSON.stringify(form.title));
      formData.append("column_2", JSON.stringify(form.description));
      formData.append("column_3", JSON.stringify(stats));
      if (mainVideo) formData.append("video", mainVideo);

      const response = await instance.post(`/update-section/1`, formData);

      if (response.status == 200) {
        toast.success("تم تحديث بيانات قسم الفيديو بنجاح .");
      }
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        "حدث خطأ أثناء تحديث بيانات قسم الفيديو الرجاء المحاولة لاحقا .";
      toast.error(message);
    } finally {
      setUpdateLoading(false);
    }
  };

  // get the current Data For Section

  useEffect(() => {
    if (data) {
      setForm({
        title: data.column_1,
        description: data.column_2,
      });

      setStats(data.column_3);
    }
  }, [data]);

  useEffect(() => {
    if (videoResponse) {
      setMainVideoData(videoResponse?.main_video);
      setDemoVideoData(videoResponse?.demo_video);
    }
  }, [videoResponse]);

  console.log(mainVideoData);
  console.log(mainVideo);

  if (loading) return <LoadingSpin />;

  return (
    <>
      <motion.div
        dir="rtl"
        className="my-4 min-h-screen flex items-center justify-center "
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="h-fit bg-white border border-gray-300 shadow-lg rounded-2xl w-[98%] lg:w-[90%] mx-auto space-y-6 p-6">
          <h2 className="text-xl font-bold text-gray-800 w-fit mx-auto pb-3 border-b border-primary">
            تعديل محتوى قسم الفيديو
          </h2>

          <div className="w-full">
            <label className="block text-gray-600 font-medium mb-2">
              رابط الفيديو الرئيسى
            </label>
            <div className="relative flex flex-col gap-3 w-full">
              <input
                type="text"
                value={mainVideoData?.video_url ?? ""}
                readOnly={true}
                className="p-2 bg-gray-100 w-full rounded-md"
              />
              <div
                onClick={() => setVideoPopupOpen("main")}
                className="w-7 h-7 self-end text-white cursor-pointer flex items-center justify-center bg-sky-400 rounded-md shadow"
              >
                <FaPen />
              </div>
            </div>
          </div>

          <div className="w-full">
            <label className="block text-gray-600 font-medium mb-2">
              رابط الفيديو الدعائى
            </label>
            <div className="relative flex flex-col gap-3 w-full">
              <input
                type="text"
                value={demoVideoData?.video_url ?? ""}
                readOnly={true}
                className="p-2 bg-gray-100 w-full rounded-md"
              />
              <div
                onClick={() => setVideoPopupOpen("demo")}
                className="w-7 h-7 self-end text-white cursor-pointer flex items-center justify-center bg-sky-400 rounded-md shadow"
              >
                <FaPen />
              </div>
            </div>
          </div>

          {/* Title */}
          <div className="pt-3 border-t border-gray-300">
            <label className="block text-gray-600 font-medium mb-2">
              العنوان
            </label>
            <div className="flex flex-col gap-3 w-full">
              <input
                type="text"
                value={form?.title?.ar ?? ""}
                readOnly={true}
                className="p-2 bg-gray-100 rounded-md"
              />
              <div
                onClick={() => handleSelectText("title", form.title)}
                className="w-7 h-7 self-end text-white cursor-pointer flex items-center justify-center bg-sky-400 rounded-md shadow"
              >
                <FaPen />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="pt-3 border-t border-gray-300">
            <label className="block text-gray-600 font-medium mb-2">
              الوصف
            </label>
            <div className="flex flex-col gap-3 w-full">
              <textarea
                value={form?.description?.ar ?? ""}
                readOnly={true}
                className="p-2 min-h-32 bg-gray-100 rounded-md"
              />
              <div
                onClick={() =>
                  handleSelectText("description", form.description)
                }
                className="w-7 h-7 self-end text-white cursor-pointer flex items-center justify-center bg-sky-400 rounded-md shadow"
              >
                <FaPen />
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-12 pt-4 border-t border-gray-300">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold text-gray-700">
                الإحصائيات
              </h3>
              <button
                type="button"
                onClick={addStat}
                className="flex items-center gap-2 px-3 py-1 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
              >
                <FiPlus /> أضف
              </button>
            </div>
            {/* Stats Section Control */}
            <div className="space-y-4">
              {stats &&
                stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    className="grid grid-cols-12 gap-2 items-center bg-gray-100 p-3 rounded-xl border border-gray-200"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <input
                      type="text"
                      placeholder="English"
                      value={stat.en}
                      onChange={(e) =>
                        handleStatChange(index, "en", e.target.value)
                      }
                      className="col-span-3 outline-none focus:bg-white rounded-lg border border-gray-300 p-2"
                    />
                    <input
                      type="text"
                      placeholder="Arabic"
                      value={stat.ar}
                      onChange={(e) =>
                        handleStatChange(index, "ar", e.target.value)
                      }
                      className="col-span-3 outline-none focus:bg-white rounded-lg border border-gray-300 p-2"
                    />
                    <input
                      type="text"
                      placeholder="Number"
                      value={stat.number}
                      onChange={(e) =>
                        handleStatChange(index, "number", e.target.value)
                      }
                      className="col-span-4 outline-none focus:bg-white rounded-lg border border-gray-300 p-2"
                    />
                    <button
                      type="button"
                      onClick={() => removeStat(index)}
                      className="col-span-2 outline-none focus:bg-white text-red-500 hover:text-red-700"
                    >
                      <FiTrash2 size={20} />
                    </button>
                  </motion.div>
                ))}
            </div>

            {/* submit button */}
            <button
              onClick={handleSubmit}
              type="button"
              className="lg:w-1/2 xl:w-1/4 mx-auto rounded-md shadow-md bg-primary text-white flex items-center justify-center mt-4 p-2 hover:bg-orange-500 duration-200"
            >
              {updateloading ? (
                <VscLoading className="animate-spin" />
              ) : (
                "حفظ التتغييرات"
              )}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Popup Component */}
      <EditTextPopup
        loadingState={updateloading}
        operationType={"edit"}
        onSave={handleSaveChanges}
        showPopup={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        inputs={inputs}
        onChange={handleInputChange}
      />

      <EditVideoPopup
        isOpen={videoPopupOpen === "main" || videoPopupOpen === "demo"}
        onClose={() => setVideoPopupOpen(null)}
        setMainVideo={
          videoPopupOpen === "main" ? setMainVideoData : setDemoVideoData
        }
        video_id={videoPopupOpen === "main" ? "main_page" : "demo_video"}
        title={
          videoPopupOpen === "main"
            ? "تحرير الفيديو الرئيسي"
            : "تحرير الفيديو الدعائي"
        }
      />
    </>
  );
}
