import { useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import useAuth from "./useAuth"; // milik Orang 2 (AuthContext)
import AuthLayout from "./AuthLayout";

export default function RegisterPage() {
  const { user, loading, register } = useAuth();
  const location = useLocation();
  const from = location.state?.from ?? "/koleksi";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (loading) {
    return (
      <AuthLayout>
        <p role="status">Memuat…</p>
      </AuthLayout>
    );
  }
  if (user) return <Navigate to={from} replace />;

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!name.trim()) return setError("Nama wajib diisi.");
    if (!email.trim()) return setError("Email wajib diisi.");
    if (password.length < 8) return setError("Kata sandi minimal 8 karakter.");
    if (password !== confirm) return setError("Konfirmasi kata sandi tidak sama.");

    setSubmitting(true);
    try {
      await register(name.trim(), email.trim(), password);
    } catch (err) {
      setError(err.message || "Gagal mendaftar. Coba lagi.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout
      title="Buat akun"
      subtitle="Simpan koleksi tanamanmu dan dapatkan pengingat jadwal siram."
      footer={
        <>
          Sudah punya akun? <Link to="/masuk" state={{ from }}>Masuk</Link>
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
          <label htmlFor="register-name">Nama</label>
          <input
            id="register-name"
            type="text"
            autoComplete="name"
            maxLength={100}
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={submitting}
          />
        </div>

        <div className="auth__field">
          <label htmlFor="register-email">Email</label>
          <input
            id="register-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={submitting}
          />
        </div>

        <div className="auth__field">
          <label htmlFor="register-password">Kata sandi</label>
          <input
            id="register-password"
            type="password"
            autoComplete="new-password"
            maxLength={72}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={submitting}
          />
          <span className="auth__hint">Minimal 8 karakter.</span>
        </div>

        <div className="auth__field">
          <label htmlFor="register-confirm">Ulangi kata sandi</label>
          <input
            id="register-confirm"
            type="password"
            autoComplete="new-password"
            maxLength={72}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            disabled={submitting}
          />
        </div>

        <button type="submit" className="auth__submit" disabled={submitting}>
          {submitting ? "Memproses…" : "Daftar"}
        </button>
      </form>
    </AuthLayout>
  );
}
