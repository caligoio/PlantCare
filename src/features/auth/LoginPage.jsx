import { useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import useAuth from "./useAuth"; // milik Orang 2 (AuthContext)
import AuthLayout from "./AuthLayout";

export default function LoginPage() {
  const { user, loading, login } = useAuth();
  const location = useLocation();
  // ProtectedRoute mengirim halaman tujuan lewat state.from (string pathname)
  const from = location.state?.from ?? "/koleksi";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Semua hook di atas; return bersyarat di bawah
  if (loading) {
    return (
      <AuthLayout>
        <p role="status">Memuat…</p>
      </AuthLayout>
    );
  }
  // Sudah login (termasuk setelah login berhasil): langsung ke tujuan
  if (user) return <Navigate to={from} replace />;

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!email.trim()) return setError("Email wajib diisi.");
    if (!password) return setError("Kata sandi wajib diisi.");

    setSubmitting(true);
    try {
      await login(email.trim(), password);
    } catch (err) {
      setError(err.message || "Gagal masuk. Coba lagi.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout
      title="Masuk"
      subtitle="Masuk untuk melihat dan merawat koleksi tanamanmu."
      footer={
        <>
          Belum punya akun? <Link to="/daftar" state={{ from }}>Daftar</Link>
        </>
      }
    >
      <form className="auth__form" onSubmit={handleSubmit} noValidate>
        {error && (
          <p className="auth__error" role="alert">
            {error}
          </p>
        )}

        <div className="auth__field">
          <label htmlFor="login-email">Email</label>
          <input
            id="login-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={submitting}
          />
        </div>

        <div className="auth__field">
          <label htmlFor="login-password">Kata sandi</label>
          <input
            id="login-password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={submitting}
          />
        </div>

        <button type="submit" className="auth__submit" disabled={submitting}>
          {submitting ? "Memproses…" : "Masuk"}
        </button>
      </form>
    </AuthLayout>
  );
}
