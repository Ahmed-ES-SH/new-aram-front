"use client";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import useFetchData from "@/app/_helpers/FetchDataWithAxios";
import Img from "../../_website/_global/Img";
import { LuCheck } from "react-icons/lu";
import { CiNoWaitingSign, CiSettings } from "react-icons/ci";
import { motion } from "framer-motion";
import Pagination from "../../PaginationComponent";

// Define user type
interface MiniUser {
  id: number;
  name: string;
  email: string;
  image: string;
}

interface Props {
  form: any;
  setForm: Dispatch<SetStateAction<any>>;
}

export default function UsersSelector({ form, setForm }: Props) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [users, setUsers] = useState<MiniUser[]>([]);

  const [allPublicIds, setAllPublicIds] = useState<{ id: number }[]>([]);
  const { data: usersIds } = useFetchData<{ id: number }[]>(
    `/get-public-users-ids`,
    false
  );

  // Fetch users with query
  const { data, loading, currentPage, lastPage, setCurrentPage } = useFetchData<
    MiniUser[]
  >(
    `/users-with-selected-data${
      debouncedQuery ? `?query=${debouncedQuery}&page=1` : ""
    }`,
    true,
    true
  );

  // Debounce effect (wait 0.5s after typing)
  useEffect(() => {
    const handler = setTimeout(() => {
      // Clear old users before sending new request
      setDebouncedQuery(query);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [query, currentPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= lastPage) {
      setCurrentPage(newPage);
    }
  };

  useEffect(() => {
    if (data) {
      setUsers(data);
    }
  }, [data]);

  // Toggle user selection
  const toggleUser = (user: MiniUser) => {
    setForm((prev: any) => {
      const exists = prev.users?.some((u: MiniUser) => u.id === user.id);

      return {
        ...prev,
        users: exists
          ? prev.users.filter((u: MiniUser) => u.id !== user.id)
          : [...(prev.users || []), user],
      };
    });
  };

  const toggleSelectAll = () => {
    if (!allPublicIds || allPublicIds.length === 0) return;

    setForm((prev: any) => {
      const currentSelectedIds =
        prev.users?.map((o: { id: number }) => o.id) || [];

      const allIds = allPublicIds.map((o) => o.id);

      const isAllSelected = allIds.every((id) =>
        currentSelectedIds.includes(id)
      );

      return {
        ...prev,
        users: isAllSelected ? [] : allPublicIds,
        // لو متحدد الكل → إفرغ القائمة
        // لو مش متحدد → حدد الكل
      };
    });
  };

  useEffect(() => {
    if (usersIds) {
      setAllPublicIds(usersIds);
    }
  }, [usersIds]);

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between max-md:flex-col gap-2 w-full">
        {/* Search Input */}
        <input
          type="text"
          placeholder="ابحث عن المستخدمين هنا..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1/2 max-md:w-full border-gray-300 outline-none p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {/* Select All Button */}
        {!loading && users.length > 0 && (
          <button
            type="button"
            onClick={toggleSelectAll}
            className="px-4 py-2 w-fit self-end whitespace-nowrap bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition"
          >
            {users.every((org) => form.users?.some((o) => o.id === org.id))
              ? "إلغاء تحديد الكل"
              : "تحديد الكل"}
          </button>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="w-full min-h-[40vh] flex items-center justify-center">
          <div className="flex flex-col gap-6">
            <motion.div
              animate={{ rotate: [360, 0, 360] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-fit h-fit"
            >
              <CiSettings className="size-32 text-primary" />
            </motion.div>
            <p className="text-gray-700 font-bold text-center">
              تحميل المستخدمين...
            </p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && debouncedQuery && users.length === 0 && (
        <div className="w-full min-h-[40vh] flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <CiNoWaitingSign className="size-32 text-red-500" />
            <p className="text-gray-600 font-semibold text-center">
              لم يتم العثور على مستخدمين
            </p>
          </div>
        </div>
      )}

      {/* Display Users */}
      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {users.map((user) => {
            const isSelected =
              form &&
              form.users &&
              form.users?.some((u: MiniUser) => u.id === user.id);

            return (
              <div
                key={user.id}
                onClick={() => toggleUser(user)}
                className={`cursor-pointer border rounded-lg p-4 flex flex-col items-center justify-center transition relative
                ${
                  isSelected
                    ? "border-green-500 bg-green-50 shadow-md"
                    : "border-gray-200 hover:border-blue-300"
                }`}
              >
                {isSelected && (
                  <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1">
                    <LuCheck size={14} />
                  </div>
                )}

                <Img
                  src={user.image}
                  alt={user.name}
                  className="w-16 h-16 object-cover mb-2 rounded-full"
                />
                <p
                  className={`text-sm font-medium text-center ${
                    isSelected ? "text-green-600" : "text-gray-700"
                  }`}
                >
                  {user.name}
                </p>
                <p className="text-xs text-gray-500 text-center">
                  {user.email}
                </p>
              </div>
            );
          })}
        </div>
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={lastPage}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
