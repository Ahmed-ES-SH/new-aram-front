"use client";
import React from "react";
import Img from "../../Img";
import { motion } from "framer-motion";
import { VscLoading } from "react-icons/vsc";

export default function LoadingPage() {
  return (
    <>
      <div className="w-full h-screen fixed top-0 left-0 z-[9999999] bg-gradient-to-b from-light-primary to-mid-primary flex items-center justify-center">
        <div className="flex items-center flex-col gap-3">
          <Img src="/small-logo.png" className="w-52" />
          <motion.div
            className="mt-12"
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
          >
            <VscLoading className="size-10  text-white" />
          </motion.div>
          <p className="text-white mt-2 text-lg tracking-wide">
            {"loading ...."}
          </p>
        </div>
      </div>
    </>
  );
}
