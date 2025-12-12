"use client";
import { useAppDispatch, useAppSelector } from "@/app/Store/hooks";
import { setConversationsSidebar } from "@/app/Store/variablesSlice";
import { TiThList } from "react-icons/ti";
import { FiPhone, FiInfo, FiMoreVertical } from "react-icons/fi";
import Img from "../_global/Img";
import { useLocale } from "next-intl";
import { useSearchParams } from "next/navigation";
import LocaleLink from "../_global/LocaleLink";
import { formatTitle, truncateContent } from "@/app/_helpers/helpers";
import { motion } from "framer-motion";

export default function ChatHeader({ avatar }) {
  const { conversationsSidebar } = useAppSelector((state) => state.variables);
  const dispatch = useAppDispatch();

  const locale = useLocale();

  const searchParams = useSearchParams();
  const type = searchParams.get(`receiverType`);

  const sidebarToggle = () => {
    dispatch(setConversationsSidebar(!conversationsSidebar));
  };

  const image = avatar?.logo ?? avatar?.image;
  const avatarName = avatar?.title ?? avatar?.name;
  const isSigned = avatar?.is_signed ?? true;
  const isOrg = type === "organization";

  if (!avatar) return null;

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="relative bg-white/80 backdrop-blur-xl border-b border-gray-100 px-4 py-3 flex items-center justify-between z-10"
    >
      {/* Left side */}
      <div className="flex items-center gap-3">
        <button
          onClick={sidebarToggle}
          className="xl:hidden p-2.5 rounded-xl text-gray-600 hover:text-primary hover:bg-primary/10 transition-all duration-200"
        >
          <TiThList className="size-5" />
        </button>

        {/* Avatar */}
        <div className="relative">
          <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-lg ring-2 ring-primary/20">
            <Img
              src={image ?? "/defaults/male-noimage.jpg"}
              errorSrc="/defaults/male-noimage.jpg"
              className="w-full h-full object-cover"
            />
          </div>
          {/* Online status indicator */}
          <motion.div
            animate={{
              scale: isSigned ? [1, 1.2, 1] : 1,
            }}
            transition={{
              duration: 2,
              repeat: isSigned ? Infinity : 0,
              repeatType: "loop",
            }}
            className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-white shadow-sm ${
              isSigned ? "bg-green-500" : "bg-gray-400"
            }`}
          />
        </div>

        {/* User info */}
        <div className="flex flex-col">
          {isOrg ? (
            <LocaleLink
              href={`/organizations/${formatTitle(avatarName)}?orgId=${
                avatar.id
              }`}
              className="font-semibold text-gray-800 hover:text-primary transition-colors duration-200"
            >
              {avatarName && truncateContent(avatarName, 25)}
            </LocaleLink>
          ) : (
            <h3 className="font-semibold text-gray-800">
              {avatarName && truncateContent(avatarName, 25)}
            </h3>
          )}
          <div className="flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full ${
                isSigned ? "bg-green-500" : "bg-gray-400"
              }`}
            />
            <span
              className={`text-xs font-medium ${
                isSigned ? "text-green-600" : "text-gray-500"
              }`}
            >
              {isSigned
                ? locale === "en"
                  ? "Active now"
                  : "نشط الآن"
                : locale === "en"
                ? "Offline"
                : "غير متصل"}
            </span>
          </div>
        </div>
      </div>

      {/* Right side - Action buttons */}
      {/* <div className="flex items-center gap-1">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-2.5 rounded-xl text-gray-500 hover:text-primary hover:bg-primary/10 transition-all duration-200"
        >
          <FiPhone className="size-5" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-2.5 rounded-xl text-gray-500 hover:text-primary hover:bg-primary/10 transition-all duration-200"
        >
          <FiInfo className="size-5" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-2.5 rounded-xl text-gray-500 hover:text-primary hover:bg-primary/10 transition-all duration-200"
        >
          <FiMoreVertical className="size-5" />
        </motion.button>
      </div> */}
    </motion.div>
  );
}
