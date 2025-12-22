"use client";
import { ContactMessage } from "./types";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { instance } from "@/app/_helpers/axios";
import { toast } from "sonner";
import ConfirmDeletePopup from "../../_popups/ConfirmDeletePopup";
import ContactMessageCard from "./ContactMessageCard";
import ContactMessageTable from "./ContactMessageTable";

interface ContactMessagesSectionEditorProps {
  data: ContactMessage[];
  onChange: (data: ContactMessage[], field: "contact_messages") => void;
}

export default function ContactMessagesSectionEditor({
  data = [],
  onChange,
}: ContactMessagesSectionEditorProps) {
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(
    null
  );
  const [status, setStatus] = useState<string>("");
  const [deletePopup, setDeletePopup] = useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const [editPopup, setEditPopup] = useState<boolean>(false);

  const handleClosePopup = () => {
    setSelectedMessage(null);
    setEditPopup(false);
    setDeletePopup(false);
  };

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus);
  };

  const handleSubmit = async () => {
    if (!selectedMessage) return;

    try {
      const updatedMessages = data.map((msg) =>
        msg.id === selectedMessage.id ? { ...msg, status: status } : msg
      );

      const response = await instance.post(
        `/update-service-message/${selectedMessage.id}?status=${status}`
      );

      if (response.status === 200) {
        onChange(updatedMessages, "contact_messages");
        handleClosePopup();
        toast.success("تم تحديث الحالة بنجاح");
      }
    } catch (error: any) {
      console.log(error);
      const message = error?.response?.data?.message || "حدث خطأ ما";
      toast.error(message);
    }
  };

  const hadleConfirmDelete = (msg: ContactMessage) => {
    setSelectedMessage(msg);
    setDeletePopup(true);
  };

  const hadnleOpenEdit = (mesg: ContactMessage) => {
    setSelectedMessage(mesg);
    setEditPopup(true);
  };

  const handleDelete = async (id: string) => {
    try {
      setDeleteLoading(true);
      const response = await instance.delete(`/delete-service-message/${id}`);

      if (response.status === 200) {
        const updatedMessages = data.filter((msg) => msg.id !== Number(id));
        onChange(updatedMessages, "contact_messages");
        handleClosePopup();
        toast.success("تم حذف الرسالة بنجاح");
      }
    } catch (error: any) {
      console.log(error);
      const message = error?.response?.data?.message || "حدث خطأ ما";
      toast.error(message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold mb-4">رسائل الاتصال</h3>

        {data && data.length > 0 ? (
          <ContactMessageTable
            data={data}
            onOpenEdit={hadnleOpenEdit}
            onDelete={hadleConfirmDelete}
          />
        ) : (
          <div className="text-center py-10 text-gray-500">
            لا توجد رسائل اتصال حتى الآن.
          </div>
        )}
      </div>

      {/* Message Details Popup */}
      <AnimatePresence>
        {editPopup && selectedMessage && (
          <ContactMessageCard
            selectedMessage={selectedMessage}
            handleClosePopup={handleClosePopup}
            handleStatusChange={handleStatusChange}
            handleSubmit={handleSubmit}
            status={(selectedMessage?.status as any) ?? null}
          />
        )}
      </AnimatePresence>

      {/* delete popup */}
      <ConfirmDeletePopup
        id={selectedMessage?.id as any}
        onClose={() => setDeletePopup(false)}
        onDelete={() => handleDelete(selectedMessage?.id as any)}
        showConfirm={deletePopup}
        title={`رسالة المرسل ${selectedMessage?.name}`}
        loading={deleteLoading}
      />
    </div>
  );
}
