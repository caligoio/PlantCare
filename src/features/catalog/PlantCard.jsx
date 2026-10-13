import { Link } from "react-router-dom";

// Satu kartu tanaman (presenter). Data dan aksi diterima lewat props.
//  plant      -> data tanaman
//  onAdd      -> (plantId) => void, dipanggil saat tombol ditekan
//  ownedCount -> jumlah tanaman ini yang sudah ada di koleksi
export default function PlantCard({ plant, onAdd, ownedCount = 0 }) {
  return (
    <div className="plant-card">
      <div className="plant-emoji">{plant.emoji}</div>
      <h3>{plant.name}</h3>
      <p>Perawatan: {plant.care}</p>
      <p>Cahaya: {plant.light}</p>
      <p>Siram tiap {plant.wateringIntervalDays} hari</p>
      <Link to={`/tanaman/${plant.id}`}>Lihat detail</Link>

      {onAdd && (
        <div className="plant-card__add">
          <button type="button" onClick={() => onAdd(plant.id)}>
            Tambah ke koleksi
          </button>
          {ownedCount > 0 && (
            <p className="plant-owned" role="status">
              ✓ Di koleksimu: {ownedCount}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
