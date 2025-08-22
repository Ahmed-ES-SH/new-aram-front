"use client";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SearchBox() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const [search, setSearch] = useState(searchParams.get("query") ?? "");

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
    }, 400); // 400ms delay

    return () => clearTimeout(handler);
  }, [search, pathname, router, searchParams]);

  return (
    <input
      type="text"
      placeholder="ابحث عن العناصر المستهدفة هنا ..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="w-full outline-none pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-[12px]"
    />
  );
}
