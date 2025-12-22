"use client";
import React, { ChangeEvent, Dispatch, SetStateAction, useRef } from "react";
import Img from "../../_website/_global/Img";
import { IoMdClose } from "react-icons/io";

interface props {
  images: any;
  errors: any;
  form: any;
  setForm: Dispatch<SetStateAction<any>>;
}

export default function ServiceImages({
  errors,
  images,
  form,
  setForm,
}: props) {
  const imagesInputRef = useRef<HTMLInputElement | null>(null);

  const handleDeleteImage = (item: any) => {
    setForm((prevForm) => {
      const updatedImages = prevForm.images.filter((img: any) => {
        // New file → remove by tempId
        if (item.tempId) {
          return img.tempId !== item.tempId;
        }

        // Old image → remove by id
        if (item.id) {
          return img.id !== item.id;
        }

        return true;
      });

      let updatedDeletedImages = prevForm.deletedImages || [];

      // If it's an old image (has id + path), add its id to deletedImages
      if (item.id && item.path) {
        updatedDeletedImages = [...updatedDeletedImages, item.id];
      }

      return {
        ...prevForm,
        images: updatedImages,
        deletedImages: updatedDeletedImages,
      };
    });
  };

  const handleFilesChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files.length > 0) {
      const newFiles = Array.from(files).map((file) => ({
        file,
        tempId: crypto.randomUUID(), // generate temporary id for React key
        preview: URL.createObjectURL(file),
      }));
      setForm({
        ...form,
        images: [...form.images, ...newFiles],
      });
    }
  };

  return (
    <>
      <input
        ref={imagesInputRef}
        name="images"
        onChange={handleFilesChange}
        type="file"
        multiple
        hidden
      />
      {images && images.length > 0 ? (
        <div className="flex flex-col gap-1">
          <label className="my-2 pb-1 border-b w-fit border-sky-400">
            معرض الخدمة
          </label>

          <div className="grid grid-cols-3 max-lg:grid-cols-2 max-md:grid-cols-1 gap-4 w-full">
            {images.map((item: any, index: number) => {
              return (
                <div
                  key={item.id ?? item.tempId ?? index}
                  className="w-full rounded-md shadow-sm h-[30vh] relative"
                >
                  <Img
                    src={item.file ? item.preview : item.path}
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
              className="w-full rounded-md shadow-sm h-[30vh] bg-gray-100 cursor-pointer hover:bg-sky-200 duration-300 flex items-center justify-center relative"
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
            className="w-full rounded-md shadow-sm h-[30vh] bg-gray-100 cursor-pointer hover:bg-sky-100 duration-300 flex items-center justify-center relative"
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
