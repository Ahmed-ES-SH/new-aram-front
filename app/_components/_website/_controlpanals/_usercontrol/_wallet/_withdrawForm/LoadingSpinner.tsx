"use client";
import React from "react";
import { motion } from "framer-motion";
import { VscLoading } from "react-icons/vsc";

export default function LoadingSpinner() {
  return (
    <motion.div
      animate={{ rotate: [360, 0, -360] }}
      transition={{ duration: 1.5, repeat: Infinity }}
      className="w-fit h-fit"
    >
      <VscLoading className="size-12 text-primary" />
    </motion.div>
  );
}
