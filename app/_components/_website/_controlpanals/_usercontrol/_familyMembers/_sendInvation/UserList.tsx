import { motion } from "framer-motion";
import Avatar from "./Avatar";
import { UserListProps } from "./types";

export default function UserList({
  results,
  loading,
  error,
  query,
  selected,
  highlightedIndex,
  onSelectUser,
  onHighlightUser,
  onRetry,
  columns,
  retryText,
  noResultsText,
  errorText,
}: UserListProps) {
  return (
    <div className="md:col-span-2">
      <div className="h-[48vh] overflow-y-auto rounded-lg border border-gray-300">
        <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-gray-300 bg-white p-3">
          <div className="text-sm font-medium text-gray-700">
            {columns.name}
          </div>
          <div className="text-sm text-gray-500">{columns.email}</div>
        </div>

        <div>
          {loading && <LoadingSkeleton />}

          {!loading && error && (
            <ErrorState
              errorText={errorText}
              onRetry={onRetry}
              retryText={retryText}
            />
          )}

          {!loading &&
            !error &&
            results.length === 0 &&
            query.trim() !== "" && <EmptyState message={noResultsText} />}

          {!loading && results.length > 0 && (
            <UserListItems
              results={results}
              selected={selected}
              highlightedIndex={highlightedIndex}
              onSelectUser={onSelectUser}
              onHighlightUser={onHighlightUser}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-2 p-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="animate-pulse rounded-md bg-gray-100 p-3" />
      ))}
    </div>
  );
}

function ErrorState({
  errorText,
  onRetry,
  retryText,
}: {
  errorText: string;
  onRetry: () => void;
  retryText: string;
}) {
  return (
    <div className="p-4">
      <div className="rounded-md border border-gray-300 p-4">
        <p className="mb-2 text-sm text-red-600">{errorText}</p>
        <div>
          <button
            onClick={onRetry}
            className="rounded-md border border-gray-300 px-3 py-1 text-sm"
          >
            {retryText}
          </button>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return <div className="p-4 text-sm text-gray-600">{message}</div>;
}

function UserListItems({
  results,
  selected,
  onSelectUser,
  onHighlightUser,
}: {
  results: any[];
  selected: any;
  highlightedIndex: number;
  onSelectUser: (user: any) => void;
  onHighlightUser: (index: number) => void;
}) {
  return (
    <ul>
      {results.map((user, idx) => {
        const isSelected = selected?.id === user.id;
        return (
          <li key={user.id}>
            <motion.button
              layout
              initial={false}
              whileHover={{ y: -2 }}
              onMouseEnter={() => onHighlightUser(idx)}
              onFocus={() => onHighlightUser(idx)}
              onClick={() => onSelectUser(user)}
              className={`group flex w-full items-center justify-between gap-4 border-b p-3 text-left focus:outline-none border-gray-300 hover:bg-primary/40 duration-300`}
              tabIndex={0}
            >
              <div className="flex items-center gap-3">
                <Avatar user={user} />
                <div>
                  <div className="text-sm font-medium">{user.name}</div>
                  <div className="text-xs text-gray-500">{user.email}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-xs text-gray-500">{user.phone ?? "-"}</div>
                <input
                  readOnly
                  aria-label={isSelected ? "selected" : "not selected"}
                  type="radio"
                  checked={isSelected}
                  onChange={() => onSelectUser(user)}
                  className="h-4 w-4 cursor-pointer"
                />
              </div>
            </motion.button>
          </li>
        );
      })}
    </ul>
  );
}
