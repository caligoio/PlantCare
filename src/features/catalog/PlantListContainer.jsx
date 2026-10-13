import usePlants from "./usePlants";
import PlantCard from "./PlantCard";
import "./Catalog.css";

// Halaman katalog: ambil data dari hook, lalu tampilkan satu kartu per tanaman.
export default function PlantListContainer() {
  const { plants } = usePlants();

  return (
    <section className="catalog">
      <h1>Katalog Tanaman</h1>
      <div className="plant-grid">
        {plants.map((plant) => (
          <PlantCard key={plant.id} plant={plant} />
        ))}
      </div>
    </section>
  );
}
