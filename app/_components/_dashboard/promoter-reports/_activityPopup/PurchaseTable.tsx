"use client";
import { FiCalendar, FiGlobe, FiSmartphone } from "react-icons/fi";
import Img from "@/app/_components/_website/_global/Img";
import { ActivityItem, PurchaseItem } from "./types";
import Pagination from "@/app/_components/PaginationComponent";

interface Props {
  data: ActivityItem[];
  setSelectedItems: (items: PurchaseItem[]) => void;
  currentPage: number;
  lastPage: number;
  handlePageChange: (page: number) => void;
}

export default function PurchaseTable({
  data,
  setSelectedItems,
  currentPage,
  lastPage,
  handlePageChange,
}: Props) {
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
          <th className={headStyle}>المبلغ</th>
          <th className={headStyle}>العمولة</th>
          <th className={headStyle}>العناصر</th>
          <th className={headStyle}>كود الإحالة</th>
        </tr>
      </thead>

      <tbody className="divide-y divide-gray-100">
        {data.map((item, i) => (
          <tr key={i} className="hover:bg-gray-50">
            <td className="p-4 whitespace-nowrap text-gray-400">{i + 1}</td>

            <td className="p-4 whitespace-nowrap flex items-center gap-2">
              <FiCalendar className="text-gray-400" />
              {formatDate(item.activity_at)}
            </td>

            <td className="p-4 whitespace-nowrap">
              <div className="flex flex-col">
                <span className="font-medium flex items-center gap-2">
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

            <td className="p-4 whitespace-nowrap">
              {item.member ? (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-100 overflow-hidden">
                    <Img
                      src={item.member.image ?? "/defaults/male-noimage.jpg"}
                      errorSrc="/defaults/male-noimage.jpg"
                      alt={item.member.name}
                      className="w-full h-full object-cover"
                    />
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

            <td className="p-4 whitespace-nowrap">
              {item.member_type === "user" ? "مستخدم" : "مركز"}
            </td>

            <td className="p-4 whitespace-nowrap font-semibold">
              {item.metadata?.total ? `${item.metadata.total} ر.ع` : "—"}
            </td>

            <td className="p-4 whitespace-nowrap text-green-600 font-medium">
              {item.commission_amount ? `${item.commission_amount} ر.ع` : "—"}
              {item.metadata?.commission_rate && (
                <div className="text-xs text-gray-400">
                  ({item.metadata.commission_rate}%)
                </div>
              )}
            </td>

            <td className="p-4 whitespace-nowrap">
              <button
                onClick={() => setSelectedItems(item.metadata?.items || [])}
                className="px-3 py-1.5 bg-purple-50 text-purple-600 rounded-md hover:bg-purple-100 border border-purple-100 text-xs"
              >
                عرض العناصر
              </button>
            </td>

            <td className="p-4 whitespace-nowrap font-mono bg-gray-100 rounded text-gray-600">
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
