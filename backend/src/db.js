import pg from "pg";

const { Pool, types } = pg;

// Kolom DATE (OID 1082) dikembalikan sebagai string "YYYY-MM-DD", bukan objek Date.
// Tanpa ini, tanggal bisa bergeser satu hari saat diubah ke JSON karena zona waktu.
types.setTypeParser(1082, (value) => value);

export const pool = new Pool({
  host: process.env.DB_HOST ?? "localhost",
  port: Number(process.env.DB_PORT ?? 5432),
  user: process.env.DB_USER ?? "plantcare",
  password: process.env.DB_PASSWORD ?? "plantcare_pass",
  database: process.env.DB_NAME ?? "plantcare",
});

export const query = (text, params) => pool.query(text, params);
