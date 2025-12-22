"use client";
import SlideCardDash, {
  Slide,
} from "@/app/_components/_dashboard/_slides/SlideDashCard";
import LoadingSpin from "@/app/_components/LoadingSpin";
import useFetchData from "@/app/_helpers/FetchDataWithAxios";
import React, { useEffect, useState } from "react";

export default function SlidesControlPage() {
  const { data, loading } = useFetchData<Slide[]>(`/slides`, false);

  const [slides, setSlides] = useState<Slide[]>([]);

  useEffect(() => {
    if (data) {
      setSlides(data);
    }
  }, [data]);

  if (loading) return <LoadingSpin />;

  return (
    <div dir="rtl" className="w-[90%] mx-auto p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">إدارة الشرائح</h2>

      {!data || data.length === 0 ? (
        <div className="text-center text-gray-500 text-lg">
          لا توجد بيانات متاحة
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {slides.map((slide: any) => (
            <SlideCardDash key={slide.id} setSlides={setSlides} slide={slide} />
          ))}
        </div>
      )}
    </div>
  );
}
