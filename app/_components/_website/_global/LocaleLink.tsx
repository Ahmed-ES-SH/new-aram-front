"use client";
import { RootState } from "@/app/Store/store";
import Link from "next/link";
import React, { ReactNode } from "react";
import { useSelector } from "react-redux";

interface LocaleLinkProps {
  children: ReactNode;
  className?: string;
  href: string;
}

export default function LocaleLink({
  children,
  className,
  href,
}: LocaleLinkProps) {
  const { locale } = useSelector((state: RootState) => state.variables);
  const formattedHref = `/${locale}/${href}`.replace(/\/+/g, "/");
  return (
    <Link href={formattedHref} className={`${className} block outline-none`}>
      {children}
    </Link>
  );
}
