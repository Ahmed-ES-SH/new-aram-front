import React from "react";
import { FaCamera } from "react-icons/fa";
import Img from "@/app/_components/_website/_global/Img";

interface ImagesSectionProps {
  logoPreview: string | null;
  coverPreview: string | null;
  handleLogoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCoverChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ImagesSection({
  logoPreview,
  coverPreview,
  handleLogoChange,
  handleCoverChange,
}: ImagesSectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
      {/* Logo */}
      <div className="flex flex-col items-center gap-6">
        <label className="text-lg font-bold text-gray-800">شعار المركز</label>
        <div className="relative group">
          <div className="w-36 h-36 flex items-center justify-center rounded-full overflow-hidden border-4 border-white shadow-lg ring-1 ring-gray-200">
            {logoPreview ? (
              <Img
                src={logoPreview}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            ) : (
              <Img
                src="/defaults/empty-logo.png"
                className="w-12 h-12 transition-transform duration-500 group-hover:scale-110"
              />
            )}
          </div>
          <label className="absolute bottom-1 right-1 p-3 bg-sky-500 text-white rounded-full cursor-pointer hover:bg-sky-600 transition-all shadow-md active:scale-95">
            <FaCamera size={18} />
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleLogoChange}
            />
          </label>
        </div>
      </div>

      {/* Cover Image */}
      <div className="flex flex-col items-center gap-6">
        <label className="text-lg font-bold text-gray-800">صورة الغلاف</label>
        <div className="relative w-full h-48 rounded-2xl overflow-hidden border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 transition-colors group">
          {coverPreview ? (
            <Img
              src={coverPreview}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex flex-col items-center justify-center w-full h-full text-gray-400 gap-2">
              <FaCamera size={24} />
              <span className="text-sm font-medium">اضغط لرفع صورة الغلاف</span>
            </div>
          )}
          <input
            type="file"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            accept="image/*"
            onChange={handleCoverChange}
          />
        </div>
      </div>
    </div>
  );
}
