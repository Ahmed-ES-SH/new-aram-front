"use client";
import React from "react";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { FaTrash } from "react-icons/fa";
import Minicard from "./MiniCard";
import { useLocale } from "next-intl";
import { useAppDispatch, useAppSelector } from "@/app/Store/hooks";
import {
  decreaseQuantity,
  increaseQuantity,
  removeItem,
} from "@/app/Store/cartItemsSlice";

export default function CartItem({ item }: any) {
  const locale = useLocale();
  const { activeCurrency } = useAppSelector((state) => state.variables);
  const dispatch = useAppDispatch();

  const handleRemoveItem = (itemId) => {
    dispatch(removeItem(itemId));
  };

  const handleIncreaseQuantity = (itemId) => {
    dispatch(increaseQuantity(itemId));
  };

  const handleDecreaseQuantity = (itemId) => {
    dispatch(decreaseQuantity(itemId));
  };

  const Currency = 1;

  return (
    <>
      <li className="flex items-center gap-4 pb-4 border-b last:border-b-0">
        <Minicard bg_img={item.image ? item.image : "/cards/card_1.jpg"} />

        <div>
          <h3 className="text-sm text-gray-900 dark:text-secend_text">
            {locale == "EN" ? item.title_en : item.title_ar}
          </h3>
          <div className="text-[12px] flex items-center gap-1 dark:text-white">
            {locale == "EN" ? "price" : "السعر"} :
            <span className="px-2  font-bold text-[13px] dark:text-white">
              <div className="flex items-center gap-1">
                <span>{activeCurrency.symbol}</span>
                <p>{Number(Currency * item.price).toFixed(2)}</p>
              </div>
            </span>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-end gap-2">
          <div>
            <label htmlFor="Quantity" className="sr-only">
              {locale == "EN" ? "Quantity" : "الكمية"}
            </label>

            <div className="flex items-center justify-center  border dark:border-gray-600 rounded-sm shadow-sm px-2">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleDecreaseQuantity(item?.id)}
                  type="button"
                  className="  text-gray-600 transition hover:opacity-75"
                >
                  <AiOutlineMinus />
                </button>
                <p className="dark:text-white p-2 text-center">
                  {item.quantity}
                </p>
                <button
                  onClick={() => handleIncreaseQuantity(item?.id)}
                  type="button"
                  className="  text-gray-600 transition hover:opacity-75"
                >
                  <AiOutlinePlus />
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={() => handleRemoveItem(item?.id)}
            className="text-gray-600 transition hover:text-red-600 duration-200"
          >
            <FaTrash className="h-4 w-4" />
          </button>
        </div>
      </li>
    </>
  );
}
