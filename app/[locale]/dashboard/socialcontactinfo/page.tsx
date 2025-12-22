"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { instance } from "@/app/_helpers/axios";
import LoadingSpin from "@/app/_components/LoadingSpin";
import SuccessAlart from "@/app/_components/_popups/SuccessAlart";
import { socialContactInfoInputs } from "@/app/constants/_dashboard/InputsArrays";
import useFetchData from "@/app/_helpers/FetchDataWithAxios";
import { VscLoading } from "react-icons/vsc";
import { toast } from "sonner";

interface dataType {
  id: number;
  facebook_account: string | null;
  instgram_account: string | null;
  snapchat_account: string | null;
  tiktok_account: string | null;
  x_account: string | null; // Twitter (X)
  youtube_account: string | null;
  gmail_account: string | null;
  whatsapp_number: string | null;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
}

export default function EditSocialContactInfo() {
  const { loading, data } = useFetchData<dataType>(
    "/social-contact-info",
    false
  );

  const [accounts, setAccounts] = useState({});
  const [updateloading, setUpdateloading] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAccounts({ ...data, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ تحقق إذا تم تعديل القيم فعلاً
    const hasChanged = Object.keys(accounts).some(
      (key) => (accounts as any)[key] !== (data as any)[key]
    );

    if (!hasChanged) {
      toast.error("يجب تعديل حقل واحد على الأقل قبل الحفظ.");
      return;
    }

    setUpdateloading(true);
    try {
      const response = await instance.post(
        "/update-social-contact-info",
        accounts
      );
      if (response.status === 200) {
        setShowSuccessPopup(true);
      }
    } catch (error: any) {
      console.log(error);
      if (error?.response?.data?.message) {
        toast.error(error?.response?.data?.message);
      }
      const errors = error?.response?.data?.errors;

      // ✅ أول مفتاح
      const firstKey = Object.keys(errors)[0];

      // ✅ أول قيمة (هتكون Array غالبًا)
      const firstValue = errors[firstKey];

      // ✅ أول رسالة عربية
      const firstMessageAr = firstValue[0]["ar"];

      toast.error(firstMessageAr);
    } finally {
      setUpdateloading(false);
    }
  };

  useEffect(() => {
    if (data) {
      setAccounts(data);
    }
  }, [data]);

  if (loading) return <LoadingSpin />;

  return (
    <div
      style={{ direction: "ltr" }}
      className="w-full h-[90vh]  my-3 flex items-center justify-center"
    >
      <div className="max-md:w-[97%] min-w-[60%] h-fit mx-auto p-6 bg-white shadow-2xl border border-gray-300 rounded-lg">
        <motion.div
          style={{ direction: "rtl" }}
          className="text-center mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold">تعديل روابط التواصل الإجتماعى</h2>
          <p className="text-gray-600">
            قم بتحديث حسابات الوسائط الاجتماعية المرتبطة بموقعك.
          </p>
        </motion.div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {socialContactInfoInputs.map((input, index) => (
            <div key={index} className="flex items-center gap-3">
              {input.icon}
              <input
                type={input.type}
                name={input.name}
                value={accounts[input.name as keyof typeof data] || ""}
                onChange={handleInputChange}
                placeholder={input.placeholder}
                className="input-style"
              />
            </div>
          ))}

          <div className="text-center mt-6">
            <motion.button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white font-bold w-fit mx-auto flex items-center justify-center rounded-lg hover:bg-blue-700 transition duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {updateloading ? (
                <VscLoading className="animate-spin" />
              ) : (
                "حفظ التغييرات"
              )}
            </motion.button>
          </div>
        </form>
      </div>
      <SuccessAlart
        showAlart={showSuccessPopup}
        Message={"تم تعديل روابط التواصل بنجاح"}
        onClose={() => setShowSuccessPopup(false)}
      />
    </div>
  );
}
