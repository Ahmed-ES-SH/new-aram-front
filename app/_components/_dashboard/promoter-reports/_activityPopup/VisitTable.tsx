"use client";
import {
  FiCalendar,
  FiGlobe,
  FiSmartphone,
  FiLink,
  FiClock,
} from "react-icons/fi";
import { ActivityItem } from "./types";
import Pagination from "@/app/_components/PaginationComponent";

interface props {
  data: ActivityItem[];
  currentPage: number;
  lastPage: number;
  handlePageChange: (page: number) => void;
}

export default function VisitTable({
  data,
  currentPage,
  lastPage,
  handlePageChange,
}: props) {
  const renderCell = (content: any) =>
    content || <span className="text-gray-400">—</span>;

  const formatDate = (date: string) =>
    new Date(date).toLocaleString("ar-EG", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const formatDuration = (sec?: number) => {
    if (!sec) return "—";
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const headStyle = "p-4 whitespace-nowrap text-right";

  return (
    <table className="w-full text-sm text-right">
      <thead className="bg-gray-50 text-gray-600 font-medium sticky top-0 z-10 shadow-sm">
        <tr>
          <th className={headStyle}>#</th>
          <th className={headStyle}>التاريخ والوقت</th>
          <th className={headStyle}>الدولة / IP</th>
          <th className={headStyle}>الجهاز</th>
          <th className={headStyle}>المدة</th>
          <th className={headStyle}>كود الإحالة</th>
        </tr>
      </thead>

      <tbody className="divide-y divide-gray-100">
        {data.map((item, i) => (
          <tr key={i} className="hover:bg-gray-50">
            <td className="p-4 whitespace-nowrap text-gray-400">{i + 1}</td>

            <td className="p-4 whitespace-nowrap">
              <div className="flex items-center gap-2">
                <FiCalendar className="text-gray-400" />
                {formatDate(item.activity_at)}
              </div>
            </td>

            <td className="p-4 whitespace-nowrap">
              <div className="flex flex-col">
                <span className="flex items-center gap-1 font-medium">
                  <FiGlobe className="text-gray-400 w-3 h-3" />
                  {renderCell(item.country)}
                </span>
                <span className="text-xs text-gray-400 mt-1">
                  {item.ip_address}
                </span>
              </div>
            </td>

            <td className="p-4 whitespace-nowrap flex items-center gap-2">
              <FiSmartphone className="text-gray-400" />
              {renderCell(item.device_type)}
            </td>

            <td className="p-4 whitespace-nowrap font-mono  rounded text-gray-600">
              {formatDuration(item.metadata?.visit_duration_seconds)}
            </td>

            <td className="p-4 whitespace-nowrap font-mono  rounded text-gray-600">
              {renderCell(item.ref_code)}
            </td>
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr>
          <td colSpan={6}>
            <Pagination
              currentPage={currentPage}
              totalPages={lastPage}
              onPageChange={handlePageChange}
            />
          </td>
        </tr>
      </tfoot>
    </table>
  );
}
