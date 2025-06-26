import { FaBloggerB, FaQuestion } from "react-icons/fa";
import { FaLinesLeaning, FaUserGear, FaUsersViewfinder } from "react-icons/fa6";
import { GrArticle, GrDomain, GrServices } from "react-icons/gr";
import { IoMdPersonAdd } from "react-icons/io";
import { IoAdd, IoLayersOutline, IoShareSocialSharp } from "react-icons/io5";
import {
  MdNotificationsActive,
  MdOutlineAddToPhotos,
  MdOutlineDashboard,
  MdOutlinePrivacyTip,
  MdOutlineSyncProblem,
} from "react-icons/md";
import { PiUsersThreeFill } from "react-icons/pi";
import { RiGitRepositoryPrivateLine, RiNewsLine } from "react-icons/ri";
import { SiHeroku } from "react-icons/si";
import { TbListDetails } from "react-icons/tb";

const iconStyle = "text-white  size-6";

export const pages = [
  {
    title: "الرئيسية",
    icon: <GrDomain className={iconStyle} />,
    to: "#",
    minilinks: [
      {
        title: "تحديد قسم الواجهة",
        icon: <SiHeroku className={iconStyle} />,
        to: "/dashboard/activesection",
      },
      {
        title: "قسم الفيديو",
        icon: <SiHeroku className={iconStyle} />,
        to: "/dashboard/videodash",
      },
      {
        title: "الجزء التعريفى",
        icon: <SiHeroku className={iconStyle} />,
        to: "/dashboard/aboutsection",
      },
      {
        title: "البطاقات المختارة",
        icon: <SiHeroku className={iconStyle} />,
        to: "/dashboard/selectedcards",
      },
      {
        title: "المقالات المختارة",
        icon: <SiHeroku className={iconStyle} />,
        to: "/dashboard/selectedarticals",
      },
      {
        title: "المنظمات المختارة",
        icon: <SiHeroku className={iconStyle} />,
        to: "/dashboard/selectedorganizations",
      },
    ],
  },
  {
    title: "المستخدمون",
    icon: <PiUsersThreeFill className={iconStyle} />,
    to: "#",
    minilinks: [
      {
        title: "جميع المستخدمون",
        icon: <PiUsersThreeFill className={iconStyle} />,
        to: "/dashboard/users",
      },
      {
        title: "أضف مستخدم جديد",
        icon: <IoMdPersonAdd className={iconStyle} />,
        to: "/dashboard/adduser",
      },
    ],
  },
  {
    title: "الإشعارات",
    icon: <MdNotificationsActive className={iconStyle} />,
    to: "#",
    minilinks: [
      {
        title: "مستخدم",
        icon: <FaUserGear className={iconStyle} />,
        to: "/dashboard/usernotification",
      },
      {
        title: "مقدم خدمات",
        icon: <GrServices className={iconStyle} />,
        to: "/dashboard/serviceprovidernotification",
      },
    ],
  },
  {
    title: "المدونة",
    icon: <FaBloggerB className={iconStyle} />,
    to: "#",
    minilinks: [
      {
        title: "المقالات",
        icon: <GrArticle className={iconStyle} />,
        to: "/dashboard/articles",
      },
      {
        title: "أقسام المقالات",
        icon: <IoLayersOutline className={iconStyle} />,
        to: "/dashboard/articlecategories",
      },
      {
        title: "أضف قسم جديد ",
        icon: <IoAdd className={iconStyle} />,
        to: "/dashboard/addarticlecategory",
      },
      {
        title: "أضف مقال جديدة",
        icon: <MdOutlineAddToPhotos className={iconStyle} />,
        to: "/dashboard/addarticle",
      },
    ],
  },
  {
    title: "صفحات الأحكام والخصوصية",
    icon: <RiGitRepositoryPrivateLine className={iconStyle} />,
    to: "#",
    minilinks: [
      {
        title: "سياسية الخصوصية",
        icon: <FaUsersViewfinder className={iconStyle} />,
        to: "/dashboard/privacypolicy",
      },
      {
        title: "الشروط والأحكام",
        icon: <MdOutlinePrivacyTip className={iconStyle} />,
        to: "/dashboard/termsconditions",
      },
    ],
  },
  {
    title: "التقارير",
    icon: <MdOutlineDashboard className={iconStyle} />,
    to: "/dashboard",
  },
  {
    title: "حسابات التواصل الإجتماعى",
    icon: <IoShareSocialSharp className={iconStyle} />,
    to: "/dashboard/socialcontactinfo",
  },
  {
    title: "تفاصيل الشركة",
    icon: <TbListDetails className={iconStyle} />,
    to: "/dashboard/companydetailes",
  },
  {
    title: "قسم الشكاوى",
    icon: <MdOutlineSyncProblem className={iconStyle} />,
    to: "/dashboard/problems",
  },
  {
    title: "قسم الأسئلة الشائعه",
    icon: <FaQuestion className={iconStyle} />,
    to: "/dashboard/FAQ",
  },
  {
    title: "قسم النشرة البريدية",
    icon: <RiNewsLine className={iconStyle} />,
    to: "/dashboard/newsletter",
  },
  {
    title: "روابط نهاية الموقع",
    icon: <FaLinesLeaning className={iconStyle} />,
    to: "/dashboard/footerlinks",
  },
];
