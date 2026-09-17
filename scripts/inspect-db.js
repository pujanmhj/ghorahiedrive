const mongoose = require('mongoose');

(async () => {
  await mongoose.connect(process.env.MONGODB_URI.trim(), {
    dbName: process.env.MONGODB_DB || 'dangedrive',
  });
  const db = mongoose.connection.db;

  const cols = await db.listCollections().toArray();
  console.log('collections:', cols.map((c) => c.name));

  const cars = await db.collection('cars').find({}).toArray();
  console.log('cars count:', cars.length);
  console.log(
    'cars:',
    cars.map((c) => ({ id: c._id, no: c.carNumber }))
  );

  const revenues = await db.collection('revenues').find({}).toArray();
  console.log('revenues count:', revenues.length);
  console.log(
    'revenues:',
    revenues.map((r) => ({ id: r._id, carId: r.carId, date: r.date, amount: r.amount }))
  );

  const indexes = await db.collection('revenues').indexes();
  console.log('revenue indexes:', JSON.stringify(indexes, null, 2));

  await mongoose.disconnect();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
