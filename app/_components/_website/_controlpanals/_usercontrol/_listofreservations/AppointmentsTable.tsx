"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { AppointmentStatusBadge } from "./AppointmentStatusBadge";
import { Appointment } from "./types";
import { useEffect, useRef, useState } from "react";
import { instance } from "@/app/_helpers/axios";
import { useAppSelector } from "@/app/Store/hooks";
import { GiNotebook } from "react-icons/gi";
import Img from "../../../_global/Img";
import Pagination from "@/app/_components/PaginationComponent";
import AppointmentActions from "./AppointmentActions";
import SpinLoading from "../../../_global/SpinLoading";

type pagination = {
  current_page: number;
  last_page: number;
};

interface AppointmentTableProps {
  appointments: Appointment[];
  pagination: pagination;
}

export default function AppointmentTable({
  appointments: data,
  pagination,
}: AppointmentTableProps) {
  const { user } = useAppSelector((state) => state.user);

  const t = useTranslations("appointments");

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [currentPage, setCurrentPage] = useState(pagination.current_page ?? 1);
  const [lastPage, setLastPage] = useState(pagination.last_page ?? 1);
  const [loading, setLoading] = useState(false);
  const hasMounted = useRef(false);

  const formatDateTime = (startTime: string, endTime: string) => {
    const start = new Date(startTime);
    const end = new Date(endTime);

    const dateStr = start.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    const startTimeStr = start.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const endTimeStr = end.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

    return { dateStr, timeStr: `${startTimeStr} – ${endTimeStr}` };
  };

  const formatPrice = (price: number | string) => {
    const numPrice =
      typeof price === "string" ? Number.parseFloat(price) : price;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(numPrice);
  };

  const handlePageChange = async (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.last_page) {
      setCurrentPage(newPage);
    }
  };

  useEffect(() => {
    if (data) {
      setAppointments(data);
    }
  }, [data]);

  useEffect(() => {
    if (hasMounted.current) {
      const fetchData = async () => {
        try {
          setLoading(true);
          const response = await instance.get(
            `/appointments/${user?.account_type}/${user?.id}?page=${currentPage}`
          );
          if (response.status === 200) {
            const { data, pagination } = response.data;
            setAppointments(data);
            setCurrentPage(pagination.current_page);
            setLastPage(pagination.last_page);
            scrollTo(0, 0);
          }
        } catch (error: any) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    } else {
      hasMounted.current = true;
    }
  }, [currentPage, user]);

  if (appointments.length === 0) {
    return (
      <div className="text-center w-full min-h-[75vh] flex items-center justify-center py-12 text-slate-500">
        <div className="flex flex-col items-center gap-4">
          <GiNotebook className="size-52 text-primary" />
          <p className="text-lg">{t("noAppointments")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-slate-200">
            <th className="ltr:text-left rtl:text-right py-4 px-4 text-sm font-semibold text-slate-700">
              {t("id")}
            </th>
            <th className="ltr:text-left rtl:text-right py-4 px-4 text-sm font-semibold text-slate-700">
              {t("organization")}
            </th>
            <th className="ltr:text-left rtl:text-right py-4 px-4 text-sm font-semibold text-slate-700">
              {t("dateTime")}
            </th>
            <th className="ltr:text-left rtl:text-right py-4 px-4 text-sm font-semibold text-slate-700">
              {t("price")}
            </th>
            <th className="ltr:text-left rtl:text-right py-4 px-4 text-sm font-semibold text-slate-700">
              {t("status")}
            </th>
            <th className="ltr:text-left rtl:text-right py-4 px-4 text-sm font-semibold text-slate-700">
              {t("actions")}
            </th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={6} className="p-10">
                <div className="min-h-[75vh] flex items-center justify-center w-full">
                  <SpinLoading />
                </div>
              </td>
            </tr>
          ) : (
            appointments.map((appointment, index) => {
              const { dateStr, timeStr } = formatDateTime(
                appointment.start_time,
                appointment.end_time
              );

              return (
                <motion.tr
                  key={appointment.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                >
                  <td className="py-4 px-4 text-sm text-slate-600">
                    #{appointment.id}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                        <Img
                          src={appointment.organization.logo ?? "/logo.png"}
                          errorSrc="/logo.png"
                          alt={appointment.organization.title}
                          className="object-cover w-full h-full rounded-full"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-800">
                          {appointment.organization.title}
                        </p>
                        <p className="text-xs text-slate-500">
                          {appointment.organization.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div>
                      <p className="text-sm font-medium text-slate-800">
                        {dateStr}
                      </p>
                      <p className="text-xs text-slate-500">{timeStr}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-sm font-semibold text-slate-800">
                    {appointment.is_paid
                      ? formatPrice(appointment.price)
                      : "----"}
                  </td>
                  <td className="py-4 px-4">
                    <AppointmentStatusBadge status={appointment.status} />
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400">
                        <AppointmentActions
                          status={appointment.status}
                          startTime={appointment.start_time}
                          appointmentId={appointment.id}
                          setAppointments={setAppointments}
                        />
                      </span>
                    </div>
                  </td>
                </motion.tr>
              );
            })
          )}
        </tbody>
      </table>
      <Pagination
        currentPage={currentPage}
        totalPages={lastPage ?? 1}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
