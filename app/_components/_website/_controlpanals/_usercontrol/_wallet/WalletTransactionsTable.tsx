"use client";

import { useLocale, useTranslations } from "next-intl";
import { Transaction, WalletTransactionsTableProps } from "./types";
import { TransactionRow } from "./TransactionRow";
import { directionMap } from "@/app/constants/_website/global";
import Pagination from "@/app/_components/PaginationComponent";
import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/Store/hooks";
import { instance } from "@/app/_helpers/axios";
import TransactionsBody from "./TransactionsBody";
import WithdrawForm from "./_withdrawForm/WithdrawForm";
import { FaMoneyBillWave } from "react-icons/fa";
import { setWithdrawOpen } from "@/app/Store/variablesSlice";

export const WalletTransactionsTable = ({
  transactions: data,
  pagination,
}: WalletTransactionsTableProps) => {
  const locale = useLocale();

  const { user } = useAppSelector((state) => state.user);

  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(pagination.current_page ?? 1);
  const [lastPage, setLastPage] = useState(pagination.last_page ?? 1);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const hasMounted = useRef(false);

  const t = useTranslations("wallet.transactions");
  const t_2 = useTranslations("walletOverview");

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= lastPage) {
      setCurrentPage(newPage);
    }
  };

  useEffect(() => {
    if (data) {
      setTransactions(data);
    }
  }, [data]);

  useEffect(() => {
    if (hasMounted.current) {
      const fetchData = async () => {
        try {
          scrollTo(180, 180);
          setLoading(true);
          const response = await instance.get(
            `/user-transactions?user_id=${user?.id}&type=${user?.account_type}&page=${currentPage}`
          );
          if (response.status === 200) {
            const { data, pagination } = response.data;
            setTransactions(data);
            setCurrentPage(pagination.current_page);
            setLastPage(pagination.last_page);
          }
        } catch (error: any) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    } else {
      hasMounted.current = true;
    }
  }, [currentPage, user]);

  return (
    <>
      <div
        dir={directionMap[locale]}
        className="w-full bg-white rounded-lg border border-gray-200 overflow-hidden"
      >
        {/* Table Header */}
        <div className="px-6 py-4 border-b border-gray-200 w-full flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">{t("title")}</h2>
          <button
            onClick={() => dispatch(setWithdrawOpen(true))}
            className="px-6 py-2 bg-primary max-md:self-end max-md:hidden text-white rounded-lg flex items-center justify-center border border-transparent hover:text-black hover:scale-110 hover:bg-white hover:border-primary duration-300"
          >
            <div className="flex items-center whitespace-nowrap gap-1">
              <FaMoneyBillWave className="size-6" />
              <p>{t_2("withdrawbtn")}</p>
            </div>
          </button>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full border-separate">
            <thead>
              <tr className="bg-gray-50">
                <th className="py-3 px-4 ltr:text-left rtl:text-right font-semibold text-gray-700 text-sm uppercase tracking-wider">
                  {t("type")}
                </th>
                <th className="py-3 px-4 ltr:text-left rtl:text-right font-semibold text-gray-700 text-sm uppercase tracking-wider">
                  {t("amount")}
                </th>
                <th className="py-3 px-4 ltr:text-left rtl:text-right font-semibold text-gray-700 text-sm uppercase tracking-wider">
                  {t("direction")}
                </th>
                <th className="py-3 px-4 ltr:text-left rtl:text-right font-semibold text-gray-700 text-sm uppercase tracking-wider">
                  {t("status")}
                </th>
                <th className="py-3 px-4 ltr:text-left rtl:text-right font-semibold text-gray-700 text-sm uppercase tracking-wider">
                  {t("note")}
                </th>
                <th className="py-3 px-4 ltr:text-left rtl:text-right font-semibold text-gray-700 text-sm uppercase tracking-wider">
                  {t("date")}
                </th>
              </tr>
            </thead>
            <tbody>
              <TransactionsBody transactions={transactions} loading={loading} />
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden">
          <table className="w-full">
            <tbody>
              {transactions.map((transaction, index) => (
                <TransactionRow
                  key={transaction.id}
                  transaction={transaction}
                  index={index}
                />
              ))}
            </tbody>
          </table>
        </div>

        {/* pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={lastPage}
          onPageChange={handlePageChange}
        />
      </div>
      <button
        onClick={() => dispatch(setWithdrawOpen(true))}
        className="bg-primary w-12 h-12 fixed bottom-20 right-4 md:hidden text-white rounded-full flex items-center justify-center border border-transparent hover:text-black hover:scale-110 hover:bg-white hover:border-primary duration-300"
      >
        <FaMoneyBillWave className="size-6" />
      </button>
      <WithdrawForm setTransactions={setTransactions} />
    </>
  );
};
