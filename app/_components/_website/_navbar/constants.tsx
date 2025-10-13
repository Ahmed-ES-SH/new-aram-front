import { MdFamilyRestroom, MdLocalOffer } from "react-icons/md";
import { FaCcMastercard, FaRegCalendarAlt, FaWallet } from "react-icons/fa";
import {
  // HiOutlineGlobe,
  HiOutlineLogout,
  // HiOutlineSupport,
} from "react-icons/hi";
import { formatTitle } from "@/app/_helpers/helpers";
import { BiSolidConversation, BiSolidOffer } from "react-icons/bi";
import { FaCircleUser } from "react-icons/fa6";
import { PiListChecksFill } from "react-icons/pi";

export function getLinks(user: any) {
  if (!user) return [];

  return [
    {
      href: `/usercontrolpanel/myprofile?account_name=${formatTitle(
        user?.name
      )}&acouunt_type=${user?.account_type}&id=${user.id}`,
      icon: <FaCircleUser className="w-5 h-5" />,
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
      icon: <PiListChecksFill className="w-5 h-5" />,
      label: { en: "List of reservations", ar: "قائمة الحجوزات" },
    },
    {
      href: `/conversations?account_name=${formatTitle(
        user?.name
      )}&acouunt_type=${user?.account_type}&userId=${user.id}`,
      icon: <BiSolidConversation className="w-5 h-5" />,
      label: { en: "Conversations", ar: "قائمة المحادثات" },
    },
    {
      href: `/usercontrolpanel/accountwallet?user_name=${formatTitle(
        user?.name
      )}&userId=${user?.id}&account_type=${user?.account_type}`,
      icon: <FaWallet className="size-5" />,
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
    {
      href: `/usercontrolpanel/familymembers?account_type=${
        user?.account_type
      }&userId=${user.id}&account_name=${formatTitle(
        user?.name ?? user?.title
      )}`,
      icon: <MdFamilyRestroom className="size-5" />,
      label: { en: "family members", ar: "أفراد العائلة" },
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
