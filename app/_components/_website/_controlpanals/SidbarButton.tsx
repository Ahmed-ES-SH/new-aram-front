"use client";
import { useAppDispatch, useAppSelector } from "@/app/Store/hooks";
import { setUserPanalSidebar } from "@/app/Store/variablesSlice";
import React from "react";
import { TbLayoutSidebarLeftCollapseFilled } from "react-icons/tb";

export default function SidbarButton() {
  const { userPanalSidebar } = useAppSelector((state) => state.variables);
  const dispatch = useAppDispatch();

  return (
    <>
      {!userPanalSidebar && (
        <div
          onClick={() => dispatch(setUserPanalSidebar(!userPanalSidebar))}
          className="w-12 h-12 opacity-80 hover:opacity-100 z-999 fixed bottom-4 left-4 rounded-full flex items-center justify-center bg-primary text-white cursor-pointer hover:bg-orange-500 border border-primary/30"
        >
          <TbLayoutSidebarLeftCollapseFilled className="size-6" />
        </div>
      )}
    </>
  );
}
