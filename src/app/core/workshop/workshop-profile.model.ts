export interface WorkshopProfile {
  workshopName: string;
  address: string;
  city: string;
  country: string;
  phone: string;
  email: string;
  taxNumber: string;
  currency: string;
  emailNotifications: boolean;
  smsNotifications: boolean;
}

export const DEFAULT_WORKSHOP_PROFILE: WorkshopProfile = {
  workshopName: 'Car Service Center',
  address: '',
  city: 'Riyadh',
  country: 'Saudi Arabia',
  phone: '',
  email: '',
  taxNumber: '',
  currency: 'SAR',
  emailNotifications: true,
  smsNotifications: false,
};
