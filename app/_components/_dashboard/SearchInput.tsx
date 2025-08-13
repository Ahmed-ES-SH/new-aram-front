"use client";
import React, { Dispatch, SetStateAction, useState } from "react";

interface props {
  placeHolder?: string;
  handleSearch: () => void;
  setSearchContent: Dispatch<SetStateAction<string>>;
}

export default function SearchInput({
  placeHolder = "أدخل محتوى البحث هنا ........",
  setSearchContent,
  handleSearch,
}: props) {
  const [content, setContent] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContent(e.target.value);
    setSearchContent(e.target.value);
  };

  return (
    <>
      <div className="w-[80%] max-md:w-[95%] mx-auto my-4  flex items-center gap-2">
        {
          <button
            onClick={handleSearch}
            className={`info-btn ${
              content.length > 0 ? "opacity-100 z-10" : "opacity-0 -z-10"
            }`}
          >
            بحث
          </button>
        }
        <div className="input-container">
          <input
            id="search"
            placeholder={placeHolder}
            onChange={handleChange}
            dir="rtl"
            className="input-style"
          />
        </div>
      </div>
    </>
  );
}
