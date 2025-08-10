"use client";
import { useAppDispatch, useAppSelector } from "@/app/Store/hooks";
import { setIsMenuOpen } from "@/app/Store/variablesSlice";
import React from "react";
import { FaBars } from "react-icons/fa";

export default function MenuButton() {
  const { isMenuOpen } = useAppSelector((state) => state.variables);
  const dispatch = useAppDispatch();
  const toggleMenu = () => {
    dispatch(setIsMenuOpen(!isMenuOpen));
  };
  return (
    <>
      <button
        onClick={toggleMenu}
        className="lg:hidden rounded bg-gray-100 p-2 text-gray-600 transition hover:text-gray-600/75 "
      >
        <FaBars size={20} />
      </button>
    </>
  );
}
