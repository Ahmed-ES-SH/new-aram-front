"use client";
import React from "react";
import { motion } from "framer-motion";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
export default function LoadingSpin() {
  return (
    <>
      <div className="w-full min-h-[90vh] flex items-center justify-center">
        <motion.div
          className="w-fit h-fit"
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <AiOutlineLoading3Quarters className="text-primary_dash size-40" />
        </motion.div>
      </div>
    </>
  );
}
