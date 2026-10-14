import { useParams, Link } from "react-router-dom";
import usePlants from "./features/catalog/usePlants";
import { careTone } from "./features/catalog/PlantCard";
import "./features/catalog/Catalog.css";
import ThemeToggle from "./features/theme/ThemeToggle";

export default function PlantDetail() {
  // Ambil "id" dari alamat URL, contoh: /tanaman/3 -> id = "3"
  const { id } = useParams();
  const { plants } = usePlants();

  // id dari URL itu string, jadi diubah ke angka dengan Number()
  const plant = plants.find((p) => p.id === Number(id));

  if (!plant) {
    return (
      <section className="cat-page">
        <div className="cat-empty">
          <h2>Tanaman tidak ditemukan</h2>
          <p>Alamat yang kamu buka tidak cocok dengan tanaman mana pun.</p>
          <Link to="/" className="cat-btn cat-btn--primary">
            Kembali ke katalog
          </Link>
        </div>
      </section>
    );
  }

  return (
    <article className="cat-page">
      <div className="cat-topbar">
        <Link to="/" className="cat-btn cat-btn--outline">
          ← Kembali ke katalog
        </Link>
         <ThemeToggle />
      </div>

      <div className="cat-detail">
        <div className="cat-detail__emoji" aria-hidden="true">
          {plant.emoji}
        </div>
        <div>
          <h2>{plant.name}</h2>
          <span className={`cat-pill cat-pill--${careTone(plant.care)}`}>
            Perawatan {plant.care.toLowerCase()}
          </span>
        </div>
      </div>

      <p className="cat-detail__desc">{plant.description}</p>

      <div className="cat-stats">
        <div className="cat-stat">
          <span className="cat-stat__value cat-stat__value--text">
            Setiap {plant.wateringIntervalDays} hari
          </span>
          <span className="cat-stat__label">Jadwal siram</span>
        </div>
        <div className="cat-stat">
          <span className="cat-stat__value cat-stat__value--text">
            {plant.light}
          </span>
          <span className="cat-stat__label">Kebutuhan cahaya</span>
        </div>
        <div className="cat-stat">
          <span className="cat-stat__value cat-stat__value--text">
            {plant.care}
          </span>
          <span className="cat-stat__label">Tingkat perawatan</span>
        </div>
      </div>
    </article>
  );
}
