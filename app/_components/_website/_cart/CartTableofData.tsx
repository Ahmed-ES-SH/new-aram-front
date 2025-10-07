"use client";
import React from "react";
import { motion } from "framer-motion";
import LocaleLink from "../_global/LocaleLink";
import { FaTrash } from "react-icons/fa";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { BsCartX } from "react-icons/bs";
import { useAppDispatch, useAppSelector } from "@/app/Store/hooks";
import {
  decreaseQuantity,
  increaseQuantity,
  removeItem,
} from "@/app/Store/cartSlice";
import Minicard from "../_global/_cart/MiniCard";
import { useLocale, useTranslations } from "next-intl";
import { truncateContent } from "@/app/_helpers/helpers";

export default function CartTableofData() {
  const locale = useLocale();
  const t = useTranslations("cartPage");

  const { items } = useAppSelector((state) => state.cartSlice);
  const { activeCurrency } = useAppSelector((state) => state.currency);
  const dispatch = useAppDispatch();

  const headers = [
    {
      ar: "العنصر",
      en: "Product",
    },
    {
      ar: "الإسم",
      en: "Name",
    },
    {
      ar: "السعر",
      en: "Price",
    },
    {
      ar: "الكمية",
      en: "Quantity",
    },
    {
      ar: "إزالة",
      en: "Remove",
    },
  ];

  if (!activeCurrency) return null;

  return (
    <div className="xl:min-h-screen h-fit flex-1/2 max-xl:w-full flex-grow">
      <div className="table-products border border-gray-300 rounded-lg   h-fit max-xl:h-fit  overflow-auto  ">
        <table className="min-w-full  rounded-lg shadow-lg h-fit max-h-[60vh] overflow-x-auto bg-gray-100  text-sm">
          <thead className="ltr:text-left rtl:text-right border-b  border-gray-300">
            <tr>
              {headers.map((header, index) => (
                <th
                  key={index}
                  className="whitespace-nowrap ltr:text-left rtl:text-right  px-4 py-2 font-medium text-gray-900"
                >
                  {header[locale]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 ">
            {items && items.length > 0 ? (
              items.map((item, index) => (
                <tr className="h-[120px]" key={index}>
                  <td className="whitespace-nowrap  px-4 py-2 font-medium text-gray-900">
                    <div className="w-fit ltr:mr-auto rtl:ml-auto">
                      <Minicard
                        bg_img={item.image ? item.image : "/cards/card_1.jpg"}
                      />
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 h-[20px]  text-gray-700 ">
                    {truncateContent(item.title)}
                  </td>
                  <td className="whitespace-nowrap  px-4 py-2 h-[20px]  text-gray-700 ">
                    <div className="flex items-center gap-1">
                      <span>{activeCurrency.symbol}</span>
                      <p>
                        {activeCurrency?.symbol}{" "}
                        {(
                          Number(item.price) *
                          Number(activeCurrency?.exchange_rate)
                        ).toFixed(2)}
                      </p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 h-[20px]  text-gray-700 ">
                    <div className="flex items-center justify-center w-fit ltr:mr-auto rtl:ml-auto  border border-gray-300 rounded-sm shadow-sm px-2">
                      <div className="flex items-center gap-1 ">
                        <button
                          onClick={() => dispatch(decreaseQuantity(item.id))}
                          type="button"
                          className="  text-gray-600 transition hover:opacity-75"
                        >
                          <AiOutlineMinus />
                        </button>
                        <p className=" p-2 text-center">{item.quantity}</p>
                        <button
                          onClick={() => dispatch(increaseQuantity(item.id))}
                          type="button"
                          className="  text-gray-600 transition hover:opacity-75"
                        >
                          <AiOutlinePlus />
                        </button>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 h-[20px]  text-gray-700 ">
                    <button
                      onClick={() => dispatch(removeItem(item.id))}
                      className="cursor-pointer hover:text-red-600 duration-200 text-red-400"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={12} className="h-[45vh] w-full">
                  <motion.div
                    className="flex flex-col items-center"
                    initial={{ y: -20 }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <BsCartX className="text-6xl text-gray-400 mb-4 " />
                    <motion.h2
                      className="text-xl font-semibold text-gray-600"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3, duration: 0.6 }}
                    >
                      {t("emptyTitle")}
                    </motion.h2>
                    <motion.p
                      className="mt-2 text-gray-500"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5, duration: 0.6 }}
                    >
                      {t("emptyMessage")}
                    </motion.p>
                    <motion.button
                      className="mt-6 px-6 py-2 bg-primary text-white rounded-lg hover:bg-orange-500 transition"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.7, duration: 0.6 }}
                      onClick={() => (window.location.href = "/shop")} // إضافة الرابط إلى المتجر
                    >
                      <LocaleLink href={"/cards"}>
                        {t("startShopping")}
                      </LocaleLink>
                    </motion.button>
                  </motion.div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
