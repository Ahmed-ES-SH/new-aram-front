"use client";

import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { FiCheckCircle, FiXCircle, FiTrash2 } from "react-icons/fi";
import { VscLoading } from "react-icons/vsc";
import { useState, Dispatch, SetStateAction } from "react";
import { toast } from "sonner";
import { useAppSelector } from "@/app/Store/hooks";
import { instance } from "@/app/_helpers/axios";
import ConfirmDeletePopup from "@/app/_components/_popups/ConfirmDeletePopup";
import CheckCurrentUserPopup from "../../../_global/CheckCurrentUserPopup";
import { Appointment } from "../../_usercontrol/_listofreservations/types";

type LoadingState =
  | "confirm"
  | "reject"
  | "delete"
  | ""
  | "cancelled_by_user"
  | "cancelled_by_org"
  | "done"
  | "pending"
  | "confirmed"
  | "rejected";

interface OrgAppointmentActionsProps {
  status:
    | "pending"
    | "confirmed"
    | "rejected"
    | "cancelled_by_user"
    | "cancelled_by_org"
    | "done";
  appointmentId: number;
  startTime: string;
  setAppointments: Dispatch<SetStateAction<Appointment[]>>;
}

export default function CenterAppointmentActions({
  status,
  appointmentId,
  startTime,
  setAppointments,
}: OrgAppointmentActionsProps) {
  const t = useTranslations("orgAppointmentActions");
  const locale = useLocale();
  const { user } = useAppSelector((state) => state.user);

  const [loading, setLoading] = useState<LoadingState>("");
  const [checkUser, setCheckUser] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  // ✅ Confirm Appointment
  const handleConfirm = async () => {
    if (!user) return setCheckUser(true);
    try {
      setLoading("confirm");
      const response = await instance.post(
        `/organizations/${user?.id}/appointments/${appointmentId}/response?status=confirmed`
      );
      if (response.status === 200) {
        toast.success(t("confirmSuccess"));
        setAppointments((prev) =>
          prev.map((book) =>
            book.id === appointmentId ? { ...book, status: "confirmed" } : book
          )
        );
      }
    } catch (error: any) {
      console.log(error);
      const message =
        error?.response?.data?.message?.[locale] ??
        error?.response?.data?.message ??
        t("unexpectedError");
      toast.error(message);
    } finally {
      setLoading("");
    }
  };

  // ❌ Reject Appointment
  const handleReject = async () => {
    if (!user) return setCheckUser(true);
    try {
      setLoading("reject");
      const response = await instance.post(
        `/organizations/${user?.id}/appointments/${appointmentId}/response?status=rejected`
      );
      if (response.status === 200) {
        toast.success(t("rejectSuccess"));
        setAppointments((prev) =>
          prev.map((book) =>
            book.id === appointmentId ? { ...book, status: "rejected" } : book
          )
        );
      }
    } catch (error: any) {
      console.log(error);
      const message =
        error?.response?.data?.message?.[locale] ??
        error?.response?.data?.message ??
        t("unexpectedError");
      toast.error(message);
    } finally {
      setLoading("");
    }
  };

  // 🗑️ Delete Appointment (if cancelled by user)
  const handleDelete = async () => {
    if (!user) return setCheckUser(true);
    try {
      setLoading("delete");
      const response = await instance.delete(`/delete-appointment`, {
        data: {
          appointment_id: appointmentId,
          deleter_id: user?.id,
          deleter_type: user?.account_type,
        },
      });
      if (response.status === 200) {
        toast.success(t("deleteSuccess"));
        setAppointments((prev) =>
          prev.filter((book) => book.id !== appointmentId)
        );
        setDeleteConfirm(false);
      }
    } catch (error: any) {
      console.log(error);
      const message =
        error?.response?.data?.message?.[locale] ??
        error?.response?.data?.message ??
        t("unexpectedError");
      toast.error(message);
    } finally {
      setLoading("");
    }
  };

  // 🔘 Render buttons based on status
  const renderButton = () => {
    switch (status) {
      case "pending":
        return (
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleConfirm}
              className="flex items-center justify-center gap-2 bg-emerald-500 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-emerald-600 transition-colors"
            >
              {loading === "confirm" ? (
                <VscLoading className="animate-spin" />
              ) : (
                <>
                  <FiCheckCircle />
                  {t("confirm")}
                </>
              )}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleReject}
              className="flex items-center justify-center gap-2 bg-rose-500 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-rose-600 transition-colors"
            >
              {loading === "reject" ? (
                <VscLoading className="animate-spin" />
              ) : (
                <>
                  <FiXCircle />
                  {t("reject")}
                </>
              )}
            </motion.button>
          </div>
        );

      case "cancelled_by_user":
        return (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setDeleteConfirm(true)}
            className="flex items-center justify-center gap-2 bg-rose-500 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-rose-600 transition-colors"
          >
            {loading === "delete" ? (
              <VscLoading className="animate-spin" />
            ) : (
              <>
                <FiTrash2 />
                {t("delete")}
              </>
            )}
          </motion.button>
        );

      // statuses with no actions
      case "done":
      case "rejected":
      case "cancelled_by_org":
        return <span className="text-gray-400 text-sm">{t("noActions")}</span>;

      default:
        return <span className="text-gray-400 text-sm">{t("noActions")}</span>;
    }
  };

  return (
    <div
      className={`flex justify-center items-center ${
        locale === "ar" ? "flex-row-reverse" : ""
      }`}
    >
      {renderButton()}

      <CheckCurrentUserPopup
        isOpen={checkUser}
        onClose={() => setCheckUser(false)}
      />

      <ConfirmDeletePopup
        title={`الموعد المحدد - ${startTime}`}
        id={appointmentId}
        showConfirm={deleteConfirm}
        onDelete={handleDelete}
        onClose={() => setDeleteConfirm(false)}
        loading={loading === "delete"}
      />
    </div>
  );
}
