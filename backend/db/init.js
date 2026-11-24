import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { pool } from "../src/db.js";
import { plants } from "./plants.seed.js";

const dir = path.dirname(fileURLToPath(import.meta.url));

async function seedPlants(client) {
  for (const p of plants) {
    await client.query(
      `INSERT INTO plants (id, name, emoji, description, light, care, watering_interval_days)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (id) DO UPDATE SET
         name = EXCLUDED.name,
         emoji = EXCLUDED.emoji,
         description = EXCLUDED.description,
         light = EXCLUDED.light,
         care = EXCLUDED.care,
         watering_interval_days = EXCLUDED.watering_interval_days`,
      [p.id, p.name, p.emoji, p.description, p.light, p.care, p.wateringIntervalDays]
    );
  }
  // Karena id diisi manual, geser sequence agar insert berikutnya tidak bentrok
  await client.query(
    `SELECT setval(pg_get_serial_sequence('plants', 'id'), (SELECT MAX(id) FROM plants))`
  );
}

// Membuat tabel dan mengisi data awal. Aman dijalankan berulang kali.
// Mencoba ulang beberapa kali karena database kadang belum siap saat container baru menyala.
export async function initDb({ retries = 10, delayMs = 2000 } = {}) {
  const schema = await readFile(path.join(dir, "schema.sql"), "utf8");

  for (let attempt = 1; ; attempt++) {
    try {
      const client = await pool.connect();
      try {
        await client.query("BEGIN");
        await client.query(schema);
        await seedPlants(client);
        await client.query("COMMIT");
      } catch (error) {
        await client.query("ROLLBACK");
        throw error;
      } finally {
        client.release();
      }
      console.log("Database siap (tabel dan data awal terpasang).");
      return;
    } catch (error) {
      if (attempt >= retries) throw error;
      console.log(`Database belum siap (percobaan ${attempt}/${retries}), mencoba lagi...`);
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
}
