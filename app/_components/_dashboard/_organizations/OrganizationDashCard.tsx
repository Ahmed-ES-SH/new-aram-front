"use client";

import { motion } from "framer-motion";
import {
  FaMapMarkerAlt,
  FaPhone,
  FaEye,
  FaEdit,
  FaTrash,
  FaPen,
  FaCheck,
  FaTimes,
} from "react-icons/fa";

import Img from "../../_website/_global/Img";
import { Organization } from "./types/organization";
import { StatusBadge } from "./ui/StatusBadge";
import { CategoryBadge } from "./ui/CategoryBadge";
import { RatingStars } from "./ui/RatingStars";
import LocaleLink from "../../_website/_global/LocaleLink";
import { formatTitle } from "@/app/_helpers/helpers";
import { instance } from "@/app/_helpers/axios";
import { toast } from "sonner";
import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import ConfirmDeletePopup from "../../_popups/ConfirmDeletePopup";
import { LiaToggleOffSolid, LiaToggleOnSolid } from "react-icons/lia";
import { VscLoading } from "react-icons/vsc";

interface OrganizationCardProps {
  organization: Organization;
  setOrganizations: Dispatch<SetStateAction<Organization[]>>;
  index: number;
}

export default function OrganizationDashCard({
  organization,
  setOrganizations,
  index,
}: OrganizationCardProps) {
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [editOrder, setEditOrder] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateOrder, setUpdateOrder] = useState(false);
  const [order, setOrder] = useState<string | number>(organization?.order ?? 1);

  const handleDelete = async () => {
    try {
      setDeleteLoading(true);
      const response = await instance.delete(
        `/delete-organization/${organization.id}`
      );

      if (response.status === 200) {
        toast.success("تم حذف المنظمة بنجاح");

        setOrganizations((prev) => {
          return prev.filter((org) => org.id !== organization.id);
        });
      }
    } catch (error) {
      console.log(error);
      toast.error("حدث خطأ أثناء حذف المنظمة");
    } finally {
      setDeleteLoading(false);
    }
  };

  const toggleActive = async () => {
    try {
      setUpdateLoading(true);
      const newState = !organization.active;
      const response = await instance.post(
        `/update-organization/${organization.id}`,
        { active: newState ? "1" : "0" }
      );
      setOrganizations((prev) =>
        prev.map((org) =>
          org.id === organization.id
            ? { ...org, active: newState ? 1 : 0 }
            : org
        )
      );
      if (response.status == 200) {
        toast.success("تم تحديث حالة المركز بنجاح .");
      }
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        "حدث خطا أثناء محاولة تحديث حالة المركز";
      toast.error(message);
    } finally {
      setUpdateLoading(false);
    }
  };

  const updateOrgOrder = async () => {
    try {
      setUpdateOrder(true);
      const response = await instance.post(
        `/update-organization/${organization.id}`,
        { order: order.toString() }
      );
      if (response.status == 200) {
        toast.success("تم تحديث ترتيب المركز  بنجاح .");
        setEditOrder(false);
      }
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        "حدث خطا أثناء محاولة تحديث حالة المركز";
      toast.error(message);
    } finally {
      setUpdateOrder(false);
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: index * 0.1,
      },
    },
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group"
    >
      {/* Header with logo and banner */}
      <div className="relative h-48">
        <Img
          src={
            organization.image ||
            "/placeholder.png?height=200&width=400&query=organization banner"
          }
          alt={organization.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 left-4">
          <Img
            src={
              organization.logo ||
              "/placeholder.png?height=60&width=60&query=organization logo"
            }
            alt={`${organization.title} logo`}
            className="w-12 h-12 rounded-full border-2 border-white shadow-md"
          />
        </div>
        <div className="absolute top-4 right-4">
          <StatusBadge status={organization.status} />
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
            {organization.title}
          </h3>
          {organization.category && (
            <CategoryBadge category={organization.category} />
          )}
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {organization.description}
        </p>

        {/* Location */}
        <div className="flex items-center gap-2 mb-3">
          <FaMapMarkerAlt className="text-gray-400 text-sm flex-shrink-0" />
          <span className="text-sm text-gray-600 line-clamp-1">
            {organization?.location?.address}
          </span>
        </div>

        {/* Phone */}
        <div className="flex items-center gap-2 mb-4">
          <FaPhone className="text-gray-400 text-sm flex-shrink-0" />
          <span className="text-sm text-gray-600">
            {organization.phone_number}
          </span>
        </div>

        {/* Rating and reservations */}
        <div className="flex items-center justify-between mb-4">
          <RatingStars
            rating={Number.parseFloat(organization.rating as any)}
            showNumber
          />
          <span className="text-sm text-gray-500">
            {organization.number_of_reservations} reservations
          </span>
        </div>

        {/* order control */}
        <div className="flex items-center justify-between gap-2 pt-4 pb-2 border-t border-gray-100">
          {/* Input with confirm & cancel */}
          {updateOrder ? (
            <VscLoading className="text-sky-400 animate-spin" />
          ) : (
            <div className="flex items-center gap-2">
              <div className="flex rounded-md shadow-sm border border-gray-300 overflow-hidden">
                <input
                  disabled={!editOrder}
                  type="number"
                  name="order"
                  value={order}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setOrder(e.target.value)
                  }
                  className="px-2 py-1 w-20 disabled:bg-gray-100 outline-none border-0 focus:ring-0"
                />
                <button
                  type="button"
                  disabled={!editOrder}
                  className="px-2 bg-sky-500 text-white disabled:bg-gray-300"
                  onClick={() => updateOrgOrder()}
                >
                  <FaCheck />
                </button>
                {editOrder && (
                  <button
                    type="button"
                    className="px-2 bg-red-500 text-white"
                    onClick={() => setEditOrder(false)}
                  >
                    <FaTimes />
                  </button>
                )}
              </div>

              {!editOrder && (
                <FaPen
                  onClick={() => setEditOrder(true)}
                  className="text-sky-500 cursor-pointer"
                />
              )}
            </div>
          )}

          {/* Toggle */}
          {updateLoading ? (
            <VscLoading className="text-sky-400 animate-spin" />
          ) : organization.active ? (
            <LiaToggleOnSolid
              className="text-green-500 size-8 cursor-pointer"
              onClick={() => toggleActive()}
            />
          ) : (
            <LiaToggleOffSolid
              className="text-gray-400 size-8 cursor-pointer"
              onClick={() => toggleActive()}
            />
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-100">
          <LocaleLink
            href={`/organizations/${formatTitle(
              organization.title
            )}?organizationId=${organization.id}`}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
          >
            <FaEye className="text-sm" />
          </LocaleLink>
          <LocaleLink
            href={`/dashboard/organizations/${
              organization.id
            }?organizationTitle=${formatTitle(organization.title)}`}
            className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200"
          >
            <FaEdit className="text-sm" />
          </LocaleLink>
          <button
            onClick={() => setDeleteConfirm(true)}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
            title="Delete"
          >
            <FaTrash className="text-sm" />
          </button>
        </div>
      </div>
      <ConfirmDeletePopup
        loading={deleteLoading}
        title={`المركز : ${organization.title}`}
        id={organization.id}
        showConfirm={deleteConfirm}
        onDelete={handleDelete}
        onClose={() => setDeleteConfirm(false)}
      />
    </motion.div>
  );
}
