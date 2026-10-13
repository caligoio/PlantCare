import { Link } from "react-router-dom";
import useCollection from "./useCollection";
import usePlants from "../../hooks/usePlants"; // hook milik Orang 1
import CollectionCard from "./CollectionCard";
import WateringSchedule from "./WateringSchedule";
import "./Collection.css";

// Komponen container: mengambil data, menggabungkan, lalu menyerahkan
// ke komponen presentasi (Container-Presenter Pattern).
export default function CollectionContainer() {
  const { collection, removeFromCollection, markAsWatered } = useCollection();
  const { plants } = usePlants(); // ASUMSI: mengembalikan { plants: [...] }

  // Gabungkan item koleksi dengan data tanaman (berdasarkan plantId)
  const items = collection.map((entry) => ({
    ...entry,
    plant: plants.find((p) => p.id === entry.plantId),
  }));

  if (collection.length === 0) {
    return (
      <section className="collection">
        <h2>Koleksi Saya</h2>
        <p>Koleksimu masih kosong. Pilih tanaman dari katalog untuk mulai merawat.</p>
        <Link to="/">Buka katalog</Link>
      </section>
    );
  }

  return (
    <section className="collection">
      <h2>Koleksi Saya</h2>

      <WateringSchedule
        items={items}
        onWatered={markAsWatered}
        onRemove={removeFromCollection}
      />

      <div className="collection__section">
        <h3>Semua koleksi ({items.length})</h3>
        <div className="collection__grid">
          {items.map((item) => (
            <CollectionCard
              key={item.id}
              item={item}
              onWatered={markAsWatered}
              onRemove={removeFromCollection}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
