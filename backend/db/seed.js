import { initDb } from "./init.js";
import { pool } from "../src/db.js";

try {
  await initDb();
} finally {
  await pool.end();
}
