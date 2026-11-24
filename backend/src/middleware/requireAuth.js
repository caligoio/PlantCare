import { COOKIE_NAME, verifyToken } from "../auth.js";

// Pasang di route yang butuh login. Setelah lolos, id pengguna ada di req.user.id
export default function requireAuth(req, res, next) {
  const token = req.cookies?.[COOKIE_NAME];
  if (!token) {
    return res.status(401).json({ message: "Silakan masuk terlebih dahulu" });
  }
  try {
    req.user = { id: verifyToken(token) };
    next();
  } catch {
    res.status(401).json({ message: "Sesi tidak valid atau sudah berakhir" });
  }
}
