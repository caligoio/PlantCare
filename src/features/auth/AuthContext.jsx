import { useCallback, useEffect, useMemo, useState } from "react";
import { AuthContext } from "./useAuth";

const AUTH_URL = "/api/auth";

// Alamat relatif (/api/...) supaya cookie sesi terkirim otomatis.
async function request(path, options = {}) {
  const response = await fetch(`${AUTH_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!response.ok) {
    let message = "Permintaan gagal. Coba lagi.";
    try {
      const body = await response.json();
      if (body.message) message = body.message;
    } catch {
      // body bukan JSON, pakai pesan bawaan
    }
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }

  return response.status === 204 ? null : response.json();
}

// Provider: menyimpan pengguna yang sedang login dan mengecek sesi saat aplikasi dimuat.
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // { id, name, email } atau null
  const [loading, setLoading] = useState(true); // true selama cek sesi pertama

  // Pulihkan sesi: kalau cookie masih berlaku, /me mengembalikan data pengguna.
  useEffect(() => {
    let cancelled = false;

    async function restoreSession() {
      try {
        const current = await request("/me");
        if (!cancelled) setUser(current);
      } catch {
        // 401 (belum login) atau server belum siap: anggap belum login
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    restoreSession();
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (email, password) => {
    const current = await request("/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    setUser(current);
    return current;
  }, []);

  // Setelah daftar berhasil, langsung login supaya pasti ada sesi
  // (berlaku baik backend mengirim cookie saat daftar maupun tidak).
  const register = useCallback(
    async (name, email, password) => {
      await request("/register", {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
      });
      return login(email, password);
    },
    [login]
  );

  const logout = useCallback(async () => {
    try {
      await request("/logout", { method: "POST" });
    } catch (error) {
      // 401 berarti sesi memang sudah habis, tetap anggap sudah keluar
      if (error.status !== 401) throw error;
    }
    setUser(null);
  }, []);

  // Dipakai bagian lain (misalnya useCollection) saat server membalas 401.
  const clearSession = useCallback(() => setUser(null), []);

  const value = useMemo(
    () => ({ user, loading, login, register, logout, clearSession }),
    [user, loading, login, register, logout, clearSession]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
