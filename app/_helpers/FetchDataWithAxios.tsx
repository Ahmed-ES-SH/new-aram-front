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
          paginationState ? `${api}?page=${page}` : `${api}`
        );

        if (response.status === 200) {
          setData(response.data.data);

          if (paginationState && response.data.pagination) {
            const pagination = response.data.pagination;
            setCurrentPage(pagination.current_page);
            setLastPage(pagination.last_page);
          }
        }
      } catch (err) {
        if (err) {
          setError(err);
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
    loading,
    error,
  };
}
