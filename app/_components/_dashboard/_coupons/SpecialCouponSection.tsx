import React, { Dispatch, SetStateAction } from "react";
import { Coupon } from "./types";
import OrganizationsSelector from "../_services/OrganizationsSelector";
import UsersSelector from "./UsersSelector";

interface props {
  form: Coupon;
  setForm: Dispatch<SetStateAction<Coupon>>;
}

export default function SpecialCouponSection({ form, setForm }: props) {
  const type = form && form?.type;

  if (type == "organization") {
    return (
      <div className="h-fit w-full flex flex-col gap-3 mt-4 px-2 py-4 shadow-lg rounded-lg border border-gray-300">
        <label className="input-label">
          حدد المراكز التى تريد إرسال الكوبون اليها
        </label>
        <OrganizationsSelector form={form} setForm={setForm} />
      </div>
    );
  }

  if (type == "user") {
    return (
      <div className="h-fit w-full flex flex-col gap-3 mt-4 px-2 py-4 shadow-lg rounded-lg border border-gray-300">
        <label className="input-label">
          حدد المستخدمين التى تريد إرسال الكوبون اليهم
        </label>
        <UsersSelector form={form} setForm={setForm} />
      </div>
    );
  }

  return (
    <>
      <div className="w-full"></div>
    </>
  );
}
