"use client";

import { motion } from "framer-motion";

export default function Loading() {
  return (
    <motion.div
      className="flex items-center justify-center text-lg text-blue-600 min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      Loading...
    </motion.div>
  );
}
