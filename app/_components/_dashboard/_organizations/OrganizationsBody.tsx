"use client";

import { FaBars } from "react-icons/fa";
import { useAppDispatch, useAppSelector } from "@/app/Store/hooks";
import { setSidebardashOrgs } from "@/app/Store/variablesSlice";
import { VscLoading } from "react-icons/vsc";

import OrganizationsFilterSidebar from "./FilterSidebar";
import OrganizationDashCard from "./OrganizationDashCard";
import Pagination from "../../PaginationComponent";
import { useOrganizationsQuery } from "./hooks/useOrganizationsQuery";

export default function OrganizationsBody({ data, last_page, total }: any) {
  const dispatch = useAppDispatch();
  const { sidebardashOrgs, width } = useAppSelector((s) => s.variables);

  const {
    organizations,
    currentPage,
    lastPage,
    total: totalFound,
    query,
    loading,
    setQuery,
    setCurrentPage,
    setOrganizations,
    trigger,
  } = useOrganizationsQuery(data, last_page, total);

  const onToggle = () => dispatch(setSidebardashOrgs(!sidebardashOrgs));

  // Auto open sidebar in large screens
  if (width >= 1024 && !sidebardashOrgs) {
    dispatch(setSidebardashOrgs(true));
  }

  return (
    <div className="flex items-start gap-3 min-h-screen relative w-full">
      <OrganizationsFilterSidebar
        setHypired={trigger}
        query={query}
        setQuery={setQuery}
      />

      <div dir="rtl" className="w-full p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">المنظمات</h1>
            <p className="text-gray-600 mt-1">
              إدارة وعرض جميع المنظمات ( {totalFound} تم العثور عليها )
            </p>
          </div>

          <button
            onClick={onToggle}
            className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white border rounded-lg shadow-sm"
          >
            <FaBars className="text-gray-600" />
            <span>الفلاتر</span>
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="w-full h-[80vh] flex items-center justify-center">
            <VscLoading className="animate-spin size-32 text-primary" />
          </div>
        )}

        {/* Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {organizations.map((org: any, index: number) => (
              <OrganizationDashCard
                key={org.id}
                organization={org}
                setOrganizations={setOrganizations}
                index={index}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={lastPage}
          onPageChange={(p) => {
            trigger();
            setCurrentPage(p);
          }}
        />

        {/* Empty state */}
        {!loading && organizations.length === 0 && (
          <div className="text-center min-h-[80vh] flex items-center justify-center">
            <div>
              <div className="text-gray-400 text-6xl mb-4">🏢</div>
              <h3 className="text-lg font-medium text-gray-900">
                لا توجد منظمات
              </h3>
              <p className="text-gray-600">حاول تعديل الفلاتر لعرض المزيد.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
