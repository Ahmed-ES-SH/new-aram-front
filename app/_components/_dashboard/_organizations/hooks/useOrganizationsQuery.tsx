"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { instance } from "@/app/_helpers/axios";
import { Organization } from "../types/organization";

export function useOrganizationsQuery(
  initialData: Organization[],
  initialLast: number,
  initialTotal: number
) {
  const searchParams = useSearchParams();

  const [organizations, setOrganizations] = useState(initialData);
  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get("page")) || 1
  );
  const [lastPage, setLastPage] = useState(initialLast);
  const [total, setTotal] = useState(initialTotal);

  const [query, setQuery] = useState(searchParams.get("query") || "");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [fired, setFired] = useState(false);

  const buildQueryParams = useCallback(() => {
    return {
      page: currentPage,
      query: debouncedQuery,
      status: searchParams.get("status"),
      rating: searchParams.get("rating"),
      active: searchParams.get("active"),
      number_of_reservations: searchParams.get("number_of_reservations"),
      categories: searchParams.get("categories"),
    };
  }, [currentPage, debouncedQuery, searchParams]);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await instance.get("/dashboard/organizations", {
        params: buildQueryParams(),
      });

      setOrganizations(res.data.data);
      setLastPage(res.data.pagination.last_page);
      setTotal(res.data.pagination.total);
    } catch (err: any) {
      if (err?.status === 404) {
        setOrganizations([]);
        setLastPage(1);
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [buildQueryParams]);

  useEffect(() => {
    if (fired) fetchData();
  }, [
    fired,
    currentPage,
    debouncedQuery,
    searchParams.get("status"),
    searchParams.get("rating"),
    searchParams.get("active"),
    searchParams.get("number_of_reservations"),
    searchParams.get("categories"),
  ]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.length >= 3) {
        if (!fired) setFired(true);
        setDebouncedQuery(query);
      }
    }, 600);

    if (query.length === 0 && fired) {
      fetchData();
      setDebouncedQuery("");
    }

    return () => clearTimeout(timer);
  }, [query, fired, fetchData]);

  return {
    organizations,
    currentPage,
    lastPage,
    total,
    query,
    loading,
    setQuery,
    setCurrentPage,
    setOrganizations,
    trigger: () => setFired(true),
  };
}
