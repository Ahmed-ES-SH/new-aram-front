"use client";
import React from "react";
import Img from "../../_website/_global/Img";
import { CiNoWaitingSign } from "react-icons/ci";
import { miniOrg } from "../_services/types";

interface Props {
  form: any;
}

export default function SelectedOrganizations({ form }: Props) {
  const selectedOrgs: miniOrg[] = form?.organizations || [];

  return (
    <div className="w-full space-y-4">
      {/* حالة لا يوجد بيانات */}
      {selectedOrgs.length === 0 ? (
        <div className="w-full min-h-[40vh] flex items-center justify-center">
          <div className="flex flex-col items-center">
            <CiNoWaitingSign className="size-32 text-red-500" />
            <p className="text-gray-500 text-sm text-center">
              لا يوجد مراكز محددة
            </p>
          </div>
        </div>
      ) : (
        /* عرض المراكز المحددة */
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {selectedOrgs.map((org) => (
            <div
              key={org.id}
              className="border border-green-500 bg-green-50 shadow-md rounded-lg p-4  flex flex-col items-center justify-center relative"
            >
              <Img
                src={org.logo}
                alt={org.title}
                className="w-16 h-16 object-contain mb-2 rounded-full"
              />
              <p className="text-sm font-medium text-green-600 text-center">
                {org.title}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
