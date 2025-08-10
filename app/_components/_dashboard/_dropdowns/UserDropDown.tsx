"use client";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import { FaAngleDown } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/app/Store/store";
import {
  setShowMessagesDrop,
  setShowNotificationDrop,
  setShowUserButton,
} from "@/app/Store/variablesSlice";
import Img from "../../_website/_global/Img";

export default function UserDropDown() {
  const dispatch = useDispatch();
  const { showUserButton } = useSelector((state: RootState) => state.variables);

  const toggleDropdown = () => {
    dispatch(setShowUserButton(!showUserButton));
    dispatch(setShowNotificationDrop(false));
    dispatch(setShowMessagesDrop(false));
  };

  const email = "Ahmed@mail.com";
  const name = "Ahmed";

  return (
    <div className="relative">
      <div onClick={toggleDropdown} className="flex items-center gap-2 ">
        <Img
          src="/defaults/default-male.png"
          className="border border-white shadow-md cursor-pointer rounded-full w-10 h-10  max-md:w-8 max-md:h-8"
        />
        <div className="flex flex-col text-[12px] text-white">
          <div className="flex items-center gap-2">
            <p className="max-md:hidden">
              {name.length > 15 ? name.slice(0, 15) + "..." : name}
            </p>
            <FaAngleDown />
          </div>
          <p className="max-md:hidden">
            {email.length > 20 ? email.slice(0, 20) + "..." : email}
          </p>
        </div>
      </div>
      <AnimatePresence>
        {showUserButton && (
          <motion.div
            initial={{ y: -300, opacity: 0 }}
            animate={{ y: 40, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-[250px] h-[200px] absolute  right-0 shad-md  p-2 bg-primary "
          >
            <span className=" border-[10px] border-r-transparent border-t-transparent border-l-transparent border-b-primary absolute -top-5 right-2"></span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
