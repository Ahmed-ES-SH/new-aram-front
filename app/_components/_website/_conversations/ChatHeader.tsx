"use client";
import { useAppDispatch, useAppSelector } from "@/app/Store/hooks";
import { setConversationsSidebar } from "@/app/Store/variablesSlice";
import { TiThList } from "react-icons/ti";
import Img from "../_global/Img";

export default function ChatHeader({ avatar }) {
  const { conversationsSidebar } = useAppSelector((state) => state.variables);
  const dispatch = useAppDispatch();

  const sidebarToggle = () => {
    dispatch(setConversationsSidebar(!conversationsSidebar));
  };

  const image = avatar.logo ? avatar.logo : avatar.image;
  const avaterName = avatar.title ? avatar.title : avatar.name;

  if (!avatar) return null;
  return (
    <div className="bg-primary border-b border-gray-200 p-4 flex items-center space-x-4">
      <button
        onClick={sidebarToggle}
        className="xl:hidden p-2 rounded-lg text-white hover:text-primary hover:bg-gray-100 transition-colors"
      >
        <TiThList className="size-6" size={20} />
      </button>
      <div className="w-12 h-12 relative rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white">
        <Img
          src={image ?? "/defaults/male-noimage.jpg"}
          errorSrc="/defaults/male-noimage.jpg"
          className="w-full h-full object-cover rounded-full"
        />
        <div className="w-3 h-3 rounded-full bg-indigo-500 absolute bottom-0 right-0"></div>
      </div>
      <div className="flex-1">
        <h3 className="font-medium text-white">{avaterName}</h3>
        <p className="text-sm text-indigo-500">Active now</p>
      </div>
    </div>
  );
}
