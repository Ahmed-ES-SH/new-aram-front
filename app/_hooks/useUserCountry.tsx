"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface LocationState {
  country: string | null;
  fullAddress: string | null;
  coordinates: { lat: number; lng: number } | null;
  loading: boolean;
  error: string | null;
  permission: "granted" | "denied" | "prompt";
}

export function useUserCountry() {
  const searchParams = useSearchParams();
  const ref_code = searchParams.get("ref");

  const [state, setState] = useState<LocationState>({
    country: null,
    fullAddress: null,
    coordinates: null,
    loading: false, // Start with loading false when no ref_code
    error: null,
    permission: "prompt",
  });

  useEffect(() => {
    // Don't run geolocation if ref_code doesn't exist
    if (!ref_code) {
      return; // Exit early without making any API calls
    }

    // Set loading to true only when ref_code exists
    setState((prev) => ({ ...prev, loading: true }));

    if (!navigator.geolocation) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: "Geolocation is not supported",
      }));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        // User granted permission
        const { latitude, longitude } = pos.coords;

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await res.json();

          const fullAddress = data.display_name || null;
          const country = data.address?.country ?? data.address?.state ?? null;

          setState({
            country,
            fullAddress,
            coordinates: { lat: latitude, lng: longitude },
            loading: false,
            error: null,
            permission: "granted",
          });
        } catch (err) {
          setState((prev) => ({
            ...prev,
            loading: false,
            permission: "granted",
            error: "Failed to fetch location",
          }));
        }
      },

      // Error callback → includes permission denial
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          setState((prev) => ({
            ...prev,
            loading: false,
            permission: "denied",
            error: "User denied location access",
          }));
        } else {
          setState((prev) => ({
            ...prev,
            loading: false,
            permission: "denied",
            error: "Unable to get location",
          }));
        }
      }
    );
  }, [ref_code]); // Add ref_code to dependency array

  return state;
}
