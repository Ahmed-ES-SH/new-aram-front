"use client";
import { instance } from "@/app/_helpers/axios";
import { getBrowser } from "@/app/_helpers/getBrowser";
import { getDeviceType } from "@/app/_helpers/getDeviceType";
import { useUserCountry } from "@/app/_hooks/useUserCountry";
import { fetchActiveCardCategories } from "@/app/Store/cardCategorySlice";
import { fetchActiveCategories } from "@/app/Store/categoriesSlice";
import { useAppDispatch } from "@/app/Store/hooks";
import { store } from "@/app/Store/store";
import { fetchCurrentUser } from "@/app/Store/userSlice";
import { setLocale, setWidth } from "@/app/Store/variablesSlice";
import { useParams, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import { Provider } from "react-redux";
import Cookie from "cookie-universal";

type ClientLayoutProps = {
  children: React.ReactNode;
};

export default function ClientLayout({ children }: ClientLayoutProps) {
  const dispatch = useAppDispatch(); // Get Redux dispatch function
  const params = useParams();
  const searchParams = useSearchParams();
  const cookie = Cookie();

  // Fetch user's country and location data with permission status
  const { country, fullAddress, coordinates, loading, error, permission } =
    useUserCountry();

  const ref_code = searchParams.get("ref"); // Get referral code from URL query params
  const deviceType = getDeviceType(); // Detect device type (mobile/desktop/tablet)
  const browser = getBrowser(); // Detect browser type

  const locale = params.locale; // Get current locale from URL params

  // Function to send referral visit data to server
  const checkRefCode = async () => {
    try {
      const response = await instance.post(`/promotion-visit`, {
        ref_code,
        device_type: deviceType,
        browser,
        country,
        activity_type: "visit",
      });

      if (response.status === 200) {
        console.log(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Effect to handle referral tracking based on location permission status
  useEffect(() => {
    // Before decision → function doesn't run
    if (permission === "prompt") return;

    // User denied location access → run immediately
    if (permission === "denied") {
      if (ref_code) checkRefCode();
      return;
    }

    // User granted location access → wait until location fully loaded
    if (permission === "granted" && !loading) {
      if (ref_code) checkRefCode();
    }
  }, [permission, loading, ref_code]);

  // Effect to set locale in Redux store when it changes
  useEffect(() => {
    if (locale) {
      dispatch(setLocale(locale as "en" | "ar")); // Update locale in Redux store
      cookie.set("aram_locale", locale);
    }
  }, [dispatch, locale, params]);

  // Effect to track window width and update Redux store
  useEffect(() => {
    const updateWidth = () => {
      dispatch(setWidth(window.innerWidth)); // Update window width in Redux store
    };

    // Set width on initial load
    updateWidth();

    // Update width on window resize
    window.addEventListener("resize", updateWidth);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("resize", updateWidth);
    };
  }, [dispatch]);

  // Effect to fetch initial data on component mount
  useEffect(() => {
    dispatch(fetchActiveCategories()); // Fetch active categories
    dispatch(fetchCurrentUser()); // Fetch current user data
    dispatch(fetchActiveCardCategories()); // Fetch active card categories
  }, [dispatch]);

  return (
    <>
      {/* Wrap children with Redux Provider */}
      <Provider store={store}>{children}</Provider>
    </>
  );
}
