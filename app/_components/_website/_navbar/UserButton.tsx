"use client";
import Cookie from "cookie-universal";
import Img from "../_global/Img";
import { useEffect, useRef, useState } from "react";
import { HiOutlineLogout } from "react-icons/hi";
import { FaCaretDown } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";
import { GrDashboard } from "react-icons/gr";
import { BiSolidOffer } from "react-icons/bi";
import { useRouter } from "next/navigation";
import { instance } from "@/app/_helpers/axios";
import { directionMap } from "@/app/constants/_website/global";
import { useLocale } from "next-intl";
import { formatTitle } from "@/app/_helpers/helpers";
import { getLinks, getOrganizationLinks } from "./constants";
import NotificationBell, {
  NotificationType,
} from "../_notifications/NotificationBell";
import { useAppSelector } from "@/app/Store/hooks";
import useFetchData from "@/app/_helpers/FetchDataWithAxios";

export default function UserButton({ user }) {
  const { unreadNotificationsCount } = useAppSelector((state) => state.user);
  const { data } = useFetchData<NotificationType[]>(
    `/last-ten-notifications/${user?.id}/${user.account_type}`,
    false
  );

  const router = useRouter();
  const locale = useLocale() || "en";
  const role = user && user.account_type == "user" ? user.role : "organization";
  const cookie = Cookie();

  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationType[]>([]);

  const dropdownRef = useRef<HTMLDivElement>(null); // ref to dropdown wrapper

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

  const logout = async () => {
    try {
      const response = await instance.post("/logout");
      if (response.status == 200) {
        cookie.remove("aram_token");
        if (typeof window !== undefined) {
          window.location.replace(`/${locale}/login`);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleGo = (href: string) => {
    router.push(`/${locale}/${href}`);
    setIsOpen(false);
  };

  const links = user && user?.account_type == "user" && getLinks(user);
  const orgLinks =
    user && user?.account_type != "user" && getOrganizationLinks(user);

  const currentLinks = user?.account_type == "user" ? links : orgLinks || [];
  const displayName = user.name ?? user.title ?? "";

  useEffect(() => {
    if (data) {
      setNotifications(data);
    }
  }, [data]);

  if (!user) return null;

  return (
    <>
      {user && (
        <div
          dir={directionMap[locale]}
          className="relative inline-block text-left w-fit"
          ref={dropdownRef} // attach ref here
        >
          {/* User button */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center justify-center  gap-2 w-[150px] max-md:w-[40px] max-md:h-[40px] overflow-hidden max-md:p-0 max-md:rounded-full max-md:border-2 max-md:border-primary  rounded-md  bg-primary  px-3 py-2 shadow-md hover:bg-gray-300  duration-200"
            >
              <Img
                src={user.image ?? "/defaults/male-noimage.jpg"}
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
              notifications={notifications}
              setNotifications={setNotifications}
              userId={user && user.id}
              accountType={user && user.account_type}
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
                  {currentLinks.map((link, index) => (
                    <div
                      key={index}
                      onClick={() => handleGo(link.href)}
                      className="flex cursor-pointer whitespace-nowrap items-center gap-2 px-4 py-2 text-sm text-gray-700  hover:bg-gray-100  duration-200"
                      role="menuitem"
                    >
                      {link.icon}
                      {link.label[locale]}
                    </div>
                  ))}

                  <div
                    onClick={() =>
                      handleGo(
                        `/${locale}/couponesaccount?account_type=${
                          user?.account_type
                        }&account_name=${formatTitle(displayName)}`
                      )
                    }
                    className="flex cursor-pointer items-center gap-2 px-4 py-2 text-sm text-gray-700  hover:bg-gray-100  duration-200"
                    role="menuitem"
                  >
                    <BiSolidOffer className="w-5 h-5" />
                    {locale === "en" ? "Account Coupones" : "كوبونات الحساب"}
                  </div>

                  {role == "Admin" && (
                    <p
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
                      {locale === "en" ? "Dashboard" : "لوحة التحكم"}
                    </p>
                  )}

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
