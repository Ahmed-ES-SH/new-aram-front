"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { AppointmentStatusBadge } from "./AppointmentStatusBadge";
import { Appointment } from "./types";
import Img from "../../../_global/Img";
import AppointmentActions from "./AppointmentActions";
import { useEffect, useState } from "react";

interface AppointmentTableProps {
  appointments: Appointment[];
}

export function AppointmentTable({
  appointments: data,
}: AppointmentTableProps) {
  const t = useTranslations("appointments");

  const [appointments, setAppointments] = useState<Appointment[]>([]);

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

  useEffect(() => {
    if (data) {
      setAppointments(data);
    }
  }, [data]);

  if (appointments.length === 0) {
    return (
      <div className="text-center py-12 text-slate-500">
        <p className="text-lg">{t("noAppointments")}</p>
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
          {appointments.map((appointment, index) => {
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
                    <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
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
                  {formatPrice(appointment.price)}
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
          })}
        </tbody>
      </table>
    </div>
  );
}
