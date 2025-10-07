"use client";

import { usePathname, useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { AnimatePresence, motion, spring } from "framer-motion";
import { ReactNode, useEffect } from "react";
import LocaleLink from "../_global/LocaleLink";
import Cookie from "cookie-universal";
import { instance } from "@/app/_helpers/axios";
import { useAppDispatch, useAppSelector } from "@/app/Store/hooks";
import { clearUser } from "@/app/Store/userSlice";
import { FaTimes } from "react-icons/fa";
import { setUserPanalSidebar } from "@/app/Store/variablesSlice";

interface SidebarItem {
  href: string;
  icon: ReactNode;
  label: { en: string; ar: string };
  section?: "overview" | "settings";
  danger?: boolean;
}

interface SidebarProps {
  items: SidebarItem[];
}

export default function ControlSidebar({ items }: SidebarProps) {
  const cookie = Cookie();

  const { userPanalSidebar, width } = useAppSelector(
    (state) => state.variables
  );

  const { unreadMessagesCount } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();

  const handleLogout = async () => {
    try {
      const response = await instance.post("/logout");
      if (response.status == 200) {
        cookie.remove("aram_token");
        dispatch(clearUser());
        setTimeout(() => {
          router.push(`/${locale}/login`);
        }, 300);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (width >= 1280) {
      dispatch(setUserPanalSidebar(true));
    }
  }, [dispatch, width]);

  return (
    <>
      {/* over lay  */}
      {userPanalSidebar && (
        <div
          onClick={() => dispatch(setUserPanalSidebar(!userPanalSidebar))}
          className="xl:hidden fixed w-full h-screen top-0 left-0 bg-black/50 backdrop-blur-md z-[99]"
        />
      )}
      <AnimatePresence>
        {userPanalSidebar && (
          <motion.aside
            key="userSidebar"
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{
              type: spring,
              stiffness: 120,
              damping: 18,
            }}
            className="xl:h-[91vh] h-screen xl:sticky fixed xl:top-20 max-xl:z-[999] top-0 left-0 overflow-y-auto xl:min-w-60 w-80 bg-white ltr:border-r rtl:border-l border-gray-200 flex flex-col justify-between p-4"
          >
            {/* close Icon */}
            <FaTimes
              onClick={() => dispatch(setUserPanalSidebar(!userPanalSidebar))}
              className="xl:hidden block absolute top-5 right-2 text-red-400 hover:text-red-600 hover:scale-105 duration-300 cursor-pointer"
            />
            {/* Logo */}
            <div className="mt-12">
              {/* Overview Section */}
              <div className="text-gray-400 uppercase text-xs pb-3 border-b border-gray-300 font-semibold mb-2 px-2">
                {locale == "en" ? "Over View" : "نظرة عامة"}
              </div>
              <nav className="flex flex-col  gap-3">
                {items
                  .filter(
                    (item) => item.section === "overview" || !item.section
                  )
                  .map((item) => {
                    const mainPath = item.href.split("?")[0];
                    const active = pathname.includes(mainPath);
                    const isConversations =
                      item.href.includes(`/conversations`);
                    return (
                      <LocaleLink
                        className={`flex items-center justify-between w-full relative rounded-xl ${
                          active
                            ? "bg-primary text-white font-medium"
                            : "text-gray-600 hover:bg-gray-100"
                        }`}
                        key={item.href}
                        href={item.href}
                      >
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          className={`flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer transition-all `}
                        >
                          {item.icon}
                          <span>{item.label[locale as "en" | "ar"]}</span>
                        </motion.div>
                        {isConversations && unreadMessagesCount > 0 && (
                          <span className="bg-red-400 rounded-full w-4 h-4 text-xs animate-bounce ltr:mr-2 rtl:ml-2 flex items-center justify-center text-white">
                            {unreadMessagesCount}
                          </span>
                        )}
                      </LocaleLink>
                    );
                  })}
              </nav>
            </div>

            {/* Settings Section */}
            <div>
              <div className="text-gray-400 uppercase text-xs font-semibold mb-2 px-2">
                Settings
              </div>
              <nav className="flex flex-col gap-1">
                {items
                  .filter((item) => item.section === "settings")
                  .map((item) => (
                    <LocaleLink key={item.href} href={item.href}>
                      <motion.div
                        onClick={item.danger ? handleLogout : () => {}}
                        whileHover={{ scale: 1.02 }}
                        className={`flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer transition-all ${
                          item.danger
                            ? "text-red-600 hover:bg-red-100"
                            : "text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        {item.icon}
                        <span>{item.label[locale as "en" | "ar"]}</span>
                      </motion.div>
                    </LocaleLink>
                  ))}
              </nav>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
