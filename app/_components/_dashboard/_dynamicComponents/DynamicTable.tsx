"use client";
import { instance } from "@/app/_helpers/axios";
import useFetchData from "@/app/_helpers/FetchDataWithAxios";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { FaEdit, FaSort, FaTrash } from "react-icons/fa";
import Img from "../../Img";
import { formatDate } from "@/app/_helpers/dateHelper";
import {
  cellType,
  ItemDataType,
} from "@/app/types/_dashboard/DynamicTableTypes";
import LoadingSpin from "../../LoadingSpin";
import Pagination from "../../PaginationComponent";
import ConfirmDeletePopup from "../../_popups/ConfirmDeletePopup";
import SuccessAlart from "../../_popups/SuccessAlart";
import ErrorAlart from "../../_popups/ErrorAlart";
import SearchInput from "../SearchInput";
import { useRouter } from "next/navigation";
import NoDataFounded from "../NoDataFounded";

interface props {
  api: string;
  deletedApi: string;
  headers: string[];
  itemDirect: string;
  keys: cellType[];
  searchState?: boolean;
  searchApi: string;
}

export default function DynamicTable({
  api,
  searchApi,
  deletedApi,
  headers,
  keys,
  itemDirect,
  searchState = true,
}: props) {
  const { data, currentPage, setData, setCurrentPage, lastPage, loading } =
    useFetchData(api, true);
  const router = useRouter();
  ///////////////////////////////////////////
  // Start  Stats Lines  ////////////////
  ///////////////////////////////////////////

  const [confirmDeletePopup, setConfirmDeletePopup] = useState<boolean>(false);
  const [successPopup, setSuccessPopup] = useState<boolean>(false);
  const [errorPopup, setErrorPopup] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [query, setQuery] = useState<string>("");
  const [dataType, setDataType] = useState<"default" | "search">("default");
  const [currentData, setCurrentData] = useState([]);
  const [searchData, setSearchData] = useState([]);
  const [loadingState, setLoadingState] = useState(loading);
  const [defaultlastPage, setDefaultLastPage] = useState(lastPage);
  const [defaultcurrentPage, setDefaultCurrentPage] = useState(currentPage);
  const [searchCurrentPage, setSearchCurrentPage] = useState(1);
  const [searchLastPage, setSearchLastPage] = useState(1);

  const onEdit = true;
  const onDelete = true;

  ///////////////////////////////////////////
  // End  Stats Lines  ////////////////
  ///////////////////////////////////////////

  ///////////////////////////////////////////
  // Start  Functions Lines  ////////////////
  ///////////////////////////////////////////

  const handlePageChange = (page: number) => {
    if (dataType === "default") {
      setCurrentPage(page); // هذا من useFetchData
      setDefaultCurrentPage(page);
    } else {
      setSearchCurrentPage(page);
      fetchSearchData();
    }
  };

  const handleClose = () => {
    setConfirmDeletePopup(false);
  };

  const handleCloseAlart = () => {
    setSuccessPopup(false);
    setErrorPopup(false);
  };

  const handleRoute = (direct: string) => {
    router.push(direct);
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await instance.delete(`${deletedApi}/${id}`);

      if (response.status === 200) {
        setData((prev: any) => prev.filter((item: any) => item.id !== id));

        setSuccessPopup(true);
        setSuccessMessage("تم حذف العنصر المحدد بنجاح  .");
        setConfirmDeletePopup(false);
      }
    } catch (error) {
      console.error("Error deleting item:", error);

      setErrorMessage("حدث خطأ أثناء الحذف. الرجاء المحاولة مرة أخرى.");
    }
  };

  const handleConfirmDelete = (item: ItemDataType) => {
    setConfirmDeletePopup(true);
    setSelectedItem(item);
  };

  const fetchSearchData = async () => {
    setLoadingState(true);
    try {
      setDataType("search");
      const response = await instance.post(searchApi, { query: query });

      if (response.status === 200) {
        setSearchData(response.data.data);
        setSearchLastPage(response.data.meta?.last_page || 1);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingState(false);
    }
  };
  const fetchShowData = () => {
    switch (dataType) {
      case "default":
        setCurrentData(data);
        setLoadingState(loading);
        setDefaultCurrentPage(currentPage);
        setDefaultLastPage(lastPage);
        break;

      case "search":
        setCurrentData(searchData);
        setLoadingState(loading);
    }
  };
  useEffect(() => {
    setLoadingState(loading);
  }, [loading]);

  useEffect(() => {
    if (query.length === 0) {
      setDataType("default");
      setSearchData([]);
    }
  }, [query]);

  useEffect(() => {
    fetchShowData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataType, data, searchData]);

  ///////////////////////////////////////////
  // End  Functions Lines  ////////////////
  ///////////////////////////////////////////

  return (
    <div className="w-full min-h-screen mb-8 hidden-scrollbar">
      {searchState && (
        <SearchInput
          handleSearch={fetchSearchData}
          setSearchContent={setQuery}
        />
      )}
      <motion.div
        className="overflow-x-auto rounded-lg w-[98%] mx-auto h-fit   shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <table className="w-full border-gray-300 border border-collapse">
          {/* الرؤوس */}
          <thead className="bg-primary-boldgray text-white">
            <tr>
              {headers.map((header, index) => (
                <th
                  key={index}
                  className="px-6 whitespace-nowrap py-3 text-left text-sm font-semibold tracking-wider"
                >
                  {header}
                  <FaSort className="inline-block ml-2 cursor-pointer text-second_text" />
                </th>
              ))}
              {(onEdit || onDelete) && <th className="px-6 py-3">الإجراءات</th>}
            </tr>
          </thead>

          {/* محتوى الجدول */}
          <tbody>
            {loadingState ? (
              <tr>
                <td
                  colSpan={headers.length + (onEdit || onDelete ? 1 : 0)}
                  className="text-center py-6"
                >
                  <LoadingSpin />
                </td>
              </tr>
            ) : currentData.length > 0 ? (
              currentData.map((item: ItemDataType, index) => (
                <motion.tr
                  key={index}
                  className="border-b transition-all hover:bg-secondery_dash"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {/* هنا ترسم كل خلايا الصف بناءً على نوعها */}
                  {keys.map((cell: cellType, i) => {
                    if (cell.cellType === "text") {
                      return (
                        <td
                          key={i}
                          className="px-6 py-4 text-second_text text-md"
                        >
                          {item[cell.key]}
                        </td>
                      );
                    }
                    if (cell.cellType === "image") {
                      return (
                        <td key={i} className="px-6 py-4">
                          <Img
                            src={
                              item[cell.key]
                                ? item[cell.key]
                                : item["gender"] == "male"
                                ? "/defaults/male-noimage.jpg"
                                : "/defaults/female-noimage.jpg"
                            }
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        </td>
                      );
                    }
                    if (cell.cellType === "date") {
                      return (
                        <td
                          key={i}
                          className="px-6 py-4 text-second_text text-md"
                        >
                          {formatDate(item[cell.key])}
                        </td>
                      );
                    }
                    if (cell.cellType === "status") {
                      return (
                        <td
                          key={i}
                          className="px-6 py-4 text-white text-center text-md"
                        >
                          <span
                            className={`px-2 py-1 w-[150px] block text-center rounded-lg ${
                              item[cell.key] === cell.conditions?.green
                                ? "bg-green-300"
                                : item[cell.key] === cell.conditions?.red
                                ? "bg-red-300"
                                : "bg-yellow-200 text-black"
                            }`}
                          >
                            {item[cell.key]}
                          </span>
                        </td>
                      );
                    }

                    return null;
                  })}

                  {(onEdit || onDelete) && (
                    <td className="px-6 py-4 flex space-x-4">
                      <div className="w-fit mx-auto flex items-center gap-4">
                        {onEdit && (
                          <button
                            onClick={() =>
                              handleRoute(`/dashboard/${itemDirect}/${item.id}`)
                            }
                            className="text-blue-500 hover:text-blue-700 cursor-pointer"
                          >
                            <FaEdit size={20} />
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={() => handleConfirmDelete(item)}
                            className="text-red-500 cursor-pointer hover:text-red-700"
                          >
                            <FaTrash size={20} />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </motion.tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={headers.length + (onEdit || onDelete ? 1 : 0)}
                  className="py-6 text-gray-400 text-center"
                >
                  <NoDataFounded />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </motion.div>
      <Pagination
        currentPage={
          dataType === "default" ? defaultcurrentPage : searchCurrentPage
        }
        totalPages={dataType === "default" ? defaultlastPage : searchLastPage}
        onPageChange={handlePageChange}
      />
      <ConfirmDeletePopup
        title={
          selectedItem && selectedItem.name
            ? selectedItem.name
            : selectedItem?.title_en || ""
        }
        id={selectedItem?.id ?? 0}
        showConfirm={confirmDeletePopup}
        onDelete={() => handleDelete(selectedItem.id)}
        onClose={handleClose}
      />
      <SuccessAlart
        Message={successMessage}
        showAlart={successPopup}
        onClose={handleCloseAlart}
      />
      <ErrorAlart
        Message={errorMessage}
        showAlart={errorPopup}
        onClose={handleCloseAlart}
      />
    </div>
  );
}
