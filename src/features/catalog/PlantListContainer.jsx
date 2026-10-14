import usePlants from "./usePlants";
import useCollection from "../collection/useCollection";
import PlantCard from "./PlantCard";
import "./Catalog.css";

// Halaman katalog: ambil data dari hook, lalu tampilkan satu kartu per tanaman.
export default function PlantListContainer() {
  const { plants } = usePlants();

  // Hook koleksi dipanggil SEKALI di sini, lalu dibagikan ke semua kartu.
  // (Kalau dipanggil di tiap kartu, datanya bisa saling menimpa.)
  const { collection, addToCollection } = useCollection();
  const ownedIds = new Set(collection.map((item) => item.plantId));

  const easyCount = plants.filter((p) => p.care === "Mudah").length;

  return (
    <section className="cat-page">
      <header className="cat-header">
        <h2>Katalog Tanaman</h2>
        <p>Pilih tanaman, lihat kebutuhan cahaya dan jadwal siramnya.</p>
      </header>

      <div className="cat-stats">
        <div className="cat-stat">
          <span className="cat-stat__value">{plants.length}</span>
          <span className="cat-stat__label">Total tanaman</span>
        </div>
        <div className="cat-stat">
          <span className="cat-stat__value">{easyCount}</span>
          <span className="cat-stat__label">Mudah dirawat</span>
        </div>
      </div>

      <h3 className="cat-heading">
        Semua tanaman <span className="cat-badge">{plants.length}</span>
      </h3>
      <div className="cat-grid">
        {plants.map((plant) => (
          <PlantCard
            key={plant.id}
            plant={plant}
            onAdd={addToCollection}
            owned={ownedIds.has(plant.id)}
          />
        ))}
      </div>
    </section>
  );
}
