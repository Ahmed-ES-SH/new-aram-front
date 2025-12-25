"use client";
import { useEffect } from "react";
import Cookie from "cookie-universal";
import LoadingPage from "@/app/_components/_website/_global/LoadingPage";
import { encryptToken } from "@/app/_helpers/helpers";
export default function AuthCallback() {
  const cookie = Cookie();
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const error = params.get("error");

    if (token) {
      // تخزين التوكن في localStorage
      cookie.set("aram_token", encryptToken(token));

      // إعادة التوجيه إلى الصفحة الرئيسية
      window.location.href = "/";
    } else if (error) {
      // عرض رسالة الخطأ للمستخدم
      console.error("Login failed:", error);
      alert("Login failed: " + error);

      // إعادة التوجيه إلى صفحة تسجيل الدخول
      window.location.href = "/login";
    }
  }, []);

  return (
    <div className="flex items-center justify-center h-screen">
      <LoadingPage />
    </div>
  );
}
