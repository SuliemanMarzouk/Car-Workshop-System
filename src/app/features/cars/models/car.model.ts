export interface Car {
  id: number;
  plate_number: string;
  vin: string;
  car_model: string;
  color: string;
  odometer: number;
  owner_name: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateCarPayload {
  plate_number: string;
  vin: string;
  car_model: string;
  color: string;
  odometer: number | string;
  owner_name: string;
}
