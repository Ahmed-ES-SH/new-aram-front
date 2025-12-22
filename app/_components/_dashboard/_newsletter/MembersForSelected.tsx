"use client";
import React, { useEffect, useState } from "react";
import { MdSignalCellularNodata } from "react-icons/md";
import { motion } from "framer-motion";
import { FaCrosshairs, FaSearch, FaTrash } from "react-icons/fa";
import { LuSearch } from "react-icons/lu";
import { FaEnvelope, FaCalendar } from "react-icons/fa";
import { instance } from "@/app/_helpers/axios";
import LoadingSpin from "../../LoadingSpin";
import Pagination from "../../PaginationComponent";
import NoDataFounded from "../NoDataFounded";
import MessageForm from "./MessageForm";
import SuccessAlart from "../../_popups/SuccessAlart";

export default function MembersForSelected() {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastpage] = useState(1);
  const [isSearching, setIsSearching] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [selectCurrentData, setSelectCurrentData] = useState("DefaultData");
  const [searchCurrentPage, setSearchCurrentPage] = useState(1);
  const [searchLastPage, setSearchLastPage] = useState(1);
  const [searchResult, setSearchResult] = useState([]);
  const [contentSearch, setContentSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [memberId, setMemberId] = useState<any>(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [allUsersIds, setAllUsersIds] = useState<any>([]); // حالة لتخزين المستخدمين المحددين
  const [show, setshow] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState<any>([]);

  // دالة لإدارة اختيار المستخدم
  const handleSelectUser = (userId: number) => {
    if (selectedMembers.includes(userId)) {
      // إذا كان المستخدم محددًا بالفعل، قم بإزالته
      setSelectedMembers(selectedMembers.filter((id: number) => id !== userId));
    } else {
      // إذا لم يكن محددًا، قم بإضافته
      setSelectedMembers([...selectedMembers, userId]);
    }
  };

  useEffect(() => {
    const getdata = async (page: number) => {
      try {
        const response = await instance.get(`/members?page=${page}`);
        if (response.status == 200) {
          const data = response.data.data;
          const pagination = response.data.pagination;
          setUsers(data);
          setCurrentPage(pagination.current_page);
          setLastpage(pagination.last_page);
        }
      } catch (error: any) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    getdata(currentPage);
  }, [currentPage]);

  useEffect(() => {
    const getusersids = async () => {
      try {
        const response = await instance.get(`/get-members-ids`);
        setAllUsersIds(response.data.data);
      } catch (error: any) {
        console.log(error);
      }
    };
    getusersids();
  }, []);

  const getFilteredDataByTitle = async (title: string, page: number) => {
    if (title.trim() === "") {
      setSearchResult([]);
      setSelectCurrentData("DefaultData"); // العودة إلى البيانات الأصلية
      return;
    }
    setSearchResult([]);
    setSelectCurrentData("SearchData");
    try {
      setIsSearching(true);
      const response = await instance.post(
        `/members-by-email/${contentSearch}?page=${page}`
      );
      if (response.status === 200) {
        const data = response.data.data;
        const pagination = response.data.pagination;
        setSearchResult(data);
        setSearchCurrentPage(pagination.current_page);
        setSearchLastPage(pagination.last_page);
      }
    } catch (error: any) {
      console.error(error);
    } finally {
      setIsSearching(false);
    }
  };

  // تحديد البيانات الحالية للعرض
  const getCurrentData = () => {
    if (selectCurrentData === "SearchData" && contentSearch.length > 0) {
      return searchResult; // عرض نتائج البحث إذا كانت موجودة
    }
    return users; // عرض البيانات الافتراضية
  };

  // إعادة تعيين نتائج البحث إذا تم مسح حقل البحث
  useEffect(() => {
    if (contentSearch.trim() === "") {
      setSearchResult([]);
      setSelectCurrentData("DefaultData");
    }
  }, [contentSearch]);

  const handleSelectAllUsers = () => {
    if (selectAll) {
      setSelectedMembers([]);
    } else {
      setSelectedMembers(allUsersIds);
    }
    setSelectAll(!selectAll);
  };

  const getPaginationData = () => {
    switch (selectCurrentData) {
      case "SearchData":
        return {
          currentPage: searchCurrentPage,
          lastPage: searchLastPage,
          onPageChange: (newPage: number) => {
            setSearchCurrentPage(newPage);
            getFilteredDataByTitle(contentSearch, newPage);
          },
        };
      default:
        return {
          currentPage: currentPage,
          lastPage: lastPage,
          onPageChange: (newPage: number) => setCurrentPage(newPage),
        };
    }
  };

  const currentData = getCurrentData();
  const {
    currentPage: activePage,
    lastPage: activeLastPage,
    onPageChange,
  } = getPaginationData();

  const handleDelete = async (memberId: number) => {
    try {
      const response = await instance.delete(`/unsubscribe/${memberId}`);
      if (response.status === 200) {
        setShowSuccessPopup(true);
        setSelectCurrentData("DefaultData");
        setUsers(users.filter((user: any) => user.id != memberId));
        setSelectedMembers(
          selectedMembers.filter((user: number) => user !== memberId)
        );
        setAllUsersIds(allUsersIds.filter((id: number) => id !== memberId));
        setShowDeleteModal(false);
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  const confirmDelete = (memberId: number) => {
    setMemberId(memberId);
    setShowDeleteModal(true);
  };

  if (loading) return <LoadingSpin />;

  return (
    <>
      <MessageForm
        setSelectedMembers={setSelectedMembers}
        selectedMembers={selectedMembers}
        show={show}
        setshow={setshow}
      />
      <h1 className="pb-2 border-b text-xl text-black  border-main_orange ">
        عدد مشتركين النشرة البريدية :{" "}
        {allUsersIds.length > 0 ? allUsersIds.length : 0}
      </h1>
      <div className="w-full min-h-screen p-6 max-md:p-2 ">
        <h1 className="text-2xl max-md:text-[17px] w-fit mx-auto pb-3 border-b border-main_orange">
          حدد المشتركين
        </h1>
        <div
          style={{ direction: "rtl" }}
          className="inputsearch  mb-5 mt-2 flex items-center gap-2 relative w-[50%] max-lg:w-3/4 max-md:w-[97%] mx-auto"
        >
          <div className="flex items-center w-full gap-2 max-md:flex-col ">
            <div className="relative bg-white rounded-md shadow-md h-[40px] flex items-center justify-center w-full">
              <LuSearch
                className={`${"right-2"} top-1/2 text-secend_text size-5`}
              />
              <input
                type="text"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setContentSearch(e.target.value)
                }
                name="titlesearch"
                value={contentSearch}
                placeholder={"إبحث عن المشترك هنا  ..."}
                className="w-[90%] bg-transparent h-full pr-9 px-4 py-2 outline-none placeholder-shown:px-4 placeholder-shown:py-2 placeholder-shown:pr-9 placeholder-shown:text-[18px]"
              />
            </div>
            {
              <button
                onClick={() =>
                  getFilteredDataByTitle(contentSearch, searchCurrentPage)
                }
                className={`info-btn ${
                  contentSearch.length > 0
                    ? "opacity-100 block"
                    : "opacity-0 cursor-auto hidden"
                } `}
              >
                {"بحث"}
              </button>
            }
          </div>
        </div>
        {isSearching ? (
          // البحث جارٍ
          <motion.div
            className="flex flex-col items-center justify-center gap-4 min-h-[40vh]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <FaSearch className="size-20 text-main_orange" />
            </motion.div>
            <p className="text-lg text-gray-600">{"جاري البحث..."}</p>
          </motion.div>
        ) : (
          <motion.div
            className="overflow-auto p-4"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <table className="w-full border-collapse bg-white shadow-lg rounded-lg overflow-auto">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="py-3 px-4 text-right">
                    <div className="flex items-center gap-1">
                      <input
                        type="checkbox"
                        checked={selectAll}
                        onChange={handleSelectAllUsers}
                        className="form-checkbox h-5 w-5 text-blue-600"
                      />
                      <p>تحديد الكل</p>
                    </div>
                  </th>
                  <th className="py-3 px-4 text-right">
                    <div className="flex items-center gap-3 whitespace-nowrap">
                      <FaEnvelope className="inline-block mr-2" />
                      البريد الإلكترونى
                    </div>
                  </th>
                  <th className="py-3 px-4 text-right">
                    <div className="flex items-center gap-3 whitespace-nowrap">
                      <FaCalendar className="inline-block mr-2" />
                      وقت الإشتراك
                    </div>
                  </th>
                  <th className="py-3 px-4 text-right">
                    <div className="flex items-center gap-3 whitespace-nowrap">
                      <FaCrosshairs className="inline-block mr-2" />
                      إزالة
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                {users && currentData.length > 0 ? (
                  currentData.map((user: any) => (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`border-b border-gray-200 ${
                        selectedMembers.includes(user.id)
                          ? "bg-blue-50"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      <td className="py-3 px-4">
                        <input
                          type="checkbox"
                          checked={selectedMembers.includes(user.id)}
                          onChange={() => handleSelectUser(user.id)}
                          className="form-checkbox h-5 w-5 text-blue-600 rounded"
                        />
                      </td>
                      <td className="py-3 px-4">{user.email}</td>
                      <td className="py-3 px-4">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <FaTrash
                          className="size-6 text-red-400 cursor-pointer"
                          onClick={() => confirmDelete(user?.id)}
                        />
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4}>
                      {users.length === 0 ? (
                        <NoDataFounded />
                      ) : (
                        <div className="flex flex-col h-[60vh] items-center justify-center gap-4 py-8">
                          <MdSignalCellularNodata className="text-gray-400 size-40" />
                          <p className="text-gray-600 text-lg">
                            لا يوجد مستخدمين تطابق عمليات البحث حاليًا
                          </p>
                        </div>
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </motion.div>
        )}

        <Pagination
          currentPage={activePage}
          totalPages={activeLastPage}
          onPageChange={onPageChange}
        />
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-md shadow-md w-[300px] text-center">
            <h2 className="mb-4 text-lg font-semibold">تأكيد الحذف</h2>
            <p>هل أنت متأكد من أنك تريد حذف هذا العنصر؟</p>
            <div className="mt-4 flex justify-around">
              <button
                onClick={() => handleDelete(memberId)}
                className="px-4 py-2 bg-red-500 text-white rounded-md"
              >
                تأكيد
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-300 rounded-md"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
      <SuccessAlart
        showAlart={showSuccessPopup}
        Message={"تم حذف المشترك من النشرة البريدية بنجاح"}
        onClose={() => setShowSuccessPopup(false)}
      />
    </>
  );
}
