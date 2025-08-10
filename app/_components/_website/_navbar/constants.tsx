import { CiBoxList } from "react-icons/ci";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import {
  MdLocalOffer,
  MdOutlineAddToPhotos,
  MdOutlineDesignServices,
} from "react-icons/md";
import { LuBadgeDollarSign } from "react-icons/lu";
import { FaCcMastercard, FaRegCalendarAlt } from "react-icons/fa";
import { HiOutlineUserCircle } from "react-icons/hi";
import { formatTitle } from "@/app/_helpers/helpers";

export function getLinks(user: any) {
  if (!user) return [];

  return [
    {
      href: `/myprofile?account_name=${formatTitle(user?.name)}&acouunt_type=${
        user?.account_type
      }&id=${user.id}`,
      icon: <HiOutlineUserCircle className="w-5 h-5" />,
      label: { en: "My Profile", ar: "الملف الشخصي" },
    },
    {
      href: `/mycards?account_name=${formatTitle(user?.name)}&acouunt_type=${
        user?.account_type
      }&userId=${user.id}`,
      icon: <FaCcMastercard className="w-5 h-5" />,
      label: { en: "My Cards", ar: "بطاقاتى" },
    },
    {
      href: `/Listofreservations?account_name=${formatTitle(
        user?.name
      )}&acouunt_type=${user?.account_type}&userId=${user.id}`,
      icon: <CiBoxList className="w-5 h-5" />,
      label: { en: "List of reservations", ar: "قائمة الحجوزات" },
    },
    {
      href: `/conversations?account_name=${formatTitle(
        user?.name
      )}&acouunt_type=${user?.account_type}&userId=${user.id}`,
      icon: <IoChatbubbleEllipsesOutline className="w-5 h-5" />,
      label: { en: "Conversations", ar: "قائمة المحادثات" },
    },
    {
      href: `/accountbalance?organizzation_name=${formatTitle(
        user?.name
      )}&organization_Id=${user?.id}`,
      icon: <LuBadgeDollarSign className="size-5" />,
      label: { en: "Account balance", ar: "رصيد الحساب" },
    },
  ];
}

export function getOrganizationLinks(user: any) {
  if (!user) return [];

  return [
    ...getLinks(user),
    {
      href: `/myaffiliateservices?organizzation_name=${formatTitle(
        user?.name
      )}&organization_Id=${user?.id}`,
      icon: <MdOutlineDesignServices className="size-5" />,
      label: { en: "organization Services", ar: "خدمات المنظمة" },
    },
    {
      href: `/addaffiliateservice?organizzation_name=${formatTitle(
        user?.name
      )}`,
      icon: <MdOutlineAddToPhotos className="size-5" />,
      label: { en: "Add new service", ar: "أضف خدمة جديدة" },
    },
    {
      href: `/centeroffers?organizzation_name=${formatTitle(
        user?.name
      )}&organization_Id=${user?.id}`,
      icon: <MdLocalOffer className="size-5" />,
      label: { en: "organization offers", ar: "عروض المنظمة" },
    },
    {
      href: `/centerschedule?organizzation_name=${formatTitle(
        user?.name
      )}&organization_Id=${user?.id}`,
      icon: <FaRegCalendarAlt className="size-5" />,
      label: { en: "organization Schedule", ar: "مواعيد المنظمة" },
    },
  ];
}
