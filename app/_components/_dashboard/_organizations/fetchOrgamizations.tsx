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
  const cookieStore = await cookies();
  const token = cookieStore.get(`aram_token`)?.value;
  return token ? `Bearer ${token}` : null;
};

export default async function FetchOrganizations({
  api,
  query,
  category_id,
  subCategories,
  page,
  status,
  rating,
  active,
  number_of_reservations,
}: {
  api: string;
  query?: string;
  category_id?: number[];
  subCategories?: number[];
  status?: string;
  active?: string;
  page?: number;
  rating?: number;
  number_of_reservations?: number;
}): Promise<ServicesResponse> {
  try {
    const searchParams = new URLSearchParams();
    const token = await getTokenFromCookies();

    if (query) searchParams.append("query", query);
    if (category_id?.length) {
      searchParams.append("category_id", category_id.join(","));
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
    if (subCategories) {
      searchParams.append("category_id", subCategories.join(","));
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

    if (!res.ok) {
      throw new Error(`Request failed: ${res.status} ${res.statusText}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Error in FetchServices:", error);
    throw error; // إعادة الإلقاء ليتم التعامل معها في المكون أو الـ useQuery
  }
}
