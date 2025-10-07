"use client";

import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { FiTrash2, FiXCircle, FiStar, FiArrowRight } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { differenceInDays } from "date-fns";
import { useAppSelector } from "@/app/Store/hooks";
import { toast } from "sonner";
import { Dispatch, SetStateAction, useState } from "react";
import { instance } from "@/app/_helpers/axios";
import { Appointment } from "./types";
import CheckCurrentUserPopup from "../../../_global/CheckCurrentUserPopup";
import { VscLoading } from "react-icons/vsc";
import ConfirmDeletePopup from "@/app/_components/_popups/ConfirmDeletePopup";

type loadingState =
  | "pending"
  | "confirmed"
  | "rejected"
  | "cancelled_by_user"
  | "cancelled_by_org"
  | "done"
  | "delete"
  | "";

interface AppointmentActionsProps {
  status:
    | "pending"
    | "confirmed"
    | "rejected"
    | "cancelled_by_user"
    | "cancelled_by_org"
    | "done";
  startTime: string;
  appointmentId: number;
  setAppointments: Dispatch<SetStateAction<Appointment[]>>;
}

export default function AppointmentActions({
  status,
  startTime,
  appointmentId,
  setAppointments,
}: AppointmentActionsProps) {
  const t = useTranslations("appointmentActions");
  const router = useRouter();

  const { user } = useAppSelector((state) => state.user);

  const locale = useLocale();

  const daysDiff = differenceInDays(new Date(startTime), new Date());

  const [loading, setLoading] = useState<loadingState>("");
  const [checkUser, setCheckUser] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const handleDelete = async () => {
    if (!user) {
      setCheckUser(true);
      return;
    }

    try {
      setLoading("delete");
      const data = {
        appointment_id: appointmentId,
        deleter_id: user?.id,
        deleter_type: user?.account_type,
      };
      const response = await instance.delete(`/delete-appointment`, { data });
      if (response.status == 200) {
        toast.success("تم حذف الموعد المحدد بنجاح من سجل الحساب !");
        setAppointments((prev) =>
          prev.filter((book) => book.id != appointmentId)
        );
        setDeleteConfirm(false);
      }
    } catch (error: any) {
      console.log(error);
      const message =
        error?.response?.data?.message[locale] ??
        error?.response?.data?.message ??
        "حدث خطأ غير متوقع أثناء محاولة حذف الحجز حاول مره اخرى لاحقا !";
      toast.error(message);
    } finally {
      setLoading("");
    }
  };

  const handleCanel = async () => {
    if (!user) {
      setCheckUser(true);
      return;
    }

    try {
      setLoading("cancelled_by_user");
      const data = {
        appointment_id: appointmentId,
        cancler_id: user?.id,
        cancler_type: user?.account_type,
      };
      const response = await instance.post(`/cancel-appointment`, data);
      if (response.status == 200) {
        toast.success("تم إلغاء الحجز الخاص بك بنجاح !");
        setAppointments((prev) =>
          prev.map((book) =>
            book.id === appointmentId
              ? { ...book, status: "cancelled_by_user" }
              : book
          )
        );
      }
    } catch (error: any) {
      console.log(error);
      const message =
        error?.response?.data?.message[locale] ??
        error?.response?.data?.message ??
        "حدث خطأ غير متوقع أثناء محاولة إلغاء الحجز حاول مره اخرى لاحقا !";
      toast.error(message);
    } finally {
      setLoading("");
    }
  };

  const handleRate = async () => {};

  const renderButton = () => {
    switch (status) {
      case "pending":
        return daysDiff > 2 ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleCanel}
            className="flex items-center justify-center gap-2 bg-amber-500 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-amber-600 transition-colors"
          >
            {loading == "cancelled_by_user" ? (
              <VscLoading className="animate-spin" />
            ) : (
              <div className="flex items-center gap-1">
                <FiXCircle />
                {t("cancel")}
              </div>
            )}
          </motion.button>
        ) : (
          <span className="text-gray-400 text-sm">{t("noActions")}</span>
        );

      case "confirmed":
        return <span className="text-gray-400 text-sm">{t("noActions")}</span>;

      case "rejected":
        return (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => router.push(`/${locale}/organizations`)}
            className="flex items-center gap-2 bg-emerald-500 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-emerald-600 transition-colors"
          >
            <FiArrowRight />
            {t("goToCenters")}
          </motion.button>
        );

      case "cancelled_by_user":
      case "cancelled_by_org":
        return (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setDeleteConfirm(true)}
            className="flex items-center justify-center gap-2 bg-rose-500 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-rose-600 transition-all"
          >
            {loading == "delete" ? (
              <VscLoading className="animate-spin" />
            ) : (
              <div className="flex items-center gap-1">
                <FiTrash2 />
                {t("delete")}
              </div>
            )}
          </motion.button>
        );

      case "done":
        return (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleRate}
            className="flex items-center gap-2 bg-emerald-500 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-emerald-600 transition-colors"
          >
            <FiStar />
            {t("rateCenter")}
          </motion.button>
        );

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
        loading={loading == "delete"}
      />
    </div>
  );
}
