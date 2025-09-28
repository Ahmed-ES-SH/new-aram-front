import React from "react";
import Img from "./Img";
import { FaShoppingCart, FaEye } from "react-icons/fa";
import { Card } from "../../_dashboard/_cards/types";
import LocaleLink from "./LocaleLink";
import { formatTitle } from "@/app/_helpers/helpers";

type MiniCreditCardProps = {
  card: Card;
};

export default function MiniCreditCard({ card }: MiniCreditCardProps) {
  return (
    <div className="group relative w-full min-h-[200px] rounded-xl text-white shadow-lg flex flex-col justify-between overflow-hidden">
      {/* background image */}
      <Img
        src={card.image ?? "/cards/card_1.jpg"}
        errorSrc="/cards/card_1.jpg"
        className="w-full h-full absolute top-0 left-0 object-cover"
      />

      {/* overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* floating actions */}
      <div className="absolute top-3 right-3 flex gap-2 z-20 opacity-0 group-hover:opacity-100 transform -translate-y-2 group-hover:translate-y-0 transition-all duration-300">
        <button className="w-9 h-9 rounded-full bg-orange-500 hover:bg-orange-600 flex items-center justify-center text-white shadow-md hover:scale-110 transition">
          <FaShoppingCart size={16} />
        </button>
        <LocaleLink
          href={`/cards/${formatTitle(card.title)}?cardId=${card.id}`}
          className="w-9 h-9 rounded-full bg-blue-500 hover:bg-blue-600 flex items-center justify-center text-white shadow-md hover:scale-110 transition"
        >
          <FaEye size={16} />
        </LocaleLink>
      </div>

      {/* content */}
      <div className="relative z-10 p-4 mt-auto">
        <h3 className="text-sm font-bold">{card.title}</h3>
        <p className="text-xs text-gray-200 line-clamp-2">{card.description}</p>
      </div>
    </div>
  );
}
