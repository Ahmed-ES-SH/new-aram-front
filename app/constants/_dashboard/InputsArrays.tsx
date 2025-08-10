import countries from "../_website/countries";
import {
  FaWhatsapp,
  FaFacebook,
  FaTwitter,
  FaYoutube,
  FaInstagram,
  FaSnapchat,
  FaEnvelope,
} from "react-icons/fa";

export const addUserinputs = [
  {
    name: "image",
    type: "file",
    fildType: "user-image",
    label: { ar: "صورة المستخدم", en: "" },
  },
  {
    name: "name",
    type: "text",
    fildType: "short-text",
    label: { ar: "الإسم", en: "" },
    placeholder: "أدخل إسم الحساب الجديد",
  },
  {
    name: "email",
    type: "email",
    fildType: "short-text",
    label: { ar: "البريد الإلكترونى", en: "" },
    placeholder: "أدخل البريد الإلكترونى للحساب الجديد",
  },
  {
    name: "password",
    type: "password",
    fildType: "short-text",
    label: { ar: "كلمة السر", en: "" },
    placeholder: "أدخل  كلمة السر للحساب الجديد",
  },
  {
    name: "birth_date",
    type: "date",
    fildType: "short-text",
    label: { ar: "تاريخ الميلاد", en: "" },
    placeholder: "أدخل  كلمة السر للحساب الجديد",
  },
  {
    name: "country",
    type: "",
    fildType: "select-type",
    label: { ar: " بلد المستخدم", en: "" },
    placeholder: "أدخل  كلمة السر للحساب الجديد",
    selectItems: countries,
  },
  {
    name: "gender",
    type: "",
    fildType: "select-type",
    label: { ar: "جنس المستخدم", en: "" },
    placeholder: "",
    selectItems: [{ name: "male" }, { name: "female" }],
  },
  {
    name: "role",
    type: "",
    fildType: "select-type",
    label: { ar: "نوع الحساب", en: "" },
    placeholder: "",
    selectItems: [{ name: "admin" }, { name: "user" }],
  },
];

export const Categoryinputs = [
  {
    name: "image",
    type: "file",
    fildType: "normal-image",
    label: { ar: "صورة القسم", en: "" },
  },
  {
    name: "title_ar",
    type: "text",
    fildType: "short-text",
    label: { ar: "عنوان القسم بالعربية", en: "" },
    placeholder: "أدخل عنوان القسم بالعربية  ",
  },
  {
    name: "title_en",
    type: "text",
    fildType: "short-text",
    label: { ar: "عنوان القسم بالانجليزية", en: "" },
    placeholder: "أدخل عنوان القسم بالانجليزية  ",
  },
];

export const UpdateUserinputs = [
  {
    name: "image",
    type: "file",
    fildType: "user-image",
    label: { ar: "صورة المستخدم", en: "" },
  },
  {
    name: "name",
    type: "text",
    fildType: "short-text",
    label: { ar: "الإسم", en: "" },
    placeholder: "أدخل إسم الحساب الجديد",
  },
  {
    name: "email",
    type: "email",
    fildType: "short-text",
    label: { ar: "البريد الإلكترونى", en: "" },
    placeholder: "أدخل البريد الإلكترونى للحساب الجديد",
  },

  {
    name: "birth_date",
    type: "date",
    fildType: "short-text",
    label: { ar: "تاريخ الميلاد", en: "" },
    placeholder: "أدخل  كلمة السر للحساب الجديد",
  },
  {
    name: "country",
    type: "",
    fildType: "select-type",
    label: { ar: " بلد المستخدم", en: "" },
    placeholder: "أدخل  كلمة السر للحساب الجديد",
    selectItems: countries,
  },
  {
    name: "gender",
    type: "",
    fildType: "select-type",
    label: { ar: "الجنس", en: "" },
    placeholder: "",
    selectItems: [{ name: "male" }, { name: "female" }],
  },
  {
    name: "role",
    type: "",
    fildType: "select-type",
    label: { ar: "نوع الحساب", en: "" },
    placeholder: "",
    selectItems: [{ name: "admin" }, { name: "client" }],
  },
];

export const socialContactInfoInputs = [
  {
    name: "whatsapp_number",
    icon: <FaWhatsapp className="text-green-500 text-xl" />,
    placeholder: "WhatsApp Number",
    type: "text",
  },
  {
    name: "gmail_account",
    icon: <FaEnvelope className="text-red-500 text-xl" />,
    placeholder: "Gmail Account",
    type: "email",
  },
  {
    name: "facebook_account",
    icon: <FaFacebook className="text-blue-700 text-xl" />,
    placeholder: "Facebook Account URL",
    type: "text",
  },
  {
    name: "x_account",
    icon: <FaTwitter className="text-blue-400 text-xl" />,
    placeholder: "X (Twitter) Account URL",
    type: "text",
  },
  {
    name: "youtube_account",
    icon: <FaYoutube className="text-red-600 text-xl" />,
    placeholder: "YouTube Account URL",
    type: "text",
  },
  {
    name: "instgram_account",
    icon: <FaInstagram className="text-pink-500 text-xl" />,
    placeholder: "Instagram Account URL",
    type: "text",
  },
  {
    name: "snapchat_account",
    icon: <FaSnapchat className="text-yellow-500 text-xl" />,
    placeholder: "Snapchat Account URL",
    type: "text",
  },
];

export const addCategoryinputs = [
  {
    name: "image",
    type: "file",
    fildType: "normal-image",
    label: { ar: "صورة القسم", en: "" },
  },
  {
    name: "icon_name",
    type: "non-input",
    fildType: "icon-fild",
    label: { ar: "حدد  أيقونة القسم", en: "" },
  },
  {
    name: "title_en",
    type: "text",
    fildType: "short-text",
    label: { ar: "العنوان (EN)", en: "" },
    placeholder: "أدخل عنوان القسم الجديد بالانجلزية",
  },
  {
    name: "title_ar",
    type: "text",
    fildType: "short-text",
    label: { ar: "العنوان (AR)", en: "" },
    placeholder: "أدخل عنوان القسم الجديد بالعربية",
  },

  {
    name: "bg_color",
    type: "color",
    fildType: "color-fild",
    label: { ar: "حدد لون خلفية القسم", en: "" },
    placeholder: "",
  },
];
