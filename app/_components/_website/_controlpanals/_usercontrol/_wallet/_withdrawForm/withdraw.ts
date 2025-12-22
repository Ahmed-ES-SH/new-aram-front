export type WithdrawMethod = "bank" | "paypal";
export type WithdrawType = "user" | "organization" | string;

export interface WithdrawFormData {
  user_id: string | number | null;
  type: WithdrawType | null;
  amount: number;
  method: WithdrawMethod;
  bank_number: string;
  details?: string;
}
