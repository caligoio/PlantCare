import { Link } from "react-router-dom";
import { daysUntilWatering, formatDate } from "./wateringUtils";

// Komponen presentasi: hanya menampilkan data & memanggil callback dari props.
// Props:
//  item        -> { id, plantId, nickname, lastWatered, plant }
//  onWatered   -> (id) => void
//  onRemove    -> (id) => void
export default function CollectionCard({ item, onWatered, onRemove }) {
  const { id, nickname, lastWatered, plant } = item;
  const plantName = plant?.name ?? "Tanaman tidak ditemukan";
  const title = nickname || plantName;
  const interval = plant?.wateringIntervalDays;
  const daysLeft = plant ? daysUntilWatering(lastWatered, interval) : null;

  // Status jadwal: menentukan teks dan warna label
  let status = null;
  if (daysLeft !== null) {
    if (daysLeft < 0) {
      status = { text: `Terlambat ${Math.abs(daysLeft)} hari`, tone: "danger" };
    } else if (daysLeft === 0) {
      status = { text: "Siram hari ini", tone: "warn" };
    } else {
      status = { text: `Siram ${daysLeft} hari lagi`, tone: "ok" };
    }
  }

  // Progres siklus penyiraman (0% = baru disiram, 100% = waktunya siram)
  const progress = plant
    ? Math.min(100, Math.max(0, ((interval - daysLeft) / interval) * 100))
    : 0;

  const handleRemove = () => {
    if (window.confirm(`Hapus "${title}" dari koleksi?`)) onRemove(id);
  };

  const needsWater = status && status.tone !== "ok";

  return (
    <article
      className={`collection-card${needsWater ? " collection-card--due" : ""}`}
    >
      <header className="collection-card__header">
        <div className="collection-card__emoji" aria-hidden="true">
          {plant?.emoji ?? "🪴"}
        </div>
        <div>
          <h3 className="collection-card__title">{title}</h3>
          {nickname && <p className="collection-card__species">{plantName}</p>}
        </div>
      </header>

      {plant && (
        <ul className="collection-card__chips">
          <li className="chip">
            <span aria-hidden="true">☀️</span> Cahaya {plant.light}
          </li>
          <li className="chip">
            <span aria-hidden="true">🌿</span> Perawatan {plant.care}
          </li>
          <li className="chip">
            <span aria-hidden="true">💧</span> Tiap {interval} hari
          </li>
        </ul>
      )}

      <div className="collection-card__schedule">
        {status && (
          <span className={`pill pill--${status.tone}`}>{status.text}</span>
        )}
        <p className="collection-card__date">
          Terakhir disiram: {formatDate(lastWatered)}
        </p>
        {plant && (
          <div className="progress" aria-hidden="true">
            <div
              className={`progress__fill${needsWater ? " progress__fill--due" : ""}`}
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>

      <div className="collection-card__actions">
        <button
          type="button"
          className="btn btn--primary btn--full"
          onClick={() => onWatered(id)}
        >
          <span aria-hidden="true">💧</span> Sudah disiram
        </button>
        {plant && (
          <Link to={`/tanaman/${plant.id}`} className="btn btn--outline">
            Lihat detail
          </Link>
        )}
        <button type="button" className="btn btn--ghost" onClick={handleRemove}>
          Hapus
        </button>
      </div>
    </article>
  );
}
