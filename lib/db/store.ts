import { hashPassword } from '@/lib/auth';
import type {
  AppDatabase,
  DailyRevenue,
  FleetCar,
  MonthlyCarTotal,
  Payment,
  PaymentMethod,
  User,
  UserRole,
} from '@/lib/types';
import { connectMongo } from './mongodb';
import { CarModel, PaymentModel, RevenueModel, UserModel } from './models';


function seedCars(): FleetCar[] {
  const routes = [
    ['Dang', 'Kathmandu'],
    ['Dang', 'Pokhara'],
    ['Dang', 'Butwal'],
    ['Dang', 'Nepalgunj'],
    ['Dang', 'Chitwan'],
    ['Dang', 'Biratnagar'],
    ['Dang', 'Hetauda'],
    ['Dang', 'Surkhet'],
    ['Dang', 'Gorkha'],
    ['Dang', 'Bhairahawa'],
  ] as const;

  const plates = [
    'Ba 2 Cha 1234',
    'Ba 2 Cha 2345',
    'Ba 2 Cha 3456',
    'Ra 1 Cha 4567',
    'Ra 1 Cha 5678',
    'Ba 3 Cha 6789',
    'Ba 3 Cha 7890',
    'Ra 2 Cha 8901',
    'Ba 2 Cha 9012',
    'Ra 1 Cha 0123',
  ];

  return plates.map((carNumber, index) => ({
    id: `car-${index + 1}`,
    carNumber,
    from: routes[index][0],
    to: routes[index][1],
    createdAt: new Date().toISOString(),
  }));
}

function seedUsers(): User[] {
  return [
    {
      id: 'u-admin',
      name: 'Portal Admin',
      email: 'admin@ghorahiedrive.com',
      passwordHash: hashPassword('Goal1L'),
      role: 'admin',
    },
    {
      id: 'u-pujan',
      name: 'Pujan',
      email: 'pujan@dangedrive.com',
      passwordHash: hashPassword('pujan@123'),
      role: 'admin',
  },
    {
      id: 'u-share-1',
      name: 'Shareholder One',
      email: 'shareholder@ghorahiedrive.com',
      passwordHash: hashPassword('Target$2L'),
      role: 'shareholder',
    },
  ];
}

async function seedIfEmpty(): Promise<void> {
  const userCount = await UserModel.countDocuments();
  if (userCount > 0) return;

  const users = seedUsers();
  const cars = seedCars();

  await UserModel.insertMany(
    users.map((u) => ({
      _id: u.id,
      name: u.name,
      email: u.email,
      passwordHash: u.passwordHash,
      role: u.role,
    }))
  );

  await CarModel.insertMany(
    cars.map((c) => ({
      _id: c.id,
      carNumber: c.carNumber,
      from: c.from,
      to: c.to,
      createdAt: c.createdAt,
    }))
  );
}

function mapUser(u: { _id: unknown; name: string; email: string; passwordHash: string; role: UserRole }): User {
  return {
    id: String(u._id),
    name: u.name,
    email: u.email,
    passwordHash: u.passwordHash,
    role: u.role,
  };
}

function mapCar(c: {
  _id: unknown;
  carNumber: string;
  from?: string;
  to?: string;
  createdAt: string;
}): FleetCar {
  return {
    id: String(c._id),
    carNumber: c.carNumber,
    from: c.from ?? '',
    to: c.to ?? '',
    createdAt: c.createdAt,
  };
}

function mapRevenue(r: {
  _id: unknown;
  carId: string;
  date: string;
  amount: number;
  route?: string;
  note?: string;
  createdAt: string;
}): DailyRevenue {
  return {
    id: String(r._id),
    carId: r.carId,
    date: r.date,
    amount: r.amount,
    route: r.route,
    note: r.note,
    createdAt: r.createdAt,
  };
}

export async function readDb(): Promise<AppDatabase> {
  await connectMongo();
  await seedIfEmpty();

  const [users, cars, revenues] = await Promise.all([
    UserModel.find().lean(),
    CarModel.find().lean(),
    RevenueModel.find().lean(),
  ]);

  return {
    users: users.map(mapUser),
    cars: cars.map(mapCar),
    revenues: revenues.map(mapRevenue),
  };
}

/** @deprecated Do not use — wiped all collections. Kept only to catch accidental imports. */
export async function writeDb(_db: AppDatabase): Promise<void> {
  throw new Error(
    'writeDb() is disabled. Use atomic helpers (createCar, upsertRevenue, etc.) so other cars are not wiped.'
  );
}

// ---------- Cars (atomic) ----------

export async function listCars(): Promise<FleetCar[]> {
  await connectMongo();
  await seedIfEmpty();
  const cars = await CarModel.find().sort({ createdAt: 1 }).lean();
  return cars.map(mapCar);
}

export async function findCarById(id: string): Promise<FleetCar | null> {
  await connectMongo();
  const car = await CarModel.findById(id).lean();
  return car ? mapCar(car) : null;
}

export async function createCar(input: {
  carNumber: string;
  from: string;
  to: string;
}): Promise<FleetCar> {
  await connectMongo();
  const exists = await CarModel.findOne({
    carNumber: new RegExp(`^${escapeRegex(input.carNumber)}$`, 'i'),
  }).lean();
  if (exists) throw new ConflictError('This car number already exists.');

  const car: FleetCar = {
    id: `car-${Date.now()}`,
    carNumber: input.carNumber.trim(),
    from: input.from.trim(),
    to: input.to.trim(),
    createdAt: new Date().toISOString(),
  };

  await CarModel.create({
    _id: car.id,
    carNumber: car.carNumber,
    from: car.from,
    to: car.to,
    createdAt: car.createdAt,
  });

  return car;
}

export async function updateCar(
  id: string,
  input: { carNumber: string; from: string; to: string }
): Promise<FleetCar> {
  await connectMongo();
  const car = await CarModel.findById(id);
  if (!car) throw new NotFoundError('Car not found.');

  const duplicate = await CarModel.findOne({
    _id: { $ne: id },
    carNumber: new RegExp(`^${escapeRegex(input.carNumber)}$`, 'i'),
  }).lean();
  if (duplicate) throw new ConflictError('This car number already exists.');

  car.carNumber = input.carNumber.trim();
  car.from = input.from.trim();
  car.to = input.to.trim();
  await car.save();

  return mapCar(car.toObject());
}

export async function deleteCar(id: string): Promise<void> {
  await connectMongo();
  const result = await CarModel.deleteOne({ _id: id });
  if (result.deletedCount === 0) throw new NotFoundError('Car not found.');
  // Only remove revenues for THIS car
  await RevenueModel.deleteMany({ carId: id });
}

// ---------- Revenue (atomic, per car) ----------

export async function listRevenues(filters?: {
  carId?: string;
  month?: string;
}): Promise<DailyRevenue[]> {
  await connectMongo();
  await seedIfEmpty();

  const query: Record<string, unknown> = {};
  if (filters?.carId) query.carId = filters.carId;
  if (filters?.month) query.date = { $regex: `^${escapeRegex(filters.month)}` };

  const rows = await RevenueModel.find(query).sort({ date: -1, createdAt: -1 }).lean();
  return rows.map(mapRevenue);
}

export async function upsertRevenue(input: {
  carId: string;
  date: string;
  amount: number;
  route?: string;
  note?: string;
}): Promise<DailyRevenue> {
  await connectMongo();

  const carId = String(input.carId || '').trim();
  const date = String(input.date || '').trim();
  const amount = Number(input.amount);
  const route = input.route ? String(input.route).trim() : undefined;
  const note = input.note ? String(input.note).trim() : undefined;

  if (!carId || !date || !Number.isFinite(amount) || amount < 0) {
    throw new BadRequestError('Car, date, and a valid amount are required.');
  }

  const car = await CarModel.findById(carId).lean();
  if (!car) throw new NotFoundError('Car not found.');

  // Atomic per-car upsert — never deletes other cars' revenue
  const newId = `rev-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const createdAt = new Date().toISOString();

  const doc = await RevenueModel.findOneAndUpdate(
    { carId, date },
    {
      $set: {
        amount,
        route,
        note,
      },
      $setOnInsert: {
        _id: newId,
        carId,
        date,
        createdAt,
      },
    },
    {
      upsert: true,
      returnDocument: 'after',
      setDefaultsOnInsert: true,
    }
  ).lean();

  if (!doc) throw new Error('Failed to save revenue.');

  console.log('[upsertRevenue]', {
    carId: doc.carId,
    date: doc.date,
    amount: doc.amount,
    id: String(doc._id),
  });

  return mapRevenue(doc);
}

export async function createRevenue(input: {
  carId: string;
  date: string;
  amount: number;
  route?: string;
  note?: string;
}): Promise<DailyRevenue> {
  await connectMongo();

  const carId = String(input.carId || '').trim();
  const date = String(input.date || '').trim();
  const amount = Number(input.amount);
  const route = input.route ? String(input.route).trim() : undefined;
  const note = input.note ? String(input.note).trim() : undefined;

  if (!carId || !date || !Number.isFinite(amount) || amount < 0) {
    throw new BadRequestError('Car, date, and a valid amount are required.');
  }

  const car = await CarModel.findById(carId).lean();
  if (!car) throw new NotFoundError('Car not found.');

  const newId = `rev-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const createdAt = new Date().toISOString();

  const doc = await RevenueModel.create({
    _id: newId,
    carId,
    date,
    amount,
    route,
    note,
    createdAt,
  });

  console.log('[createRevenue]', { carId, date, amount, id: newId });

  return mapRevenue(doc.toObject());
}


export async function updateRevenue(
  id: string,
  input: { amount: number; carId?: string; route?: string; note?: string; date?: string }
): Promise<DailyRevenue> {
  await connectMongo();
  const row = await RevenueModel.findById(id);
  if (!row) throw new NotFoundError('Revenue entry not found.');

  const newCarId = input.carId ?? row.carId;
  const newDate = input.date ?? row.date;

  // Only run the clash check if carId or date is actually changing
  const carIdChanged = input.carId !== undefined && input.carId !== row.carId;
  const dateChanged = input.date !== undefined && input.date !== row.date;

  console.log('[updateRevenue] id:', id, '| row.date:', row.date, '| input.date:', input.date, '| dateChanged:', dateChanged, '| row.carId:', row.carId, '| input.carId:', input.carId, '| carIdChanged:', carIdChanged);

  if (carIdChanged || dateChanged) {
    const clash = await RevenueModel.findOne({
      _id: { $ne: id },
      carId: newCarId,
      date: newDate,
    }).lean();
    console.log('[updateRevenue] clash check => clash found:', !!clash);
    if (clash) {
      throw new ConflictError('This car already has revenue for that date.');
    }
  }

  if (carIdChanged) row.carId = input.carId!;
  if (dateChanged) row.date = input.date!;
  row.amount = input.amount;
  if (input.route !== undefined) row.route = input.route;
  if (input.note !== undefined) row.note = input.note;
  await row.save();

  return mapRevenue(row.toObject());
}

export async function deleteRevenue(id: string): Promise<void> {
  await connectMongo();
  const result = await RevenueModel.deleteOne({ _id: id });
  if (result.deletedCount === 0) throw new NotFoundError('Revenue entry not found.');
}

// ---------- Users (atomic) ----------

export async function listUsers(): Promise<User[]> {
  await connectMongo();
  await seedIfEmpty();
  const users = await UserModel.find().lean();
  return users.map(mapUser);
}

export async function findUserByEmail(email: string): Promise<User | null> {
  await connectMongo();
  await seedIfEmpty();
  const user = await UserModel.findOne({ email: email.toLowerCase() }).lean();
  return user ? mapUser(user) : null;
}

export async function createUser(input: {
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
}): Promise<User> {
  await connectMongo();
  const exists = await UserModel.findOne({ email: input.email.toLowerCase() }).lean();
  if (exists) throw new ConflictError('Email already registered.');

  const user: User = {
    id: `u-${Date.now()}`,
    name: input.name.trim(),
    email: input.email.toLowerCase().trim(),
    passwordHash: input.passwordHash,
    role: input.role,
  };

  await UserModel.create({
    _id: user.id,
    name: user.name,
    email: user.email,
    passwordHash: user.passwordHash,
    role: user.role,
  });

  return user;
}

export async function updateUser(
  id: string,
  input: { name?: string; passwordHash?: string }
): Promise<User> {
  await connectMongo();
  const user = await UserModel.findById(id);
  if (!user) throw new NotFoundError('User not found.');

  if (input.name) user.name = input.name.trim();
  if (input.passwordHash) user.passwordHash = input.passwordHash;
  await user.save();

  return mapUser(user.toObject());
}

export async function deleteUser(id: string, actorId: string): Promise<void> {
  await connectMongo();
  if (id === actorId) throw new BadRequestError('You cannot delete your own account.');

  const target = await UserModel.findById(id).lean();
  if (!target) throw new NotFoundError('User not found.');

  if (target.role === 'admin') {
    const adminCount = await UserModel.countDocuments({ role: 'admin' });
    if (adminCount <= 1) throw new BadRequestError('Cannot delete the last admin.');
  }

  await UserModel.deleteOne({ _id: id });
}

export function getMonthlyTotals(
  cars: FleetCar[],
  revenues: DailyRevenue[],
  year: number,
  month: number
): MonthlyCarTotal[] {
  const prefix = `${year}-${String(month).padStart(2, '0')}`;

  return cars.map((car) => {
    const monthRows = revenues.filter(
      (r) => r.carId === car.id && r.date.startsWith(prefix)
    );
    return {
      carId: car.id,
      carNumber: car.carNumber,
      from: car.from,
      to: car.to,
      totalAmount: monthRows.reduce((sum, r) => sum + r.amount, 0),
      daysLogged: monthRows.length,
    };
  });
}

export async function getMonthlyReport(year: number, month: number) {
  const [cars, revenues] = await Promise.all([listCars(), listRevenues()]);
  const totals = getMonthlyTotals(cars, revenues, year, month);
  const grandTotal = totals.reduce((sum, row) => sum + row.totalAmount, 0);
  return { year, month, totals, grandTotal };
}

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export class NotFoundError extends Error {
  status = 404;
}
export class ConflictError extends Error {
  status = 409;
}
export class BadRequestError extends Error {
  status = 400;
}

export function isStoreError(
  error: unknown
): error is NotFoundError | ConflictError | BadRequestError {
  return (
    error instanceof NotFoundError ||
    error instanceof ConflictError ||
    error instanceof BadRequestError
  );
}

// ---------- Payments (atomic) ----------

function mapPayment(p: {
  _id: unknown;
  carId: string;
  date: string;
  amount: number;
  method: 'cash' | 'qr_banking';
  note?: string;
  createdAt: string;
}): Payment {
  return {
    id: String(p._id),
    carId: p.carId,
    date: p.date,
    amount: p.amount,
    method: p.method,
    note: p.note,
    createdAt: p.createdAt,
  };
}

export async function listPayments(filters?: {
  method?: PaymentMethod;
  date?: string;
}): Promise<Payment[]> {
  await connectMongo();
  const query: Record<string, unknown> = {};
  if (filters?.method) query.method = filters.method;
  if (filters?.date) query.date = filters.date;
  const rows = await PaymentModel.find(query).sort({ date: -1, createdAt: -1 }).lean();
  return rows.map(mapPayment);
}

export async function createPayment(input: {
  carId: string;
  date: string;
  amount: number;
  method: PaymentMethod;
  note?: string;
}): Promise<Payment> {
  await connectMongo();

  const carId = String(input.carId || '').trim();
  const date = String(input.date || '').trim();
  const amount = Number(input.amount);
  const method = input.method;
  const note = input.note ? String(input.note).trim() : undefined;

  if (!carId || !date || !Number.isFinite(amount) || amount < 0) {
    throw new BadRequestError('Car, date, and a valid amount are required.');
  }
  if (!['cash', 'qr_banking'].includes(method)) {
    throw new BadRequestError('Method must be cash or qr_banking.');
  }

  const car = await CarModel.findById(carId).lean();
  if (!car) throw new NotFoundError('Car not found.');

  const newId = `pay-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const createdAt = new Date().toISOString();

  const doc = await PaymentModel.create({
    _id: newId,
    carId,
    date,
    amount,
    method,
    note,
    createdAt,
  });

  return mapPayment(doc.toObject());
}

export async function deletePayment(id: string): Promise<void> {
  await connectMongo();
  const result = await PaymentModel.deleteOne({ _id: id });
  if (result.deletedCount === 0) throw new NotFoundError('Payment record not found.');
}

export async function updatePayment(
  id: string,
  input: { carId?: string; date?: string; amount?: number; method?: PaymentMethod; note?: string }
): Promise<Payment> {
  await connectMongo();
  const row = await PaymentModel.findById(id);
  if (!row) throw new NotFoundError('Payment record not found.');

  if (input.carId !== undefined) {
    const car = await CarModel.findById(input.carId).lean();
    if (!car) throw new NotFoundError('Car not found.');
    row.carId = input.carId;
  }
  if (input.date !== undefined) row.date = input.date;
  if (input.amount !== undefined) {
    if (!Number.isFinite(input.amount) || input.amount < 0)
      throw new BadRequestError('Amount must be a non-negative number.');
    row.amount = input.amount;
  }
  if (input.method !== undefined) {
    if (!['cash', 'qr_banking'].includes(input.method))
      throw new BadRequestError('Method must be cash or qr_banking.');
    row.method = input.method;
  }
  if (input.note !== undefined) row.note = input.note;

  await row.save();
  return mapPayment(row.toObject());
}
