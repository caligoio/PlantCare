import usePlants from "./usePlants";
import useCollection from "../collection/useCollection";
import useAuth from "../auth/useAuth";
import PlantCard from "./PlantCard";
import "./Catalog.css";
import ThemeToggle from "../theme/ThemeToggle";

// Halaman katalog: ambil data dari hook, lalu tampilkan satu kartu per tanaman.
// useCollection dipanggil SEKALI di sini, lalu fungsinya dikirim lewat props,
// supaya state koleksi tidak terduplikasi di setiap kartu.
export default function PlantListContainer() {
  // Semua hook dipanggil di atas, sebelum return bersyarat
  const { plants, loading, error, reload } = usePlants();
  const { collection, addToCollection } = useCollection();
  const { user, loading: authLoading } = useAuth();

  // Keadaan sedang memuat dan gagal memuat (data kini datang dari API)
  if (loading) {
    return (
      <section className="cat-page">
        <p role="status">Memuat katalog…</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="cat-page">
        <p role="alert">{error}</p>
        <button type="button" onClick={reload}>
          Coba lagi
        </button>
      </section>
    );
  }

  // Berapa kali tanaman ini ada di koleksi (selalu 0 kalau belum login)
  const countOwned = (plantId) =>
    user ? collection.filter((item) => item.plantId === plantId).length : 0;

  const easyCount = plants.filter((p) => p.care === "Mudah").length;

  return (
    <section className="cat-page">
      <div className="cat-topbar cat-topbar--end">
        <ThemeToggle />
      </div>

      <header className="cat-header">
        <h2>Katalog Tanaman</h2>
        <p>Pilih tanaman, lihat kebutuhan cahaya dan jadwal siramnya.</p>
      </header>

      <div className="cat-stats">
        <div className="cat-stat">
          <span className="cat-stat__value">{plants.length}</span>
          <span className="cat-stat__label">Total tanaman</span>
        </div>
        <div className="cat-stat">
          <span className="cat-stat__value">{easyCount}</span>
          <span className="cat-stat__label">Mudah dirawat</span>
        </div>
      </div>

      <h3 className="cat-heading">
        Semua tanaman <span className="cat-badge">{plants.length}</span>
      </h3>
      <div className="cat-grid">
        {plants.map((plant) => (
          <PlantCard
            key={plant.id}
            plant={plant}
            onAdd={user ? addToCollection : undefined}
            loginRequired={!authLoading && !user}
            ownedCount={countOwned(plant.id)}
          />
        ))}
      </div>
    </section>
  );
}