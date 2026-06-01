import { Car } from '@features/cars/models/car.model';

export interface CarQrPrintLabels {
  cardTitle: string;
  scanHint: string;
  plate: string;
  vin: string;
  companyPhone: string;
  laserNote: string;
}

export interface CarQrPrintContext {
  car: Car;
  labels: CarQrPrintLabels;
  workshopName: string;
  workshopPhone: string;
  logoDataUrl: string;
  lang: 'ar' | 'en';
  scanUrl: string;
}
