"use client";
import ConfirmDeletePopup from "@/app/_components/_popups/ConfirmDeletePopup";
import EditTextPopup from "@/app/_components/_popups/EditTextPopup";
import ErrorAlart from "@/app/_components/_popups/ErrorAlart";
import SuccessAlart from "@/app/_components/_popups/SuccessAlart";
import LoadingSpin from "@/app/_components/LoadingSpin";
import { handleAddItem } from "@/app/_helpers/addHelper";
import { handleDeleteItem } from "@/app/_helpers/deleteHelper";
import useFetchData from "@/app/_helpers/FetchDataWithAxios";
import { handleUpdateItem } from "@/app/_helpers/updateHelper";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";

interface linkType {
  id?: number;
  link_title_en: string;
  link_title_ar: string;
  link_url: string;
  list_id?: number;
}

interface listType {
  id: number;
  title: string;
  links: linkType[];
}

export default function FooterLinks() {
  const { data, loading } = useFetchData("/all-lists", false);
  const [selectedLink, setSelectedLink] = useState<linkType | null>(null);
  const [listes, setListes] = useState<listType[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedListId, setSelectedListId] = useState<null | number>(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [operationType, setOperationType] = useState("");
  const [successPopup, setSuccessPopup] = useState(false);
  const [errorPopup, setErrorPopup] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [confirmPopup, setConfirmPopup] = useState(false);
  const [loadingState, setLoadingState] = useState(false);

  const inputs = selectedLink
    ? [
        {
          name: "link_title_en",
          value: selectedLink.link_title_en,
          type: "short-text",
          label: "العنوان (EN)",
        },
        {
          name: "link_title_ar",
          value: selectedLink.link_title_ar,
          type: "short-text",
          label: "العنوان (AR)",
        },
        {
          name: "link_url",
          value: selectedLink.link_url,
          type: "short-text",
          label: "الرابط",
        },
      ]
    : [];

  // دالة تحديث البيانات عند التعديل
  const handleInputChange = (name: string, value: string | number) => {
    setSelectedLink((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const togglePopup = (
    type: "edit" | "alert-error" | "alert-success" | "confirm",
    state: boolean
  ) => {
    if (type === "edit") setIsPopupOpen(state);
    if (type === "alert-success") setSuccessPopup(state);
    if (type === "alert-error") setErrorPopup(state);
    if (type === "confirm") setConfirmPopup(state);
  };

  const onEdit = (link: linkType) => {
    setSelectedLink(link);
    setIsPopupOpen(true);
    setOperationType("edit");
  };

  const onAdd = (listId: number) => {
    setSelectedLink({
      list_id: listId,
      link_title_en: "",
      link_title_ar: "",
      link_url: "",
    });
    setSelectedListId(listId);
    setIsPopupOpen(true);
    setOperationType("add");
  };

  const handleAddLink = async () => {
    handleAddItem({
      endpoint: "/add-link",
      newItem: selectedLink,
      nestedKey: "links",
      setLoading: setLoadingState,
      parentId: selectedListId,
      setStateFunction: setListes,
      setSuccess: setSuccessMessage,
      setError: setErrorMessage,
      onClosePopup: () => togglePopup("edit", false),
      onShowErrorAlert: () => togglePopup("alert-error", true),
      onShowSuccessAlert: () => togglePopup("alert-success", true),
    });
  };

  const handleDeleteLink = async () => {
    handleDeleteItem({
      endpoint: "/delete-link",
      id: selectedLink?.id,
      setSuccess: setSuccessMessage,
      setStateFunction: setListes,
      onClosePopup: () => togglePopup("confirm", false),
      onShowErrorAlert: () => togglePopup("alert-error", true),
      onShowSuccessAlert: () => togglePopup("alert-success", true),
      setError: setErrorMessage,
      nestedKey: "links",
    });
  };

  const handleSaveChanges = async () => {
    if (!selectedLink) return;
    handleUpdateItem({
      endpoint: "/update-link",
      id: selectedLink.id!,
      updatedData: selectedLink,
      setLoading: setLoadingState,
      nestedKey: "links",
      setStateFunction: setListes,
      setSuccess: setSuccessMessage,
      onShowErrorAlert: () => togglePopup("alert-error", true),
      setError: setErrorMessage,
      onClosePopup: () => togglePopup("edit", false),
      onShowSuccessAlart: () => togglePopup("alert-success", true),
    });
    // if (window !== undefined) window.location.reload();
  };

  const onDelete = (link: linkType) => {
    setSelectedLink(link);
    setConfirmPopup(true);
  };

  useEffect(() => {
    if (data && Array.isArray(data)) {
      setListes(data);
    }
  }, [data]);

  if (loading) return <LoadingSpin />;

  if (!Array.isArray(data)) {
    console.error("Data is not an array!", data);
    return null;
  }

  return (
    <>
      <div className="space-y-6  mt-4 mb-12 w-[98%] mx-auto duration-200">
        {listes &&
          listes.map((list: listType) => (
            <motion.div
              key={list.id}
              className="p-4 rounded-lg shadow-md bg-primary-boldgray"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-between pb-2 border-b border-primary">
                <h2 className="text-lg font-semibold mb-3 text-second-text">
                  {list.title}
                </h2>
                <div
                  onClick={() => onAdd(list.id)}
                  className="bg-primary hover:bg-white hover:border-primary btn-hover"
                >
                  <FaPlus className="size-5" />
                </div>
              </div>
              <ul className="space-y-2 mt-3">
                {list.links.map((link: linkType) => (
                  <motion.li
                    key={link.id}
                    className="flex justify-between duration-300 items-center p-2 rounded-lg shadow-sm bg-secondery_dash text-second_text"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div
                      // href={link.link_url || "/"}
                      className="flex-1 text-white"
                    >
                      {link.link_title_en} / {link.link_title_ar}
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => onEdit(link)}
                        className="text-blue-500 hover:text-blue-600 cursor-pointer"
                      >
                        <FaEdit className="size-5" />
                      </button>
                      <button
                        onClick={() => onDelete(link)}
                        className="text-red-500 hover:text-red-700 cursor-pointer"
                      >
                        <FaTrash className="size-5" />
                      </button>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
      </div>
      <EditTextPopup
        loadingState={loadingState}
        operationType={operationType}
        onSave={handleSaveChanges}
        onAdd={handleAddLink}
        showPopup={isPopupOpen}
        onClose={() => togglePopup("edit", false)}
        inputs={inputs}
        onChange={handleInputChange}
      />
      <ConfirmDeletePopup
        title={selectedLink?.link_title_en || ""}
        id={selectedLink?.id as any}
        showConfirm={confirmPopup}
        onDelete={handleDeleteLink}
        onClose={() => togglePopup("confirm", false)}
      />
      <SuccessAlart
        showAlart={successPopup}
        onClose={() => togglePopup("alert-success", false)}
        Message={successMessage}
      />
      <ErrorAlart
        showAlart={errorPopup}
        onClose={() => togglePopup("alert-error", false)}
        Message={errorMessage}
      />
    </>
  );
}
