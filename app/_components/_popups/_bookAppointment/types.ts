export interface TimeSlot {
  time: string;
  status: "available" | "booked";
}

export interface BookedDate {
  date: string;
  booked_count: number;
}

export interface OrganizationTimesResponse {
  all_times: TimeSlot[];
  booked_dates: BookedDate[];
}

export interface OrganizationWorkTimeResponse {
  open_at: string;
  close_at: string;
  booking_status: number;
  confirmation_status: number;
  confirmation_price?: number;
}

export interface BookingSummary {
  date: string;
  time: string;
  price?: number;
  orgTitle: string;
  endTime: string;
  notes: string;
  is_paid?: boolean | string;
  userId: number | string | null;
  orgId: number | string | null;
  formatDate: string;
}

export interface SelectTimePopupProps {
  isOpen: boolean;
  onClose: () => void;
  organizationId: string | number;
  organizationTitle: string;
}
