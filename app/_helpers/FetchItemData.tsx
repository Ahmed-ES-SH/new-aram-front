"use client";
import { useEffect, useState } from "react";
import { instance } from "./axios";

export default function useFetchItem<T>(
  api: string,
  id: number | string,
  paginationState: boolean
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState({});
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [lastPage, setLastPage] = useState<number>(1);

  useEffect(() => {
    if (!id) return;

    async function fetchItem(page: number) {
      try {
        setLoading(true);
        const response = await instance.get(`${api}/${id}?page=${page}`);
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

    fetchItem(currentPage);
  }, [api, id, paginationState, currentPage]);

  return {
    data,
    setData,
    loading,
    error,
    currentPage,
    setCurrentPage,
    lastPage,
  };
}
