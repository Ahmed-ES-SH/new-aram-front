import { cookies } from "next/headers";
import { Organization } from "./types/organization";

interface Pagination {
  current_page: number;
  last_page: number;
}

interface ServicesResponse {
  data: Organization[];
  pagination: Pagination;
}

const getTokenFromCookies = async (): Promise<string | null> => {
  const cookieStore = await cookies(); // ✅ remove await
  const token = cookieStore.get(`aram_token`)?.value;
  return token ? `Bearer ${token}` : null;
};

export default async function FetchOrganizations({
  api,
  query,
  categories,
  subCategories,
  page,
  time,
  open_at,
  close_at,
  status,
  rating,
  active,
  number_of_reservations,
}: {
  api: string;
  query?: string;
  categories?: number[];
  subCategories?: number[];
  status?: string;
  active?: string;
  page?: number;
  time?: number;
  open_at?: number;
  close_at?: number;
  rating?: number;
  number_of_reservations?: number;
}): Promise<ServicesResponse> {
  try {
    const searchParams = new URLSearchParams();
    const token = await getTokenFromCookies();

    if (query) searchParams.append("query", query);
    if (categories?.length) {
      searchParams.append("categories", categories.join(","));
    }
    if (status !== undefined) {
      searchParams.append("status", String(status));
    }
    if (active !== undefined) {
      searchParams.append("active", active === "true" ? "1" : "0");
    }
    if (page) {
      searchParams.append("page", String(page));
    }
    if (time) {
      searchParams.append("time", String(time));
    }
    if (open_at) {
      searchParams.append("open_at", String(open_at));
    }
    if (close_at) {
      searchParams.append("close_at", String(close_at));
    }
    if (subCategories?.length) {
      searchParams.append("sub_categories", subCategories.join(","));
    }
    if (rating) {
      searchParams.append("rating", String(rating));
    }
    if (number_of_reservations) {
      searchParams.append(
        "number_of_reservations",
        String(number_of_reservations)
      );
    }

    const res = await fetch(
      `${
        process.env.NEXT_PUBLIC_API_BASE_URL
      }${api}?${searchParams.toString()}`,
      {
        headers: {
          Authorization: token || "",
        },
        cache: "no-store",
      }
    );

    if (res.status === 404) {
      // return empty response instead of breaking the app
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

    return await res.json();
  } catch (error) {
    console.error("Error in FetchOrganizations:", error);
    throw error;
  }
}
