"use client";
import { useSearchParams } from "next/navigation";

export const useParamByKey = (key: string) => {
  const searchParams = useSearchParams();
  return searchParams.get(key);
};
