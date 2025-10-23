"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import {
  FaArrowDown,
  FaArrowUp,
  FaShoppingCart,
  FaMoneyBillWave,
  FaPercent,
  FaUndoAlt,
  FaExchangeAlt,
} from "react-icons/fa";
import { Transaction, TransactionType } from "./types";
import { GiNotebook } from "react-icons/gi";

interface TransactionRowProps {
  transaction: Transaction;
  index: number;
}

const getTransactionIcon = (type: TransactionType) => {
  const iconProps = { className: "w-4 h-4" };

  switch (type) {
    case "deposit":
      return <FaArrowDown {...iconProps} />;
    case "withdrawal":
      return <FaArrowUp {...iconProps} />;
    case "purchase":
      return <FaShoppingCart {...iconProps} />;
    case "sale":
      return <FaMoneyBillWave {...iconProps} />;
    case "commission":
      return <FaPercent {...iconProps} />;
    case "refund":
      return <FaUndoAlt {...iconProps} />;
    case "transfer":
      return <FaExchangeAlt {...iconProps} />;
    case "book":
      return <GiNotebook {...iconProps} />;
    default:
      return <FaExchangeAlt {...iconProps} />;
  }
};

const getStatusStyles = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-700 border-yellow-200";
    case "completed":
      return "bg-emerald-100 text-emerald-700 border-emerald-200";
    case "failed":
      return "bg-rose-100 text-rose-700 border-rose-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
};

export const TransactionRow = ({ transaction, index }: TransactionRowProps) => {
  const t = useTranslations("wallet.transactions");

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <motion.tr
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="border-b border-gray-200  duration-200  even:bg-gray-50 odd:bg-primary/10"
    >
      {/* Desktop View */}
      <td className="hidden md:table-cell py-4 px-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-primary">
            {getTransactionIcon(transaction.type)}
          </div>
          <span className="font-medium text-gray-700">
            {t(`types.${transaction.type}`)}
          </span>
        </div>
      </td>

      <td className="hidden md:table-cell py-4 px-4">
        <span className="font-semibold text-gray-900">
          {formatCurrency(transaction.amount, "USD")}
        </span>
      </td>

      <td className="hidden md:table-cell py-4 px-4">
        <span
          className={`font-medium ${
            transaction.direction === "in"
              ? "text-emerald-600"
              : "text-rose-600"
          }`}
        >
          {t(transaction.direction)}
        </span>
      </td>

      <td className="hidden md:table-cell py-4 px-4">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusStyles(
            transaction.status
          )}`}
        >
          {t(`statuses.${transaction.status}`)}
        </span>
      </td>

      <td className="hidden md:table-cell py-4 px-4">
        <span className="text-gray-600 line-clamp-1">{transaction.note}</span>
      </td>

      <td className="hidden md:table-cell py-4 px-4">
        <span className="text-gray-500 text-sm">
          {formatDate(transaction.date)}
        </span>
      </td>

      {/* Mobile View */}
      <td className="md:hidden py-4 px-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                {getTransactionIcon(transaction.type)}
              </div>
              <div>
                <span className="font-medium text-gray-700 block">
                  {t(`types.${transaction.type}`)}
                </span>
                <span className="text-sm text-gray-500">
                  {formatDate(transaction.date)}
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="font-semibold text-gray-900 block">
                {formatCurrency(transaction.amount, "USD")}
              </span>
              <span
                className={`text-sm font-medium ${
                  transaction.direction === "in"
                    ? "text-emerald-600"
                    : "text-rose-600"
                }`}
              >
                {t(transaction.direction)}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusStyles(
                transaction.status
              )}`}
            >
              {t(`statuses.${transaction.status}`)}
            </span>
            <span className="text-gray-600 text-sm line-clamp-1 max-w-[150px]">
              {transaction.note}
            </span>
          </div>
        </div>
      </td>
    </motion.tr>
  );
};
