"use client";
import React, { useState } from "react";
import { Organization } from "./_organizations/types/organization";
import { AnimatePresence, motion } from "framer-motion";
import Img from "../_website/_global/Img";
import { FiX, FiLayers } from "react-icons/fi";
import LocaleLink from "../_website/_global/LocaleLink";

interface Props {
  organizations: Organization[];
}

export default function OrganizationsPopup({ organizations }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center justify-between gap-2 mt-3 w-fit mx-auto rounded-md p-3 bg-indigo-400 text-white hover:bg-white hover:text-black duration-200 cursor-pointer hover:border-indigo-400 border border-transparent"
      >
        <FiLayers className="size-6" />
        <span>المراكز المرتبطة</span>
        <span className="bg-primary/10 px-1.5 py-0.5 rounded text-[10px] font-bold">
          {Array.isArray(organizations) ? organizations.length : 0}
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-999999"
              onClick={() => setIsOpen(false)}
            />

            {/* Modal Container */}
            <div className="fixed inset-0 z-999999 flex items-center justify-center p-4 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ type: "spring", duration: 0.4 }}
                className="bg-white pointer-events-auto w-full max-w-2xl max-h-[85vh] flex flex-col rounded-3xl shadow-2xl overflow-hidden border border-gray-100"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-primary/10 text-primary rounded-xl">
                      <FiLayers size={18} />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-gray-900">
                        المراكز المرتبطة
                      </h3>
                      <p className="text-xs text-gray-500">
                        قائمة بجميع المراكز التابعة لهذا القسم
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <FiX size={20} />
                  </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-gray-200">
                  {organizations &&
                  Array.isArray(organizations) &&
                  organizations.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {organizations.map((organization) => (
                        <LocaleLink
                          href={`/dashboard/organizations/${organization.id}`}
                          key={`org-${organization.id}`}
                          className="group flex flex-col items-center gap-3 p-4 rounded-2xl border border-gray-100 bg-white hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 cursor-pointer"
                        >
                          <div className="relative size-16 rounded-full p-1 border border-gray-100 bg-gray-50 group-hover:scale-110 transition-transform duration-300">
                            <Img
                              src={
                                organization.image ?? "/defaults/noImage.png"
                              }
                              className="w-full h-full rounded-full object-cover"
                              alt={organization.title}
                            />
                          </div>
                          <p className="text-sm font-semibold text-gray-700 text-center line-clamp-2 group-hover:text-primary transition-colors">
                            {organization.title}
                          </p>
                        </LocaleLink>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                      <FiLayers size={40} className="mb-3 opacity-20" />
                      <p>لا توجد مراكز مرتبطة</p>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex justify-end">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="px-5 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:text-gray-900 transition-colors"
                  >
                    إغلاق
                  </button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
