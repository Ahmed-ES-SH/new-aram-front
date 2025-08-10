"use client";
import React, { useState } from "react";
import { currencies } from "@/app/constants/_website/navbar";
import { FaArrowDown } from "react-icons/fa";
import { useLocale } from "next-intl";
import Flag from "react-world-flags";
import LanguageBtns from "./LanguageBtns";
import { useAppDispatch, useAppSelector } from "@/app/Store/hooks";
import { setActiveCurrency } from "@/app/Store/variablesSlice";

export default function TopPart() {
  const locale = useLocale();

  const { activeCurrency } = useAppSelector((state) => state.variables);
  const dispatch = useAppDispatch();

  const [openDropCurrency, setOpenDropCurrency] = useState(false);

  const selectCurrency = (currency: any) => {
    dispatch(setActiveCurrency(currency));
  };

  return (
    <>
      <div className="w-full h-fit py-1 bg-gray-100 border-b border-gray-300">
        <div className="w-[90%] mx-auto">
          <div className="w-fit ml-auto flex items-center gap-4 ">
            <div
              onClick={() => setOpenDropCurrency(!openDropCurrency)}
              className="flex items-center gap-1 cursor-pointer relative"
            >
              <p className="text-[12px]">{activeCurrency.name[locale]}</p>
              <div className="flex items-center gap-1">
                <Flag code={activeCurrency.flag} className="size-4" />
                <FaArrowDown className="size-3 text-gray-500 " />
              </div>
              {openDropCurrency && (
                <ul className=" z-[999999999999] min-w-[120px] flex flex-col items-start bg-white border border-gray-300 rounded-md shadow-sm absolute top-6 -left-5">
                  {currencies.map((currency, index) => (
                    <li
                      onClick={() => selectCurrency(currency)}
                      key={index}
                      className="flex items-center gap-2 py-1.5 w-full cursor-pointer hover:bg-gray-200 -gray-600 duration-200 px-2 "
                    >
                      <Flag code={currency.flag} className="size-4" />
                      <p className="whitespace-nowrap text-xs">
                        {currency.name[locale]}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <LanguageBtns />
          </div>
        </div>
      </div>
    </>
  );
}
