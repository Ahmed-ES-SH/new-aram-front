import { cookies } from "next/headers";

export default async function FetchData<T = any>(
  api: string,
  paginationState: boolean
): Promise<{ data: T; pagination?: any } | T | { error: string }> {
  try {
    const cookieStore = cookies();

    const token = await (await cookieStore).get("aram_token");

    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token.value}`;
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
    return { error: "Something went wrong while fetching data." };
  }
}
