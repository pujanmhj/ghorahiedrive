export type UserRole = 'admin' | 'shareholder';

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
}

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface FleetCar {
  id: string;
  carNumber: string;
  from: string;
  to: string;
  createdAt: string;
}

export interface DailyRevenue {
  id: string;
  carId: string;
  date: string; // YYYY-MM-DD
  amount: number;
  route?: string;
  note?: string;
  createdAt: string;
}

export interface MonthlyCarTotal {
  carId: string;
  carNumber: string;
  from: string;
  to: string;
  totalAmount: number;
  daysLogged: number;
}

export type PaymentMethod = 'cash' | 'qr_banking';

export interface Payment {
  id: string;
  carId: string;
  date: string; // YYYY-MM-DD
  amount: number;
  method: PaymentMethod;
  note?: string;
  createdAt: string;
}

export interface AppDatabase {
  users: User[];
  cars: FleetCar[];
  revenues: DailyRevenue[];
}
