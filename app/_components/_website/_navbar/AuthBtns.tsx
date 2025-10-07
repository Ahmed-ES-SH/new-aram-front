"use client";
import React, { useEffect, useState } from "react";
import LocaleLink from "../_global/LocaleLink";
import { CiLogin } from "react-icons/ci";
import UserButton from "./UserButton";
import { useLocale, useTranslations } from "next-intl";
import { useAppDispatch, useAppSelector } from "@/app/Store/hooks";
import { instance } from "@/app/_helpers/axios";
import { clearUser, UserType } from "@/app/Store/userSlice";
import Cookie from "cookie-universal";
import { useRouter } from "next/navigation";

export default function AuthBtns({ serverUser }) {
  const { user } = useAppSelector((state) => state.user);

  const locale = useLocale();
  const t = useTranslations("authButtons");

  const dispatch = useAppDispatch();
  const cookie = Cookie();
  const router = useRouter();
  const token = cookie.get("aram_token");

  const [currentUser, setCurrentUser] = useState<UserType | null>(null);

  const logout = async () => {
    try {
      const response = await instance.post("/logout");
      if (response.status == 200) {
        cookie.remove("aram_token");
        dispatch(clearUser());
        setCurrentUser(null);
        setTimeout(() => {
          router.push(`/${locale}/login`);
        }, 300);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (serverUser && !serverUser.error) {
      setCurrentUser(serverUser);
      return;
    }

    if (user) {
      setCurrentUser(user);
    }
  }, [user, serverUser]);

  return (
    <>
      {currentUser && token ? (
        <UserButton user={currentUser} logout={logout} />
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
