

import { Routes, Route } from "react-router-dom";
import PlantListContainer from "./features/catalog/PlantListContainer";
import PlantDetail from "./PlantDetail.jsx";
import CollectionContainer from "./features/collection/CollectionContainer";
import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<PlantListContainer />} />
      <Route path="/tanaman/:id" element={<PlantDetail />} />
      <Route path="/koleksi" element={<CollectionContainer />} />
    </Routes>
  );
}

export default App;
