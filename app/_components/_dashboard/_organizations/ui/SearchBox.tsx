"use client";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface props {
  placeholder?: string;
}

export default function SearchBox({
  placeholder = "ابحث عن العناصر المستهدفة هنا ...",
}: props) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const [search, setSearch] = useState(searchParams.get("query") ?? "");

  // ✅ keep input in sync with URL changes
  useEffect(() => {
    const queryParam = searchParams.get("query") ?? "";
    setSearch(queryParam);
  }, [searchParams]);

  // Debounce logic
  useEffect(() => {
    const handler = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());

      if (search.trim()) {
        params.set("query", search.trim());
      } else {
        params.delete("query");
      }

      params.set("page", "1"); // reset page
      router.replace(`${pathname}?${params.toString()}`);
    }, 400);

    return () => clearTimeout(handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  return (
    <input
      type="text"
      placeholder={placeholder}
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="w-full outline-none pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-[12px]"
    />
  );
}
