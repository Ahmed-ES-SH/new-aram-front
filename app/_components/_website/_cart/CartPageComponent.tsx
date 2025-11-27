"use client";
import { directionMap } from "@/app/constants/_website/global";
import { useLocale } from "next-intl";
import CartSidebar from "./CartSidebar";
import CartTableofData from "./CartTableofData";
import { useAppSelector } from "@/app/Store/hooks";
import { redirect } from "next/navigation";

export default function CartPageComponent() {
  const locale = useLocale();

  const { user } = useAppSelector((state) => state.user);

  if (!user) return redirect("/login");

  return (
    <>
      <div
        dir={directionMap[locale]}
        className="flex min-h-screen items-start max-xl:flex-col-reverse gap-4 max-xl:gap-2 p-6 max-md:p-2  mt-20 bg-white"
      >
        {/* cart table items  */}
        <CartTableofData />
        {/* cart sidebar summary */}
        <CartSidebar />
      </div>
    </>
  );
}
