export interface WorkshopSettings {
  workshop_name: string;
  logo_data_url?: string | null;
  address: string;
  city: string;
  country: string;
  phone: string;
  email: string;
  tax_number: string;
  default_currency: string;
  vat_rate: number;
  email_notifications: boolean;
  sms_notifications: boolean;
}

export interface WorkshopConfig {
  workshop_name: string;
  logo_data_url?: string | null;
  address: string;
  city: string;
  country: string;
  phone: string;
  email: string;
  tax_number: string;
  default_currency: string;
  vat_rate: number;
}

export interface UpdateWorkshopSettingsPayload {
  workshop_name: string;
  logo_data_url?: string | null;
  address: string;
  city: string;
  country: string;
  phone: string;
  email: string;
  tax_number: string;
  default_currency: string;
  vat_rate: number;
  email_notifications: boolean;
  sms_notifications: boolean;
}
