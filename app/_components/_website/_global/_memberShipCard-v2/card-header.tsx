"use client";

import type { MembershipCardData } from "./types";

interface CardHeaderProps {
  data: MembershipCardData;
  t: (key: string) => string;
}

export function CardHeader({ data, t }: CardHeaderProps) {
  return (
    <div className="flex items-start justify-between p-4 pb-2">
      {/* Logo & Brand */}
      <div className="flex items-center gap-3">
        <div>
          <h3 className="text-sm font-semibold text-white tracking-wide drop-shadow-md">
            {data.title}
          </h3>
          <p className="text-[10px] text-white/70 uppercase tracking-widest">
            {t("membershipCard.exclusiveAccess")}
          </p>
        </div>
      </div>

      {/* Premium Badge */}
      <div
        className="px-3 py-1 bg-primary rounded-full metallic-gradient"
        style={{
          boxShadow:
            "0 2px 8px rgba(218, 165, 32, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.5)",
        }}
      >
        <span className="text-[10px] font-bold text-gray-900 tracking-widest">
          {t("membershipCard.premiumBadge")}
        </span>
      </div>
    </div>
  );
}
