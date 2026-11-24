import { Navigate, useLocation } from "react-router-dom";
import useAuth from "./useAuth";

// Membungkus rute yang butuh login.
// - loading: tampilkan "Memuat…" (jangan redirect dulu, supaya refresh tidak melempar
//   pengguna yang sebenarnya masih punya sesi).
// - belum login: arahkan ke /masuk dan simpan halaman tujuan (string) di state.from,
//   sesuai yang dibaca LoginPage dan RegisterPage.
export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <p role="status">Memuat…</p>;
  }

  if (!user) {
    return <Navigate to="/masuk" replace state={{ from: location.pathname + location.search }} />;
  }

  return children;
}
