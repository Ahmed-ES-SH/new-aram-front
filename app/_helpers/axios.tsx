"use client";
import axios from "axios";
import Cookie from "cookie-universal";

const cookie = Cookie();

export const main_api = "http://127.0.0.1:8000/api";

const getToken = () => {
  const userId = cookie.get("user_id"); // احصل على معرف المستخدم من الكوكيز
  if (!userId) return null;
  return cookie.get(`madaPlus_token-${userId}`); // جلب التوكن بناءً على معرف المستخدم
};

export const instance = axios.create({
  baseURL: main_api,
});

// إضافة التوكن قبل كل طلب تلقائيًا
instance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// التعامل مع الأخطاء تلقائيًا
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      console.error("Unauthorized! Redirecting to login...");
      // يمكنك إضافة إعادة توجيه لتسجيل الدخول هنا
    }
    return Promise.reject(error);
  }
);
