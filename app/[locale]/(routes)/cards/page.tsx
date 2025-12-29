import CardsComponent from "@/app/_components/_website/_cards/CardsComponent";
import FAQSection, {
  faqType,
} from "@/app/_components/_website/_cards/FAQSection";
import FetchData from "@/app/_helpers/FetchData";
import { getSharedMetadata } from "@/app/_helpers/helpers";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations("metaCardsPage");
  const sharedMetadata = await getSharedMetadata(t("title"), t("description"));
  return {
    title: t("title"),
    description: t("description"),
    ...sharedMetadata,
  };
}

export default async function CardsPage({ searchParams }: any) {
  const { category_id } = await searchParams;

  const cardsApi = category_id
    ? `/public-cards?category_id=${category_id}`
    : `/public-cards`;
  const response = await FetchData(cardsApi, true);
  const categories = await FetchData("/all-card-categories", false);
  const faqs = await FetchData(`/approvedQuestions?limit=6`, false);

  if (!response) return null;

  return (
    <div className="relative  gap-4 mt-20 w-[98%] lg:w-[95%] mx-auto px-2 py-12">
      <CardsComponent categories={categories} response={response as any} />
      <FAQSection faqs={faqs as faqType[]} />
    </div>
  );
}
