"use client";
import React, { useEffect } from "react";
import LocaleLink from "../_global/LocaleLink";
import { CiLogin } from "react-icons/ci";
import UserButton from "./UserButton";
import { useLocale, useTranslations } from "next-intl";
import { useAppDispatch, useAppSelector } from "@/app/Store/hooks";
import { instance } from "@/app/_helpers/axios";
import { clearUser, setUser, UserType } from "@/app/Store/userSlice";
import Cookie from "cookie-universal";
import { useRouter } from "next/navigation";
import { NotificationType } from "../_notifications/NotificationBell";

interface props {
  notifications: NotificationType[];
  user: UserType | null;
}

export default function AuthBtns({ notifications, user }: props) {
  const { user: currentUser } = useAppSelector((state) => state.user);

  const locale = useLocale();
  const t = useTranslations("authButtons");

  const dispatch = useAppDispatch();
  const cookie = Cookie();
  const router = useRouter();
  const token = cookie.get("aram_token");

  const logout = async () => {
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
    dispatch(setUser(user));
  }, [user]);

  return (
    <>
      {currentUser && token ? (
        <UserButton
          notifications={notifications ?? []}
          user={currentUser}
          logout={logout}
        />
      ) : (
        <div className="flex items-center gap-4 max-sm:hidden">
          <div className="flex gap-4">
            <LocaleLink
              className="rounded-md flex items-center gap-1 bg-primary hover:bg-white duration-200 hover:text-black px-5 py-2.5 text-sm font-medium text-white  shadow"
              href="/login"
            >
              <p> {t("login")}</p>
              <CiLogin className="size-5" />
            </LocaleLink>
            <div className="">
              <LocaleLink
                className="rounded-md bg-gray-100 text-gray-400 hover:bg-primary hover:text-white duration-200 px-5 py-2.5 text-sm font-medium "
                href="/membership"
              >
                {t("register")}
              </LocaleLink>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
