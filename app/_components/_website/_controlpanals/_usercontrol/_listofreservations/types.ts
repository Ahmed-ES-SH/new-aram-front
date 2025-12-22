export type Appointment = {
  id: number;
  user_id: number;
  organization_id: number;
  start_time: string;
  is_paid: boolean;
  end_time: string;
  price: number | string;
  status:
    | "pending"
    | "confirmed"
    | "rejected"
    | "cancelled_by_user"
    | "cancelled_by_org";
  user_notes: any;
  organization_notes: any;
  confirmed_at: any;
  rejected_at: any;
  cancelled_at: any;
  created_at: string;
  updated_at: string;
  user: {
    id: number;
    name: string;
    image: string;
    email: string;
  };
  organization: {
    id: number;
    title: string;
    logo: string;
    email: string;
  };
};
