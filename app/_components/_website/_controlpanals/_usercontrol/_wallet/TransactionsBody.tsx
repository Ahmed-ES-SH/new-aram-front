"use client";

import React from "react";
import { EmptyState } from "./EmptyState";
import SpinLoading from "../../../_global/SpinLoading";
import { TransactionRow } from "./TransactionRow";
import { Transaction } from "./types";

interface TransactionsBodyProps {
  transactions: Transaction[];
  loading: boolean;
}

export default function TransactionsBody({
  transactions,
  loading,
}: TransactionsBodyProps) {
  // Show loading spinner
  if (loading) {
    return (
      <tr>
        <td colSpan={6} className="p-10">
          <div className="min-h-[75vh] flex items-center justify-center w-full">
            <SpinLoading />
          </div>
        </td>
      </tr>
    );
  }

  // Show empty state if there are no transactions
  if (transactions.length === 0) {
    return (
      <tr>
        <td colSpan={6}>
          <EmptyState />
        </td>
      </tr>
    );
  }

  // Show table rows
  return (
    <>
      {transactions.map((transaction, index) => (
        <TransactionRow
          key={transaction.id}
          transaction={transaction}
          index={index}
        />
      ))}
    </>
  );
}
