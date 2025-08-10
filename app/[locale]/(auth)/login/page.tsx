import { LoginForm } from "@/app/_components/_website/_auth/_login/LoginForm";
import React from "react";

export default function page() {
  return (
    <>
      <main className="min-h-screen bg-gray-50 mt-12 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl p-2 py-12 border border-gray-200 shadow-lg rounded-2xl">
          <LoginForm />
        </div>
      </main>
    </>
  );
}
