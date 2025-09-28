"use client";
import { useEffect, useState } from "react";
import { instance } from "./axios";

export default function useSearchData(api: string) {
  const [query, setQuery] = useState("");
  const [searchData, setSearchData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchCurrentPage, setSearchCurrentPage] = useState(1);
  const [searchLastPage, setSearchLastPage] = useState(1);
  const [error, setError] = useState(null);
  const [searchTrigger, setSearchTrigger] = useState(0); // يتحكم في تنفيذ البحث

  const fetchData = async () => {
    if (!query.trim()) {
      setSearchData([]);
      return;
    }

    try {
      setLoading(true);
      setSearchData([]);
      const response = await instance.post(
        `${api}?search_content=${encodeURIComponent(query)}`
      );
      if (response.status === 200) {
        const data = response.data.data;
        const pagination = response.data.pagination;
        setSearchData(data);
        setSearchCurrentPage(pagination.current_page);
        setSearchLastPage(pagination.last_page);
      }
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // تنفيذ البحث عند تغيير searchTrigger
  useEffect(() => {
    if (searchTrigger > 0) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTrigger]);

  // دالة البحث عند الضغط على زر البحث
  const handleSearch = () => {
    setSearchTrigger((prev) => prev + 1);
  };

  return {
    query,
    setQuery,
    searchData,
    loading,
    searchCurrentPage,
    searchLastPage,
    setSearchCurrentPage,
    error,
    handleSearch,
  };
}
