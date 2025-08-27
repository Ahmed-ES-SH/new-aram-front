import React from "react";
import Img from "./Img";

type CreditCardProps = {
  title: string;
  description: string;
  cardNumber: string;
  cardHolder: string;
  expiry: string; // "MM/YY"
  brand?: string; // "VISA" | "MasterCard"
  type?: string; // "Platinum" | "Gold" | "Black"
};

export default function CreditCard({
  title,
  description,
  cardNumber,
  cardHolder,
  expiry,
  brand = "VISA",
  type = "Platinum",
}: CreditCardProps) {
  return (
    <div
      className={`relative w-[380px] min-h-[240px] rounded-xl text-white shadow-2xl flex flex-col justify-between p-6 overflow-hidden`}
      dir="rtl"
    >
      <Img
        src="/cards/card_1.jpg"
        className="w-full h-full absolute top-0 left-0"
      />
      {/* overlay light effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(255,255,255,0.08)_0%,transparent_60%)] pointer-events-none" />

      {/* header */}
      <div className="flex justify-between items-start relative z-10">
        <div className="flex flex-col  items-start gap-3">
          <div className="w-12 h-12  rounded-lg flex items-center justify-center font-bold text-lg">
            <Img src="/logo.png" className="w-10 h-10 object-contain" />
          </div>
          <div className="mb-2">
            <h3 className="text-sm font-bold text-gray-100">{title}</h3>
            <p className="text-[11px] text-gray-300">
              {description.length > 90
                ? description.slice(0, 90) + "..."
                : description}
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
          {cardNumber}
        </div>
      </div>

      {/* footer */}
      <div className="flex justify-between items-end relative z-10">
        <div>
          <div className="text-[9px] uppercase text-gray-300">Card Holder</div>
          <div className="text-sm font-semibold">{cardHolder}</div>
        </div>
        <div className="text-center">
          <div className="text-[9px] uppercase text-gray-300">Expires</div>
          <div className="text-sm font-semibold">{expiry}</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold italic tracking-wide">{brand}</div>
          <div className="text-xs text-gray-300">{type}</div>
        </div>
      </div>
    </div>
  );
}
