import { Link } from "react-router-dom";

// Satu kartu tanaman. Data tanaman diterima lewat props.
export default function PlantCard({ plant }) {
  return (
    <div className="plant-card">
      <div className="plant-emoji">{plant.emoji}</div>
      <h3>{plant.name}</h3>
      <p>Perawatan: {plant.care}</p>
      <p>Cahaya: {plant.light}</p>
      <p>Siram tiap {plant.wateringIntervalDays} hari</p>
      <Link to={`/tanaman/${plant.id}`}>Lihat detail</Link>
    </div>
  );
}
