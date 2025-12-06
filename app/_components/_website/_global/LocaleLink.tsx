"use client";
import { RootState } from "@/app/Store/store";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { ReactNode, useCallback } from "react";
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
  const searchParams = useSearchParams();

  const getFormattedHref = useCallback(() => {
    const [pathname, queryString] = href.split("?");
    const newParams = new URLSearchParams(queryString || "");

    searchParams.forEach((value, key) => {
      if (!newParams.has(key)) {
        newParams.set(key, value);
      }
    });

    const localePath = `/${locale}/${pathname}`.replace(/\/+/g, "/");
    const finalQueryString = newParams.toString();

    return finalQueryString ? `${localePath}?${finalQueryString}` : localePath;
  }, [href, locale, searchParams]);

  const handleClick = () => {
    // Scroll to top when navigating to new page
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  return (
    <Link
      href={getFormattedHref()}
      className={`${className} block outline-none`}
      onClick={handleClick}
    >
      {children}
    </Link>
  );
}
