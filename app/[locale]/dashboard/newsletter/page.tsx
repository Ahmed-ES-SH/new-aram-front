"use client";
import React, { useState } from "react";
import { FaUsersCog } from "react-icons/fa";
import { motion } from "framer-motion";

export default function NewsLetterComponent() {
  const [showSubscribersModal, setShowSubscribersModal] = useState(false);

  return (
    <div
      style={{ direction: "rtl" }}
      className="flex flex-col gap-6 w-full p-8 max-md:p-4 min-h-[80vh] items-center justify-center text-center"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="w-24 h-24 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto">
          <FaUsersCog size={48} />
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-800">
            إدارة مشتركين النشرة البريدية
          </h1>
          <p className="text-gray-500 max-w-md mx-auto">
            يمكنك عرض جميع المشتركين، البحث عنهم، وإرسال رسائل خاصة لمجموعة
            محددة منهم بسهولة.
          </p>
        </div>

        <button
          onClick={() => setShowSubscribersModal(true)}
          className="px-8 py-3 bg-primary text-white rounded-2xl font-bold text-lg shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-3 mx-auto"
        >
          <FaUsersCog />
          <span>عرض المشتركين</span>
        </button>
      </motion.div>
    </div>
  );
}
