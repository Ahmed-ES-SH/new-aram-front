"use client";
import CardDashDisplay from "@/app/_components/_dashboard/_cards/CardComponent";
import { Card } from "@/app/_components/_dashboard/_cards/types";
import LoadingSpin from "@/app/_components/LoadingSpin";
import useFetchData from "@/app/_helpers/FetchDataWithAxios";
import React, { useEffect, useState } from "react";

export default function CardsPage() {
  const { data, loading } = useFetchData<Card[]>("/dashboard/cards", false);

  const [cards, setCards] = useState<Card[]>([]);

  useEffect(() => {
    if (data) {
      setCards(data);
    }
  }, [data]);

  if (loading) return <LoadingSpin />;

  if (cards.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">لا يوجد بطاقات فى الوقت الحالى </p>
      </div>
    );
  }

  return (
    <>
      {cards && cards.length > 0 && (
        <div
          dir="rtl"
          className="grid 2xl:grid-cols-4 xl:grid-cols-3 max-md:grid-cols-1 grid-cols-2 gap-x-8 gap-y-4 w-[98%] xl:w-[90%] mx-auto mb-4"
        >
          {cards.map((card) => (
            <CardDashDisplay setCards={setCards} key={card.id} card={card} />
          ))}
        </div>
      )}
    </>
  );
}
