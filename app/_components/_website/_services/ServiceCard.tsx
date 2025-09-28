"use client";
import { FC } from "react";
import { motion } from "framer-motion";
import { FaStar, FaShoppingCart, FaTag } from "react-icons/fa";
import Img from "../_global/Img";

type Keyword = {
  id: number;
  title: string;
};

type Category = {
  id: number;
  title_en: string;
  title_ar: string;
  image: string;
};

type Service = {
  id: number;
  title: string;
  description: string;
  image: string;
  rating: number;
  orders_count: number;
  category: Category;
  keywords: Keyword[];
};

interface Props {
  service: Service;
  locale?: "en" | "ar";
}

const ServiceCard: FC<Props> = ({ service, locale = "en" }) => {
  const {
    title,
    description,
    image,
    rating,
    orders_count,
    category,
    keywords,
  } = service;

  // limit keywords to 3 and show extra count if exists
  const displayedKeywords = keywords.slice(0, 3);
  const extraCount = keywords.length > 3 ? keywords.length - 3 : 0;

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col"
    >
      {/* Service Image */}
      <div className="relative w-full h-48">
        <Img
          src={image ?? "/defaults/noImage.png"}
          errorSrc="/defaults/noImage.png"
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 left-2 bg-primary text-white px-3 py-1 rounded-full text-sm flex items-center gap-1 shadow">
          <FaTag />
          {locale === "ar" ? category.title_ar : category.title_en}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-3 flex-grow">
        <h3 className="text-lg font-semibold line-clamp-1">{title}</h3>
        <p className="text-gray-600 text-sm line-clamp-2">{description}</p>

        {/* Rating & Orders */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <FaStar className="text-yellow-500" /> {rating}
          </span>
          <span className="flex items-center gap-1">
            <FaShoppingCart /> {orders_count}
          </span>
        </div>

        {/* Keywords */}
        <div className="flex flex-wrap gap-2 mt-2">
          {displayedKeywords.map((kw) => (
            <span
              key={kw.id}
              className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs"
            >
              {kw.title}
            </span>
          ))}
          {extraCount > 0 && (
            <span className="bg-primary text-white px-2 py-1 rounded-full text-xs">
              +{extraCount}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ServiceCard;
