"use client";
import { useAppDispatch, useAppSelector } from "@/app/Store/hooks";
import { setConversationsSidebar } from "@/app/Store/variablesSlice";
import { TiThList } from "react-icons/ti";
import Img from "../_global/Img";
import { useLocale } from "next-intl";
import { MdOutlineDoNotDisturbAlt } from "react-icons/md";
import { FaRegCheckCircle } from "react-icons/fa";
import { useSearchParams } from "next/navigation";
import LocaleLink from "../_global/LocaleLink";
import { formatTitle } from "@/app/_helpers/helpers";

export default function ChatHeader({ avatar }) {
  const { conversationsSidebar } = useAppSelector((state) => state.variables);
  const dispatch = useAppDispatch();

  const locale = useLocale();

  const searchParams = useSearchParams();
  const type = searchParams.get(`receiverType`);

  const sidebarToggle = () => {
    dispatch(setConversationsSidebar(!conversationsSidebar));
  };

  const image = avatar.logo ?? avatar.image;
  const avaterName = avatar.title ?? avatar.name;
  const isSigned = avatar?.is_signed ?? true;
  const isOrg = type == "organization";

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
        <div
          className={`text-white ${
            isSigned ? "bg-green-500" : "bg-red-500"
          } absolute bottom-0 right-0 w-4 h-4 rounded-full`}
        >
          {isSigned ? (
            <FaRegCheckCircle className="size-4" />
          ) : (
            <MdOutlineDoNotDisturbAlt className="size-4" />
          )}
        </div>
      </div>

      <div className="flex-1">
        {isOrg ? (
          <LocaleLink
            href={`/organizations/${formatTitle(avaterName)}?orgId=${
              avatar.id
            }`}
            className="font-medium text-white hover:underline hover:text-sky-500"
          >
            {avaterName}
          </LocaleLink>
        ) : (
          <h3 className="font-medium text-white">{avaterName}</h3>
        )}
        <p
          className={`text-sm text-white ${
            isSigned ? "bg-green-500/30" : "bg-red-500/30"
          } w-fit py-1 px-2 rounded-full`}
        >
          {isSigned
            ? locale === "en"
              ? "Active now"
              : "نشط الآن"
            : locale === "en"
            ? "Inactive"
            : "غير نشط"}
        </p>
      </div>
    </div>
  );
}
