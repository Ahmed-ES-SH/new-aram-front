import React from "react";
import Img from "../Img";

export default function NoDataFounded() {
  return (
    <>
      <div className="w-full h-[70vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <Img src="/defaults/nodata.png" className="w-40" />
          <p className="text-2xl max-lg:text-xl max-md:text-lg text-red-500 underline">
            عفوا لا توجد بيانات ليتم عرضها فى الوقت الحالى
          </p>
        </div>
      </div>
    </>
  );
}
