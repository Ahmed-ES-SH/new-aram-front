"use client";
import { AnimatePresence, motion } from "framer-motion";
import { Dispatch, SetStateAction, useState } from "react";
import SettingsSection from "./SettingsSection";
import HeroSectionEditor from "./HeroSectionEditor";
import ProblemSectionEditor from "./ProblemSectionEditor";
import SolutionSectionEditor from "./SolutionSectionEditor";
import TestimonialsSectionEditor from "./TestimonialsSectionEditor";
import StatsSectionEditor from "./StatsSectionEditor";
import CTASectionEditor from "./CTASectionEditor";
import FormSchemaEditor from "./FormSchemaEditor";
import { activeSectionType, ServicePageData } from "./types";
import GallerySectionEditor from "./GallerySectionEditor";
import ContactMessagesSectionEditor from "./ContactMessagesSectionEditor";
import { useAppSelector } from "@/app/Store/hooks";
import { DEFAULT_FORM_SCHEMA, FormSchema } from "../../_dynamicForm";
import useFetchData from "@/app/_helpers/FetchDataWithAxios";

interface ServicePageEditoBodyProps {
  activeSection: activeSectionType;
  serviceData: ServicePageData;
  serServiceData: Dispatch<SetStateAction<ServicePageData>>;
  setHasChanges: Dispatch<SetStateAction<boolean>>;
  mode: "edit" | "create";
  formSchema: ServicePageData["form"];
  onFormSchemaChange: (schema: ServicePageData["form"]) => void;
}

export default function ServicePageEditoBody({
  activeSection,
  serviceData,
  serServiceData,
  setHasChanges,
  mode,
  formSchema,
  onFormSchemaChange,
}: ServicePageEditoBodyProps) {
  const { data: categories } = useFetchData("/service-categories", false);

  const updateFormSchema = (schema: ServicePageData["form"]) => {
    onFormSchemaChange(schema);
    setHasChanges(true);
  };

  const handleUpdateData = (data, field) => {
    serServiceData((prev) => ({ ...prev, [field]: data }));
    setHasChanges(true);
  };

  const handleUpdateSettings = (data, field) => {
    serServiceData((prev) => ({ ...prev, [field]: data }));
    setHasChanges(true);
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeSection}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
      >
        {activeSection === "settings" && (
          <SettingsSection
            serviceData={serviceData}
            categories={categories as any}
            onChange={handleUpdateSettings}
            mode={mode}
          />
        )}
        {activeSection === "hero_section" && (
          <HeroSectionEditor
            data={serviceData.hero_section}
            onChange={handleUpdateData}
          />
        )}
        {activeSection === "gallery_images" && (
          <GallerySectionEditor
            servicePage={serviceData}
            data={serviceData.gallery_images}
            onChange={handleUpdateData}
          />
        )}
        {activeSection === "problem_section" && (
          <ProblemSectionEditor
            data={serviceData.problem_section}
            onChange={handleUpdateData}
          />
        )}
        {activeSection === "solution_section" && (
          <SolutionSectionEditor
            data={serviceData.solution_section}
            onChange={handleUpdateData}
          />
        )}
        {activeSection === "stats" && (
          <StatsSectionEditor
            data={serviceData.stats}
            onChange={handleUpdateData}
          />
        )}
        {activeSection === "testimonials" && (
          <TestimonialsSectionEditor
            data={serviceData.testimonials}
            onChange={handleUpdateData}
          />
        )}
        {activeSection === "cta" && (
          <CTASectionEditor
            data={serviceData.cta_section}
            onChange={handleUpdateData}
          />
        )}
        {activeSection === "form" && (
          <FormSchemaEditor schema={formSchema} onChange={updateFormSchema} />
        )}
        {activeSection === "contact_messages" && (
          <ContactMessagesSectionEditor
            data={serviceData.contact_messages}
            onChange={handleUpdateData}
          />
        )}
      </motion.div>
    </AnimatePresence>
  );
}
