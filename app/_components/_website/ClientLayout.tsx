"use client";
import { useAppDispatch } from "@/app/Store/hooks";
import { store } from "@/app/Store/store";
import { setLocale } from "@/app/Store/variablesSlice";
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

  return (
    <>
      <Provider store={store}>{children}</Provider>
    </>
  );
}
