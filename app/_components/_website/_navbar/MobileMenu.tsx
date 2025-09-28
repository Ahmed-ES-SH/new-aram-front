/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useEffect } from "react";
import { navbarlinks } from "@/app/constants/_website/navbar";
import { useAppDispatch, useAppSelector } from "@/app/Store/hooks";
import { setIsMenuOpen } from "@/app/Store/variablesSlice";
import { AnimatePresence, motion } from "framer-motion";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { CiLogin } from "react-icons/ci";
import { FaTimes } from "react-icons/fa";
import { directionMap } from "@/app/constants/_website/global";

export default function MobileMenu() {
  const locale = useLocale();
  const router = useRouter();

  const { isMenuOpen, width } = useAppSelector((state) => state.variables);
  const { user } = useAppSelector((state) => state.user);

  const dispatch = useAppDispatch();

  const handleGo = (href: string) => {
    router.push(`/${locale}/${href}`);
  };

  const toggleMenu = () => {
    dispatch(setIsMenuOpen(!isMenuOpen));
  };

  // const hadnleCartToggle = () => {
  //   dispatch(setIsCartOpen(!isCartOpen));
  // };

  useEffect(() => {
    if (width >= 1024) {
      dispatch(setIsMenuOpen(false));
    }
  }, [width]);

  return (
    <>
      {isMenuOpen && (
        <div
          onClick={toggleMenu}
          className="w-full bg-black backdrop-blur-md opacity-50 fixed top-0 left-0 min-h-screen lg:hidden"
        />
      )}
      {isMenuOpen && (
        <AnimatePresence>
          <motion.div
            dir={directionMap[locale]}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            className="fixed top-0 right-0 h-full w-64 bg-white   shadow-lg z-50"
          >
            <div className="p-4">
              <div className="flex items-center justify-between py-2">
                {/* <div
                  onClick={hadnleCartToggle}
                  className="flex flex-col items-center p-2 hover:bg-primary hover:text-white justify-center  cursor-pointer  duration-200 relative  text-primary rounded-lg"
                >
                  <FaCartShopping className="size-6" />
                  <div className="top-0 -right-2 absolute animate-ping w-1 h-1 rounded-full bg-main_blue"></div>
                </div> */}
                <button
                  onClick={toggleMenu}
                  className="block rtl:mr-auto ltr:ml-auto text-gray-600 hover:text-red-400"
                >
                  <FaTimes className="size-5" />
                </button>
              </div>
              <nav>
                <ul className="flex flex-col gap-4 text-sm mt-5">
                  {navbarlinks.map((link, index) => (
                    <>
                      <li
                        className=" relative flex flex-col gap-2 group"
                        key={index}
                      >
                        <p
                          className="text-gray-500 cursor-pointer transition hover:text-gray-500/75 "
                          onClick={() => handleGo(link.to)}
                        >
                          {link.label[locale]}
                        </p>
                        <div className="w-0 h-[1px] bg-primary group-hover:w-full duration-200"></div>
                      </li>
                    </>
                  ))}
                  {!user && (
                    <div className="w-full flex flex-col gap-4 pt-2 border-t border-gray-300">
                      <li className="w-full">
                        <button
                          className="rounded-md w-full flex items-center gap-1 bg-primary hover:bg-white duration-200 hover:text-black px-5 py-2.5 text-sm font-medium text-white  shadow"
                          onClick={() => handleGo("/login")}
                        >
                          <p> {locale == "en" ? "Login" : "دخول"}</p>
                          <CiLogin className="size-5" />
                        </button>
                      </li>
                      <li className="w-full">
                        <button
                          className="rounded-md ltr:text-left rtl:text-right w-full block bg-gray-200 text-gray-400 hover:bg-primary hover:text-white duration-200 px-5 py-2.5 text-sm font-medium "
                          onClick={() => handleGo("/membership")}
                        >
                          {locale == "en" ? "Register" : "إنضم الأن"}
                        </button>
                      </li>
                    </div>
                  )}
                </ul>
              </nav>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </>
  );
}
