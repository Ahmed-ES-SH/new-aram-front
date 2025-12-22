"use client";
import { useAppSelector } from "@/app/Store/hooks";
import { setShowSidebar } from "@/app/Store/variablesSlice";
import { HiBars3BottomRight } from "react-icons/hi2";
import { useDispatch } from "react-redux";

export default function MenuButton() {
  const dispatch = useDispatch();
  const { showSidebar } = useAppSelector((state) => state.variables);
  return (
    <>
      <HiBars3BottomRight
        onClick={() => dispatch(setShowSidebar(!showSidebar))}
        className={`text-white hover:scale-125 duration-200 block w-fit ml-auto size-7 cursor-pointer ${
          showSidebar ? " opacity-0 z-[-2]" : "opacity-100 z-1"
        }`}
      />
    </>
  );
}
