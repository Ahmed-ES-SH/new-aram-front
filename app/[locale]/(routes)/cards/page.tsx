import CardsComponent from "@/app/_components/_website/_cards/CardsComponent";
import FAQSection, {
  faqType,
} from "@/app/_components/_website/_cards/FAQSection";
import {
  Testimonial,
  TestimonialsSection,
} from "@/app/_components/_website/_cards/testimonials/TestimonialsSection";
import FetchData from "@/app/_helpers/FetchData";
import { getSharedMetadata } from "@/app/_helpers/helpers";
import { getTranslations } from "next-intl/server";
import React from "react";

// Sample testimonials data
const sampleTestimonials: Testimonial[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    role: "Product Manager",
    company: "TechCorp",
    feedback:
      "This solution has completely transformed how we approach our daily workflows. The intuitive design and powerful features have made our team significantly more productive.",
    avatar: "/defaults/male-noimage.jpg",
  },
  {
    id: "2",
    name: "Michael Chen",
    role: "Senior Developer",
    company: "StartupXYZ",
    feedback:
      "I've tried many similar tools, but this one stands out for its reliability and ease of use. The customer support is also exceptional - they truly care about their users.",
    avatar: "/defaults/male-noimage.jpg",
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    role: "Marketing Director",
    company: "GrowthCo",
    feedback:
      "The analytics and insights provided have been game-changing for our marketing campaigns. We've seen a 40% increase in conversion rates since implementing this solution.",
    avatar: "/defaults/male-noimage.jpg",
  },
  {
    id: "4",
    name: "David Thompson",
    role: "CEO",
    company: "InnovateLab",
    feedback:
      "As a CEO, I need tools that deliver results. This platform has exceeded our expectations and has become an integral part of our business operations.",
    avatar: "/defaults/male-noimage.jpg",
  },
  {
    id: "5",
    name: "Lisa Wang",
    role: "UX Designer",
    company: "DesignStudio",
    feedback:
      "The user experience is phenomenal. It's clear that a lot of thought went into making this tool both powerful and user-friendly. Our entire team loves using it.",
    avatar: "/defaults/male-noimage.jpg",
  },
  {
    id: "6",
    name: "James Miller",
    role: "Operations Manager",
    company: "LogisticsPro",
    feedback:
      "This has streamlined our operations beyond what we thought possible. The automation features have saved us countless hours and reduced errors significantly.",
    avatar: "/defaults/male-noimage.jpg",
  },
];

export async function generateMetadata() {
  const t = await getTranslations("metaCardsPage");
  const sharedMetadata = await getSharedMetadata(t("title"), t("description"));
  return {
    title: t("title"),
    describtion: t("description"),
    ...sharedMetadata,
  };
}

export default async function CardsPage({ searchParams }: any) {
  const category_id = await searchParams.category_id;

  const cardsApi = category_id
    ? `/public-cards?category_id=${category_id}`
    : `/public-cards`;
  const response = await FetchData(cardsApi, true);
  const categories = await FetchData("/all-card-public-categories", false);
  const faqs = await FetchData(`/approvedQuestions?limit=6`, false);

  if (!response) return null;

  return (
    <div className="relative  gap-4 mt-20 w-[98%] lg:w-[95%] mx-auto px-2 py-12">
      <CardsComponent categories={categories} response={response as any} />
      <FAQSection faqs={faqs as faqType[]} />

      <div className="pt-6">
        <TestimonialsSection testimonials={sampleTestimonials} />
      </div>
    </div>
  );
}
