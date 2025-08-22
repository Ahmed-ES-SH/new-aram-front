"use client";
import React, { useEffect, useState } from "react";
import OrganizationDashCard from "./OrganizationDashCard";
import { Organization } from "./types/organization";
import { FaBars } from "react-icons/fa";
import { useAppDispatch, useAppSelector } from "@/app/Store/hooks";
import { setSidebardashOrgs } from "@/app/Store/variablesSlice";

interface props {
  data: Organization[];
}

export default function OrganizationsBody({ data }: props) {
  const { sidebardashOrgs, width } = useAppSelector((state) => state.variables);
  const dispatch = useAppDispatch();

  const [organizations, setOrganizations] = useState<Organization[]>([]);

  const onToggle = () => {
    dispatch(setSidebardashOrgs(!sidebardashOrgs));
  };

  useEffect(() => {
    if (data) {
      setOrganizations(data);
    }
  }, [data]);

  useEffect(() => {
    if (width >= 1024) {
      dispatch(setSidebardashOrgs(true));
    }
  }, [dispatch, width]);

  return (
    <>
      <div dir="rtl" className="w-full p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">المنظمات</h1>
            <p className="text-gray-600 mt-1">
              إدارة وعرض جميع المنظمات ( {organizations && organizations.length}{" "}
              تم العثور عليها )
            </p>
          </div>
          <button
            onClick={() => onToggle()}
            className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50"
          >
            <FaBars className="text-gray-600" />
            <span>الفلاتر</span>
          </button>
        </div>

        {/* Organizations grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 w-full">
          {organizations &&
            organizations.map((organization, index) => (
              <OrganizationDashCard
                key={organization.id}
                setOrganizations={setOrganizations}
                organization={organization}
                index={index}
              />
            ))}
        </div>

        {/* Empty state */}
        {organizations && organizations.length === 0 && (
          <div className="text-center min-h-[80vh] flex items-center justify-center py-12">
            <div className="">
              <div className="text-gray-400 text-6xl mb-4">🏢</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                لا توجد منظمات
              </h3>
              <p className="text-gray-600">
                حاول تعديل الفلاتر لعرض المزيد من النتائج.
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
