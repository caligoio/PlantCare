import { Link } from "react-router-dom";

// Mengubah tingkat perawatan menjadi nama warna label (ok / warn / danger)
export function careTone(care) {
  const map = { Mudah: "ok", Sedang: "warn", Sulit: "danger" };
  return map[care] ?? "ok";
}

// Satu kartu tanaman di katalog.
//  plant      -> data tanaman
//  onAdd      -> (plantId) => void, dipanggil saat tombol ditekan
//  ownedCount -> jumlah tanaman ini yang sudah ada di koleksi
export default function PlantCard({ plant, onAdd, ownedCount = 0 }) {
  return (
    <article className="cat-card">
      <div className="cat-card__header">
        <div className="cat-card__emoji" aria-hidden="true">
          {plant.emoji}
        </div>
        <div>
          <h3 className="cat-card__title">{plant.name}</h3>
          <span className={`cat-pill cat-pill--${careTone(plant.care)}`}>
            Perawatan {plant.care.toLowerCase()}
          </span>
        </div>
      </div>

      <p className="cat-card__desc">{plant.description}</p>

      <ul className="cat-chips">
        <li className="cat-chip">☀️ Cahaya {plant.light.toLowerCase()}</li>
        <li className="cat-chip">💧 Tiap {plant.wateringIntervalDays} hari</li>
        {ownedCount > 0 && (
          <li className="cat-pill cat-pill--ok" role="status">
            ✓ Di koleksimu: {ownedCount}
          </li>
        )}
      </ul>

      <div className="cat-card__actions">
        {onAdd && (
          <button
            type="button"
            className="cat-btn cat-btn--primary cat-btn--full"
            onClick={() => onAdd(plant.id)}
          >
            Tambah ke koleksi
          </button>
        )}
        <Link
          to={`/tanaman/${plant.id}`}
          className="cat-btn cat-btn--outline cat-btn--full"
        >
          Lihat detail
        </Link>
      </div>
    </article>
  );
}