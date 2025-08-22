"use client";
import { useEffect, useState } from "react";

interface Props {
  filters: any;
  setFilters: React.Dispatch<React.SetStateAction<any>>;
}

export default function ClientSearchBox({ filters, setFilters }: Props) {
  const [search, setSearch] = useState(filters.query || "");

  // Debounce update filters.query
  useEffect(() => {
    const handler = setTimeout(() => {
      setFilters((prev: any) => {
        if (prev.query === search) return prev; // avoid unnecessary updates
        return { ...prev, query: search };
      });
    }, 500);

    return () => clearTimeout(handler); // cleanup if user keeps typing
  }, [search, setFilters]);

  return (
    <input
      type="text"
      placeholder="ابحث عن العناصر المستهدفة هنا ..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="w-full outline-none pl-10 pr-4 py-2 border border-gray-300 rounded-lg 
                 focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                 placeholder:text-[12px]"
    />
  );
}
