// types/organization.ts
export interface Organization {
  id: number;
  title: string;
  email: string;
  phone_number: string;
  logo: string;
  status: string;
  number_of_reservations: number;
  created_at: string;
}

export interface OrganizationSelection extends Organization {
  selected: boolean;
}

export interface NotificationData {
  title: string;
  message: string;
  type: "info" | "warning" | "success" | "error";
}
