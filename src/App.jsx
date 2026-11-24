import { Routes, Route, NavLink, useNavigate } from "react-router-dom";
import PlantListContainer from "./features/catalog/PlantListContainer";
import PlantDetail from "./PlantDetail";
import CollectionContainer from "./features/collection/CollectionContainer";
import LoginPage from "./features/auth/LoginPage";
import RegisterPage from "./features/auth/RegisterPage";
import ProtectedRoute from "./features/auth/ProtectedRoute";
import useAuth from "./features/auth/useAuth";
import "./theme.css";

function App() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  // Pindah ke katalog dulu, supaya pengguna yang sedang di /koleksi
  // tidak dilempar ke halaman masuk oleh ProtectedRoute saat sesi dihapus.
  async function handleLogout() {
    navigate("/");
    try {
      await logout();
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <>
      <header className="site-header">
        <NavLink to="/" className="site-header__brand">
          🌿 PlantCare
        </NavLink>
        <nav className="site-header__nav">
          <NavLink to="/" end className="site-header__link">
            Katalog
          </NavLink>
          <NavLink to="/koleksi" className="site-header__link">
            Koleksi Saya
          </NavLink>
          {!loading &&
            (user ? (
              <>
                <span className="site-header__user">{user.name}</span>
                <button type="button" className="site-header__link" onClick={handleLogout}>
                  Keluar
                </button>
              </>
            ) : (
              <NavLink to="/masuk" className="site-header__link">
                Masuk
              </NavLink>
            ))}
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<PlantListContainer />} />
        <Route path="/tanaman/:id" element={<PlantDetail />} />
        <Route
          path="/koleksi"
          element={
            <ProtectedRoute>
              <CollectionContainer />
            </ProtectedRoute>
          }
        />
        <Route path="/masuk" element={<LoginPage />} />
        <Route path="/daftar" element={<RegisterPage />} />
      </Routes>
    </>
  );
}

export default App;
