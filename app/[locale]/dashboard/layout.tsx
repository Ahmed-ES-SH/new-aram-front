import React from "react";
import { Metadata } from "next";
import Topbar from "@/app/_components/_dashboard/Topbar";
import Sidebar from "@/app/_components/_dashboard/Sidebar";

export const metadata: Metadata = {
  title: "Aram Gulf - Dashboard",
  description: "Aram Gulf",
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Topbar />
      <div className="flex items-start w-full gap-1 h-fit max-md:overflow-visible z-[99]">
        <Sidebar />
        <div className="w-full h-full overflow-y-auto duration-200 mt-20  ">
          {children}
        </div>
      </div>
    </>
  );
}
