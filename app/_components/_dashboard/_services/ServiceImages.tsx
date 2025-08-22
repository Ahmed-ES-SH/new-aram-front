"use client";
import React, { useRef } from "react";
import { Service } from "./types";
import Img from "../../_website/_global/Img";
import { IoMdClose } from "react-icons/io";

interface props {
  images: Service["images"];
  errors: any;
}

export default function ServiceImages({ errors, images }: props) {
  const imagesInputRef = useRef<HTMLInputElement | null>(null);

  const handleDeleteImage = (item: any) => {};

  return (
    <>
      {images && images.length > 0 ? (
        <div className="flex flex-col gap-1">
          <label className="my-2 pb-1 border-b w-fit border-b-primary">
            معرض الخدمة
          </label>
          <div className="grid grid-cols-2 max-md:grid-cols-1 gap-4 w-full">
            {images.map((item: any, index: number) => {
              return (
                <div
                  key={item.id ?? item.tempId ?? index}
                  className="w-full rounded-md shadow-sm h-[30vh] relative"
                >
                  <Img
                    src={item.file ? URL.createObjectURL(item.file) : item.path}
                    errorSrc="/defaults/noServiceImage.jpg"
                    className="w-full h-full object-cover rounded-md"
                  />
                  <div
                    onClick={() => handleDeleteImage(item)}
                    className="size-6 absolute top-2 right-2 rounded-sm bg-red-400 flex items-center justify-center text-white cursor-pointer hover:bg-red-600 hover:scale-110 duration-300"
                  >
                    <IoMdClose />
                  </div>
                </div>
              );
            })}
            <div
              onClick={() => imagesInputRef.current?.click()}
              className="w-full rounded-md shadow-sm h-[30vh] bg-gray-100 cursor-pointer hover:bg-light-primary duration-300 flex items-center justify-center relative"
            >
              <Img
                src={"/defaults/upload.png"}
                className="w-32 rounded-md"
                errorSrc="/defaults/noServiceImage.jpg"
              />
            </div>
          </div>
          {errors && errors["images"] && (
            <p className=" text-red-400 underline">{errors["images"]}</p>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-1">
          <div
            onClick={() => imagesInputRef.current?.click()}
            className="w-full rounded-md shadow-sm h-[30vh] bg-gray-100 cursor-pointer hover:bg-light-primary duration-300 flex items-center justify-center relative"
          >
            <Img
              src={"/defaults/upload.png"}
              className="w-32 rounded-md"
              errorSrc="/defaults/noServiceImage.jpg"
            />
          </div>
          {errors && errors["images"] && (
            <p className=" text-red-400 underline">{errors["images"]}</p>
          )}
        </div>
      )}
    </>
  );
}
