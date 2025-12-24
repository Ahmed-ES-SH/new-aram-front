"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import SelectCoupon from "@/app/_components/_dashboard/_sendCoupon/SelectCoupon";
import SelectReceiverType from "@/app/_components/_dashboard/_sendCoupon/SelectReceiverType";
import ProgressBar from "@/app/_components/_dashboard/_sendCoupon/ProgressBar";
import StepContainer from "@/app/_components/_dashboard/_sendCoupon/StepContainer";
import StepNavigation from "@/app/_components/_dashboard/_sendCoupon/StepNavigation";
import { Coupon } from "@/app/_components/_dashboard/_coupons/types";
import useFetchData from "@/app/_helpers/FetchDataWithAxios";
import UsersSelector from "@/app/_components/_dashboard/_coupons/UsersSelector";
import OrganizationsSelector from "@/app/_components/_dashboard/_services/OrganizationsSelector";
import { toast } from "sonner";
import { instance } from "@/app/_helpers/axios";
import LoadingSpin from "@/app/_components/LoadingSpin";

export default function SendCoupon() {
  const [debouncedQuery, setDebouncedQuery] = useState(""); // delayed value

  const { data, loading } = useFetchData<Coupon[]>(
    `/dashboard/active-coupons?query=${debouncedQuery}`,
    false,
    true
  );

  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState<
    "organization" | "user" | "general" | ""
  >("");
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [coupns, setCoupns] = useState<Coupon[]>([]);
  const [searchQuery, setSearchQuery] = useState(""); // input value
  const [selectedItems, setSelectedItems] = useState<any>({});
  const [sendLoading, setSendLoading] = useState(false);

  const totalSteps = selectedType === "general" ? 4 : 3;
  const stepLabels =
    selectedType === "general"
      ? ["نوع المستلم", "اختيار الكوبون", "اختيار المستخدمين", "اختيار المراكز"]
      : ["نوع المستلم", "اختيار الكوبون", "اختيار المستلمين"];

  const nextStep = () => setStep((prev) => Math.min(prev + 1, totalSteps));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const getStepTitle = (currentStep: number): string => {
    switch (currentStep) {
      case 1:
        return "اختر نوع المستلم";
      case 2:
        return "اختر الكوبون";
      case 3:
        if (selectedType === "general") return "اختر المستخدمين";
        return selectedType === "organization"
          ? "اختر المنظمات"
          : "اختر المستخدمين";
      case 4:
        return "اختر المنظمات"; // Only for general type
      default:
        return "";
    }
  };

  const getStepDescription = (currentStep: number): string => {
    switch (currentStep) {
      case 1:
        return "حدد ما إذا كنت تريد إرسال الكوبون للمستخدمين أو المنظمات";
      case 2:
        return "اختر الكوبون الذي تريد إرساله";
      case 3:
        if (selectedType === "general")
          return "حدد المستخدمين الذين تريد إرسال الكوبون إليهم";
        return "حدد المستلمين الذين تريد إرسال الكوبون إليهم";
      case 4:
        return "حدد المراكز التي تريد إرسال الكوبون إليها"; // Only for general type
      default:
        return "";
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return <SelectReceiverType setSelectedType={setSelectedType} />;
      case 2:
        return (
          <div className="space-y-4">
            {/* Search Input */}
            <input
              type="text"
              placeholder="ابحث عن كوبون..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-2 border border-gray-300 duration-200 rounded-lg focus:outline-none  focus:border-indigo-500"
            />
            <SelectCoupon
              selectedCoupon={selectedCoupon}
              coupons={coupns}
              setSelectedCoupon={setSelectedCoupon}
              loading={loading}
            />
          </div>
        );
      case 3:
        if (selectedType === "organization") {
          return (
            <OrganizationsSelector
              setForm={setSelectedItems}
              form={selectedItems}
            />
          );
        } else {
          // Both 'user' and 'general' (step 3 of 4) use UsersSelector here
          return (
            <UsersSelector setForm={setSelectedItems} form={selectedItems} />
          );
        }
      case 4:
        // Only reachable if selectedType === 'general'
        return (
          <OrganizationsSelector
            setForm={setSelectedItems}
            form={selectedItems}
          />
        );
      default:
        return null;
    }
  };

  const isNextDisabled = () => {
    switch (step) {
      case 1:
        return !selectedType;
      case 2:
        return !selectedCoupon;
      default:
        return false;
    }
  };

  // debounce effect
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);

    return () => clearTimeout(handler); // cleanup
  }, [searchQuery]);

  useEffect(() => {
    if (data) {
      setCoupns(data);
    }
  }, [data]);

  const handleSendCoupon = async () => {
    try {
      if (
        !selectedCoupon ||
        !selectedItems ||
        Object.keys(selectedItems).length === 0
      ) {
        toast.error(
          "لم يتم تحديد الكوبون او العناصر المراد إرسال الكوبون اليها "
        );
        return;
      }

      setSendLoading(true);

      const formData = new FormData();

      if (selectedItems["users"])
        formData.append("users", JSON.stringify(selectedItems["users"]));
      if (selectedItems["organizations"])
        formData.append(
          "organizations",
          JSON.stringify(selectedItems["organizations"])
        );
      if (selectedCoupon)
        formData.append("coupon_id", selectedCoupon.id.toString());

      const response = await instance.post(`/dashboard/send-coupon`, formData);
      if (response.status == 200) {
        setStep(1);
        setSelectedCoupon(null);
        setSelectedItems({});
        toast.success("تم إرسال الكوبون بنجاح الى العناصر المحددة  .");
      }
    } catch (error: any) {
      console.log(error);
      const message =
        error?.response?.data?.message || "حدث خطأ أثناء إرسال الكوبون";
      toast.error(message);
    } finally {
      setSendLoading(false);
    }
  };

  if (sendLoading) return <LoadingSpin />;

  return (
    <motion.div
      className="lg:w-[90%] w-[98%]  mx-auto lg:p-6 p-2"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-2">إرسال كوبون</h1>
        <p className="text-gray-600">
          اتبع الخطوات لإرسال الكوبون للمستلمين المحددين
        </p>
      </motion.div>

      {/* Progress Bar */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <ProgressBar
          currentStep={step}
          totalSteps={totalSteps}
          stepLabels={stepLabels}
        />
      </motion.div>

      {/* Main Content Card */}
      <motion.div
        className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="lg:p-8 p-4">
          <StepContainer
            step={step}
            title={getStepTitle(step)}
            description={getStepDescription(step)}
          >
            {renderStep()}
          </StepContainer>

          <StepNavigation
            currentStep={step}
            totalSteps={totalSteps}
            onNext={nextStep}
            onPrev={prevStep}
            isNextDisabled={isNextDisabled()}
            handleSend={handleSendCoupon}
          />
        </div>
      </motion.div>

      {/* Step Indicator */}
      <motion.div
        className="text-center mt-6 text-sm text-gray-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        الخطوة {step} من {totalSteps}
      </motion.div>
    </motion.div>
  );
}
