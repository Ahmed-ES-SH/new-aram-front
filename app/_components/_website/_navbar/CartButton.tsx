"use client";
import { useAppDispatch, useAppSelector } from "@/app/Store/hooks";
import { setIsCartOpen } from "@/app/Store/variablesSlice";
import React from "react";
import { FaCartShopping } from "react-icons/fa6";

export default function CartButton() {
  const { isCartOpen } = useAppSelector((state) => state.variables);
  const dispatch = useAppDispatch();

  const hadnleCartToggle = () => {
    dispatch(setIsCartOpen(!isCartOpen));
  };

  return (
    <>
      <div
        onClick={hadnleCartToggle}
        className="flex flex-col items-center justify-center  cursor-pointer  duration-200 relative gap-2 text-primary  rounded-sm"
      >
        <FaCartShopping className="size-6" />
        <div className="size-5 top-0 -right-2 absolute animate-ping w-1 h-1 rounded-full bg-primary-red"></div>
      </div>
    </>
  );
}
