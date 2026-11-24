import jwt from "jsonwebtoken";

export const COOKIE_NAME = "plantcare_token";
const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 hari

// httpOnly: tidak bisa dibaca JavaScript di browser (melindungi dari XSS)
// sameSite lax: cookie tidak dikirim pada request POST dari situs lain (melindungi dari CSRF)
// secure: hanya lewat HTTPS. Di localhost (http) harus false, atur lewat COOKIE_SECURE.
function cookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.COOKIE_SECURE === "true",
    path: "/",
  };
}

export function signToken(userId) {
  return jwt.sign({ sub: String(userId) }, process.env.JWT_SECRET, {
    algorithm: "HS256",
    expiresIn: "7d",
  });
}

// Mengembalikan id pengguna (angka), atau melempar error jika token tidak valid
export function verifyToken(token) {
  const payload = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ["HS256"] });
  const id = Number(payload.sub);
  if (!Number.isInteger(id)) throw new Error("Token tidak valid");
  return id;
}

export function setAuthCookie(res, userId) {
  res.cookie(COOKIE_NAME, signToken(userId), { ...cookieOptions(), maxAge: MAX_AGE_MS });
}

export function clearAuthCookie(res) {
  res.clearCookie(COOKIE_NAME, cookieOptions());
}
