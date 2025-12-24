"use client";
import Img from "../../_website/_global/Img";
import { LuCheck } from "react-icons/lu";

// Define user type
interface MiniUser {
  id: number;
  name: string;
  email: string;
  image: string;
}

interface Props {
  form: any;
}

export default function UsersDisplay({ form }: Props) {
  const users: MiniUser[] = form?.users || [];

  return (
    <div className="w-full space-y-4">
      {/* If no users */}
      {users.length === 0 && (
        <div className="w-full min-h-[20vh] flex items-center justify-center">
          <p className="text-gray-600 font-semibold text-center">
            لا يوجد مستخدمون مضافون
          </p>
        </div>
      )}

      {/* Display Users */}
      {users.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {users.map((user) => (
            <div
              key={user.id}
              className="border rounded-lg p-4 flex flex-col items-center justify-center transition relative border-green-500 bg-green-50 shadow-md"
            >
              <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1">
                <LuCheck size={14} />
              </div>

              <Img
                src={user.image ?? "/defaults/male-noimage.jpg"}
                errorSrc="/defaults/male-noimage.jpg"
                alt={user.name}
                className="w-16 h-16 object-cover mb-2 rounded-full"
              />
              <p className="text-sm font-medium text-center text-green-600">
                {user.name}
              </p>
              <p className="text-xs text-gray-500 text-center">{user.email}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
