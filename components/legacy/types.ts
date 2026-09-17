export interface Taxi {
  id: string;
  number: string; // e.g. Ba 2 Cha 1234
  driverName: string;
  driverPhone: string;
  status: 'Available' | 'On Trip' | 'Maintenance';
  tripsCompleted: number;
  seats: number;
  hasAC: boolean;
  rating: number;
  image: string; // placeholder path
  model?: string; // e.g. Toyota Etios, Mahindra Scorpio
}

export interface Trip {
  id: string;
  taxiNumber: string;
  driverName: string;
  from: string; // Read-only "Dang"
  destination: string;
  amount: number; // in NPR
  date: string;
  status: 'Completed' | 'Running' | 'Pending';
}
