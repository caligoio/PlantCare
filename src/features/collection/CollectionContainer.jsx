import { Link } from "react-router-dom";
import useCollection from "./useCollection";
import plantsData from "../catalog/plantsData"; // data milik Orang 1
import CollectionCard from "./CollectionCard";
import WateringSchedule from "./WateringSchedule";
import { isDueToday } from "./wateringUtils";
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

  const dueCount = items.filter(
    (item) =>
      item.plant &&
      isDueToday(item.lastWatered, item.plant.wateringIntervalDays)
  ).length;

  if (collection.length === 0) {
    return (
      <section className="collection">
        <header className="collection__header">
          <h2>Koleksi Saya</h2>
          <p>Pantau jadwal siram dan perawatan tanamanmu di sini.</p>
        </header>
        <div className="collection__empty">
          <div className="collection__empty-emoji" aria-hidden="true">
            🪴
          </div>
          <h3>Koleksimu masih kosong</h3>
          <p>Pilih tanaman dari katalog untuk mulai merawatnya.</p>
          <Link to="/" className="btn btn--primary">
            Jelajahi katalog
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="collection">
      <header className="collection__header">
        <h2>Koleksi Saya</h2>
        <p>Pantau jadwal siram dan perawatan tanamanmu di sini.</p>
      </header>

      <div className="stats">
        <div className="stat">
          <span className="stat__value">{items.length}</span>
          <span className="stat__label">Total tanaman</span>
        </div>
        <div className={`stat${dueCount > 0 ? " stat--alert" : ""}`}>
          <span className="stat__value">{dueCount}</span>
          <span className="stat__label">Perlu disiram hari ini</span>
        </div>
      </div>

      <WateringSchedule
        items={items}
        onWatered={markAsWatered}
        onRemove={removeFromCollection}
      />

      <section className="collection__section">
        <h3 className="collection__heading">
          Semua koleksi
          <span className="badge">{items.length}</span>
        </h3>
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
      </section>
    </section>
  );
}
