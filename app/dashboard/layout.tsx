import React from "react";
import Sidebar from "../_components/_dashboard/Sidebar";
import Topbar from "../_components/_dashboard/Topbar";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mada Plus - Dashboard",
  description: "Mada Plus",
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Topbar />
      <div className="flex items-start gap-1 h-fit max-md:overflow-visible overflow-hidden">
        <Sidebar />
        <div className="w-full h-full overflow-y-auto duration-200 mt-20  ">
          {children}
        </div>
      </div>
    </>
  );
}
