"use client";
import { instance } from "@/app/_helpers/axios";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import LoadingSpin from "../../LoadingSpin";
import PaginationComponent from "../../PaginationComponent";

interface Member {
  id: number;
  email: string;
  name?: string; // Adjust based on API response
  // Add other member fields if necessary
}

interface MemberSelectionStepProps {
  selectedEmails: string[];
  setSelectedEmails: (emails: string[]) => void;
  onSubmit: (e) => void;
  onCancel: () => void;
  selectAll: boolean;
  setSelectAll: (val: boolean) => void;
}

export default function MemberSelectionStep({
  selectedEmails,
  setSelectedEmails,
  onSubmit,
  onCancel,
  selectAll,
  setSelectAll,
}: MemberSelectionStepProps) {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalMembers, setTotalMembers] = useState(0);

  // Fetch members with pagination and search
  const fetchMembers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.set("page", page.toString());
      if (search.length > 1) params.set("query", search);
      const res = await instance.get(`/members?${params.toString()}`);
      // Adjust structure based on actual API response
      // Assuming res.data.data is the array and res.data contains meta
      setMembers(res.data.data);
      setTotalPages(res.data.pagination.last_page);
      setTotalMembers(res.data.pagination.total);
    } catch (error) {
      console.error("Error fetching members", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchMembers();
    }, 500); // 500ms debounce
    return () => clearTimeout(timeout);
  }, [page, search]);

  const handleSelectAll = async () => {
    if (selectAll) {
      // Deselect all
      setSelectAll(false);
      setSelectedEmails([]);
      return;
    }

    try {
      setLoading(true);
      const res = await instance.get("/get-members-emails");

      // تأكد أن النتيجة Array<string>
      const allEmails: string[] = res.data.data.map(
        (item: any) => item.email ?? item
      );

      setSelectedEmails(allEmails);
      setSelectAll(true);
    } catch (error) {
      console.error("Error fetching all member emails", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleMember = (email: string) => {
    if (selectedEmails.includes(email)) {
      setSelectedEmails(selectedEmails.filter((e) => e !== email));
      setSelectAll(false); // If one is deselected, selectAll is false
    } else {
      setSelectedEmails([...selectedEmails, email]);
    }
  };

  return (
    <div className="flex flex-col h-full max-h-[70vh]">
      {/* Header / Search */}
      <div className="mb-4 flex gap-4 items-center justify-between">
        <div className="relative w-full max-w-sm">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="search by email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1); // Reset to page 1 on search
            }}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md   outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>
        <div className="text-sm text-gray-500  whitespace-nowrap">
          عدد الاشخاص المختارة:{" "}
          <span className="font-bold text-green-600">
            {selectedEmails.length}
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto border border-gray-300 rounded-md  relative">
        {loading && (
          <div className="absolute inset-0 bg-white/50  z-10 flex items-center justify-center">
            <LoadingSpin />
          </div>
        )}
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50  sticky top-0 z-0">
            <tr>
              <th className="p-3 w-10">
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
                  className="w-4 h-4 accent-green-500 cursor-pointer"
                />
              </th>
              <th className="p-3">Email</th>
              {/* Add more columns if needed */}
            </tr>
          </thead>
          <tbody className="divide-y ">
            {members.length > 0
              ? members.map((member) => (
                  <motion.tr
                    key={member.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`hover:bg-gray-50 -700 transition-colors ${
                      selectedEmails.includes(member.email)
                        ? "bg-green-50 /20"
                        : ""
                    }`}
                    onClick={() => toggleMember(member.email)}
                  >
                    <td className="p-3">
                      <input
                        type="checkbox"
                        checked={selectedEmails.includes(member.email)}
                        onChange={() => toggleMember(member.email)}
                        className="w-4 h-4 accent-green-500 cursor-pointer"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </td>
                    <td className="p-3">{member.email}</td>
                  </motion.tr>
                ))
              : !loading && (
                  <tr>
                    <td colSpan={2} className="p-8 text-center text-gray-500">
                      لا يوجد اعضاء للعرض
                    </td>
                  </tr>
                )}
          </tbody>
        </table>
      </div>

      {/* Footer / Actions */}
      <div className="mt-4 flex flex-col gap-4">
        <PaginationComponent
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />

        <div className="flex justify-end gap-3 mt-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md transition  -700"
          >
            إلغاء
          </button>
          <button
            onClick={onSubmit}
            disabled={selectedEmails.length === 0}
            className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            إرسال
          </button>
        </div>
      </div>
    </div>
  );
}
