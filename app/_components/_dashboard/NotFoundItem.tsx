import React from "react";
import { TbError404Off } from "react-icons/tb";

export default function NotFoundItem() {
  return (
    <>
      <div className="h-screen flex items-center justify-center w-full  ">
        <div className="flex items-center flex-col gap-3">
          <TbError404Off className="text-red-400 size-96 max-md:size-60" />
          <p className="pt-4 text-4xl max-lg:text-2xl max-md:text-[16px] text-red-400">
            العنصر غير موجود
          </p>
        </div>
      </div>
    </>
  );
}
