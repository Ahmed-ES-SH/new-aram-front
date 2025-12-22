"use client";
import React from "react";
import Img from "./Img";
import Spin from "./Spin";

export default function LoadingPage() {
  return (
    <>
      <div className="w-full h-screen fixed top-0 left-0 z-[9999999]  backdrop-blur-3xl flex items-center justify-center">
        <div className="flex items-center flex-col gap-3 border border-primary rounded-xl bg-primary py-24 px-32">
          <Img src="/logo.png" className="w-52" />
          <Spin />
          <p className="text-white mt-2 text-lg tracking-wide">
            {"loading ...."}
          </p>
        </div>
      </div>
    </>
  );
}
