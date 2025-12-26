"use client";
import React, { ChangeEvent, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FaCheckCircle } from "react-icons/fa";
import { MdDiscount, MdErrorOutline } from "react-icons/md";
import { AiFillDollarCircle } from "react-icons/ai";
import { BsCalendar2DateFill } from "react-icons/bs";
import AddOfferHeader from "./AddOfferHeader";
import OfferInputComponent from "../../../_auth/_signup/_RegisterOrganization/steps/offerStep/OfferInputComponent";
import { ImageUploader } from "../../../_auth/_signup/_RegisterOrganization/ImageUploader";
import { useLocale, useTranslations } from "next-intl";
import { CiText } from "react-icons/ci";
import { LuFileText } from "react-icons/lu";
import { toast } from "sonner";
import { appendFormData } from "../../../_auth/_signup/_RegisterOrganization/helpers";
import { instance } from "@/app/_helpers/axios";
import MainCategorySelector from "../../../_auth/_signup/_RegisterOrganization/steps/offerStep/MainCategorySelector";
import { VscLoading } from "react-icons/vsc";
import useFetchData from "@/app/_helpers/FetchDataWithAxios";
import { category } from "@/app/types/_dashboard/GlobalTypes";
import { useAppSelector } from "@/app/Store/hooks";
import { useRouter } from "next/navigation";
import SpinLoading from "../../../_global/SpinLoading";
import { getOfferSchema } from "../../../_auth/_signup/_RegisterOrganization/validation/offerSchema";

export default function AddOfferForm() {
  const { user } = useAppSelector((state) => state.user);
  const locale = useLocale() as "en" | "ar";

  const router = useRouter();

  const { data, loading: catsLoading } = useFetchData<category[]>(
    `/categories`,
    false
  );

  const t = useTranslations("offerFildes");
  const t_error = useTranslations("offerValidation");

  const schema = getOfferSchema(t_error);

  const [offer, setOffer] = useState({
    image: null,
    title: "",
    description: "",
    discount_type: "",
    discount_value: "",
    start_date: "",
    end_date: "",
    code: "",
    category_id: "",
    status: "active",
    organization_id: user && user.id,
  });
  const [errors, setErrors] = useState<any>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const parsed = schema.safeParse(offer);
      if (!parsed.success) {
        const formattedErrors: Record<string, string> = {};

        // هنا TypeScript يعرف إن parsed.error هو ZodError
        parsed.error.issues.forEach((err) => {
          if (err.path.length > 0) {
            formattedErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(formattedErrors);
        setLoading(false);
        return;
      }

      setErrors([]);
      setLoading(true);

      const formData = new FormData();
      appendFormData(formData, offer);

      const response = await instance.post(`/add-offer`, formData);
      if (response.status == 201) {
        toast.success("تم اضافة العرض الجديد الى قائمة العروض بنجاح .");
        setOffer({
          image: null,
          title: "",
          description: "",
          discount_type: "",
          discount_value: "",
          start_date: "",
          end_date: "",
          code: "",
          category_id: "",
          status: "active",
          organization_id: user && user.id,
        });
        scrollTo(0, 0);
        setTimeout(() => {
          router.push(
            `/centercontrolpanel/orgoffers?organization_title=${user?.title}&orgId=${user?.id}`
          );
        }, 500);
      }
    } catch (error: any) {
      console.log(error);
      const message =
        error?.response?.data?.message ??
        "حدث خطأ غير متوقع اثناء اضافة العرض الجديد !";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // Generate random code
  const generateCode = () => {
    const randomCode = Math.random()
      .toString(36)
      .substring(2, 10)
      .toUpperCase();
    onUpdate({ code: randomCode });
  };

  const onUpdate = (data) => {
    setOffer((prev) => ({ ...prev, ...data }));
  };

  if (catsLoading)
    return (
      <div className="w-full min-h-[90vh] flex items-center justify-center">
        <SpinLoading />
      </div>
    );

  return (
    <div className="w-full mt-3 p-4 lg:p-6">
      {/* header  */}
      <AddOfferHeader />
      {/* form */}
      <form className="w-full space-y-5 gap-4" onSubmit={handleSubmit}>
        {/* Image Uploader */}
        <ImageUploader
          label={t("image.label")}
          hint={t("image.hint")}
          value={offer.image}
          onChange={(file) => onUpdate({ image: file })}
        />

        <OfferInputComponent
          id="title"
          name="title"
          value={offer.title}
          label={t("title.label")}
          placeholder={t("title.placeholder")}
          icon={CiText}
          onChange={(e) => onUpdate({ [e.target.name]: e.target.value })}
          error={errors && errors["title"] && errors["title"]}
        />

        <OfferInputComponent
          id="description"
          name="description"
          value={offer.description}
          label={t("description.label")}
          placeholder={t("description.placeholder")}
          icon={LuFileText}
          textarea
          onChange={(e) => onUpdate({ [e.target.name]: e.target.value })}
          error={errors && errors["description"] && errors["description"]}
        />

        <OfferInputComponent
          id="discount_type"
          name="discount_type"
          type="select"
          value={offer.discount_type}
          label={t("discount_type.label")}
          placeholder={t("discount_type.placeholder")}
          onChange={(e) => onUpdate({ [e.target.name]: e.target.value })}
          icon={MdDiscount}
          options={[
            {
              value: "percentage",
              label: t("discount_type.options.percentage"),
            },
            {
              value: "fixed",
              label: t("discount_type.options.fixed"),
            },
          ]}
          error={errors && errors["discount_type"] && errors["discount_type"]}
        />

        <OfferInputComponent
          id="discount_value"
          name="discount_value"
          value={offer.discount_value}
          label={t("discount_value.label")}
          placeholder={t("discount_value.placeholder")}
          onChange={(e) => onUpdate({ [e.target.name]: e.target.value })}
          icon={AiFillDollarCircle}
          error={errors && errors["discount_value"] && errors["discount_value"]}
        />

        <OfferInputComponent
          id="start_date"
          name="start_date"
          type="date"
          value={offer.start_date}
          label={t("start_date.label")}
          placeholder={t("start_date.placeholder")}
          onChange={(e) => onUpdate({ [e.target.name]: e.target.value })}
          icon={BsCalendar2DateFill}
          error={errors && errors["start_date"] && errors["start_date"]}
        />

        <OfferInputComponent
          id="end_date"
          name="end_date"
          type="date"
          value={offer.end_date}
          label={t("end_date.label")}
          placeholder={t("end_date.placeholder")}
          onChange={(e) => onUpdate({ [e.target.name]: e.target.value })}
          icon={BsCalendar2DateFill}
          error={errors && errors["end_date"] && errors["end_date"]}
        />

        <MainCategorySelector
          categories={data as category[]}
          selectedCategory={offer.category_id}
          onChange={(id: any) => onUpdate({ category_id: id })}
          locale={locale}
          error={errors && errors["category_id"] && errors["category_id"]}
        />

        {/* Code Generator */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground">
            {t("code.label")}
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              id="code"
              name="code"
              onChange={(e) => onUpdate({ [e.target.name]: e.target.value })}
              value={offer.code}
              placeholder={t("code.placeholder")}
              className={`flex-1 px-4 py-3 rounded-lg border border-input
                bg-background text-foreground focus:outline-none focus:ring-2
                focus:ring-ring focus:border-transparent transition-all duration-200
                placeholder:text-muted-foreground ${
                  errors["code"]
                    ? "border-red-400 focus:outline-red-400"
                    : "border-gray-200 focus:outline-main_orange"
                }`}
            />
            <motion.button
              type="button"
              onClick={generateCode}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-4 py-3 rounded-lg bg-secondary text-secondary-foreground hover:opacity-90"
            >
              {locale === "ar" ? "توليد" : "Generate"}
            </motion.button>
          </div>
          {/* Error Message */}
          <AnimatePresence>
            {errors && errors["code"] && (
              <motion.div
                className="flex items-center gap-1 text-red-500 text-sm mt-2"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <MdErrorOutline className="size-4" />
                <span>{errors["code"]}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {/* submit button */}
        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center justify-center mt-6 gap-2 px-6 py-3 rounded-lg
              w-fit  bg-primary text-primary-foreground font-medium
              hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-ring disabled:bg-orange-200"
        >
          {loading ? (
            <VscLoading className="text-white animate-spin size-6" />
          ) : (
            <div className="flex items-center gap-1">
              <FaCheckCircle className="h-4 w-4" />
              {t("submit")}
            </div>
          )}
        </motion.button>
      </form>
    </div>
  );
}
