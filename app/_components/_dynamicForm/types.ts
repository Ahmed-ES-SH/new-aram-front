// Dynamic Form Renderer - Type Definitions

// Localized text type
export interface LocalizedText {
  ar: string;
  en: string;
  nl?: string;
}

// Validation rule types
export type ValidationRuleType =
  | "required"
  | "min"
  | "max"
  | "minLength"
  | "maxLength"
  | "pattern"
  | "email"
  | "url"
  | "phone"
  | "custom";

// Validation rule from backend
export interface ValidationRule {
  type: ValidationRuleType;
  value?: string | number;
  message: LocalizedText;
}

// Field type options
export type FormFieldType =
  | "text"
  | "textarea"
  | "number"
  | "email"
  | "phone"
  | "select"
  | "radio"
  | "checkbox"
  | "file"
  | "image"
  | "date"
  | "time"
  | "datetime"
  | "color"
  | "url"
  | "hidden";

// Option for select/radio/checkbox fields
export interface FieldOption {
  value: string;
  label: LocalizedText;
  disabled?: boolean;
}

// Conditional visibility rule
export interface ConditionalRule {
  field: string;
  operator: "equals" | "notEquals" | "contains" | "greaterThan" | "lessThan";
  value: any;
}

// Form field definition from backend
export interface FormField {
  id: string;
  name: string;
  type: FormFieldType;
  label: LocalizedText;
  placeholder?: LocalizedText;
  description?: LocalizedText;
  defaultValue?: any;
  options?: FieldOption[];
  validation?: ValidationRule[];
  order: number;
  step?: number; // For multi-step forms (1, 2, 3...)
  conditionalOn?: ConditionalRule;
  accept?: string; // For file inputs (e.g., "image/*,.pdf")
  multiple?: boolean; // For file/select inputs
  min?: number;
  max?: number;
  step_increment?: number; // For number inputs
  rows?: number; // For textarea
  className?: string;
  width?: "full" | "half" | "third"; // Layout width
  required?: boolean; // Quick access to required validation
}

// Step definition for multi-step forms
export interface FormStep {
  id: number;
  title: LocalizedText;
  description?: LocalizedText;
  icon?: string;
}

// Complete form schema
export interface FormSchema {
  id: string;
  name: string;
  title: LocalizedText;
  description?: LocalizedText;
  fields: FormField[];
  steps?: FormStep[];
  submitEndpoint?: string;
  submitMethod?: "POST" | "PUT";
  submitButtonText?: LocalizedText;
}

// Form state
export interface FormState {
  values: Record<string, any>;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
  isValid: boolean;
  currentStep: number;
}

// Server error response
export interface ServerErrors {
  [fieldName: string]: string | string[] | LocalizedText;
}

// Form submission result
export interface FormSubmitResult {
  success: boolean;
  data?: any;
  errors?: ServerErrors;
  message?: LocalizedText | string;
}

// Props for field components
export interface BaseFieldProps {
  field: FormField;
  value: any;
  error?: string;
  touched?: boolean;
  disabled?: boolean;
  locale: "ar" | "en";
  onChange: (value: any) => void;
  onBlur?: () => void;
}

// Props for the main form renderer
export interface DynamicFormRendererProps {
  schema: FormSchema;
  initialData?: Record<string, any>;
  onSubmit?: (data: Record<string, any>) => Promise<FormSubmitResult | void>;
  onStepChange?: (step: number) => void;
  onValuesChange?: (values: Record<string, any>) => void;
  locale?: "ar" | "en";
  disabled?: boolean;
  showSubmitButton?: boolean;
  submitButtonClassName?: string;
  className?: string;
}

// Available form fields for admin to choose from
export const AVAILABLE_FORM_FIELDS: Partial<FormField>[] = [
  {
    id: "customer_name",
    name: "customer_name",
    type: "text",
    label: { ar: "الاسم الكامل", en: "Full Name" },
    placeholder: { ar: "أدخل اسمك الكامل", en: "Enter your full name" },
    required: true,
    width: "half",
  },
  {
    id: "email",
    name: "email",
    type: "email",
    label: { ar: "البريد الإلكتروني", en: "Email Address" },
    placeholder: { ar: "example@domain.com", en: "example@domain.com" },
    required: true,
    width: "half",
  },
  {
    id: "phone",
    name: "phone",
    type: "phone",
    label: { ar: "رقم الهاتف", en: "Phone Number" },
    placeholder: { ar: "+968 XXXX XXXX", en: "+968 XXXX XXXX" },
    required: true,
    width: "half",
  },
  {
    id: "longText",
    name: "longText",
    type: "textarea",
    label: { ar: "نص طويل", en: "Long Text" },
    placeholder: {
      ar: "أدخل النص الطويل",
      en: "Enter your detailed longText",
    },
    rows: 3,
    width: "full",
  },
  {
    id: "quantity",
    name: "quantity",
    type: "number",
    label: { ar: "الكمية", en: "Quantity" },
    defaultValue: 1,
    min: 1,
    max: 100,
    width: "half",
  },
  {
    id: "preferred_date",
    name: "preferred_date",
    type: "date",
    label: { ar: "التاريخ المفضل", en: "Preferred Date" },
    width: "half",
  },
  {
    id: "preferred_time",
    name: "preferred_time",
    type: "time",
    label: { ar: "الوقت المفضل", en: "Preferred Time" },
    width: "half",
  },
  {
    id: "notes",
    name: "notes",
    type: "textarea",
    label: { ar: "ملاحظات إضافية", en: "Additional Notes" },
    placeholder: {
      ar: "أي ملاحظات أو متطلبات خاصة...",
      en: "Any notes or special requirements...",
    },
    rows: 4,
    width: "full",
  },
  {
    id: "attachment",
    name: "attachment",
    type: "file",
    label: { ar: "ملف مرفق", en: "Attachment" },
    accept: ".pdf,.doc,.docx,.jpg,.jpeg,.png",
    width: "full",
  },
  {
    id: "design_file",
    name: "design_file",
    type: "image",
    label: { ar: "ملف التصميم", en: "Design File" },
    accept: "image/*",
    width: "full",
  },
  {
    id: "color_preference",
    name: "color_preference",
    type: "color",
    label: { ar: "اللون المفضل", en: "Preferred Color" },
    defaultValue: "#000000",
    width: "half",
  },
  {
    id: "terms_accepted",
    name: "terms_accepted",
    type: "checkbox",
    label: {
      ar: "أوافق على الشروط والأحكام",
      en: "I agree to the terms and conditions",
    },
    required: true,
    width: "full",
  },
];

// Default empty form schema
export const DEFAULT_FORM_SCHEMA: FormSchema = {
  id: "",
  name: "",
  title: { ar: "نموذج الطلب", en: "Order Form" },
  fields: [],
  submitButtonText: { ar: "إرسال الطلب", en: "Submit Order" },
};
