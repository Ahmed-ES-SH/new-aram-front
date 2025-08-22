import { BiCategoryAlt } from "react-icons/bi";
import { FaBloggerB, FaQuestion } from "react-icons/fa";
import { LiaUserMdSolid } from "react-icons/lia";
import {
  FaLinesLeaning,
  FaUserGear,
  FaUsersGear,
  FaUsersViewfinder,
} from "react-icons/fa6";
import { GiMeepleGroup } from "react-icons/gi";
import {
  GrArticle,
  GrDomain,
  GrOrganization,
  GrServices,
} from "react-icons/gr";
import { IoMdAddCircle, IoMdPersonAdd } from "react-icons/io";
import {
  IoAdd,
  IoAddSharp,
  IoLayers,
  IoLayersOutline,
  IoShareSocialSharp,
  IoStatsChartSharp,
} from "react-icons/io5";
import { ImMakeGroup, ImStatsDots } from "react-icons/im";
import {
  MdCategory,
  MdCurrencyExchange,
  MdNotificationsActive,
  MdOutlineAddToPhotos,
  MdOutlineDashboard,
  MdOutlineDesignServices,
  MdOutlineSyncProblem,
} from "react-icons/md";
import { PiCards, PiCardsThreeLight, PiUsersThreeFill } from "react-icons/pi";
import { RiGitRepositoryPrivateLine, RiNewsLine } from "react-icons/ri";
import { SiHeroku } from "react-icons/si";
import { TbListDetails } from "react-icons/tb";
import { CiCreditCard1 } from "react-icons/ci";

const iconStyle = "text-white  size-6";

export const pages = [
  {
    title: "الرئيسية",
    icon: <GrDomain className={iconStyle} />,
    to: "",
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
    to: "",
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
      {
        title: "جميع المروجون",
        icon: <LiaUserMdSolid className={iconStyle} />,
        to: "/dashboard/users",
      },
      {
        title: "تقارير المروجون",
        icon: <ImStatsDots className={iconStyle} />,
        to: "/dashboard/users",
      },
    ],
  },
  {
    title: "الأقسام",
    icon: <IoLayers className={iconStyle} />,
    to: "",
    minilinks: [
      {
        title: "جميع الأقسام الرئيسية",
        icon: <BiCategoryAlt className={iconStyle} />,
        to: "/dashboard/categories",
      },
      {
        title: "أضف قسم رئيسى جديد",
        icon: <IoAddSharp className={iconStyle} />,
        to: "/dashboard/addcategory",
      },
      {
        title: "جميع الأقسام الفرعية",
        icon: <MdCategory className={iconStyle} />,
        to: "/dashboard/subcategories",
      },
      {
        title: "أضف قسم فرعى جديد",
        icon: <IoMdAddCircle className={iconStyle} />,
        to: "/dashboard/addsubcategory",
      },
    ],
  },
  {
    title: "المراكز",
    icon: <PiCards className={iconStyle} />,
    to: "",
    minilinks: [
      {
        title: "جميع المراكز",
        icon: <PiCardsThreeLight className={iconStyle} />,
        to: "/dashboard/organizations",
      },
      {
        title: "أضف مركز جديد",
        icon: <IoAddSharp className={iconStyle} />,
        to: "/dashboard/addorganization",
      },
      {
        title: "تقارير المراكز",
        icon: <IoStatsChartSharp className={iconStyle} />,
        to: "/dashboard/organizationsummary",
      },
    ],
  },
  {
    title: "الخدمات",
    icon: <MdOutlineDesignServices className={iconStyle} />,
    to: "",
    minilinks: [
      {
        title: "جميع الخدمات",
        icon: <GrServices className={iconStyle} />,
        to: "/dashboard/services",
      },
      {
        title: "أضف خدمة جديدة",
        icon: <IoAddSharp className={iconStyle} />,
        to: "/dashboard/addservice",
      },
    ],
  },
  {
    title: "البطاقات",
    icon: <PiCards className={iconStyle} />,
    to: "",
    minilinks: [
      {
        title: "أقسام البطاقات",
        icon: <PiCardsThreeLight className={iconStyle} />,
        to: "/dashboard/cardcategories",
      },
      {
        title: "أضف قسم جديد",
        icon: <IoAddSharp className={iconStyle} />,
        to: "/dashboard/addcardcategory",
      },
      {
        title: "جميع البطاقات",
        icon: <CiCreditCard1 className={iconStyle} />,
        to: "/dashboard/cards",
      },
      {
        title: "أضف  بطاقة جديدة",
        icon: <IoMdAddCircle className={iconStyle} />,
        to: "/dashboard/addcard",
      },
    ],
  },

  {
    title: "الإشعارات",
    icon: <MdNotificationsActive className={iconStyle} />,
    to: "",
    minilinks: [
      {
        title: "مستخدم",
        icon: <FaUserGear className={iconStyle} />,
        to: "/dashboard/usernotification",
      },
      {
        title: "مركز",
        icon: <GrOrganization className={iconStyle} />,
        to: "/dashboard/organizationnotification",
      },
    ],
  },
  {
    title: "المدونة",
    icon: <FaBloggerB className={iconStyle} />,
    to: "",
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
    to: "",
    minilinks: [
      {
        title: "سياسية الخصوصية (مستخدم)",
        icon: <FaUsersViewfinder className={iconStyle} />,
        to: "/dashboard/privacypolicy",
      },
      {
        title: "الشروط والأحكام (مستخدم)",
        icon: <FaUsersGear className={iconStyle} />,
        to: "/dashboard/termsconditions",
      },
      {
        title: "سياسية الخصوصية (مركز)",
        icon: <GiMeepleGroup className={iconStyle} />,
        to: "/dashboard/orgprivacypolicy",
      },
      {
        title: "الشروط والأحكام (مركز)",
        icon: <ImMakeGroup className={iconStyle} />,
        to: "/dashboard/orgtermsconditions",
      },
    ],
  },
  {
    title: "لوحة التحكم",
    icon: <MdOutlineDashboard className={iconStyle} />,
    to: "/dashboard",
  },
  {
    title: "حسابات التواصل الإجتماعى",
    icon: <IoShareSocialSharp className={iconStyle} />,
    to: "/dashboard/socialcontactinfo",
  },
  {
    title: "عملات المنصة",
    icon: <MdCurrencyExchange className={iconStyle} />,
    to: "/dashboard/currencymanager",
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
