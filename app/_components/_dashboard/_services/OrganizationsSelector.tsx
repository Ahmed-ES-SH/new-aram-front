"use client";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { miniOrg, Service } from "./types";
import useFetchData from "@/app/_helpers/FetchDataWithAxios";
import Img from "../../_website/_global/Img";
import { LuCheck } from "react-icons/lu";
import { CiNoWaitingSign, CiSettings } from "react-icons/ci";
import { motion } from "framer-motion";

interface Props {
  form: Service;
  setForm: Dispatch<SetStateAction<Service>>;
}

export default function OrganizationsSelector({ form, setForm }: Props) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [organizations, setOrganizations] = useState<miniOrg[]>([]);

  // Debounce effect (انتظار 5 ثواني بعد آخر كتابة)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [query]);

  // Fetch data with query
  const { data, loading } = useFetchData<miniOrg[]>(
    `/dashboard/organizations-with-selected-data${
      debouncedQuery ? `?query=${debouncedQuery}` : ""
    }`,
    false,
    true // هنا False معناها مفيش تأثير على URL
  );

  useEffect(() => {
    if (data) {
      setOrganizations(data);
    }
  }, [data]);

  const toggleOrganization = (org: miniOrg) => {
    setForm((prev) => {
      const exists = prev.organizations?.some((o) => o.id === org.id);

      return {
        ...prev,
        organizations: exists
          ? prev.organizations.filter((o) => o.id !== org.id)
          : [...(prev.organizations || []), org],
      };
    });
  };

  return (
    <div className="w-full space-y-4">
      {/* Search Input */}
      <input
        type="text"
        placeholder="ابحث عن المراكز هنا..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full border-gray-300 outline-none p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      {/* حالة التحميل */}
      {loading && (
        <div className="w-full min-h-[40vh] flex items-center justify-center">
          <div className="flex flex-col gap-6">
            <motion.div
              animate={{ rotate: [360, 0, 360] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-fit h-fit"
            >
              <CiSettings className="size-32 text-primary" />
            </motion.div>
            <p className="text-gray-700 font-bold  text-center">
              تحميل المراكز...
            </p>
          </div>
        </div>
      )}

      {/* حالة لا يوجد بيانات */}
      {!loading && organizations.length == 0 && (
        <div className="w-full min-h-[40vh] flex items-center justify-center">
          <div className="">
            <CiNoWaitingSign className="size-32 text-red-500" />
            <p className="text-gray-500 text-sm text-center">
              No organizations found
            </p>
          </div>
        </div>
      )}

      {/* عرض المراكز */}
      {!loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {organizations.map((org) => {
            const isSelected =
              form &&
              form.organizations &&
              form.organizations?.some((o) => o.id === org.id);

            return (
              <div
                key={org.id}
                onClick={() => toggleOrganization(org)}
                className={`cursor-pointer border rounded-lg p-4 flex flex-col items-center justify-center transition relative
                ${
                  isSelected
                    ? "border-green-500 bg-green-50 shadow-md"
                    : "border-gray-200 hover:border-blue-300"
                }
              `}
              >
                {isSelected && (
                  <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1">
                    <LuCheck size={14} />
                  </div>
                )}

                <Img
                  src={org.logo}
                  alt={org.title}
                  className="w-16 h-16 object-contain mb-2 rounded-full"
                />
                <p
                  className={`text-sm font-medium text-center ${
                    isSelected ? "text-green-600" : "text-gray-700"
                  }`}
                >
                  {org.title}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
