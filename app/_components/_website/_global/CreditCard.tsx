"use client";
import React, { useEffect, useState } from "react";
import Img from "./Img";
import { FaShoppingCart, FaEye, FaCheck } from "react-icons/fa";
import { Card } from "../../_dashboard/_cards/types";
import LocaleLink from "./LocaleLink";
import { formatTitle } from "@/app/_helpers/helpers";
import { useAppDispatch, useAppSelector } from "@/app/Store/hooks";
import { addItemWithOne, isItemInCart } from "@/app/Store/cartSlice";
import { toast } from "sonner";
import { useLocale } from "next-intl";

type CreditCardProps = {
  card: Card;
  brand?: string; // default = VISA
  type?: string; // default = Platinum
};

export default function CreditCard({
  card,
  brand = "VISA",
  type = "Platinum",
}: CreditCardProps) {
  const locale = useLocale();
  const successMessage =
    locale == "en"
      ? "The card has been added to the cart successfully!"
      : "تم إضافة البطاقة الى السلة بنجاح !";

  const { activeCurrency } = useAppSelector((state) => state.currency);
  const dispatch = useAppDispatch();

  const [isIncart, setIsIncart] = useState(false);

  const handleAddToCart = () => {
    dispatch(addItemWithOne(card));
    toast.success(successMessage);
    setIsIncart(true);
  };

  const inCart = useAppSelector((state) => isItemInCart(state, card?.id));

  useEffect(() => {
    setIsIncart(inCart);
  }, [inCart]);

  return (
    <div
      className={`group relative w-full min-h-[260px] h-full rounded-xl text-white shadow-2xl flex flex-col justify-between p-6 overflow-hidden`}
      dir="rtl"
    >
      <Img
        src={card.image ?? "/cards/card_1.jpg"}
        errorSrc="/cards/card_1.jpg"
        className="w-full h-full absolute top-0 left-0"
      />
      {/* overlay light effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(255,255,255,0.08)_0%,transparent_60%)] pointer-events-none" />

      {/* floating actions */}
      <div className="absolute top-3 right-3 flex gap-2 z-20 opacity-0 group-hover:opacity-100 transform translate-y-[-10px] group-hover:translate-y-0 transition-all duration-300">
        <button
          onClick={() => handleAddToCart()}
          disabled={isIncart} // prevent adding again if you want
          className={`w-9 h-9 rounded-full flex items-center justify-center text-white shadow-md transition 
    ${
      isIncart
        ? "bg-green-500 hover:bg-green-600 cursor-default"
        : "bg-orange-500 hover:bg-orange-600 hover:scale-110"
    }`}
        >
          {isIncart ? <FaCheck size={16} /> : <FaShoppingCart size={16} />}
        </button>
        <LocaleLink
          href={`/cards/${formatTitle(card.title)}?cardId=${card.id}`}
          className="w-9 h-9 rounded-full bg-blue-500 hover:bg-blue-600 flex items-center justify-center text-white shadow-md hover:scale-110 transition"
        >
          <FaEye size={16} />
        </LocaleLink>
      </div>

      {/* header */}
      <div className="flex justify-between items-start relative z-10">
        <div className="flex flex-col items-start gap-3">
          <div className="w-12 h-12 rounded-lg flex items-center justify-center font-bold text-lg">
            <Img src="/logo.png" className="w-10 h-10 object-contain" />
          </div>
          <div className="mb-2">
            <h3 className="text-sm font-bold text-gray-100">{card.title}</h3>
            <p className="text-[11px] text-gray-300">
              {card.description.length > 90
                ? card.description.slice(0, 90) + "..."
                : card.description}
            </p>
          </div>
        </div>
        {/* contactless */}
        <div className="relative w-7 h-7">
          <span className="absolute w-5 h-5 top-1 left-1 border-2 border-white/70 rounded-full border-r-transparent border-b-transparent"></span>
          <span className="absolute w-3 h-3 top-2 left-2 border-2 border-white/70 rounded-full border-r-transparent border-b-transparent"></span>
        </div>
      </div>

      {/* middle */}
      <div className="relative z-10">
        <div className="text-xl md:text-2xl tracking-[0.3em] font-bold text-center">
          {card.cardNumber}
        </div>
      </div>

      {/* footer */}
      <div className="flex justify-between items-end relative z-10 mt-2">
        <div>
          <div className="text-[9px] uppercase text-gray-300">Card Holder</div>
          <div className="text-sm font-semibold">{card.cardHolder}</div>
        </div>
        <div className="text-center">
          <div className="text-[9px] uppercase text-gray-300">Expires</div>
          <div className="text-sm font-semibold">{card.expiry}</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold italic tracking-wide">{brand}</div>
          <div className="text-xs text-gray-300">{type}</div>
        </div>
      </div>

      {/* price section */}
      {card.price != "NaN" && (
        <div className="relative z-10 mt-4 flex items-center justify-between bg-black/40 backdrop-blur-sm rounded-lg px-3 py-2">
          {card.price_before_discount && (
            <span className="text-sm line-through text-red-300 mr-2">
              {Number(
                Number(activeCurrency?.exchange_rate) *
                  Number(card.price_before_discount)
              ).toFixed(2)}{" "}
              {activeCurrency?.symbol}
            </span>
          )}
          <span className="text-lg font-bold text-green-400">
            {Number(
              Number(activeCurrency?.exchange_rate) * Number(card.price)
            ).toFixed(2)}{" "}
            {activeCurrency?.symbol}
          </span>
        </div>
      )}
    </div>
  );
}
