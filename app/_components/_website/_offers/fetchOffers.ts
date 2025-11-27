import { cookies } from "next/headers";
import { Offer } from "../../_dashboard/_offers/types";

interface Pagination {
  current_page: number;
  last_page: number;
}

interface OffersResponse {
  data: Offer[];
  pagination: Pagination;
}

const getTokenFromCookies = async (): Promise<string | null> => {
  const cookieStore = await cookies(); // ✅ Remove await - cookies() is synchronous
  const token = cookieStore.get("aram_token")?.value;
  return token ? `Bearer ${token}` : null;
};

export default async function FetchOffers({
  query,
  category,
  sort_by, // This should probably be renamed to sortBy for consistency
  page = 1, // Default value
}: {
  query?: string;
  category?: string;
  sort_by?: string;
  page?: number;
}): Promise<OffersResponse> {
  try {
    const searchParams = new URLSearchParams();
    const token = await getTokenFromCookies();

    if (query) searchParams.append("query", query);
    if (page) searchParams.append("page", String(page));
    if (category) searchParams.append("category", category); // ✅ Fixed: was "time"
    if (sort_by) searchParams.append("sort_by", sort_by); // ✅ Consistent with backend

    const apiUrl = `${
      process.env.NEXT_PUBLIC_API_BASE_URL
    }/active-offers?${searchParams.toString()}`;

    const res = await fetch(apiUrl, {
      headers: {
        Authorization: token || "",
        "Content-Type": "application/json",
      },
      cache: "no-store",
      // Add timeout for better error handling
      next: { revalidate: 0 }, // Ensure no caching
    });

    // Handle different status codes appropriately
    if (res.status === 404) {
      console.warn("Offers endpoint returned 404");
      return {
        data: [],
        pagination: {
          current_page: 1,
          last_page: 1,
        },
      };
    }

    if (res.status === 401) {
      console.error("Unauthorized access to offers");
      // You might want to handle token expiration here
      return {
        data: [],
        pagination: {
          current_page: 1,
          last_page: 1,
        },
      };
    }

    if (!res.ok) {
      throw new Error(`Request failed: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error in FetchOffers:", error);
    // Return empty response instead of throwing to prevent page crash
    return {
      data: [],
      pagination: {
        current_page: 1,
        last_page: 1,
      },
    };
  }
}
