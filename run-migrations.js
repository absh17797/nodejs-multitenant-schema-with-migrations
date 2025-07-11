require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');

const direction = process.argv[2] || 'up'; // default is 'up'

async function runMigrations() {
  const tenants = process.env.TENANTS.split(',');
  const baseUri = process.env.MONGO_URI;
  const baseDb = process.env.BASE_DB_NAME;
  const migrationDir = path.join(__dirname, 'migrations');

  for (const tenant of tenants) {
    const dbName = `${baseDb}_${tenant.trim()}`; // e.g., vms_google
    const mongoURI = `${baseUri}/${dbName}`;
    const client = new MongoClient(mongoURI);
    await client.connect();
    const db = client.db(dbName);

    const migrationsCollection = db.collection('migrations');
console.log("direction ==>",direction)
    if (direction === 'up') {
      const migrationFiles = fs.readdirSync(migrationDir).sort();
      const applied = await migrationsCollection.find().toArray();
      const appliedVersions = applied.map(m => m.version);

      for (const file of migrationFiles) {
        const version = file.split('_')[0];
        if (appliedVersions.includes(version)) {
          console.log(`[${tenant}] Skipping: ${file}`);
          continue;
        }

        const migration = require(path.join(migrationDir, file));
        try {
          await migration.up(db);
          await migrationsCollection.insertOne({ version, appliedAt: new Date() });
          console.log(`[${tenant}] ✅ Applied: ${file}`);
        } catch (err) {
          console.error(`[${tenant}] ❌ Error in: ${file}`, err);
          process.exit(1);
        }
      }
    }

    if (direction === 'down') {
      const last = await migrationsCollection.find().sort({ appliedAt: -1 }).limit(1).toArray();
      if (!last.length) {
        console.log(`[${tenant}] No migrations to roll back.`);
        await client.close();
        continue;
      }

      const { version } = last[0];
      const file = fs.readdirSync(migrationDir).find(f => f.startsWith(version));
      if (!file) {
        console.warn(`[${tenant}] ⚠️ Migration file not found for version ${version}`);
        await client.close();
        continue;
      }

      const migration = require(path.join(migrationDir, file));
      if (typeof migration.down !== 'function') {
        console.warn(`[${tenant}] ⚠️ No down() function for ${file}`);
        await client.close();
        continue;
      }

      try {
        await migration.down(db);
        await migrationsCollection.deleteOne({ version });
        console.log(`[${tenant}] 🔄 Rolled back: ${file}`);
      } catch (err) {
        console.error(`[${tenant}] ❌ Rollback failed: ${file}`, err);
        process.exit(1);
      }
    }

    await client.close();
  }
}

runMigrations();
