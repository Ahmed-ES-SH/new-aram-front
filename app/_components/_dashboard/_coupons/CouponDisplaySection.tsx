import React from "react";
import { Coupon } from "./types";
import UsersDisplay from "./UsersDisplay";
import SelectedOrganizations from "./SelectedOrganizations";

interface props {
  form: Coupon;
}

export default function CouponDisplaySection({ form }: props) {
  const type = form && form?.type;

  console.log(type);

  if (type == "organization") {
    return (
      <div className="h-fit w-full flex flex-col gap-3 mt-4 px-2 py-4 shadow-lg rounded-lg border border-gray-300">
        <label className="input-label">
          المراكز التى تريد إرسال الكوبون اليها
        </label>
        <SelectedOrganizations form={form} />
      </div>
    );
  }

  if (type == "user") {
    return (
      <div className="h-fit w-full flex flex-col gap-3 mt-4 px-2 py-4 shadow-lg rounded-lg border border-gray-300">
        <label className="input-label">
          المستخدمين الذى تم إرسال الكوبون اليهم
        </label>
        <UsersDisplay form={form} />
      </div>
    );
  }

  if (type == "general") {
    return (
      <>
        <div className="h-fit w-full flex flex-col gap-3 mt-4 px-2 py-4 shadow-lg rounded-lg border border-gray-300">
          <label className="input-label">
            المستخدمين الذى تم إرسال الكوبون اليهم
          </label>
          <UsersDisplay form={form} />
        </div>
        <div className="h-fit w-full flex flex-col gap-3 mt-4 px-2 py-4 shadow-lg rounded-lg border border-gray-300">
          <label className="input-label">
            المراكز التى تم إرسال الكوبون اليها
          </label>
          <SelectedOrganizations form={form} />
        </div>
      </>
    );
  }

  return (
    <>
      <div className="w-full"></div>
    </>
  );
}
