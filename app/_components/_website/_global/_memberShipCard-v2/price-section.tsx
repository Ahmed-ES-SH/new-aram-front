"use client";

import type { MembershipCardData } from "./types";

interface PriceSectionProps {
  data: MembershipCardData;
  t: (key: string) => string;
}

export function PriceSection({ data, t }: PriceSectionProps) {
  const price = Number(data.price);
  const priceBeforeDiscount = Number(data.price_before_discount);
  const discount = Math.round(
    ((priceBeforeDiscount - price) / priceBeforeDiscount) * 100
  );

  return (
    <div className="px-4 py-2 flex items-center justify-between">
      <div className="flex items-baseline gap-3">
        {/* Original Price */}
        <div className="flex items-baseline gap-1">
          <span className="text-[10px] text-gray-300 uppercase">
            {t("membershipCard.originalPriceLabel")}
          </span>
          <span className="text-sm text-white line-through decoration-red-400/60">
            {t("membershipCard.currencySymbol")}
            {priceBeforeDiscount}
          </span>
        </div>

        {/* Current Price */}
        <div className="flex items-baseline gap-1">
          <span className="text-[10px] text-primary uppercase font-semibold">
            {t("membershipCard.currentPriceLabel")}
          </span>
          <span
            className="text-2xl font-bold text-primary"
            style={{
              textShadow: "0 2px 4px rgba(218, 165, 32, 0.3)",
            }}
          >
            {t("membershipCard.currencySymbol")}
            {price}
          </span>
        </div>
      </div>

      {/* Discount Badge */}
      <div className="px-2 py-1 rounded-md bg-green-500/20 border border-green-500/30">
        <span className="text-xs font-bold text-green-400">-{discount}%</span>
      </div>
    </div>
  );
}
