/**
 * One-time script to drop the unique { carId, date } index from the revenues collection.
 * Run locally:     node scripts/drop-revenue-index.js
 * Run production:  MONGODB_URI="your-prod-uri" node scripts/drop-revenue-index.js
 */

const { MongoClient } = require('mongodb');
const path = require('path');

// Load .env.local for local runs (ignored if env var already set)
try {
  require('dotenv').config({ path: path.join(__dirname, '../.env.local') });
} catch (_) {}

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error('❌  MONGODB_URI is not set.');
  process.exit(1);
}

(async () => {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db();

    // List existing indexes so user can see what's there
    const indexes = await db.collection('revenues').indexes();
    console.log('\nCurrent indexes on revenues:');
    indexes.forEach((idx) => console.log(' -', idx.name, JSON.stringify(idx.key)));

    // Drop the unique compound index
    try {
      await db.collection('revenues').dropIndex('carId_1_date_1');
      console.log('\n✅  Index "carId_1_date_1" dropped successfully!');
    } catch (e) {
      if (e.codeName === 'IndexNotFound') {
        console.log('\n✅  Index not found — already dropped or never existed.');
      } else {
        throw e;
      }
    }
  } finally {
    await client.close();
  }
})();
