import { CiBoxList } from "react-icons/ci";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { MdLocalOffer } from "react-icons/md";
import { LuBadgeDollarSign } from "react-icons/lu";
import { FaCcMastercard, FaRegCalendarAlt } from "react-icons/fa";
import {
  // HiOutlineGlobe,
  HiOutlineLogout,
  // HiOutlineSupport,
  HiOutlineUserCircle,
} from "react-icons/hi";
import { formatTitle } from "@/app/_helpers/helpers";
import { BiSolidOffer } from "react-icons/bi";

export function getLinks(user: any) {
  if (!user) return [];

  return [
    {
      href: `/usercontrolpanel/myprofile?account_name=${formatTitle(
        user?.name
      )}&acouunt_type=${user?.account_type}&id=${user.id}`,
      icon: <HiOutlineUserCircle className="w-5 h-5" />,
      label: { en: "My Profile", ar: "الملف الشخصي" },
    },
    {
      href: `/usercontrolpanel/mycards?account_name=${formatTitle(
        user?.name
      )}&acouunt_type=${user?.account_type}&userId=${user.id}`,
      icon: <FaCcMastercard className="w-5 h-5" />,
      label: { en: "My Cards", ar: "بطاقاتى" },
    },
    {
      href: `/usercontrolpanel/listofreservations?account_name=${formatTitle(
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
      href: `/usercontrolpanel/accountbalance?user_name=${formatTitle(
        user?.name
      )}&userId=${user?.id}`,
      icon: <LuBadgeDollarSign className="size-5" />,
      label: { en: "Account balance", ar: "رصيد الحساب" },
    },
    {
      href: `/usercontrolpanel/ownedcoupones?account_type=${
        user?.account_type
      }&userId=${user.id}&account_name=${formatTitle(
        user?.name ?? user?.title
      )}`,
      icon: <BiSolidOffer className="size-5" />,
      label: { en: "Account Coupons", ar: "كوبونات الحساب" },
    },
    // {
    //   href: "/language",
    //   icon: <HiOutlineGlobe className="w-5 h-5" />,
    //   label: { en: "English", ar: "العربية" },
    //   section: "settings",
    // },
    // {
    //   href: "/support",
    //   icon: <HiOutlineSupport className="w-5 h-5" />,
    //   label: { en: "Support", ar: "الدعم" },
    //   section: "settings",
    // },
    {
      href: "/logout",
      icon: <HiOutlineLogout className="w-5 h-5" />,
      label: { en: "Logout", ar: "تسجيل الخروج" },
      section: "settings",
      danger: true,
    },
  ];
}

export function getOrganizationLinks(user: any) {
  if (!user) return [];

  return [
    ...getLinks(user),
    {
      href: `/centeroffers?organizzation_name=${formatTitle(
        user?.title
      )}&organization_Id=${user?.id}`,
      icon: <MdLocalOffer className="size-5" />,
      label: { en: "organization offers", ar: "عروض المركز" },
    },
    {
      href: `/centerschedule?organizzation_name=${formatTitle(
        user?.title
      )}&organization_Id=${user?.id}`,
      icon: <FaRegCalendarAlt className="size-5" />,
      label: { en: "organization Schedule", ar: "مواعيد المركز" },
    },
  ];
}
