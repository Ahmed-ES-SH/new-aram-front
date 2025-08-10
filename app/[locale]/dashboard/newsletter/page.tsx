"use client";
import MembersForSelected from "@/app/_components/_dashboard/_newsletter/MembersForSelected";
import React from "react";

export default function NewsLetterComponent() {
  return (
    <div
      style={{ direction: "rtl" }}
      className="flex items-start flex-col gap-3 w-full p-6 max-md:p-2"
    >
      <MembersForSelected />
    </div>
  );
}
