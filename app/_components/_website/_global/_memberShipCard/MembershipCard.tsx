// components/MembershipCard/MembershipCard.tsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaShoppingCart, FaEye, FaCrown, FaStar, FaGem } from "react-icons/fa";
import CardImage from "./CardImage";
import CardHeader from "./CardHeader";
import PriceSection from "./PriceSection";
import BadgeList from "./BadgeList";
import MembershipDetails from "./MembershipDetails";
import HoverActions from "./HoverActions";
import CardContainer from "./CardContainer";
import { MembershipCardProps } from "./types";
import { useTranslations } from "next-intl";

const MembershipCard: React.FC<MembershipCardProps> = ({
  data,
  onAddToCart = () => {},
  onViewDetails = () => {},
}) => {
  const t = useTranslations();
  const [isHovered, setIsHovered] = React.useState(false);

  const levelIcons = {
    Platinum: <FaCrown className="text-amber-300" />,
    Gold: <FaStar className="text-yellow-400" />,
    Premium: <FaGem className="text-purple-400" />,
    Elite: <FaStar className="text-blue-300" />,
  };

  return (
    <CardContainer
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Hover Action Buttons */}
      <HoverActions
        isVisible={isHovered}
        onAddToCart={onAddToCart}
        onViewDetails={onViewDetails}
        addToCartText={t("membership_card.add_to_cart")}
        viewDetailsText={t("membership_card.view_details")}
      />

      {/* Card Content */}
      <div className="relative z-10 flex flex-col lg:flex-row h-full">
        {/* Left Side - Card Image */}
        <div className="lg:w-2/5 p-6 flex items-center justify-center">
          <CardImage src={data.image} alt={data.title} isHovered={isHovered} />
        </div>

        {/* Right Side - Card Details */}
        <div className="lg:w-3/5 p-6 flex flex-col justify-between">
          <div className="space-y-4">
            <CardHeader title={data.title} description={data.description} />

            <PriceSection
              price={data.price}
              priceBeforeDiscount={data.price_before_discount}
            />

            <MembershipDetails
              memberId={data.member_id || "MEM-2023-001"}
              memberLevel={data.member_level || "Premium"}
              joinDate={data.join_date || "2023-01-15"}
              expiryDate={data.expiry_date || "2024-01-15"}
              levelIcon={
                levelIcons[data.member_level as keyof typeof levelIcons] ||
                levelIcons.Premium
              }
            />
          </div>

          <BadgeList keywords={data.keywords} />
        </div>
      </div>

      {/* Card Decorative Elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-white/5 to-transparent rounded-full -translate-y-16 translate-x-16" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-linear-to-tr from-white/5 to-transparent rounded-full translate-y-12 -translate-x-12" />
    </CardContainer>
  );
};

export default MembershipCard;
