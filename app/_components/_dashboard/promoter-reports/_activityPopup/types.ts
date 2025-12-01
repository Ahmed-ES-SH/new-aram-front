export interface Member {
  id: number | string;
  name: string;
  email: string;
  image?: string;
  phone?: string;
}

export interface PurchaseItem {
  title: string;
  price: string | number;
  quantity: number;
  image?: string;
  duration?: string | number;
}

export interface ActivityMetadata {
  // Common
  ip?: string;
  user_id?: number | string;
  user_type?: string;
  user_agent?: string;

  // Visit
  visited_url?: string;
  referrer_url?: string;
  visit_duration_seconds?: number;

  // Purchase
  items?: PurchaseItem[];
  total?: number | string;
  commission_rate?: number | string;
}

export interface ActivityItem {
  id: number | string;
  activity_type: "visit" | "signup" | "purchase" | string;
  metadata: ActivityMetadata;
  ip_address?: string;
  country?: string;
  device_type?: string;
  ref_code?: string;
  activity_at: string;
  member?: Member | null;
  member_type: "user" | "organization";
  member_id: number | string;
  commission_amount?: string | number;
  is_active?: boolean; // Inferred from requirements "is_active (status)"
}
