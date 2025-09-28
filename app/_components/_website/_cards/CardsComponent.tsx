"use client";
import React, { useEffect, useState } from "react";
import { Card } from "../../_dashboard/_cards/types";
import CreditCard from "../_global/CreditCard";
import CategoriesButtons from "./CategoriesButtons";
import { category } from "@/app/types/_dashboard/GlobalTypes";
import { motion } from "framer-motion";
import { FiCreditCard } from "react-icons/fi";
import { useLocale, useTranslations } from "next-intl";
import { instance } from "@/app/_helpers/axios";
import { useSearchParams } from "next/navigation";
import { directionMap } from "@/app/constants/_website/global";
import { VscLoading } from "react-icons/vsc";

type pagination = {
  current_page: number;
  last_page: number;
};

interface props {
  response: {
    data: Card[];
    pagination: {
      current_page: number;
      last_page: number;
    };
  };
  categories: category[];
}

export default function CardsComponent({ response, categories }: props) {
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("category_id");

  const t = useTranslations("cardsPage");
  const locale = useLocale();

  const [cards, setCards] = useState<Card[]>([]);
  const [pagination, setPagination] = useState<pagination | null>(null);
  const [loading, setLoading] = useState(false);

  const handleShowMore = async (newPage: number) => {
    const api = categoryId
      ? `/public-cards?page=${newPage}&category_id=${categoryId}`
      : `/public-cards?page=${newPage}`;
    try {
      setLoading(true);
      const response = await instance.get(api);
      if (response.status == 200) {
        const data = response.data.data;
        const pagination = response.data.pagination;
        setCards((prev) => [...prev, ...data]);
        setPagination(pagination);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (response.data) setCards(response.data);
    if (response.pagination) setPagination(response.pagination);
  }, [response]);

  return (
    <div
      dir={directionMap[locale]}
      className="lg:w-[95%] w-full mx-auto min-h-screen"
    >
      {/* header */}
      <div className="flex flex-col items-center text-center pb-10">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3 mb-4"
        >
          <FiCreditCard className="text-primary text-4xl" />
          <h2 className="text-3xl font-bold text-gray-800">
            {t("headerTitle")}
          </h2>
        </motion.div>
        <p className="text-gray-500 max-w-xl">{t("headerDescription")}</p>
      </div>

      {/* categories */}
      <CategoriesButtons categories={categories} />

      {/* cards data grid */}
      <div className="w-full mt-8 grid grid-cols-1 max-sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {cards.map((card, index) => (
          <div
            key={`${card.id}-${index}-card`}
            className="hover:-translate-y-4 h-full duration-200"
          >
            <CreditCard card={card} brand="VISA" type="Platinum" />
          </div>
        ))}
      </div>

      {/* show more button */}
      {pagination && pagination.current_page < pagination.last_page && (
        <motion.button
          disabled={loading}
          onClick={() => handleShowMore(pagination.current_page + 1)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-10 mx-auto flex items-center justify-center px-6 py-3 bg-primary text-white rounded-xl shadow-md hover:bg-primary/90 duration-300"
        >
          {loading ? (
            <VscLoading className="size-6 animate-spin" />
          ) : (
            t("showMore")
          )}
        </motion.button>
      )}
    </div>
  );
}
