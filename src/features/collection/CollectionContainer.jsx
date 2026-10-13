import { Link } from "react-router-dom";
import useCollection, { isDueToday } from "./useCollection";
import usePlants from "../../hooks/usePlants"; // hook milik Orang 1
import CollectionCard from "./CollectionCard";
import "./Collection.css";

// Komponen container: mengambil data, menggabungkan, lalu menyerahkan
// ke CollectionCard untuk ditampilkan (Container-Presenter Pattern).
export default function CollectionContainer() {
  const { collection, removeFromCollection, markAsWatered } = useCollection();
  const { plants } = usePlants(); // ASUMSI: mengembalikan { plants: [...] }

  // Gabungkan item koleksi dengan data tanaman (berdasarkan plantId)
  const items = collection.map((entry) => ({
    ...entry,
    plant: plants.find((p) => p.id === entry.plantId),
  }));

  const dueToday = items.filter(
    (item) => item.plant && isDueToday(item.lastWatered, item.plant.wateringIntervalDays)
  );
  const others = items.filter((item) => !dueToday.includes(item));

  const renderCards = (list) =>
    list.map((item) => (
      <CollectionCard
        key={item.id}
        item={item}
        onWatered={markAsWatered}
        onRemove={removeFromCollection}
      />
    ));

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

      <div className="collection__section">
        <h3>Perlu disiram hari ini ({dueToday.length})</h3>
        {dueToday.length > 0 ? (
          <div className="collection__grid">{renderCards(dueToday)}</div>
        ) : (
          <p>Semua tanaman sudah tercukupi airnya hari ini.</p>
        )}
      </div>

      {others.length > 0 && (
        <div className="collection__section">
          <h3>Semua koleksi</h3>
          <div className="collection__grid">{renderCards(others)}</div>
        </div>
      )}
    </section>
  );
}
