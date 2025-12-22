export interface promotorItem {
  id: number;
  promoter_type: "organization" | "user";
  promoter_id: number;
  activity_type: "purchase" | "visit" | "signup";
  data: any;
  ip_address: number;
  country: string;
  device_type: string;
  ref_code: string;
  commission_amount: number | null;
  activity_at: string;
  created_at: string;
  updated_at: string;
}

export interface promoterType {
  id: number;
  promotable_type: "user" | "organization";
  promotable_id: number;
  referral_code: string;
  status: "active" | "disabled";
  total_visits: number;
  total_signups: number;
  total_purchases: number;
  total_earnings: number;
  created_at: string;
  updated_at: string;
}
