"use client";
import { store } from "@/app/Store/store";
import React from "react";
import { Provider } from "react-redux";

type ClientLayoutProps = {
  children: React.ReactNode; // النوع المناسب لـ children
};

export default function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <>
      <Provider store={store}>{children}</Provider>
    </>
  );
}
