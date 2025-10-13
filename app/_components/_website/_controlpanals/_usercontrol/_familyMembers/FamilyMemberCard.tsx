import { motion } from "framer-motion";
import {
  FaUser,
  FaPhone,
  FaCalendar,
  FaIdCard,
  FaVenus,
  FaMars,
  //   FaTrash,
  FaTimes,
  FaCheck,
} from "react-icons/fa";
import { useLocale, useTranslations } from "next-intl";
import Img from "../../../_global/Img";
import { FamilyCardProps } from "./types";
import { directionMap } from "@/app/constants/_website/global";
import { useAppSelector } from "@/app/Store/hooks";
import { toast } from "sonner";
import { instance } from "@/app/_helpers/axios";
import { useState } from "react";
import CheckCurrentUserPopup from "../../../_global/CheckCurrentUserPopup";
import { VscLoading } from "react-icons/vsc";
import ConfirmDeletePopup from "@/app/_components/_popups/ConfirmDeletePopup";

type loadingType = "pending" | "accepted" | "rejected" | "delete" | "";

export default function FamilyMemberCard({
  member,
  setMembers,
}: FamilyCardProps) {
  const { user } = useAppSelector((state) => state.user);

  const locale = useLocale();
  const t = useTranslations("familyCard");

  const otherSide = member.member.id == user?.id ? member.user : member.member;

  const [currentUserCheck, setCurrentUserCheck] = useState(false);
  const [loading, setLoading] = useState<loadingType>("");
  const [confirmDelete, setConfirmDelete] = useState(false);

  // حساب العمر من تاريخ الميلاد
  const calculateAge = (birthDate: string): number => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }

    return age;
  };

  const age = calculateAge(otherSide.birth_date);
  const isMale = member.member.gender === "male";
  const defaultImage = isMale
    ? "/defaults/male-noimage.jpg"
    : "/defaults/female-noimage.jpg";

  // تصنيف الألوان حسب الجنس
  const cardColors = isMale
    ? {
        gradient: "from-blue-900 to-blue-700",
        accent: "bg-blue-600",
        text: "text-blue-100",
        border: "border-blue-500",
      }
    : {
        gradient: "from-pink-900 to-pink-700",
        accent: "bg-pink-600",
        text: "text-pink-100",
        border: "border-pink-500",
      };

  // تحديد ما إذا كان المستخدم الحالي هو المرسل
  const isSender = member.user_id == user?.id;

  const onAccept = async () => {
    if (!user) {
      setCurrentUserCheck(true);
      return;
    }
    try {
      setLoading("accepted");
      const response = await instance.post(`/family/${member.id}/accept`);
      if (response.status == 200) {
        setMembers((prev) =>
          prev.map((item) =>
            item.id === member.id ? { ...item, status: "accepted" } : item
          )
        );
        toast.success("تم قبول الدعوة بنجاح .");
      }
    } catch (error: any) {
      console.log(error);
      const message =
        error?.response?.data?.message[locale] ??
        error?.response?.data?.message ??
        "حدث خطأ غير متوقع اثناء اتخاذ الإجراء المحدد الرجاء المحاولة لاحقا !";
      toast.error(message);
    } finally {
      setLoading("");
    }
  };

  const onReject = async () => {
    if (!user) {
      setCurrentUserCheck(true);
      return;
    }
    try {
      setLoading("rejected");
      const response = await instance.post(`/family/${member.id}/reject`);
      if (response.status == 200) {
        setMembers((prev) =>
          prev.map((item) =>
            item.id === member.id ? { ...item, status: "rejected" } : item
          )
        );
        toast.warning("تم رفض الدعوة بنجاح !");
      }
    } catch (error: any) {
      console.log(error);
      const message =
        error?.response?.data?.message[locale] ??
        error?.response?.data?.message ??
        "حدث خطأ غير متوقع اثناء اتخاذ الإجراء المحدد الرجاء المحاولة لاحقا !";
      toast.error(message);
    } finally {
      setLoading("");
    }
  };

  const onDelete = async () => {
    if (!user) {
      setCurrentUserCheck(true);
      return;
    }
    try {
      setLoading("delete");
      const response = await instance.delete(`/family/${member.id}`);
      if (response.status == 200) {
        setMembers((prev) => prev.filter((item) => item.id !== member.id));
        toast.info("تم حذف العلاقة بنجاح !");
      }
    } catch (error: any) {
      console.log(error);
      const message =
        error?.response?.data?.message[locale] ??
        error?.response?.data?.message ??
        "حدث خطأ غير متوقع اثناء اتخاذ الإجراء المحدد الرجاء المحاولة لاحقا !";
      toast.error(message);
    } finally {
      setLoading("");
    }
  };

  return (
    <>
      <motion.div
        dir={directionMap[locale]}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`w-full min-h-[370px] rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br ${cardColors.gradient} ${cardColors.border} border-2`}
      >
        {/* رأس البطاقة */}
        <div className={`p-6 ${cardColors.accent} text-white`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              {isMale ? (
                <FaMars className="text-2xl text-blue-200" />
              ) : (
                <FaVenus className="text-2xl text-pink-200" />
              )}
              <div>
                <h2 className="text-xl font-bold">{otherSide.name}</h2>
                <p className="text-sm opacity-90">{member.relationship}</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs bg-white text-black bg-opacity-20 px-2 py-1 rounded-full">
                {t("memberId")}: {member.id}
              </span>
            </div>
          </div>
        </div>

        {/* محتوى البطاقة */}
        <div className="p-6 bg-white">
          {/* الصورة والعمر */}
          <div className="flex items-center mb-6">
            <div className="relative">
              <Img
                src={otherSide.image ?? defaultImage}
                errorSrc={defaultImage}
                alt={otherSide.name}
                className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
              />
              <div
                className={`absolute -bottom-2 -right-2 ${cardColors.accent} text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg`}
              >
                {age} {t("years")}
              </div>
            </div>
          </div>

          {/* معلومات إضافية */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center  text-gray-700">
              <FaCalendar
                className={`mr-3 rtl:mr-0 rtl:ml-3 ${
                  isMale ? "text-blue-600" : "text-pink-600"
                }`}
              />
              <div className="flex items-center gap-2">
                <span className="font-medium">{t("birthDate")}:</span>
                <span>
                  {new Date(otherSide.birth_date).toLocaleDateString(locale)}
                </span>
              </div>
            </div>

            <div className="flex items-center  text-gray-700">
              <FaPhone
                className={`mr-3 rtl:mr-0 rtl:ml-3 ${
                  isMale ? "text-blue-600" : "text-pink-600"
                }`}
              />
              <div className="flex items-center gap-2">
                <span className="font-medium">{t("phone")}:</span>
                <span>{otherSide.phone}</span>
              </div>
            </div>

            <div className="flex items-center  text-gray-700">
              <FaUser
                className={`mr-3 rtl:mr-0 rtl:ml-3 ${
                  isMale ? "text-blue-600" : "text-pink-600"
                }`}
              />
              <div className="flex items-center gap-2">
                <span className="font-medium">{t("relationship")}:</span>
                <span>{member.relationship}</span>
              </div>
            </div>

            <div className="flex items-center  text-gray-700">
              <FaIdCard
                className={`mr-3 rtl:mr-0 rtl:ml-3 ${
                  isMale ? "text-blue-600" : "text-pink-600"
                }`}
              />
              <div className="flex items-center gap-2">
                <span className="font-medium">{t("status.title")}:</span>
                <span
                  className={`mr-2 rtl:mr-0 rtl:ml-2 px-2 py-1 rounded-full text-xs ${
                    member.status === "accepted"
                      ? "bg-green-100 text-green-800"
                      : member.status === "rejected"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {t(`status.${member.status}`)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* تذييل البطاقة */}
        <div
          className={`px-6 py-3 ${cardColors.accent} bg-opacity-10 flex justify-between items-center`}
        >
          <span className={`text-sm text-white font-medium`}>
            {new Date(member.updated_at).toLocaleDateString(locale)}
          </span>

          {/* الأزرار حسب الحالة */}
          <div className="flex items-center gap-2">
            {member.status === "pending" && !isSender && (
              <>
                <button
                  disabled={loading == "accepted"}
                  onClick={() => onAccept && onAccept()}
                  className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1 rounded-full flex items-center justify-center gap-1 transition"
                >
                  {loading == "accepted" ? (
                    <VscLoading className="animate-spin" />
                  ) : (
                    <div className="flex items-center gap-1">
                      <FaCheck /> {t("actions.accept")}
                    </div>
                  )}
                </button>
                <button
                  disabled={loading == "rejected"}
                  onClick={() => onReject && onReject()}
                  className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1 transition"
                >
                  {loading == "rejected" ? (
                    <VscLoading className="animate-spin" />
                  ) : (
                    <div className="flex items-center gap-1">
                      <FaTimes /> {t("actions.reject")}
                    </div>
                  )}
                </button>
              </>
            )}

            {/* {(member.status == "accepted" || member.status == "rejected") && (
              <button
                disabled={loading == "delete"}
                onClick={() => setConfirmDelete(true)}
                className="bg-gray-600 hover:bg-gray-700 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1 transition"
              >
                {loading == "delete" ? (
                  <VscLoading className="animate-spin" />
                ) : (
                  <div className="flex items-center gap-1">
                    <FaTrash /> {t("actions.delete")}
                  </div>
                )}
              </button>
            )} */}
          </div>
        </div>
      </motion.div>

      {/* check current user */}
      <CheckCurrentUserPopup
        isOpen={currentUserCheck}
        onClose={() => setCurrentUserCheck(false)}
      />

      {/* confirm delete poup */}

      <ConfirmDeletePopup
        showConfirm={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onDelete={onDelete}
        id={member.id}
        title={`العلاقة بينك وبين ${member.member.name}`}
        loading={loading == "delete"}
      />
    </>
  );
}
