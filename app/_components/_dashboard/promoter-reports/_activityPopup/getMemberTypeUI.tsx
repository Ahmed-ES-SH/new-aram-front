import { FiUser, FiHome, FiAlertCircle } from "react-icons/fi";

export default function getMemberTypeUI(type?: string) {
  switch (type) {
    case "user":
      return (
        <div className="flex items-center gap-2 text-blue-600">
          <FiUser className="text-lg" />
          <span>مستخدم</span>
        </div>
      );
    case "organization":
      return (
        <div className="flex items-center gap-2 text-purple-600">
          <FiHome className="text-lg" />
          <span>مركز</span>
        </div>
      );
    default:
      return (
        <div className="flex items-center gap-2 text-gray-500">
          <FiAlertCircle className="text-lg" />
          <span>غير معروف</span>
        </div>
      );
  }
}
