"use client";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { FaArrowLeft, FaCheckCircle } from "react-icons/fa";
import { CiText } from "react-icons/ci";
import { LuFileText } from "react-icons/lu";
import { RegistrationFormData, RegistrationStep } from "../types";
import MainCategorySelector from "./offerStep/MainCategorySelector";
import LocaleLink from "@/app/_components/_website/_global/LocaleLink";
import { MdDiscount, MdErrorOutline } from "react-icons/md";
import { AiFillDollarCircle } from "react-icons/ai";
import { BsCalendar2DateFill } from "react-icons/bs";
import { category } from "@/app/types/_dashboard/GlobalTypes";
import OfferInputComponent from "./offerStep/OfferInputComponent";
import { ImageUploader } from "../ImageUploader";
import { getOfferSchema } from "../validation/offerSchema";
import { instance } from "@/app/_helpers/axios";
import { toast } from "sonner";
import { VscLoading } from "react-icons/vsc";
import { appendFormData } from "../helpers";
import { useRouter, useSearchParams } from "next/navigation";

interface Props {
  offer: RegistrationFormData["offer"];
  orgForm: RegistrationFormData;
  setCurrentStep: Dispatch<SetStateAction<RegistrationStep>>;
  setOrgForm: Dispatch<SetStateAction<RegistrationFormData>>;
  onUpdate: (data: Partial<RegistrationFormData["offer"]>) => void;
  onPrevious: () => void;
  categories: category[];
}

export default function OfferStep({
  offer,
  setOrgForm,
  setCurrentStep,
  orgForm,
  onUpdate,
  onPrevious,
  categories,
}: Props) {
  const t = useTranslations("registration");
  const t_2 = useTranslations("registerUserPage");
  const t_3 = useTranslations("orgValidation");
  const locale = useLocale() as "en" | "ar";

  const router = useRouter();
  const searchParams = useSearchParams();
  const ref_code = searchParams.get("ref");

  const schema = getOfferSchema(t_3);

  const [errors, setErrors] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [cooperationPdf, setCooperationPdf] = useState<null | string>(null);

  const handleSubmit = async (e: React.FormEvent) => {
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
      setLoading(true);
      const formData = new FormData();
      appendFormData(formData, orgForm);
      formData.append("category_id", categories[0].id.toString());
      if (ref_code) formData.append("ref_code", ref_code);

      const response = await instance.post(`/register-org`, formData);
      if (response.status === 201) {
        toast.success(t("success"));
        setOrgForm({
          email: "",
          password: "",
          title: "",
          description: "",
          open_at: "",
          close_at: "",
          confirmation_price: 0,
          confirmation_status: false,
          booking_status: false,
          image: null,
          logo: null,
          categories: [],
          subcategories: [],
          offer: {
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
          },
        });
        setCurrentStep(1);
        setTimeout(() => {
          router.push(`/${locale}/login`);
        }, 300);
      }
    } catch (error: any) {
      console.log(error);
      const message = error?.response?.data?.message ?? t("error");
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

  useEffect(() => {
    const fetchFile = async () => {
      try {
        const response = await instance.get(`/get-cooperation-file`);
        if (response.status == 200) {
          setCooperationPdf(response.data.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchFile();
  }, []);

  return (
    <div className="bg-card rounded-lg border border-border p-8 shadow-sm">
      <h2 className="text-2xl font-semibold text-foreground mb-2">
        {t("steps.offer")}
      </h2>
      <p className="text-muted-foreground mb-8">{t("offerStepTitle")}</p>

      {/* Image Uploader */}
      <ImageUploader
        label={t("fields.offer.image.label")}
        hint={t("fields.offer.image.hint")}
        value={offer.image}
        onChange={(file) => onUpdate({ image: file })}
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <OfferInputComponent
          id="title"
          name="title"
          value={offer.title}
          label={t("fields.offer.title.label")}
          placeholder={t("fields.offer.title.placeholder")}
          icon={CiText}
          onChange={(e) => onUpdate({ [e.target.name]: e.target.value })}
          error={errors && errors["title"] && errors["title"]}
        />

        <OfferInputComponent
          id="description"
          name="description"
          value={offer.description}
          label={t("fields.offer.description.label")}
          placeholder={t("fields.offer.description.placeholder")}
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
          label={t("fields.offer.discount_type.label")}
          placeholder={t("fields.offer.discount_type.placeholder")}
          onChange={(e) => onUpdate({ [e.target.name]: e.target.value })}
          icon={MdDiscount}
          options={[
            {
              value: "percentage",
              label: t("fields.offer.discount_type.options.percentage"),
            },
            {
              value: "fixed",
              label: t("fields.offer.discount_type.options.fixed"),
            },
          ]}
          error={errors && errors["discount_type"] && errors["discount_type"]}
        />

        <OfferInputComponent
          id="discount_value"
          name="discount_value"
          value={offer.discount_value}
          label={t("fields.offer.discount_value.label")}
          placeholder={t("fields.offer.discount_value.placeholder")}
          onChange={(e) => onUpdate({ [e.target.name]: e.target.value })}
          icon={AiFillDollarCircle}
          error={errors && errors["discount_value"] && errors["discount_value"]}
        />

        <OfferInputComponent
          id="start_date"
          name="start_date"
          type="date"
          value={offer.start_date}
          label={t("fields.offer.start_date.label")}
          placeholder={t("fields.offer.start_date.placeholder")}
          onChange={(e) => onUpdate({ [e.target.name]: e.target.value })}
          icon={BsCalendar2DateFill}
          error={errors && errors["start_date"] && errors["start_date"]}
        />

        <OfferInputComponent
          id="end_date"
          name="end_date"
          type="date"
          value={offer.end_date}
          label={t("fields.offer.end_date.label")}
          placeholder={t("fields.offer.end_date.placeholder")}
          onChange={(e) => onUpdate({ [e.target.name]: e.target.value })}
          icon={BsCalendar2DateFill}
          error={errors && errors["end_date"] && errors["end_date"]}
        />

        <MainCategorySelector
          categories={categories}
          selectedCategory={offer.category_id}
          onChange={(id: any) => onUpdate({ category_id: id })}
          locale={locale}
          error={errors && errors["category_id"] && errors["category_id"]}
        />

        {/* Code Generator */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground">
            {t("fields.offer.code.label")}
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              id="code"
              name="code"
              onChange={(e) => onUpdate({ [e.target.name]: e.target.value })}
              value={offer.code}
              placeholder={t("fields.offer.code.placeholder")}
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

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-4">
          <motion.button
            type="button"
            onClick={onPrevious}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-6 py-3 rounded-lg
              bg-secondary text-secondary-foreground font-medium
              hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <FaArrowLeft className="h-4 w-4 rtl:rotate-180" />
            {t("buttons.previous")}
          </motion.button>
        </div>

        <div className="w-full mt-4 pt-3 border-t border-gray-300">
          <motion.div
            className="col-span-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-sm text-gray-500 flex flex-wrap items-center gap-1">
              {t_2("terms_text")}
              <LocaleLink
                href="/termsconditionsorganizations"
                className="text-gray-700 whitespace-nowrap underline hover:text-blue-600"
              >
                {t_2("terms_link")}
              </LocaleLink>{" "}
              {t_2("and")}
              <LocaleLink
                href="/privacypolicyorganizations"
                className="text-gray-700 whitespace-nowrap underline hover:text-blue-600"
              >
                {t_2("privacy_link")}
              </LocaleLink>
              <a
                download
                href={cooperationPdf ?? "/defaults/اختبار-اتفاقية-التعاون.pdf"}
                className="text-gray-700 whitespace-nowrap underline hover:text-blue-600"
              >
                {t_2("cooperation_agreement")}
              </a>
              .
            </div>
          </motion.div>

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center justify-center mt-6 gap-2 px-6 py-3 rounded-lg
              w-fit mr-auto bg-primary text-primary-foreground font-medium
              hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-ring disabled:bg-orange-200"
          >
            {loading ? (
              <VscLoading className="text-white animate-spin size-6" />
            ) : (
              <div className="flex items-center gap-1">
                <FaCheckCircle className="h-4 w-4" />
                {t("buttons.submit")}
              </div>
            )}
          </motion.button>
        </div>
      </form>
    </div>
  );
}
