"use client";
import React, { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FaAngleDown, FaHome, FaSignOutAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/app/Store/store";
import {
  setShowMessagesDrop,
  setShowNotificationDrop,
  setShowUserButton,
} from "@/app/Store/variablesSlice";
import Img from "../../_website/_global/Img";
import { useAppSelector } from "@/app/Store/hooks";
import { instance } from "@/app/_helpers/axios";
import Cookie from "cookie-universal";
import { useRouter } from "next/navigation";
import { clearUser } from "@/app/Store/userSlice";
import { useLocale } from "next-intl";

export default function UserDropDown() {
  const cookie = Cookie();
  const router = useRouter();
  const locale = useLocale() ?? "ar";

  const dispatch = useDispatch();

  const { user } = useAppSelector((state) => state.user);
  const { showUserButton } = useSelector((state: RootState) => state.variables);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    dispatch(setShowUserButton(!showUserButton));
    dispatch(setShowNotificationDrop(false));
    dispatch(setShowMessagesDrop(false));
  };

  // إغلاق القائمة عند الضغط خارجها
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        dispatch(setShowUserButton(false));
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dispatch]);

  // معالجة النقر على عناصر القائمة
  const handleHomeClick = () => {
    // الانتقال إلى الصفحة الرئيسية
    window.location.href = "/";
    dispatch(setShowUserButton(false));
  };

  const logout = async () => {
    try {
      const response = await instance.post("/logout");
      if (response.status == 200) {
        cookie.remove("aram_token");
        dispatch(clearUser());
        setTimeout(() => {
          router.push(`/${locale}/login`);
        }, 300);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const name = user?.name ?? user?.title ?? "غير معروف";
  const email = user?.email ?? "غير معروف";
  const image = user?.image ?? user?.logo ?? "/defaults/male-noimage.jpg";

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        onClick={toggleDropdown}
        className="flex items-center gap-2 cursor-pointer"
      >
        <Img
          src={image}
          errorSrc="/defaults/male-noimage.jpg"
          className="border border-white shadow-md rounded-full w-10 h-10 max-md:w-8 max-md:h-8"
        />
        <div className="flex flex-col text-[12px] text-white">
          <div className="flex items-center gap-2">
            <p className="max-md:hidden">
              {name.length > 15 ? name.slice(0, 15) + "..." : name}
            </p>
            <FaAngleDown
              className={`transition-transform ${
                showUserButton ? "rotate-180" : ""
              }`}
            />
          </div>
          <p className="max-md:hidden">
            {email.length > 20 ? email.slice(0, 20) + "..." : email}
          </p>
        </div>
      </div>

      <AnimatePresence>
        {showUserButton && (
          <motion.div
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 40, opacity: 1 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="w-[200px] absolute right-0 shadow-lg rounded-lg p-2 bg-white border border-gray-200 z-50"
          >
            {/* السهم أعلى القائمة */}
            <div className="absolute -top-2 right-4 w-4 h-4 bg-white border-t border-l border-gray-200 transform rotate-45"></div>

            {/* عناصر القائمة */}
            <div className="space-y-1">
              {/* الصفحة الرئيسية */}
              <button
                onClick={handleHomeClick}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              >
                <FaHome className="text-gray-500" />
                <span>الصفحة الرئيسية</span>
              </button>

              {/* تسجيل الخروج */}
              <button
                onClick={logout}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
              >
                <FaSignOutAlt className="text-red-500" />
                <span>تسجيل الخروج</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
