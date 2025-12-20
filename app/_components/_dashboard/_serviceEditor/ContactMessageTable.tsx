"use client";
import { FaTrash } from "react-icons/fa";
import { FiEye } from "react-icons/fi";
import { ContactMessage } from "./types";

interface ContactMessageTableProps {
  data: ContactMessage[];
  onOpenEdit: (msg: ContactMessage) => void;
  onDelete: (msg: ContactMessage) => void;
}

export default function ContactMessageTable({
  data,
  onOpenEdit,
  onDelete,
}: ContactMessageTableProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "spam":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-right">
        <thead>
          <tr className="border-b border-gray-100 text-gray-500 text-sm">
            <th className="pb-3 font-medium whitespace-nowrap">الاسم</th>
            <th className="pb-3 font-medium whitespace-nowrap">
              البريد الإلكتروني
            </th>
            <th className="pb-3 font-medium whitespace-nowrap">الحالة</th>
            <th className="pb-3 font-medium whitespace-nowrap">التاريخ</th>
            <th className="pb-3 font-medium whitespace-nowrap">الإجراءات</th>
          </tr>
        </thead>
        <tbody className="divide-y  divide-gray-50">
          {data.map((msg) => (
            <tr
              key={msg.id}
              className="group hover:bg-gray-50/50 transition-colors"
            >
              <td className="py-4 text-gray-800 font-medium whitespace-nowrap">
                {msg.name}
              </td>
              <td className="py-4 text-gray-600 whitespace-nowrap">
                {msg.email}
              </td>
              <td className="py-4 whitespace-nowrap">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    msg.status
                  )}`}
                >
                  {msg.status}
                </span>
              </td>
              <td className="py-4 text-gray-500 text-sm whitespace-nowrap">
                {new Date(msg.created_at).toLocaleDateString("ar-SA")}
              </td>
              <td className="py-4 whitespace-nowrap">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onOpenEdit(msg)}
                    className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-primary hover:text-white transition-colors"
                    title="عرض التفاصيل"
                  >
                    <FiEye size={18} />
                  </button>
                  <button
                    onClick={() => onDelete(msg)}
                    className="p-2 bg-gray-100 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-colors"
                    title="حذف الرسالة"
                  >
                    <FaTrash size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
