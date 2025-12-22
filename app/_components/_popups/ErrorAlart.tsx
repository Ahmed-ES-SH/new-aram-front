import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { BiSolidError } from "react-icons/bi";

interface Props {
  showAlart: boolean;
  Message: string;
  onClose: () => void;
}

export default function ErrorAlart({ showAlart, Message, onClose }: Props) {
  const [barWidth, setBarWidth] = useState(100);

  useEffect(() => {
    if (!showAlart) return; // لا تفعل شيء إذا لم يكن التنبيه ظاهراً

    setBarWidth(100); // إعادة تعيين الشريط إلى 100% عند ظهور التنبيه

    const interval = setInterval(() => {
      setBarWidth((prev) => {
        if (prev <= 10) {
          clearInterval(interval);
          return 0;
        }
        return prev - 10;
      });
    }, 600);

    return () => clearInterval(interval); // تنظيف `setInterval` عند إغلاق التنبيه
  }, [showAlart]);

  useEffect(() => {
    if (barWidth === 0) {
      onClose();
    }
  }, [barWidth, onClose]);

  return (
    <AnimatePresence>
      {showAlart && (
        <motion.div
          style={{ direction: "ltr" }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="w-[80%] h-[70px] fixed top-4 left-1/2 -translate-x-1/2 rounded-t-md shadow-xl bg-white z-[9999999]"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-24 h-[70px] bg-red-400 text-white flex items-center justify-center rounded-tl-md">
                <BiSolidError className="size-8" />
              </div>
              <div className="flex flex-col gap-2 ">
                <h1>فشل العملية</h1>
                <p className="text-second_text">{Message}</p>
              </div>
            </div>
            <p
              onClick={onClose}
              className="text-second_text text-lg cursor-pointer mr-6"
            >
              إغلاق
            </p>
          </div>
          <div
            className="h-[4px] bg-red-400 duration-200"
            style={{ width: `${barWidth}%` }}
          ></div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
