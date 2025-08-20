"use client";
import NotificationsComponent from "./NotificationsComponent";
import LoadingPage from "../_global/LoadingPage";
import Cookie from "cookie-universal";
import Img from "../_global/Img";

import { useEffect, useRef, useState } from "react";
import { HiOutlineLogout } from "react-icons/hi";
import { FaBell, FaCaretDown } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";
import { GrDashboard } from "react-icons/gr";
import { BiSolidOffer } from "react-icons/bi";
import { useRouter } from "next/navigation";
import { instance } from "@/app/_helpers/axios";
import { useAppSelector } from "@/app/Store/hooks";
import { directionMap } from "@/app/constants/_website/global";
import { useLocale } from "next-intl";
import { formatTitle } from "@/app/_helpers/helpers";
import { getLinks, getOrganizationLinks } from "./constants";

export default function UserButton() {
  const router = useRouter();
  const locale = useLocale() || "en";
  const { user, loading } = useAppSelector((state) => state.user);

  const id = user && user.id;
  const role = user && user.role;
  const prevUserRef = useRef(user && user.id);
  const cookie = Cookie();

  const [isOpen, setIsOpen] = useState(false);
  const [showNots, setShowNots] = useState(false);
  const [unReadNots, setUnReadNots] = useState(false);

  const logout = async () => {
    try {
      const response = await instance.post("/logout");
      if (response.status == 200) {
        cookie.remove("aram_token");
        if (typeof window !== undefined) {
          window.location.replace("/login");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const checkNots = async () => {
      try {
        const response = await instance.get(
          `/notifications-isunread/${user.id}`
        );
        if (response.status === 200) {
          setUnReadNots(true);
        } else {
          setUnReadNots(false);
        }
      } catch (error: any) {
        console.log(error);
      }
    };

    // فحص إذا كانت القيمة قد تغيرت بالفعل
    if (id !== prevUserRef.current) {
      checkNots();
      prevUserRef.current = id; // تحديث القيمة المخزنة
    }
  }, [id, user]); // التفاعل مع `id` و `type`

  if (loading) return <LoadingPage />;

  const handleGo = (href: string) => {
    router.push(`/${locale}/${href}`);
    setIsOpen(false);
  };

  const links = getLinks(user);
  const orgLinks = getOrganizationLinks(user);

  const currentLinks = user?.account_type == "user" ? links : orgLinks;

  return (
    <>
      {user && (
        <div
          dir={directionMap[locale]}
          className="relative inline-block text-left w-fit max-lg:hidden"
        >
          {/* زر المستخدم */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-2 w-[150px] max-md:w-[40px] max-md:h-[40px] overflow-hidden max-md:p-0 max-md:rounded-full max-md:border-2 max-md:border-primary  rounded-md  bg-primary  px-3 py-2 shadow-md hover:bg-gray-300  duration-200"
            >
              <Img
                src={user.image}
                errorSrc="/defaults/male-noimage.jpg"
                className="w-8 h-8 max-md:w-full max-md:h-full rounded-full object-cover bg-white"
              />
              <div className="flex relative items-center gap-4">
                <span className=" max-md:hidden sm:inline-block text-sm whitespace-nowrap font-medium text-white ">
                  {user?.name.length > 12
                    ? user?.name.slice(0, 12) + "..."
                    : user?.name}
                </span>
                <FaCaretDown className="  size-3 text-white" />
              </div>
            </button>
            <div
              onClick={() => setShowNots((prev) => !prev)}
              className="relative"
            >
              <FaBell className="size-6 text-primary cursor-pointer" />
              {unReadNots && (
                <div className="top-0 -right-2 absolute animate-ping w-1 h-1 rounded-full bg-orange-500"></div>
              )}
            </div>

            <AnimatePresence>
              {showNots && (
                <motion.div
                  className={`fixed top-28 ltr:right-4 rtl:left-4 max-md:right-1 w-96 max-md:w-[95%] h-fit max-h-[80vh] overflow-y-auto hidden-scrollbar bg-white  shadow-lg border border-gray-200  rounded-lg p-4`}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 50 }}
                  transition={{ duration: 0.5 }}
                >
                  <NotificationsComponent />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* القائمة المنسدلة */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                dir={directionMap[locale]}
                className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white  shadow-lg border border-gray-300 focus:outline-none z-50"
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
                      className="flex cursor-pointer items-center gap-2 px-4 py-2 text-sm text-gray-700  hover:bg-gray-100  duration-200"
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
                        }&account_name=${formatTitle(user?.name)}`
                      )
                    }
                    className="flex cursor-pointer items-center gap-2 px-4 py-2 text-sm text-gray-700  hover:bg-gray-100  duration-200"
                    role="menuitem"
                  >
                    <BiSolidOffer className="w-5 h-5" />
                    {locale === "en" ? "Account Coupones" : "كوبونات المستخدم"}
                  </div>

                  {role == "Admin" && (
                    <p
                      onClick={() =>
                        handleGo(
                          `/dashboard?account_type=${
                            user?.account_type
                          }&account_name=${formatTitle(user?.name)}`
                        )
                      }
                      className="flex cursor-pointer items-center gap-2 px-4 py-2 text-sm text-gray-700  hover:bg-gray-100  duration-200"
                      role="menuitem"
                    >
                      <GrDashboard className="w-5 h-5" />
                      {locale === "en" ? "Dashboard" : "لوحة التحكم"}
                    </p>
                  )}
                  {/* زر تسجيل الخروج */}
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
