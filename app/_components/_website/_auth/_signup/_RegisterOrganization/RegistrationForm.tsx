"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { StepProgressBar } from "./StepProgressBar";
import { AccountStep } from "./steps/AccountStep";
import { InfoStep } from "./steps/InfoStep";
import { SchedulingStep } from "./steps/SchedulingStep";
import { MediaStep } from "./steps/MediaStep";
import { RegistrationFormData, RegistrationStep } from "./types";
import { directionMap } from "@/app/constants/_website/global";
import { useLocale } from "next-intl";
import RegistrationHeader from "./RegistrationHeader";
import { Location } from "@/app/_components/_dashboard/_dynamicComponents/DynamicElementPage";
import { category } from "@/app/types/_dashboard/GlobalTypes";
import OfferStep from "./steps/OfferStep";

const TOTAL_STEPS = 5;

interface props {
  categories: category[];
}

export function RegistrationForm({ categories }: props) {
  const locale = useLocale();

  const [currentStep, setCurrentStep] = useState<RegistrationStep>(1);
  const [formData, setFormData] = useState<RegistrationFormData>({
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
  const [location, setLocation] = useState<Location | null>(null);

  const updateFormData = (data: Partial<RegistrationFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const updateOfferData = (data: Partial<RegistrationFormData["offer"]>) => {
    setFormData((prev) => ({
      ...prev,
      offer: {
        ...prev.offer, // keep existing offer fields
        ...data, // update only the provided fields
      },
    }));
  };

  const nextStep = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep((prev) => (prev + 1) as RegistrationStep);
    }
  };

  const previousStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as RegistrationStep);
    }
  };

  return (
    <div
      dir={directionMap[locale]}
      className="min-h-screen mt-20 bg-background"
    >
      <div className="lg:w-[90%] mx-auto w-[98%] px-4 py-8">
        <RegistrationHeader />
        <div className="flex items-start w-full max-lg:flex-col gap-6 mt-8">
          <StepProgressBar currentStep={currentStep} totalSteps={TOTAL_STEPS} />
          <div className="w-full">
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <AccountStep
                  email={formData.email}
                  password={formData.password}
                  location={location}
                  setLocation={setLocation}
                  onUpdate={updateFormData}
                  onNext={nextStep}
                />
              )}
              {currentStep === 2 && (
                <InfoStep
                  title={formData.title}
                  description={formData.description}
                  onUpdate={updateFormData}
                  onNext={nextStep}
                  onPrevious={previousStep}
                />
              )}
              {currentStep === 3 && (
                <SchedulingStep
                  open_at={formData.open_at}
                  close_at={formData.close_at}
                  confirmation_price={formData.confirmation_price}
                  confirmation_status={formData.confirmation_status}
                  booking_status={formData.booking_status}
                  onUpdate={updateFormData}
                  onNext={nextStep}
                  onPrevious={previousStep}
                />
              )}
              {currentStep === 4 && (
                <MediaStep
                  image={formData.image}
                  logo={formData.logo}
                  categoriesData={categories}
                  categories={formData.categories}
                  subcategories={formData.subcategories}
                  onUpdate={updateFormData as any}
                  onPrevious={previousStep}
                  onNext={nextStep}
                />
              )}
              {currentStep === 5 && (
                <OfferStep
                  setCurrentStep={setCurrentStep}
                  setOrgForm={setFormData}
                  orgForm={formData}
                  categories={categories}
                  offer={formData.offer}
                  onUpdate={updateOfferData}
                  onPrevious={previousStep}
                />
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
