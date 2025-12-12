"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaVideo, FaImages, FaEdit } from "react-icons/fa";
import { instance } from "@/app/_helpers/axios";
import { toast } from "sonner";
import useFetchData from "@/app/_helpers/FetchDataWithAxios";
import LoadingSpin from "@/app/_components/LoadingSpin";
import { useRouter } from "next/navigation";

interface SectionToggleProps {
  title: string;
  icon: React.ReactNode;
  active: boolean;
  onEdit?: () => void;
  onToggle?: () => void;
  loading?: boolean;
}

const SectionToggle: React.FC<SectionToggleProps> = ({
  title,
  icon,
  active,
  onEdit,
  onToggle,
  loading,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`w-full flex items-center justify-between bg-white shadow-lg rounded-2xl p-8 my-5 border 
      ${active ? "border-orange-400 shadow-orange-100" : "border-gray-100"} 
      hover:shadow-xl transition-shadow`}
    >
      {/* Left side (icon + title) */}
      <div className="flex items-center gap-5">
        <div
          className={`text-4xl ${active ? "text-orange-500" : "text-gray-400"}`}
        >
          {icon}
        </div>
        <h2
          className={`text-xl font-bold ${
            active ? "text-gray-900" : "text-gray-500"
          }`}
        >
          {title}
        </h2>
      </div>

      {/* Right side (toggle + edit) */}
      <div className="flex items-center gap-4">
        {/* Edit Button */}
        <button
          onClick={onEdit}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-100 text-orange-600 hover:bg-orange-200 transition"
        >
          <FaEdit />
          <span className="text-sm font-medium">تعديل</span>
        </button>

        {/* Toggle */}
        <button
          onClick={onToggle}
          disabled={loading}
          className={`w-16 h-9 flex items-center rounded-full p-1 transition-colors ${
            active ? "bg-orange-500" : "bg-gray-300"
          } ${loading ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
        >
          <motion.div
            layout
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className="w-7 h-7 rounded-full bg-white shadow-md"
            style={{
              marginLeft: active ? "auto" : "0",
            }}
          />
        </button>
      </div>
    </motion.div>
  );
};

const SectionsContainer = () => {
  const router = useRouter();

  const { data: isActive, loading } = useFetchData<"video" | "swiper">(
    `/active-hero-section`,
    false
  );
  const [active, setIsActive] = useState<"video" | "swiper" | "">("video");
  const [updateLoading, setUpdateLoading] = useState(false);

  useEffect(() => {
    if (isActive !== undefined && isActive !== null) {
      setIsActive(isActive);
    }
  }, [isActive]);

  const handleChangeSection = async () => {
    if (active === "") return;
    try {
      const activeState = active === "video" ? "swiper" : "video";
      setUpdateLoading(true);
      const response = await instance.post(`/update-section/1`, {
        column_30: activeState,
      });
      if (response.status == 200) {
        toast.success("تم تحديث قسم الواجهة الفعال بنجاح . ");
        setIsActive(activeState);
      }
    } catch (error: any) {
      console.log(error);
      const message =
        error?.response?.data?.message ||
        "حدث خطا غير متوقع اثناء تحديث قسم الواجهة . ";
      toast.error(message);
    } finally {
      setUpdateLoading(false);
    }
  };

  console.log(isActive);

  if (loading || active === null) return <LoadingSpin />;

  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] px-6">
      <div className="max-w-3xl w-full">
        {/* الفيديو نشط لما active === true */}
        <SectionToggle
          title="قسم الفيديو"
          icon={<FaVideo />}
          active={active == "video"}
          loading={updateLoading}
          onEdit={() => router.push(`/en/dashboard/editherovideosection`)}
          onToggle={handleChangeSection}
        />

        {/* الشرائح نشطة لما active === false */}
        <SectionToggle
          title="قسم الشرائح"
          icon={<FaImages />}
          active={active == "swiper"}
          loading={updateLoading}
          onEdit={() => router.push(`/en/dashboard/slidescontrol`)}
          onToggle={handleChangeSection}
        />
      </div>
    </div>
  );
};

export default SectionsContainer;
