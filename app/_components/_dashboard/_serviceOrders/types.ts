export type OrderStatus = "pending" | "in_progress" | "completed" | "cancelled";
export type InvoiceStatus = "paid" | "unpaid" | "pending";
export type TrackingPhase =
  | "initiation"
  | "planning"
  | "execution"
  | "delivery";

export interface GalleryImage {
  id: number;
  service_page_id: number;
  path: string;
}

export interface ServiceTrackingFile {
  id: number;
  service_tracking_id: number;
  disk: string;
  path: string;
  original_name: string;
  mime_type: string;
  size: number;
  uploaded_by: number;
  uploaded_by_type: string;
  created_at: string;
  updated_at: string;
}

export interface ServiceTracking {
  id: number;
  service_id: number;
  user_id: number;
  user_type: string;
  status: OrderStatus;
  current_phase: TrackingPhase;
  metadata: Record<string, any> | null;
  start_time: string | null; // ISO Date
  end_time: string | null; // ISO Date
  created_at: string;
  updated_at: string;

  files: ServiceTrackingFile[];
}

export interface AdminService {
  id: number;
  slug: string;
  price: string;
  price_before_discount: string;
  type: string;
  status: string;
  is_active: boolean;
  order: number;
  whatsapp_number: string;
  category_id: number;
  created_at: string;
  updated_at: string;
  gallery_images: GalleryImage[];
}

export interface AdminInvoice {
  id: number;
  number: string;
  total: string;
  before_discount: string | null;
  discount: string | null;
  ref_code: string | null;
  invoice_type: string;
  owner_id: number;
  owner_type: string;
  status: InvoiceStatus;
  currency: string;
  payment_method: string;
  created_at: string;
  updated_at: string;
}

interface userType {
  id: number | string;
  name: string;
  email: string;
  image: string;
}

export interface AdminServiceOrder {
  id: number;
  user: userType;
  user_id: number;
  user_type: string;
  status: OrderStatus;
  invoice_id: number;
  service_page_id: number;
  metadata: any;
  created_at: string;
  updated_at: string;
  service: AdminService;
  invoice: AdminInvoice;
  trackings: ServiceTracking[];
}
