"use client";
import { FiCalendar, FiGlobe, FiSmartphone } from "react-icons/fi";
import { ActivityItem } from "./types";
import Pagination from "@/app/_components/PaginationComponent";
import getMemberTypeUI from "./getMemberTypeUI";

interface props {
  data: ActivityItem[];
  currentPage: number;
  lastPage: number;
  handlePageChange: (page: number) => void;
}

export default function SignupTable({
  data,
  currentPage,
  lastPage,
  handlePageChange,
}: props) {
  const renderCell = (v: any) => v || <span className="text-gray-400">—</span>;

  const formatDate = (date: string) =>
    new Date(date).toLocaleString("ar-EG", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const headStyle = "p-4 whitespace-nowrap text-right";

  return (
    <table className="w-full text-sm text-right">
      <thead className="bg-gray-50 sticky top-0 z-10">
        <tr>
          <th className={headStyle}>#</th>
          <th className={headStyle}>التاريخ</th>
          <th className={headStyle}>الدولة / IP</th>
          <th className={headStyle}>الجهاز</th>
          <th className={headStyle}>العضو</th>
          <th className={headStyle}>نوع الحساب</th>
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
                <span className="font-medium flex items-center gap-2">
                  <FiGlobe className="text-gray-400 w-3 h-3" />
                  {renderCell(item.country)}
                </span>
                <span className="text-xs text-gray-400 mt-1">
                  {renderCell(item.ip_address)}
                </span>
              </div>
            </td>

            <td className="p-4 whitespace-nowrap flex items-center gap-2">
              <FiSmartphone className="text-gray-400" />
              {renderCell(item.device_type)}
            </td>

            <td className="p-4 whitespace-nowrap">
              {item.member ? (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 overflow-hidden">
                    {item.member.image ? (
                      <img
                        src={item.member.image}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-green-600">
                        {item.member.name?.charAt(0) ?? "U"}
                      </div>
                    )}
                  </div>

                  <div>
                    <p className="font-medium">{item.member.name}</p>
                    <p className="text-xs text-gray-500">{item.member.email}</p>
                  </div>
                </div>
              ) : (
                <span className="text-gray-400 italic">عضو غير معروف</span>
              )}
            </td>

            <td className="p-4 whitespace-nowrap font-mono  rounded text-gray-600">
              {getMemberTypeUI(item?.member_type)}
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
