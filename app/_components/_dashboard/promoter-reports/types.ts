export interface Promoter {
  id: string;
  promoter_id: number | string;
  name: string;
  email: string;
  status: "active" | "disabled";
  promoter: promoterDetailas;
  total_signups: number;
  total_visits: number;
  total_purchases: number;
  total_earnings: number | string;
  referral_code: string;
  promoter_type: string;
  discount_percentage: number;
  created_at: string;
}

export interface promoterDetailas {
  id: string;
  name: string;
  email: string;
  phone: string;
  image: string;
}

export interface PromotionActivity {
  id: string;
  promoterId: string;
  activity_type: "visit" | "signup" | "purchase";
  country: string;
  device_type: string;
  ip_address: string;
  commission_amount?: number;
  orderAmount?: number;
  member_id?: number | string;
  member_type?: "user" | "organization";
  member: {
    id: number;
    name: string;
    email: string;
    phone: string;
    image: string;
  };
  created_at: string;
}
