"use client";
import { RootState } from "@/app/Store/store";
import Link from "next/link";
import { useSearchParams } from "next/navigation"; // 1. استيراد useSearchParams
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
  const searchParams = useSearchParams(); // 2. جلب البارامترات الحالية

  // 3. دالة لدمج الرابط مع البارامترات
  const getFormattedHref = useCallback(() => {
    // فصل الرابط الأساسي عن البارامترات (إذا كانت موجودة في الـ href القادم)
    const [pathname, queryString] = href.split("?");

    // إنشاء كائن للبارامترات الجديدة بناءً على ما جاء في الـ href
    const newParams = new URLSearchParams(queryString || "");

    // دمج البارامترات الحالية (searchParams) مع الجديدة
    // الشرط: نضيف البارامتر الحالي فقط إذا لم يكن موجوداً بالفعل في الـ href الجديد
    searchParams.forEach((value, key) => {
      if (!newParams.has(key)) {
        newParams.set(key, value);
      }
    });

    // بناء المسار النهائي مع اللغة
    const localePath = `/${locale}/${pathname}`.replace(/\/+/g, "/");
    const finalQueryString = newParams.toString();

    // إرجاع الرابط كاملاً
    return finalQueryString ? `${localePath}?${finalQueryString}` : localePath;
  }, [href, locale, searchParams]);

  return (
    <Link
      href={getFormattedHref()}
      className={`${className} block outline-none`}
    >
      {children}
    </Link>
  );
}
