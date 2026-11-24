import { Router } from "express";
import bcrypt from "bcryptjs";
import { query } from "../db.js";
import { setAuthCookie, clearAuthCookie } from "../auth.js";
import requireAuth from "../middleware/requireAuth.js";

const router = Router();

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function publicUser(row) {
  return { id: row.id, name: row.name, email: row.email };
}

// POST /api/auth/register  body: { name, email, password }
router.post("/register", async (req, res, next) => {
  try {
    const { name, email, password } = req.body ?? {};

    if (typeof name !== "string" || !name.trim() || name.trim().length > 100) {
      return res.status(400).json({ message: "Nama wajib diisi (maksimal 100 karakter)." });
    }
    if (typeof email !== "string" || !EMAIL_RE.test(email.trim()) || email.length > 255) {
      return res.status(400).json({ message: "Format email tidak valid." });
    }
    if (typeof password !== "string" || password.length < 8 || password.length > 72) {
      return res.status(400).json({ message: "Kata sandi harus 8 sampai 72 karakter." });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const passwordHash = await bcrypt.hash(password, 10);

    const { rows } = await query(
      `INSERT INTO users (name, email, password_hash)
       VALUES ($1, $2, $3)
       ON CONFLICT (email) DO NOTHING
       RETURNING id, name, email`,
      [name.trim(), normalizedEmail, passwordHash]
    );
    if (rows.length === 0) {
      return res.status(409).json({ message: "Email sudah terdaftar." });
    }

    setAuthCookie(res, rows[0].id);
    res.status(201).json(publicUser(rows[0]));
  } catch (error) {
    next(error);
  }
});

// POST /api/auth/login  body: { email, password }
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body ?? {};
    if (typeof email !== "string" || typeof password !== "string") {
      return res.status(400).json({ message: "Email dan kata sandi wajib diisi." });
    }

    const { rows } = await query(
      "SELECT id, name, email, password_hash FROM users WHERE email = $1",
      [email.trim().toLowerCase()]
    );
    const user = rows[0];
    // Pesan sama untuk email salah maupun sandi salah, supaya email tidak bisa ditebak
    const ok = user && (await bcrypt.compare(password, user.password_hash));
    if (!ok) {
      return res.status(401).json({ message: "Email atau kata sandi salah." });
    }

    setAuthCookie(res, user.id);
    res.json(publicUser(user));
  } catch (error) {
    next(error);
  }
});

// POST /api/auth/logout
router.post("/logout", (req, res) => {
  clearAuthCookie(res);
  res.status(204).end();
});

// GET /api/auth/me  -> pengguna yang sedang login
router.get("/me", requireAuth, async (req, res, next) => {
  try {
    const { rows } = await query("SELECT id, name, email FROM users WHERE id = $1", [req.user.id]);
    if (rows.length === 0) {
      clearAuthCookie(res);
      return res.status(401).json({ message: "Sesi tidak valid atau sudah berakhir" });
    }
    res.json(publicUser(rows[0]));
  } catch (error) {
    next(error);
  }
});

export default router;