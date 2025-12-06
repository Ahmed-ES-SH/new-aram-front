export interface RegistrationFormData {
  // Step 1: Account Details
  email: string;
  password: string;
  phone_number: string;

  // Step 2: Basic Information
  title: string;
  description: string;

  // Step 3: Scheduling & Status
  open_at: string;
  close_at: string;
  confirmation_price: number;
  confirmation_status: boolean;
  booking_status: boolean;

  // Step 4: Media & Classification
  image: File | null;
  logo: File | null;
  categories: number[];
  subcategories: number[];

  // step 5:offer
  offer: {
    image: File | null;
    title: string;
    description: string;
    discount_type: string;
    discount_value: string;
    start_date: string;
    end_date: string;
    category_id: string;
    code: string | number;
    status: string;
  };
}

export type RegistrationStep = 1 | 2 | 3 | 4 | 5;
