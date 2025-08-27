"use client";

import { motion } from "framer-motion";
import {
  FaMapMarkerAlt,
  FaPhone,
  FaEye,
  FaEdit,
  FaTrash,
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
import { Dispatch, SetStateAction, useState } from "react";
import ConfirmDeletePopup from "../../_popups/ConfirmDeletePopup";

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
          <CategoryBadge category={organization.category} />
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
            rating={Number.parseFloat(organization.rating)}
            showNumber
          />
          <span className="text-sm text-gray-500">
            {organization.number_of_reservations} reservations
          </span>
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
