"use client";
import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import { HiBars3BottomRight } from "react-icons/hi2";
import { FaChevronDown } from "react-icons/fa";
import { pages } from "@/app/constants/_dashboard/Sidebar";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/app/Store/store";
import { setShowSidebar } from "@/app/Store/variablesSlice";
import LocaleLink from "../_website/_global/LocaleLink";

export default function Sidebar() {
  const dispatch = useDispatch();
  const { showSidebar } = useSelector((state: RootState) => state.variables);

  const [expanded, setExpanded] = useState<Record<number, boolean>>({});
  // حركة Framer Motion للقوائم الفرعية
  const dropdownVariants = {
    open: {
      height: "auto",
      opacity: 1,
      transition: { duration: 0.4 },
    },
    closed: {
      height: 0,
      opacity: 0,
      transition: { duration: 0.4 },
    },
  };

  const toggleDropdown = (index: number) => {
    setExpanded((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <>
      <AnimatePresence>
        {showSidebar && (
          <motion.div
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="w-[300px] bg-primary-boldgray xl:mt-16 pb-20 pt-2 h-screen  z-[99] fixed top-0 left-0 overflow-y-auto  shadow-md"
          >
            <div className="w-full px-3">
              <HiBars3BottomRight
                onClick={() => dispatch(setShowSidebar(!showSidebar))}
                className="text-white hover:scale-125 duration-200 block w-fit ml-auto size-7 cursor-pointer"
              />
            </div>
            {/* روابط الصفحات */}
            <ul className="mt-4">
              {pages.map((page, index) => (
                <li key={index} className="relative">
                  <div
                    onClick={() => toggleDropdown(index)}
                    className="flex items-center gap-4 px-4  hover:bg-gray-500 text-white py-3 duration-150 cursor-pointer"
                  >
                    {/* ايقونة الصفحة */}
                    {page.icon}
                    {/* اسم الصفحة */}
                    {page.to ? (
                      <LocaleLink
                        href={page.to}
                        className="text-sm whitespace-nowrap flex-1 duration-150"
                      >
                        {page.title}
                      </LocaleLink>
                    ) : (
                      <span className="text-sm whitespace-nowrap flex-1 duration-150 cursor-default">
                        {page.title}
                      </span>
                    )}

                    {/* أيقونة dropdown */}
                    {page.minilinks && page.minilinks.length > 0 && (
                      <FaChevronDown
                        className={`w-3 h-3 transition-transform ${
                          expanded[index] ? "rotate-180" : "rotate-0"
                        }`}
                      />
                    )}
                  </div>
                  {/* روابط الفرعية */}
                  <motion.ul
                    initial="closed"
                    animate={expanded[index] ? "open" : "closed"}
                    variants={dropdownVariants}
                    className="ml-8 overflow-hidden"
                  >
                    {page.minilinks?.map((link, subIndex) => (
                      <LocaleLink href={link.to} key={subIndex}>
                        <div className="flex items-center gap-4 px-4 py-2 hover:bg-gray-500  duration-200 text-white cursor-pointer">
                          {link.icon}
                          <span className="text-sm whitespace-nowrap">
                            {link.title}
                          </span>
                        </div>
                      </LocaleLink>
                    ))}
                  </motion.ul>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
