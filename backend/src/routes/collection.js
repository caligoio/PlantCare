import { Router } from "express";
import { pool } from "../db.js";
import requireAuth from "../middleware/requireAuth.js";

const router = Router();

// Every collection route requires login (401 otherwise)
router.use(requireAuth);

// Kolom dikembalikan sesuai kontrak: camelCase, tanggal sebagai string YYYY-MM-DD.
// to_char dipakai supaya tanggal tidak bergeser satu hari karena zona waktu.
const COLUMNS = `
  id,
  plant_id AS "plantId",
  nickname,
  to_char(last_watered, 'YYYY-MM-DD') AS "lastWatered"
`;

function isValidDate(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}

function isPositiveInt(value) {
  return Number.isInteger(value) && value > 0;
}

// Kolom nickname di schema NOT NULL DEFAULT '', jadi nilai kosong disimpan sebagai "".
function cleanNickname(value) {
  if (value === undefined || value === null) return { ok: true, value: "" };
  if (typeof value !== "string") return { ok: false };
  const trimmed = value.trim();
  if (trimmed.length > 100) return { ok: false };
  return { ok: true, value: trimmed };
}

function parseId(req, res) {
  const id = Number(req.params.id);
  if (!isPositiveInt(id)) {
    res.status(400).json({ message: "ID koleksi tidak valid." });
    return null;
  }
  return id;
}

function serverError(res, err) {
  console.error(err);
  res.status(500).json({ message: "Terjadi kesalahan pada server." });
}

// GET /api/collection  -> hanya koleksi milik pengguna yang login
router.get("/", async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT ${COLUMNS} FROM collection
       WHERE user_id = $1
       ORDER BY created_at DESC, id DESC`,
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    serverError(res, err);
  }
});

// POST /api/collection  body: { plantId, nickname?, lastWatered }
router.post("/", async (req, res) => {
  try {
    const { plantId, nickname, lastWatered } = req.body ?? {};

    if (!isPositiveInt(plantId)) {
      return res.status(400).json({ message: "plantId wajib berupa angka bulat positif." });
    }
    if (!isValidDate(lastWatered)) {
      return res.status(400).json({ message: "lastWatered wajib berformat YYYY-MM-DD." });
    }
    const nick = cleanNickname(nickname);
    if (!nick.ok) {
      return res.status(400).json({ message: "nickname harus teks maksimal 100 karakter." });
    }

    const plant = await pool.query("SELECT 1 FROM plants WHERE id = $1", [plantId]);
    if (plant.rowCount === 0) {
      return res.status(404).json({ message: "Tanaman dengan plantId tersebut tidak ditemukan." });
    }

    const { rows } = await pool.query(
      `INSERT INTO collection (plant_id, nickname, last_watered, user_id)
       VALUES ($1, $2, $3, $4)
       RETURNING ${COLUMNS}`,
      [plantId, nick.value, lastWatered, req.user.id]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    serverError(res, err);
  }
});

// PATCH /api/collection/:id/water  body: { lastWatered }
router.patch("/:id/water", async (req, res) => {
  try {
    const id = parseId(req, res);
    if (id === null) return;

    const { lastWatered } = req.body ?? {};
    if (!isValidDate(lastWatered)) {
      return res.status(400).json({ message: "lastWatered wajib berformat YYYY-MM-DD." });
    }

    const { rows } = await pool.query(
      `UPDATE collection SET last_watered = $1
       WHERE id = $2 AND user_id = $3
       RETURNING ${COLUMNS}`,
      [lastWatered, id, req.user.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "Item koleksi tidak ditemukan." });
    }
    res.json(rows[0]);
  } catch (err) {
    serverError(res, err);
  }
});

// PATCH /api/collection/:id  body: { nickname }
router.patch("/:id", async (req, res) => {
  try {
    const id = parseId(req, res);
    if (id === null) return;

    const nick = cleanNickname(req.body?.nickname);
    if (!nick.ok) {
      return res.status(400).json({ message: "nickname harus teks maksimal 100 karakter." });
    }

    const { rows } = await pool.query(
      `UPDATE collection SET nickname = $1
       WHERE id = $2 AND user_id = $3
       RETURNING ${COLUMNS}`,
      [nick.value, id, req.user.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "Item koleksi tidak ditemukan." });
    }
    res.json(rows[0]);
  } catch (err) {
    serverError(res, err);
  }
});

// DELETE /api/collection/:id
router.delete("/:id", async (req, res) => {
  try {
    const id = parseId(req, res);
    if (id === null) return;

    const result = await pool.query(
      "DELETE FROM collection WHERE id = $1 AND user_id = $2",
      [id, req.user.id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Item koleksi tidak ditemukan." });
    }
    res.status(204).end();
  } catch (err) {
    serverError(res, err);
  }
});

export default router;