import {
  Form as ExternalForm,
  FormField,
  LocalizedText,
} from "../../_dashboard/_serviceEditor/types";
import { HeroData } from "../_servicePage/HeroServiceSection";
import { ServicePageData } from "../_servicePage/service-details-page";

// ----------------------------------------------------------------------
// Types & Interfaces (Matching Backend Contract for Consumer)
// ----------------------------------------------------------------------

export type FieldType =
  | "short_text"
  | "long_text"
  | "email"
  | "number"
  | "phone"
  | "url"
  | "dropdown"
  | "checkbox"
  | "radio"
  | "multi_select"
  | "date"
  | "time"
  | "datetime"
  | "file_upload"
  | "image_upload";

export interface ValidationConfig {
  min_length?: number;
  max_length?: number;
  min_value?: number;
  max_value?: number;
  pattern?: string;
  file_size_kb?: number;
  mime_types?: string[];
  min_date?: string;
  max_date?: string;
}

export interface VisibilityLogic {
  depends_on: string;
  condition: "equals" | "not_equals" | "contains" | "not_empty" | "empty";
  value: any;
}

export interface FieldDefinition {
  key: string;
  type: FieldType;
  label: string; // Localized from backend
  placeholder?: string;
  required: boolean;
  order: number;
  options?: {
    choices: {
      label: string;
      value: string | number;
    }[];
  };
  validation?: ValidationConfig;
  visibility?: VisibilityLogic;
}

export interface FormSchemaResponse {
  has_form: boolean;
  form: {
    id: number;
    name: string;
    description: string;
    fields: FieldDefinition[];
  } | null;
}

export interface DynamicServiceFormProps {
  serviceSlug: string;
  className?: string;
  service: HeroData;
  onSuccess?: () => void;
  initialForm?: ExternalForm;
  price?: number;
  price_before_discount?: number;
}
