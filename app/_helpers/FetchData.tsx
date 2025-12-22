import { cookies } from "next/headers";
import { decryptToken } from "./helpers";

export default async function FetchData<T = any>(
  api: string,
  paginationState: boolean
): Promise<{ data: T; pagination?: any } | T | boolean> {
  try {
    const cookieStore = cookies();

    const localeValue = await (await cookieStore).get("aram_locale");
    const tokenValue = await (await cookieStore).get("aram_token");
    const token = tokenValue ? decryptToken(tokenValue.value) : undefined;
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      "Accept-Language": localeValue?.value || "en",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}${api}`,
      {
        method: "GET",
        headers,
        cache: "no-store", // important: disable caching for dynamic data
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();

    if (paginationState) {
      return {
        data: result.data || [],
        pagination: result.pagination || {},
      };
    }

    return result.data || [];
  } catch (error) {
    console.error("Error fetching data:", error);
    return false;
  }
}
