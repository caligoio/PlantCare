import { Routes, Route, NavLink } from "react-router-dom";
import PlantListContainer from "./features/catalog/PlantListContainer";
import PlantDetail from "./PlantDetail";
import CollectionContainer from "./features/collection/CollectionContainer";
import "./theme.css";

function App() {
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
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<PlantListContainer />} />
        <Route path="/tanaman/:id" element={<PlantDetail />} />
        <Route path="/koleksi" element={<CollectionContainer />} />
      </Routes>
    </>
  );
}

export default App;
