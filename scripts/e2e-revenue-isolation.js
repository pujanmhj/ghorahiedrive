const mongoose = require('mongoose');

(async () => {
  await mongoose.connect(process.env.MONGODB_URI.trim(), {
    dbName: process.env.MONGODB_DB || 'dangedrive',
  });
  const db = mongoose.connection.db;
  const cars = await db.collection('cars').find({}).project({ _id: 1, carNumber: 1 }).toArray();
  console.log('cars', cars.length);
  if (cars.length < 2) throw new Error('Need at least 2 cars');

  const date = '2026-08-05';
  await db.collection('revenues').deleteMany({ note: 'e2e-test' });

  const c1 = cars[0]._id;
  const c2 = cars[1]._id;

  await db.collection('revenues').insertOne({
    _id: 'rev-e2e-1',
    carId: c1,
    date,
    amount: 1111,
    note: 'e2e-test',
    createdAt: new Date().toISOString(),
  });
  await db.collection('revenues').insertOne({
    _id: 'rev-e2e-2',
    carId: c2,
    date,
    amount: 2222,
    note: 'e2e-test',
    createdAt: new Date().toISOString(),
  });

  // Atomic update for car1 only (new behavior)
  await db.collection('revenues').updateOne(
    { carId: c1, date },
    { $set: { amount: 3333 } }
  );

  const all = await db.collection('revenues').find({ date, note: 'e2e-test' }).toArray();
  console.log(
    'after update car1:',
    all.map((r) => ({ carId: r.carId, amount: r.amount }))
  );

  const hasBoth =
    all.length === 2 &&
    all.some((r) => r.carId === c1 && r.amount === 3333) &&
    all.some((r) => r.carId === c2 && r.amount === 2222);

  if (!hasBoth) throw new Error('FAIL: other car revenue was lost');
  console.log('PASS: both cars keep separate revenue');

  await db.collection('revenues').deleteMany({ note: 'e2e-test' });
  await mongoose.disconnect();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
