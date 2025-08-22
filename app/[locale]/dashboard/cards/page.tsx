import CardComponent from "@/app/_components/_dashboard/_cards/CardComponent";
import FetchData from "@/app/_helpers/FetchData";
import React from "react";

export default async function page() {
  const cards = await FetchData("/dashboard/cards", false);

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
          className="grid 2xl:grid-cols-4 xl:grid-cols-3 max-md:grid-cols-1 grid-cols-2 gap-x-8 gap-y-4 w-[98%] xl:w-[90%] mx-auto"
        >
          {cards.map((card) => (
            <CardComponent key={card.id} card={card} />
          ))}
        </div>
      )}
    </>
  );
}
