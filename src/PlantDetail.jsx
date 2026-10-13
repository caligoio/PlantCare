import { useParams, Link } from "react-router-dom";
import usePlants from "./features/catalog/usePlants";
import "./features/catalog/Catalog.css";

export default function PlantDetail() {
  // 1. Ambil "id" dari alamat URL, contoh: /tanaman/3 -> id = "3"
  const { id } = useParams();

  // 2. Ambil semua tanaman dari hook yang sudah kamu buat
  //    (sesuaikan kalau usePlants kamu mengembalikan bentuk lain)
  const { plants } = usePlants();

  // 3. Cari tanaman yang id-nya cocok.
  //    id dari URL itu string, jadi diubah ke angka dengan Number()
  const plant = plants.find((p) => p.id === Number(id));

  // 4. Kalau tidak ketemu (misalnya URL salah), tampilkan pesan
  if (!plant) {
    return (
      <div>
        <p>Tanaman tidak ditemukan.</p>
        <Link to="/">← Kembali ke katalog</Link>
      </div>
    );
  }

  // 5. Kalau ketemu, tampilkan detailnya
  return (
    <div className="plant-detail">
      <Link to="/">← Kembali ke katalog</Link>

      <h1>{plant.name}</h1>

      <div className="plant-emoji">{plant.emoji}</div>

      {plant.description && <p>{plant.description}</p>}

      <ul>
        <li>Siram setiap {plant.wateringIntervalDays} hari</li>
        {plant.light && <li>Kebutuhan cahaya: {plant.light}</li>}
        {plant.care && <li>Tingkat perawatan: {plant.care}</li>}
      </ul>
    </div>
  );
}
