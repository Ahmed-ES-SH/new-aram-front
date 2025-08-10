"use client";
import React from "react";
import { HiBars3BottomRight } from "react-icons/hi2";
import UserDropDown from "./_dropdowns/UserDropDown";
import ConversationsDropDown from "./_dropdowns/ConversationsDropDown";
import NotificationsDropDown from "./_dropdowns/NotificationsDropDown";
import { useDispatch, useSelector } from "react-redux";
import { setShowSidebar } from "@/app/Store/variablesSlice";
import type { RootState } from "@/app/Store/store";
import Img from "../_website/_global/Img";
import LocaleLink from "../_website/_global/LocaleLink";

export default function Topbar() {
  const dispatch = useDispatch();
  const { showSidebar } = useSelector((state: RootState) => state.variables);

  return (
    <>
      <div className="w-full fixed top-0 left-0 z-[99999] h-[70px] bg-fourth-dash shadow-md">
        <div className="w-[95%] h-full  mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HiBars3BottomRight
              onClick={() => dispatch(setShowSidebar(!showSidebar))}
              className={`text-white hover:scale-125 duration-200 block w-fit ml-auto size-7 cursor-pointer ${
                showSidebar ? " opacity-0 z-[-2]" : "opacity-100 z-1"
              }`}
            />

            <LocaleLink href="/" className="flex items-center justify-center">
              <Img className="w-[65px]" src="/logo.png" />
            </LocaleLink>
          </div>
          <div className="flex items-center gap-5 cursor-pointer">
            <UserDropDown />
            <ConversationsDropDown />
            <NotificationsDropDown />
          </div>
        </div>
      </div>
    </>
  );
}
