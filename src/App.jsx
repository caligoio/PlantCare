

import { Routes, Route } from "react-router-dom";
import PlantListContainer from "./features/catalog/PlantListContainer";
import PlantDetail from "./PlantDetail.jsx";
import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<PlantListContainer />} />
      <Route path="/tanaman/:id" element={<PlantDetail />} />
      <Route path="/koleksi" element={<p>Koleksi (segera hadir)</p>} />
    </Routes>
  );
}

export default App;
