export type TransactionType =
  | "deposit"
  | "withdrawal"
  | "purchase"
  | "sale"
  | "commission"
  | "refund"
  | "transfer"
  | "book";

export type TransactionDirection = "in" | "out";
export type TransactionStatus = "pending" | "completed" | "failed";

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  direction: TransactionDirection;
  status: TransactionStatus;
  note: string;
  date: Date;
  isNew: boolean;
}

export interface WalletTransactionsTableProps {
  transactions: Transaction[];
  pagination: {
    current_page: number;
    last_page: number;
  };
}
