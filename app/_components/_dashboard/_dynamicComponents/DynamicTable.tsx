"use client";
import * as FaIcons from "react-icons/fa";
import { instance } from "@/app/_helpers/axios";
import useFetchData from "@/app/_helpers/FetchDataWithAxios";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { formatDate } from "@/app/_helpers/dateHelper";
import { cellType } from "@/app/types/_dashboard/DynamicTableTypes";
import LoadingSpin from "../../LoadingSpin";
import Pagination from "../../PaginationComponent";
import ConfirmDeletePopup from "../../_popups/ConfirmDeletePopup";
import SuccessAlart from "../../_popups/SuccessAlart";
import ErrorAlart from "../../_popups/ErrorAlart";
import SearchInput from "../SearchInput";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/app/Store/hooks";
import Img from "../../_website/_global/Img";
import { toast } from "sonner";

interface Props {
  api: string;
  deletedApi: string;
  headers: string[];
  itemDirect: string;
  keys: cellType[];
  searchState?: boolean;
  searchApi: string;
}

export default function DynamicTable<
  T extends {
    role?: string;
    id: number;
  }
>({
  api,
  searchApi,
  deletedApi,
  headers,
  keys,
  itemDirect,
  searchState = true,
}: Props) {
  const { data, currentPage, setData, setCurrentPage, lastPage, loading } =
    useFetchData<T>(api, true);
  const { user } = useAppSelector((state) => state.user);
  const router = useRouter();

  ///////////////////////////////////////////
  // Start  Stats Lines  ////////////////
  ///////////////////////////////////////////

  const [confirmDeletePopup, setConfirmDeletePopup] = useState<boolean>(false);
  const [successPopup, setSuccessPopup] = useState<boolean>(false);
  const [errorPopup, setErrorPopup] = useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [query, setQuery] = useState<string>("");
  const [dataType, setDataType] = useState<"default" | "search">("default");
  const [currentData, setCurrentData] = useState<T[]>([]);
  const [searchData, setSearchData] = useState([]);
  const [loadingState, setLoadingState] = useState(loading);
  const [defaultlastPage, setDefaultLastPage] = useState(lastPage);
  const [defaultcurrentPage, setDefaultCurrentPage] = useState(currentPage);
  const [searchCurrentPage, setSearchCurrentPage] = useState(1);
  const [searchLastPage, setSearchLastPage] = useState(1);
  const [onDelete] = useState(true);
  const [onEdit] = useState(true);

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
      setDeleteLoading(true);
      const response = await instance.delete(`${deletedApi}/${id}`);

      if (response.status === 200) {
        setData((prev: any) => prev.filter((item: any) => item.id !== id));

        setSuccessPopup(true);
        setSuccessMessage("تم حذف العنصر المحدد بنجاح  .");
        setConfirmDeletePopup(false);
      }
    } catch (error: any) {
      console.error("Error deleting item:", error);
      if (error?.response?.data?.message) {
        toast.error(error?.response?.data?.message);
      }
      setErrorMessage("حدث خطأ أثناء الحذف. الرجاء المحاولة مرة أخرى.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleConfirmDelete = (item: T) => {
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
        setCurrentData(data as any);
        setLoadingState(loading);
        setDefaultCurrentPage(currentPage);
        setDefaultLastPage(lastPage);
        break;

      case "search":
        setCurrentData(searchData);
        setLoadingState(loading);
    }
  };

  const getIconComponent = (iconName: string) => {
    return (
      FaIcons[iconName as keyof typeof FaIcons] || FaIcons.FaQuestionCircle
    );
  };

  // Helper to get nested value by key like "user.name"
  const getNestedValue = (obj: any, path: string) => {
    return path.split(".").reduce((acc, key) => acc && acc[key], obj);
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
    <div dir="rtl" className="w-full min-h-screen mb-8 pt-8 hidden-scrollbar">
      {searchState && (
        <SearchInput
          handleSearch={fetchSearchData}
          setSearchContent={setQuery}
        />
      )}
      <motion.div
        className="overflow-x-auto rounded-lg w-[98%] mx-auto h-fit  shadow-lg"
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
                  className="px-6 whitespace-nowrap py-3 text-right text-sm font-semibold tracking-wider"
                >
                  {header}
                  {/* <FaSort className="inline-block ml-2 cursor-pointer text-second_text" /> */}
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
            ) : !currentData || currentData.length === 0 ? (
              <tr>
                <td
                  colSpan={headers.length + (onEdit || onDelete ? 1 : 0)}
                  className="text-center py-6 text-gray-500"
                >
                  لا توجد بيانات
                </td>
              </tr>
            ) : (
              currentData.map((item: T, index) => (
                <motion.tr
                  key={index}
                  className="border-b transition-all hover:bg-secondery_dash"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {keys.map((cell: cellType, i) => {
                    if (cell.cellType === "text") {
                      const value = getNestedValue(item, cell.key);
                      return (
                        <td
                          key={i}
                          className="px-6 py-4 text-second_text text-md whitespace-nowrap"
                        >
                          {value ?? ""}
                        </td>
                      );
                    }

                    if (cell.cellType === "image") {
                      const value = getNestedValue(item, cell.key);
                      return (
                        <td key={i} className="px-6 py-4">
                          <Img
                            src={
                              value
                                ? value
                                : item["gender"] == "male"
                                ? "/defaults/male-noimage.jpg"
                                : "/defaults/female-noimage.jpg"
                            }
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        </td>
                      );
                    }

                    if (cell.cellType === "icon") {
                      const IconComponent = getIconComponent(item[cell.key]);
                      return (
                        <td key={i} className="px-6 py-4 text-primary">
                          <IconComponent className="size-6" />
                        </td>
                      );
                    }

                    if (cell.cellType === "color") {
                      return (
                        <td key={i} className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-6 h-6 rounded border"
                              style={{
                                backgroundColor: item[cell.key] || "#ccc",
                              }}
                            ></div>
                            <span className="text-sm text-gray-700">
                              {item[cell.key] || "N/A"}
                            </span>
                          </div>
                        </td>
                      );
                    }

                    if (cell.cellType === "date") {
                      return (
                        <td
                          key={i}
                          className="px-6 py-4 text-second_text whitespace-nowrap text-md"
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

                    if (cell.cellType === "parent") {
                      const parent = item[cell.key];
                      if (parent) {
                        return (
                          <div key={i} className="flex items-center gap-2">
                            {parent.image && (
                              <Img
                                src={parent.image}
                                alt={parent.title_en}
                                className="w-8 h-8 object-cover rounded"
                              />
                            )}
                            <span className="text-sm">{parent.title_en}</span>
                          </div>
                        );
                      }
                      return (
                        <span key={i} className="text-gray-400 text-sm">
                          No parent
                        </span>
                      );
                    }

                    return null;
                  })}

                  {(onEdit || onDelete) && (
                    <td className="flex items-center justify-center h-[8vh] gap-x-4">
                      <div className="w-fit mx-auto flex items-center gap-4">
                        {onEdit && (
                          <button
                            onClick={() =>
                              handleRoute(
                                `/en/dashboard/${itemDirect}/${item.id}`
                              )
                            }
                            className="text-blue-500 hover:text-blue-700 cursor-pointer"
                          >
                            <FaEdit size={20} />
                          </button>
                        )}
                        {!(
                          (api === "/users" || api === "/providers") &&
                          item.id === user?.id
                        ) &&
                          item?.role != "admin" &&
                          item?.role != "super_admin" && (
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
          selectedItem?.name ??
          selectedItem?.user?.name ??
          selectedItem?.title_en ??
          ""
        }
        id={selectedItem?.id ?? 0}
        showConfirm={confirmDeletePopup}
        onDelete={() => handleDelete(selectedItem.id)}
        loading={deleteLoading}
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
