"use client";
import React from "react";
import Whatsappbtn from "./Whatsappbtn";
import N8nChat from "../_N8nChat/N8nChat";
import { usePathname } from "next/navigation";

export default function ChatBtns() {
  const pathname = usePathname();
  const dashboard = pathname.split("/")[1];

  if (dashboard == "dashboard") {
    return null;
  }
  return (
    <div className="flex flex-col items-center gap-2 z-9999 fixed bottom-5 right-5">
      <Whatsappbtn />
      <N8nChat webhookUrl="https://n8nwithhelal.shop/webhook/c4a09c88-96fa-40d4-899a-c52faceb466f/chat" />
    </div>
  );
}
