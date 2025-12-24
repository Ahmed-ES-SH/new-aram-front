"use client";
import { useEffect, useState } from "react";
import { instance } from "./axios";

// Generic hook to fetch data from an API with optional pagination
export default function useFetchData<T>(
  api: string,
  paginationState: boolean,
  disableScroll: boolean = false // ✅ added prop to control scroll
) {
  const [data, setData] = useState<T | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState({});

  useEffect(() => {
    async function fetchData(page: number) {
      try {
        setLoading(true);

        // ✅ Only scroll to top if disableScroll = false
        if (!disableScroll) {
          window.scrollTo(0, 0);
        }

        const response = await instance.get(
          paginationState
            ? api.includes("page=") // ✅ check if page already exists
              ? api
              : `${api}${api.includes("?") ? "&" : "?"}page=${page}`
            : api
        );

        if (response.status === 200) {
          setData(response.data.data);

          if (paginationState && response.data.pagination) {
            const pagination = response.data.pagination;
            setCurrentPage(pagination.current_page);
            setLastPage(pagination.last_page);
            setTotal(pagination.total);
          }
        } else if (response.status === 204) {
          setData([] as any); // Clear data on No Content
          setCurrentPage(1);
          setLastPage(1);
          setTotal(0);
        }
      } catch (err) {
        if (err) {
          setError(err);
          setData([] as any); // Clear data on error to avoid showing old results
        }
      } finally {
        setLoading(false);
      }
    }

    fetchData(currentPage);
  }, [api, paginationState, currentPage, disableScroll]);

  return {
    data,
    setData,
    currentPage,
    setCurrentPage,
    lastPage,
    total,
    loading,
    error,
  };
}
