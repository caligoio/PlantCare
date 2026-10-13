import usePlants from "./usePlants";
import useCollection from "./features/collection/useCollection";
import PlantCard from "./PlantCard";
import "./Catalog.css";

// Halaman katalog: ambil data dari hook, lalu tampilkan satu kartu per tanaman.
// useCollection dipanggil SEKALI di sini, lalu fungsinya dikirim lewat props,
// supaya state koleksi tidak terduplikasi di setiap kartu.
export default function PlantListContainer() {
  const { plants } = usePlants();
  const { collection, addToCollection } = useCollection();

  const countOwned = (plantId) =>
    collection.filter((item) => item.plantId === plantId).length;

  return (
    <section className="catalog">
      <h1>Katalog Tanaman</h1>
      <div className="plant-grid">
        {plants.map((plant) => (
          <PlantCard
            key={plant.id}
            plant={plant}
            onAdd={addToCollection}
            ownedCount={countOwned(plant.id)}
          />
        ))}
      </div>
    </section>
  );
}
