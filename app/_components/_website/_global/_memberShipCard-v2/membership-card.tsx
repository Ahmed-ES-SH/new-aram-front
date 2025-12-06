"use client";

import { useEffect, useState } from "react";
import type { MembershipCardData } from "./types";
import { CardContainer } from "./card-container";
import { CardHeader } from "./card-header";
import { CardBody } from "./card-body";
import { PriceSection } from "./price-section";
import { HoverActions } from "./hover-actions";
import { useLocale, useTranslations } from "next-intl";
import { useAppDispatch, useAppSelector } from "@/app/Store/hooks";
import {
  addItemWithOne,
  isItemInCart,
  removeItem,
} from "@/app/Store/cartSlice";
import { toast } from "sonner";
import { usePathname, useRouter } from "next/navigation";
import { formatTitle } from "@/app/_helpers/helpers";

interface MembershipCardProps {
  data: MembershipCardData;
}

export function MembershipCard({ data }: MembershipCardProps) {
  const router = useRouter();
  const locale = useLocale();
  const pathname = usePathname();

  const isCardPage = pathname.includes("/cards/");

  const t = useTranslations();

  const successMessage =
    locale == "en"
      ? "The card has been added to the cart successfully!"
      : "تم إضافة البطاقة الى السلة بنجاح !";

  const { activeCurrency } = useAppSelector((state) => state.currency);
  const dispatch = useAppDispatch();

  const [isIncart, setIsIncart] = useState(false);

  const handleAddToCart = () => {
    dispatch(addItemWithOne(data));
    toast.success(successMessage);
    setIsIncart(true);
  };

  const handleRemoveFromCart = () => {
    dispatch(removeItem(data.id));
    toast.success(t("membershipCard.removededMessage"));
    setIsIncart(false);
  };

  const inCart = useAppSelector((state) => isItemInCart(state, data?.id));

  useEffect(() => {
    setIsIncart(inCart);
  }, [inCart]);

  const [isHovered, setIsHovered] = useState(false);

  return (
    <CardContainer
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      isRTL={locale === "ar"}
      image={data.image}
    >
      {/* Hover Actions */}
      {!isCardPage && (
        <HoverActions
          onViewDetails={() =>
            router.push(`/cards/${formatTitle(data.title)}?cardId=${data.id}`)
          }
          onAddToCart={handleAddToCart}
          onRemoveFromCart={handleRemoveFromCart}
          isVisible={isHovered}
          isIncart={isIncart}
          t={t}
        />
      )}

      {/* Card Content */}
      <div className="relative h-full flex flex-col justify-between">
        <CardHeader data={data} t={t} />
        <CardBody data={data} t={t} />
        <PriceSection data={data} t={t} />
      </div>
    </CardContainer>
  );
}
