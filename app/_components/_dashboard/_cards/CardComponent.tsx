"use client";
import React, { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import { motion } from "framer-motion";
import {
  FiClock,
  FiShoppingBag,
  FiSettings,
  FiGift,
  FiEdit2,
  FiTrash2,
} from "react-icons/fi";
import Img from "../../_website/_global/Img";
import { Card } from "./types";
import ConfirmDeletePopup from "../../_popups/ConfirmDeletePopup";
import { toast } from "sonner";
import { instance } from "@/app/_helpers/axios";
import LocaleLink from "../../_website/_global/LocaleLink";
import { VscLoading } from "react-icons/vsc";
import { FaCheck, FaPen, FaTimes } from "react-icons/fa";
import { LiaToggleOffSolid, LiaToggleOnSolid } from "react-icons/lia";

interface CardDashDisplayProps {
  card: Card;
  setCards: Dispatch<SetStateAction<Card[]>>;
}

export default function CardDashDisplay({
  card,
  setCards,
}: CardDashDisplayProps) {
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateOrder, setUpdateOrder] = useState(false);
  const [order, setOrder] = useState<string | number>(card?.order ?? 1);
  const [editOrder, setEditOrder] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Animation variants for the main card
  const cardVariants = {
    initial: { scale: 1 },
    hover: {
      scale: 1.02,
      boxShadow:
        "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
    },
  };

  // Animation variants for keyword badges
  const badgeVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
  };

  // Helper function to truncate description to 2 lines
  const truncateDescription = (text: string, maxLength: number = 120) => {
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };

  // Handle delete action
  const handleDelete = async () => {
    try {
      setDeleteLoading(true);
      const response = await instance.delete(
        `/dashboard/delete-card/${card.id}`
      );

      if (response.status === 200) {
        toast.success("تم حذف البطاقة بنجاح");

        setCards((prev) => {
          return prev.filter((d) => d.id !== card.id);
        });
      }
    } catch (error) {
      console.log(error);
      toast.error("حدث خطأ أثناء حذف البطاقة");
    } finally {
      setDeleteLoading(false);
    }
  };

  const toggleActive = async () => {
    try {
      setUpdateLoading(true);
      const newState = !card.active;
      const response = await instance.post(
        `/dashboard/update-card/${card.id}`,
        {
          active: newState ? "1" : "0",
        }
      );
      setCards((prev) =>
        prev.map((serv) =>
          serv.id === card.id ? { ...serv, active: newState ? 1 : 0 } : serv
        )
      );
      if (response.status == 200) {
        toast.success("تم تحديث حالة البطاقة بنجاح .");
      }
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        "حدث خطا أثناء محاولة تحديث حالة البطاقة";
      toast.error(message);
    } finally {
      setUpdateLoading(false);
    }
  };

  const updateOrgOrder = async () => {
    try {
      setUpdateOrder(true);
      const response = await instance.post(
        `/dashboard/update-card/${card.id}`,
        {
          order: order.toString(),
        }
      );
      if (response.status == 200) {
        toast.success("تم تحديث ترتيب البطاقة  بنجاح .");
        setEditOrder(false);
      }
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        "حدث خطا أثناء محاولة تحديث حالة البطاقة";
      toast.error(message);
    } finally {
      setUpdateOrder(false);
    }
  };

  return (
    <>
      <motion.div
        variants={cardVariants}
        initial="initial"
        whileHover="hover"
        className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden max-w-sm relative"
      >
        {/* Action Buttons - Top Right Corner */}
        <div className="absolute top-3 right-3 z-10 flex gap-2">
          <LocaleLink href={`/dashboard/cards/${card.id}`}>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg transition-colors"
              aria-label="Edit card"
            >
              <FiEdit2 size={14} />
            </motion.button>
          </LocaleLink>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setConfirmDelete(true)}
            className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-colors"
            aria-label="Delete card"
          >
            <FiTrash2 size={14} />
          </motion.button>
        </div>

        {/* Card Image */}
        <div className="relative h-48 overflow-hidden">
          <Img
            src={card.image}
            alt={card.title}
            className="w-full h-full object-cover"
          />

          {/* Active/Inactive Badge */}
          <div className="absolute top-3 left-3">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                card.active
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {card.active ? "Active" : "Inactive"}
            </span>
          </div>
        </div>

        {/* Card Content */}
        <div className="p-6">
          {/* Title and Category */}
          <div className="mb-3">
            <h3 className="text-xl font-bold text-gray-900 mb-1 line-clamp-1">
              {card.title}
            </h3>
            {card.category && (
              <span
                style={{
                  background: `${card.category.bg_color}30`,
                  color: `${card.category.bg_color}`,
                }}
                className="text-sm text-blue-600 font-medium block p-1 rounded-md w-fit"
              >
                {card.category.title_ar}
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
            {truncateDescription(card.description)}
          </p>

          {/* Pricing Section */}
          <div className="mb-4">
            <div className="flex items-center gap-2">
              {card.price_before_discount && (
                <span className="text-gray-400 text-sm line-through">
                  ${card.price_before_discount}
                </span>
              )}
              <span className="text-2xl font-bold text-green-600">
                ${card.price}
              </span>
            </div>
          </div>

          {/* Keywords Section */}
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {card.keywords.slice(0, 3).map((keyword, index) => (
                <motion.span
                  key={keyword.id}
                  variants={badgeVariants}
                  initial="initial"
                  animate="animate"
                  transition={{ delay: index * 0.1 }}
                  className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                >
                  {keyword.title}
                </motion.span>
              ))}
              {card.keywords.length > 3 && (
                <motion.span
                  variants={badgeVariants}
                  initial="initial"
                  animate="animate"
                  transition={{ delay: 0.3 }}
                  className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium"
                >
                  +{card.keywords.length - 3}
                </motion.span>
              )}
            </div>
          </div>

          {/* order control */}
          <div className="flex items-center justify-between gap-2 py-4 border-t border-gray-300">
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
            ) : card.active ? (
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

          {/* Stats Section */}
          <div className="grid grid-cols-2 gap-3 text-sm text-gray-600 border-t border-gray-300 pt-2">
            {/* Duration */}
            <div className="flex items-center gap-2">
              <FiClock className="text-gray-400" size={16} />
              <span>{card.duration}</span>
            </div>

            {/* Promotional Purchases */}
            <div className="flex items-center gap-2">
              <FiShoppingBag className="text-gray-400" size={16} />
              <span>{card.number_of_promotional_purchases}</span>
            </div>

            {/* Services Count */}
            <div className="flex items-center gap-2">
              <FiSettings className="text-gray-400" size={16} />
              <span>{card.services_count} Services</span>
            </div>

            {/* Benefits Count */}
            <div className="flex items-center gap-2">
              <FiGift className="text-gray-400" size={16} />
              <span>{card.benefits_count} Benefits</span>
            </div>
          </div>
        </div>
      </motion.div>
      <ConfirmDeletePopup
        title={`البطاقة : ${card.title}`}
        id={card.id}
        loading={deleteLoading}
        showConfirm={confirmDelete}
        onDelete={() => handleDelete()}
        onClose={() => setConfirmDelete(false)}
      />
    </>
  );
}
