import { Router } from "express";
import { query } from "../db.js";

const router = Router();

// snake_case di database -> camelCase di JSON (sesuai kontrak API)
const COLUMNS = `id, name, emoji, description, light, care,
                 watering_interval_days AS "wateringIntervalDays"`;

// GET /api/plants
router.get("/", async (req, res, next) => {
  try {
    const { rows } = await query(`SELECT ${COLUMNS} FROM plants ORDER BY id`);
    res.json(rows);
  } catch (error) {
    next(error);
  }
});

// GET /api/plants/:id
router.get("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(404).json({ message: "Tanaman tidak ditemukan" });
    }
    const { rows } = await query(`SELECT ${COLUMNS} FROM plants WHERE id = $1`, [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Tanaman tidak ditemukan" });
    }
    res.json(rows[0]);
  } catch (error) {
    next(error);
  }
});

export default router;
