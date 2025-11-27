"use client";
import Img from "../_global/Img";
import { useEffect, useRef, useState } from "react";
import { HiOutlineLogout } from "react-icons/hi";
import { FaBell, FaCaretDown } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";
import { GrDashboard } from "react-icons/gr";
import { useRouter } from "next/navigation";
import { directionMap } from "@/app/constants/_website/global";
import { useLocale } from "next-intl";
import { formatTitle } from "@/app/_helpers/helpers";
// import { getLinks, getOrganizationLinks } from "./constants";
import NotificationBell from "../_notifications/NotificationBell";
import { useAppSelector } from "@/app/Store/hooks";
import { RiDashboardHorizontalFill } from "react-icons/ri";
import { BsBuildingsFill, BsChatDots } from "react-icons/bs";

export default function UserButton({ user, logout, notifications }) {
  const { unreadNotificationsCount, unreadMessagesCount } = useAppSelector(
    (state) => state.user
  );

  const router = useRouter();
  const locale = useLocale() || "en";
  const role = user && user.account_type == "user" ? user.role : "organization";

  const [isOpen, setIsOpen] = useState(false);

  const dropdownRef = useRef<HTMLButtonElement>(null); // ref to dropdown wrapper

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleGo = (href: string) => {
    router.push(`/${locale}/${href}`);
    setIsOpen(false);
  };

  // const links = user && user?.account_type == "user" && getLinks(user);
  // const orgLinks =
  //   user && user?.account_type != "user" && getOrganizationLinks(user);

  // const currentLinks = user?.account_type == "user" ? links : orgLinks || [];

  const displayName = user?.name ?? user?.title ?? "";

  const image = user?.account_type == "user" ? user?.image : user?.logo;

  if (!user) return null;

  return (
    <>
      {user && (
        <div
          dir={directionMap[locale]}
          className="relative inline-block text-left w-fit"
        >
          {/* User button */}
          <div className="flex items-center gap-3">
            <button
              ref={dropdownRef}
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center justify-center outline-none gap-2 w-[150px] max-md:w-[40px] max-md:h-[40px] overflow-hidden max-md:p-0 max-md:rounded-full max-md:border-2 max-md:border-primary  rounded-md  bg-primary  px-3 py-2 shadow-md hover:bg-gray-300  duration-200"
            >
              {unreadMessagesCount > 0 && (
                <div className="absolute animate-pulse -top-1 ltr:-left-1 rtl:-right-1 rounded-full text-xs  flex items-center justify-center text-red-500">
                  <FaBell className="size-6" />
                  <p className=" absolute text-white">{unreadMessagesCount}</p>
                </div>
              )}
              <Img
                src={image ?? "/defaults/male-noimage.jpg"}
                errorSrc="/defaults/male-noimage.jpg"
                className="rounded-full w-8 h-8  object-cover"
              />
              <div className="md:flex hidden relative items-center gap-4">
                <span className="max-md:hidden sm:inline-block text-sm whitespace-nowrap font-medium text-white">
                  {displayName.length > 6
                    ? displayName.slice(0, 6) + "..."
                    : displayName}
                </span>
                <FaCaretDown className="  size-3 text-white" />
              </div>
            </button>

            {/* NotificationBell */}
            <NotificationBell
              notifications={notifications ?? []}
              userId={user?.id}
              accountType={user?.account_type}
              unreadCount={unreadNotificationsCount}
            />
          </div>

          {/* Dropdown menu */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                dir={directionMap[locale]}
                className="absolute ltr:right-0 rtl:left-0 mt-2 w-48 origin-top-left rounded-md bg-white  shadow-lg border border-gray-300 focus:outline-none z-50"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="py-1" role="none">
                  {role == "admin" ||
                    (role == "super_admin" && (
                      <div
                        onClick={() =>
                          handleGo(
                            `/dashboard?account_type=${
                              user?.account_type
                            }&account_name=${formatTitle(displayName)}`
                          )
                        }
                        className="flex cursor-pointer items-center gap-2 px-4 py-2 text-sm text-gray-700  hover:bg-gray-100  duration-200"
                        role="menuitem"
                      >
                        <GrDashboard className="w-5 h-5" />
                        <p>{locale === "en" ? "Dashboard" : "لوحة التحكم"}</p>
                      </div>
                    ))}

                  {user && user.account_type == "user" && (
                    <div
                      onClick={() =>
                        handleGo(
                          `/usercontrolpanel?account_type=${
                            user?.account_type
                          }&account_name=${formatTitle(displayName)}&userId=${
                            user?.id
                          }`
                        )
                      }
                      className="flex cursor-pointer items-center gap-2 px-4 py-2 text-sm text-gray-700  hover:bg-gray-100  duration-200"
                      role="menuitem"
                    >
                      <RiDashboardHorizontalFill className="w-5 h-5" />
                      <p>
                        {locale === "en" ? "User Dashboard" : "لوحة المستخدم"}
                      </p>
                    </div>
                  )}

                  {user && user.account_type == "organization" && (
                    <div
                      onClick={() =>
                        handleGo(
                          `/centercontrolpanel?account_type=${
                            user?.account_type
                          }&account_name=${formatTitle(displayName)}&userId=${
                            user?.id
                          }`
                        )
                      }
                      className="flex cursor-pointer items-center gap-2 px-4 py-2 text-sm text-gray-700  hover:bg-gray-100  duration-200"
                      role="menuitem"
                    >
                      <BsBuildingsFill className="w-5 h-5" />
                      <p>
                        {locale === "en" ? "Center Dashboard" : "لوحة المركز"}
                      </p>
                    </div>
                  )}

                  <div
                    onClick={() =>
                      handleGo(`/conversations?userId=${user?.id}`)
                    }
                    className="relative flex items-center whitespace-nowrap justify-between gap-2 px-4 py-2 hover:bg-gray-100 transition text-sm cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <BsChatDots className="text-lg" />
                      {locale === "en" ? "conversations" : "المحادثات"}
                    </div>
                    {unreadMessagesCount > 0 && (
                      <div className="w-6 h-6 flex items-center justify-center rounded-full bg-red-400 text-[12px] text-white">
                        {unreadMessagesCount > 9 ? "9 +" : unreadMessagesCount}
                      </div>
                    )}
                  </div>

                  {/* Logout */}
                  <button
                    onClick={logout}
                    className="flex items-center gap-2 text-red-500 w-full px-4 py-2 text-sm hover:bg-gray-100  duration-200"
                    role="menuitem"
                  >
                    <HiOutlineLogout className="w-5 h-5" />
                    {locale === "en" ? "Logout" : "تسجيل الخروج"}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </>
  );
}
