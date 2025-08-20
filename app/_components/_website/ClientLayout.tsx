"use client";
import { fetchActiveCardCategories } from "@/app/Store/cardCategorySlice";
import { fetchActiveCategories } from "@/app/Store/categoriesSlice";
import { useAppDispatch } from "@/app/Store/hooks";
import { store } from "@/app/Store/store";
import { fetchCurrentUser } from "@/app/Store/userSlice";
import { setLocale, setWidth } from "@/app/Store/variablesSlice";
import { useParams } from "next/navigation";
import React, { useEffect } from "react";
import { Provider } from "react-redux";

type ClientLayoutProps = {
  children: React.ReactNode; // النوع المناسب لـ children
};

export default function ClientLayout({ children }: ClientLayoutProps) {
  const dispatch = useAppDispatch();
  const params = useParams();
  const locale = params.locale;

  useEffect(() => {
    if (locale) {
      dispatch(setLocale(locale as "en" | "ar"));
    }
  }, [dispatch, locale, params]);

  useEffect(() => {
    const updateWidth = () => {
      dispatch(setWidth(window.innerWidth));
    };

    // التعيين عند أول تحميل
    updateWidth();

    // التحديث عند تغيير حجم الشاشة
    window.addEventListener("resize", updateWidth);

    // تنظيف الـ listener عند إزالة الـ component
    return () => {
      window.removeEventListener("resize", updateWidth);
    };
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchActiveCategories());
    dispatch(fetchCurrentUser());
    dispatch(fetchActiveCardCategories());
  }, [dispatch]);

  return (
    <>
      <Provider store={store}>{children}</Provider>
    </>
  );
}
