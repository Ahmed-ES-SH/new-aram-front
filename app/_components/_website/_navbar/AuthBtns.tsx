import React from "react";
import LocaleLink from "../_global/LocaleLink";
import { CiLogin } from "react-icons/ci";
import UserButton from "./UserButton";
import FetchData from "@/app/_helpers/FetchData";
import { getTranslations } from "next-intl/server";

export default async function AuthBtns() {
  const t = await getTranslations("authButtons");

  const user = await FetchData("/current-user", false);

  console.log(user);

  return (
    <>
      {user && !user.error ? (
        <UserButton user={user} />
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
