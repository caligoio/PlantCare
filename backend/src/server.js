import express from "express";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.js";
import plantsRouter from "./routes/plants.js";
import collectionRouter from "./routes/collection.js";
import { initDb } from "../db/init.js";

// Tanpa secret, token tidak bisa dibuat dengan aman. Berhenti lebih awal dengan pesan jelas.
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 16) {
  console.error("JWT_SECRET belum diatur atau terlalu pendek (minimal 16 karakter). Isi di file .env.");
  process.exit(1);
}

const app = express();
app.use(express.json());
app.use(cookieParser());

app.get("/api/health", (req, res) => res.json({ status: "ok" }));
app.use("/api/auth", authRouter);
app.use("/api/plants", plantsRouter);
app.use("/api/collection", collectionRouter);

// Endpoint /api/* yang tidak dikenal
app.use("/api", (req, res) => {
  res.status(404).json({ message: "Endpoint tidak ditemukan" });
});

// Penanganan error terpusat (format sesuai kontrak: { message })
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Terjadi kesalahan pada server" });
});

const PORT = Number(process.env.PORT ?? 3000);

initDb()
  .then(() => {
    app.listen(PORT, () => console.log(`Backend berjalan di port ${PORT}`));
  })
  .catch((error) => {
    console.error("Gagal menyiapkan database:", error);
    process.exit(1);
  });
