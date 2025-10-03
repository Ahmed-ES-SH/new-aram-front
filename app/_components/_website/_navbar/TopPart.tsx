"use client";
import React, { useEffect, useRef, useState } from "react";
import { FaArrowDown } from "react-icons/fa";
import Flag from "react-world-flags";
import LanguageBtns from "./LanguageBtns";
import { useAppDispatch, useAppSelector } from "@/app/Store/hooks";
import {
  changeCurrency,
  Currency,
  setCurrencies,
} from "@/app/Store/currencySlice";

interface Props {
  currencies: Currency[];
}

// Utility function to map currency codes to country flags
function getFlagCode(currencyCode: string): string {
  const map: Record<string, string> = {
    // 🏦 Arabic Currencies
    AED: "AE", // UAE Dirham
    SAR: "SA", // Saudi Riyal
    EGP: "EG", // Egyptian Pound
    KWD: "KW", // Kuwaiti Dinar
    BHD: "BH", // Bahraini Dinar
    QAR: "QA", // Qatari Riyal
    OMR: "OM", // Omani Rial
    JOD: "JO", // Jordanian Dinar
    LYD: "LY", // Libyan Dinar
    DZD: "DZ", // Algerian Dinar
    MAD: "MA", // Moroccan Dirham
    TND: "TN", // Tunisian Dinar
    SDG: "SD", // Sudanese Pound
    SYP: "SY", // Syrian Pound
    YER: "YE", // Yemeni Rial
    IQD: "IQ", // Iraqi Dinar
    LBP: "LB", // Lebanese Pound
    SOS: "SO", // Somali Shilling
    MRU: "MR", // Mauritanian Ouguiya
    DJF: "DJ", // Djiboutian Franc
    KMF: "KM", // Comorian Franc
    // 🌍 European & International Major
    EUR: "EU", // Euro
    GBP: "GB", // British Pound
    USD: "US", // US Dollar
    CHF: "CH", // Swiss Franc
    SEK: "SE", // Swedish Krona
    NOK: "NO", // Norwegian Krone
    DKK: "DK", // Danish Krone
    PLN: "PL", // Polish Zloty
    CZK: "CZ", // Czech Koruna
    HUF: "HU", // Hungarian Forint
    RON: "RO", // Romanian Leu
    BGN: "BG", // Bulgarian Lev
    RUB: "RU", // Russian Ruble
    TRY: "TR", // Turkish Lira
    // fallback
  };

  return map[currencyCode] || "UN"; // UN flag as fallback
}

export default function TopPart({ currencies }: Props) {
  const dropRef = useRef<HTMLDivElement>(null);

  const { activeCurrency } = useAppSelector((state) => state.currency);
  const dispatch = useAppDispatch();

  const [openDropCurrency, setOpenDropCurrency] = useState(false);

  const selectCurrency = (currency: Currency) => {
    dispatch(changeCurrency(currency.code));
    setOpenDropCurrency(false);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(event.target as Node)) {
        setOpenDropCurrency(false);
      }
    };

    if (openDropCurrency) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openDropCurrency]);

  useEffect(() => {
    if (currencies) {
      dispatch(setCurrencies(currencies));
    }
  }, [currencies, dispatch]);

  return (
    <div className="w-full h-fit py-1 bg-gray-100 border-b border-gray-300">
      <div className="w-[90%] mx-auto">
        <div className="w-fit ml-auto flex items-center gap-4">
          {/* Currency Dropdown */}
          <div
            ref={dropRef}
            onClick={() => setOpenDropCurrency(!openDropCurrency)}
            className="flex items-center gap-1 cursor-pointer relative"
          >
            {activeCurrency && (
              <p className="text-[12px] font-medium flex items-center gap-1">
                <Flag
                  code={getFlagCode(activeCurrency.code)}
                  className="size-4 rounded-sm"
                />
                {activeCurrency.symbol} {activeCurrency.code}
              </p>
            )}
            <FaArrowDown className="size-3 text-gray-500" />
            {openDropCurrency && (
              <ul className="z-[999999999999] min-w-[150px] flex flex-col items-start bg-white border border-gray-300 rounded-md shadow-sm absolute top-6 -left-5">
                {currencies.map((currency, index) => (
                  <li
                    onClick={() => selectCurrency(currency)}
                    key={index}
                    className="flex items-center gap-2 py-1.5 w-full cursor-pointer hover:bg-gray-200 duration-200 px-2"
                  >
                    <Flag
                      code={getFlagCode(currency.code)}
                      className="size-4 rounded-sm"
                    />
                    <p className="whitespace-nowrap text-xs">
                      {currency.symbol} {currency.code}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Language Switch */}
          <LanguageBtns />
        </div>
      </div>
    </div>
  );
}
