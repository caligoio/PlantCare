import { Link } from "react-router-dom";
import useCollection from "./useCollection";
import plantsData from "../catalog/plantsData"; // data milik Orang 1 (sesuaikan path)
import CollectionCard from "./CollectionCard";
import WateringSchedule from "./WateringSchedule";
import "./Collection.css";

// Komponen container: mengambil data, menggabungkan, lalu menyerahkan
// ke komponen presentasi (Container-Presenter Pattern).
export default function CollectionContainer() {
  const { collection, removeFromCollection, markAsWatered } = useCollection();

  // Gabungkan item koleksi dengan data tanaman (berdasarkan plantId)
  const items = collection.map((entry) => ({
    ...entry,
    plant: plantsData.find((p) => p.id === entry.plantId),
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
