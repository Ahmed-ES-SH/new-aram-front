"use client";
import { useEffect, useState } from "react";
import { instance } from "./axios";

// Generic hook to fetch data from an API with optional pagination
export default function useFetchData<T>(api: string, paginationState: boolean) {
  const [data, setData] = useState<T | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState({});

  useEffect(() => {
    async function fetchData(page: number) {
      try {
        setLoading(true);
        window.scrollTo(0, 0); // Scroll to top when fetching new page
        const response = await instance.get(
          paginationState ? `${api}?page=${page}` : `${api}`
        );

        // If request is successful, update data and pagination state
        if (response.status === 200) {
          setData(response.data.data);
          if (paginationState && response.data.pagination) {
            const pagination = response.data.pagination;
            setCurrentPage(pagination.current_page);
            setLastPage(pagination.last_page);
          }
        }
      } catch (err) {
        // Catch and store any request error
        if (err) {
          setError(err);
        }
      } finally {
        setLoading(false); // Stop loading regardless of success or error
      }
    }

    // Trigger data fetching when dependencies change
    fetchData(currentPage);
  }, [api, paginationState, currentPage]);

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
