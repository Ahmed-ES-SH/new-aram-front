"use client";
import { directionMap } from "@/app/constants/_website/global";
import { useLocale } from "next-intl";
import { usePathname } from "next/navigation";
import React from "react";

export default function NavDiv({ children }: { children: React.ReactNode }) {
  const locale = useLocale();
  const pathname = usePathname();

  if (pathname.includes("/dashboard")) {
    return null;
  }

  return (
    <div dir={directionMap[locale]} className="z-[99] relative">
      {children}
    </div>
  );
}
