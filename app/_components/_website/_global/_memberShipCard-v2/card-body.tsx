"use client";

import type { MembershipCardData } from "./types";
import { FiUser, FiCalendar } from "react-icons/fi";

interface CardBodyProps {
  data: MembershipCardData;
  t: (key: string) => string;
}

export function CardBody({ data, t }: CardBodyProps) {
  return (
    <div className="px-4 py-2 space-y-3">
      {/* Holographic stripe */}
      <div className="h-8 -mx-4 holographic-stripe flex items-center px-4">
        <span className="text-[10px] text-primary font-mono tracking-[0.3em] opacity-80">
          ●●●● ●●●● ●●●● {data?.memberId ? "●●●●" : data?.memberId?.slice(-4)}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5">
            <FiUser className="w-3 h-3 text-amber-400" />
            <span className="text-[9px] text-white/70 uppercase tracking-wider">
              {t("membershipCard.memberIdLabel")}
            </span>
          </div>
          <p className="text-xs font-mono text-white tracking-wider">
            {data?.memberId ?? ""}
          </p>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-1.5">
            <FiCalendar className="w-3 h-3 text-amber-400" />
            <span className="text-[9px] text-white/70 uppercase tracking-wider">
              {t("membershipCard.validThruLabel")}
            </span>
          </div>
          <p className="text-xs font-mono text-white">{data.validThru}</p>
        </div>
      </div>

      {/* Member Name - Embossed Style */}
      <div className="pt-1">
        <p
          className="text-lg font-semibold text-white tracking-wide embossed-text drop-shadow-lg"
          style={{
            textTransform: "uppercase",
            letterSpacing: "0.15em",
          }}
        >
          {data?.memberName ?? ""}
        </p>
      </div>
    </div>
  );
}
