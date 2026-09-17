import { Schema, models, model } from 'mongoose';
import type { UserRole } from '@/lib/types';

const UserSchema = new Schema(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['admin', 'shareholder'], required: true },
  },
  { timestamps: true, versionKey: false }
);

const CarSchema = new Schema(
  {
    _id: { type: String, required: true },
    carNumber: { type: String, required: true, unique: true },
    from: { type: String, default: '' },
    to: { type: String, default: '' },
    createdAt: { type: String, required: true },
  },
  { versionKey: false }
);

const RevenueSchema = new Schema(
  {
    _id: { type: String, required: true },
    carId: { type: String, required: true, index: true },
    date: { type: String, required: true, index: true },
    amount: { type: Number, required: true, min: 0 },
    route: { type: String },
    note: { type: String },
    createdAt: { type: String, required: true },
  },
  { versionKey: false }
);


export type UserDoc = {
  _id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
};

export type CarDoc = {
  _id: string;
  carNumber: string;
  from?: string;
  to?: string;
  createdAt: string;
};

export type RevenueDoc = {
  _id: string;
  carId: string;
  date: string;
  amount: number;
  route?: string;
  note?: string;
  createdAt: string;
};

const PaymentSchema = new Schema(
  {
    _id: { type: String, required: true },
    carId: { type: String, required: true, index: true },
    date: { type: String, required: true, index: true },
    amount: { type: Number, required: true, min: 0 },
    method: { type: String, enum: ['cash', 'qr_banking'], required: true },
    note: { type: String },
    createdAt: { type: String, required: true },
  },
  { versionKey: false }
);

export type PaymentDoc = {
  _id: string;
  carId: string;
  date: string;
  amount: number;
  method: 'cash' | 'qr_banking';
  note?: string;
  createdAt: string;
};

export const UserModel = models.User || model('User', UserSchema);
export const CarModel = models.Car || model('Car', CarSchema);
export const RevenueModel = models.Revenue || model('Revenue', RevenueSchema);
export const PaymentModel = models.Payment || model('Payment', PaymentSchema);
