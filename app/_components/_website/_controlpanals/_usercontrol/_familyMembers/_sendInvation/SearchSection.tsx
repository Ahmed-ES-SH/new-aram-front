import { FiSearch } from "react-icons/fi";
import { SearchSectionProps } from "./types";

export default function SearchSection({
  query,
  onQueryChange,
  searchInputRef,
  searchPlaceholder,
  selectedText,
}: SearchSectionProps) {
  return (
    <div className="mb-4">
      <label className="sr-only" htmlFor="si-search">
        {searchPlaceholder}
      </label>
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            id="si-search"
            ref={searchInputRef}
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full outline-none rounded-lg border border-gray-300 p-3 pl-10"
          />
        </div>
      </div>
      <p className="mt-2 text-sm text-gray-500">{selectedText}</p>
    </div>
  );
}
