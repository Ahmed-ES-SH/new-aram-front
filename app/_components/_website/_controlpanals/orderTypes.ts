export interface ServiceOrder {
  id: number;
  user_id: number;
  user_type: "user" | string;
  status: "pending" | "paid" | "cancelled" | string;
  invoice_id: number;
  service_page_id: number;
  metadata: ProvisionalMetadata;
  subscription_status: "active" | "expired";
  subscription_start_time: string;
  subscription_end_time: string;
  created_at: string;
  updated_at: string;
  service: Service;
  invoice: Invoice;
}

export interface Invoice {
  id: number;
  invoice_number: string;
  total_invoice: string;
  before_discount: string | null;
  discount: string | null;
  ref_code: string | null;
  invoice_type: "service" | string;
  owner_id: number;
  owner_type: "user" | string;
  status: "paid" | "pending" | "failed" | string;
  currency: string;
  payment_method: string;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: number;
  slug: string;
  price: string;
  price_before_discount: string;
  type: "subscription" | "one_time" | string;
  status: "active" | "inactive" | string;
  is_active: boolean;
  order: number;
  whatsapp_number: string;
  category_id: number;
  created_at: string;
  updated_at: string;

  gallery_images: Array<{
    id: number;
    service_page_id: number;
    path: string;
  }>;

  trackings: Array<{
    id: number;
    service_id: number;
    user_id: number;
    user_type: string;
  }>;
}

export interface ProvisionalMetadata {
  items: ProvisionalItem;
  country: string | null;
  discount: number | null;
  data_type: "service" | string;
  invoice_id: string;
  ip_address: string;
  device_type: string | null;
  total_invoice: number;
  before_discount: number | null;
}

export interface ProvisionalItem {
  slug: string;
  price: string;
  metadata: ServiceMetadataField[];
  service_id: number;
}

export type ServiceMetadataFieldType =
  | "short_text"
  | "email"
  | "long_text"
  | "time"
  | string;

export interface ServiceMetadataField {
  key: string;
  label: string;
  value: string;
  type: ServiceMetadataFieldType;
}
