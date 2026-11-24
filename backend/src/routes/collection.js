import { Router } from "express";

const router = Router();

// TODO (Orang 2): implementasi sesuai kontrak API
//   GET    /api/collection
//   POST   /api/collection
//   PATCH  /api/collection/:id/water
//   PATCH  /api/collection/:id
//   DELETE /api/collection/:id
router.use((req, res) => {
  res.status(501).json({ message: "Endpoint koleksi belum diimplementasikan" });
});

export default router;
