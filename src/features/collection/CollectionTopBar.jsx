import { Link } from "react-router-dom";
import ThemeToggle from "../theme/ThemeToggle";

// Baris atas halaman koleksi: tombol kembali ke katalog dan toggle tema.
export default function CollectionTopBar() {
  return (
    <div className="collection__topbar">
      <Link to="/" className="btn btn--outline">
        <span aria-hidden="true">←</span> Kembali ke katalog
      </Link>
      <ThemeToggle />
    </div>
  );
}
