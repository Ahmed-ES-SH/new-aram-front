"use client";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import { FaBell } from "react-icons/fa";
import { TbBellRingingFilled } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/app/Store/store";
import {
  setShowMessagesDrop,
  setShowNotificationDrop,
  setShowUserButton,
} from "@/app/Store/variablesSlice";

export default function NotificationsDropDown() {
  const dispatch = useDispatch();
  const { showNotificationDrop } = useSelector(
    (state: RootState) => state.variables
  );

  const toggleDropdown = () => {
    dispatch(setShowNotificationDrop(!showNotificationDrop));
    dispatch(setShowUserButton(false));
    dispatch(setShowMessagesDrop(false));
  };

  const newnotiffication = false;

  return (
    <div className="relative">
      <div onClick={toggleDropdown}>
        {newnotiffication ? (
          <FaBell className="text-white size-6 max-md:size-5" />
        ) : (
          <div className=" relative w-fit">
            <TbBellRingingFilled className="text-white size-6 max-md:size-5" />
            <span className=" absolute -top-2 animate-bounce right-0 w-2 h-2 rounded-full bg-red-400 flex items-center justify-center"></span>
          </div>
        )}
      </div>
      <AnimatePresence>
        {showNotificationDrop && (
          <motion.div
            initial={{ y: -300, opacity: 0 }}
            animate={{ y: 40, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-[350px] h-[250px] absolute  right-0 shad-md  p-2 bg-primary "
          >
            <span className=" border-[10px] border-r-transparent border-t-transparent border-l-transparent border-b-primary absolute -top-5 right-2"></span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
