type OrderStatus = "pending" | "in_progress" | "completed";

type ServiceType = "subscription" | "one_time";

type TrackingPhase = "initiation" | "planning" | "execution" | "delivery";

type InvoiceStatus = "paid" | "unpaid" | "pending";

type PaymentMethod = "thawani";

type UploadedByType = "user" | "organization";

export interface ServiceTrackingFile {
  id: number;
  service_tracking_id: number;
  disk: string;
  path: string;
  original_name: string;
  mime_type: string;
  size: number;
  uploaded_by: number;
  uploaded_by_type: UploadedByType;
  created_at: string; // ISO string
  updated_at: string; // ISO string
}

export interface ServiceTracking {
  id: number;
  status: OrderStatus;
  phase: TrackingPhase;
  start_time: string | null;
  end_time: string | null;
  metadata: Record<string, string>;
  files: ServiceTrackingFile[];
}

export interface Invoice {
  number: string;
  total: number;
  currency: string; // ISO 4217
  status: InvoiceStatus;
  payment_method: PaymentMethod;
}

export interface ServiceSummary {
  id: number;
  slug: string;
  price: number;
  type: ServiceType;
  image: string;
  whatsapp_number: number | string;
}

export interface ServiceOrder {
  id: number;
  status: OrderStatus;
  created_at: string; // ISO string
  invoice: Invoice;
  service: ServiceSummary;
  trackings: ServiceTracking[];
  form_data: unknown[]; // لا تستخدم any
}
